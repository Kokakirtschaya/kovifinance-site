/* eslint-disable @typescript-eslint/no-require-imports -- Node tests in this project use CommonJS. */
const assert = require("node:assert/strict");
const { AsyncLocalStorage } = require("node:async_hooks");
const { test } = require("node:test");
const load = require("./helpers/load-ts.cjs");

const messages = load("lib/auth-messages.ts");

async function harness({ allowed = true, broken = false, smtp = false } = {}) {
  const { Auth, raw, skipCSRFCheck } = await import("@auth/core");
  const { AuthError } = await import("@auth/core/errors");
  const context = new AsyncLocalStorage();
  const calls = { limits: [], mail: [], tokens: [] };
  const adapter = {};
  for (const method of [
    "createUser", "getUser", "getUserByEmail", "getUserByAccount", "updateUser",
    "linkAccount", "createSession", "getSessionAndUser", "updateSession", "deleteSession",
    "useVerificationToken",
  ]) adapter[method] = async () => null;
  adapter.createVerificationToken = async (token) => { calls.tokens.push(token); return token; };

  let config;
  load("auth.ts", {
    "next-auth": { default: (value) => { config = value; return {}; } },
    "@auth/prisma-adapter": { PrismaAdapter: () => adapter },
    nodemailer: { default: {
      createTransport: () => ({ sendMail: async (mail) => { calls.mail.push(mail); return {}; } }),
      getTestMessageUrl: () => false,
    } },
    "next/headers": { headers: async () => context.getStore() },
    "@/lib/prisma": { prisma: {} },
    "@/lib/auth-rate-limit": { allowMagicLink: async (email, headers) => {
      calls.limits.push({ email, ip: headers.get("x-forwarded-for") });
      if (broken) throw new Error("Database unavailable");
      return allowed;
    } },
  }, {
    process: { env: smtp ? { SMTP_HOST: "smtp.example.invalid" } : { UNISENDER_API_KEY: "test-only" } },
    fetch: async (_url, options) => {
      calls.mail.push(JSON.parse(options.body));
      return Response.json({ status: "success" });
    },
  });
  config = {
    ...config, basePath: "/api/auth", trustHost: true, secret: "test-only-auth-secret",
    logger: { error() {}, warn() {}, debug() {} },
  };
  const ip = "192.0.2.10";
  const direct = (request) => context.run(request.headers, () => Auth(request, config));
  const routes = load("app/api/auth/[...nextauth]/route.ts", {
    "@/auth": { handlers: { GET: direct, POST: direct } },
  });
  async function directRequest(email = "Fixture@Example.Invalid") {
    // Настоящая CSRF-проверка Auth.js: публичный путь без Server Action.
    const csrf = await routes.GET(new Request("https://kovi.example.invalid/api/auth/csrf"));
    const { csrfToken } = await csrf.json();
    const cookie = csrf.headers.getSetCookie().map((value) => value.split(";")[0]).join("; ");
    return routes.POST(new Request("https://kovi.example.invalid/api/auth/signin/email", {
      method: "POST",
      headers: { cookie, "content-type": "application/x-www-form-urlencoded", "x-forwarded-for": ip },
      body: new URLSearchParams({ email, csrfToken, callbackUrl: "https://kovi.example.invalid/lk" }),
    }));
  }
  const { requestMagicLink } = load("app/lk/actions.ts", {
    "next-auth": { AuthError },
    "next/navigation": { redirect: (url) => { throw Object.assign(new Error("redirect"), { destination: url }); } },
    "@/lib/auth-messages": messages,
    "@/auth": { signIn: async (_provider, options) => {
      assert.equal(options.redirect, false);
      // Те же raw/skipCSRFCheck, которые использует серверный signIn NextAuth.
      const request = new Request("https://kovi.example.invalid/api/auth/signin/email", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded", "x-forwarded-for": ip },
        body: new URLSearchParams({ email: options.email, callbackUrl: "https://kovi.example.invalid/lk" }),
      });
      const response = await context.run(request.headers, () => Auth(request, { ...config, raw, skipCSRFCheck }));
      return response.redirect;
    } },
  });
  return { calls, config, directRequest, requestMagicLink };
}

for (const path of ["direct", "action"]) {
  test(`${path}: exhausted limit stops both token creation and email delivery`, async () => {
    const h = await harness({ allowed: false });
    if (path === "direct") {
      const response = await h.directRequest();
      assert.equal(new URL(response.headers.get("location")).searchParams.get("error"), "rate_limit");
    } else {
      const result = await h.requestMagicLink(" Fixture@Example.Invalid ", true);
      assert.equal(result.error, messages.loginErrorMessage("rate_limit"));
    }
    assert.equal(h.calls.mail.length, 0);
    assert.equal(h.calls.tokens.length, 0);
    assert.deepEqual(h.calls.limits, [{ email: "fixture@example.invalid", ip: "192.0.2.10" }]);
  });

  test(`${path}: a database failure blocks sending and shows a retry message`, async () => {
    const h = await harness({ broken: true });
    if (path === "direct") {
      const response = await h.directRequest();
      assert.equal(new URL(response.headers.get("location")).searchParams.get("error"), "unavailable");
    } else {
      assert.equal((await h.requestMagicLink("fixture@example.invalid", true)).error, messages.LOGIN_UNAVAILABLE);
    }
    assert.equal(h.calls.mail.length, 0);
    assert.equal(h.calls.tokens.length, 0);
  });

  for (const smtp of [false, true]) {
    test(`${path}: allowed ${smtp ? "SMTP" : "HTTP"} delivery consumes the limit exactly once`, async () => {
      const h = await harness({ smtp });
      if (path === "direct") {
        const response = await h.directRequest();
        assert.equal(new URL(response.headers.get("location")).pathname, "/api/auth/verify-request");
      } else {
        await assert.rejects(h.requestMagicLink("fixture@example.invalid", true), (error) => {
          assert.equal(new URL(error.destination).pathname, "/api/auth/verify-request");
          return true;
        });
      }
      assert.equal(h.calls.limits.length, 1);
      assert.equal(h.calls.mail.length, 1);
      assert.equal(h.calls.tokens.length, 1);
    });
  }
}

test("consent and empty-address rejection happen before requesting a link", async () => {
  const h = await harness();
  assert.ok((await h.requestMagicLink("fixture@example.invalid", false)).error);
  assert.ok((await h.requestMagicLink(null, true)).error);
  assert.equal(h.calls.limits.length + h.calls.mail.length + h.calls.tokens.length, 0);
});

test("opening an issued link is not blocked by the sending limit", async () => {
  const h = await harness({ allowed: false });
  assert.equal(await h.config.callbacks.signIn({ user: { email: "fixture@example.invalid" }, email: { verificationRequest: false } }), true);
  assert.equal(h.calls.limits.length, 0);
});

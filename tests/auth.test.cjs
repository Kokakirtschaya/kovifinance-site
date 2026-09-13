/* eslint-disable @typescript-eslint/no-require-imports -- Node tests in this project use CommonJS. */
const assert = require("node:assert/strict");
const { AsyncLocalStorage } = require("node:async_hooks");
const { test } = require("node:test");
const { format } = require("node:util");
const load = require("./helpers/load-ts.cjs");

const messages = load("lib/auth-messages.ts");

async function harness({ allowed = true, broken = false, smtp = false, env, delivery = "success", preview = false } = {}) {
  const { Auth, raw, skipCSRFCheck } = await import("@auth/core");
  const { AuthError } = await import("@auth/core/errors");
  const context = new AsyncLocalStorage();
  const calls = { limits: [], mail: [], tokens: [], logs: [], previews: 0 };
  const adapter = {};
  for (const method of [
    "createUser", "getUser", "getUserByEmail", "getUserByAccount", "updateUser",
    "linkAccount", "createSession", "getSessionAndUser", "updateSession", "deleteSession",
    "useVerificationToken",
  ]) adapter[method] = async () => null;
  adapter.createVerificationToken = async (token) => { calls.tokens.push(token); return token; };

  let config;
  load("auth.ts", {
    "next-auth": { AuthError, default: (value) => { config = value; return {}; } },
    "@auth/prisma-adapter": { PrismaAdapter: () => adapter },
    nodemailer: { default: {
      createTransport: () => ({ sendMail: async (mail) => {
        calls.mail.push(mail);
        if (delivery === "smtp_error") throw new Error(JSON.stringify(mail));
        return {};
      } }),
      getTestMessageUrl: () => { calls.previews++; return preview; },
    } },
    "next/headers": { headers: async () => context.getStore() },
    "@/lib/prisma": { prisma: {} },
    "@/lib/auth-rate-limit": { allowMagicLink: async (email, headers) => {
      calls.limits.push({ email, ip: headers.get("x-forwarded-for") });
      if (broken) throw new Error("Database unavailable");
      return allowed;
    } },
  }, {
    process: { env: env ?? { NODE_ENV: "production", ...(smtp ? { SMTP_HOST: "smtp.example.invalid" } : { UNISENDER_API_KEY: "test-only" }) } },
    console: Object.fromEntries(["log", "warn", "error"].map(level => [level, (...args) => calls.logs.push(format(...args))])),
    fetch: async (_url, options) => {
      const mail = JSON.parse(options.body);
      calls.mail.push(mail);
      if (delivery === "network_error") throw new Error(options.body);
      if (delivery === "http_error") return Response.json({ status: "error", details: mail }, { status: 502 });
      if (delivery === "rejected") return Response.json({ status: "error", details: mail });
      if (delivery === "recipient_rejected") return Response.json({ status: "success", failed_emails: { "fixture@example.invalid": mail } });
      return Response.json({ status: "success" });
    },
  });
  config = {
    ...config, basePath: "/api/auth", trustHost: true, secret: "test-only-auth-secret",
    logger: config.logger ?? { error() {}, warn() {}, debug() {} },
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
      return (response instanceof Response ? response.headers.get("Location") : response.redirect) ?? request.url;
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
      const h = await harness({ smtp, preview: "https://ethereal.email/message/synthetic-preview" });
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
      assert.equal(h.calls.previews, 0);
      assert.equal(h.calls.logs.length, 0);
    });
  }

  test(`${path}: missing email transport fails closed before issuing a token outside development`, async () => {
    for (const env of [{ NODE_ENV: "production" }, { NODE_ENV: "test" }, {}, { NODE_ENV: "production", UNISENDER_API_KEY: "  ", SMTP_HOST: "  " }]) {
      const h = await harness({ env });
      if (path === "direct") {
        const response = await h.directRequest();
        const destination = new URL(response.headers.get("location"));
        assert.equal(destination.pathname, "/lk");
        assert.equal(destination.searchParams.get("error"), "unavailable");
      } else {
        assert.equal((await h.requestMagicLink("fixture@example.invalid", true)).error, messages.LOGIN_UNAVAILABLE);
      }
      assert.equal(h.calls.mail.length + h.calls.tokens.length + h.calls.limits.length, 0);
      assert.deepEqual(h.calls.logs, ["AUTH_EMAIL_UNCONFIGURED"]);
    }
  });

  for (const delivery of ["http_error", "rejected", "recipient_rejected", "network_error", "smtp_error"]) {
    test(`${path}: ${delivery} returns an error without logging the email or login token`, async () => {
      const h = await harness({ delivery, smtp: delivery === "smtp_error" });
      let result;
      if (path === "direct") {
        const response = await h.directRequest();
        result = response.headers.get("location");
        const destination = new URL(result);
        assert.equal(destination.pathname, "/lk");
        assert.ok(destination.searchParams.get("error"));
      } else {
        result = await h.requestMagicLink("fixture@example.invalid", true);
        assert.equal(result.error, messages.LOGIN_UNAVAILABLE);
      }
      assert.equal(h.calls.mail.length, 1);
      const mail = h.calls.mail[0];
      const link = new URL((mail.text ?? mail.message.body.plaintext).split("\n")[1]);
      const output = h.calls.logs.join("\n") + JSON.stringify(result);
      for (const value of [link.href, link.searchParams.get("token"), "fixture@example.invalid", "fixture%40example.invalid", "test-only", "token="])
        assert.ok(!output.includes(value), `Sensitive authentication data leaked: ${value}`);
      assert.match(h.calls.logs.join("\n"), /AUTH_EMAIL_(HTTP_REJECTED|RECIPIENT_REJECTED|HTTP_UNREACHABLE|SMTP_FAILED)/);
    });
  }
}

const syntheticLink = "https://kovi.example.invalid/api/auth/callback/email?token=synthetic-private-token&email=fixture%40example.invalid";

test("email provider itself rejects an unconfigured production transport without logging a link", async () => {
  const h = await harness({ env: { NODE_ENV: "production" } });
  await assert.rejects(h.config.providers[0].sendVerificationRequest({ identifier: "fixture@example.invalid", url: syntheticLink }), { message: "AUTH_EMAIL_UNCONFIGURED" });
  assert.equal(h.calls.logs.length + h.calls.mail.length, 0);
});

test("development retains console links and Ethereal previews", async () => {
  const local = await harness({ env: { NODE_ENV: "development" } });
  await local.config.providers[0].sendVerificationRequest({ identifier: "fixture@example.invalid", url: syntheticLink });
  assert.ok(local.calls.logs.join("\n").includes(syntheticLink));
  assert.equal(local.calls.mail.length, 0);

  const preview = "https://ethereal.email/message/synthetic-private-preview";
  const smtp = await harness({ env: { NODE_ENV: "development", SMTP_HOST: "smtp.example.invalid" }, preview });
  await smtp.config.providers[0].sendVerificationRequest({ identifier: "fixture@example.invalid", url: syntheticLink });
  assert.ok(smtp.calls.logs.join("\n").includes(preview));
  assert.equal(smtp.calls.previews, 1);
});

test("production Auth.js logger omits messages, nested errors and debug metadata", async () => {
  const { AuthError } = await import("@auth/core/errors");
  const h = await harness();
  const sensitive = `${syntheticLink} fixture@example.invalid private-api-key`;
  h.config.logger.error(new Error(sensitive));
  h.config.logger.error(new AuthError(sensitive, { cause: { err: new Error(sensitive), url: syntheticLink } }));
  h.config.logger.debug("adapter_createVerificationToken", { token: sensitive, identifier: "fixture@example.invalid" });
  assert.equal(h.config.debug, false);
  assert.deepEqual(h.calls.logs, ["AUTH_ERROR Unknown", "AUTH_ERROR AuthError"]);
});

test("consent and empty-address rejection happen before requesting a link", async () => {
  const h = await harness();
  assert.ok((await h.requestMagicLink("fixture@example.invalid", false)).error);
  assert.ok((await h.requestMagicLink(null, true)).error);
  assert.equal(h.calls.limits.length + h.calls.mail.length + h.calls.tokens.length, 0);
});

test("opening an issued link is not blocked by the sending limit", async () => {
  const h = await harness({ allowed: false, env: { NODE_ENV: "production" } });
  assert.equal(await h.config.callbacks.signIn({ user: { email: "fixture@example.invalid" }, email: { verificationRequest: false } }), true);
  assert.equal(h.calls.limits.length, 0);
});

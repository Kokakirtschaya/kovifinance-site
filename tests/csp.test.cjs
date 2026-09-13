/* eslint-disable @typescript-eslint/no-require-imports -- Node tests in this project use CommonJS. */
const assert = require("node:assert/strict");
const { test } = require("node:test");
const { randomBytes } = require("node:crypto");
const { NextRequest, NextResponse } = require("next/server");
const { unstable_doesMiddlewareMatch: doesProxyMatch } = require("next/experimental/testing/server");
const load = require("./helpers/load-ts.cjs");

const csp = load("lib/csp.ts");
function middleware(environment = "production") {
  return load("proxy.ts", {
    "node:crypto": { randomBytes },
    "next/server": { NextRequest, NextResponse },
    "@/lib/csp": csp,
  }, { process: { env: { NODE_ENV: environment } } });
}
function directives(value) {
  return Object.fromEntries(value.split(";").map(part => {
    const [name, ...sources] = part.trim().split(/\s+/);
    return [name, sources];
  }));
}

test("CSP uses a fresh 128-bit nonce and overrides client-supplied policy headers", () => {
  const { proxy } = middleware();
  const nonces = new Set();
  for (let i = 0; i < 32; i++) {
    const response = proxy(new NextRequest("https://kovi.example.invalid/lk", { headers: {
      "x-nonce": "attacker-controlled",
      "Content-Security-Policy": "script-src 'unsafe-inline'",
      "Content-Security-Policy-Report-Only": "script-src *",
      cookie: "session=test-only",
    } }));
    const nonce = response.headers.get("x-middleware-request-x-nonce");
    const policy = response.headers.get("Content-Security-Policy");
    assert.equal(Buffer.from(nonce, "base64").length, 16);
    assert.ok(policy.includes(`'nonce-${nonce}'`));
    assert.equal(response.headers.get("x-middleware-request-content-security-policy"), policy);
    assert.equal(response.headers.get("x-middleware-request-content-security-policy-report-only"), null);
    assert.equal(response.headers.get("x-middleware-request-cookie"), "session=test-only");
    assert.match(response.headers.get("cache-control"), /private.*no-store/);
    nonces.add(nonce);
  }
  assert.equal(nonces.size, 32);
});

test("production blocks untrusted scripts, eval, external connections, frames and form targets", () => {
  const policy = directives(csp.contentSecurityPolicy(randomBytes(16).toString("base64")));
  assert.ok(policy["script-src"].includes("'strict-dynamic'"));
  for (const source of ["'unsafe-inline'", "'unsafe-eval'", "https:", "data:", "*"])
    assert.ok(!policy["script-src"].includes(source));
  assert.deepEqual(policy["script-src-attr"], ["'none'"]);
  for (const directive of ["connect-src", "font-src", "form-action"])
    assert.deepEqual(policy[directive], ["'self'"]);
  for (const directive of ["object-src", "frame-src", "frame-ancestors", "base-uri"])
    assert.deepEqual(policy[directive], ["'none'"]);
  assert.ok(Object.hasOwn(policy, "upgrade-insecure-requests"));
});

test("development permits HMR without weakening the production policy", () => {
  const { proxy } = middleware("development");
  const policy = directives(proxy(new NextRequest("http://localhost:3000/")).headers.get("Content-Security-Policy"));
  assert.ok(policy["script-src"].includes("'unsafe-eval'"));
  assert.ok(policy["connect-src"].includes("ws:"));
  assert.ok(!Object.hasOwn(policy, "upgrade-insecure-requests"));
});

test("CSP covers pages, unknown paths, Auth.js, RSC and prefetch but preserves asset caching", () => {
  const { config } = middleware();
  for (const url of ["/", "/lk", "/confidentiality", "/missing-page", "/missing.html", "/api/auth/signin/email", "/api/auth/callback/email"]) {
    for (const headers of [{}, { purpose: "prefetch", "next-router-prefetch": "1", rsc: "1" }])
      assert.equal(doesProxyMatch({ config, nextConfig: {}, url, headers }), true, url);
  }
  for (const url of ["/_next/static/chunk.js", "/_next/image", "/brand/logo-primary.svg", "/mood/services/image.jpg", "/icon.png", "/opengraph-image", "/robots.txt", "/sitemap.xml", "/api/lead", "/api/inn", "/api/build"])
    assert.equal(doesProxyMatch({ config, nextConfig: {}, url }), false, url);
});

test("invalid nonces cannot add directives to a CSP header", () => {
  for (const nonce of ["", "x'; script-src *", "abc\nX-Header: value", "attacker-controlled"])
    assert.throws(() => csp.contentSecurityPolicy(nonce), { message: "Invalid CSP nonce" });
});

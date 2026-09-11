const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const code = ts.transpileModule(
  fs.readFileSync(path.join(root, "lib/cookie-consent.ts"), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
).outputText;
const loaded = { exports: {} };
vm.runInNewContext(code, {
  module: loaded,
  exports: loaded.exports,
  require() { throw new Error("cookie-consent must not import runtime deps"); },
}, { filename: "lib/cookie-consent.ts" });
const consent = loaded.exports;

test("cookie notice cookie stores the policy version and ignores analytics leftovers", () => {
  const stored = consent.serializeConsent({ v: consent.COOKIE_POLICY_VERSION });
  const parsed = consent.parseConsent(stored);
  assert.equal(parsed.v, consent.COOKIE_POLICY_VERSION);
  assert.equal(consent.parseConsent(null), null);
  assert.equal(consent.parseConsent(""), null);
  assert.equal(consent.parseConsent("1"), null);
  assert.equal(consent.parseConsent(JSON.stringify({ v: "2026-09-11", a: 1 })), null);
  assert.equal(consent.COOKIE_CONSENT_MAX_AGE, 60 * 60 * 24 * 365);
});

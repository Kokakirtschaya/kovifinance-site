/* eslint-disable @typescript-eslint/no-require-imports -- Node tests in this project use CommonJS. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const { randomUUID } = require("node:crypto");
const ts = require("typescript");
const { NextResponse } = require("next/server");

const root = path.resolve(__dirname, "..");

// Исполняем настоящий TypeScript, подменяя только границы интеграций.
// Файлы .env не загружаются; любой неподменённый сетевой запрос запрещён.
function load(file, deps = {}, globals = {}) {
  const code = ts.transpileModule(fs.readFileSync(path.join(root, file), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const loaded = { exports: {} };
  vm.runInNewContext(code, {
    module: loaded,
    exports: loaded.exports,
    require(id) {
      assert.ok(Object.hasOwn(deps, id), `Unexpected dependency: ${id}`);
      return deps[id];
    },
    process: { env: {} },
    console: { log() {}, warn() {}, error() {} },
    AbortSignal,
    URL,
    fetch() { throw new Error("Network is disabled in lead tests"); },
    ...globals,
  }, { filename: file });
  return loaded.exports;
}

const inn = load("lib/inn.ts");
const site = load("lib/site.ts");
const validation = load("lib/lead-validation.ts", {
  "@/lib/inn": inn,
  "@/lib/site": site,
});
const crmTools = load("lib/crm.ts");
const notificationTools = load("lib/notify.ts", { "@/lib/crm": crmTools });
const crmIds = { dealId: "cm000000000000000000000001", companyId: "cm000000000000000000000002" };
const notice = {
  requestId: "00000000-0000-4000-8000-000000000001",
  savedToCrm: true,
  ...crmIds,
};
const fixture = {
  name: "Тестовая заявка",
  phone: "+7 (999) 000-00-00",
  email: "fixture@example.invalid",
  inn: "1234567894",
  product: site.SERVICES[0].title,
  pdConsent: true,
};

function leadRequest(body, raw = false) {
  return new Request("http://localhost/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: raw ? body : JSON.stringify(body),
  });
}

function handler({ crmOk = true, tgOk = true, lookup = { status: "unconfigured" }, allowed = true } = {}) {
  const calls = { crm: [], tg: [], tgText: [], lookup: [], logs: [] };
  const { POST } = load("app/api/lead/route.ts", {
    "next/server": { NextResponse },
    "node:crypto": { randomUUID },
    "@/lib/lead-validation": validation,
    "@/lib/crm": {
      createLead: async (body) => {
        calls.crm.push(body);
        return crmOk ? { ok: true, ...crmIds } : { ok: false };
      },
    },
    "@/lib/notify": {
      notifyTelegram: async (notification) => {
        calls.tg.push(notification);
        calls.tgText.push(notificationTools.formatLeadNotification(notification));
        return { ok: tgOk };
      },
    },
    "@/lib/checko": {
      lookupInn: async (value) => { calls.lookup.push(value); return lookup; },
    },
    "@/lib/rate-limit": {
      clientIpFromHeaders: () => "127.0.0.1", FIFTEEN_MIN: 900000, rateLimit: () => allowed,
    },
  }, {
    console: { log: (...args) => calls.logs.push(args.join(" ")) },
  });
  return { POST, calls };
}

test("valid lead is normalized; every current product and an unspecified product are accepted", () => {
  for (const product of [...site.SERVICES.map((s) => s.title), "Другое", ""]) {
    const result = validation.validateLead({ ...fixture, name: " Тест ", product, sum: 50000000 });
    assert.equal(result.ok, true);
    assert.equal(result.lead.name, "Тест");
    assert.equal(result.lead.phone, "+79990000000");
    assert.equal(result.lead.sum, "50000000");
  }
  for (const phone of ["9990000000", "89990000000", "+79990000000"]) {
    assert.equal(validation.validateLead({ ...fixture, phone }).ok, true);
  }
});

test("malformed JSON shapes and field types return 422 before any integration is called", async () => {
  const { POST, calls } = handler();
  const invalid = [null, [], 42, "text", true, {}];
  for (const field of Object.keys(validation.LEAD_LIMITS)) {
    for (const value of [null, 123, false, [], {}]) invalid.push({ ...fixture, [field]: value });
    invalid.push({ ...fixture, [field]: "x".repeat(validation.LEAD_LIMITS[field] + 1) });
  }
  for (const body of invalid) {
    const response = await POST(leadRequest(body));
    assert.equal(response.status, 422, JSON.stringify(body));
    assert.equal((await response.json()).ok, false);
  }
  assert.equal(calls.lookup.length + calls.crm.length + calls.tg.length, 0);
});

test("lead is rejected without explicit personal-data consent", async () => {
  for (const pdConsent of [undefined, false, "yes", 1, null]) {
    const result = validation.validateLead({ ...fixture, pdConsent });
    assert.equal(result.ok, false, JSON.stringify(pdConsent));
    assert.equal(result.error, "consent");
  }
  for (const pdConsent of [true, "on", "true", "1"]) {
    assert.equal(validation.validateLead({ ...fixture, pdConsent }).ok, true);
  }
  const { POST, calls } = handler();
  const withoutConsent = { ...fixture };
  delete withoutConsent.pdConsent;
  const response = await POST(leadRequest(withoutConsent));
  assert.equal(response.status, 422);
  assert.equal((await response.json()).error, "consent");
  assert.equal(calls.lookup.length + calls.crm.length + calls.tg.length, 0);
});

test("invalid contact, product, INN and unsafe numeric values are rejected", () => {
  for (const patch of [
    { name: " " }, { name: "Name\nInjected text" },
    { phone: "call +79990000000" }, { phone: "+19990000000" }, { phone: "123" },
    { phone: "+799900000001" }, { email: "no-at.invalid" }, { email: "x@y" },
    { inn: "0000000000" }, { inn: "000000000000" }, { inn: "12345678940" },
    { inn: "1234567895" }, { product: "Unsupported product" },
    { source: "homepage\nInjected text" }, { sum: -1 }, { sum: Infinity },
    { sum: Number.MAX_SAFE_INTEGER + 1 }, { sum: {} },
  ]) {
    assert.equal(validation.validateLead({ ...fixture, ...patch }).ok, false, JSON.stringify(patch));
  }
});

test("malformed JSON and rate limiting preserve their 400/429 contracts", async () => {
  const invalid = handler();
  assert.equal((await invalid.POST(leadRequest("{", true))).status, 400);
  const limited = handler({ allowed: false });
  assert.equal((await limited.POST(leadRequest(fixture))).status, 429);
  assert.equal(invalid.calls.lookup.length + limited.calls.lookup.length, 0);
});

for (const crmOk of [false, true]) {
  for (const tgOk of [false, true]) {
    test(`delivery outcome: CRM=${crmOk}, Telegram=${tgOk}`, async () => {
      const { POST, calls } = handler({ crmOk, tgOk });
      const response = await POST(leadRequest(fixture));
      const body = await response.json();
      assert.equal(response.status, crmOk ? 200 : 503);
      assert.equal(body.ok, crmOk);
      if (!body.ok) assert.equal(body.error, "delivery_failed");
      assert.match(body.requestId, /^[\da-f-]{36}$/);
      assert.equal(calls.crm.length, 1);
      assert.equal(calls.tg.length, 1);
      assert.equal(calls.tg[0].requestId, body.requestId);
      assert.equal(calls.tg[0].savedToCrm, crmOk);
      assert.ok(calls.tgText[0].includes(crmOk ? crmIds.dealId : body.requestId));
      assert.equal(calls.crm[0].phone, "+79990000000");
      const log = calls.logs.join("\n");
      for (const contact of [fixture.name, fixture.phone, fixture.email, fixture.inn]) {
        assert.ok(!log.includes(contact), `Contact data leaked into logs: ${contact}`);
      }
    });
  }
}

test("a Checko outage does not block a valid lead, but an absent organization does", async () => {
  for (const status of ["error", "unconfigured"]) {
    const { POST } = handler({ lookup: { status } });
    assert.equal((await POST(leadRequest(fixture))).status, 200);
  }
  const { POST, calls } = handler({ lookup: { status: "not_found", kind: "org" } });
  const response = await POST(leadRequest(fixture));
  assert.equal(response.status, 422);
  assert.equal((await response.json()).error, "inn_not_found");
  assert.equal(calls.crm.length + calls.tg.length, 0);
});

for (const crmOk of [true, false]) {
  test(`only technical metadata reaches Telegram when CRM=${crmOk}`, async () => {
    const company = "PRIVATE-COMPANY-NAME";
    const amount = "345678901";
    const source = "private-campaign-tag";
    const { POST, calls } = handler({ crmOk, lookup: { status: "found", name: company } });
    await POST(leadRequest({ ...fixture, price: amount, source }));
    assert.equal(calls.crm[0].company, company);
    assert.equal(calls.crm[0].amount, amount);
    assert.equal(calls.crm[0].source, source);
    const outgoing = JSON.stringify({ notices: calls.tg, text: calls.tgText, logs: calls.logs });
    for (const value of [fixture.name, fixture.phone, "+79990000000", fixture.email, fixture.inn, fixture.product, company, amount, source]) {
      assert.ok(!outgoing.includes(value), `Private lead field leaked: ${value}`);
    }
    const target = crmOk
      ? `${crmTools.CRM_PUBLIC_URL}/companies/${crmIds.companyId}`
      : `${crmTools.CRM_PUBLIC_URL}/deals`;
    assert.ok(calls.tgText[0].includes(target));
    if (!crmOk) assert.ok(calls.tgText[0].includes("Пользователю предложено повторить отправку"));
  });
}

test("legacy landing fields still reach CRM", async () => {
  const { POST, calls } = handler();
  await POST(leadRequest({ ...fixture, product: "", property: "Офис", sum: 50000000, source: "landing" }));
  assert.equal(calls.crm[0].title, "Офис");
  assert.equal(calls.crm[0].amount, "50000000");
  assert.equal(calls.crm[0].source, "landing");
});

const crmEnv = { CRM_API_URL: "https://crm.example.invalid", CRM_API_TOKEN: "synthetic-token" };

test("CRM requires explicit JSON confirmation, not just HTTP 200", async () => {
  for (const reply of [{ ok: true }, { ok: false }, {}, null, "html"]) {
    const crm = load("lib/crm.ts", {}, {
      process: { env: crmEnv },
      fetch: async () => Response.json(reply),
    });
    assert.equal((await crm.createLead(fixture)).ok, reply?.ok === true);
  }
});

test("CRM keeps only safe record IDs for notification links", async () => {
  for (const ids of [crmIds, {}, { dealId: fixture.email, companyId: "../../api/export?token=secret" }, { dealId: {}, companyId: 42 }]) {
    const crm = load("lib/crm.ts", {}, {
      process: { env: crmEnv },
      fetch: async () => Response.json({ ok: true, ...ids, name: fixture.name, email: fixture.email, url: "https://evil.example.invalid" }),
    });
    const result = await crm.createLead(fixture);
    assert.equal(result.ok, true);
    assert.equal(result.dealId, ids === crmIds ? crmIds.dealId : undefined);
    assert.equal(result.companyId, ids === crmIds ? crmIds.companyId : undefined);
    assert.equal(result.name, undefined);
    assert.equal(result.email, undefined);
    assert.equal(result.url, undefined);
  }
});

test("notification rejects arbitrary text and does not echo untrusted IDs or extra fields", () => {
  for (const value of [null, fixture.email, { ...notice, requestId: fixture.email }, { ...notice, savedToCrm: "yes" }]) {
    assert.equal(notificationTools.formatLeadNotification(value), undefined);
  }
  const text = notificationTools.formatLeadNotification({
    ...notice, dealId: fixture.email, companyId: "../../api/export?token=secret", ...fixture,
  });
  assert.ok(text.includes(notice.requestId));
  assert.ok(text.includes(`${crmTools.CRM_PUBLIC_URL}/deals`));
  for (const value of [fixture.name, fixture.email, fixture.phone, fixture.inn, "api/export", "secret"])
    assert.ok(!text.includes(value));
});

// Сокращаем только время теста. fetch ждёт реального сигнала отмены.
function stalledNetwork() {
  const deadlines = [];
  return {
    deadlines,
    globals: {
      AbortSignal: { timeout(ms) { deadlines.push(ms); return AbortSignal.timeout(5); } },
      fetch: (_url, { signal }) => new Promise((_resolve, reject) => {
        assert.ok(signal, "Request must have a deadline");
        signal.addEventListener("abort", () => reject(signal.reason), { once: true });
      }),
    },
  };
}

test("stalled CRM, Checko and Telegram requests terminate with a handled failure", async () => {
  // AbortSignal's timer is unreferenced; keep the test process alive until assertions finish.
  const keepAlive = setInterval(() => {}, 1000);
  try {
    const network = stalledNetwork();
    const crm = load("lib/crm.ts", {}, { ...network.globals, process: { env: crmEnv } });
    assert.equal((await crm.createLead(fixture)).ok, false);
    assert.equal((await crm.getApplications(fixture.email)).ok, false);
    const checko = load("lib/checko.ts", { "@/lib/inn": inn }, {
      ...network.globals,
      process: { env: { CHECKO_API_KEY: "synthetic-token", CHECKO_BASE_URL: "https://checko.example.invalid" } },
    });
    assert.equal((await checko.lookupInn(fixture.inn)).status, "error");
    const notify = load("lib/notify.ts", { "@/lib/crm": { ...crmTools, crmApiBase: () => crmEnv.CRM_API_URL } }, {
      ...network.globals,
      process: { env: { ...crmEnv, TELEGRAM_BOT_TOKEN: "synthetic-token", TELEGRAM_CHAT_ID: "0" } },
    });
    assert.equal((await notify.notifyTelegram(notice)).ok, false);
    assert.deepEqual(network.deadlines, [8000, 8000, 4000, 9000, 5000]);
  } finally {
    clearInterval(keepAlive);
  }
});

test("Telegram falls back to direct delivery and does not log contacts or error contents", async () => {
  const calls = [];
  const logs = [];
  let directOk = true;
  const notify = load("lib/notify.ts", { "@/lib/crm": { ...crmTools, crmApiBase: () => crmEnv.CRM_API_URL } }, {
    process: { env: { ...crmEnv, TELEGRAM_BOT_TOKEN: "synthetic-token", TELEGRAM_CHAT_ID: "0" } },
    console: { warn: (...args) => logs.push(args.join(" ")), error: (...args) => logs.push(args.join(" ")) },
    fetch: async (url, options) => {
      calls.push({ url, body: JSON.parse(options.body) });
      if (url.includes("/api/public/notify")) return Response.json({ ok: false });
      if (!directOk) throw new Error("sensitive-error-details");
      return Response.json({ ok: true });
    },
  });
  const result = await notify.notifyTelegram({ ...notice, ...fixture });
  assert.equal(result.ok, true);
  assert.equal(result.via, "direct");
  assert.equal(calls.length, 2);
  assert.equal(calls[0].body.text, notificationTools.formatLeadNotification(notice));
  assert.equal(calls[1].body.text, calls[0].body.text);
  for (const value of [fixture.name, fixture.email, fixture.phone, fixture.inn, fixture.product])
    assert.ok(!JSON.stringify(calls.map((call) => call.body)).includes(value));
  directOk = false;
  assert.equal((await notify.notifyTelegram(notice)).ok, false);
  assert.ok(logs.join("\n").includes(notice.requestId));
  for (const sensitive of [fixture.email, "synthetic-token", "sensitive-error-details"]) {
    assert.ok(!logs.join("\n").includes(sensitive));
  }
});

test("malformed notification makes no network requests", async () => {
  const notify = load("lib/notify.ts", { "@/lib/crm": crmTools });
  assert.equal((await notify.notifyTelegram(fixture.email)).reason, "invalid_notification");
});

test("confirmed relay delivery does not duplicate the notification through the bot", async () => {
  const calls = [];
  const notify = load("lib/notify.ts", { "@/lib/crm": { ...crmTools, crmApiBase: () => crmEnv.CRM_API_URL } }, {
    process: { env: { ...crmEnv, TELEGRAM_BOT_TOKEN: "synthetic-token", TELEGRAM_CHAT_ID: "0" } },
    fetch: async (url, options) => {
      calls.push({ url, body: JSON.parse(options.body) });
      return Response.json({ ok: true });
    },
  });
  assert.equal((await notify.notifyTelegram(notice)).via, "relay");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].body.text, notificationTools.formatLeadNotification(notice));
});

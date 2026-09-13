/* eslint-disable @typescript-eslint/no-require-imports -- Optional browser checks use CommonJS. */
const assert = require("node:assert/strict");
const { PD_CONSENT, PD_CONSENT_TEXT } = require("./helpers/load-ts.cjs")("lib/pd-consent.ts");
const { chromium, webkit } = require(process.env.PLAYWRIGHT_MODULE || "playwright");

const target = new URL(process.argv[2] || "https://localhost:3443");
const reportOnly = process.argv.includes("--report-only");
assert.equal(target.protocol, "https:");

async function checkBrowser(name, browserType, mobile) {
  const browser = await browserType.launch({ headless: true });
  const context = await browser.newContext({
    ignoreHTTPSErrors: ["localhost", "127.0.0.1"].includes(target.hostname),
    viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 },
    isMobile: mobile,
  });
  let mockedLeads = 0;
  let mockedInn = 0;
  let externalRequests = 0;
  const pageErrors = [];
  const policies = [];
  await context.route("https://csp-blocked.example.invalid/**", async route => {
    externalRequests++;
    await route.abort();
  });
  await context.route(`${target.origin}/**`, async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.pathname === "/api/inn") {
      mockedInn++;
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ status: "found", kind: "org", name: "CSP test company" }) });
    }
    if (url.pathname === "/api/lead" && request.method() === "POST") {
      // Exercise the live form without creating a lead or notifying anyone.
      mockedLeads++;
      const body = request.postDataJSON();
      assert.equal(body.pdConsent, "on");
      assert.equal(body.pdConsentVersion, PD_CONSENT.version);
      assert.equal(body.consent, undefined, "Browser must not supply the server evidence");
      return route.fulfill({ status: mockedLeads === 1 ? 503 : 422, contentType: "application/json", body: JSON.stringify({ ok: false, error: mockedLeads === 1 ? "delivery_failed" : "consent_version" }) });
    }
    if (url.pathname === "/api/clienterr") return route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
    if (reportOnly && request.resourceType() === "document") {
      const response = await route.fetch();
      const headers = response.headers();
      headers["content-security-policy-report-only"] = headers["content-security-policy"];
      delete headers["content-security-policy"];
      return route.fulfill({ response, headers });
    }
    return route.continue();
  });
  await context.addInitScript(() => {
    window.__cspViolations = [];
    document.addEventListener("securitypolicyviolation", event => {
      window.__cspViolations.push({ directive: event.effectiveDirective, blocked: event.blockedURI, disposition: event.disposition });
    });
  });
  const page = await context.newPage();
  page.on("pageerror", error => pageErrors.push(error.message));
  page.setDefaultTimeout(15000);

  async function noViolations() {
    assert.deepEqual(await page.evaluate(() => window.__cspViolations), [], `${name}: CSP blocked normal page behavior`);
    assert.deepEqual(pageErrors, [], `${name}: browser errors`);
  }
  async function open(path, expectedStatus = 200) {
    const response = await page.goto(`${target.origin}${path}`, { waitUntil: "networkidle", timeout: 45000 });
    assert.equal(response.status(), expectedStatus);
    const policy = response.headers()[reportOnly ? "content-security-policy-report-only" : "content-security-policy"];
    const nonce = policy?.match(/'nonce-([^']+)'/)?.[1];
    assert.ok(nonce, `${name}: nonce missing from response`);
    assert.match(response.headers()["cache-control"], /no-store/);
    assert.ok(!policies.includes(nonce), `${name}: nonce reused between page responses`);
    policies.push(nonce);
    const html = await response.text();
    const scripts = [...html.matchAll(/<script\b([^>]*)>/g)];
    assert.ok(scripts.length > 0);
    for (const [, attributes] of scripts) assert.ok(attributes.includes(`nonce="${nonce}"`), `${name}: SSR script without the matching nonce`);
    await noViolations();
  }

  try {
    await open("/");
    const cookieNotice = page.getByRole("dialog", { name: "Уведомление о файлах cookie" });
    await cookieNotice.getByRole("button", { name: "Понятно", exact: true }).click();
    await cookieNotice.waitFor({ state: "hidden" });
    const calc = page.locator("#calc");
    for (const name of ["Банковская гарантия", "Факторинг", "Лизинг", "Кредит"]) {
      const before = await calc.innerText();
      await calc.getByRole("button", { name, exact: true }).click();
      await page.waitForFunction(previous => document.querySelector("#calc").innerText !== previous, before);
    }
    await noViolations();

    const form = page.locator("#lead form");
    assert.equal(await form.locator('[name="pdConsent"]').isChecked(), false);
    assert.equal(await form.locator('[name="pdConsentVersion"]').inputValue(), PD_CONSENT.version);
    assert.equal((await form.locator('label[for="lead-pd-consent"]').innerText()).trim(), PD_CONSENT_TEXT);
    await form.locator('[name="name"]').fill("CSP browser check");
    await form.locator('[name="phone"]').fill("+79990000000");
    await form.locator('[name="inn"]').fill("1234567894");
    await form.locator('[name="inn"]').blur();
    await form.getByText("✓ CSP test company", { exact: true }).waitFor();
    await form.locator('[name="product"]').selectOption({ index: 1 });
    await form.locator('[name="pdConsent"]').check();
    await form.getByRole("button", { name: "Отправить заявку", exact: true }).click();
    await form.getByRole("alert").filter({ hasText: "Не удалось подтвердить отправку" }).waitFor();
    assert.equal(await form.locator('[name="name"]').inputValue(), "CSP browser check");
    assert.equal(mockedLeads, 1);
    assert.equal(mockedInn, 1);
    await form.getByRole("button", { name: "Отправить заявку", exact: true }).click();
    await form.getByRole("alert").filter({ hasText: "Условия согласия обновились" }).waitFor();
    assert.equal(await form.locator('[name="name"]').inputValue(), "CSP browser check");
    assert.equal(mockedLeads, 2);
    await noViolations();

    await open("/lk");
    const email = page.locator('input[type="email"]');
    await email.fill("csp-invalid-address");
    // Reach the real Server Action with an invalid address. It returns before Auth.js/mail.
    await email.evaluate(input => { input.type = "text"; });
    await page.locator('[name="pdConsent"]').check();
    await page.getByRole("button", { name: "Получить ссылку для входа", exact: true }).click();
    await page.getByText("Укажите рабочую почту", { exact: true }).waitFor();
    await noViolations();

    await page.evaluate(() => { window.__cspNavigationMarker = "kept"; });
    await page.getByRole("link", { name: "Политике конфиденциальности", exact: true }).first().click();
    await page.waitForURL(`${target.origin}/confidentiality`);
    assert.equal(await page.evaluate(() => window.__cspNavigationMarker), "kept", `${name}: client navigation became a full reload`);
    await noViolations();
    await page.goBack({ waitUntil: "networkidle" });
    await page.getByRole("link", { name: "Оставить заявку", exact: true }).click();
    await page.waitForURL(`${target.origin}/#lead`);
    await page.locator("#calc").getByRole("button", { name: "Лизинг", exact: true }).click();
    await page.locator("#calc").getByText("Аванс", { exact: true }).first().waitFor();
    await noViolations();

    await open("/confidentiality");
    await open("/csp-check-not-found", 404);
    await open("/");

    if (!reportOnly) {
      const attackUrl = `${target.origin}/?csp_browser_probe=1`;
      await page.route(attackUrl, async route => {
        const response = await route.fetch();
        const nonce = response.headers()["content-security-policy"].match(/'nonce-([^']+)'/)[1];
        // Run the probe as ordinary page JavaScript. DevTools/page.evaluate can
        // bypass CSP for evaluated code and would give a misleading result.
        const probe = `document.addEventListener("DOMContentLoaded", async () => {
          const button = document.createElement("button");
          button.setAttribute("onclick", "window.__cspHandler = true");
          button.click();
          let evalBlocked = false;
          try { Function("window.__cspEval = true")(); } catch { evalBlocked = true; }
          let fetchBlocked = false;
          try { await fetch("https://csp-blocked.example.invalid/probe"); } catch { fetchBlocked = true; }
          window.__cspProbe = { inlineBlocked: !window.__cspParserInline, handlerBlocked: !window.__cspHandler, evalBlocked, fetchBlocked };
        });`;
        const body = (await response.text()).replace("</head>", `<script src="https://csp-blocked.example.invalid/probe.js"></script><script>window.__cspParserInline = true</script><script nonce="${nonce}">${probe}</script></head>`);
        await route.fulfill({ response, body });
      });
      await page.goto(attackUrl, { waitUntil: "networkidle" });
      await page.waitForFunction(() => window.__cspProbe);
      const blocked = await page.evaluate(() => window.__cspProbe);
      assert.deepEqual(blocked, { inlineBlocked: true, handlerBlocked: true, evalBlocked: true, fetchBlocked: true });
      await page.waitForFunction(() => window.__cspViolations.some(v => v.blocked.includes("csp-blocked.example.invalid")));
      await page.waitForFunction(() => window.__cspViolations.some(v => v.directive === "connect-src"));
      assert.equal(externalRequests, 0, `${name}: blocked external request reached the network`);
    }
    console.log(JSON.stringify({ browser: name, mobile, mode: reportOnly ? "report-only" : "enforce", pages: policies.length, calculator: true, leadFormMocked: true, invalidLoginAction: true, clientNavigation: true, uniqueNonces: true, injectedCodeBlocked: !reportOnly, passed: true }));
  } catch (error) {
    console.error(JSON.stringify({ browser: name, path: new URL(page.url()).pathname, mockedLeads, pageErrors, diagnostics: await page.evaluate(() => ({
      violations: window.__cspViolations,
      invalidFields: Array.from(document.querySelectorAll("input, select")).filter(input => !input.checkValidity()).map(input => ({ name: input.name, message: input.validationMessage })),
      alerts: Array.from(document.querySelectorAll('[role="alert"]')).map(element => element.textContent),
    })).catch(() => null) }));
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

(async () => {
  await checkBrowser("Chromium", chromium, false);
  await checkBrowser("WebKit", webkit, true);
})().catch(error => { console.error(error); process.exitCode = 1; });

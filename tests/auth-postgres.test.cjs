/* eslint-disable @typescript-eslint/no-require-imports -- Node tests in this project use CommonJS. */
const assert = require("node:assert/strict");
const { createHmac, randomUUID } = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const { Pool } = require("pg");
const load = require("./helpers/load-ts.cjs");

// Только явно заданная тестовая БД; DATABASE_URL и .env приложения не читаются.
const connectionString = process.env.AUTH_TEST_DATABASE_URL;

test("PostgreSQL: concurrent requests, shared limits, expiry and failure handling", {
  skip: !connectionString && "Set AUTH_TEST_DATABASE_URL to an isolated test PostgreSQL",
}, async (t) => {
  const schema = `auth_test_${randomUUID().replaceAll("-", "")}`;
  const admin = new Pool({ connectionString, max: 1 });
  await admin.query(`CREATE SCHEMA "${schema}"`);
  const pool = new Pool({ connectionString, max: 20, options: `-c search_path=${schema}` });
  t.after(async () => {
    await pool.end();
    await admin.query(`DROP SCHEMA "${schema}" CASCADE`);
    await admin.end();
  });
  await pool.query(fs.readFileSync(path.join(__dirname, "../prisma/migrations/20260913130000_auth_rate_limit/migration.sql"), "utf8"));

  function queries(client) {
    const query = (parts, values) => client.query(parts.reduce((sql, part, i) => sql + (i ? `$${i}` : "") + part, ""), values);
    return {
      $executeRaw: async (parts, ...values) => (await query(parts, values)).rowCount,
      $queryRaw: async (parts, ...values) => (await query(parts, values)).rows,
    };
  }
  const prisma = {
    ...queries(pool),
    $transaction: async (run) => {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const result = await run(queries(client));
        await client.query("COMMIT");
        return result;
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally { client.release(); }
    },
  };
  const headers = (ip) => new Headers({ "x-forwarded-for": ip });
  const ipReader = load("lib/rate-limit.ts");
  const freshLimiter = (db = prisma) => load("lib/auth-rate-limit.ts", {
    "node:crypto": { createHmac },
    "@/lib/prisma": { prisma: db },
    "@/lib/rate-limit": ipReader,
  }, { process: { env: { AUTH_SECRET: "test-only-stable-secret" } } }).allowMagicLink;

  await t.test("a shared address accepts only three concurrent sends from different IPs", async () => {
    const outcomes = await Promise.all(Array.from({ length: 20 }, (_, i) =>
      freshLimiter()(i % 2 ? " Shared@Example.Invalid " : "shared@example.invalid", headers(`192.0.2.${i + 1}`))));
    assert.equal(outcomes.filter(Boolean).length, 3);
    assert.equal(await freshLimiter()("shared@example.invalid", headers("192.0.2.100")), false);
  });

  await t.test("a shared IP accepts only five concurrent sends to different addresses", async () => {
    const outcomes = await Promise.all(Array.from({ length: 20 }, (_, i) =>
      freshLimiter()(`user${i}@example.invalid`, headers("198.51.100.10"))));
    assert.equal(outcomes.filter(Boolean).length, 5);
    assert.equal(await freshLimiter()("new@example.invalid", headers("198.51.100.10")), false);
  });

  await t.test("a denied address does not consume another IP's allowance", async () => {
    const ip = headers("203.0.113.10");
    assert.equal(await freshLimiter()("shared@example.invalid", ip), false);
    for (let i = 0; i < 5; i++) assert.equal(await freshLimiter()(`rollback${i}@example.invalid`, ip), true);
    assert.equal(await freshLimiter()("rollback-last@example.invalid", ip), false);
  });

  await t.test("expired windows reopen while active windows stay limited", async () => {
    const ipKey = createHmac("sha256", "test-only-stable-secret").update("ip:198.51.100.10").digest("hex");
    await pool.query('UPDATE "AuthRateLimit" SET "expiresAt" = CURRENT_TIMESTAMP - INTERVAL \'1 second\' WHERE "key" = $1', [ipKey]);
    assert.equal(await freshLimiter()("after-expiry@example.invalid", headers("198.51.100.10")), true);
    assert.equal(await freshLimiter()("shared@example.invalid", headers("192.0.2.110")), false);
    const { rows } = await pool.query('SELECT "key", "count" FROM "AuthRateLimit"');
    assert.ok(rows.every((row) => /^[a-f0-9]{64}$/.test(row.key)));
    assert.ok(rows.every((row) => row.count <= 5));
  });

  await t.test("database errors propagate instead of allowing an uncounted send", async () => {
    const unavailable = freshLimiter({ $executeRaw: async () => { throw new Error("offline"); } });
    await assert.rejects(unavailable("fixture@example.invalid", headers("192.0.2.1")), /offline/);
  });
});

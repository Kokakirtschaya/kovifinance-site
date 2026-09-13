/* eslint-disable @typescript-eslint/no-require-imports -- Node tests in this project use CommonJS. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

// Настоящий код приложения с явными границами интеграций. .env не читаем,
// сетевые обращения разрешаются только через переданную тестовую подмену.
module.exports = function load(file, deps = {}, globals = {}) {
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, "../..", file), "utf8"), {
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
    URL, Headers, Request, Response,
    fetch() { throw new Error("Network is disabled in auth tests"); },
    ...globals,
  }, { filename: file });
  return loaded.exports;
};

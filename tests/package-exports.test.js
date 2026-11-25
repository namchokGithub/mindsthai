import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const project = process.cwd();
let consumer;
let packedFiles;

describe("installed package", () => {
  beforeAll(() => {
    consumer = mkdtempSync(join(tmpdir(), "mindsthai-consumer-"));
    const output = execFileSync("npm", ["pack", "--json", "--pack-destination", consumer], {
      cwd: project,
      encoding: "utf8",
      env: { ...process.env, npm_config_cache: join(consumer, "cache") },
    });
    const [pack] = JSON.parse(output);
    packedFiles = pack.files.map((file) => file.path);
    writeFileSync(join(consumer, "package.json"), '{"private":true,"type":"module"}');
    execFileSync("npm", ["install", "--offline", "--ignore-scripts", "--no-audit", "--no-fund", "--no-package-lock", join(consumer, pack.filename)], {
      cwd: consumer,
      encoding: "utf8",
      env: { ...process.env, npm_config_cache: join(consumer, "cache") },
    });
  });

  afterAll(() => {
    if (consumer) rmSync(consumer, { recursive: true, force: true });
  });

  it("includes distribution files and excludes development files", () => {
    for (const entry of ["index", "normalization/index", "numbers/index", "romanization/index", "segmentation/index"]) {
      expect(packedFiles).toContain(`dist/${entry}.mjs`);
      expect(packedFiles).toContain(`dist/${entry}.d.mts`);
    }
    expect(packedFiles.every((path) => path.startsWith("dist/") || ["LICENSE", "README.md", "package.json"].includes(path))).toBe(true);
  });

  it("resolves public JavaScript exports while blocking internal paths", () => {
    const source = `
      import assert from "node:assert/strict";
      import { normalizeThai, romanize, segmentWords, segmentSentences } from "@mindskit/thai";
      import { normalizeThai as normalize } from "@mindskit/thai/normalization";
      import { toThaiDigits, toArabicDigits, readThaiNumber } from "@mindskit/thai/numbers";
      import { romanize as roman } from "@mindskit/thai/romanization";
      import { segmentWords as words, segmentSentences as sentences } from "@mindskit/thai/segmentation";
      assert.equal(normalize("cafe\\u0301"), normalizeThai("cafe\\u0301"));
      assert.equal(toThaiDigits("123"), "๑๒๓");
      assert.equal(toArabicDigits("๑๒๓"), "123");
      assert.equal(readThaiNumber(21), "ยี่สิบเอ็ด");
      assert.equal(roman("สวัสดี", { style: "rtgs" }), romanize("สวัสดี", { style: "rtgs" }));
      assert.deepEqual(words("ภาษาไทย"), segmentWords("ภาษาไทย"));
      assert.deepEqual(sentences("Hello. Next."), segmentSentences("Hello. Next."));
      await assert.rejects(import("@mindskit/thai/dist/index.mjs"), { code: "ERR_PACKAGE_PATH_NOT_EXPORTED" });
    `;
    writeFileSync(join(consumer, "consumer.mjs"), source);
    expect(() => execFileSync(process.execPath, [join(consumer, "consumer.mjs")], { cwd: consumer })).not.toThrow();
  });

  it("resolves declarations for all public entry points", () => {
    const source = `
      import { normalizeThai, romanize, segmentWords, segmentSentences } from "@mindskit/thai";
      import { normalizeThai as normalize } from "@mindskit/thai/normalization";
      import { toThaiDigits, toArabicDigits, readThaiNumber } from "@mindskit/thai/numbers";
      import { romanize as roman, type RomanizationOptions } from "@mindskit/thai/romanization";
      import { segmentWords as words, segmentSentences as sentences } from "@mindskit/thai/segmentation";
      const options: RomanizationOptions = { style: "rtgs" };
      const outputs: string[] = [normalizeThai(""), normalize(""), toThaiDigits(""), toArabicDigits(""), readThaiNumber(0), romanize("", options), roman("", options), ...segmentWords(""), ...segmentSentences(""), ...words(""), ...sentences("")];
      void outputs;
    `;
    writeFileSync(join(consumer, "consumer.ts"), source);
    const tsc = resolve(project, "node_modules/typescript/bin/tsc");
    expect(() => execFileSync(process.execPath, [tsc, "--noEmit", "--strict", "--module", "NodeNext", "--moduleResolution", "NodeNext", "consumer.ts"], { cwd: consumer, encoding: "utf8" })).not.toThrow();
  });
});

import { describe, expect, it } from "vitest";
import { normalizeThai as normalizeFromRoot } from "../src/index.js";
import { normalizeThai } from "../src/normalization/index.js";

describe("normalizeThai", () => {
  it("exports the same function from the root entry point", () => {
    expect(normalizeFromRoot).toBe(normalizeThai);
  });

  it("normalizes Unicode throughout mixed text to NFC", () => {
    expect(normalizeThai("สวัสดี cafe\u0301")).toBe("สวัสดี café");
    expect(normalizeThai("café")).toBe("café");
  });

  it("preserves Thai marks, punctuation and whitespace without extra rewriting", () => {
    const text = "  ก\u0e48\u0e34, Thai!\n";
    expect(normalizeThai(text)).toBe(text.normalize("NFC"));
    expect(normalizeThai(text)).toBe(text);
  });

  it("returns an empty string for empty input", () => {
    expect(normalizeThai("")).toBe("");
  });

  it("is idempotent", () => {
    const once = normalizeThai("ไทย cafe\u0301\n");
    expect(normalizeThai(once)).toBe(once);
  });

  it.each([undefined, null, 1, {}, []])("rejects non-string input %s", (value) => {
    expect(() => Reflect.apply(normalizeThai, undefined, [value])).toThrow(TypeError);
  });
});

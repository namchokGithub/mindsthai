import { afterEach, describe, expect, it, vi } from "vitest";
import { romanize as rootRomanize } from "../src/index.js";
import { romanize } from "../src/romanization/index.js";

afterEach(() => vi.unstubAllGlobals());

describe("romanize", () => {
  it("exports the same function from the root", () => {
    expect(rootRomanize).toBe(romanize);
  });

  it.each([
    ["สวัสดี", "sawatdi", "sawasdee"],
    ["ครับ", "khrap", "krap"],
    ["ค่ะ", "kha", "kha"],
  ])("transcribes the supported word %s in each style", (word, rtgs, casual) => {
    expect(romanize(word, { style: "rtgs" })).toBe(rtgs);
    expect(romanize(word, { style: "casual" })).toBe(casual);
  });

  it("preserves unknown words, other scripts, digits, punctuation and whitespace", () => {
    expect(romanize("สวัสดีครับ! แมว ๑23 English\n", { style: "rtgs" })).toBe(
      "sawatdikhrap! แมว ๑23 English\n",
    );
    expect(romanize("สวัสดี ค่ะ", { style: "casual" })).toBe("sawasdee kha");
  });

  it("does not match a supported word inside an unknown word", () => {
    expect(romanize("ราตรีสวัสดิ์", { style: "rtgs" })).toBe("ราตรีสวัสดิ์");
  });

  it("returns an empty string for empty input", () => {
    expect(romanize("", { style: "rtgs" })).toBe("");
  });

  it("rejects invalid text and options", () => {
    for (const input of [undefined, null, 1, {}, []]) {
      expect(() => Reflect.apply(romanize, undefined, [input, { style: "rtgs" }])).toThrow(TypeError);
    }
    for (const options of [undefined, null, 1, {}, { style: "other" }]) {
      expect(() => Reflect.apply(romanize, undefined, ["", options])).toThrow(TypeError);
    }
  });

  it("reports missing Intl.Segmenter for non-empty input", () => {
    vi.stubGlobal("Intl", Object.assign(Object.create(Intl), { Segmenter: undefined }));
    expect(() => romanize("สวัสดี", { style: "rtgs" })).toThrow("Intl.Segmenter is required");
    expect(romanize("", { style: "rtgs" })).toBe("");
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";
import { checkSpelling as rootCheckSpelling } from "../src/index.js";
import { checkSpelling } from "../src/spell-checking/index.js";

afterEach(() => vi.unstubAllGlobals());

describe("checkSpelling", () => {
  it("exports the same function from the root", () => {
    expect(rootCheckSpelling).toBe(checkSpelling);
  });

  it("reports known and unknown Thai word segments without calling unknown words incorrect", () => {
    expect(checkSpelling("มะนาว แมว")).toEqual([
      { word: "มะนาว", start: 0, end: 5, status: "known" },
      { word: "แมว", start: 6, end: 9, status: "unknown" },
    ]);
  });

  it("reports UTF-16 offsets for mixed text and excludes non-Thai segments", () => {
    const text = "😀 Hello, ๑๒ มะละกอ!";
    const start = text.indexOf("มะละกอ");
    const result = checkSpelling(text);
    expect(result).toEqual([{ word: "มะละกอ", start, end: start + "มะละกอ".length, status: "known" }]);
    expect(text.slice(result[0].start, result[0].end)).toBe(result[0].word);
  });

  it("uses custom dictionary entries only for the current call", () => {
    expect(checkSpelling("แมว", { entries: [{ word: "แมว", meaning: "cat" }] })[0].status).toBe("known");
    expect(checkSpelling("แมว")[0].status).toBe("unknown");
  });

  it("validates duplicate custom entries even for empty text", () => {
    const entries = [{ word: "café", meaning: "one" }, { word: "cafe\u0301", meaning: "two" }];
    expect(() => checkSpelling("", { entries })).toThrow(TypeError);
  });

  it("returns empty results for empty text and text without Thai consonants", () => {
    expect(checkSpelling("")).toEqual([]);
    expect(checkSpelling("Hello, 123 ๑๒! 😀")).toEqual([]);
  });

  it("rejects invalid input and options", () => {
    for (const input of [undefined, null, 1, {}, []]) {
      expect(() => Reflect.apply(checkSpelling, undefined, [input])).toThrow(TypeError);
    }
    for (const options of [null, 1, [], { entries: null }, { entries: [{ word: "", meaning: "x" }] }]) {
      expect(() => Reflect.apply(checkSpelling, undefined, ["", options])).toThrow(TypeError);
    }
  });

  it("reports a missing Intl.Segmenter for non-empty text", () => {
    vi.stubGlobal("Intl", Object.assign(Object.create(Intl), { Segmenter: undefined }));
    expect(() => checkSpelling("มะนาว")).toThrow("Intl.Segmenter is required");
    expect(checkSpelling("")).toEqual([]);
  });
});

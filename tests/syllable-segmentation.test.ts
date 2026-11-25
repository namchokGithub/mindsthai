import { afterEach, describe, expect, it, vi } from "vitest";
import { segmentSyllables as rootSegmentSyllables } from "../src/index.js";
import { segmentSyllables, segmentWords } from "../src/segmentation/index.js";

afterEach(() => vi.unstubAllGlobals());

describe("segmentSyllables", () => {
  it("exports the same function from the root", () => {
    expect(rootSegmentSyllables).toBe(segmentSyllables);
  });

  it.each([
    ["มะนาว", ["มะ", "นาว"]],
    ["มะละกอ", ["มะ", "ละ", "กอ"]],
  ])("splits the supported word %s at documented boundaries", (word, expected) => {
    expect(segmentSyllables(word)).toEqual(expected);
  });

  it("preserves unknown and ambiguous words as whole word segments", () => {
    const text = "สวัสดี โปรแกรม";
    expect(segmentSyllables(text)).toEqual(segmentWords(text));
  });

  it("preserves mixed text, punctuation, digits and whitespace", () => {
    const text = "  มะนาว, มะละกอ 123 English!\n";
    expect(segmentSyllables(text)).toEqual(["  ", "มะ", "นาว", ",", " ", "มะ", "ละ", "กอ", " ", "123", " ", "English", "!", "\n"]);
    expect(segmentSyllables(text).join("")).toBe(text);
  });

  it("returns an empty array for empty input", () => {
    expect(segmentSyllables("")).toEqual([]);
  });

  it("rejects non-string input", () => {
    for (const value of [undefined, null, 1, {}, []]) {
      expect(() => Reflect.apply(segmentSyllables, undefined, [value])).toThrow(TypeError);
    }
  });

  it("reports a missing Intl.Segmenter for non-empty input", () => {
    vi.stubGlobal("Intl", Object.assign(Object.create(Intl), { Segmenter: undefined }));
    expect(() => segmentSyllables("มะนาว")).toThrow("Intl.Segmenter is required");
    expect(segmentSyllables("")).toEqual([]);
  });

  it("does not let callers change the stored boundaries", () => {
    const result = segmentSyllables("มะนาว");
    result[0] = "changed";
    expect(segmentSyllables("มะนาว")).toEqual(["มะ", "นาว"]);
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";
import { segmentSentences as rootSentences, segmentWords as rootWords } from "../src/index.js";
import { segmentSentences, segmentWords } from "../src/segmentation/index.js";

afterEach(() => vi.unstubAllGlobals());

describe("segmentation", () => {
  it("exports both functions from the root", () => {
    expect(rootWords).toBe(segmentWords);
    expect(rootSentences).toBe(segmentSentences);
  });

  it("segments a Thai phrase into words", () => {
    expect(segmentWords("ฉันชอบเขียนโปรแกรม")).toEqual(["ฉัน", "ชอบ", "เขียน", "โปรแกรม"]);
  });

  it("preserves mixed scripts, digits, punctuation and whitespace", () => {
    const text = "  ภาษาไทย, English 123!\n";
    for (const segment of [segmentWords, segmentSentences]) {
      expect(segment(text).join("")).toBe(text);
    }
    expect(segmentWords("Hello, world!")).toEqual(["Hello", ",", " ", "world", "!"]);
  });

  it("segments sentences without treating every space as a boundary", () => {
    expect(segmentSentences("Hello world. Next sentence!")).toEqual(["Hello world. ", "Next sentence!"]);
    expect(segmentSentences("สวัสดีครับ วันนี้อากาศดี")).toEqual(["สวัสดีครับ วันนี้อากาศดี"]);
  });

  it.each([segmentWords, segmentSentences])("returns an empty array for empty input", (segment) => {
    expect(segment("")).toEqual([]);
  });

  it.each([segmentWords, segmentSentences])("rejects non-string inputs", (segment) => {
    for (const input of [undefined, null, 1, {}, []]) {
      expect(() => Reflect.apply(segment, undefined, [input])).toThrow(TypeError);
    }
  });

  it.each([segmentWords, segmentSentences])("reports an unavailable Intl.Segmenter", (segment) => {
    vi.stubGlobal("Intl", Object.assign(Object.create(Intl), { Segmenter: undefined }));
    expect(() => segment("ข้อความ")).toThrow("Intl.Segmenter is required");
    expect(segment("")).toEqual([]);
  });
});

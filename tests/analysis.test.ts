import { afterEach, describe, expect, it, vi } from "vitest";
import { analyzeThai as rootAnalyzeThai } from "../src/index.js";
import { analyzeThai } from "../src/analysis/index.js";
import { segmentSentences, segmentWords } from "../src/segmentation/index.js";

afterEach(() => vi.unstubAllGlobals());

describe("analyzeThai", () => {
  it("exports the same function from the root", () => {
    expect(rootAnalyzeThai).toBe(analyzeThai);
  });

  it("counts Unicode code points and the Thai block, including marks and digits", () => {
    const text = "ก้๑A😀 \u0301";
    const result = analyzeThai(text);
    expect(result.codePointCount).toBe(7);
    expect(result.thaiBlockCodePointCount).toBe(3);
  });

  it("uses existing word and sentence segments and preserves mixed input", () => {
    const text = "สวัสดี, world 123! Next.\n";
    const result = analyzeThai(text);
    expect(result.wordSegments).toEqual(segmentWords(text));
    expect(result.sentenceSegments).toEqual(segmentSentences(text));
    expect(result.wordSegments.join("")).toBe(text);
    expect(result.sentenceSegments.join("")).toBe(text);
  });

  it("returns zero counts and empty segments for empty input", () => {
    expect(analyzeThai("")).toEqual({
      codePointCount: 0,
      thaiBlockCodePointCount: 0,
      wordSegments: [],
      sentenceSegments: [],
    });
  });

  it("rejects non-string input", () => {
    for (const value of [undefined, null, 1, {}, []]) {
      expect(() => Reflect.apply(analyzeThai, undefined, [value])).toThrow(TypeError);
    }
  });

  it("reports a missing Intl.Segmenter for non-empty input", () => {
    vi.stubGlobal("Intl", Object.assign(Object.create(Intl), { Segmenter: undefined }));
    expect(() => analyzeThai("ไทย")).toThrow("Intl.Segmenter is required");
    expect(analyzeThai("").wordSegments).toEqual([]);
  });
});

import { describe, expect, it } from "vitest";
import { checkSpelling, lookupPronunciation, lookupWord, romanize, segmentWords } from "../src/index.js";

describe("segmentation and dictionary integration", () => {
  it("uses custom entries and pronunciation overrides for the same Thai segments", () => {
    const text = "มะนาว แมว!";
    const entries = [{ word: "แมว", meaning: "cat" }];
    const overrides = [{ word: "มะนาว", rtgs: "manao" }, { word: "แมว", rtgs: "maeo", pronunciation: "แมว" }];

    expect(segmentWords(text)).toEqual(["มะนาว", " ", "แมว", "!"]);
    expect(lookupWord("แมว", { entries })).toEqual(entries[0]);
    expect(checkSpelling(text, { entries })).toEqual([
      { word: "มะนาว", start: 0, end: 5, status: "known" },
      { word: "แมว", start: 6, end: 9, status: "known" },
    ]);
    expect(romanize(text, { style: "rtgs", overrides })).toBe("manao maeo!");
    expect(lookupPronunciation("แมว", { overrides })).toBe("แมว");
    expect(checkSpelling("แมว")[0].status).toBe("unknown");
    expect(romanize("แมว", { style: "rtgs" })).toBe("แมว");
  });
});

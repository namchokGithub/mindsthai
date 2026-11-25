import { describe, expect, it } from "vitest";
import { lookupPronunciation as rootLookup } from "../src/index.js";
import { lookupPronunciation, romanize } from "../src/romanization/index.js";

describe("romanization overrides", () => {
  it("overrides only the requested style and falls back for other styles", () => {
    const overrides = [{ word: "สวัสดี", rtgs: "custom" }];
    expect(romanize("สวัสดีครับ!", { style: "rtgs", overrides })).toBe("customkhrap!");
    expect(romanize("สวัสดี", { style: "casual", overrides })).toBe("sawasdee");
  });

  it("supports unknown words and preserves segments without a matching style", () => {
    const overrides = [{ word: "แมว", casual: "meow" }];
    expect(romanize("แมว 123!", { style: "casual", overrides })).toBe("meow 123!");
    expect(romanize("แมว", { style: "rtgs", overrides })).toBe("แมว");
    expect(romanize("แมว", { style: "casual" })).toBe("แมว");
  });

  it("matches whole word segments after NFC without matching inside words", () => {
    const overrides = [{ word: "café", rtgs: "coffee" }, { word: "cat", rtgs: "animal" }];
    expect(romanize("cafe\u0301!", { style: "rtgs", overrides })).toBe("coffee!");
    expect(romanize("bobcat", { style: "rtgs", overrides })).toBe("bobcat");
  });

  it("rejects duplicates after NFC and invalid override fields even for empty text", () => {
    const invalid = [
      null, {}, [{ word: "", rtgs: "x" }], [{ word: "x" }],
      [{ word: "x", rtgs: "" }], [{ word: "x", casual: 4 }],
      [{ word: "x", pronunciation: "" }],
      [{ word: "café", rtgs: "a" }, { word: "cafe\u0301", casual: "b" }],
    ];
    for (const overrides of invalid) {
      expect(() => Reflect.apply(romanize, undefined, ["", { style: "rtgs", overrides }])).toThrow(TypeError);
    }
  });
});

describe("lookupPronunciation", () => {
  const overrides = [{ word: "café", pronunciation: "คาเฟ่" }, { word: "แมว", rtgs: "maeo" }];

  it("exports the same function from the root", () => {
    expect(rootLookup).toBe(lookupPronunciation);
  });

  it("returns only explicitly supplied pronunciations after NFC matching", () => {
    expect(lookupPronunciation("cafe\u0301", { overrides })).toBe("คาเฟ่");
    expect(lookupPronunciation("แมว", { overrides })).toBeUndefined();
    expect(lookupPronunciation("สวัสดี", { overrides })).toBeUndefined();
    expect(lookupPronunciation("", { overrides })).toBeUndefined();
  });

  it("rejects invalid words and options", () => {
    for (const word of [undefined, null, 1, {}, []]) {
      expect(() => Reflect.apply(lookupPronunciation, undefined, [word, { overrides }])).toThrow(TypeError);
    }
    for (const options of [undefined, null, {}, { overrides: null }, { overrides: [{ word: "x" }] }]) {
      expect(() => Reflect.apply(lookupPronunciation, undefined, ["", options])).toThrow(TypeError);
    }
  });
});

import { describe, expect, it } from "vitest";
import { lookupWord as rootLookup } from "../src/index.js";
import { lookupWord } from "../src/dictionary/index.js";

describe("lookupWord", () => {
  it("exports the same function from the root", () => {
    expect(rootLookup).toBe(lookupWord);
  });

  it("looks up the two prototype entries", () => {
    expect(lookupWord("มะนาว")).toEqual({ word: "มะนาว", meaning: "lime" });
    expect(lookupWord("มะละกอ")).toEqual({ word: "มะละกอ", meaning: "papaya" });
  });

  it("returns undefined for unknown, empty and non-exact queries", () => {
    for (const word of ["", "ส้ม", " มะนาว", "มะนาว!", "มะนาว lime"]) {
      expect(lookupWord(word)).toBeUndefined();
    }
  });

  it("uses NFC for custom entry and query matching", () => {
    const options = { entries: [{ word: "cafe\u0301", meaning: "coffee shop" }] };
    expect(lookupWord("café", options)).toEqual({ word: "café", meaning: "coffee shop" });
    expect(lookupWord("cafe\u0301", options)).toEqual({ word: "café", meaning: "coffee shop" });
  });

  it("allows a per-call custom entry to override a built-in entry", () => {
    const custom = { word: "มะนาว", meaning: "custom" };
    expect(lookupWord("มะนาว", { entries: [custom] })).toEqual(custom);
    expect(lookupWord("มะนาว")).toEqual({ word: "มะนาว", meaning: "lime" });
  });

  it("rejects duplicate custom words after NFC normalization", () => {
    const options = { entries: [{ word: "café", meaning: "first" }, { word: "cafe\u0301", meaning: "second" }] };
    expect(() => lookupWord("unknown", options)).toThrow(TypeError);
  });

  it("returns copies without changing built-in or custom entries", () => {
    const source = { word: "ทดสอบ", meaning: "test" };
    const options = { entries: [source] };
    const result = lookupWord("ทดสอบ", options);
    expect(result).toBeDefined();
    if (result) result.meaning = "changed";
    expect(source.meaning).toBe("test");
    expect(lookupWord("ทดสอบ", options)?.meaning).toBe("test");
    const builtIn = lookupWord("มะนาว");
    if (builtIn) builtIn.meaning = "changed";
    expect(lookupWord("มะนาว")?.meaning).toBe("lime");
  });

  it("rejects invalid queries, options and entries", () => {
    for (const query of [undefined, null, 1, {}, []]) {
      expect(() => Reflect.apply(lookupWord, undefined, [query])).toThrow(TypeError);
    }
    for (const options of [null, 1, [], { entries: null }, { entries: {} }, { entries: [null] }, { entries: [{ word: "", meaning: "x" }] }, { entries: [{ word: "x", meaning: "" }] }, { entries: [{ word: 1, meaning: "x" }] }]) {
      expect(() => Reflect.apply(lookupWord, undefined, ["", options])).toThrow(TypeError);
    }
  });
});

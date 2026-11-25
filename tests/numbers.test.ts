import { describe, expect, it } from "vitest";
import { readThaiNumber as rootRead, toArabicDigits as rootArabic, toThaiDigits as rootThai } from "../src/index.js";
import { readThaiNumber, toArabicDigits, toThaiDigits } from "../src/numbers/index.js";

describe("Thai digit conversion", () => {
  it("exports the same functions from the root", () => {
    expect(rootThai).toBe(toThaiDigits);
    expect(rootArabic).toBe(toArabicDigits);
    expect(rootRead).toBe(readThaiNumber);
  });

  it("converts all ten digits and round trips", () => {
    const arabic = "0123456789";
    const thai = "๐๑๒๓๔๕๖๗๘๙";
    expect(toThaiDigits(arabic)).toBe(thai);
    expect(toArabicDigits(thai)).toBe(arabic);
    expect(toArabicDigits(toThaiDigits(arabic))).toBe(arabic);
  });

  it("preserves mixed text, punctuation and digits already in the target script", () => {
    expect(toThaiDigits("ราคา 123.45 บาท ๖!")).toBe("ราคา ๑๒๓.๔๕ บาท ๖!");
    expect(toArabicDigits("ราคา ๑๒๓.๔๕ บาท 6!")).toBe("ราคา 123.45 บาท 6!");
    expect(toThaiDigits("")).toBe("");
    expect(toArabicDigits("")).toBe("");
  });

  it.each([toThaiDigits, toArabicDigits])("rejects non-string input", (convert) => {
    for (const input of [undefined, null, 0, {}, []]) {
      expect(() => Reflect.apply(convert, undefined, [input])).toThrow(TypeError);
    }
  });
});

describe("readThaiNumber", () => {
  it.each([
    [0, "ศูนย์"], [1, "หนึ่ง"], [9, "เก้า"], [10, "สิบ"],
    [11, "สิบเอ็ด"], [20, "ยี่สิบ"], [21, "ยี่สิบเอ็ด"], [30, "สามสิบ"],
    [100, "หนึ่งร้อย"], [101, "หนึ่งร้อยเอ็ด"], [110, "หนึ่งร้อยสิบ"],
    [1001, "หนึ่งพันเอ็ด"], [1011, "หนึ่งพันสิบเอ็ด"],
    [10000, "หนึ่งหมื่น"], [100000, "หนึ่งแสน"],
    [999999, "เก้าแสนเก้าหมื่นเก้าพันเก้าร้อยเก้าสิบเก้า"],
  ])("reads %i as %s", (value, expected) => {
    expect(readThaiNumber(value)).toBe(expected);
  });

  it("treats negative zero as zero", () => {
    expect(readThaiNumber(-0)).toBe("ศูนย์");
  });

  it("rejects non-number input", () => {
    for (const value of [undefined, null, "21", {}, []]) {
      expect(() => Reflect.apply(readThaiNumber, undefined, [value])).toThrow(TypeError);
    }
  });

  it("rejects fractions, non-finite numbers and values outside the supported range", () => {
    for (const value of [-1, 1.5, 1000000, NaN, Infinity, -Infinity]) {
      expect(() => readThaiNumber(value)).toThrow(RangeError);
    }
  });
});

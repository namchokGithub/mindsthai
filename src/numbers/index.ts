const digitNames = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
const placeNames = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน"];

/** Convert ASCII digits to Thai digits without changing other characters. */
export function toThaiDigits(text: string): string {
  if (typeof text !== "string") {
    throw new TypeError("text must be a string");
  }
  return text.replace(/[0-9]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) + 0x0e50 - 0x30));
}

/** Convert Thai digits to ASCII digits without changing other characters. */
export function toArabicDigits(text: string): string {
  if (typeof text !== "string") {
    throw new TypeError("text must be a string");
  }
  return text.replace(/[๐-๙]/g, (digit) => String.fromCharCode(digit.charCodeAt(0) - 0x0e50 + 0x30));
}

/** Read an integer from zero through 999,999 as a Thai cardinal number. */
export function readThaiNumber(value: number): string {
  if (typeof value !== "number") {
    throw new TypeError("value must be a number");
  }
  if (!Number.isInteger(value) || value < 0 || value > 999999) {
    throw new RangeError("value must be an integer from 0 to 999999");
  }
  if (value === 0) return digitNames[0];

  const digits = String(value);
  let result = "";
  for (let index = 0; index < digits.length; index++) {
    const digit = Number(digits[index]);
    const place = digits.length - index - 1;
    if (digit === 0) continue;
    if (place === 0 && digit === 1 && value > 10) {
      result += "เอ็ด";
    } else if (place === 1 && digit === 1) {
      result += "สิบ";
    } else if (place === 1 && digit === 2) {
      result += "ยี่สิบ";
    } else {
      result += digitNames[digit] + placeNames[place];
    }
  }
  return result;
}

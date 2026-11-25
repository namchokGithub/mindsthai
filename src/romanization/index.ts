import { segmentWords } from "../segmentation/index.js";

export type RomanizationStyle = "rtgs" | "casual";

export interface RomanizationOptions {
  style: RomanizationStyle;
}

// Limited vocabulary; unknown segments are preserved.
const readings = new Map<string, Record<RomanizationStyle, string>>([
  ["สวัสดี", { rtgs: "sawatdi", casual: "sawasdee" }],
  ["ครับ", { rtgs: "khrap", casual: "krap" }],
  ["ค่ะ", { rtgs: "kha", casual: "kha" }],
]);

/** Romanize supported whole words; preserve all other segments. */
export function romanize(text: string, options: RomanizationOptions): string {
  if (typeof text !== "string") {
    throw new TypeError("text must be a string");
  }
  if (options === null || typeof options !== "object" ||
      (options.style !== "rtgs" && options.style !== "casual")) {
    throw new TypeError('style must be "rtgs" or "casual"');
  }

  return segmentWords(text).map((word) => readings.get(word)?.[options.style] ?? word).join("");
}

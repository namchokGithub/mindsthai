import { normalizeThai } from "../normalization/index.js";

export interface DictionaryEntry {
  word: string;
  meaning: string;
}

export interface DictionaryOptions {
  entries?: DictionaryEntry[];
}

const builtInEntries = new Map<string, string>([
  ["มะนาว", "lime"],
  ["มะละกอ", "papaya"],
]);

/** Find an NFC-normalized exact match, with optional per-call custom entries. */
export function lookupWord(word: string, options?: DictionaryOptions): DictionaryEntry | undefined {
  if (typeof word !== "string") {
    throw new TypeError("word must be a string");
  }
  if (options !== undefined && (options === null || typeof options !== "object" || Array.isArray(options))) {
    throw new TypeError("options must be an object");
  }
  if (options?.entries !== undefined && !Array.isArray(options.entries)) {
    throw new TypeError("entries must be an array");
  }

  const custom = new Map<string, string>();
  for (const entry of options?.entries ?? []) {
    if (entry === null || typeof entry !== "object" || Array.isArray(entry) ||
        typeof entry.word !== "string" || entry.word === "" ||
        typeof entry.meaning !== "string" || entry.meaning === "") {
      throw new TypeError("entries must have non-empty word and meaning strings");
    }
    const normalized = normalizeThai(entry.word);
    if (custom.has(normalized)) {
      throw new TypeError("duplicate custom dictionary word");
    }
    custom.set(normalized, entry.meaning);
  }

  const normalized = normalizeThai(word);
  const meaning = custom.get(normalized) ?? builtInEntries.get(normalized);
  return meaning === undefined ? undefined : { word: normalized, meaning };
}

# Roadmap

Unless marked implemented, these are planned capabilities, not available APIs. Planned signatures and behavior remain subject to review.

## P1 — Foundation and core processing

- `normalizeThai(text)`: implemented using Unicode NFC without additional Thai-specific rewriting; see the [README](../README.md#normalization) for behavior.
- `segmentWords(text)` and `segmentSentences(text)`: implemented using `Intl.Segmenter`; see the [README](../README.md#segmentation) for runtime requirements and limitations.
- `romanize(text, { style: 'rtgs' | 'casual' })`: implemented as a limited three-word prototype; see the [README](../README.md#romanization-prototype) for its vocabulary and limitations.

## P2 — Additional processing

- `segmentSyllables(text)`: implemented as a limited two-word prototype; see the [README](../README.md#syllable-segmentation-prototype) for coverage and limitations.
- `toThaiDigits(text)` and `toArabicDigits(text)`: implemented for ASCII and Thai digits.
- `readThaiNumber(value)`: implemented for integer cardinal numbers from 0 to 999,999; see the [README](../README.md#thai-numbers).
- `analyzeThai(text)`: implemented with Unicode code point counts and existing segmentation results; see the [README](../README.md#text-analysis).

## P3 — Language resources

- `checkSpelling(text, options?)`: implemented as a limited dictionary membership prototype without suggestions; see the [README](../README.md#spell-checking-prototype).
- `lookupWord(word, options?)`: implemented as a limited dictionary prototype with per-call custom entries; see the [README](../README.md#dictionary-prototype).
- Per-call romanization overrides and `lookupPronunciation(word, { overrides })`: implemented; see the [README](../README.md#romanization-prototype).

See [progress.md](progress.md) for implementation steps, decisions, and verification constraints.

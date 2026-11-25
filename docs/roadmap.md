# Roadmap

Unless marked implemented, these are planned capabilities, not available APIs. Planned signatures and behavior remain subject to review.

## P1 — Foundation and core processing

- `normalizeThai(text)`: implemented using Unicode NFC without additional Thai-specific rewriting; see the [README](../README.md#normalization) for behavior.
- `segmentWords(text)` and `segmentSentences(text)`: implemented using `Intl.Segmenter`; see the [README](../README.md#segmentation) for runtime requirements and limitations.
- `romanize(text, { style: 'rtgs' | 'casual' })`: either an explicitly limited, tested prototype or a deferred milestone. Casual romanization is informal, not a formal standard.

## P2 — Additional processing

- `segmentSyllables(text, options?)`.
- `toThaiDigits(text)` and `toArabicDigits(text)`.
- `readThaiNumber(value, options?)`.
- `analyzeThai(text, options?)`.

## P3 — Language resources

- `checkSpelling(text, options?)`.
- Dictionary lookup and custom entries.
- Custom romanization and pronunciation mappings.

See [progress.md](progress.md) for implementation steps, decisions, and verification constraints.

# Roadmap

These are planned capabilities, not available APIs. Signatures and behavior remain subject to review.

## P1 — Foundation and core processing

- `normalizeThai(text, options?)`: define and test Unicode, Thai mark, and whitespace handling.
- `segmentWords(text, options?)` and `segmentSentences(text, options?)`: independently specified boundary strategies, including unsupported-runtime behavior.
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

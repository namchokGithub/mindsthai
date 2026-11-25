# MindsThai Context

This file is a handoff for contributors and agents. Follow [AGENTS.md](AGENTS.md) and the user's current instructions first; use [docs/progress.md](docs/progress.md) for the phase-by-phase record and [README.md](README.md) for the public API and exact behavior.

## Project status

MindsThai is an early-stage, framework-independent TypeScript library for Thai text. The package is `@mindskit/thai`, currently `0.0.1` and private. It is not published or approved for release. P1–P3 foundation features are implemented, but several language features are deliberately small prototypes. Confirm npm scope ownership and obtain separate authorization before any future publication or release action.

The library uses strict TypeScript, ESM, pnpm, tsdown, and Vitest. It has no production dependencies or runtime network requests. It targets Node.js 24+ and browsers; Node.js 24 and browsers have not yet been exercised. Word and sentence segmentation require `Intl.Segmenter` for non-empty input, and results depend on runtime locale and ICU data.

## Code map and public APIs

- `src/index.ts`: root exports; `package.json` and `tsdown.config.ts` define the explicit ESM subpaths and declarations.
- `src/normalization/`: `normalizeThai` applies Unicode NFC to all input without extra Thai-specific rewriting.
- `src/segmentation/`: `segmentWords`, `segmentSentences`, and `segmentSyllables`. Syllable lookup supports only มะนาว and มะละกอ; unknown word segments are retained.
- `src/romanization/`: `romanize` supports three built-in words and per-call style overrides; `lookupPronunciation` only returns user-provided values. It is not a general RTGS engine.
- `src/numbers/`: Thai/ASCII digit conversion and `readThaiNumber` for integers 0–999,999.
- `src/analysis/`: Unicode and Thai-block code point counts plus existing segmentation results; counts are not visual character counts.
- `src/dictionary/`: exact NFC lookup with two built-in entries and per-call custom entries. Data is locally authored; references are in the README.
- `src/spell-checking/`: known/unknown dictionary membership for Thai-consonant word segments with UTF-16 offsets. Unknown does not mean misspelled; there are no suggestions.

All custom dictionary entries and romanization overrides are per-call; they do not persist. Preserve documented behavior and do not invent Thai readings or claim broader correctness than fixtures support. `docs/architecture.md` and `docs/roadmap.md` provide more detail.

## Verification and constraints

The latest Phase 12 check on Node.js 26.7.0 passed `pnpm typecheck`, `pnpm build`, and `pnpm test` (11 files, 95 tests). The tests include a temporary installed-package consumer for root/subpath JavaScript imports and TypeScript declarations, plus cross-module integration. `npm pack --dry-run` verified 19 packaged files. The build emitted a deprecation warning for the TypeScript 7.0 generator; no dependency upgrade was attempted. CI, Node.js 24, and browsers remain unverified.

`pnpm test` includes installed-package checks and therefore requires a current `dist` produced by `pnpm build`. Routine work must follow the current `AGENTS.md` restrictions: run only added or changed test files, and request explicit authorization before builds or the full suite. The Phase 12 authorization was specific to that verification, not a blanket authorization for future work.

The package whitelist includes `dist`; npm also includes package metadata, README, and MIT license. No `sideEffects` flag is currently declared. The small built-in dictionary labels are project-authored; source references and limitations are documented in the README. Package and development-dependency licenses have not undergone a separate comprehensive audit.

## Next work

Choose and approve the next scope with the user. Possible follow-ups include expanding independently verified linguistic data and coverage, supporting additional numeric formats, evaluating suggestions and richer dictionary data, checking Node.js 24/browser compatibility, and resolving the build warning. Any changes to behavior, public APIs, dependencies, data sources, or release status require the approvals described in `AGENTS.md`.

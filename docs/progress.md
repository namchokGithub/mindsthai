# MindsThai Implementation Plan

**Status:** Foundation approved; later phases require separate review and approval.

**Goal:** Establish a publish-ready TypeScript library foundation and deliver Thai-language processing capabilities in reviewed P1, P2, and P3 milestones.

**Architecture:** Keep the runtime framework-independent and split public APIs into romanization, normalization, and segmentation modules. Publish ESM and declarations through explicit root and subpath exports; keep internal modules private.

**Tech stack:** TypeScript (strict), pnpm, tsdown, Vitest, GitHub Actions. No production dependencies are planned initially.

**Source:** `note.md`. The existing `AGENTS.md` remains authoritative for project decisions and local verification.

## Constraints

- Package name: `@mindskit/thai`; MIT license. Confirm npm scope ownership before any future publication.
- Support browsers and Node.js without runtime network requests, Node-specific runtime APIs, a server, or UI framework.
- Keep public functions synchronous; validate arguments and document empty input and preservation of non-Thai text.
- Do not claim full RTGS correctness or Thai word segmentation from character substitution or space splitting.
- Preserve existing changes, including `.gitignore`; do not commit, push, tag, or publish.
- Get approval for user-visible behavior, API decisions, dependencies, runtime requirements, and changes in scope before implementing them.
- Run only newly added or changed test files locally. Do not run builds or the full suite without explicit permission; CI may be configured to run the checks in `note.md`.

## Decisions to review before implementation

- [x] Proceed in stages: foundation first; later phases require separate approval.
- [x] Use Node.js 24 as the minimum and Node.js 26 LTS in CI; use compatible stable tooling.
- [x] Normalize the entire input to NFC; do not apply additional Thai mark ordering, whitespace changes, or spelling corrections. Return empty input unchanged and throw `TypeError` for non-string input.
- [x] Return `string[]` using `Intl.Segmenter('th')` with word or sentence granularity, preserving all text. Return `[]` for empty input, throw `TypeError` for non-strings, and report missing `Intl.Segmenter` for non-empty input. Document ICU and locale variability.
- [x] Ship a limited three-word romanization prototype with `rtgs` and `casual` readings; preserve unknown segments and existing spacing, and document the source and limitations.
- [ ] Before P2, approve syllable segmentation and number-reading behavior, accepted number formats and range, digit conversion rules, and the shape of analysis results.
- [ ] Before P3, approve dictionary and spell-checking data sources and licensing, custom entry and override formats, ambiguity handling, suggestions, and any effect on package size or runtime resources.
- [x] Authorize the Phase 5 build, full test run, and package dry-run for distribution verification.

## Planned files

- `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `tsdown.config.ts`, optionally `vitest.config.ts`: package metadata, tooling, and build configuration.
- `src/index.ts`, `src/romanization/index.ts`, `src/normalization/index.ts`, `src/segmentation/index.ts`: public entry points and approved APIs; add focused internal modules only when needed.
- `tests/normalization.test.ts`, `tests/segmentation.test.ts`, `tests/romanization.test.ts`, `tests/package-exports.test.ts`: focused behavior and distribution checks as each capability is implemented.
- P2 and P3 source modules and focused test files: choose their paths and public subpaths when their API and packaging decisions are approved.
- `.github/workflows/ci.yml`: install, typecheck, test, and build on pull requests and pushes to `main`, without publication.
- `README.md`, `AGENTS.md`, `docs/architecture.md`, `docs/roadmap.md`, `docs/progress.md`: usage, project conventions, design, roadmap, and progress.
- `LICENSE`: inspect and retain the existing MIT license if correct; change it only if necessary and approved.

## Phase 1 — Foundation

- [x] Inspect the existing license and repository configuration; preserve intentional content.
- [x] Configure the private ESM package, strict TypeScript, pnpm, tsdown, Vitest, and a lockfile. Whitelist distributed files; add exports when implemented modules exist.
- [x] Establish the root entry point without presenting unimplemented APIs as working; defer feature modules and types until their behavior is approved.
- [x] Add CI for frozen installation, typechecking, tests, and build, without publishing or release automation.
- [x] Update `README.md` and `AGENTS.md` for the foundation and library conventions, preserving existing rules.
- [x] Add `docs/architecture.md` and `docs/roadmap.md` with P1 status and planned P2/P3 APIs.

Foundation verification: dependency installation and `pnpm typecheck` succeeded on Node.js 26.7.0. No tests were added or run. Build, package validation, Node.js 24 compatibility, and CI execution remain unverified; restricted checks require explicit authorization. The package is private and has no public exports yet.

## Phase 2 — Normalization

- [x] Define `normalizeThai(text: string): string` without options and configure root and `./normalization` exports.
- [x] Add focused tests for composed/decomposed Unicode, Thai marks, whitespace, mixed scripts, empty and invalid inputs, and idempotence; run the changed test file before implementation.
- [x] Implement NFC behavior and document its guarantees and limitations. The focused tests and typecheck pass; a build and installed-package export check remain unverified under the current check restrictions.

## Phase 3 — Segmentation

- [x] Define `segmentWords(text: string): string[]` and `segmentSentences(text: string): string[]` without options; configure root and `./segmentation` exports.
- [x] Add focused tests for Thai, mixed scripts and digits, punctuation, whitespace, empty and invalid inputs, sentence boundaries, and unavailable `Intl.Segmenter`; run the changed test file before implementation.
- [x] Implement the approved strategies and missing-API error; document ICU and locale limitations. Focused tests and typecheck pass; build and installed-package exports remain unverified under current check restrictions.

## Phase 4 — Romanization

- [x] Record the approved decision to ship a bounded prototype.
- [x] Define `romanize(text, { style })`, its types, supported inputs and fallback, and configure root/`./romanization` exports.
- [x] Add reviewable fixtures for supported readings, both styles, unknown words, punctuation, numerals, empty and invalid input; run the changed test file before implementation.
- [x] Implement and document the limited lookup and process for extending lexical data. Focused tests and typecheck pass; build and installed-package exports remain unverified under current check restrictions.

## Phase 5 — Distribution and handoff

- [x] Add installed-package checks for public JavaScript exports, declarations, package contents, and blocked internal paths.
- [x] Update the README with implemented APIs, installation availability, environments, linguistic limitations, development commands, roadmap, and license.
- [x] Run typecheck, the full test run, build, and package dry-run/consumer check with explicit approval.
- [x] Record results, limitations, and the next recommended task.

Phase 5 verification on Node.js 26.7.0: `pnpm typecheck` passed; `pnpm build` passed with a TypeScript 7.0 generator deprecation warning; `pnpm test` passed 32 tests in 4 files; `npm pack --dry-run` listed 11 files. The installed-package test checks runtime and TypeScript imports for all four entry points. Node.js 24, browsers, and CI have not been exercised. The package remains private at version 0.0.0, and npm scope ownership must be confirmed before publication. Next: review Phase 6 syllable segmentation behavior before implementation.

## Phase 6 — P2: Syllable segmentation

- [x] Define and approve `segmentSyllables(text: string): string[]` as a bounded word-based lookup, preserving unknown segments; export from root and `./segmentation`.
- [x] Select reviewable Thai fixtures for two multi-syllable words and cover unknown or ambiguous words, mixed scripts, punctuation, empty strings, and invalid arguments.
- [x] Add and run the focused test file before and after implementing the approved strategy.
- [x] Document supported words, sources, limitations, and the process for extending the lexical data.

Phase 6 verification: focused syllable tests and typecheck passed. Build and installed-package verification for the new export were not run; the prior Phase 5 build does not include this change.

## Phase 7 — P2: Thai digits and number reading

- [x] Approve digit conversions preserving other text, and `readThaiNumber(value: number)` for integers 0–999,999 without rounding; configure root and `./numbers` exports.
- [x] Add focused conversion tests for all ten digits, round trips, mixed scripts, punctuation, empty strings, and invalid inputs; run them before and after implementation.
- [x] Define and approve number input, zero, range, and error behavior; negative zero reads as zero, while negative values, fractions, and non-finite values are rejected.
- [x] Add reviewable number-reading fixtures for the approved range and boundary cases; run the focused test file before and after implementation.
- [x] Document conversion guarantees and number-reading limitations.

Phase 7 verification: focused number tests and typecheck passed. Package export checks were extended but require a new build and were not run; the existing build does not contain the new exports.

## Phase 8 — P2: Text analysis

- [x] Define and approve `analyzeThai(text: string): ThaiTextAnalysis` with Unicode and Thai-block code point counts and existing segmentation results; configure root and `./analysis` exports.
- [x] Add focused tests for Thai, mixed scripts, punctuation, empty and invalid input, and consistency with the underlying APIs; run the new test file before and after implementation.
- [x] Document what each result measures and inherited segmentation and runtime limitations.

Phase 8 verification: focused analysis tests and typecheck passed. Package export checks were extended but require a new build and were not run; the existing build does not contain the new exports.

## Phase 9 — P3: Dictionary

- [x] Approve exact NFC-normalized `lookupWord` and per-call custom entry APIs, duplicate handling, and unknown-entry results.
- [x] Use two short, locally authored MIT-licensed entries with documented factual references; no runtime data fetching.
- [x] Add focused tests for known and unknown entries, custom entries, duplicates, mixed text, empty and invalid inputs, and result isolation; run the new test file before and after implementation.
- [x] Document data provenance, licensing, limitations, extension instructions, and configured exports.

Phase 9 verification: focused dictionary tests and typecheck passed. Package export checks were extended but require a new build and were not run; the existing build does not contain the new exports.

## Phase 10 — P3: Spell checking

- [x] Define and approve `checkSpelling(text, options?)` with Thai-consonant word segments, UTF-16 offsets, dictionary membership status, custom entries, and no suggestions.
- [x] Add focused fixtures for known and unknown words, mixed scripts, punctuation, empty and invalid inputs, offsets, and custom entries. Unknown is not classified as misspelled.
- [x] Run the new focused test file before and after implementation and document limited dictionary coverage and the absence of suggestions.

Phase 10 verification: focused spell-checking tests and typecheck passed. Package export checks were extended but require a new build and were not run; the existing build does not contain the new exports.

## Phase 11 — P3: Romanization and pronunciation overrides

- [x] Approve per-call overrides for style-specific romanization and explicit pronunciation lookup, with NFC matching and defined fallback behavior.
- [x] Add focused tests for matching and nonmatching entries, conflicting mappings, mixed text, punctuation, empty and invalid inputs, and precedence; run the new test file before and after implementation.
- [x] Implement the approved override behavior and document examples, limitations, and per-call data management.

Phase 11 verification: focused override tests and typecheck passed. Package export checks were extended but require a new build and were not run; the existing build does not contain the new exports.

## Phase 12 — P2/P3 integration and release readiness

- [ ] Update the README, architecture, roadmap, and this progress file as each approved capability ships; expose only implemented APIs and document all new public subpaths.
- [ ] Extend focused export and declaration checks for each approved subpath and verify interoperability among segmentation, dictionary, spell checking, and overrides.
- [ ] Reassess runtime compatibility, package contents, side effects, bundle size, data licenses, and linguistic limitations. Request explicit authorization for any restricted build, full-suite run, or package dry-run.
- [ ] Record completed and skipped checks, unresolved decisions and limitations, and the next recommended milestone. Publishing, tagging, and pushing remain separate user decisions.

## Review focus

- Unsupported segmentation runtime: the approved fallback or clear error is tested.
- Mixed Thai, Latin text, digits, and punctuation: preservation and boundaries match the approved contract.
- Unknown or ambiguous Thai romanization: no unsupported pronunciation is silently invented.
- Invalid inputs and empty strings: each exported API follows its documented contract.
- Installed package imports and declarations: root and each implemented subpath resolve without exposing internals, when packaging verification is authorized.

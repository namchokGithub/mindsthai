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
- [ ] Define normalization rules, including Unicode form, Thai mark ordering, whitespace, invalid arguments, and non-Thai preservation.
- [ ] Choose segmentation return types and treatment of whitespace and punctuation; decide what happens when `Intl.Segmenter` is unavailable and document ICU variability. Define a separate sentence strategy.
- [ ] Decide whether romanization remains a documented pending milestone or ships as a limited prototype; if implemented, approve its supported vocabulary, unknown-text fallback, and RTGS/casual distinctions using independently verified fixtures.
- [ ] Before P2, approve syllable segmentation and number-reading behavior, accepted number formats and range, digit conversion rules, and the shape of analysis results.
- [ ] Before P3, approve dictionary and spell-checking data sources and licensing, custom entry and override formats, ambiguity handling, suggestions, and any effect on package size or runtime resources.
- [ ] Explicitly authorize any final build, full test run, and package dry-run needed to verify distribution; these conflict with the current local check restrictions unless requested.

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

- [ ] After behavior approval, define the options and return type for `normalizeThai(text, options?)` and publish it from the root and `./normalization`.
- [ ] Add focused tests for composed/decomposed Unicode, approved ordering and whitespace rules, mixed scripts, empty and invalid inputs, and idempotence; run the changed test file and confirm failures before implementation.
- [ ] Implement the smallest behavior supported by those tests and rerun the changed test file. Document exact guarantees and limitations.

## Phase 3 — Segmentation

- [ ] After strategy approval, define options and return types for `segmentWords` and `segmentSentences`; export them from the root and `./segmentation`.
- [ ] Add focused tests for Thai, mixed scripts and digits, punctuation, whitespace, empty and invalid inputs, sentence boundaries, and unavailable `Intl.Segmenter`; run the changed test file before implementation.
- [ ] Implement the approved strategies and fallback; rerun the changed test file. Document runtime support and any differences caused by ICU.

## Phase 4 — Romanization

- [ ] Record the approved decision to defer the algorithm or ship a bounded prototype. A deferred algorithm must not be represented as a functioning API.
- [ ] If a prototype is approved, define `romanize(text, { style })`, its types, explicit supported inputs and fallback, and root/`./romanization` exports.
- [ ] Add independently reviewable fixtures for supported readings, both styles, unknown words, punctuation, numerals, empty and invalid input; run the changed test file before implementation.
- [ ] Implement only behavior supported by the fixtures, rerun the changed test file, and document the limitations and process for extending lexical data. Do not invent readings.

## Phase 5 — Distribution and handoff

- [ ] Add focused checks for root and subpath exports and declaration paths, including an installed-package consumer when a build and package check are authorized.
- [ ] Complete the README using only implemented APIs and reliable examples; document installation availability, environments, linguistic limitations, development commands, roadmap, and license.
- [ ] If explicitly authorized, run typecheck, the full test run, build, and a package dry-run/consumer check once; report actual results and any skipped checks. Otherwise report that publish readiness is unverified.
- [ ] Update this file with completed tasks, decisions, unresolved limitations, and the next recommended task. Suggest a Conventional Commit based on staged changes if present, otherwise unstaged changes.

## Phase 6 — P2: Syllable segmentation

- [ ] Define and approve `segmentSyllables(text, options?)`, its return type, boundary rules, handling of ambiguous or unknown text, and relationship to word segmentation. Choose its public export path.
- [ ] Select independently reviewable Thai fixtures covering multi-syllable words, ambiguous boundaries, mixed scripts, punctuation, empty strings, and invalid arguments; mark cases without validated expectations as pending.
- [ ] Add and run the new focused test file to establish the expected failures; implement the approved bounded strategy and rerun the file.
- [ ] Document supported cases, limitations, and any lexical data required; update exports and usage examples only for implemented behavior.

## Phase 7 — P2: Thai digits and number reading

- [ ] Define and approve `toThaiDigits(text)` and `toArabicDigits(text)`, including mixed text, existing target digits, empty strings, and invalid inputs. Choose their public export path.
- [ ] Add focused conversion tests for all ten digits, round trips, mixed scripts, punctuation, empty strings, and invalid inputs; run them before and after implementation.
- [ ] Define and approve `readThaiNumber(value, options?)`, including accepted input types, supported range and precision, zero, signs, decimals, and unsupported values. Do not silently round or invent readings.
- [ ] Add independently verified number-reading fixtures for the approved range and boundary cases; run the new focused test file before and after implementing the approved behavior.
- [ ] Document conversion guarantees, number-reading limitations, and implemented exports.

## Phase 8 — P2: Text analysis

- [ ] Define and approve `analyzeThai(text, options?)`, its result type, measurements, and how it composes existing APIs; choose its public export path.
- [ ] Add focused tests for Thai, mixed scripts, punctuation, empty and invalid input, and consistency with the underlying APIs; run the new test file before and after implementation.
- [ ] Document exactly what each result measures and any inherited segmentation or runtime limitations.

## Phase 9 — P3: Dictionary

- [ ] Define and approve lookup and custom-entry APIs, entry schema, matching and normalization rules, duplicate handling, and unknown-entry results.
- [ ] Select independently reviewable, legally usable lexical data and approve its size, packaging, provenance, and update process. Do not fetch data at runtime.
- [ ] Add focused tests for known and unknown entries, custom entries, duplicates, mixed text, empty and invalid inputs, and deterministic results; run the new test file before and after implementation.
- [ ] Document data provenance, licensing, limitations, extension instructions, and implemented exports.

## Phase 10 — P3: Spell checking

- [ ] Define and approve `checkSpelling(text, options?)`, its result type, token boundaries, unknown-word behavior, suggestion ordering and limits, and custom dictionary integration.
- [ ] Add independently reviewed fixtures for correct, misspelled, ambiguous, unknown, and mixed-script text; test deterministic suggestions, punctuation, empty and invalid inputs, and custom entries.
- [ ] Run the new focused test file before and after implementing the approved strategy. Document that dictionary coverage and suggestions do not guarantee linguistic correctness.

## Phase 11 — P3: Romanization and pronunciation overrides

- [ ] Define and approve custom mapping APIs and data format, precedence over built-in readings, matching boundaries, ambiguity behavior, and interaction with RTGS and casual styles.
- [ ] Add focused tests for matching and nonmatching entries, conflicting mappings, mixed text, punctuation, empty and invalid inputs, and deterministic precedence; run the new test file before and after implementation.
- [ ] Implement only the approved override behavior and document examples, limitations, and how callers manage their mappings.

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

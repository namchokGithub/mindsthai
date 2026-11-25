# Architecture

MindsThai is a framework-independent, synchronous TypeScript library with no runtime network requests or production dependencies. Its first API, `normalizeThai`, applies Unicode NFC without extra Thai-specific rewriting.

The P1 modules are romanization, normalization, and segmentation. Each owns its public types and behavior; the root entry point re-exports implemented APIs. All three subpaths are configured. Internal helpers and lexical data remain outside the public exports.

The distribution is intended to contain ESM JavaScript and TypeScript declarations only. Package exports and installed-consumer compatibility must be verified before publication. The package remains private during early development.

Thai language behavior must be documented and backed by reviewable fixtures. The romanization prototype looks up supported whole-word segments and preserves unknown segments; it is not full RTGS. Segmentation uses `Intl.Segmenter` with word or sentence granularity, retains every segment, and throws for non-empty input if the API is missing. The runtime's locale and ICU data determine boundaries, including any locale fallback. See [the roadmap](roadmap.md) for later capabilities and [the progress plan](progress.md) for open decisions.

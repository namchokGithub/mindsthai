# Architecture

MindsThai is a framework-independent, synchronous TypeScript library with no runtime network requests or production dependencies. Its first API, `normalizeThai`, applies Unicode NFC without extra Thai-specific rewriting.

The planned P1 modules are romanization, normalization, and segmentation. Each owns its public types and behavior; the root entry point re-exports implemented APIs. The normalization subpath is configured; other explicit subpaths will be added when their modules exist. Internal helpers and lexical data will remain outside the public exports.

The distribution is intended to contain ESM JavaScript and TypeScript declarations only. Package exports and installed-consumer compatibility must be verified before publication. The package remains private during early development.

Thai language behavior must be documented and backed by reviewable fixtures. Romanization needs context, and a limited prototype must not be described as full RTGS. Segmentation must document its boundary strategy, runtime requirements, and any fallback. See [the roadmap](roadmap.md) for later capabilities and [the progress plan](progress.md) for open decisions.

# Architecture

MindsThai is intended to be a framework-independent, synchronous TypeScript library with no runtime network requests or production dependencies initially. The foundation currently exposes no public API.

The planned P1 modules are romanization, normalization, and segmentation. Each will own its public types and behavior; the root entry point will re-export implemented APIs. Explicit subpaths will be added when their modules exist. Internal helpers and lexical data will remain outside the public exports.

The distribution is intended to contain ESM JavaScript and TypeScript declarations only. Package exports and installed-consumer compatibility must be verified before publication. The package remains private during the foundation stage.

Thai language behavior must be documented and backed by reviewable fixtures. Romanization needs context, and a limited prototype must not be described as full RTGS. Segmentation must document its boundary strategy, runtime requirements, and any fallback. See [the roadmap](roadmap.md) for later capabilities and [the progress plan](progress.md) for open decisions.

# MindsThai

MindsThai is a planned lightweight, framework-independent TypeScript toolkit for Thai-language processing. It is a library, not a web application or hosted service.

The project is at the foundation stage: no public APIs or published package are available yet. Do not install or rely on `@mindskit/thai` until it has been published. There are no runtime network requests or production dependencies planned.

## Planned capabilities

- **P1:** normalization, word and sentence segmentation, and limited or deferred romanization.
- **P2:** syllable segmentation, Thai digit conversion, number reading, and text analysis.
- **P3:** spell checking, dictionary lookup, and custom pronunciation or romanization mappings.

See [the roadmap](docs/roadmap.md) and [progress plan](docs/progress.md). Romanization requires linguistic context; a character map alone is not a correct RTGS implementation. Thai word and sentence boundaries also require explicit strategies. Any eventual implementation will document its coverage and limitations.

## Development

Use Node.js 24 or newer and pnpm 11.24.0. CI uses Node.js 26.

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm test:watch
pnpm build
```

The runtime is intended to support browsers and Node.js; supported environments will be specified and verified as APIs are implemented. See [architecture](docs/architecture.md) for the intended package layout.

## License

[MIT](LICENSE)

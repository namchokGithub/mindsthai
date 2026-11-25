# MindsThai

MindsThai is a planned lightweight, framework-independent TypeScript toolkit for Thai-language processing. It is a library, not a web application or hosted service.

The project is in early development and has not been published. Do not install `@mindskit/thai` until it has been published. There are no runtime network requests or production dependencies.

## Normalization

`normalizeThai(text: string): string` applies Unicode NFC to the entire input, including non-Thai text. It preserves whitespace and punctuation and makes no additional Thai-specific mark ordering or spelling corrections. Empty input returns an empty string; non-string input throws `TypeError`. Unicode normalization may change the representation of non-Thai text while preserving canonical equivalence.

Once the package is published, the function can be imported from the root or normalization subpath:

```ts
import { normalizeThai } from "@mindskit/thai";
// Alternatively: import { normalizeThai } from "@mindskit/thai/normalization";

normalizeThai("สวัสดี cafe\u0301"); // "สวัสดี café"
```

Package builds and installed imports have not yet been verified.

## Planned capabilities

- **P1:** NFC normalization is implemented; word and sentence segmentation and limited or deferred romanization are planned.
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

# MindsThai

MindsThai is a planned lightweight, framework-independent TypeScript toolkit for Thai-language processing. It is a library, not a web application or hosted service.

The project is in early development and has not been published. Do not install `@mindskit/thai` until it has been published. There are no runtime network requests or production dependencies.

After publication, install it with `pnpm add @mindskit/thai`. The package is currently private and not ready for publication.

## Normalization

`normalizeThai(text: string): string` applies Unicode NFC to the entire input, including non-Thai text. It preserves whitespace and punctuation and makes no additional Thai-specific mark ordering or spelling corrections. Empty input returns an empty string; non-string input throws `TypeError`. Unicode normalization may change the representation of non-Thai text while preserving canonical equivalence.

Once the package is published, the function can be imported from the root or normalization subpath:

```ts
import { normalizeThai } from "@mindskit/thai";
// Alternatively: import { normalizeThai } from "@mindskit/thai/normalization";

normalizeThai("สวัสดี cafe\u0301"); // "สวัสดี café"
```

The root and normalization imports are covered by an installed-package check.

## Segmentation

`segmentWords(text: string): string[]` uses `Intl.Segmenter` with the Thai locale and word granularity; `segmentSentences(text: string): string[]` uses sentence granularity. Both preserve all input characters, including punctuation and whitespace, so joining the returned segments reconstructs the input. Empty input returns `[]`; non-string input throws `TypeError`.

For non-empty input, both functions require `Intl.Segmenter` and throw an error if it is unavailable. Results depend on the runtime's locale and ICU data and can vary across environments; Thai locale support is not independently checked. Sentence segmentation does not treat every space as a sentence boundary and may not identify every Thai sentence.

```ts
import { segmentWords, segmentSentences } from "@mindskit/thai";
// Alternatively: import from "@mindskit/thai/segmentation".

const words = segmentWords("ฉันชอบเขียนโปรแกรม");
const sentences = segmentSentences("สวัสดีครับ วันนี้อากาศดี");
```

These imports are available after publication and are covered by an installed-package check.

### Syllable segmentation prototype

`segmentSyllables(text: string): string[]` first uses `segmentWords`, then splits only the following whole-word segments at documented written boundaries:

| Word | Segments |
| --- | --- |
| มะนาว | มะ · นาว |
| มะละกอ | มะ · ละ · กอ |

The syllable readings can be reviewed in the Thai Wiktionary entries for [มะนาว](https://th.wiktionary.org/wiki/มะนาว) and [มะละกอ](https://th.wiktionary.org/wiki/มะละกอ). The original characters are preserved; joining the results reconstructs the input. Unknown words and words without a supported written split remain whole word segments. The returned array does not distinguish verified syllables from unchanged segments, and this prototype is not a general Thai syllable segmenter.

Empty input returns `[]`; non-string input throws `TypeError`. Non-empty input requires `Intl.Segmenter`, and word boundaries may vary with runtime locale and ICU data. Extend the table only with independently reviewable written boundaries and focused tests; do not guess ambiguous splits.

```ts
import { segmentSyllables } from "@mindskit/thai/segmentation";

segmentSyllables("มะนาว"); // ["มะ", "นาว"]
```

The new export has not yet been checked in a built, installed package.

## Romanization prototype

`romanize(text: string, options: RomanizationOptions): string` requires `style: "rtgs"` or `style: "casual"`. It is a limited whole-word lookup, not a general RTGS engine. Its complete vocabulary is:

| Thai | RTGS | Casual |
| --- | --- | --- |
| สวัสดี | sawatdi | sawasdee |
| ครับ | khrap | krap |
| ค่ะ | kha | kha |

The RTGS readings can be checked against [this educational document](https://media.bpi.ac.th/admin/attach/w2/f20241017150428_N2cZHPqMNJ.pdf). Casual spellings are informal and do not follow a formal standard. Word boundaries come from `segmentWords`, so matching depends on runtime locale and ICU data. Unknown segments remain unchanged; the lookup cannot resolve contextual ambiguity. No spaces are added between converted segments: `สวัสดีครับ` becomes `sawatdikhrap` in RTGS style. Other scripts, digits, punctuation, and existing whitespace are preserved.

Empty input returns an empty string; invalid text or style throws `TypeError`. Non-empty input requires `Intl.Segmenter`. To extend the vocabulary, add whole-word readings for both styles with independently reviewable sources and focused tests; do not add ambiguous readings without an explicit policy.

```ts
import { romanize } from "@mindskit/thai";
// Alternatively: import { romanize } from "@mindskit/thai/romanization";

romanize("สวัสดี ค่ะ", { style: "casual" }); // "sawasdee kha"
```

These imports are available after publication and are covered by an installed-package check.

## Thai numbers

`toThaiDigits(text: string): string` converts ASCII digits `0–9` to Thai digits `๐–๙`. `toArabicDigits(text: string): string` converts in the opposite direction. Both preserve all other characters, including digits already in the target script; empty input returns an empty string. Non-string input throws `TypeError`.

`readThaiNumber(value: number): string` reads integer cardinal numbers from 0 to 999,999. For example, 0 is `ศูนย์`, 21 is `ยี่สิบเอ็ด`, and 101 is `หนึ่งร้อยเอ็ด`. It throws `TypeError` for non-number input and `RangeError` for fractions, non-finite values, negative values, or numbers above 999,999. Negative zero is treated as zero. It does not round or parse strings. The reading fixtures can be checked against [this university teaching material](https://yri.mbu.ac.th/wp-content/uploads/2024/04/Fulltext-%E0%B8%97%E0%B8%AD%E0%B8%87%E0%B8%84%E0%B8%B3-%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%84%E0%B8%93%E0%B8%B0-14-01-67.pdf).

```ts
import { toThaiDigits, toArabicDigits, readThaiNumber } from "@mindskit/thai/numbers";

toThaiDigits("123"); // "๑๒๓"
toArabicDigits("๑๒๓"); // "123"
readThaiNumber(21); // "ยี่สิบเอ็ด"
```

The functions are also exported from the root. The new exports have not yet been checked in a built, installed package.

## Text analysis

`analyzeThai(text: string): ThaiTextAnalysis` returns:

- `codePointCount`: Unicode code points in the entire input, including whitespace, punctuation, and combining marks. This is not necessarily the number of visible characters.
- `thaiBlockCodePointCount`: code points in the Unicode Thai block `U+0E00–U+0E7F`, including Thai digits and marks.
- `wordSegments` and `sentenceSegments`: results from `segmentWords` and `segmentSentences`. These retain whitespace and punctuation and are not guaranteed linguistic word or sentence counts.

Empty input returns zero counts and empty arrays; non-string input throws `TypeError`. Non-empty input requires `Intl.Segmenter`, and segment boundaries depend on runtime locale and ICU data.

```ts
import { analyzeThai } from "@mindskit/thai/analysis";

const result = analyzeThai("ไทย");
// { codePointCount: 3, thaiBlockCodePointCount: 3, wordSegments: ["ไทย"], sentenceSegments: ["ไทย"] }
```

The function and `ThaiTextAnalysis` type are also exported from the root. The new exports have not yet been checked in a built, installed package.

## Dictionary prototype

`lookupWord(word: string, options?: DictionaryOptions): DictionaryEntry | undefined` performs an exact lookup after NFC normalization. It does not trim or segment the query. Unknown and empty queries return `undefined`.

The complete built-in vocabulary is `มะนาว` → `lime` and `มะละกอ` → `papaya`. These short labels were authored for this project and are distributed under its MIT license; factual references include the Thai government's [lime standard](https://lib1.dss.go.th/bsti/index.php/en/registration-form/4165-2020-05-05-09-01-19) and [papaya plant information](https://doaplant.doa.go.th/GardFront/GardGenInfoDetail/77). This is a prototype, not a comprehensive dictionary.

```ts
import { lookupWord } from "@mindskit/thai/dictionary";

lookupWord("มะนาว"); // { word: "มะนาว", meaning: "lime" }
lookupWord("ส้ม", { entries: [{ word: "ส้ม", meaning: "orange" }] });
```

Each custom entry has non-empty `word` and `meaning` strings. Custom entries apply only to that call and override a matching built-in entry. Duplicate custom words after NFC normalization, invalid entries, or invalid arguments throw `TypeError`. Returned entries are copies; the returned `word` is normalized to NFC. Entries are neither persisted nor fetched from a network. New built-in entries require independently reviewable sources and focused tests.

The function and `DictionaryEntry` and `DictionaryOptions` types are also exported from the root. The new exports have not yet been checked in a built, installed package.

## Planned capabilities

- **P1:** NFC normalization, word and sentence segmentation, and a limited romanization prototype are implemented.
- **P2:** a limited syllable segmentation prototype, Thai digit conversion, number reading, and text analysis are implemented.
- **P3:** a limited dictionary prototype is implemented; spell checking and custom pronunciation or romanization mappings are planned.

See [the roadmap](docs/roadmap.md) and [progress plan](docs/progress.md). General Thai romanization requires linguistic context beyond the prototype's small lookup table.

## Development

Use Node.js 24 or newer and pnpm 11.24.0. CI uses Node.js 26.

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm build
pnpm test
pnpm test:watch
```

Build before running the full test suite: the package export tests install the built tarball in a temporary consumer. Rebuild after changes that affect the distributed output. The runtime is intended to support browsers and Node.js; installed-package checks have run on Node.js 26, while Node.js 24 and browser compatibility remain unverified. See [architecture](docs/architecture.md) for the package layout.

## License

[MIT](LICENSE)

import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "analysis/index": "src/analysis/index.ts",
    "dictionary/index": "src/dictionary/index.ts",
    "normalization/index": "src/normalization/index.ts",
    "numbers/index": "src/numbers/index.ts",
    "romanization/index": "src/romanization/index.ts",
    "segmentation/index": "src/segmentation/index.ts",
    "spell-checking/index": "src/spell-checking/index.ts",
  },
  format: "esm",
  dts: true,
  clean: true,
});

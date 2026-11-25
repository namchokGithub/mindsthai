import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "normalization/index": "src/normalization/index.ts",
    "romanization/index": "src/romanization/index.ts",
    "segmentation/index": "src/segmentation/index.ts",
  },
  format: "esm",
  dts: true,
  clean: true,
});

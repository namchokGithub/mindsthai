import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "normalization/index": "src/normalization/index.ts",
  },
  format: "esm",
  dts: true,
  clean: true,
});

/// <reference types="node" />
import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import swc from "unplugin-swc";

// Get base path from environment variable, default to '/' for local dev
// For GitHub Pages, set VITE_BASE_PATH to your repository name (e.g., '/1shotpay-sdk/')
const base = process.env.VITE_BASE_PATH || "/";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base,
  root: "./src/test",
  plugins: [
    // Transpile TypeScript with decorators (e.g. @injectable in common/utils/TimeUtils)
    swc.vite({ tsconfigFile: path.resolve(__dirname, "tsconfig.json") }),
  ],
  // Resolve workspace packages to source for local dev (no need to rebuild between changes).
  // Common uses bare "types/" and "utils/" internally; alias them for bundling.
  resolve: {
    alias: {
      "@1shotapi/1shotpay-client-sdk": path.resolve(
        __dirname,
        "src/client/index.ts",
      ),
      "@1shotapi/1shotpay-common": path.resolve(
        __dirname,
        "src/common/index.ts",
      ),
      types: path.resolve(__dirname, "src/common/types"),
      utils: path.resolve(__dirname, "src/common/utils"),
    },
  },
  server: {
    port: 3300,
    open: true,
    allowedHosts: ["1shotpay.com"],
  },
  build: {
    outDir: "../../docs",
    emptyOutDir: true,
  },
});

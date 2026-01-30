import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { fixupPluginRules } from "@eslint/compat";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import _import from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import typescript from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  // Ignore patterns (kept in sync with .eslintignore; flat config does not read .eslintignore)
  {
    ignores: [
      "node_modules",
      "**/node_modules/**",
      "dist",
      "**/dist/**",
      "dist-test",
      "**/dist-test/**",
      "build",
      "coverage",
      "docs/**",
      "out/**",
      ".yarn/**",
      ".pnp.*",
      "*.config.js",
      "*.config.ts",
      "*.config.mjs",
      "*.min.js",
      "*.bundle.js",
      ".git/**",
      "*.log",
      "src/test",
      "src/test/**",
    ],
  },

  // Base JavaScript recommended rules
  js.configs.recommended,

  // TypeScript support
  ...typescript.configs.recommended,

  // Import plugin (no Next.js in this repo)
  {
    plugins: {
      import: fixupPluginRules(_import),
    },
  },

  // Prettier plugin
  {
    plugins: {
      prettier: prettierPlugin,
    },
  },

  // Prettier integration (must be last to override other formatting rules)
  prettier,

  // Global rules
  {
    rules: {
      "prettier/prettier": "error",

      "arrow-parens": "off",
      "arrow-spacing": "off",
      "generator-star-spacing": "off",
      "no-confusing-arrow": "off",
      "no-mixed-operators": "off",
      "operator-linebreak": "off",
      "no-tabs": "off",
      "no-unexpected-multiline": "off",
      "object-curly-spacing": "off",
      "space-before-function-paren": "off",
      "space-in-parens": "off",

      "import/no-named-as-default": "off",
      "import/default": "off",
      "import/no-named-as-default-member": "off",
      "no-duplicate-imports": "error",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },

  // TypeScript-specific: type-aware linting using package tsconfigs
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: [
          "./src/common/tsconfig.json",
          "./src/client/tsconfig.json",
          "./src/server/tsconfig.json",
          "./src/examples/server/tsconfig.json",
        ],
        tsconfigRootDir: __dirname,
      },
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: [
            "./src/common/tsconfig.json",
            "./src/client/tsconfig.json",
            "./src/server/tsconfig.json",
            "./src/examples/server/tsconfig.json",
          ],
        },
      },
    },
    rules: {},
  },
];

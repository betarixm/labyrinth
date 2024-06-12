import parser from "@typescript-eslint/parser";
import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  ...eslintPluginAstro.configs.recommended,
  {
    plugins: {
      import: eslintPluginImport,
    },
    rules: {
      "import/order": [
        "error",
        {
          groups: [
            "type",
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          pathGroupsExcludedImportTypes: ["builtin"],
          pathGroups: [
            {
              pattern: "@/**",
              group: "external",
              position: "after",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.ts", "**/*.cts", "**.*.mts", "**/*.tsx", "**/*.jsx"],
    languageOptions: {
      parser: parser,
    },
  },
  {
    ...eslintPluginPrettierRecommended,
    ignores: ["**/*.astro"],
  },
];

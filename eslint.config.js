import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import markdown from "@eslint/markdown";
import {defineConfig} from "eslint/config";
import stylistic from '@stylistic/eslint-plugin'
import vitest from '@vitest/eslint-plugin'

export default defineConfig([
  {
    files: ['**/*.tests.ts'], // or any other pattern
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
    },
  },
  stylistic.configs.customize({ semi: true }),
  tseslint.configs.recommendedTypeChecked,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: {js},
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: ':matches(PropertyDefinition, MethodDefinition)[accessibility="private"]',
          message: 'Use #private instead',
        },
      ],
    },
  },
  {files: ["**/*.md"], plugins: {markdown}, language: "markdown/gfm", extends: ["markdown/recommended"]},
]);

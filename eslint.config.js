import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import markdown from "@eslint/markdown";
import {defineConfig} from "eslint/config";
import stylistic from '@stylistic/eslint-plugin'
import vitest from '@vitest/eslint-plugin'

const stylisticConfig = stylistic.configs.customize({semi: true});
export default defineConfig([
  {
    files: ['**/*.test.ts', '**/*.test-d.ts'],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
    },
    settings: {
      vitest: {
        typecheck: true,
      },
    },
  }, {
    ...stylisticConfig,
    rules: {
      ...stylisticConfig.rules,
      '@stylistic/array-bracket-newline': 'error',
    }
  }, {
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
  tseslint.configs.recommendedTypeChecked,
  {files: ["**/*.md"], plugins: {markdown}, language: "markdown/gfm", extends: ["markdown/recommended"]},
]);

// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  _comment:
    'This config was generated using \'stryker init\'. Please take a look at: https://stryker-mutator.io/docs/stryker-js/configuration/ for more information.',
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress'],
  testRunner: 'vitest',
  testRunner_comment:
    'Take a look at https://stryker-mutator.io/docs/stryker-js/vitest-runner for information about the vitest plugin.',
  coverageAnalysis: 'perTest',
  ignorePatterns: ['**/*.md', '**/*.test-d.ts'],
  mutate: ['src/**/*.ts', '!src/**/*.test.ts', '!src/SetLikeStub.ts', '!src/IntegerLessThan32.ts'],
};
export default config;

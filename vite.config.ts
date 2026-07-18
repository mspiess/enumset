/// <reference types="vitest/config" />
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';
import doctest from 'vite-plugin-doctest';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    dts({
      bundleTypes: true,
      tsconfigPath: resolve(__dirname, 'tsconfig.lib.json'),
    }),
    doctest({
      markdown: {
        preamble: `const { EnumSet } = await import('./src/main.ts');
    `,
      },
    })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'EnumSet',
      fileName: 'enumset',
    },
  },
  test: {
    includeSource: ['./**/*.md'],
  },
});

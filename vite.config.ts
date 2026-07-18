import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'unplugin-dts/vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [dts({
    bundleTypes: true,
    tsconfigPath: resolve(__dirname, 'tsconfig.lib.json'),
  })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'EnumSet',
      fileName: 'enumset',
    },
  },
});

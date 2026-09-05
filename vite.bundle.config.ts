import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {viteSingleFile} from 'vite-plugin-singlefile';

// Builds the whole game (JS, CSS, fonts) into one self-contained dist/index.html
// that runs offline by double-clicking the file. Run with: npm run build:single
export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), viteSingleFile()],
    // The game ships no public assets; skip copying public/ into dist.
    publicDir: false as const,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      // Keep assets inlined in the HTML rather than emitting separate files.
      assetsInlineLimit: 100000000,
      chunkSizeWarningLimit: 100000000,
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
        },
      },
    },
  };
});

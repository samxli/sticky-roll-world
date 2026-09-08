import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      // Split stable vendor libraries into their own chunks so returning
      // players only re-download the app code between deployments.
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/three/') || id.includes('node_modules/three-mesh-bvh/')) {
              return 'three';
            }
            if (
              id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/scheduler/')
            ) {
              return 'react';
            }
          },
        },
      },
      // three.js legitimately dominates the bundle; keep build output readable
      chunkSizeWarningLimit: 1000,
    },
  };
});

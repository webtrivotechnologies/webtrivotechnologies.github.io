import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

function copySeoStaticFiles() {
  return {
    name: 'copy-seo-static-files',
    closeBundle() {
      const files = ['robots.txt', 'sitemap.xml', '404.html'];
      for (const file of files) {
        const source = path.resolve(__dirname, file);
        if (fs.existsSync(source)) {
          fs.copyFileSync(source, path.resolve(__dirname, 'dist', file));
        }
      }

      const ogSource = path.resolve(__dirname, 'assets', 'og-webtrivo.svg');
      const ogTargetDir = path.resolve(__dirname, 'dist', 'assets');
      if (fs.existsSync(ogSource)) {
        fs.mkdirSync(ogTargetDir, {recursive: true});
        fs.copyFileSync(ogSource, path.join(ogTargetDir, 'og-webtrivo.svg'));
      }
    },
  };
}

export default defineConfig(() => {
  return {
    base: '/',
    plugins: [react(), tailwindcss(), copySeoStaticFiles()],
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name][extname]',
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

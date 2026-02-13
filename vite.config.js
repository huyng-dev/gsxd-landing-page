import { defineConfig } from 'vite';
import { resolve } from 'path';
import { glob } from 'glob';
import handlebars from 'vite-plugin-handlebars';

// Auto-scan all HTML files in src/pages
const htmlFiles = glob.sync('src/pages/**/*.html');

// Create input object for all HTML files
const input = {};
htmlFiles.forEach(file => {
  const name = file
    .replace('src/pages/', '')
    .replace('.html', '')
    .replace(/\//g, '-');
  input[name === 'index' ? 'index' : name] = resolve(__dirname, file);
});

export default defineConfig({
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, 'src/partials'),
    }),
  ],
  build: {
    rollupOptions: {
      input,
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});

import { defineConfig } from 'vite';
import { resolve } from 'path';
import { glob } from 'glob';
import handlebars from 'vite-plugin-handlebars';

// Auto-scan all HTML files (root index.html + */index.html)
const htmlFiles = glob.sync('{index.html,*/index.html}', {
  ignore: ['node_modules/**', 'dist/**'],
});

// Create input object for all HTML files
const input = {};
htmlFiles.forEach(file => {
  const dir = file.replace("/index.html", "").replace("index.html", "");
  const name = dir === "" ? "index" : dir;
  input[name] = resolve(__dirname, file);
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

import { defineConfig } from 'vite';
import { resolve } from 'path';
import { glob } from 'glob';
import handlebars from 'vite-plugin-handlebars';

// Auto-scan all HTML files
const htmlFiles = glob.sync('**/*.html', {
  ignore: ['node_modules/**', 'dist/**', 'src/**'],
});

// Create input object for all HTML files
const input = {};
htmlFiles.forEach(file => {
  const normalizedPath = file.replace(/\\/g, "/");
  let name = normalizedPath.replace(/\.html$/, "");
  if (name.endsWith("/index")) {
      name = name.replace(/\/index$/, "");
  }
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

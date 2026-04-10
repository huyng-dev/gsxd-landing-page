import { defineConfig } from 'vite';
import { resolve } from 'path';
import { glob } from 'glob';
import handlebars from 'vite-plugin-handlebars';

const STACK_PUSH_TOKEN = 'HB_PUSH';
const STACK_SLOT_TOKEN = 'HB_STACK';

function toStackPushMarker(stackName, content) {
  const encoded = Buffer.from(content, 'utf8').toString('base64');
  return `<!--${STACK_PUSH_TOKEN}:${stackName}:${encoded}-->`;
}

function toStackSlotMarker(stackName) {
  return `<!--${STACK_SLOT_TOKEN}:${stackName}-->`;
}

function resolveHandlebarsStacks(html) {
  const stacks = {};
  const pushPattern = new RegExp(
    `<!--${STACK_PUSH_TOKEN}:([a-zA-Z0-9_-]+):([A-Za-z0-9+/=]+)-->`,
    'g',
  );
  const slotPattern = new RegExp(
    `<!--${STACK_SLOT_TOKEN}:([a-zA-Z0-9_-]+)-->`,
    'g',
  );

  const htmlWithoutPush = html.replace(pushPattern, (_, stackName, encoded) => {
    try {
      const decoded = Buffer.from(encoded, 'base64').toString('utf8');
      if (!stacks[stackName]) {
        stacks[stackName] = [];
      }
      stacks[stackName].push(decoded);
    } catch {
      // Ignore malformed markers to avoid breaking page rendering.
    }

    return '';
  });

  return htmlWithoutPush.replace(slotPattern, (_, stackName) => {
    return (stacks[stackName] || []).join('\n');
  });
}

// Auto-scan all HTML files
const htmlFiles = glob.sync('**/*.html', {
  ignore: ['node_modules/**', 'dist/**', 'components/**', '**/partials/**'],
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
      // Keep config minimal: resolve partials by full workspace-relative path.
      partialDirectory: resolve(__dirname),
      helpers: {
        push(stackName, options) {
          if (!stackName || !options || typeof options.fn !== 'function') {
            return '';
          }

          return toStackPushMarker(stackName, String(options.fn(this)));
        },
        stack(stackName) {
          if (!stackName) {
            return '';
          }

          return toStackSlotMarker(stackName);
        },
      },
    }),
    {
      name: 'handlebars-stack-transform',
      transformIndexHtml(html) {
        return resolveHandlebarsStacks(html);
      },
    },
  ],
  build: {
    minify: false,
    cssMinify: false,
    rollupOptions: {
      input,
      output: {
        entryFileNames: 'assets/js/[name].js',
        chunkFileNames: 'assets/js/[name].js',
        assetFileNames: ({ name }) => {
          if (name && name.endsWith('.css')) {
            return 'assets/css/[name][extname]';
          }
          return 'assets/[name][extname]';
        },
      },
    },
  },
});

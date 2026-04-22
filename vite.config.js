import { defineConfig } from "vite";
import { resolve } from "path";
import { glob } from "glob";
import handlebars from "vite-plugin-handlebars";

const STACK_PUSH_TOKEN = "HB_PUSH";
const STACK_SLOT_TOKEN = "HB_STACK";

function toStackPushMarker(stackName, content) {
  const encoded = Buffer.from(content, "utf8").toString("base64");
  return `<!--${STACK_PUSH_TOKEN}:${stackName}:${encoded}-->`;
}

function toStackSlotMarker(stackName) {
  return `<!--${STACK_SLOT_TOKEN}:${stackName}-->`;
}

function resolveHandlebarsStacks(html) {
  const stacks = {};
  const pushPattern = new RegExp(
    `<!--${STACK_PUSH_TOKEN}:([a-zA-Z0-9_-]+):([A-Za-z0-9+/=]+)-->`,
    "g",
  );
  const slotPattern = new RegExp(
    `<!--${STACK_SLOT_TOKEN}:([a-zA-Z0-9_-]+)-->`,
    "g",
  );

  const htmlWithoutPush = html.replace(pushPattern, (_, stackName, encoded) => {
    try {
      const decoded = Buffer.from(encoded, "base64").toString("utf8");
      if (!stacks[stackName]) {
        stacks[stackName] = [];
      }
      stacks[stackName].push(decoded);
    } catch {
      // Ignore malformed markers to avoid breaking page rendering.
    }

    return "";
  });

  return htmlWithoutPush.replace(slotPattern, (_, stackName) => {
    return (stacks[stackName] || []).join("\n");
  });
}

// Auto-scan all HTML files
const htmlFiles = glob.sync("**/*.html", {
  ignore: ["node_modules/**", "dist/**", "components/**", "**/partials/**"],
});

// Create input object for all HTML files
const input = {};
htmlFiles.forEach((file) => {
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
          if (!stackName || !options || typeof options.fn !== "function") {
            return "";
          }

          return toStackPushMarker(stackName, String(options.fn(this)));
        },
        stack(stackName) {
          if (!stackName) {
            return "";
          }

          return toStackSlotMarker(stackName);
        },
        for(n, block) {
          let accum = "";
          for (let i = 0; i < n; ++i) {
            accum += block.fn(i);
          }
          return accum;
        },
      },
    }),
    {
      name: "handlebars-stack-transform",
      transformIndexHtml(html) {
        return resolveHandlebarsStacks(html);
      },
    },
  ],
  build: {
    // [Đã có] Không nén code
    minify: false,
    cssMinify: false,
    assetsInlineLimit: 0,

    // [THÊM MỚI] Làm sạch thư mục dist trước khi build để tránh rác từ file cũ
    emptyOutDir: true,

    //[THÊM MỚI] Tắt Module Preload
    // Mặc định Vite sẽ chèn rất nhiều thẻ <link rel="modulepreload"> vào HTML
    // Việc này gây rối mắt khi đọc file HTML trong dist. Tắt đi file HTML sẽ sạch như code gốc.
    modulePreload: { polyfill: false },

    rollupOptions: {
      input,
      output: {
        // [Đã có] Giữ nguyên tên file, không sinh mã hash
        entryFileNames: "assets/js/[name].js",
        chunkFileNames: "assets/js/[name].js",
        assetFileNames: ({ name }) => {
          if (name && name.endsWith(".css")) {
            return "assets/css/[name][extname]";
          }
          return "assets/images/[name][extname]"; // Đổi tên thư mục chung chung thành images (tùy chọn)
        },
      },
      // [THÊM MỚI] Bỏ cảnh báo giới hạn dung lượng file vì chúng ta không quan tâm performance
      onwarn(warning, warn) {
        if (warning.code === "CIRCULAR_DEPENDENCY" || warning.code === "EVAL")
          return;
        warn(warning);
      },
    },

    // [THÊM MỚI] Tắt sinh file .map (sourcemap)
    // Vì bạn muốn sửa thẳng trên file đã build ra, việc sinh file sourcemap
    // trỏ ngược về source gốc là không cần thiết và làm rác thư mục dist.
    sourcemap: false,
  },
});

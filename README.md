# GSXD Landing Page

A static multi-page website built with Vite, Tailwind CSS, and Handlebars partials.

This README describes the current codebase structure, build/render flow, page organization, and contribution workflow in clear English.

## Overview

| Item | Value |
|---|---|
| Project type | Static multi-page website |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 + PostCSS + Autoprefixer |
| Templating | Handlebars via `vite-plugin-handlebars` |
| Source page count | 41 HTML pages (excluding `components`, `partials`, `dist`, `node_modules`) |

## Routing Model

- Root page: `index.html`
- Cart pages:
  - `cart/gio-hang.html`
  - `cart/thanh-toan.html`
- Nested pages by section:
  - `about/index.html`
  - `contact/index.html`
  - `factory/index.html`
  - `faq/index.html`
  - `news/index.html`
  - `news/detail.html`
  - `projects/index.html`
  - `showroom/index.html`
  - `dich-vu-khach-hang/*`
  - `products/**`

## Requirements

- Node.js 18+
- npm 8+

Verify your environment:

```bash
node -v
npm -v
```

## Quick Start

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production output:

```bash
npm run preview
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build static production files into `dist/` |
| `npm run preview` | Preview the built site from `dist/` |

## Project Structure

```text
.
├─ index.html
├─ cart/
│  ├─ gio-hang.html
│  └─ thanh-toan.html
├─ about/
├─ contact/
├─ dich-vu-khach-hang/
├─ factory/
├─ faq/
├─ news/
├─ products/
├─ projects/
├─ showroom/
├─ assets/
│  ├─ css/main.css
│  ├─ images/
│  └─ js/main.js
├─ components/
│  ├─ header.html
│  ├─ footer.html
│  ├─ products/
│  └─ ...
├─ home/partials/
├─ news/partials/
├─ factory/partials/
├─ projects/partials/
├─ dich-vu-khach-hang/partials/
├─ tailwind.config.js
├─ postcss.config.js
└─ vite.config.js
```

## Build and Render Architecture

### 1) Multi-page HTML entry discovery

In `vite.config.js`, Vite auto-discovers `**/*.html` and ignores:

- `node_modules/**`
- `dist/**`
- `components/**`
- `**/partials/**`

That means all page HTML files are auto-included as build entries without manual `rollupOptions.input` maintenance.

### 2) Handlebars partial resolution

`vite-plugin-handlebars` is configured with `partialDirectory` at workspace root.

Example usage:

```html
{{> components/header}}
{{> components/footer}}
{{> home/partials/banner}}
```

### 3) Handlebars `push/stack` system

The project supports Larravel-Blade-like `push/stack` helpers:

- `{{#push "styles"}}...{{/push}}`
- `{{#push "scripts"}}...{{/push}}`
- `{{{stack "styles"}}}`
- `{{{stack "scripts"}}}`

Implementation detail:

- `push` writes marker tokens into generated HTML.
- A Vite `transformIndexHtml` hook resolves markers and injects collected stack content.
- This makes stack behavior independent of partial rendering order.

### Rendering flow at a glance

```text
Page HTML + Partials
        |
        v
Handlebars render (push emits markers)
        |
        v
Vite transformIndexHtml resolves markers
        |
        v
Final HTML with stack-injected styles/scripts
```

## Styling and Script Strategy

- Global/shared runtime stays in `assets/js/main.js`.
- Component-specific inline CSS/JS should stay in the component/partial that owns it.
- Wrap component/partial inline assets in `push` blocks so they are injected through page-level stacks.

Recommended pattern in partials/components:

```html
{{#push "styles"}}
<style>
  .example { color: #222; }
</style>
{{/push}}

{{#push "scripts"}}
<script>
  console.log("component script");
</script>
{{/push}}
```

Required in pages:

```html
<head>
  ...
  {{{stack "styles"}}}
</head>
<body>
  ...
  {{{stack "scripts"}}}
</body>
```

## Tailwind Content Scanning

`tailwind.config.js` currently scans:

- `./*.html`
- `./**/*.html`
- `./assets/js/**/*.js`
- `./components/**/*.html`
- `./**/partials/**/*.html`

If you add Tailwind classes in files outside these patterns, update Tailwind `content` config accordingly.

## How to Add New Pages

1. Create a new HTML page in root or a nested folder.
2. Add page-specific markup and optional inline page code.
3. Reuse components/partials via Handlebars includes.
4. Ensure the page contains both stack placeholders:
   - `{{{stack "styles"}}}` before `</head>`
   - `{{{stack "scripts"}}}` before `</body>`
5. Run `npm run dev` and validate route rendering.

## How to Add New Partials/Components

1. Add shared partials in `components/`.
2. Add page-scoped partials under relevant `*/partials/` folder.
3. Keep local CSS/JS in the same partial/component file.
4. Wrap inline `<style>` and `<script>` using `push` blocks.
5. Include partials in pages with clear, explicit paths.

## Local-only Folders

The following folders are local workspace folders and should not be pushed:

- `.vscode/`
- `.agents/`

If they were accidentally tracked before:

```bash
git rm -r --cached .vscode .agents
git commit -m "chore: stop tracking local editor and agent folders"
git push
```

## Troubleshooting

### Styles not updating

- Verify class names are in files matched by Tailwind `content` globs.
- Restart the dev server.

### Partial does not render

- Verify the include path from workspace root (for example `components/...` or `home/partials/...`).
- Check file extension and naming consistency.

### Component script/style not injected

- Confirm the partial uses `{{#push "styles"}}` / `{{#push "scripts"}}` correctly.
- Confirm the page includes both stack placeholders.

### Route not found

- Verify file location and naming under section folders.
- For cart routes, use:
  - `/cart/gio-hang.html`
  - `/cart/thanh-toan.html`

## License

ISC

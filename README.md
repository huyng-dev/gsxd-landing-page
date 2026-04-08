# GSXD Landing Page

Website da trang (multi-page) cho GSXD, xay dung voi Vite + Tailwind CSS + Handlebars partials.

README nay duoc viet theo hien trang codebase thuc te, bao gom cau truc trang, luong build, quy uoc mo rong, va thao tac Git cho thu muc local-only.

## 1. Tong Quan

- Loai du an: Static multi-page website
- Cong nghe chinh:
  - Vite 5 (dev server + build)
  - Tailwind CSS 3
  - PostCSS + Autoprefixer
  - vite-plugin-handlebars (tai su dung partials)
- Kieu route:
  - Root route: `index.html`, `gio-hang.html`, `thanh-toan.html`
  - Nested route theo folder: `about/index.html`, `products/...`, `news/...`, ...
- So trang HTML nguon hien tai (khong tinh `dist/`, `src/partials/`, `node_modules/`): **41 trang**

## 2. Yeu Cau Moi Truong

- Node.js: >= 18
- npm: >= 8

Kiem tra nhanh:

```bash
node -v
npm -v
```

## 3. Cai Dat Va Chay Du An

### 3.1 Cai dependencies

```bash
npm install
```

### 3.2 Chay local dev

```bash
npm run dev
```

- Vite se mo server mac dinh tai `http://localhost:5173`

### 3.3 Build production

```bash
npm run build
```

- Output nam trong thu muc `dist/`

### 3.4 Preview ban build

```bash
npm run preview
```

## 4. Scripts Trong package.json

- `npm run dev`: chay Vite development server
- `npm run build`: build static files cho production
- `npm run preview`: chay preview tren ban build trong `dist/`

## 5. Cau Truc Thu Muc Chinh

```text
.
├─ index.html
├─ gio-hang.html
├─ thanh-toan.html
├─ about/
├─ contact/
├─ dich-vu-khach-hang/
├─ factory/
├─ faq/
├─ news/
├─ products/
├─ projects/
├─ showroom/
├─ src/
│  ├─ assets/
│  │  ├─ css/main.css
│  │  └─ images/
│  ├─ js/
│  │  ├─ main.js
│  │  ├─ calculator.js
│  │  └─ pages/
│  │     ├─ index.js
│  │     └─ products.js
│  └─ partials/
│     ├─ header.html
│     ├─ footer.html
│     └─ ... (partials theo tung khu vuc)
├─ tailwind.config.js
├─ postcss.config.js
└─ vite.config.js
```

## 6. Kien Truc Build Va Render

### 6.1 Vite multi-page input (auto-scan HTML)

Trong `vite.config.js`, du an tu dong quet `**/*.html` va bo qua:

- `node_modules/**`
- `dist/**`
- `src/**`

Dieu nay co nghia:

- Tat ca file HTML o root/folder con (ngoai `src`) deu tro thanh page entry
- Ban co the them page moi ma khong can sua tay `rollupOptions.input`

### 6.2 Handlebars partials

Plugin `vite-plugin-handlebars` duoc cau hinh voi:

- `partialDirectory: src/partials`

Vi vay, co the tai su dung cac block nhu header/footer/section bang cu phap:

```html
{{> header}}
{{> footer}}
```

### 6.3 Tailwind scan content

`tailwind.config.js` dang scan:

- `./*.html`
- `./**/index.html`
- `./src/**/*.{html,js}`
- `./src/partials/**/*.html`

Luu y:

- Neu them class Tailwind o file khong nam trong cac pattern tren, can cap nhat `content`.

### 6.4 JavaScript runtime

File `src/js/main.js` khoi tao 3 nhom logic:

1. Dynamic import module theo `data-page`
2. Mobile menu toggle
3. FAQ accordion global

Pattern dynamic import:

- HTML dat: `<body data-page="products">`
- JS tu dong load: `src/js/pages/products.js`
- Module trang can export ham `init()`

Neu khong co module tuong ung, he thong se bo qua an toan (khong crash).

## 7. Danh Muc Trang Hien Co

### 7.1 Trang root

- `index.html`
- `gio-hang.html`
- `thanh-toan.html`

### 7.2 Trang theo nhom

- `about/index.html`
- `contact/index.html`
- `factory/index.html`
- `faq/index.html`
- `news/index.html`
- `news/detail.html`
- `projects/index.html`
- `showroom/index.html`
- `dich-vu-khach-hang/*`
- `products/**` (cac danh muc va detail pages)

Tong cong: **41** HTML pages nguon.

## 8. Huong Dan Mo Rong

### 8.1 Them trang moi

1. Tao file HTML moi trong root hoac folder con (khong dat trong `src/`).
2. Neu can JS rieng, them `data-page` vao the `body`.
3. Tao module `src/js/pages/<ten-data-page>.js` va export `init()`.
4. Chay `npm run dev` de test route.

Vi du:

```html
<body data-page="about">
```

```js
// src/js/pages/about.js
export function init() {
  // page logic here
}
```

### 8.2 Them partial moi

1. Tao partial trong `src/partials` (co the trong subfolder).
2. Goi partial trong page HTML:

```html
{{> ten-partial}}
```

3. Neu partial o subfolder, giu quy uoc ten ro rang de de tim kiem/bao tri.

### 8.3 Them style/global component

- Base va component styles dang nam o `src/assets/css/main.css`
- Uu tien utility classes cua Tailwind truoc, chi viet CSS custom khi can

## 9. Quy Uoc Git Va Thu Muc Local-Only

Du an co 2 thu muc chi dung local (khong dua len remote):

- `.vscode/`
- `.agents/`

Hai thu muc nay da duoc them vao `.gitignore`.

Neu truoc do da bi track, can bo track khoi Git index (van giu file local):

```bash
git rm -r --cached .vscode .agents
git commit -m "chore: stop tracking local editor and agent folders"
git push
```

## 10. Troubleshooting Nhanh

- CSS khong cap nhat:
  - Kiem tra class co nam trong file duoc Tailwind scan hay khong
  - Restart `npm run dev`
- Partial khong render:
  - Kiem tra ten partial va duong dan trong `src/partials`
- JS page khong chay:
  - Kiem tra `data-page` tren `body`
  - Kiem tra module tuong ung trong `src/js/pages/` co export `init()`

## 11. License

ISC

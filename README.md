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
  - Root route: `index.html`
  - Cart route: `cart/gio-hang.html`, `cart/thanh-toan.html`
  - Nested route theo folder: `about/index.html`, `products/...`, `news/...`, ...
- So trang HTML nguon hien tai (khong tinh `dist/`, `components/`, `node_modules/`): **41 trang**

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
│  └─ ... (partials dung chung toan site)
├─ home/partials/
├─ news/partials/
├─ factory/partials/
├─ projects/partials/
└─ dich-vu-khach-hang/partials/
├─ tailwind.config.js
├─ postcss.config.js
└─ vite.config.js
```

## 6. Kien Truc Build Va Render

### 6.1 Vite multi-page input (auto-scan HTML)

Trong `vite.config.js`, du an tu dong quet `**/*.html` va bo qua:

- `node_modules/**`
- `dist/**`

Dieu nay co nghia:

- Tat ca file HTML o root/folder con (ngoai `node_modules`, `dist`) deu tro thanh page entry
- Ban co the them page moi ma khong can sua tay `rollupOptions.input`

### 6.2 Handlebars partials

Plugin `vite-plugin-handlebars` duoc cau hinh voi:

- `partialDirectory`: 1 root duy nhat la workspace (`.`)

Vi vay, co the tai su dung cac block nhu header/footer/section bang cu phap:

```html
{{> components/header}}
{{> components/footer}}
{{> home/partials/banner}}
```

### 6.3 Tailwind scan content

`tailwind.config.js` dang scan:

- `./*.html`
- `./**/*.html`
- `./assets/js/**/*.js`
- `./components/**/*.html`
- `./**/partials/**/*.html`

Luu y:

- Neu them class Tailwind o file khong nam trong cac pattern tren, can cap nhat `content`.

### 6.4 JavaScript runtime

File `assets/js/main.js` chi giu logic dung chung cho toan bo website.

JS/CSS rieng theo page khong dat trong file module doc lap nua ma duoc dat truc tiep trong page HTML tuong ung (`<script>`, `<style>`).

JS/CSS cua component duoc dat ngay trong partial component trong `components/**` hoac `*/partials/**`.

Voi component/partial co inline CSS/JS, uu tien bo trong `{{#push "styles"}}...{{/push}}` va `{{#push "scripts"}}...{{/push}}` de page render qua stack.

Muc tieu la tach ro: phan "dung chung" o `main.js` va phan "dac thu" nam cung noi su dung.

## 7. Danh Muc Trang Hien Co

### 7.1 Trang root

- `index.html`

### 7.2 Trang cart

- `cart/gio-hang.html`
- `cart/thanh-toan.html`

### 7.3 Trang theo nhom

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

1. Tao file HTML moi trong root hoac folder con.
2. Neu can JS/CSS rieng cho page, dat truc tiep trong page do bang the `<script>` / `<style>`.
3. Neu la JS/CSS cua component, dat trong partial component tuong ung trong `components/**` hoac partial folder cua page, va wrap bang `push` de page in qua `stack`.
4. Chay `npm run dev` de test route.

### 8.2 Them partial moi

1. Tao partial dung chung trong `components/`.
2. Tao partial rieng trang trong folder `partials` cua trang do (vi du `home/partials`, `news/partials`).
3. Goi partial trong page HTML:

```html
{{> components/header}}
{{> components/products/recommendations}}
{{> home/partials/banner}}
{{> news/partials/hero}}
```

4. Neu partial o subfolder, giu quy uoc ten ro rang de de tim kiem/bao tri.

### 6.2.1 Handlebars stack/push (giong PHP template)

Project da duoc setup 2 helper:

- `{{#push "styles"}} ... {{/push}}`
- `{{#push "scripts"}} ... {{/push}}`

Va render stack tai page:

- `{{{stack "styles"}}}` trong `<head>`
- `{{{stack "scripts"}}}` truoc `</body>`

Vi du trong partial:

```html
{{#push "scripts"}}
<script>
  console.log("partial script");
</script>
{{/push}}
```

Luu y:

- Chi cac page co dat `{{{stack "scripts"}}}` / `{{{stack "styles"}}}` moi in ra noi dung da `push`.
- Co the dung cho script/style cua component de tranh dat script truc tiep tai vi tri include partial.

### 8.3 Them style/global component

- Base va component styles dang nam o `assets/css/main.css`
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
  - Kiem tra ten partial va duong dan trong `components/` hoac cac folder `*/partials/`
- JS page khong chay:
  - Kiem tra the `<script>` da duoc dat dung trong page hoac partial chua
  - Kiem tra selector trong script co khop voi HTML thuc te khong

## 11. License

ISC

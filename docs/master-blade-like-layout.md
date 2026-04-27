Dưới đây là tài liệu `master-blade-like-layout.md`. Bạn có thể tạo file này ở thư mục gốc của project để team (hoặc chính bạn sau này) có thể tham khảo bất cứ lúc nào.

---

# Kiến trúc Master Layout (Blade-like) & Handlebars Helpers

Tài liệu này hướng dẫn cách sử dụng kiến trúc Master Layout mới (tương tự như Blade của Laravel) và tổng hợp danh sách các Handlebars Helpers (`push`, `stack`, `for`,...) đang được sử dụng trong dự án.

Mục tiêu của kiến trúc này là:

1. **DRY (Don't Repeat Yourself):** Loại bỏ hàng ngàn dòng code HTML (`<head>`, `<script>`, `<body>`) bị lặp lại ở hơn 40 trang.
2. **Sẵn sàng cho Backend (PHP/Laravel):** Cấu trúc layout này map 1-1 với cơ chế `@extends` và `@section` của Laravel/Blade, giúp việc tích hợp code Backend sau này cực kỳ nhanh chóng.
3. **Thẻ `<body>` tĩnh hoàn toàn:** Mọi biến động (`class`, `data-page`) chỉ được truyền vào thẻ `<main>`, giữ cho thẻ `<body>` sạch sẽ và chuẩn mực.

---

## 1. Cấu trúc Master Layout (`layouts/main.html`)

Đây là file gốc chứa toàn bộ khung sườn của website. Nó đóng vai trò như file `app.blade.php` trong Laravel.

```html
<!-- layouts/main.html -->
<!-- GSXD-DEBUG:BEGIN type=LAYOUT file=layouts/main.html -->
<!doctype html>
<html lang="vi">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Title & Meta -->
    <title>{{#if title}}{{title}} - Thanh Hải Ceramics{{else}}Thanh Hải Ceramics - Ngói và Gạch Hoa Truyền Thống{{/if}}
    </title>
    {{#if description}}
    <meta name="description" content="{{description}}" />
    {{/if}}

    <!-- Global CSS & Fonts -->
    <link rel="icon" type="image/svg+xml" href="/assets/images/logo.png" />
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css" />
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
    <link rel="stylesheet" href="/assets/css/main.css" />

    <!-- Style riêng của từng page -->
    {{{stack "styles"}}}
</head>

<!-- Body hoàn toàn TĨNH, không nhận bất kỳ biến nào -->

<body class="min-h-screen flex flex-col font-archivo text-primary">

    {{> components/header}}

    <!-- Main Content: Đón toàn bộ biến động (data-page, class nền, v.v...) -->
    <main {{#if dataPage}}data-page="{{dataPage}}" {{/if}}
        class="flex-grow {{#if mainClass}}{{mainClass}}{{else}}bg-white{{/if}}">
        {{> @partial-block}}
    </main>

    {{> components/footer hideNewsletter=hideNewsletter}}

    <!-- Global JS -->
    <script type="module" src="/assets/js/app.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js"></script>
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>

    <!-- Init Global -->
    <script>
        if (typeof AOS !== 'undefined') {
            AOS.init({ duration: 800, once: true, offset: 100 });
        }
    </script>

    <!-- Script riêng của từng page -->
    {{{stack "scripts"}}}

</body>

</html>
<!-- GSXD-DEBUG:END type=LAYOUT file=layouts/main.html -->
```

---

## 2. Hướng dẫn Refactor trang cũ sang Layout mới

Để chuyển một trang HTML cũ sang cấu trúc mới, hãy làm theo 3 bước sau:

### Bước 1: Xóa mã thừa (Boilerplate)

Mở trang HTML cũ ra và **XÓA TOÀN BỘ** các thẻ sau:

- `<!doctype html>`, `<html lang="vi">`, `<head>...</head>`
- Toàn bộ thư viện CDN (Tailwind, Swiper, AOS).
- Thẻ `<body>`, `<main>` cũ.
- Script khởi tạo `AOS.init()` ở cuối file.

### Bước 2: Bọc nội dung bằng `{{#> layouts/main}}`

Bọc phần nội dung thực tế (các section, component) bằng thẻ gọi Layout và truyền các biến cần thiết.

**Các biến có thể truyền:**

- `title`: Tiêu đề trang (ví dụ: "Liên hệ").
- `description`: Thẻ meta mô tả (tuỳ chọn).
- `dataPage`: Đánh dấu tên trang cho JS/CSS (ví dụ: "contact").
- `mainClass`: Các class Tailwind muốn gán vào thẻ `<main>` (ví dụ: "bg-primary relative").
- `hideNewsletter`: Truyền `true` nếu muốn ẩn form nhận bản tin ở Footer.

### Bước 3: Đưa CSS/JS riêng vào Push/Stack

Nếu trang có thẻ `<style>` hoặc `<script>` riêng, hãy bọc chúng vào `{{#push "styles"}}` và `{{#push "scripts"}}`.

#### VÍ DỤ MINH HOẠ: Refactor trang Liên hệ (`contact/index.html`)

**TRƯỚC KHI REFACTOR (Cũ):**

```html
<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <title>Liên hệ - Thanh Hải Ceramics</title>
    <!-- Các thư viện lặp lại -->
    <style>
      .contact-input::placeholder {
        color: rgba(255, 250, 243, 0.4);
      }
    </style>
    {{{stack "styles"}}}
  </head>
  <body
    data-page="contact"
    class="bg-primary min-h-screen flex flex-col font-archivo"
  >
    {{> components/header}}
    <main class="relative flex-grow overflow-hidden">
      <!-- NỘI DUNG LIÊN HỆ -->
    </main>
    {{> components/footer hideNewsletter=true}}
    <!-- Script lặp lại -->
    {{{stack "scripts"}}}
  </body>
</html>
```

**SAU KHI REFACTOR (Mới):**

```html
{{#> layouts/main title="Liên hệ" dataPage="contact" mainClass="relative
overflow-hidden bg-primary" hideNewsletter=true }} {{#push "styles"}}
<style>
  .contact-input::placeholder {
    color: rgba(255, 250, 243, 0.4);
  }
</style>
{{/push}}

<!-- NỘI DUNG LIÊN HỆ (Bỏ thẻ <main> đi vì Layout đã lo) -->
<div class="w-full max-w-[1920px] mx-auto">...</div>

{{#push "scripts"}}
<script>
  console.log("Đây là JS chạy riêng cho trang liên hệ");
</script>
{{/push}} {{/layouts/main}}
```

### LƯU Ý QUAN TRỌNG (Cập nhật CSS)

Do `data-page` đã được chuyển từ `<body>` sang `<main>`, bạn **phải cập nhật** file `assets/css/main.css`:

- **Tìm:** `body[data-page="index"]`
- **Thay thành:** `main[data-page="index"]`

---

## 3. Tổng hợp Handlebars Helpers & Components

Dự án này sử dụng Vite Plugin Handlebars kết hợp với các Custom Helpers được viết riêng trong `vite.config.js`.

### 3.1. Gọi Partial (Include thông thường)

Sử dụng dấu `>` (không có hashtag) để include một file HTML vào một vị trí.
_Tương đương: `@include('components.header')` trong Blade._

```html
{{> components/header}} {{> home/partials/banner}}
```

### 3.2. Gọi Block Partial (Layout Wrapper)

Sử dụng dấu `|>` (có hashtag trước dấu ngoặc) để gọi một layout và truyền nội dung vào bên trong. Thẻ đóng là `{{/duong-dan}}`.
_Tương đương: `@extends` và `@section` trong Blade._

```html
{{#> layouts/main title="Tên trang"}}
<p>Nội dung này sẽ thế chỗ cho {{> @partial-block}} trong layout.</p>
{{/layouts/main}}
```

### 3.3. Push & Stack (Đẩy Styles/Scripts)

Dùng để đẩy một đoạn mã HTML/CSS/JS từ một Component/Trang con lên vị trí khai báo `stack` ở Layout tổng. Cực kỳ hữu dụng để quản lý tài nguyên.
_Tương đương: `@push('styles')` và `@stack('styles')` trong Blade._

**Khai báo điểm nhận (ở Layout):**
_(Lưu ý: Phải dùng 3 dấu ngoặc nhọn `{{{ }}}` để HTML không bị escape biến thành dạng text)._

```html
<head>
  {{{stack "styles"}}}
</head>
<body>
  {{{stack "scripts"}}}
</body>
```

**Đẩy dữ liệu lên (ở Trang con/Component):**

```html
{{#push "scripts"}}
<script src="https://cdn.jsdelivr.net/gh/mcstudios/glightbox/dist/js/glightbox.min.js"></script>
<script>
  GLightbox();
</script>
{{/push}}
```

### 3.4. Vòng lặp `for`

Dùng để lặp lại một đoạn HTML N lần (rất tốt khi dựng giao diện dummy/skeleton).

```html
<div class="grid grid-cols-4">
  {{#for 4}}
  <div class="card">Sản phẩm thứ {{@index}}</div>
  {{/for}}
</div>
```

### 3.5. Helper `productSlides`

Một helper phức tạp chuyên dùng để tạo dữ liệu cho Swiper Carousel dạng Grid (ví dụ: gộp nhiều sản phẩm vào 1 slide).
_Cách sử dụng tham khảo thêm trong mã nguồn `home/partials`._

```html
<!-- Gom 4 item vào 1 slide -->
{{#productSlides 4 "/link-1|/img-1.jpg|Title 1|Code 1|Price 1"
"/link-2|/img-2.jpg|Title 2|Code 2|Price 2" repeat=2 }} {{#each slides}}
<div class="swiper-slide">
  {{#each this}}
  <a href="{{href}}">{{title}}</a>
  {{/each}}
</div>
{{/each}} {{/productSlides}}
```

---

## 4. Các thư mục Local (Lưu ý Git)

Các thư mục sau đây **chỉ phục vụ cho máy cá nhân** (Editor config, AI agents) và đã được đưa vào `.gitignore`. Bạn tuyệt đối không nên commit chúng:

- `.vscode/`
- `.agents/`

Nếu lỡ track trước đó, hãy xóa cache bằng lệnh:

```bash
git rm -r --cached .vscode .agents
git commit -m "chore: remove local configs"
```

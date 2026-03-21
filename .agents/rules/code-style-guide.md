---
trigger: always_on
---

# Cẩm nang Phong cách Lập trình (Code Style Guide) - GSXD Landing Page

Tài liệu này quy định các chuẩn mực về cấu trúc dự án, phong cách viết code và quy trình phát triển để đảm bảo tính đồng nhất cho dự án GSXD Landing Page.

---

## 1. Cấu trúc Dự án (Project Structure)

Dự án sử dụng **Vite** kết hợp với **Handlebars** để quản lý các thành phần HTML (partials).

- `index.html`, `about/index.html`, `contact/index.html`: Các file trang chính.
- `src/partials/`: Chứa các thành phần HTML tái sử dụng.
  - `header.html`, `footer.html`: Các thành phần chung.
  - `home/`, `products/`, ...: Thư mục chứa các Section riêng cho từng trang.
- `src/assets/`:
  - `css/main.css`: File CSS chính chứa Tailwind layers và custom components.
  - `images/`: Chứa tất cả tài nguyên hình ảnh.
- `src/js/`: Chứa các file xử lý logic JavaScript chính.

---

## 2. Quy tắc Viết HTML & Partials

### 2.1. Sử dụng Partials
Tất cả các Section lớn phải được tách ra thành file `.html` riêng trong thư mục `src/partials/` và nhúng vào trang chính bằng cú pháp Handlebars:
```html
{{> folder-name/file-name}}
```

### 2.2. Cấu trúc một Section
Mỗi Section nên tuân thủ cấu trúc:
```html
<section id="section-id" class="py-16 lg:py-20 overflow-hidden"> (Có thể dùng pb-16 pb-20 nếu section bên trên đã cách một khoảng)
  <div class="container-custom">
    <!-- Content goes here -->
  </div>
</section>
```
*Lưu ý: Sử dụng `w-[85%] max-w-[1320px] mx-auto` cho container chính để đảm bảo padding hai bên đồng nhất.*

---

## 3. Quy tắc Viết CSS (Tailwind CSS)

### 3.1. Ưu tiên Utility Classes
Sử dụng tối đa các class của Tailwind trực tiếp trong HTML.

### 3.2. Custom Components
Nếu một thành phần có style quá phức tạp hoặc lặp lại nhiều lần, hãy định nghĩa trong `src/assets/css/main.css` dưới `@layer components`:
```css
@layer components {
  .btn-primary {
    @apply px-6 py-3 bg-secondary text-white font-bold transition-all hover:opacity-90;
  }
}
```

### 3.3. Màu sắc & Font chữ (Design Tokens)
Dùng đúng các token đã định nghĩa trong `tailwind.config.js`:
- **Colors**: `primary` (#2E2F2A), `secondary` (#C76E00), `neutral-1` (#EFE4DE), `background-secondary` (#F5EDE7).
- **Fonts**: `font-archivo` (chính), `font-italianno` (nghệ thuật).

---

## 4. Quy tắc Viết JavaScript

- Ưu tiên viết logic trong `src/js/main.js` hoặc tách file JS riêng cho từng tính năng phức tạp.
- Sử dụng **Swiper.js** cho các slide/carousel.
- Sử dụng **AOS.js** cho các hiệu ứng xuất hiện (fade-up, fade-in, ...).
- Tránh viết logic xử lý DOM trực tiếp trong file HTML trừ khi là logic đơn giản và đặc thù cho trang đó.

---

## 5. Quy trình Phát triển Section Mới

Khi được yêu cầu lập trình một Section mới từ ảnh mẫu hoặc yêu cầu:

1.  **Phân tích Dự án**: Kiểm tra thư mục `src/partials/` để tìm các Section có cấu trúc tương tự (ví dụ: cùng kiểu layout 2 cột, cùng kiểu carousel).
2.  **Tham khảo Code**: Xem cách các Section hiện tại xử lý responsive, container và animation.
3.  **Thực hiện**:
    - Tạo file partial mới.
    - Định nghĩa style (ưu tiên Tailwind).
    - Đăng ký partial vào trang chính.
    - Kiểm tra độ hiển thị trên các thiết bị (Responsive).

---

## 6. Tiêu chuẩn Hình ảnh

- Hình ảnh nên được tối ưu hóa dung lượng trước khi đưa vào dự án.
- Sử dụng đường dẫn tuyệt đối từ root cho tài nguyên: `/src/assets/images/...`
- Đặt thuộc tính `alt` mô tả rõ ràng cho ảnh để hỗ trợ SEO.

---

> [!IMPORTANT]
> Luôn giữ cho code sạch sẽ (clean code), có comment giải thích cho các khối logic phức tạp và đảm bảo tính responsive trên mọi kích thước màn hình.

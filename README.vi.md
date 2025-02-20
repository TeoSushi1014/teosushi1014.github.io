# Tạo Blog/Portfolio với GitHub Pages và Tích Hợp CMS

Hướng dẫn này sẽ chỉ cho bạn cách tạo blog/portfolio sử dụng GitHub Pages với hệ thống quản lý nội dung, cho phép bạn thêm và chỉnh sửa nội dung trực tiếp thông qua giao diện web mà không cần chỉnh sửa code thủ công.

## Tổng Quan Hệ Thống
- GitHub Pages để lưu trữ website
- Decap CMS (trước đây là Netlify CMS) để quản lý nội dung
- HTML, CSS, JavaScript, và TailwindCSS để tạo giao diện
- Không cần cài đặt thêm môi trường phát triển

## Hướng Dẫn Từng Bước

### 1. Tạo Repository GitHub
1. Truy cập GitHub và tạo repository mới
2. Đặt tên là `tênbạn.github.io` (thay 'tênbạn' bằng tên người dùng GitHub của bạn)
3. Đặt chế độ public
4. Khởi tạo với file README

### 2. Thiết Lập Cấu Trúc Cơ Bản
Tạo các file sau trong repository:
```
tênbạn.github.io/
├── index.html
├── admin/
│   ├── index.html
│   └── config.yml
├── css/
│   └── style.css
├── js/
│   └── main.js
└── _posts/
```

### 3. Cấu Hình GitHub Pages
1. Vào Cài đặt (Settings) của repository
2. Chuyển đến phần "Pages"
3. Chọn nhánh "main" làm nguồn
4. Lưu cài đặt

### 4. Thiết Lập Decap CMS
Thêm các file sau vào thư mục admin:

Trong `admin/index.html`:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Quản Lý Nội Dung</title>
    <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
  </head>
  <body>
    <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
  </body>
</html>
```

Trong `admin/config.yml`:
```yaml
backend:
  name: github
  repo: tênbạn/tênbạn.github.io
  branch: main

media_folder: "images/uploads"
public_folder: "/images/uploads"

collections:
  - name: "blog"
    label: "Blog"
    folder: "_posts"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - {label: "Layout", name: "layout", widget: "hidden", default: "post"}
      - {label: "Tiêu đề", name: "title", widget: "string"}
      - {label: "Ngày đăng", name: "date", widget: "datetime"}
      - {label: "Ảnh đại diện", name: "thumbnail", widget: "image", required: false}
      - {label: "Nội dung", name: "body", widget: "markdown"}
```

### 5. Thiết Lập Xác Thực
1. Vào GitHub Settings → Developer settings → OAuth Apps
2. Tạo OAuth App mới
   - Tên ứng dụng: Your Site CMS
   - URL trang chủ: https://tênbạn.github.io
   - URL callback: https://tênbạn.github.io/admin/
3. Lấy Client ID và Client Secret
4. Cập nhật config.yml với thông tin này

### 6. Thiết Lập Template Cơ Bản
Tạo template cơ bản trong thư mục gốc:

Trong `index.html`:
```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog/Portfolio của tôi</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="css/style.css" rel="stylesheet">
</head>
<body>
    <div id="content"></div>
    <script src="js/main.js"></script>
</body>
</html>
```

### 7. Truy Cập Trang Quản Trị
1. Truy cập https://tênbạn.github.io/admin/
2. Đăng nhập bằng tài khoản GitHub
3. Bắt đầu tạo và quản lý nội dung

### 8. Tạo Nội Dung
1. Đăng nhập vào trang quản trị
2. Click "New Blog" hoặc mục tương ứng
3. Điền các trường thông tin cần thiết
4. Xem trước nội dung
5. Xuất bản khi hoàn tất

### Lưu Ý
- Mọi thay đổi được commit trực tiếp vào repository GitHub
- Nội dung được lưu dưới dạng file Markdown trong repository
- Hình ảnh tự động được tối ưu và lưu trữ trong repository
- Bạn vẫn có thể chỉnh sửa file thủ công qua GitHub nếu cần

### Tùy Chỉnh
- Sửa đổi `config.yml` để thêm loại nội dung mới
- Tùy chỉnh template trong `index.html`
- Thêm trường thông tin cho model nội dung
- Tạo style cho website bằng các class của TailwindCSS

## Xử Lý Sự Cố
- Nếu trang quản trị không tải, kiểm tra cài đặt OAuth
- Đảm bảo quyền repository đã đúng
- Xác nhận tên nhánh khớp trong cài đặt
- Kiểm tra đường dẫn file trong config.yml

## Tài Liệu Tham Khảo
- [Tài liệu GitHub Pages](https://docs.github.com/en/pages)
- [Tài liệu Decap CMS](https://decapcms.org/docs/intro/)
- [Tài liệu TailwindCSS](https://tailwindcss.com/docs)
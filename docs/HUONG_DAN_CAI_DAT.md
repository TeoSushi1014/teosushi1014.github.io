# Thiết Lập GitHub Pages với Decap CMS

Hướng dẫn này sẽ giúp bạn tạo blog/portfolio có trang quản trị sử dụng GitHub Pages và Decap CMS.

## Yêu Cầu
- Một tài khoản GitHub
- Một repository cho website
- Kiến thức cơ bản về HTML/CSS/JavaScript

## Hướng Dẫn Từng Bước

### 1. Tạo Repository GitHub
1. Truy cập GitHub và tạo repository mới
2. Đặt tên là `tennguoidung.github.io` (thay tennguoidung bằng tên người dùng GitHub của bạn)
3. Đặt chế độ công khai (public)
4. Khởi tạo với file README

### 2. Thiết Lập Cấu Trúc Cơ Bản
Tạo các file sau trong repository:
```
index.html
admin/index.html
admin/config.yml
posts/
assets/
```

### 3. Cấu Hình GitHub Pages
1. Vào Cài đặt (Settings) của repository
2. Chuyển đến phần Pages
3. Chọn nhánh main làm nguồn
4. Lưu cài đặt

### 4. Thiết Lập Xác Thực
1. Truy cập GitHub Developer Settings
2. Tạo OAuth App mới
3. Đặt Homepage URL: `https://tennguoidung.github.io`
4. Đặt Authorization callback URL: `https://tennguoidung.github.io/admin/`
5. Lưu Client ID và Client Secret

### 5. Nội Dung Các File

#### index.html (Trang Chính)
```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog Của Tôi</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <div id="content" class="container mx-auto p-4">
        <!-- Nội dung sẽ được tải động -->
    </div>
    <script src="/assets/js/main.js"></script>
</body>
</html>
```

#### admin/index.html (Trang Quản Trị)
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Quản Lý Nội Dung</title>
    <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
</head>
<body>
    <script src="https://unpkg.com/@staticcms/app@^2.0.0/dist/static-cms-app.js"></script>
    <script>
        window.CMS.init();
    </script>
</body>
</html>
```

#### admin/config.yml
```yaml
backend:
  name: github
  repo: tennguoidung/tennguoidung.github.io
  branch: main
  base_url: https://tennguoidung.github.io
  auth_endpoint: api/auth

media_folder: "assets/images"
public_folder: "/assets/images"

collections:
  - name: "blog"
    label: "Bài Viết"
    folder: "_posts"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - {label: "Tiêu Đề", name: "title", widget: "string"}
      - {label: "Ngày Đăng", name: "date", widget: "datetime"}
      - {label: "Ảnh Đại Diện", name: "thumbnail", widget: "image", required: false}
      - {label: "Nội Dung", name: "body", widget: "markdown"}
```

### 6. Triển Khai và Kiểm Tra
1. Commit và đẩy tất cả file lên GitHub
2. Đợi vài phút để GitHub Pages build
3. Truy cập `https://tennguoidung.github.io/admin/`
4. Đăng nhập bằng tài khoản GitHub
5. Bắt đầu tạo nội dung!

## Sử Dụng
- Truy cập blog tại: `https://tennguoidung.github.io`
- Truy cập trang quản trị tại: `https://tennguoidung.github.io/admin`
- Tạo bài viết mới trực tiếp từ trang quản trị
- Mọi thay đổi sẽ tự động được commit vào repository

## Lưu Ý
- Bài viết được lưu dưới dạng file Markdown trong repository
- Hình ảnh được lưu trong thư mục assets/images
- Hệ thống sử dụng xác thực của GitHub
- Không cần dịch vụ hosting hay CMS bổ sung

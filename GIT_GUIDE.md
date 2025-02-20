# Git Commands & Commit Message Guide / Hướng Dẫn Lệnh Git & Cách Viết Commit

## Basic Git Commands / Các Lệnh Git Cơ Bản

### git add
- 🇬🇧 Adds files to staging area
- 🇻🇳 Thêm file vào vùng staging

```bash
git add .             # Add all files / Thêm tất cả file
git add filename.txt  # Add specific file / Thêm file cụ thể
```

### git commit
- 🇬🇧 Records changes to the repository
- 🇻🇳 Lưu các thay đổi vào repository

```bash
git commit -m "commit message"  # Commit with message / Commit với message
```

## Commit Message Conventions / Quy Ước Viết Commit

### Format / Định Dạng
```
<type>: <description>

[optional body]
[optional footer]
```

### Types / Các Loại
- `feat`: new feature / tính năng mới
- `fix`: bug fix / sửa lỗi
- `docs`: documentation / tài liệu
- `style`: formatting, missing semicolons / định dạng, thiếu dấu chấm phẩy
- `refactor`: code restructuring / tái cấu trúc code
- `test`: adding tests / thêm test
- `chore`: maintenance / bảo trì

### Examples / Ví Dụ

```bash
git commit -m "feat: add login functionality"
# Thêm tính năng đăng nhập

git commit -m "fix: resolve navigation bug"
# Sửa lỗi điều hướng

git commit -m "docs: update README"
# Cập nhật tài liệu README

git commit -m "style: format code according to style guide"
# Định dạng code theo style guide

git commit -m "init: initial commit"
# Commit đầu tiên của dự án
```

### Best Practices / Quy Tắc Thực Hành
🇬🇧
- Use present tense ("add" not "added")
- Keep first line under 50 characters
- Be descriptive but concise
- Start with lowercase letter
- Don't end with period

🇻🇳
- Sử dụng thì hiện tại ("add" không phải "added")
- Giữ dòng đầu dưới 50 ký tự
- Mô tả rõ ràng nhưng ngắn gọn
- Bắt đầu bằng chữ thường
- Không kết thúc bằng dấu chấm

### Common First-time Setup / Thiết Lập Ban Đầu
```bash
git commit -m "init: initial project setup"
git commit -m "init: khởi tạo dự án"
```
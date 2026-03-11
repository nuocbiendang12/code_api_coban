# Giờ 1 — Git

## 1. Git là gì?
- **Git** là hệ thống quản lý phiên bản (Version Control System - VCS) phổ biến nhất hiện nay.
- Giúp bạn theo dõi lịch sử thay đổi của code, làm việc nhóm, và phục hồi code khi cần.
- **GitHub/GitLab/Bitbucket**: các dịch vụ lưu trữ repository Git trực tuyến.

## 2. Cài đặt Git
1. Tải tại: https://git-scm.com
2. Kiểm tra:
```bash
git --version
```

## 3. Cấu hình Git lần đầu
```bash
git config --global user.name "Tên của bạn"
git config --global user.email "email@example.com"
```

## 4. Các lệnh Git cơ bản

### Khởi tạo repository
```bash
git init                 # Khởi tạo repo mới trong thư mục hiện tại
git clone <url>          # Clone repo từ remote về máy
```

### Theo dõi và commit
```bash
git status               # Xem trạng thái các file thay đổi
git add .                # Thêm tất cả file vào staging area
git add index.js         # Thêm một file cụ thể
git commit -m "message"  # Lưu thay đổi với message mô tả
```

### Làm việc với remote
```bash
git remote add origin <url>   # Kết nối với remote repository
git push origin main          # Đẩy code lên remote
git pull origin main          # Lấy code mới nhất từ remote
```

### Xem lịch sử
```bash
git log                  # Xem lịch sử commit
git log --oneline        # Xem lịch sử rút gọn
```

### Branch (nhánh)
```bash
git branch               # Xem danh sách branch
git branch feature/login # Tạo branch mới
git checkout feature/login    # Chuyển sang branch
git checkout -b feature/login # Tạo và chuyển sang branch mới
git merge feature/login  # Merge branch vào branch hiện tại
```

## 5. File .gitignore
Dùng để bỏ qua các file/thư mục không cần commit lên Git:
```
node_modules/
.env
*.log
dist/
```
- **node_modules**: thư mục chứa các package (rất nặng, không cần commit).
- **.env**: file chứa thông tin bí mật (password, API key).

## 6. Quy trình làm việc với Git trong Backend
```bash
# 1. Tạo dự án mới
git init
echo "node_modules/" > .gitignore

# 2. Làm việc và commit
git add .
git commit -m "feat: tạo API đăng ký người dùng"

# 3. Đẩy lên GitHub
git remote add origin https://github.com/username/repo.git
git push -u origin main
```

---

## Bài tập thực hành

### Bài 1: Khởi tạo Git cho dự án
1. Vào thư mục `my-first-backend` đã tạo ở bài trước.
2. Chạy `git init`.
3. Tạo file `.gitignore` với nội dung `node_modules/`.
4. Chạy `git add .` rồi `git commit -m "first commit"`.
5. Kiểm tra lịch sử bằng `git log --oneline`.

### Bài 2: Tạo và làm việc với branch
1. Tạo branch mới tên `feature/hello-api`.
2. Chuyển sang branch đó.
3. Chỉnh sửa file `index.js`, thêm dòng `console.log("Hello API!")`.
4. Commit thay đổi.
5. Merge branch vào `main`.

### Câu hỏi kiểm tra
1. `.gitignore` dùng để làm gì? Tại sao cần bỏ qua `node_modules`?
2. Sự khác nhau giữa `git add` và `git commit` là gì?
3. Tại sao nên làm việc trên branch riêng thay vì làm thẳng trên `main`?

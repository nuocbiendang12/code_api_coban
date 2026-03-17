# Giờ 3 — CRUD API

## 1. CRUD là gì?
- **CRUD** = **C**reate / **R**ead / **U**pdate / **D**elete.
- Là 4 thao tác cơ bản với dữ liệu trong mọi ứng dụng.
- Tương ứng với HTTP Methods:

| Thao tác | HTTP Method | URL ví dụ    | Kết quả       |
| -------- | ----------- | ------------ | ------------- |
| Create   | POST        | `/users`     | Tạo user mới  |
| Read all | GET         | `/users`     | Lấy danh sách |
| Read one | GET         | `/users/:id` | Lấy 1 user    |
| Update   | PUT / PATCH | `/users/:id` | Cập nhật user |
| Delete   | DELETE      | `/users/:id` | Xóa user      |

---

## 2. CRUD API hoàn chỉnh (dùng mảng — chưa cần DB)

```javascript
// index.js
const express = require('express');
const app = express();
app.use(express.json());

// Dữ liệu giả lập trong bộ nhớ (sau thay bằng MongoDB)
let users = [
    { id: 1, name: 'Nguyễn Văn A', email: 'a@gmail.com' },
    { id: 2, name: 'Trần Thị B',   email: 'b@gmail.com' },
];
let nextId = 3;

// ── READ ALL ──────────────────────────────────────────────
// GET /users — Lấy danh sách
app.get('/users', (req, res) => {
    res.json(users);
});

// ── READ ONE ──────────────────────────────────────────────
// GET /users/:id — Lấy một user
app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy user!' });
    }

    res.json(user);
});

// ── CREATE ────────────────────────────────────────────────
// POST /users — Tạo user mới
app.post('/users', (req, res) => {
    const { name, email } = req.body;

    // Validate
    if (!name || !email) {
        return res.status(400).json({ message: 'Thiếu name hoặc email!' });
    }

    const newUser = { id: nextId++, name, email };
    users.push(newUser);

    res.status(201).json(newUser);
});

// ── UPDATE FULL ───────────────────────────────────────────
// PUT /users/:id — Cập nhật toàn bộ user
app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Không tìm thấy user!' });
    }

    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Thiếu name hoặc email!' });
    }

    users[index] = { id, name, email };
    res.json(users[index]);
});

// ── UPDATE PARTIAL ────────────────────────────────────────
// PATCH /users/:id — Cập nhật một phần user
app.patch('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy user!' });
    }

    // Chỉ cập nhật các field được gửi lên, giữ nguyên các field còn lại
    Object.assign(user, req.body);
    res.json(user);
});

// ── DELETE ────────────────────────────────────────────────
// DELETE /users/:id — Xóa user
app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Không tìm thấy user!' });
    }

    const deletedUser = users.splice(index, 1)[0];
    res.json({ message: `Đã xóa user "${deletedUser.name}"` });
});

app.listen(3000, () => {
    console.log('CRUD API chạy tại http://localhost:3000');
});
```

---

## 3. Test với Postman

```
# Lấy tất cả
GET     http://localhost:3000/users

# Lấy một user
GET     http://localhost:3000/users/1

# Tạo mới (Body → raw → JSON)
POST    http://localhost:3000/users
Body: { "name": "Lê C", "email": "c@gmail.com" }

# Cập nhật toàn bộ
PUT     http://localhost:3000/users/1
Body: { "name": "Lê C Updated", "email": "new@gmail.com" }

# Cập nhật một phần
PATCH   http://localhost:3000/users/1
Body: { "name": "Chỉ đổi tên thôi" }

# Xóa
DELETE  http://localhost:3000/users/1
```

---

## 4. PUT vs PATCH — Khi nào dùng cái nào?

|                 | PUT                   | PATCH                          |
| --------------- | --------------------- | ------------------------------ |
| Cập nhật        | Toàn bộ resource      | Chỉ các field được gửi         |
| Field không gửi | Bị xóa / null         | Giữ nguyên giá trị cũ          |
| Dùng khi        | Form chỉnh sửa đầy đủ | Cập nhật trạng thái, 1-2 field |

---

## Bài tập thực hành

### Bài 1: CRUD API cho Products
Xây dựng CRUD API hoàn chỉnh cho `products` dùng mảng với các trường:
- `id`, `name`, `price` (số dương), `category`

Yêu cầu:
- Validate trong POST và PUT: không được thiếu `name`, `price`, `category`.
- `price` phải là số dương (> 0).
- Test tất cả endpoint bằng Postman.

### Bài 2: Tách ra file routes
Refactor bài 1:
1. Tạo `routes/productRoutes.js` chứa toàn bộ CRUD logic.
2. Gắn vào `index.js` với prefix `/products`.

### Bài 3: Thêm tính năng lọc (Query string)
Cập nhật `GET /products`:
- `?category=phone` → lọc theo category.
- `?minPrice=100&maxPrice=500` → lọc theo khoảng giá.
- Không có query → trả về tất cả.

### Câu hỏi kiểm tra
1. Sự khác nhau giữa PUT và PATCH là gì?
2. Tại sao cần `parseInt(req.params.id)` thay vì dùng thẳng `req.params.id`?
3. Khi tạo resource mới thành công, nên trả về status code nào và body là gì?

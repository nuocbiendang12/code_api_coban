# Giờ 2 — Routing trong Express

## 1. Routing là gì?
- **Routing** là cơ chế xác định server phản hồi thế nào với từng request của client tại một **endpoint** cụ thể.
- Một endpoint gồm: **URL path** + **HTTP Method** (GET, POST, PUT, DELETE, PATCH).
- Routing tốt giúp code có cấu trúc rõ ràng, dễ bảo trì và mở rộng.

```
Client gửi:  GET /users
                  ↓
Express tìm route khớp → thực thi handler → trả Response
```

---

## 2. Cú pháp Route cơ bản

```javascript
// app.METHOD(đường_dẫn, handler)

app.get('/users', (req, res) => { ... });       // Lấy dữ liệu
app.post('/users', (req, res) => { ... });      // Tạo mới
app.put('/users/:id', (req, res) => { ... });   // Cập nhật toàn bộ
app.patch('/users/:id', (req, res) => { ... }); // Cập nhật một phần
app.delete('/users/:id', (req, res) => { ... });// Xóa
```

---

## 3. Route Parameters (Tham số trong URL)

```javascript
// :id là route parameter — giá trị động trong URL
app.get('/users/:id', (req, res) => {
    const { id } = req.params;  // Lấy giá trị từ URL
    res.json({ message: `Lấy user có ID: ${id}` });
});
// Test: GET /users/5  →  req.params.id = "5"

// Nhiều params
app.get('/users/:userId/posts/:postId', (req, res) => {
    const { userId, postId } = req.params;
    res.json({ userId, postId });
});
// Test: GET /users/1/posts/3
```

---

## 4. Query String (Tham số truy vấn)

```javascript
// Query string sau dấu ? trong URL
app.get('/users', (req, res) => {
    const { page = 1, limit = 10, keyword = '' } = req.query;
    res.json({
        message: `Trang ${page}, ${limit} kết quả, tìm: "${keyword}"`
    });
});
// Test: GET /users?page=2&limit=5&keyword=john
```

---

## 5. Express Router — Tách route ra file riêng

Khi dự án lớn, không nên viết tất cả routes trong `index.js`. Dùng `express.Router()`.

### Cấu trúc thư mục khuyên dùng
```
project/
├── index.js
└── routes/
    ├── userRoutes.js
    └── productRoutes.js
```

### routes/userRoutes.js
```javascript
const express = require('express');
const router = express.Router();

// GET /users
router.get('/', (req, res) => {
    res.json({ message: 'Danh sách users' });
});

// GET /users/:id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    res.json({ message: `User có ID: ${id}` });
});

// POST /users
router.post('/', (req, res) => {
    const newUser = req.body;
    res.status(201).json({ message: 'Tạo user thành công', user: newUser });
});

// PUT /users/:id
router.put('/:id', (req, res) => {
    res.json({ message: `Cập nhật user ${req.params.id}` });
});

// DELETE /users/:id
router.delete('/:id', (req, res) => {
    res.json({ message: `Xóa user ${req.params.id}` });
});

module.exports = router;
```

### index.js — Gắn router
```javascript
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

app.use(express.json());

// Gắn router với prefix
app.use('/users', userRoutes);       // /users, /users/:id
app.use('/products', productRoutes); // /products, /products/:id

app.listen(3000, () => {
    console.log('Server chạy tại http://localhost:3000');
});
```

> **Lưu ý**: Khi gắn `app.use('/users', userRoutes)`, route `/` trong `userRoutes` sẽ tương ứng với `/users`.

---

## 6. Route 404 — Xử lý khi không tìm thấy endpoint

```javascript
// Phải đặt SAU tất cả routes để bắt các request không khớp
app.use((req, res) => {
    res.status(404).json({ message: `Không tìm thấy ${req.method} ${req.url}` });
});
```

---

## Bài tập thực hành

### Bài 1: Tách routes ra file riêng
1. Tạo thư mục `routes/`.
2. Tạo `routes/productRoutes.js` với 5 routes:
   - `GET /` — Trả về `{ products: [] }`.
   - `GET /:id` — Trả về `{ id: <id> }`.
   - `POST /` — Nhận `req.body`, trả về 201.
   - `PUT /:id` — Trả về message cập nhật.
   - `DELETE /:id` — Trả về message xóa.
3. Gắn vào `index.js` với prefix `/products`.
4. Test bằng Postman.

### Bài 2: Query string phân trang
Tạo route `GET /products` hỗ trợ:
- `?page=1` (mặc định 1)
- `?limit=10` (mặc định 10)
- `?category=phone` (lọc theo danh mục)

Trả về JSON với đầy đủ các tham số đã nhận.

### Bài 3: Route params lồng nhau
Tạo route `GET /users/:userId/orders/:orderId` trả về:
```json
{
  "userId": "1",
  "orderId": "5",
  "message": "Đơn hàng 5 của user 1"
}
```

### Câu hỏi kiểm tra
1. Sự khác nhau giữa `req.params` và `req.query` là gì? Cho ví dụ URL tương ứng.
2. Khi gắn `app.use('/products', productRoutes)`, route `/:id` trong file productRoutes tương ứng với URL nào?
3. Tại sao Route 404 phải đặt cuối cùng?

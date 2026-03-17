# Giờ 2 — Express.js

## 1. Express là gì?
- **Express.js** là framework web phổ biến nhất cho Node.js.
- Giúp xây dựng **REST API** và **web server** nhanh chóng, đơn giản.
- Không cần viết HTTP server từ đầu như với `http` module thuần.
- Cài đặt: `npm install express`

---

## 2. Tạo server Express đầu tiên

```javascript
// index.js
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware để đọc JSON từ request body
app.use(express.json());

// Route GET đơn giản
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
```

Chạy server:
```bash
node index.js
# hoặc
nodemon index.js
```

---

## 3. Cấu trúc Request và Response

### Request (req) — dữ liệu từ client gửi lên
```javascript
req.body        // Body của request (POST, PUT)
req.params      // Tham số trong URL: /users/:id → req.params.id
req.query       // Query string: /users?age=20 → req.query.age
req.headers     // Headers của request
req.method      // Phương thức HTTP (GET, POST, PUT, DELETE)
```

### Response (res) — dữ liệu server trả về
```javascript
res.send('text')            // Trả về text
res.json({ key: 'value' }) // Trả về JSON (dùng phổ biến nhất)
res.status(404).json({ message: 'Not found' }) // Trả về với status code
res.sendStatus(200)         // Trả về chỉ status code
```

---

## 4. Các HTTP Methods phổ biến

```javascript
app.get('/users', (req, res) => {
    res.json({ message: 'Lấy danh sách users' });
});

app.post('/users', (req, res) => {
    const newUser = req.body;
    res.status(201).json({ message: 'Tạo user thành công', user: newUser });
});

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    res.json({ message: `Cập nhật user ${id}` });
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    res.json({ message: `Xóa user ${id}` });
});
```

---

## 5. HTTP Status Code quan trọng
| Code | Ý nghĩa               | Dùng khi                |
| ---- | --------------------- | ----------------------- |
| 200  | OK                    | GET thành công          |
| 201  | Created               | POST tạo mới thành công |
| 400  | Bad Request           | Dữ liệu gửi lên sai     |
| 401  | Unauthorized          | Chưa đăng nhập          |
| 403  | Forbidden             | Không có quyền          |
| 404  | Not Found             | Không tìm thấy          |
| 500  | Internal Server Error | Lỗi server              |

---

## Bài tập thực hành

### Bài 1: Tạo Express server cơ bản
1. Tạo thư mục `express-demo`.
2. Chạy `npm init -y` và `npm install express`.
3. Tạo file `index.js` với server Express.
4. Thêm route `GET /` trả về `{ message: "Chào mừng đến với Express!" }`.
5. Chạy server và kiểm tra bằng Postman.

### Bài 2: Các routes cơ bản
Tạo server với các routes sau:
```
GET    /         → { message: "Trang chủ" }
GET    /about    → { message: "Giới thiệu" }
GET    /products → { products: ["Sản phẩm 1", "Sản phẩm 2"] }
```

### Bài 3: Nhận dữ liệu từ request
```javascript
// Nhận query string
app.get('/search', (req, res) => {
    const keyword = req.query.keyword;
    res.json({ message: `Tìm kiếm: ${keyword}` });
});
// Test: GET http://localhost:3000/search?keyword=javascript

// Nhận params
app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    res.json({ message: `Chi tiết sản phẩm ${id}` });
});
// Test: GET http://localhost:3000/products/5
```

### Câu hỏi kiểm tra
1. Tại sao cần `app.use(express.json())`?
2. Sự khác nhau giữa `req.params` và `req.query` là gì?
3. Khi tạo resource mới thành công, nên trả về status code nào?

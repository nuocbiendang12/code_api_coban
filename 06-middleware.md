# Giờ 2 — Middleware trong Express

## 1. Middleware là gì?
- **Middleware** là hàm được thực thi **ở giữa** request và response.
- Mỗi middleware có quyền truy cập `req`, `res`, và `next()`.
- Gọi `next()` để chuyển sang middleware hoặc route tiếp theo.
- **Không gọi `next()`** → request bị dừng lại tại đó.

```
Request → [Middleware 1] → [Middleware 2] → [Route Handler] → Response
              next()            next()
```

---

## 2. Cú pháp Middleware

```javascript
// Định nghĩa middleware
function tenMiddleware(req, res, next) {
    // Xử lý gì đó...
    console.log('Middleware chạy!');
    next(); // Bắt buộc phải gọi để tiếp tục
}

// Áp dụng toàn bộ app (global middleware)
app.use(tenMiddleware);

// Áp dụng cho một route cụ thể
app.get('/users', tenMiddleware, (req, res) => {
    res.json({ message: 'Users' });
});

// Áp dụng cho một nhóm routes
app.use('/admin', tenMiddleware, adminRoutes);
```

---

## 3. Built-in Middleware của Express

```javascript
// Đọc dữ liệu JSON từ request body (bắt buộc khi nhận POST/PUT)
app.use(express.json());

// Đọc dữ liệu từ HTML form
app.use(express.urlencoded({ extended: true }));

// Phục vụ file tĩnh (HTML, CSS, JS, ảnh)
app.use(express.static('public'));
```

---

## 4. Các Middleware tự viết phổ biến

### Logger — Ghi log mỗi request
```javascript
function logger(req, res, next) {
    const time = new Date().toISOString();
    console.log(`[${time}] ${req.method} ${req.url}`);
    next();
}

app.use(logger);
// Output: [2026-03-12T08:00:00.000Z] GET /users
```

### Auth Middleware — Kiểm tra token
```javascript
function checkToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Thiếu token, cần đăng nhập!' });
    }

    if (token !== 'Bearer my-secret-token') {
        return res.status(403).json({ message: 'Token không hợp lệ!' });
    }

    next(); // Token hợp lệ → cho tiếp tục
}

// Chỉ bảo vệ các route cần thiết
app.get('/profile', checkToken, (req, res) => {
    res.json({ message: 'Thông tin cá nhân' });
});

app.get('/admin', checkToken, (req, res) => {
    res.json({ message: 'Trang quản trị' });
});
```

### Validate Body — Kiểm tra dữ liệu đầu vào
```javascript
function validateUser(req, res, next) {
    const { name, email } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Tên không được trống!' });
    }

    if (!email || !email.includes('@')) {
        return res.status(400).json({ message: 'Email không hợp lệ!' });
    }

    next();
}

app.post('/users', validateUser, (req, res) => {
    res.status(201).json({ message: 'Tạo user thành công', user: req.body });
});
```

---

## 5. Error Handling Middleware

```javascript
// Phải có đúng 4 tham số: (err, req, res, next)
function errorHandler(err, req, res, next) {
    console.error('Lỗi:', err.message);
    res.status(err.status || 500).json({
        message: err.message || 'Lỗi server!'
    });
}

// Tạo lỗi và chuyển đến error handler
app.get('/test-error', (req, res, next) => {
    const err = new Error('Lỗi thử nghiệm!');
    err.status = 400;
    next(err); // Truyền lỗi xuống error handler
});

// Phải đặt SAU tất cả routes
app.use(errorHandler);
```

---

## 6. Thứ tự thực thi (cực kỳ quan trọng)

```javascript
app.use(express.json());          // 1. Parse JSON body
app.use(logger);                  // 2. Ghi log
app.use('/users', userRoutes);    // 3. Xử lý routes
app.use((req, res) => {           // 4. Route 404
    res.status(404).json({ message: 'Không tìm thấy!' });
});
app.use(errorHandler);            // 5. Xử lý lỗi (luôn cuối cùng)
```

> Middleware thực thi theo **thứ tự từ trên xuống dưới**, đặt sai vị trí sẽ gây lỗi logic.

---

## Bài tập thực hành

### Bài 1: Logger Middleware
Tạo middleware `logger` in ra mỗi request theo định dạng:
```
[2026-03-12T08:00:00.000Z] GET /users - IP: ::1
```
Gợi ý: dùng `req.ip` để lấy IP client.

### Bài 2: Auth Middleware
Tạo middleware `checkToken` kiểm tra header `Authorization`:
- Không có token → 401 `{ message: "Cần đăng nhập!" }`.
- Token sai → 403 `{ message: "Token không hợp lệ!" }`.
- Token đúng (`"Bearer abc123"`) → tiếp tục xử lý.

Áp dụng bảo vệ các routes:
- `GET /dashboard`
- `GET /profile`
- `DELETE /users/:id`

### Bài 3: Validate Middleware
Tạo middleware `validateProduct` cho route `POST /products`:
- `name`: không được trống, tối thiểu 3 ký tự.
- `price`: không được trống, phải là số dương.
- Nếu lỗi → trả về 400 với message mô tả rõ trường bị lỗi.

### Bài 4: Error Handler
1. Tạo route `GET /error` cố tình throw lỗi:
   ```javascript
   app.get('/error', (req, res, next) => {
       next(new Error('Lỗi thử nghiệm từ route!'));
   });
   ```
2. Tạo Error Handling Middleware bắt và trả về JSON.
3. Test bằng Postman, kiểm tra status code và message.

### Câu hỏi kiểm tra
1. Nếu middleware không gọi `next()`, điều gì xảy ra?
2. Tại sao Error Handler phải có đúng 4 tham số `(err, req, res, next)`?
3. Sự khác nhau giữa `app.use(middleware)` và `app.get('/path', middleware, handler)` là gì?

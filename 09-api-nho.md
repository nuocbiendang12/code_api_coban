# Bài tập tổng hợp — Tự code 1 API nhỏ

> **Mục tiêu**: Sau 3 giờ học lý thuyết, bạn tự xây dựng một REST API nhỏ hoàn chỉnh
> gồm `POST /users`, `GET /users`, `DELETE /users/:id`, kết nối MongoDB thật.

---

## Cấu trúc thư mục hoàn chỉnh

```
my-api/
├── .env
├── .gitignore
├── package.json
├── index.js          ← Entry point, khởi động server
├── db.js             ← Kết nối MongoDB
├── models/
│   └── User.js       ← Schema và Model
└── routes/
    └── userRoutes.js ← Toàn bộ logic users
```

---

## Bước 1 — Khởi tạo dự án

```bash
mkdir my-api
cd my-api
npm init -y
npm install express mongoose dotenv
npm install --save-dev nodemon
```

Thêm vào `package.json`:
```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

---

## Bước 2 — Tạo file .env và .gitignore

**.env**
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/my-api
PORT=3000
```

**.gitignore**
```
node_modules/
.env
*.log
```

---

## Bước 3 — Kết nối MongoDB (db.js)

```javascript
// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Kết nối MongoDB thành công!');
    } catch (error) {
        console.error('❌ Lỗi kết nối MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
```

---

## Bước 4 — Tạo User Model (models/User.js)

```javascript
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tên không được trống'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email không được trống'],
            unique: true,
            lowercase: true,
            trim: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
```

---

## Bước 5 — Tạo Routes (routes/userRoutes.js)

```javascript
// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ── POST /users ───────────────────────────────────────────
// Tạo user mới
router.post('/', async (req, res) => {
    try {
        const { name, email } = req.body;

        // Validate thủ công
        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'Tên không được trống!' });
        }
        if (!email || !email.includes('@')) {
            return res.status(400).json({ message: 'Email không hợp lệ!' });
        }

        // Kiểm tra email đã tồn tại chưa
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email đã được sử dụng!' });
        }

        const user = await User.create({ name, email });
        res.status(201).json({
            message: 'Tạo user thành công!',
            user
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ── GET /users ────────────────────────────────────────────
// Lấy danh sách tất cả users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json({
            total: users.length,
            users
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ── DELETE /users/:id ─────────────────────────────────────
// Xóa user theo ID
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy user!' });
        }

        res.json({ message: `Đã xóa user "${user.name}" thành công!` });
    } catch (err) {
        // ID không đúng định dạng MongoDB ObjectId
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'ID không hợp lệ!' });
        }
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
```

---

## Bước 6 — Entry Point (index.js)

```javascript
// index.js
require('dotenv').config(); // Phải ở dòng đầu tiên

const express = require('express');
const connectDB = require('./db');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Kết nối DB
connectDB();

// Logger đơn giản
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/users', userRoutes);

// Route mặc định
app.get('/', (req, res) => {
    res.json({ message: 'API đang hoạt động!' });
});

// Route 404
app.use((req, res) => {
    res.status(404).json({ message: `Endpoint ${req.method} ${req.url} không tồn tại!` });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Lỗi server!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
```

---

## Bước 7 — Chạy server

```bash
npm run dev
```

Terminal sẽ hiện:
```
🚀 Server chạy tại http://localhost:3000
✅ Kết nối MongoDB thành công!
```

---

## Bước 8 — Test bằng Postman

### 1. Tạo user mới — `POST /users`
```
Method : POST
URL    : http://localhost:3000/users
Headers: Content-Type: application/json
Body   :
{
    "name": "Nguyễn Văn A",
    "email": "a@gmail.com"
}
```
Kết quả mong đợi: **Status 201**
```json
{
  "message": "Tạo user thành công!",
  "user": {
    "_id": "...",
    "name": "Nguyễn Văn A",
    "email": "a@gmail.com",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### 2. Lấy danh sách users — `GET /users`
```
Method : GET
URL    : http://localhost:3000/users
```
Kết quả mong đợi: **Status 200**
```json
{
  "total": 1,
  "users": [...]
}
```

---

### 3. Xóa user — `DELETE /users/:id`
```
Method : DELETE
URL    : http://localhost:3000/users/<_id_của_user>
```
Kết quả mong đợi: **Status 200**
```json
{
  "message": "Đã xóa user \"Nguyễn Văn A\" thành công!"
}
```

---

### 4. Test các trường hợp lỗi

| Test case                  | Kết quả mong đợi                    |
| -------------------------- | ----------------------------------- |
| POST thiếu `name`          | 400 `"Tên không được trống!"`       |
| POST email sai định dạng   | 400 `"Email không hợp lệ!"`         |
| POST email đã tồn tại      | 400 `"Email đã được sử dụng!"`      |
| DELETE id không tồn tại    | 404 `"Không tìm thấy user!"`        |
| DELETE id sai định dạng    | 400 `"ID không hợp lệ!"`            |
| GET endpoint không tồn tại | 404 `"Endpoint ... không tồn tại!"` |

---

## Checklist hoàn thành

- [ ] Server khởi động thành công không có lỗi.
- [ ] Kết nối MongoDB thành công.
- [ ] `POST /users` tạo và lưu user vào MongoDB.
- [ ] `POST /users` trả về 400 khi thiếu name hoặc email sai.
- [ ] `POST /users` trả về 400 khi email đã tồn tại.
- [ ] `GET /users` trả về danh sách đầy đủ từ MongoDB.
- [ ] `DELETE /users/:id` xóa user thành công.
- [ ] `DELETE /users/:id` trả về 404 khi id không tồn tại.
- [ ] Logger in ra mỗi request trên terminal.
- [ ] Route 404 hoạt động khi gọi endpoint không có.

---

## Nâng cao (khi hoàn thành xong phần trên)

1. Thêm `GET /users/:id` — Lấy user theo ID.
2. Thêm `PUT /users/:id` — Cập nhật thông tin user.
3. Thêm tính năng phân trang: `GET /users?page=1&limit=5`.
4. Tách middleware logger ra file `middlewares/logger.js`.
5. Tách error handler ra file `middlewares/errorHandler.js`.

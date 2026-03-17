# Giờ 3 — Kết nối MongoDB

## 1. MongoDB là gì?
- **MongoDB** là cơ sở dữ liệu NoSQL lưu dữ liệu dưới dạng **document JSON** (thực ra là BSON).
- Không có bảng (table), thay vào đó có **collection** (tập hợp document).
- Rất hợp với Node.js vì dữ liệu là JSON — không cần chuyển đổi.

### So sánh SQL vs MongoDB
| SQL          | MongoDB                       |
| ------------ | ----------------------------- |
| Database     | Database                      |
| Table        | Collection                    |
| Row (hàng)   | Document                      |
| Column (cột) | Field                         |
| Primary Key  | `_id` (tự sinh)               |
| JOIN         | `$lookup` hoặc embed document |

---

## 2. Mongoose là gì?
- **Mongoose** là thư viện ODM (Object Data Modeling) cho MongoDB.
- Cung cấp **Schema** để định nghĩa cấu trúc dữ liệu.
- Tự động validate, giúp tương tác với MongoDB dễ hơn.

```bash
npm install mongoose
```

---

## 3. Kết nối MongoDB

### Tạo tài khoản MongoDB Atlas (cloud miễn phí)
1. Đăng ký tại: https://www.mongodb.com/cloud/atlas
2. Tạo cluster Free (M0).
3. Vào **Connect → Drivers** → copy Connection String dạng:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>
   ```

### Cài đặt dotenv để bảo mật
```bash
npm install dotenv
```

### File `.env`
```
MONGO_URI=mongodb+srv://myuser:mypass@cluster0.abc.mongodb.net/mydb
PORT=3000
```

> **Quan trọng**: Thêm `.env` vào `.gitignore` để không commit lên GitHub.

### db.js — Module kết nối
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Kết nối MongoDB thành công!');
    } catch (error) {
        console.error('❌ Kết nối MongoDB thất bại:', error.message);
        process.exit(1); // Dừng app nếu không kết nối được DB
    }
};

module.exports = connectDB;
```

### index.js
```javascript
require('dotenv').config(); // Phải gọi đầu tiên
const express = require('express');
const connectDB = require('./db');

const app = express();
app.use(express.json());

connectDB(); // Kết nối DB khi khởi động

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server chạy tại http://localhost:${process.env.PORT || 3000}`);
});
```

---

## 4. Tạo Schema và Model

```javascript
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tên không được trống'],
            trim: true,
            minlength: [2, 'Tên phải có ít nhất 2 ký tự']
        },
        email: {
            type: String,
            required: [true, 'Email không được trống'],
            unique: true,
            lowercase: true,
            trim: true
        },
        age: {
            type: Number,
            min: [0, 'Tuổi không được âm'],
            max: [120, 'Tuổi không hợp lệ']
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true // Tự tạo createdAt và updatedAt
    }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
```

---

## 5. CRUD với Mongoose

```javascript
// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /users — Lấy tất cả
router.get('/', async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /users/:id — Lấy một
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy user!' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /users — Tạo mới
router.post('/', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT /users/:id — Cập nhật
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // new: trả về doc sau update
        );
        if (!user) return res.status(404).json({ message: 'Không tìm thấy user!' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /users/:id — Xóa
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy user!' });
        res.json({ message: `Đã xóa user "${user.name}"` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
```

---

## 6. Các Mongoose Methods quan trọng

```javascript
// Tìm kiếm
User.find()                          // Lấy tất cả
User.find({ isActive: true })        // Lấy theo điều kiện
User.findById('abc123')              // Lấy theo _id
User.findOne({ email: 'a@g.com' })   // Lấy 1 document

// Tạo mới
User.create({ name: 'A', email: 'a@g.com' })
new User({ ... }).save()

// Cập nhật
User.findByIdAndUpdate(id, data, { new: true })
User.updateMany({ isActive: false }, { isActive: true })

// Xóa
User.findByIdAndDelete(id)
User.deleteMany({ isActive: false })

// Sắp xếp, giới hạn
User.find().sort({ createdAt: -1 }).limit(10).skip(20)
```

---

## Bài tập thực hành

### Bài 1: Kết nối MongoDB Atlas
1. Tạo tài khoản và cluster miễn phí.
2. Lấy Connection String, lưu vào `.env`.
3. Kết nối thành công, in ra `"Kết nối MongoDB thành công!"`.

### Bài 2: Product Model
Tạo `models/Product.js` với schema:
- `name`: String, required, minlength 3.
- `price`: Number, required, min 0.
- `category`: String, required.
- `stock`: Number, default 0.
- `timestamps`: true.

### Bài 3: CRUD API Products với MongoDB
Xây dựng CRUD API đầy đủ cho `products`:
- Kết nối MongoDB thật.
- Dùng model Product đã tạo.
- Test bằng Postman, kiểm tra data trong MongoDB Atlas.

### Câu hỏi kiểm tra
1. Sự khác nhau giữa `save()` và `create()` là gì?
2. `{ new: true }` trong `findByIdAndUpdate` có ý nghĩa gì?
3. Tại sao cần dùng `.env` thay vì ghi thẳng connection string vào code?

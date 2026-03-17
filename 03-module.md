# Giờ 1 — Module trong Node.js

## 1. Module là gì?
- **Module** là một file JavaScript riêng biệt, chứa code (hàm, biến, class) có thể chia sẻ và tái sử dụng ở các file khác.
- Giúp tổ chức code thành từng phần nhỏ, dễ bảo trì.
- Node.js hỗ trợ 2 hệ thống module:
  - **CommonJS (CJS)**: cú pháp `require` / `module.exports` — mặc định trong Node.js.
  - **ES Module (ESM)**: cú pháp `import` / `export` — chuẩn ES6 hiện đại.

---

## 2. CommonJS — Hệ thống module mặc định của Node.js

### Export (xuất)
```javascript
// math.js
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

// Xuất nhiều hàm
module.exports = { add, subtract };
```

### Export default một giá trị
```javascript
// logger.js
function logger(message) {
    console.log(`[LOG]: ${message}`);
}

module.exports = logger; // Xuất một hàm duy nhất
```

### Import (nhập)
```javascript
// index.js
const { add, subtract } = require('./math');       // Destructuring
const logger = require('./logger');                 // Import default

console.log(add(5, 3));       // 8
console.log(subtract(5, 3)); // 2
logger('Hello!');              // [LOG]: Hello!
```

---

## 3. ES Module (ESM) — Chuẩn ES6+

### Bật ES Module trong Node.js
Thêm vào `package.json`:
```json
{
  "type": "module"
}
```

### Named export
```javascript
// math.js
export function add(a, b) {
    return a + b;
}

export function subtract(a, b) {
    return a - b;
}
```

### Default export
```javascript
// logger.js
export default function logger(message) {
    console.log(`[LOG]: ${message}`);
}
```

### Import
```javascript
// index.js
import { add, subtract } from './math.js';   // Named import
import logger from './logger.js';             // Default import

console.log(add(10, 5));   // 15
logger('Server started'); // [LOG]: Server started
```

---

## 4. Built-in Modules của Node.js (không cần cài)

```javascript
// path — xử lý đường dẫn file
const path = require('path');
console.log(path.join(__dirname, 'data.txt'));  // Ghép đường dẫn
console.log(path.extname('file.js'));            // .js

// fs — đọc/ghi file
const fs = require('fs');
const content = fs.readFileSync('data.txt', 'utf8');
fs.writeFileSync('output.txt', 'Hello!');

// os — thông tin hệ điều hành
const os = require('os');
console.log(os.platform());  // win32
console.log(os.hostname());  // Tên máy tính
```

---

## 5. So sánh CommonJS và ES Module

| Tiêu chí       | CommonJS (`require`) | ES Module (`import`)                            |
| -------------- | -------------------- | ----------------------------------------------- |
| Cú pháp        | `require()`          | `import`                                        |
| Xuất           | `module.exports`     | `export` / `export default`                     |
| Thực thi       | Đồng bộ              | Bất đồng bộ                                     |
| Phổ biến trong | Node.js truyền thống | Dự án hiện đại                                  |
| Extension      | `.js`                | `.mjs` hoặc `.js` (khi dùng `"type": "module"`) |

---

## Bài tập thực hành

### Bài 1: Tạo module tính toán (CommonJS)
1. Tạo file `calculator.js` với 4 hàm: `add`, `subtract`, `multiply`, `divide`.
2. Export tất cả các hàm bằng `module.exports`.
3. Tạo file `index.js`, import và gọi cả 4 hàm với các số tự chọn.

### Bài 2: Tạo module xử lý users
Tạo file `userHelper.js`:
```javascript
const users = [
    { id: 1, name: 'Nguyễn Văn A' },
    { id: 2, name: 'Trần Thị B' },
];

function getAllUsers() {
    return users;
}

function findUserById(id) {
    return users.find(u => u.id === id) || null;
}

function addUser(user) {
    users.push({ id: users.length + 1, ...user });
    return users;
}

module.exports = { getAllUsers, findUserById, addUser };
```
Tạo file `app.js`, import và:
1. In danh sách tất cả users.
2. Tìm user có ID = 1.
3. Thêm user mới rồi in lại danh sách.

### Bài 3: Thực hành Built-in Module
Tạo file `fileDemo.js`:
1. Dùng `fs` đọc nội dung một file `.txt`.
2. Dùng `path` để lấy đường dẫn đầy đủ và extension của file.
3. In kết quả ra console.

### Câu hỏi kiểm tra
1. Sự khác nhau giữa `require` (CommonJS) và `import` (ESM) là gì?
2. Tại sao module quan trọng trong dự án backend lớn?
3. Built-in module khác gì so với module tự tạo hay package từ npm?

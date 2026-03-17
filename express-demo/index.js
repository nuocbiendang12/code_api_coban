const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

// Route GET /users
app.get('/users', (req, res) => {
    res.json({ message: 'Lấy danh sách users' });
});

// Route POST /users
app.post('/users', (req, res) => {
    const newUser = req.body;
    res.status(201).json({ message: 'Tạo user thành công', user: newUser });
});

// Route PUT /users/:id
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    res.json({ message: `Cập nhật user ${id}` });
});

// Route DELETE /users/:id
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    res.json({ message: `Xóa user ${id}` });
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

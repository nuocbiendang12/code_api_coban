const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

app.use(express.json());

// Gắn router với prefix
app.use('/users', userRoutes);       // /users, /users/:id
app.use('/products', productRoutes); // /products, /products/:id

// Route 404 — Xử lý khi không tìm thấy endpoint
app.use((req, res) => {
    res.status(404).json({ message: `Không tìm thấy ${req.method} ${req.url}` });
});

app.listen(3000, () => {
    console.log('Server chạy tại http://localhost:3000');
});

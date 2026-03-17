const express = require('express');
const router = express.Router();

// GET /products
router.get('/', (req, res) => {
    res.json({ products: [] });
});

// GET /products/:id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    res.json({ id });
});

// POST /products
router.post('/', (req, res) => {
    const newProduct = req.body;
    res.status(201).json({ message: 'Tạo product thành công', product: newProduct });
});

// PUT /products/:id
router.put('/:id', (req, res) => {
    res.json({ message: `Cập nhật product ${req.params.id}` });
});
//DELETE /product/:id
router.delete('/:id', (req, res) => {
    res.json({ message: `Xóa product ${req.params.id}` });
});

module.exports = router;
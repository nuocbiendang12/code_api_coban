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

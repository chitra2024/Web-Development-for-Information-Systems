const express = require('express');
const { registerAdmin, authUser, createEmployee, getUsers, deleteUser, toggleUserActive } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/admin', registerAdmin);
router.post('/login', authUser);
router.post('/create', protect, admin, createEmployee);
router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);
router.put('/:id', protect, admin, toggleUserActive);

module.exports = router;

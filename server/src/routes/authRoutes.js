const express = require('express');
const router = express.Router();
const { login, register, refresh, logout, getMe } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/register', protect, authorize('admin'), register);
router.post('/refresh', refresh);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;


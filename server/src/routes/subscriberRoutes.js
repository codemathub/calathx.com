const express = require('express');
const router = express.Router();
const { subscribe, getSubscribers, unsubscribe } = require('../controllers/subscriberController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', subscribe);
router.post('/unsubscribe', unsubscribe);
router.get('/', protect, authorize('admin', 'editor'), getSubscribers);

module.exports = router;


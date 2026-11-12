const express = require('express');
const router = express.Router();
const {
  submitContact,
  getSubmissions,
  markAsRead,
  deleteSubmission,
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', submitContact);
router.get('/', protect, authorize('admin', 'editor'), getSubmissions);
router.patch('/:id/read', protect, authorize('admin', 'editor'), markAsRead);
router.delete('/:id', protect, authorize('admin', 'editor'), deleteSubmission);

module.exports = router;


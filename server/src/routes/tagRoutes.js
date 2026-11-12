const express = require('express');
const router = express.Router();
const { getTags, createTag, deleteTag } = require('../controllers/tagController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getTags);
router.post('/', protect, authorize('admin', 'editor', 'author'), createTag);
router.delete('/:id', protect, authorize('admin', 'editor'), deleteTag);

module.exports = router;


const express = require('express');
const router = express.Router();
const { getMedia, uploadMedia, deleteMedia } = require('../controllers/mediaController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', protect, getMedia);
router.post('/upload', protect, authorize('admin', 'editor', 'author'), upload.single('file'), uploadMedia);
router.delete('/:id', protect, authorize('admin', 'editor'), deleteMedia);

module.exports = router;


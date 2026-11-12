const express = require('express');
const router = express.Router();
const {
  getCommentsByPost,
  createComment,
  getAllComments,
  approveComment,
  deleteComment,
} = require('../controllers/commentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/post/:postId', getCommentsByPost);
router.post('/post/:postId', createComment);

router.get('/', protect, authorize('admin', 'editor'), getAllComments);
router.patch('/:id/approve', protect, authorize('admin', 'editor'), approveComment);
router.delete('/:id', protect, authorize('admin', 'editor'), deleteComment);

module.exports = router;


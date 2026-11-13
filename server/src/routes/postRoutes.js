const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostBySlug,
  getPostsByCategory,
  getPostsByTag,
  getPopularPosts,
  getLatestPosts,
  getRelatedPosts,
  getVideoPosts,
  toggleFeaturedPost,
  updatePostOrder,
  createPost,
  updatePost,
  deletePost,
  incrementView,
} = require('../controllers/postController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getPosts);
router.get('/videos', getVideoPosts);
router.get('/popular', getPopularPosts);
router.get('/latest', getLatestPosts);
router.get('/category/:slug', getPostsByCategory);
router.get('/tag/:slug', getPostsByTag);
router.get('/related/:id', getRelatedPosts);
router.get('/:slug', getPostBySlug);
router.patch('/:id/view', incrementView);
router.patch('/:id/feature', protect, authorize('admin', 'editor'), toggleFeaturedPost);
router.patch('/:id/order', protect, authorize('admin', 'editor'), updatePostOrder);

router.post('/', protect, authorize('admin', 'editor', 'author'), createPost);
router.put('/:id', protect, authorize('admin', 'editor', 'author'), updatePost);
router.delete('/:id', protect, authorize('admin', 'editor'), deletePost);

module.exports = router;


const express = require('express');
const router = express.Router();
const { searchPosts, getSitemap } = require('../controllers/searchController');

router.get('/search', searchPosts);
router.get('/sitemap.xml', getSitemap);

module.exports = router;


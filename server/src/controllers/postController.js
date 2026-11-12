const Post = require('../models/Post');
const Category = require('../models/Category');
const Tag = require('../models/Tag');

const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const status = req.query.status || 'publish';
    const skip = (page - 1) * limit;

    const filter = {};
    if (status !== 'all') filter.status = status;

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate('author', 'username displayName')
        .populate('categories', 'name slug icon')
        .populate('tags', 'name slug')
        .populate('featuredImage', 'url altText')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: posts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const getPostBySlug = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate('author', 'username displayName')
      .populate('categories', 'name slug icon')
      .populate('tags', 'name slug')
      .populate('featuredImage', 'url altText');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

const getPostsByCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = { categories: category._id, status: 'publish' };
    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate('author', 'username displayName')
        .populate('categories', 'name slug icon')
        .populate('featuredImage', 'url altText')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(filter),
    ]);

    res.json({
      success: true,
      category,
      data: posts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const getPostsByTag = async (req, res, next) => {
  try {
    const tag = await Tag.findOne({ slug: req.params.slug });
    if (!tag) {
      return res.status(404).json({ success: false, message: 'Tag not found' });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = { tags: tag._id, status: 'publish' };
    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate('categories', 'name slug')
        .populate('featuredImage', 'url altText')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(filter),
    ]);

    res.json({
      success: true,
      tag,
      data: posts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const getPopularPosts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const posts = await Post.find({ status: 'publish' })
      .populate('categories', 'name slug')
      .populate('featuredImage', 'url altText')
      .sort({ viewCount: -1, publishedAt: -1 })
      .limit(limit);

    res.json({ success: true, data: posts });
  } catch (error) {
    next(error);
  }
};

const getLatestPosts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const posts = await Post.find({ status: 'publish' })
      .populate('categories', 'name slug')
      .populate('featuredImage', 'url altText')
      .sort({ publishedAt: -1 })
      .limit(limit);

    res.json({ success: true, data: posts });
  } catch (error) {
    next(error);
  }
};

const getRelatedPosts = async (req, res, next) => {
  try {
    const current = await Post.findById(req.params.id);
    if (!current) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const posts = await Post.find({
      _id: { $ne: current._id },
      status: 'publish',
      categories: { $in: current.categories },
    })
      .populate('categories', 'name slug')
      .populate('featuredImage', 'url altText')
      .sort({ publishedAt: -1 })
      .limit(4);

    res.json({ success: true, data: posts });
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    const post = await Post.create({
      ...req.body,
      author: req.user._id,
    });
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    next(error);
  }
};

const incrementView = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    ).select('viewCount');
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, viewCount: post.viewCount });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getPostBySlug,
  getPostsByCategory,
  getPostsByTag,
  getPopularPosts,
  getLatestPosts,
  getRelatedPosts,
  createPost,
  updatePost,
  deletePost,
  incrementView,
};


const Comment = require('../models/Comment');

const getCommentsByPost = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId, approved: true }).sort({
      createdAt: 1,
    });
    res.json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};

const createComment = async (req, res, next) => {
  try {
    const comment = await Comment.create({
      post: req.params.postId,
      authorName: req.body.authorName,
      authorEmail: req.body.authorEmail,
      content: req.body.content,
      parent: req.body.parent || null,
      approved: false, // requires admin moderation
    });
    res.status(201).json({
      success: true,
      message: 'Comment submitted and awaiting moderation',
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

const getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.find()
      .populate('post', 'title slug')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};

const approveComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { approved: req.body.approved ?? true },
      { new: true }
    );
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    res.json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCommentsByPost,
  createComment,
  getAllComments,
  approveComment,
  deleteComment,
};


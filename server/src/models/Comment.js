const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    authorName: { type: String, required: true, trim: true },
    authorEmail: { type: String, required: true, trim: true, lowercase: true },
    content: { type: String, required: true, trim: true },
    approved: { type: Boolean, default: false },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);


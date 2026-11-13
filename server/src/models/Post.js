const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    wpId: { type: Number, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    content: { type: String, required: true },
    excerpt: { type: String, default: '' },
    status: { type: String, enum: ['publish', 'draft', 'private'], default: 'draft' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    featuredImage: { type: mongoose.Schema.Types.ObjectId, ref: 'Media', default: null },
    featuredImageUrl: { type: String, default: '' },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    seo: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      focusKeyword: { type: String, default: '' },
    },
    tableOfContents: [
      {
        id: String,
        text: String,
        level: Number,
      },
    ],
    inlineImages: [{ type: String }],
    videoUrl: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false, index: true },
    homeOrder: { type: Number, default: 999, index: true },
    viewCount: { type: Number, default: 0 },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

postSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ categories: 1, status: 1, publishedAt: -1 });

module.exports = mongoose.model('Post', postSchema);


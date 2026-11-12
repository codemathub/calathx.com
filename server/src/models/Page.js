const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema(
  {
    wpId: { type: Number, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    content: { type: String, default: '' },
    status: { type: String, enum: ['publish', 'draft', 'private'], default: 'publish' },
    seo: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
    },
    menuOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Page', pageSchema);


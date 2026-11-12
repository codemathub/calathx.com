const mongoose = require('mongoose');

const listSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('List', listSchema);


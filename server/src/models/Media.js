const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    url: { type: String, required: true },
    b2Key: { type: String, default: '' },
    mimeType: { type: String, default: 'image/jpeg' },
    altText: { type: String, default: '' },
    size: { type: Number, default: 0 },
    width: { type: Number },
    height: { type: Number },
    wpId: { type: Number, index: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Media', mediaSchema);


const path = require('path');
const Media = require('../models/Media');
const { uploadToB2, deleteFromB2 } = require('../config/s3');

const getMedia = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 30;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Media.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Media.countDocuments(),
    ]);

    res.json({
      success: true,
      data: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const ext = path.extname(req.file.originalname);
    const baseName = path.basename(req.file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '-');
    const b2Key = `uploads/${new Date().getFullYear()}/${Date.now()}-${baseName}${ext}`;

    const url = await uploadToB2(req.file.buffer, b2Key, req.file.mimetype);

    const media = await Media.create({
      filename: req.file.originalname,
      url,
      b2Key,
      mimeType: req.file.mimetype,
      size: req.file.size,
      altText: req.body.altText || baseName,
      uploadedBy: req.user?._id,
    });

    res.status(201).json({ success: true, data: media });
  } catch (error) {
    next(error);
  }
};

const deleteMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    if (media.b2Key) {
      await deleteFromB2(media.b2Key);
    }

    await media.deleteOne();
    res.json({ success: true, message: 'Media deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMedia, uploadMedia, deleteMedia };


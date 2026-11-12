const Tag = require('../models/Tag');

const getTags = async (req, res, next) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.json({ success: true, data: tags });
  } catch (error) {
    next(error);
  }
};

const createTag = async (req, res, next) => {
  try {
    const tag = await Tag.create(req.body);
    res.status(201).json({ success: true, data: tag });
  } catch (error) {
    next(error);
  }
};

const deleteTag = async (req, res, next) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag) return res.status(404).json({ success: false, message: 'Tag not found' });
    res.json({ success: true, message: 'Tag deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTags, createTag, deleteTag };


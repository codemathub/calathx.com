const Page = require('../models/Page');

const getPages = async (req, res, next) => {
  try {
    const pages = await Page.find().sort({ menuOrder: 1, title: 1 });
    res.json({ success: true, data: pages });
  } catch (error) {
    next(error);
  }
};

const getPageBySlug = async (req, res, next) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
    res.json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
};

const upsertPage = async (req, res, next) => {
  try {
    const page = await Page.findOneAndUpdate({ slug: req.params.slug }, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    res.json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPages, getPageBySlug, upsertPage };


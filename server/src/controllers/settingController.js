const SiteSetting = require('../models/SiteSetting');

const getSettings = async (req, res, next) => {
  try {
    const settings = await SiteSetting.find();
    const mapped = settings.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
    res.json({ success: true, data: mapped });
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const entries = Object.entries(req.body);
    await Promise.all(
      entries.map(([key, value]) =>
        SiteSetting.findOneAndUpdate(
          { key },
          { key, value, type: typeof value },
          { upsert: true, new: true }
        )
      )
    );
    res.json({ success: true, message: 'Settings updated' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSettings, updateSettings };


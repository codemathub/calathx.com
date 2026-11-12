const Post = require('../models/Post');
const Category = require('../models/Category');
const Page = require('../models/Page');

const searchPosts = async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) {
      return res.json({ success: true, data: [] });
    }

    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const posts = await Post.find({
      status: 'publish',
      $or: [{ title: regex }, { excerpt: regex }, { content: regex }],
    })
      .populate('categories', 'name slug')
      .populate('featuredImage', 'url altText')
      .sort({ publishedAt: -1 })
      .limit(20);

    res.json({ success: true, query: q, data: posts });
  } catch (error) {
    next(error);
  }
};

const getSitemap = async (req, res, next) => {
  try {
    const siteUrl = (process.env.SITE_URL || 'https://calathx.com').replace(/\/$/, '');
    const [posts, categories, pages] = await Promise.all([
      Post.find({ status: 'publish' }).populate('categories', 'slug').select('slug categories updatedAt'),
      Category.find().select('slug'),
      Page.find({ status: 'publish' }).select('slug updatedAt'),
    ]);

    const urls = [
      `<url><loc>${siteUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
      ...pages.map(
        (p) =>
          `<url><loc>${siteUrl}/${p.slug}/</loc><lastmod>${p.updatedAt.toISOString()}</lastmod><priority>0.7</priority></url>`
      ),
      ...categories.map(
        (c) => `<url><loc>${siteUrl}/${c.slug}/</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`
      ),
      ...posts.map((post) => {
        const catSlug = post.categories?.[0]?.slug || 'fitness-workouts';
        return `<url><loc>${siteUrl}/${catSlug}/${post.slug}/</loc><lastmod>${post.updatedAt.toISOString()}</lastmod><priority>0.9</priority></url>`;
      }),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join(
      '\n'
    )}\n</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    next(error);
  }
};

module.exports = { searchPosts, getSitemap };


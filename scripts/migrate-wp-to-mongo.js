/**
 * Migrate WordPress SQL dump (nerd_calathx.sql) to MongoDB.
 *
 * Usage:
 *   node migrate-wp-to-mongo.js             # Run full migration into MongoDB
 *   node migrate-wp-to-mongo.js --dry-run   # Parse and report without writing to MongoDB
 */
const fs = require('fs');
const path = require('path');

const serverDir = path.resolve(__dirname, '../server');
require(require.resolve('dotenv', { paths: [serverDir] })).config({
  path: path.join(serverDir, '.env'),
});

const mongoose = require(require.resolve('mongoose', { paths: [serverDir] }));
const { loadSqlFile, extractTable } = require('./sqlParser');

const User = require('../server/src/models/User');
const Category = require('../server/src/models/Category');
const Tag = require('../server/src/models/Tag');
const Media = require('../server/src/models/Media');
const Post = require('../server/src/models/Post');
const Page = require('../server/src/models/Page');
const List = require('../server/src/models/List');
const Subscriber = require('../server/src/models/Subscriber');
const SiteSetting = require('../server/src/models/SiteSetting');

const SQL_PATH = path.resolve(__dirname, '../../nerd_calathx.sql');
const IMAGE_MAP_PATH = path.resolve(__dirname, 'b2-image-map.json');
const isDryRun = process.argv.includes('--dry-run');

const CATEGORY_ICONS = {
  'fitness-workouts': '/images/2019/07/fitness.png',
  fuel: '/images/2019/07/fuel.png',
  'health-az': '/images/2019/07/health.png',
  nutrition: '/images/2019/07/nutrition.png',
  'video-tutorials': '',
};

const CATEGORY_ORDER = {
  'fitness-workouts': 1,
  fuel: 2,
  'health-az': 3,
  nutrition: 4,
  'video-tutorials': 5,
};

function rewriteImageUrl(url, imageMap) {
  if (!url) return '';
  const match = url.match(/wp-content\/uploads\/(.+)$/i);
  if (!match) return url;
  let rel = match[1].replace(/-\d+x\d+(\.[a-z0-9]+)$/i, '$1');
  if (imageMap[rel]) return imageMap[rel];
  if (imageMap[match[1]]) return imageMap[match[1]];
  return `/images/${rel}`;
}

function cleanPostContent(html, imageMap) {
  if (!html) return { cleanedHtml: '', tableOfContents: [], inlineImages: [] };

  // Extract Table of Contents items from <ul class="hashbackground">
  const tableOfContents = [];
  const tocRegex = /<li[^>]*class="([^"]*)"[^>]*>[\s\S]*?<a[^>]*href="#([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/li>/gi;
  let tocMatch;
  while ((tocMatch = tocRegex.exec(html)) !== null) {
    const cls = tocMatch[1];
    const id = tocMatch[2];
    const text = tocMatch[3].replace(/<[^>]+>/g, '').trim();
    if (text) {
      tableOfContents.push({
        id,
        text,
        level: cls.includes('hash-link3') ? 3 : 2,
      });
    }
  }

  // Strip Flatsome layout shortcodes while keeping inner HTML
  let cleaned = html
    .replace(/\[\/?(?:row|col|section|ux_slider|ux_banner_grid|col_grid|text_box|tabgroup|tab)[^\]]*\]/gi, '')
    .replace(/\[ux_video[^\]]*\]/gi, '')
    .replace(/\[video_button[^\]]*\]/gi, '');

  // Rewrite all wp-content/uploads URLs in content
  const inlineImages = [];
  cleaned = cleaned.replace(
    /https?:\/\/(?:www\.)?calathx\.com\/wp-content\/uploads\/([^\s"'<>]+)/gi,
    (fullUrl, rel) => {
      const mapped = rewriteImageUrl(fullUrl, imageMap);
      if (!inlineImages.includes(mapped)) inlineImages.push(mapped);
      return mapped;
    }
  );

  // Convert WordPress newlines to clean paragraphs where needed, preserve existing HTML
  return { cleanedHtml: cleaned.trim(), tableOfContents, inlineImages };
}

async function run() {
  console.log(`Reading SQL dump from ${SQL_PATH}...`);
  const sql = loadSqlFile(SQL_PATH);
  const imageMap = fs.existsSync(IMAGE_MAP_PATH)
    ? JSON.parse(fs.readFileSync(IMAGE_MAP_PATH, 'utf8'))
    : {};

  // Extract tables
  const wpUsers = extractTable(sql, 'ca18_users');
  const wpTerms = extractTable(sql, 'ca18_terms');
  const wpTaxonomies = extractTable(sql, 'ca18_term_taxonomy');
  const wpTermRels = extractTable(sql, 'ca18_term_relationships');
  const wpPosts = extractTable(sql, 'ca18_posts');
  const wpPostMeta = extractTable(sql, 'ca18_postmeta');
  const wpYoast = extractTable(sql, 'ca18_yoast_indexable');
  const wpContacts = extractTable(sql, 'ca18_ig_contacts');
  const wpLists = extractTable(sql, 'ca18_ig_lists');
  const wpListContacts = extractTable(sql, 'ca18_ig_lists_contacts');
  const wpPostViews = extractTable(sql, 'ca18_post_views');

  const publishedPosts = wpPosts.filter((p) => p.post_type === 'post' && p.post_status === 'publish');
  const publishedPages = wpPosts.filter((p) => p.post_type === 'page' && p.post_status === 'publish');
  const attachments = wpPosts.filter((p) => p.post_type === 'attachment');

  const termMap = new Map(wpTerms.map((t) => [t.term_id, t]));
  const categoriesTax = wpTaxonomies.filter((t) => t.taxonomy === 'category');
  const tagsTax = wpTaxonomies.filter((t) => t.taxonomy === 'post_tag');

  console.log('--- Extracted Summary ---');
  console.log(`Users: ${wpUsers.length}`);
  console.log(`Categories: ${categoriesTax.length}`);
  console.log(`Tags: ${tagsTax.length}`);
  console.log(`Attachments: ${attachments.length}`);
  console.log(`Published Pages: ${publishedPages.length}`);
  console.log(`Published Posts: ${publishedPosts.length}`);
  console.log(`Subscribers: ${wpContacts.length}`);

  if (isDryRun) {
    console.log('\n[DRY RUN] Sample post titles:');
    publishedPosts.slice(0, 10).forEach((p, idx) => console.log(`  ${idx + 1}. ${p.post_title} (/${p.post_name}/)`));
    console.log('[DRY RUN] Complete. No database changes made.');
    return;
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB.');

  // 1. Migrate Users
  const userIdMap = new Map();
  for (const u of wpUsers) {
    const existing = await User.findOne({ username: u.user_login.toLowerCase() });
    if (existing) {
      userIdMap.set(u.ID, existing._id);
      continue;
    }
    const created = await User.create({
      username: u.user_login.toLowerCase(),
      email: u.user_email.toLowerCase(),
      passwordHash: 'CalathX@2026!', // Change immediately after first login
      displayName: u.display_name || u.user_login,
      role: 'admin',
    });
    userIdMap.set(u.ID, created._id);
  }
  console.log(`Migrated ${userIdMap.size} users.`);

  // 2. Migrate Categories
  const taxToCategoryId = new Map();
  for (const tax of categoriesTax) {
    const term = termMap.get(tax.term_id);
    if (!term || term.slug === 'uncategorized') continue;

    const doc = await Category.findOneAndUpdate(
      { slug: term.slug },
      {
        name: term.name,
        slug: term.slug,
        description: tax.description || '',
        icon: CATEGORY_ICONS[term.slug] || '',
        order: CATEGORY_ORDER[term.slug] || 99,
      },
      { upsert: true, new: true }
    );
    taxToCategoryId.set(tax.term_taxonomy_id, doc._id);
  }
  console.log(`Migrated ${taxToCategoryId.size} categories.`);

  // 3. Migrate Tags
  const taxToTagId = new Map();
  for (const tax of tagsTax) {
    const term = termMap.get(tax.term_id);
    if (!term) continue;

    const doc = await Tag.findOneAndUpdate(
      { slug: term.slug },
      { name: term.name, slug: term.slug },
      { upsert: true, new: true }
    );
    taxToTagId.set(tax.term_taxonomy_id, doc._id);
  }
  console.log(`Migrated ${taxToTagId.size} tags.`);

  // 4. Migrate Attachments -> Media
  const wpAttachmentToMedia = new Map();
  for (const att of attachments) {
    const url = rewriteImageUrl(att.guid, imageMap);
    const doc = await Media.findOneAndUpdate(
      { wpId: att.ID },
      {
        wpId: att.ID,
        filename: att.post_title || path.basename(url),
        url,
        mimeType: att.post_mime_type || 'image/jpeg',
        altText: att.post_excerpt || att.post_title || '',
        uploadedBy: userIdMap.get(att.post_author) || null,
      },
      { upsert: true, new: true }
    );
    wpAttachmentToMedia.set(att.ID, doc);
  }
  console.log(`Migrated ${wpAttachmentToMedia.size} media records.`);

  // Build lookup maps for postmeta, yoast, views, and term relationships
  const thumbnailByPost = new Map();
  for (const meta of wpPostMeta) {
    if (meta.meta_key === '_thumbnail_id') {
      thumbnailByPost.set(Number(meta.post_id), Number(meta.meta_value));
    }
  }

  const yoastByPost = new Map();
  for (const y of wpYoast) {
    if (y.object_type === 'post' && y.object_id) {
      yoastByPost.set(Number(y.object_id), y);
    }
  }

  const viewsByPost = new Map();
  for (const v of wpPostViews) {
    if (v.type === 4) {
      // type 4 in Post Views Counter is total views
      viewsByPost.set(Number(v.id), Number(v.count) || 0);
    }
  }

  const termsByPost = new Map();
  for (const rel of wpTermRels) {
    if (!termsByPost.has(rel.object_id)) termsByPost.set(rel.object_id, []);
    termsByPost.get(rel.object_id).push(rel.term_taxonomy_id);
  }

  // 5. Migrate Pages
  for (const p of publishedPages) {
    const { cleanedHtml } = cleanPostContent(p.post_content, imageMap);
    const y = yoastByPost.get(p.ID);
    await Page.findOneAndUpdate(
      { slug: p.post_name },
      {
        wpId: p.ID,
        title: p.post_title,
        slug: p.post_name,
        content: cleanedHtml,
        status: 'publish',
        menuOrder: p.menu_order || 0,
        seo: {
          title: y?.title || p.post_title,
          description: y?.description || '',
        },
      },
      { upsert: true, new: true }
    );
  }
  console.log(`Migrated ${publishedPages.length} pages.`);

  // 6. Migrate Posts
  for (const p of publishedPosts) {
    const { cleanedHtml, tableOfContents, inlineImages } = cleanPostContent(p.post_content, imageMap);
    const taxIds = termsByPost.get(p.ID) || [];
    const categories = taxIds.map((tid) => taxToCategoryId.get(tid)).filter(Boolean);
    const tags = taxIds.map((tid) => taxToTagId.get(tid)).filter(Boolean);

    const thumbWpId = thumbnailByPost.get(p.ID);
    const mediaDoc = thumbWpId ? wpAttachmentToMedia.get(thumbWpId) : null;
    const y = yoastByPost.get(p.ID);

    // Strip HTML for auto-excerpt if post_excerpt is empty
    const plainText = cleanedHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const excerpt = p.post_excerpt?.trim() || plainText.slice(0, 180) + (plainText.length > 180 ? '...' : '');

    await Post.findOneAndUpdate(
      { slug: p.post_name },
      {
        wpId: p.ID,
        title: p.post_title,
        slug: p.post_name,
        content: cleanedHtml,
        excerpt,
        status: 'publish',
        author: userIdMap.get(p.post_author) || null,
        featuredImage: mediaDoc?._id || null,
        featuredImageUrl: mediaDoc?.url || inlineImages[0] || '',
        categories,
        tags,
        seo: {
          title: y?.title || p.post_title,
          description: y?.description || excerpt,
          focusKeyword: y?.primary_focus_keyword || '',
        },
        tableOfContents,
        inlineImages,
        viewCount: viewsByPost.get(p.ID) || 0,
        publishedAt: new Date(p.post_date_gmt || p.post_date),
      },
      { upsert: true, new: true }
    );
  }
  console.log(`Migrated ${publishedPosts.length} posts.`);

  // 7. Migrate Lists & Subscribers
  const listIdMap = new Map();
  for (const l of wpLists) {
    const doc = await List.findOneAndUpdate(
      { slug: l.hash || l.name.toLowerCase().replace(/\s+/g, '-') },
      { name: l.name, slug: l.hash || l.name.toLowerCase().replace(/\s+/g, '-'), description: l.desc || '' },
      { upsert: true, new: true }
    );
    listIdMap.set(l.id, doc._id);
  }

  for (const c of wpContacts) {
    if (!c.email) continue;
    const rels = wpListContacts.filter((lc) => lc.contact_id === c.id);
    const lists = rels.map((r) => listIdMap.get(r.list_id)).filter(Boolean);
    await Subscriber.findOneAndUpdate(
      { email: c.email.toLowerCase() },
      {
        email: c.email.toLowerCase(),
        firstName: c.first_name || '',
        status: c.unsubscribed ? 'unsubscribed' : 'subscribed',
        lists,
        subscribedAt: c.created_at ? new Date(c.created_at) : new Date(),
      },
      { upsert: true, new: true }
    );
  }
  console.log(`Migrated ${wpContacts.length} subscribers.`);

  // 8. Seed Exact Site Settings
  const defaultSettings = [
    { key: 'siteName', value: 'CalathX' },
    { key: 'siteDescription', value: 'Health, Fitness & Wellness' },
    { key: 'contactPhone', value: '+919953609096' },
    { key: 'contactEmail', value: 'info@calathx.com' },
    { key: 'instagramUsername', value: 'calathx_official' },
    {
      key: 'socialLinks',
      value: {
        facebook: 'https://www.facebook.com/CalathX-338136270170048/',
        linkedin: 'https://www.linkedin.com/company/calathx',
        instagram: 'https://www.instagram.com/calathx_official/',
        twitter: 'https://twitter.com/calathx',
        youtube: 'https://www.youtube.com/channel/UCHLZbXRjUGf6obeV-YuxSqw',
        pinterest: 'https://in.pinterest.com/calathx/',
      },
    },
  ];
  for (const s of defaultSettings) {
    await SiteSetting.findOneAndUpdate({ key: s.key }, { ...s, type: typeof s.value }, { upsert: true });
  }
  console.log('Migrated site settings.');

  await mongoose.disconnect();
  console.log('Migration complete!');
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});

/**
 * Upload all original images from wp-content/uploads to Backblaze B2 S3
 * and generate scripts/b2-image-map.json.
 *
 * Usage:
 *   node migrate-images-b2.js           # Upload to Backblaze B2 S3
 *   node migrate-images-b2.js --local   # Generate local /images/... map without uploading
 */
const fs = require('fs');
const path = require('path');

const serverDir = path.resolve(__dirname, '../server');
require(require.resolve('dotenv', { paths: [serverDir] })).config({
  path: path.join(serverDir, '.env'),
});
const { uploadToB2 } = require('../server/src/config/s3');

const UPLOADS_DIR = path.resolve(__dirname, '../../calathx.com/calathx.com/wp-content/uploads');
const MAP_FILE = path.resolve(__dirname, 'b2-image-map.json');
const isLocalOnly = process.argv.includes('--local');

const MIME_MAP = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

function walkDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, fileList);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      // Only include original images (exclude WP generated -WxH thumbnails)
      if (MIME_MAP[ext] && !/\d+x\d+\.[^.]+$/i.test(entry.name)) {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

async function run() {
  const files = walkDir(UPLOADS_DIR);
  console.log(`Found ${files.length} original images in ${UPLOADS_DIR}`);

  const existingMap = fs.existsSync(MAP_FILE)
    ? JSON.parse(fs.readFileSync(MAP_FILE, 'utf8'))
    : {};

  const imageMap = { ...existingMap };
  let uploaded = 0;
  let failed = 0;

  for (const fullPath of files) {
    const relPath = path.relative(UPLOADS_DIR, fullPath).replace(/\\/g, '/');
    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_MAP[ext] || 'application/octet-stream';

    if (isLocalOnly) {
      imageMap[relPath] = `/images/${relPath}`;
      uploaded++;
      continue;
    }

    if (imageMap[relPath] && imageMap[relPath].startsWith('http')) {
      continue; // Already uploaded
    }

    try {
      const buffer = fs.readFileSync(fullPath);
      const b2Key = `uploads/${relPath}`;
      const url = await uploadToB2(buffer, b2Key, contentType);
      imageMap[relPath] = url;
      uploaded++;
      if (uploaded % 25 === 0) {
        console.log(`Uploaded ${uploaded}/${files.length}...`);
        fs.writeFileSync(MAP_FILE, JSON.stringify(imageMap, null, 2));
      }
    } catch (err) {
      console.error(`Failed to upload ${relPath}:`, err.message);
      failed++;
    }
  }

  fs.writeFileSync(MAP_FILE, JSON.stringify(imageMap, null, 2));
  console.log(`Done! Mode: ${isLocalOnly ? 'LOCAL' : 'B2 S3'} | Processed: ${uploaded} | Failed: ${failed}`);
  console.log(`Mapping saved to ${MAP_FILE}`);
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

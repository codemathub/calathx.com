# CalathX — React + Vite + Node.js + MongoDB

Migrated from WordPress (`cmd
` + `nerd_calathx.sql`) to a modern MERN stack with **Resend** for email and **Backblaze B2 (S3)** for media storage.

## Quick Start

1. **Configure environment variables** in `server/.env`:
   - `MONGODB_URI` (local MongoDB or MongoDB Atlas)
   - `RESEND_API_KEY` (from Resend dashboard)
   - `B2_BUCKET_NAME`, `B2_KEY_ID`, `B2_APP_KEY`, `B2_ENDPOINT` (Backblaze B2 S3)

2. **Migrate images & WordPress SQL data**:
   ```bash
   cd scripts
   node migrate-images-b2.js         # Uploads 358 original images to Backblaze B2 (or --local for /images/)
   node migrate-wp-to-mongo.js       # Imports users, categories, tags, pages, posts, subscribers, settings
   ```

3. **Run Backend & Frontend**:
   ```bash
   # Terminal 1 - Backend
   cd server && npm run dev

   # Terminal 2 - Frontend
   cd client && npm run dev
   ```

4. **Admin CMS**:
   Visit `http://localhost:5173/admin/login` (migrated WP users have temporary password `CalathX@2026!` — change it immediately).


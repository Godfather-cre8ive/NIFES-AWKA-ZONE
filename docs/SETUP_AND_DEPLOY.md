# NIFES Awka Zone — Complete Setup & Deployment Guide

## ────────────────────────────────────────────────
## STEP 1: PREREQUISITES
## ────────────────────────────────────────────────

Install these before starting:
- Node.js 18+ → https://nodejs.org
- Git → https://git-scm.com
- A free Supabase account → https://supabase.com
- A free Vercel account → https://vercel.com
- A free Railway account → https://railway.app

---

## ────────────────────────────────────────────────
## STEP 2: DATABASE SETUP (Supabase)
## ────────────────────────────────────────────────

1. Go to https://supabase.com → Create new project
   - Name: "nifes-awka"
   - Database password: choose a strong password
   - Region: choose closest to Nigeria (EU West or US East)
   - Click "Create new project" → wait ~2 minutes

2. Once ready, go to: SQL Editor (left sidebar)

3. Paste the ENTIRE contents of `backend/src/db/schema.sql`
   into the editor and click RUN

4. You should see: "Success. No rows returned."

5. Go to: Project Settings → API
   - Copy "Project URL" → this is your SUPABASE_URL
   - Copy "service_role" key (NOT anon) → this is your SUPABASE_SERVICE_KEY
   ⚠️  NEVER expose service_role key in frontend code

---

## ────────────────────────────────────────────────
## STEP 3: LOCAL DEVELOPMENT SETUP
## ────────────────────────────────────────────────

### Clone & install

```bash
git clone https://github.com/your-org/nifes-awka.git
cd nifes-awka

# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your actual values (see Step 2 for Supabase keys)

# Frontend
cd ../frontend
npm install
```

### Backend .env (fill in your values):
```
PORT=4000
NODE_ENV=development
SUPABASE_URL=https://xxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=nifes-awka-zone-super-secret-jwt-key-change-this-2026
CORS_ORIGIN=http://localhost:3000
```

### Frontend .env.local:
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Run both servers:

```bash
# Terminal 1 — Backend API
cd backend && npm run dev
# ✅ API running on http://localhost:4000

# Terminal 2 — Frontend
cd frontend && npm run dev
# ✅ Website on http://localhost:3000
```

### First admin login:
1. Go to http://localhost:3000/admin/login
2. Email: admin@nifesawka.org
3. Password: NifesAwka2026!
4. ⚠️  CHANGE THIS PASSWORD IMMEDIATELY after first login

---

## ────────────────────────────────────────────────
## STEP 4: DEPLOY BACKEND → Railway
## ────────────────────────────────────────────────

1. Push backend code to GitHub (or a new repo):
   ```bash
   cd backend
   git init
   git add .
   git commit -m "NIFES Awka backend"
   git remote add origin https://github.com/your-name/nifes-awka-backend.git
   git push -u origin main
   ```

2. Go to https://railway.app → New Project → Deploy from GitHub Repo
   → Select your backend repo

3. In Railway project settings, add Environment Variables:
   ```
   PORT=4000
   NODE_ENV=production
   SUPABASE_URL=https://xxxxxx.supabase.co
   SUPABASE_SERVICE_KEY=your_service_key
   JWT_SECRET=your_production_jwt_secret_minimum_32_chars
   CORS_ORIGIN=https://your-vercel-domain.vercel.app
   ```

4. Railway will auto-detect Node.js and deploy.
   Copy your Railway URL: e.g. https://nifes-awka-backend.up.railway.app

---

## ────────────────────────────────────────────────
## STEP 5: DEPLOY FRONTEND → Vercel
## ────────────────────────────────────────────────

```bash
# Install Vercel CLI
npm install -g vercel

cd frontend
vercel
```

Or use Vercel Dashboard:
1. Go to https://vercel.com → New Project
2. Import your frontend GitHub repo
3. Framework: Next.js (auto-detected)
4. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app/api
   NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
   ```
5. Click Deploy

5. After deployment, update Railway's CORS_ORIGIN to your Vercel URL

---

## ────────────────────────────────────────────────
## STEP 6: CUSTOM DOMAIN (Optional)
## ────────────────────────────────────────────────

### For Vercel (frontend):
1. Vercel Dashboard → Project → Settings → Domains
2. Add: nifesawkazone.org (or whatever domain)
3. Update your domain DNS with the provided records

### For Railway (backend):
1. Railway Dashboard → Project → Settings → Domains
2. Add custom domain: api.nifesawkazone.org
3. Update CORS_ORIGIN in Railway env vars

---

## ────────────────────────────────────────────────
## STEP 7: GOOGLE DRIVE SETUP (Resources)
## ────────────────────────────────────────────────

For each resource category:
1. Create a folder in Google Drive
2. Right-click folder → Share → "Anyone with the link"
3. Copy the folder URL
4. In Admin Portal → Resources → Update the Drive URL for each category

For Anchor Devotional PDFs:
- Upload daily PDFs to the Anchor Devotional folder
- Name files with dates: "Anchor-2026-03-07.pdf"
- The folder link is shared — users browse directly in Drive

---

## ────────────────────────────────────────────────
## STEP 8: UPLOADING IMAGES
## ────────────────────────────────────────────────

Since we use Google Drive for storage (no cost):

1. For staff/student photos:
   - Upload to Google Drive
   - Right-click → Share → "Anyone with the link"
   - Get the direct image URL format:
     https://drive.google.com/uc?export=view&id=FILE_ID
   - Use this URL in the admin portal photo fields

2. For gallery images (same process):
   - Upload event photos to Drive
   - Use direct view URLs in gallery image fields

3. For news cover images:
   - Same Google Drive direct link approach

---

## ────────────────────────────────────────────────
## STEP 9: ADMIN PORTAL USAGE GUIDE
## ────────────────────────────────────────────────

Go to: https://your-site.vercel.app/admin/login

### Weekly tasks:
- [ ] Monday: Update Word for Today
- [ ] Friday: Upload new Bible Quiz (set start: Friday, end: Sunday)
- [ ] Review new prayer requests
- [ ] Approve submitted testimonies

### Monthly tasks:
- [ ] Add upcoming events
- [ ] Upload new news/blog posts
- [ ] Update gallery with recent photos

### How to add a staff member:
1. Admin → Staff → Add New
2. Fill: name, role, bio, photo URL (Google Drive), contact
3. Toggle "is_featured" for Training Secretary

### How to create a quiz:
1. Admin → Bible Quiz → Choose type
2. Enter title, set start date (must be Friday), end date (Sunday)
3. For Multiple Choice: fill all 10 questions with options + correct answer
4. For Chronological: enter events in CORRECT order (they get shuffled for users)
5. Click Create & Publish Quiz

### How to manage newsletter subscribers:
1. Admin → Newsletter → see count
2. Click "Export CSV" to download full email list for sending campaigns

---

## ────────────────────────────────────────────────
## MOBILE PERFORMANCE NOTES
## ────────────────────────────────────────────────

The site is optimised for students on mobile data:

1. **Images**: Loaded lazily — only when scrolled into view
2. **Gallery**: Images NOT loaded on homepage — only when album is clicked
3. **Server Components**: Homepage data fetched server-side = faster first load
4. **ISR (60s cache)**: Pages revalidate every 60 seconds — reduces API calls
5. **Fonts**: Loaded with display:swap — text visible even before fonts load
6. **No large JS bundles**: Carousel library is lightweight (Embla ~6KB)
7. **Compression**: Express and Vercel both compress responses

Expected Lighthouse scores:
- Performance: 85-95 (mobile)
- SEO: 95+
- Accessibility: 90+

---

## ────────────────────────────────────────────────
## TROUBLESHOOTING
## ────────────────────────────────────────────────

### "Cannot connect to API"
- Check NEXT_PUBLIC_API_URL is correct
- Ensure backend is running (`npm run dev` in /backend)
- Check Railway logs for errors

### "CORS Error"
- Verify CORS_ORIGIN in Railway exactly matches your Vercel URL
- Include https:// and no trailing slash

### "JWT token expired"
- Admin tokens expire after 8 hours — just log in again

### "Supabase RLS blocking writes"
- Ensure backend uses SERVICE_KEY (not anon key)
- Service key bypasses RLS — safe only in backend

### "Quiz not showing"
- Check quiz start_date <= today <= end_date
- Ensure is_active = true in database

### Database password reset:
- Supabase Dashboard → Settings → Database → Reset DB password

---

## ────────────────────────────────────────────────
## PROJECT FILE REFERENCE
## ────────────────────────────────────────────────

| File | Purpose |
|------|---------|
| frontend/app/page.tsx | Main homepage |
| frontend/app/layout.tsx | Root layout (fonts, meta) |
| frontend/app/admin/login/page.tsx | Admin login |
| frontend/app/admin/dashboard/page.tsx | Admin dashboard |
| frontend/app/news/[slug]/page.tsx | Full news article |
| frontend/app/about/[slug]/page.tsx | About pages |
| frontend/components/sections/* | All homepage sections |
| frontend/components/layout/Navbar.tsx | Navigation |
| frontend/components/layout/Footer.tsx | Footer |
| frontend/lib/api.ts | API client (all fetch calls) |
| backend/src/server.ts | Express entry point |
| backend/src/db/schema.sql | Full database schema |
| backend/src/db/supabase.ts | Supabase client |
| backend/src/middleware/auth.ts | JWT verification |
| backend/src/routes/* | All API route handlers |

---

## ────────────────────────────────────────────────
## SUPPORT & MAINTENANCE
## ────────────────────────────────────────────────

Built by: [Your Name/Team]
For: NIFES Awka Zone Media Team
Stack: Next.js 14 + Express + Supabase + Tailwind CSS
Hosting: Vercel + Railway + Supabase (all free tiers)

Free tier limits (sufficient for this site):
- Vercel: 100GB bandwidth/month, unlimited builds
- Railway: $5 free credit/month (~500hrs)
- Supabase: 500MB DB, 2GB bandwidth, 50,000 rows

© 2026 NIFES Awka Zone

# NIFES Awka Zone — Complete Web System

## Project Overview
Full-stack website for NIFES (Nigeria Fellowship of Evangelical Students) Awka Zone.
Mobile-first, optimized for student mobile data usage.

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Backend**: Node.js + Express REST API
- **Database**: Supabase (PostgreSQL)
- **Auth**: JWT (admin portal)
- **File Storage**: Google Drive links
- **Hosting**: Vercel (frontend) + Railway (backend)

## Project Structure
```
nifes-awka/
├── frontend/                    # Next.js app — deploy to Vercel
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Main homepage
│   │   ├── about/[slug]/page.tsx
│   │   ├── news/[id]/page.tsx
│   │   ├── quiz/page.tsx
│   │   └── admin/
│   │       ├── login/page.tsx
│   │       └── dashboard/page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── sections/
│   │   │   ├── HeroSlider.tsx
│   │   │   ├── WordForToday.tsx
│   │   │   ├── AboutCarousel.tsx
│   │   │   ├── StaffSection.tsx
│   │   │   ├── AlumniSection.tsx
│   │   │   ├── StudentCorner.tsx
│   │   │   ├── SchoolsDirectory.tsx
│   │   │   ├── TestimonySection.tsx
│   │   │   ├── NewsSection.tsx
│   │   │   ├── EventsSection.tsx
│   │   │   ├── GallerySection.tsx
│   │   │   ├── ResourcesSection.tsx
│   │   │   ├── QuizSection.tsx
│   │   │   ├── NewsletterForm.tsx
│   │   │   ├── PrayerRequestForm.tsx
│   │   │   ├── DonateSection.tsx
│   │   │   └── ContactSection.tsx
│   │   └── ui/
│   │       ├── Carousel.tsx
│   │       ├── Modal.tsx
│   │       └── Card.tsx
│   ├── lib/
│   │   ├── api.ts               # API client
│   │   └── utils.ts
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   └── package.json
│
├── backend/                     # Express API — deploy to Railway
│   ├── src/
│   │   ├── server.ts            # Entry point
│   │   ├── middleware/
│   │   │   └── auth.ts          # JWT middleware
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── hero.routes.ts
│   │   │   ├── word.routes.ts
│   │   │   ├── staff.routes.ts
│   │   │   ├── students.routes.ts
│   │   │   ├── schools.routes.ts
│   │   │   ├── testimonies.routes.ts
│   │   │   ├── news.routes.ts
│   │   │   ├── events.routes.ts
│   │   │   ├── gallery.routes.ts
│   │   │   ├── resources.routes.ts
│   │   │   ├── quiz.routes.ts
│   │   │   ├── newsletter.routes.ts
│   │   │   └── prayer.routes.ts
│   │   ├── controllers/         # Business logic per route
│   │   └── db/
│   │       ├── supabase.ts      # Supabase client
│   │       └── schema.sql       # Full DB schema
│   ├── .env.example
│   └── package.json
│
└── docs/
    ├── SETUP.md
    └── DEPLOY.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier works)

### 1. Clone and Install
```bash
git clone https://github.com/your-org/nifes-awka.git
cd nifes-awka

# Install frontend
cd frontend && npm install

# Install backend
cd ../backend && npm install
```

### 2. Environment Variables

**frontend/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**backend/.env**
```
PORT=4000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=your_strong_random_secret_min_32_chars
ADMIN_EMAIL=admin@nifesawka.org
ADMIN_PASSWORD_HASH=bcrypt_hashed_password
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 3. Database Setup
- Create Supabase project at supabase.com
- Go to SQL Editor → paste contents of backend/src/db/schema.sql → Run
- Copy your project URL and service key to backend/.env

### 4. Run Locally
```bash
# Terminal 1 — Backend
cd backend && npm run dev
# Runs on http://localhost:4000

# Terminal 2 — Frontend  
cd frontend && npm run dev
# Runs on http://localhost:3000
```

### 5. First Admin Login
After running schema.sql, the default admin is created:
- Email: admin@nifesawka.org
- Password: NifesAwka2026! (CHANGE IMMEDIATELY after first login)

Go to: http://localhost:3000/admin/login

## Deployment

### Frontend → Vercel
```bash
cd frontend
npx vercel
# Set environment variable: NEXT_PUBLIC_API_URL=https://your-railway-url/api
```

### Backend → Railway
1. Push backend/ to a GitHub repo
2. Connect to Railway → New Project → Deploy from GitHub
3. Add environment variables in Railway dashboard
4. Copy Railway URL → update NEXT_PUBLIC_API_URL in Vercel

### Database → Supabase (already hosted)
No extra deployment needed — Supabase is cloud-hosted.

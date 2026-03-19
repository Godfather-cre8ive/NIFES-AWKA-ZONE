-- ============================================================
-- FILE: backend/src/db/schema.sql
-- PURPOSE: Complete PostgreSQL schema for NIFES Awka Zone
-- Run this in Supabase SQL Editor to set up all tables
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────────
-- ADMIN USERS TABLE
-- Stores admin portal credentials
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,  -- bcrypt hashed
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) DEFAULT 'media_officer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Insert default admin (password: NifesAwka2026!)
-- Hash generated with bcrypt rounds=12
INSERT INTO admins (email, password_hash, name, role)
VALUES (
  'admin@nifesawka.org',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqBf4d4eL3x.qZKFHiKN7OwJVEme',
  'Media Officer',
  'media_officer'
) ON CONFLICT (email) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- HERO SLIDES TABLE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slide_number INTEGER NOT NULL UNIQUE CHECK (slide_number IN (1,2,3)),
  title TEXT NOT NULL,
  subtitle TEXT,
  message TEXT,
  button_text VARCHAR(100),
  button_link TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FIX: Ensure UNIQUE constraint exists even if table was created before this fix
ALTER TABLE hero_slides DROP CONSTRAINT IF EXISTS hero_slides_slide_number_key;
ALTER TABLE hero_slides ADD CONSTRAINT hero_slides_slide_number_key UNIQUE (slide_number);

-- Default slides
INSERT INTO hero_slides (slide_number, title, subtitle, message, button_text, button_link) VALUES
(1, 'Welcome to NIFES Awka Zone', 'Training Students to Transform Society',
 'We are a fellowship of evangelical students committed to the total evangelisation of the Nigerian university campus.',
 'Learn More', '#about'),
(2, 'Zonal Congress 2026', 'Where God''s Word Meets Student Hearts',
 'Join us for a life-changing zonal congress. Sessions, worship, fellowship, and more.',
 'Register Now', 'https://forms.google.com/your-form'),
(3, 'Message from the Chairman', 'A word of encouragement for every student',
 'God is raising a generation of students who will not bow to the pressures of the world. Stand firm in your faith.',
 'Read More', '#about')
ON CONFLICT (slide_number) DO NOTHING;  -- FIX: explicit conflict target

-- ─────────────────────────────────────────────────────────────
-- WORD FOR TODAY TABLE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS word_for_today (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scripture_text TEXT NOT NULL,
  reference VARCHAR(100) NOT NULL UNIQUE,
  reflection TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FIX: Ensure UNIQUE constraint exists even if table was created before this fix
ALTER TABLE word_for_today DROP CONSTRAINT IF EXISTS word_for_today_reference_key;
ALTER TABLE word_for_today ADD CONSTRAINT word_for_today_reference_key UNIQUE (reference);

-- FIX: Added ON CONFLICT guard to prevent duplicate error on re-run
INSERT INTO word_for_today (scripture_text, reference, reflection) VALUES
('"Let the word of Christ dwell in you richly in all wisdom, teaching and admonishing one another in psalms and hymns and spiritual songs, singing with grace in your hearts to the Lord."',
 'Colossians 3:16',
 'As students, the Word of God should be our daily anchor. Make time today to read and meditate on Scripture.')
ON CONFLICT (reference) DO NOTHING;  -- FIX: added conflict guard

-- ─────────────────────────────────────────────────────────────
-- ABOUT PAGES TABLE
-- (About NIFES, Vision, Mission, History, Statement of Faith)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS about_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,  -- e.g. 'about-nifes', 'vision'
  title VARCHAR(255) NOT NULL,
  card_summary TEXT NOT NULL,         -- shown on carousel card
  full_content TEXT NOT NULL,         -- shown on full page
  icon VARCHAR(50),                   -- emoji or icon name
  display_order INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FIX: Added ON CONFLICT (slug) DO NOTHING — this was the direct cause of the reported error
INSERT INTO about_pages (slug, title, card_summary, full_content, icon, display_order) VALUES
('about-nifes', 'About NIFES', 'The Nigeria Fellowship of Evangelical Students is a student movement committed to winning students for Christ.',
 '<h2>About NIFES</h2><p>The Nigeria Fellowship of Evangelical Students (NIFES) was established in 1969 to reach Nigerian university students with the Gospel of Jesus Christ...</p>', '🎓', 1),
('vision', 'Our Vision', 'To see every student in Nigeria impacted by the Gospel and discipled into a lifestyle of faith.',
 '<h2>Our Vision</h2><p>We envision a Nigeria where every student on campus has heard the Gospel, and where trained students go out to transform society...</p>', '👁️', 2),
('mission', 'Our Mission', 'Training and mobilising students to evangelise their campuses and transform Nigerian society through the Word.',
 '<h2>Our Mission</h2><p>The mission of NIFES is to win students to Christ, build them in faith, and send them forth to serve...</p>', '🎯', 3),
('history-awka', 'History of Awka Zone', 'The Awka Zonal fellowship was established to coordinate student fellowships across universities in Awka.',
 '<h2>History of Awka Zone</h2><p>The Awka Zone of NIFES was birthed out of a desire to bring coordination and fellowship to student groups across the Awka region...</p>', '📖', 4),
('statement-of-faith', 'Statement of Faith', 'We affirm the inspiration and authority of the Bible as the only infallible rule of faith and practice.',
 '<h2>Statement of Faith</h2><p>We believe in the Holy Scriptures as originally given by God, divinely inspired, infallible, entirely trustworthy, and the supreme authority...</p>', '✝️', 5)
ON CONFLICT (slug) DO NOTHING;  -- FIX: added conflict guard

-- ─────────────────────────────────────────────────────────────
-- STAFF PROFILES TABLE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  bio TEXT,
  photo_url TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  whatsapp VARCHAR(50),
  is_featured BOOLEAN DEFAULT false,  -- Training Secretary featured at top
  featured_message TEXT,              -- Featured person's message
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- NACF / ALUMNI TABLE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS nacf_section (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chairman_name VARCHAR(255),
  chairman_message TEXT,
  chairman_photo_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nacf_announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  announcement_type VARCHAR(50) DEFAULT 'general', -- 'reunion', 'meeting', 'event'
  event_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- STUDENT LEADERS TABLE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS student_leaders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  office VARCHAR(255) NOT NULL,
  school VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50),
  contact_email VARCHAR(255),
  photo_url TEXT,
  leader_type VARCHAR(50) DEFAULT 'zonal',  -- 'zonal' or 'sub-zonal'
  is_president BOOLEAN DEFAULT false,        -- Zonal president featured at top
  president_message TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- FELLOWSHIP SCHOOLS TABLE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fellowship_schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_name VARCHAR(255) NOT NULL,
  meeting_day VARCHAR(50),       -- e.g. "Thursdays"
  venue TEXT,
  fellowship_email VARCHAR(255),
  leader_name VARCHAR(255),
  leader_contact VARCHAR(50),
  google_maps_url TEXT,          -- Full Google Maps URL for "View on Map"
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TESTIMONIES TABLE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  headline VARCHAR(255) NOT NULL,
  testifier_name VARCHAR(255) NOT NULL,
  full_testimony TEXT NOT NULL,
  testimony_date DATE DEFAULT CURRENT_DATE,
  is_approved BOOLEAN DEFAULT false,  -- Admin approves before display
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- NEWS / BLOG TABLE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS news_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  cover_image_url TEXT,
  excerpt TEXT,
  content TEXT NOT NULL,          -- HTML content
  author VARCHAR(255) DEFAULT 'NIFES Awka Zone',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-generate slug from title (trigger)
CREATE OR REPLACE FUNCTION generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := LOWER(REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- FIX: Drop trigger before creating to avoid "already exists" error on re-run
DROP TRIGGER IF EXISTS news_slug_trigger ON news_posts;
CREATE TRIGGER news_slug_trigger
BEFORE INSERT OR UPDATE ON news_posts  -- FIX: added OR UPDATE so slug updates when title changes
FOR EACH ROW EXECUTE FUNCTION generate_slug();

-- ─────────────────────────────────────────────────────────────
-- EVENTS TABLE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  location TEXT,
  registration_link TEXT,         -- Google Form URL
  cover_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- GALLERY TABLE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  album_id UUID REFERENCES gallery_albums(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,        -- Can be Google Drive direct link
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- RESOURCES TABLE
-- Links to Google Drive folders
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  drive_url TEXT NOT NULL,
  icon VARCHAR(50),
  is_devotional BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FIX: Ensure UNIQUE constraint exists even if table was created before this fix
ALTER TABLE resources DROP CONSTRAINT IF EXISTS resources_category_key;
ALTER TABLE resources ADD CONSTRAINT resources_category_key UNIQUE (category);

-- FIX: Added ON CONFLICT (category) DO NOTHING to prevent duplicate error on re-run
INSERT INTO resources (category, description, drive_url, icon, is_devotional, display_order) VALUES
('Anchor Devotional', 'Daily devotional for students', 'https://drive.google.com/drive/folders/your-folder-id', '📖', true, 1),
('Daily Prayer Bulletin', 'Corporate prayer points for the zone', 'https://drive.google.com/drive/folders/your-folder-id', '🙏', false, 2),
('Bible Study Outlines', 'Weekly Bible study materials', 'https://drive.google.com/drive/folders/your-folder-id', '📋', false, 3),
('Spiritual Books', 'Recommended Christian books for students', 'https://drive.google.com/drive/folders/your-folder-id', '📚', false, 4),
('Sermons', 'Audio and video sermon archives', 'https://drive.google.com/drive/folders/your-folder-id', '🎤', false, 5),
('Music Ministrations', 'Worship songs and choir recordings', 'https://drive.google.com/drive/folders/your-folder-id', '🎵', false, 6),
('Drama Presentations', 'Drama scripts and recordings', 'https://drive.google.com/drive/folders/your-folder-id', '🎭', false, 7),
('Training Manuals', 'Leadership and discipleship manuals', 'https://drive.google.com/drive/folders/your-folder-id', '📝', false, 8),
('Self-Help Books', 'Personal development resources', 'https://drive.google.com/drive/folders/your-folder-id', '💡', false, 9)
ON CONFLICT (category) DO NOTHING;  -- FIX: added conflict guard

-- ─────────────────────────────────────────────────────────────
-- QUIZ TABLES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  quiz_type VARCHAR(50) NOT NULL,   -- 'multiple_choice' or 'chronological'
  start_date DATE NOT NULL,         -- Must be a Friday
  end_date DATE NOT NULL,           -- Usually Sunday
  is_active BOOLEAN DEFAULT true,
  show_leaderboard BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions for multiple choice quiz
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer VARCHAR(1) NOT NULL CHECK (correct_answer IN ('A','B','C','D')),
  question_order INTEGER DEFAULT 0,
  explanation TEXT                  -- Shown after quiz submission
);

-- Events for chronological quiz
CREATE TABLE IF NOT EXISTS quiz_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  correct_position INTEGER NOT NULL,  -- 1 = earliest, N = latest
  display_order INTEGER DEFAULT 0     -- Random display order (shuffled)
);

-- Quiz submissions / scores
CREATE TABLE IF NOT EXISTS quiz_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  participant_name VARCHAR(255),
  participant_email VARCHAR(255),
  school VARCHAR(255),
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  answers JSONB,                      -- Store submitted answers
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- NEWSLETTER SUBSCRIBERS TABLE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- PRAYER REQUESTS TABLE
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS prayer_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255),              -- Optional
  email VARCHAR(255),             -- Optional
  request_message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  is_answered BOOLEAN DEFAULT false,
  admin_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- SITE SETTINGS TABLE
-- General configurable settings
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO site_settings (key, value, description) VALUES
('bank_name', 'First Bank of Nigeria', 'Donation bank name'),
('account_name', 'NIFES Awka Zonal Fellowship', 'Donation account name'),
('account_number', '1234567890', 'Donation account number'),
('confirmation_phone', '+234 801 234 5678', 'Call to confirm donation'),
('contact_email', 'nifesawkazone@gmail.com', 'Main contact email'),
('contact_phone', '+234 802 345 6789', 'Main phone number'),
('office_address', 'NIFES Zonal Office, Awka, Anambra State', 'Physical address'),
('facebook_url', 'https://facebook.com/nifesawkazone', 'Facebook page'),
('whatsapp_number', '+2348012345678', 'WhatsApp contact'),
('instagram_url', 'https://instagram.com/nifesawkazone', 'Instagram'),
('telegram_url', 'https://t.me/nifesawkazone', 'Telegram channel'),
('chairman_name', 'Bro. Emmanuel Okafor', 'Council Chairman name'),
('training_secretary_name', 'Sis. Grace Nwosu', 'Training Secretary name')
ON CONFLICT (key) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (Supabase)
-- Allow public read, service-key-only write
-- ─────────────────────────────────────────────────────────────
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_for_today ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_leaders ENABLE ROW LEVEL SECURITY;
ALTER TABLE fellowship_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonies ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE nacf_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE nacf_announcements ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────
-- RLS POLICIES
-- FIX: All policies now use DROP POLICY IF EXISTS before CREATE
-- to prevent "policy already exists" errors on re-run
-- ─────────────────────────────────────────────────────────────

-- Public read policies
DROP POLICY IF EXISTS "public_read_hero" ON hero_slides;
CREATE POLICY "public_read_hero" ON hero_slides FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "public_read_word" ON word_for_today;
CREATE POLICY "public_read_word" ON word_for_today FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "public_read_about" ON about_pages;
CREATE POLICY "public_read_about" ON about_pages FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_staff" ON staff;
CREATE POLICY "public_read_staff" ON staff FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "public_read_students" ON student_leaders;
CREATE POLICY "public_read_students" ON student_leaders FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "public_read_schools" ON fellowship_schools;
CREATE POLICY "public_read_schools" ON fellowship_schools FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "public_read_testimonies" ON testimonies;
CREATE POLICY "public_read_testimonies" ON testimonies FOR SELECT USING (is_approved = true AND is_active = true);

DROP POLICY IF EXISTS "public_read_news" ON news_posts;
CREATE POLICY "public_read_news" ON news_posts FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "public_read_events" ON events;
CREATE POLICY "public_read_events" ON events FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "public_read_albums" ON gallery_albums;
CREATE POLICY "public_read_albums" ON gallery_albums FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "public_read_images" ON gallery_images;
CREATE POLICY "public_read_images" ON gallery_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_resources" ON resources;
CREATE POLICY "public_read_resources" ON resources FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "public_read_quizzes" ON quizzes;
CREATE POLICY "public_read_quizzes" ON quizzes FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "public_read_questions" ON quiz_questions;
CREATE POLICY "public_read_questions" ON quiz_questions FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_quiz_events" ON quiz_events;
CREATE POLICY "public_read_quiz_events" ON quiz_events FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_settings" ON site_settings;
CREATE POLICY "public_read_settings" ON site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_nacf" ON nacf_section;
CREATE POLICY "public_read_nacf" ON nacf_section FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_nacf_ann" ON nacf_announcements;
CREATE POLICY "public_read_nacf_ann" ON nacf_announcements FOR SELECT USING (is_active = true);

-- Public insert policies
DROP POLICY IF EXISTS "public_insert_quiz_sub" ON quiz_submissions;
CREATE POLICY "public_insert_quiz_sub" ON quiz_submissions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "public_insert_newsletter" ON newsletter_subscribers;
CREATE POLICY "public_insert_newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "public_insert_prayer" ON prayer_requests;
CREATE POLICY "public_insert_prayer" ON prayer_requests FOR INSERT WITH CHECK (true);

-- Service role (backend) has full access via SUPABASE_SERVICE_KEY

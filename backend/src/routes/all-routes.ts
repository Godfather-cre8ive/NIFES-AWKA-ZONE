// ============================================================
// FILE: backend/src/routes/staff.routes.ts
// PURPOSE: Staff CRUD — public GET, protected POST/PUT/DELETE
// ============================================================

import { Router } from 'express';
import { supabase } from '../db/supabase';
import { requireAuth } from '../middleware/auth';

const router = Router();

// GET /api/staff — public
router.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/staff — admin only
router.post('/', requireAuth, async (req: any, res) => {
  const { data, error } = await supabase.from('staff').insert(req.body).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /api/staff/:id
router.put('/:id', requireAuth, async (req: any, res) => {
  const { data, error } = await supabase.from('staff').update(req.body).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// DELETE /api/staff/:id
router.delete('/:id', requireAuth, async (req: any, res) => {
  const { error } = await supabase.from('staff').update({ is_active: false }).eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Staff member removed.' });
});

export default router;


// ============================================================
// FILE: backend/src/routes/students.routes.ts
// ============================================================

const studentsRouter = Router();

studentsRouter.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('student_leaders')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

studentsRouter.post('/', requireAuth, async (req: any, res) => {
  const { data, error } = await supabase.from('student_leaders').insert(req.body).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

studentsRouter.put('/:id', requireAuth, async (req: any, res) => {
  const { data, error } = await supabase.from('student_leaders').update(req.body).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

studentsRouter.delete('/:id', requireAuth, async (req: any, res) => {
  await supabase.from('student_leaders').update({ is_active: false }).eq('id', req.params.id);
  res.json({ message: 'Removed.' });
});

export { studentsRouter as default };


// ============================================================
// FILE: backend/src/routes/schools.routes.ts
// ============================================================

const schoolsRouter = Router();

schoolsRouter.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('fellowship_schools')
    .select('*')
    .eq('is_active', true)
    .order('school_name');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

schoolsRouter.post('/', requireAuth, async (req: any, res) => {
  const { data, error } = await supabase.from('fellowship_schools').insert(req.body).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

schoolsRouter.put('/:id', requireAuth, async (req: any, res) => {
  const { data, error } = await supabase.from('fellowship_schools').update(req.body).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

schoolsRouter.delete('/:id', requireAuth, async (req: any, res) => {
  await supabase.from('fellowship_schools').update({ is_active: false }).eq('id', req.params.id);
  res.json({ message: 'Removed.' });
});

export { schoolsRouter as default };


// ============================================================
// FILE: backend/src/routes/testimonies.routes.ts
// ============================================================

const testimonyRouter = Router();

// Public: only approved
testimonyRouter.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('testimonies')
    .select('id, headline, testifier_name, full_testimony, testimony_date')
    .eq('is_approved', true)
    .eq('is_active', true)
    .order('testimony_date', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Admin: all testimonies (for review)
testimonyRouter.get('/all', requireAuth, async (_req, res) => {
  const { data, error } = await supabase.from('testimonies').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Admin: approve/create
testimonyRouter.post('/', requireAuth, async (req: any, res) => {
  const { data, error } = await supabase.from('testimonies').insert({ ...req.body, is_approved: true }).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

testimonyRouter.patch('/:id', requireAuth, async (req: any, res) => {
  const { data, error } = await supabase.from('testimonies').update(req.body).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

testimonyRouter.delete('/:id', requireAuth, async (req: any, res) => {
  await supabase.from('testimonies').update({ is_active: false }).eq('id', req.params.id);
  res.json({ message: 'Removed.' });
});

export { testimonyRouter as default };


// ============================================================
// FILE: backend/src/routes/events.routes.ts
// ============================================================

const eventsRouter = Router();

eventsRouter.get('/', async (_req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .gte('event_date', today)  // Only upcoming events
    .order('event_date');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

eventsRouter.post('/', requireAuth, async (req: any, res) => {
  const { data, error } = await supabase.from('events').insert(req.body).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

eventsRouter.put('/:id', requireAuth, async (req: any, res) => {
  const { data, error } = await supabase.from('events').update(req.body).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

eventsRouter.delete('/:id', requireAuth, async (req: any, res) => {
  await supabase.from('events').update({ is_active: false }).eq('id', req.params.id);
  res.json({ message: 'Event removed.' });
});

export { eventsRouter as default };


// ============================================================
// FILE: backend/src/routes/gallery.routes.ts
// ============================================================

const galleryRouter = Router();

// Albums
galleryRouter.get('/albums', async (_req, res) => {
  const { data, error } = await supabase
    .from('gallery_albums')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Images for a specific album
galleryRouter.get('/albums/:albumId/images', async (req, res) => {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('album_id', req.params.albumId)
    .order('display_order');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Admin: create album
galleryRouter.post('/albums', requireAuth, async (req: any, res) => {
  const { data, error } = await supabase.from('gallery_albums').insert(req.body).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// Admin: add image to album
// Images are Google Drive direct links — no file upload needed on our server
galleryRouter.post('/albums/:albumId/images', requireAuth, async (req: any, res) => {
  const { data, error } = await supabase.from('gallery_images').insert({
    ...req.body,
    album_id: req.params.albumId,
  }).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

galleryRouter.delete('/albums/:id', requireAuth, async (req: any, res) => {
  await supabase.from('gallery_albums').update({ is_active: false }).eq('id', req.params.id);
  res.json({ message: 'Album removed.' });
});

galleryRouter.delete('/images/:id', requireAuth, async (req: any, res) => {
  await supabase.from('gallery_images').delete().eq('id', req.params.id);
  res.json({ message: 'Image removed.' });
});

export { galleryRouter as default };


// ============================================================
// FILE: backend/src/routes/about.routes.ts
// ============================================================

const aboutRouter = Router();

aboutRouter.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('about_pages')
    .select('slug, title, card_summary, icon, display_order')
    .order('display_order');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

aboutRouter.get('/:slug', async (req, res) => {
  const { data, error } = await supabase
    .from('about_pages')
    .select('*')
    .eq('slug', req.params.slug)
    .single();
  if (error || !data) return res.status(404).json({ error: 'Page not found.' });
  res.json(data);
});

aboutRouter.put('/:slug', requireAuth, async (req: any, res) => {
  const { data, error } = await supabase
    .from('about_pages')
    .update({ ...req.body, updated_at: new Date().toISOString() })
    .eq('slug', req.params.slug)
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export { aboutRouter as default };


// ============================================================
// FILE: backend/src/routes/nacf.routes.ts
// ============================================================

const nacfRouter = Router();

nacfRouter.get('/', async (_req, res) => {
  const [sectionRes, announcementsRes] = await Promise.all([
    supabase.from('nacf_section').select('*').limit(1).single(),
    supabase.from('nacf_announcements').select('*').eq('is_active', true).order('created_at', { ascending: false }),
  ]);
  res.json({
    ...sectionRes.data,
    announcements: announcementsRes.data || [],
  });
});

nacfRouter.put('/chairman', requireAuth, async (req: any, res) => {
  // Upsert chairman info
  const existing = await supabase.from('nacf_section').select('id').limit(1).single();
  if (existing.data?.id) {
    await supabase.from('nacf_section').update({ ...req.body, updated_at: new Date().toISOString() }).eq('id', existing.data.id);
  } else {
    await supabase.from('nacf_section').insert(req.body);
  }
  res.json({ message: 'Chairman info updated.' });
});

nacfRouter.post('/announcements', requireAuth, async (req: any, res) => {
  const { data, error } = await supabase.from('nacf_announcements').insert(req.body).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

nacfRouter.delete('/announcements/:id', requireAuth, async (req: any, res) => {
  await supabase.from('nacf_announcements').update({ is_active: false }).eq('id', req.params.id);
  res.json({ message: 'Removed.' });
});

export { nacfRouter as default };


// ============================================================
// FILE: backend/src/routes/resources.routes.ts
// ============================================================

const resourcesRouter = Router();

resourcesRouter.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

resourcesRouter.put('/:id', requireAuth, async (req: any, res) => {
  const { data, error } = await supabase
    .from('resources')
    .update({ ...req.body, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

resourcesRouter.post('/', requireAuth, async (req: any, res) => {
  const { data, error } = await supabase.from('resources').insert(req.body).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

export { resourcesRouter as default };


// ============================================================
// FILE: backend/.env.example
// Copy to .env and fill in your values
// ============================================================
// PORT=4000
// NODE_ENV=development
// SUPABASE_URL=https://your-project.supabase.co
// SUPABASE_SERVICE_KEY=your_service_role_key_here
// JWT_SECRET=your_very_long_random_secret_at_least_32_chars
// CORS_ORIGIN=http://localhost:3000

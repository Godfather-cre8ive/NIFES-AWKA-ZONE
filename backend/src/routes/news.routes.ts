// ────────────────────────────────────────────────────────────
// GENERIC CRUD FACTORY
// Used for: staff, students, schools, testimonies, news,
//           events, gallery, resources, settings, nacf
// ────────────────────────────────────────────────────────────

// Each remaining route follows this exact CRUD pattern.
// Below are the complete implementations for key routes.

// ============================================================
// FILE: backend/src/routes/news.routes.ts
// ============================================================
import { Router } from 'express';
import { supabase } from '../db/supabase';
import { requireAuth } from '../middleware/auth';

const newsRouter = Router();

newsRouter.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('news_posts')
    .select('id, title, slug, excerpt, cover_image_url, author, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(20);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

newsRouter.get('/:slug', async (req, res) => {
  const { data, error } = await supabase
    .from('news_posts')
    .select('*')
    .eq('slug', req.params.slug)
    .eq('is_published', true)
    .single();
  if (error || !data) return res.status(404).json({ error: 'Post not found.' });
  res.json(data);
});

newsRouter.post('/', requireAuth, async (req: any, res) => {
  const { data, error } = await supabase
    .from('news_posts')
    .insert({ ...req.body, published_at: req.body.is_published ? new Date().toISOString() : null })
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

newsRouter.put('/:id', requireAuth, async (req: any, res) => {
  const { data, error } = await supabase
    .from('news_posts')
    .update({ ...req.body, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

newsRouter.delete('/:id', requireAuth, async (req: any, res) => {
  const { error } = await supabase.from('news_posts').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Post deleted.' });
});

export { newsRouter as default };

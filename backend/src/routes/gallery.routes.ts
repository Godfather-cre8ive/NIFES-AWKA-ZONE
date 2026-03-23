// ============================================================
// FILE: backend/src/routes/gallery.routes.ts
// ============================================================
import { Router } from 'express';
import { supabase } from '../db/supabase';
import { requireAuth } from '../middleware/auth';

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
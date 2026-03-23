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
// ============================================================
// FILE: backend/src/routes/events.routes.ts
// ============================================================
import { Router } from 'express';
import { supabase } from '../db/supabase';
import { requireAuth } from '../middleware/auth';

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
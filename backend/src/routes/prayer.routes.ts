// ============================================================
// FILE: backend/src/routes/prayer.routes.ts
// ============================================================
import { Router } from 'express';
import { supabase } from '../db/supabase';
import { requireAuth } from '../middleware/auth';

const prayerRouter = Router();

prayerRouter.post('/submit', async (req, res) => {
  const { name, email, request_message } = req.body;
  if (!request_message?.trim()) {
    return res.status(400).json({ error: 'Prayer request message is required.' });
  }
  const { error } = await supabase.from('prayer_requests').insert({ name, email, request_message });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Your prayer request has been received. We are praying with you! 🙏' });
});

prayerRouter.get('/', requireAuth, async (_req, res) => {
  const { data, error } = await supabase
    .from('prayer_requests')
    .select('*')
    .order('submitted_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

prayerRouter.patch('/:id', requireAuth, async (req: any, res) => {
  const { data, error } = await supabase
    .from('prayer_requests')
    .update(req.body)
    .eq('id', req.params.id)
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export { prayerRouter as default };

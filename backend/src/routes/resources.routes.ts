// ============================================================
// FILE: backend/src/routes/resources.routes.ts
// ============================================================
import { Router } from 'express';
import { supabase } from '../db/supabase';
import { requireAuth } from '../middleware/auth';

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

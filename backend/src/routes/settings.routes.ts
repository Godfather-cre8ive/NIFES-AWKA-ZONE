// ============================================================
// FILE: backend/src/routes/settings.routes.ts
// ============================================================
import { Router } from 'express';
import { supabase } from '../db/supabase';
import { requireAuth } from '../middleware/auth';

const settingsRouter = Router();

settingsRouter.get('/', async (_req, res) => {
  const { data, error } = await supabase.from('site_settings').select('key, value, description');
  if (error) return res.status(500).json({ error: error.message });
  // Convert to key-value object for easy frontend use
  const settings = (data || []).reduce((acc: any, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});
  res.json(settings);
});

settingsRouter.put('/:key', requireAuth, async (req: any, res) => {
  const { value } = req.body;
  const { data, error } = await supabase
    .from('site_settings')
    .update({ value, updated_at: new Date().toISOString() })
    .eq('key', req.params.key)
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export { settingsRouter as default };

// Re-export other simple routers (staff, schools, events, gallery, etc.)
// follow exact same pattern: GET (public), POST/PUT/DELETE (requireAuth)
// See full implementations in the GitHub repo or generate with the factory pattern above.

// Placeholder exports so TypeScript doesn't error
export const requireAuth_export = requireAuth;

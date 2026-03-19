// ============================================================
// FILE: backend/src/routes/hero.routes.ts
// PURPOSE: Hero slides — public GET, admin-only PUT
// ============================================================

const heroRouter = Router();

// GET /api/hero  — public
heroRouter.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('is_active', true)
    .order('slide_number');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// PUT /api/hero/:id  — admin only
heroRouter.put('/:id', requireAuth, async (req: any, res) => {
  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await supabase
    .from('hero_slides')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export { heroRouter as default };
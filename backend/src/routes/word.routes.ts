// ============================================================
// FILE: backend/src/routes/word.routes.ts
// ============================================================

const wordRouter = Router();

wordRouter.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('word_for_today')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

wordRouter.put('/:id', requireAuth, async (req: any, res) => {
  const { data, error } = await supabase
    .from('word_for_today')
    .update({ ...req.body, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

wordRouter.post('/', requireAuth, async (req: any, res) => {
  // Deactivate all existing words first
  await supabase.from('word_for_today').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000');
  const { data, error } = await supabase.from('word_for_today').insert(req.body).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

export { wordRouter as default };
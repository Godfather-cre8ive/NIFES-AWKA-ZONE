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
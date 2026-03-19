const testimonyRouter = Router();

// Public: only approved
testimonyRouter.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('testimonies')
    .select('id, headline, testifier_name, full_testimony, testimony_date')
    .eq('is_approved', true)
    .eq('is_active', true)
    .order('testimony_date', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Admin: all testimonies (for review)
testimonyRouter.get('/all', requireAuth, async (_req, res) => {
  const { data, error } = await supabase.from('testimonies').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Admin: approve/create
testimonyRouter.post('/', requireAuth, async (req: any, res) => {
  const { data, error } = await supabase.from('testimonies').insert({ ...req.body, is_approved: true }).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

testimonyRouter.patch('/:id', requireAuth, async (req: any, res) => {
  const { data, error } = await supabase.from('testimonies').update(req.body).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

testimonyRouter.delete('/:id', requireAuth, async (req: any, res) => {
  await supabase.from('testimonies').update({ is_active: false }).eq('id', req.params.id);
  res.json({ message: 'Removed.' });
});

export { testimonyRouter as default };

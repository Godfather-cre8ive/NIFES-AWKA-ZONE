const studentsRouter = Router();

studentsRouter.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('student_leaders')
    .select('*')
    .eq('is_active', true)
    .order('display_order');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

studentsRouter.post('/', requireAuth, async (req: any, res) => {
  const { data, error } = await supabase.from('student_leaders').insert(req.body).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

studentsRouter.put('/:id', requireAuth, async (req: any, res) => {
  const { data, error } = await supabase.from('student_leaders').update(req.body).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

studentsRouter.delete('/:id', requireAuth, async (req: any, res) => {
  await supabase.from('student_leaders').update({ is_active: false }).eq('id', req.params.id);
  res.json({ message: 'Removed.' });
});

export { studentsRouter as default };
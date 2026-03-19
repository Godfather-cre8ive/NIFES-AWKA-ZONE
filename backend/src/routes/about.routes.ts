const aboutRouter = Router();

aboutRouter.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('about_pages')
    .select('slug, title, card_summary, icon, display_order')
    .order('display_order');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

aboutRouter.get('/:slug', async (req, res) => {
  const { data, error } = await supabase
    .from('about_pages')
    .select('*')
    .eq('slug', req.params.slug)
    .single();
  if (error || !data) return res.status(404).json({ error: 'Page not found.' });
  res.json(data);
});

aboutRouter.put('/:slug', requireAuth, async (req: any, res) => {
  const { data, error } = await supabase
    .from('about_pages')
    .update({ ...req.body, updated_at: new Date().toISOString() })
    .eq('slug', req.params.slug)
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export { aboutRouter as default };
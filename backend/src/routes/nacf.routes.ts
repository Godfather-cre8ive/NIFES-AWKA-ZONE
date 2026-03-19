// ============================================================
// FILE: backend/src/routes/nacf.routes.ts
// ============================================================

const nacfRouter = Router();

nacfRouter.get('/', async (_req, res) => {
  const [sectionRes, announcementsRes] = await Promise.all([
    supabase.from('nacf_section').select('*').limit(1).single(),
    supabase.from('nacf_announcements').select('*').eq('is_active', true).order('created_at', { ascending: false }),
  ]);
  res.json({
    ...sectionRes.data,
    announcements: announcementsRes.data || [],
  });
});

nacfRouter.put('/chairman', requireAuth, async (req: any, res) => {
  // Upsert chairman info
  const existing = await supabase.from('nacf_section').select('id').limit(1).single();
  if (existing.data?.id) {
    await supabase.from('nacf_section').update({ ...req.body, updated_at: new Date().toISOString() }).eq('id', existing.data.id);
  } else {
    await supabase.from('nacf_section').insert(req.body);
  }
  res.json({ message: 'Chairman info updated.' });
});

nacfRouter.post('/announcements', requireAuth, async (req: any, res) => {
  const { data, error } = await supabase.from('nacf_announcements').insert(req.body).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

nacfRouter.delete('/announcements/:id', requireAuth, async (req: any, res) => {
  await supabase.from('nacf_announcements').update({ is_active: false }).eq('id', req.params.id);
  res.json({ message: 'Removed.' });
});

export { nacfRouter as default };
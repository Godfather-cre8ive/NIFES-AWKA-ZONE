// ============================================================
// FILE: backend/src/routes/newsletter.routes.ts
// ============================================================
import { Router } from 'express';
import { supabase } from '../db/supabase';
import { requireAuth } from '../middleware/auth';

const newsletterRouter = Router();

// POST /api/newsletter/subscribe
newsletterRouter.post('/subscribe', async (req, res) => {
  const { email, name } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email is required.' });
  }
  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email: email.toLowerCase().trim(), name });
  if (error?.code === '23505') {
    return res.json({ message: 'You are already subscribed! 🎉' });
  }
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Subscribed successfully! Welcome to the NIFES Awka Zone family. 🙏' });
});

// GET /api/newsletter/subscribers — admin only, exportable CSV
newsletterRouter.get('/subscribers', requireAuth, async (req: any, res) => {
  const format = req.query.format;
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('name, email, subscribed_at')
    .eq('is_active', true)
    .order('subscribed_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  if (format === 'csv') {
    const csv = ['Name,Email,Subscribed At', ...(data || []).map(s =>
      `"${s.name || ''}","${s.email}","${s.subscribed_at}"`
    )].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=nifes-subscribers.csv');
    return res.send(csv);
  }

  res.json({ count: data?.length || 0, subscribers: data });
});

export { newsletterRouter as default };



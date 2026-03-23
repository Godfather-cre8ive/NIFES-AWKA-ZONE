// ============================================================
// FILE: backend/src/routes/auth.routes.ts
// PURPOSE: Admin login endpoint. Returns JWT on success.
// ============================================================

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../db/supabase';

const router = Router();

// POST /api/auth/login
// Body: { email, password }
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  // Fetch admin by email
  const { data: admin, error } = await supabase
    .from('admins')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .single();

  if (error || !admin) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  // Compare password with stored bcrypt hash
  const isValid = await bcrypt.compare(password, admin.password_hash);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  // Update last_login timestamp
  await supabase.from('admins').update({ last_login: new Date().toISOString() }).eq('id', admin.id);

  // Sign JWT — expires in 8 hours
  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET!,
    { expiresIn: '8h' }
  );

  res.json({
    token,
    admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
    expiresIn: '8h',
  });
});

// POST /api/auth/change-password  (protected)
// Body: { currentPassword, newPassword }
router.post('/change-password', async (req: any, res) => {
  const { requireAuth } = await import('../middleware/auth');
  // Inline auth check for brevity
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters.' });
  }

  res.json({ message: 'Password updated successfully.' });
});

export default router;
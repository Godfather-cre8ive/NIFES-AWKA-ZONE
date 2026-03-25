import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../db/supabase';

const router = Router();

router.post('/setup-admin', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password required' });
    }

    // Check if admin already exists
    const { data: existing } = await supabase
      .from('admins')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('admins')
      .insert([
        {
          name,
          email: email.toLowerCase(),
          password_hash,
          role: 'superadmin'
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'Admin created successfully',
      admin: {
        id: data.id,
        email: data.email
      }
    });

  } catch (err:any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

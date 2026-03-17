// ============================================================
// FILE: frontend/app/admin/login/page.tsx
// Full source: See AdminLogin export in the dashboard file.
// This is a separate route — copy AdminLogin component here.
// ============================================================
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { adminLogin } from '@/lib/api';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminLogin(email, password);
      Cookies.set('nifes_admin_token', res.token, { expires: 1/3, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
      localStorage.setItem('nifes_admin', JSON.stringify(res.admin));
      toast.success(`Welcome back, ${res.admin.name}!`);
      router.push('/admin/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-nifes-green flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-nifes-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-nifes-green" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-white/60 text-sm mt-1">NIFES Awka Zone — Media Officer</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-nifes-muted block mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@nifesawka.org" required className="form-input" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-nifes-muted block mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required className="form-input pr-11" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-nifes-muted">
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
        <p className="text-center text-white/40 text-xs mt-4">Authorised personnel only.</p>
      </div>
    </div>
  );
}

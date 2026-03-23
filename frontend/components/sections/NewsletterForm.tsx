// ============================================================
// FILE: frontend/components/sections/NewsletterForm.tsx
// ============================================================

'use client';

import { useState } from 'react';
import { subscribeNewsletter } from '@/lib/api';
import toast from 'react-hot-toast';
import { Mail } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await subscribeNewsletter({ email, name });
      toast.success(res.message);
      setDone(true);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="newsletter" className="py-14 bg-nifes-green">
      <div className="section-container">
        <div className="max-w-xl mx-auto text-center">
          <Mail className="w-10 h-10 text-nifes-gold mx-auto mb-4" />
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
            Stay Connected
          </h2>
          <p className="text-white/75 text-sm mb-6">
            Subscribe to receive updates, devotionals, event announcements, and more.
          </p>

          {done ? (
            <div className="bg-white/15 rounded-2xl p-6 text-white">
              <p className="text-2xl mb-2">🎉</p>
              <p className="font-semibold">You&apos;re subscribed!</p>
              <p className="text-white/75 text-sm mt-1">Welcome to the NIFES Awka Zone family.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input flex-1 sm:max-w-[160px]"
              />
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input flex-1"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-gold flex-shrink-0 justify-center"
              >
                {loading ? 'Subscribing…' : 'Subscribe'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
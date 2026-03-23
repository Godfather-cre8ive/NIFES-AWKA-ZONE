// ============================================================
// FILE: frontend/components/sections/PrayerRequestForm.tsx
// ============================================================

'use client';

import { useState } from 'react';
import { submitPrayerRequest } from '@/lib/api';
import toast from 'react-hot-toast';

export default function PrayerRequestForm() {
  const [form, setForm] = useState({ name: '', email: '', request_message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (field: string) => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.request_message.trim()) return;
    setLoading(true);
    try {
      const res = await submitPrayerRequest(form);
      toast.success(res.message);
      setSent(true);
    } catch {
      toast.error('Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="prayer" className="py-16 bg-white">
      <div className="section-container">
        <div className="max-w-xl mx-auto">
          <p className="section-label">🙏 Prayer</p>
          <h2 className="section-title mb-2">Submit a Prayer Request</h2>
          <p className="text-nifes-muted text-sm mb-6">
            Our prayer team receives every request and prays with you. You may remain anonymous.
          </p>

          {sent ? (
            <div className="card p-8 text-center">
              <p className="text-3xl mb-3">🙏</p>
              <p className="font-semibold text-nifes-text">Prayer request received!</p>
              <p className="text-nifes-muted text-sm mt-2">We are believing God with you.</p>
              <button onClick={() => { setSent(false); setForm({ name: '', email: '', request_message: '' }); }}
                className="btn-secondary mt-4 text-sm">Submit another request</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-5 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-nifes-muted mb-1 block">Name (optional)</label>
                  <input type="text" placeholder="Anonymous" value={form.name} onChange={update('name')} className="form-input" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-nifes-muted mb-1 block">Email (optional)</label>
                  <input type="email" placeholder="for a reply" value={form.email} onChange={update('email')} className="form-input" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-nifes-muted mb-1 block">Your Prayer Request *</label>
                <textarea
                  placeholder="Share what you would like us to pray for…"
                  value={form.request_message}
                  onChange={update('request_message')}
                  required
                  rows={5}
                  className="form-input resize-none"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? 'Sending…' : '🙏 Send Prayer Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
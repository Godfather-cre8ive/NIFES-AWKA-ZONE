// ============================================================
// FILE: frontend/app/admin/login/page.tsx
// PURPOSE: Admin login page with JWT auth.
//          Stores token in secure cookie on success.
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
    if (!email || !password) return;
    setLoading(true);
    try {
      const res = await adminLogin(email, password);
      // Store JWT in cookie — expires in 8 hours
      Cookies.set('nifes_admin_token', res.token, {
        expires: 1 / 3,   // 8 hours as fraction of day
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });
      // Store admin info for dashboard display
      localStorage.setItem('nifes_admin', JSON.stringify(res.admin));
      toast.success(`Welcome back, ${res.admin.name}!`);
      router.push('/admin/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nifes-green flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-nifes-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-nifes-green" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-white/60 text-sm mt-1">NIFES Awka Zone — Media Officer</p>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-nifes-muted block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nifesawka.org"
                required
                autoComplete="email"
                className="form-input"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-nifes-muted block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="form-input pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-nifes-muted hover:text-nifes-text"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          Only authorised Zonal Media Officers may access this portal.
        </p>
      </div>
    </div>
  );
}


// ============================================================
// FILE: frontend/app/admin/dashboard/page.tsx
// PURPOSE: Main admin dashboard with sidebar navigation and
//          content panels for each manageable section.
//          All data mutations go through the API client.
// ============================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
  LayoutDashboard, Image, BookOpen, Users, GraduationCap,
  School, Heart, Newspaper, Calendar, Camera, Download,
  HelpCircle, Mail, MessageCircle, Settings, LogOut,
  Menu, X, Plus, Pencil, Trash2, Eye, Check, Download as DownloadIcon,
  ChevronDown, ChevronUp, Save
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import * as api from '@/lib/api';

// ── Sidebar navigation items ──
const NAV_ITEMS = [
  { id: 'overview',    label: 'Overview',        icon: LayoutDashboard },
  { id: 'hero',        label: 'Hero Slides',      icon: Image },
  { id: 'word',        label: 'Word for Today',   icon: BookOpen },
  { id: 'staff',       label: 'Staff',            icon: Users },
  { id: 'students',    label: 'Student Leaders',  icon: GraduationCap },
  { id: 'schools',     label: 'Schools',          icon: School },
  { id: 'testimonies', label: 'Testimonies',      icon: Heart },
  { id: 'news',        label: 'News & Blog',      icon: Newspaper },
  { id: 'events',      label: 'Events',           icon: Calendar },
  { id: 'gallery',     label: 'Gallery',          icon: Camera },
  { id: 'resources',   label: 'Resources',        icon: Download },
  { id: 'quiz',        label: 'Bible Quiz',       icon: HelpCircle },
  { id: 'newsletter',  label: 'Newsletter',       icon: Mail },
  { id: 'prayer',      label: 'Prayer Requests',  icon: MessageCircle },
  { id: 'settings',    label: 'Site Settings',    icon: Settings },
];

// ── Auth guard hook ──
function useAdminAuth() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    const token = Cookies.get('nifes_admin_token');
    const adminData = localStorage.getItem('nifes_admin');
    if (!token || !adminData) {
      router.push('/admin/login');
      return;
    }
    setAdmin(JSON.parse(adminData));
  }, [router]);

  const logout = () => {
    Cookies.remove('nifes_admin_token');
    localStorage.removeItem('nifes_admin');
    router.push('/admin/login');
    toast.success('Logged out successfully.');
  };

  return { admin, logout };
}

// ── Generic list manager component ──
function ResourceManager({
  title, items, onDelete, onToggle, renderItem, renderForm, addLabel = 'Add New'
}: {
  title: string;
  items: any[];
  onDelete?: (id: string) => void;
  onToggle?: (id: string, active: boolean) => void;
  renderItem: (item: any) => React.ReactNode;
  renderForm?: React.ReactNode;
  addLabel?: string;
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-nifes-green">{title}</h2>
        {renderForm && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm py-2 px-4">
            {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> {addLabel}</>}
          </button>
        )}
      </div>

      {showForm && renderForm && (
        <div className="bg-nifes-warm-gray rounded-2xl p-4 border-2 border-nifes-green/20">
          {renderForm}
        </div>
      )}

      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-center text-nifes-muted py-8 bg-nifes-warm-gray rounded-2xl">
            No items yet. {renderForm ? `Click "${addLabel}" to add one.` : ''}
          </p>
        ) : items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-4 border border-nifes-warm-gray flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">{renderItem(item)}</div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {onToggle && (
                <button
                  onClick={() => onToggle(item.id, !item.is_active)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    item.is_active !== false ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}
                  title={item.is_active !== false ? 'Active — click to deactivate' : 'Inactive — click to activate'}
                >
                  <Check size={14} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => {
                    if (confirm('Delete this item? This cannot be undone.')) {
                      onDelete(item.id);
                    }
                  }}
                  className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Word for Today panel ──
function WordPanel() {
  const [word, setWord] = useState<any>(null);
  const [form, setForm] = useState({ scripture_text: '', reference: '', reflection: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getWordForToday().then(setWord).catch(() => {});
  }, []);

  const update = (k: string) => (e: any) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      if (word?.id) {
        await api.adminUpdate('word', word.id, { ...form, is_active: true });
      } else {
        await api.adminCreate('word', form);
      }
      toast.success('Word for Today updated!');
      const updated = await api.getWordForToday();
      setWord(updated);
    } catch {
      toast.error('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold text-nifes-green">Word for Today</h2>

      {word && (
        <div className="bg-nifes-green text-white rounded-2xl p-4 mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-nifes-gold mb-1">Current Word</p>
          <p className="italic text-sm">{word.scripture_text}</p>
          <p className="text-nifes-gold text-xs font-semibold mt-1">— {word.reference}</p>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-nifes-muted block mb-1">Scripture Text *</label>
          <textarea
            value={form.scripture_text}
            onChange={update('scripture_text')}
            placeholder={word?.scripture_text || '"Let the word of Christ dwell in you richly"'}
            rows={3}
            className="form-input resize-none"
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-nifes-muted block mb-1">Reference *</label>
          <input type="text" value={form.reference} onChange={update('reference')} placeholder={word?.reference || 'Colossians 3:16'} className="form-input" />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-nifes-muted block mb-1">Reflection (optional)</label>
          <textarea value={form.reflection} onChange={update('reflection')} placeholder="Brief reflection or application..." rows={2} className="form-input resize-none" />
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : <><Save size={14} /> Update Word for Today</>}
        </button>
      </div>
    </div>
  );
}

// ── Quiz creation panel ──
function QuizPanel() {
  const [quizType, setQuizType] = useState<'multiple_choice' | 'chronological'>('multiple_choice');
  const [form, setForm] = useState({
    title: '', start_date: '', end_date: '', show_leaderboard: false
  });
  const [questions, setQuestions] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      question_text: '', option_a: '', option_b: '', option_c: '', option_d: '',
      correct_answer: 'A', explanation: '', question_order: i + 1
    }))
  );
  const [events, setEvents] = useState(
    Array.from({ length: 6 }, (_, i) => ({ event_name: '', correct_position: i + 1 }))
  );
  const [saving, setSaving] = useState(false);

  const updateQ = (idx: number, field: string, val: string) => {
    setQuestions(qs => qs.map((q, i) => i === idx ? { ...q, [field]: val } : q));
  };
  const updateE = (idx: number, val: string) => {
    setEvents(es => es.map((e, i) => i === idx ? { ...e, event_name: val } : e));
  };

  const handleCreate = async () => {
    if (!form.title || !form.start_date || !form.end_date) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSaving(true);
    try {
      await api.adminCreate('quiz', {
        ...form,
        quiz_type: quizType,
        questions: quizType === 'multiple_choice' ? questions.filter(q => q.question_text) : undefined,
        events: quizType === 'chronological' ? events.filter(e => e.event_name) : undefined,
      });
      toast.success('Quiz created successfully! 🎉');
      setForm({ title: '', start_date: '', end_date: '', show_leaderboard: false });
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create quiz.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-nifes-green">Weekly Bible Quiz</h2>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        ⚡ Quiz start date must be a <strong>Friday</strong>. The quiz will automatically go live on that date and expire on the end date.
      </div>

      {/* Quiz type selector */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-nifes-muted block mb-2">Quiz Type</label>
        <div className="grid grid-cols-2 gap-3">
          {(['multiple_choice', 'chronological'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setQuizType(type)}
              className={`p-3 rounded-xl border-2 text-sm font-semibold transition-colors text-left ${
                quizType === type ? 'border-nifes-green bg-nifes-green/5 text-nifes-green' : 'border-nifes-warm-gray text-nifes-muted'
              }`}
            >
              {type === 'multiple_choice' ? '📝 Multiple Choice (10 Q)' : '🔀 Chronological Order'}
            </button>
          ))}
        </div>
      </div>

      {/* Basic fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-nifes-muted block mb-1">Quiz Title *</label>
          <input type="text" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} placeholder="e.g. Week 12 Bible Quiz — Acts of the Apostles" className="form-input" />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-nifes-muted block mb-1">Start Date (Friday) *</label>
          <input type="date" value={form.start_date} onChange={e => setForm(p => ({...p, start_date: e.target.value}))} className="form-input" />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-nifes-muted block mb-1">End Date *</label>
          <input type="date" value={form.end_date} onChange={e => setForm(p => ({...p, end_date: e.target.value}))} className="form-input" />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.show_leaderboard} onChange={e => setForm(p => ({...p, show_leaderboard: e.target.checked}))} className="w-4 h-4 accent-nifes-green" />
        <span className="text-sm font-medium text-nifes-text">Show leaderboard after submission</span>
      </label>

      {/* Multiple choice questions */}
      {quizType === 'multiple_choice' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-nifes-text">Questions (up to 10)</h3>
          {questions.map((q, idx) => (
            <div key={idx} className="bg-nifes-warm-gray rounded-xl p-4 space-y-3">
              <p className="font-semibold text-nifes-green text-sm">Question {idx + 1}</p>
              <input type="text" value={q.question_text} onChange={e => updateQ(idx, 'question_text', e.target.value)} placeholder="Enter question..." className="form-input" />
              <div className="grid grid-cols-2 gap-2">
                {['a', 'b', 'c', 'd'].map(opt => (
                  <input key={opt} type="text" value={(q as any)[`option_${opt}`]} onChange={e => updateQ(idx, `option_${opt}`, e.target.value)} placeholder={`Option ${opt.toUpperCase()}`} className="form-input text-xs" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-nifes-muted">Correct Answer:</label>
                <div className="flex gap-2">
                  {['A','B','C','D'].map(opt => (
                    <button key={opt} onClick={() => updateQ(idx, 'correct_answer', opt)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${q.correct_answer === opt ? 'bg-nifes-green text-white' : 'bg-white border border-nifes-warm-gray text-nifes-muted'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <input type="text" value={q.explanation} onChange={e => updateQ(idx, 'explanation', e.target.value)} placeholder="Explanation (shown after quiz)..." className="form-input text-xs" />
            </div>
          ))}
        </div>
      )}

      {/* Chronological events */}
      {quizType === 'chronological' && (
        <div className="space-y-3">
          <h3 className="font-semibold text-nifes-text">Biblical Events (in correct chronological order)</h3>
          <p className="text-xs text-nifes-muted">Enter events in the CORRECT order. They will be shuffled for users.</p>
          {events.map((e, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="w-7 h-7 bg-nifes-green text-white rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0">{idx + 1}</span>
              <input type="text" value={e.event_name} onChange={ev => updateE(idx, ev.target.value)} placeholder={`Event ${idx + 1} (e.g. Creation of Adam)`} className="form-input" />
            </div>
          ))}
          <button onClick={() => setEvents(es => [...es, { event_name: '', correct_position: es.length + 1 }])} className="btn-secondary text-xs py-2 px-3">
            <Plus size={12} /> Add Another Event
          </button>
        </div>
      )}

      <button onClick={handleCreate} disabled={saving} className="btn-primary w-full justify-center py-3">
        {saving ? 'Creating Quiz…' : '🚀 Create & Publish Quiz'}
      </button>
    </div>
  );
}

// ── Newsletter panel ──
function NewsletterPanel() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminGetNewsletterSubscribers()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleExport = async () => {
    try {
      const blob = await api.adminGetNewsletterSubscribers('csv');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nifes-subscribers-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Export failed. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-nifes-green">Newsletter Subscribers</h2>
        <button onClick={handleExport} className="btn-secondary text-sm py-2 px-4">
          <DownloadIcon size={14} /> Export CSV
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-nifes-muted">Loading subscribers…</div>
      ) : (
        <>
          <div className="bg-nifes-green text-white rounded-xl p-4 text-center">
            <p className="font-display text-3xl font-bold">{data?.count || 0}</p>
            <p className="text-white/70 text-sm">Total Subscribers</p>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {(data?.subscribers || []).map((sub: any) => (
              <div key={sub.email} className="bg-white rounded-xl p-3 border border-nifes-warm-gray flex items-center justify-between">
                <div>
                  {sub.name && <p className="font-semibold text-nifes-text text-sm">{sub.name}</p>}
                  <p className="text-nifes-muted text-xs">{sub.email}</p>
                </div>
                <p className="text-xs text-nifes-muted">{format(new Date(sub.subscribed_at), 'dd/MM/yy')}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Prayer requests panel ──
function PrayerPanel() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminGetPrayerRequests()
      .then(setRequests)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id: string) => {
    try {
      await api.adminUpdate('prayer', id, { is_read: true });
      setRequests(rs => rs.map(r => r.id === id ? { ...r, is_read: true } : r));
    } catch {
      toast.error('Failed to update.');
    }
  };

  const unread = requests.filter(r => !r.is_read).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-nifes-green">Prayer Requests</h2>
        {unread > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{unread} unread</span>}
      </div>

      {loading ? (
        <p className="text-center text-nifes-muted py-8">Loading…</p>
      ) : requests.length === 0 ? (
        <p className="text-center text-nifes-muted py-8">No prayer requests yet.</p>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {requests.map((req) => (
            <div key={req.id} className={`rounded-xl p-4 border ${req.is_read ? 'bg-white border-nifes-warm-gray' : 'bg-amber-50 border-amber-200'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {!req.is_read && <span className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" />}
                    <p className="font-semibold text-nifes-text text-sm">{req.name || 'Anonymous'}</p>
                    {req.email && <p className="text-nifes-muted text-xs">· {req.email}</p>}
                  </div>
                  <p className="text-nifes-text text-sm leading-relaxed">{req.request_message}</p>
                  <p className="text-xs text-nifes-muted mt-2">
                    {format(new Date(req.submitted_at), 'dd MMM yyyy, HH:mm')}
                  </p>
                </div>
                {!req.is_read && (
                  <button onClick={() => markRead(req.id)} className="flex-shrink-0 text-xs font-semibold text-nifes-green hover:underline">
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Settings panel ──
function SettingsPanel() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState('');

  useEffect(() => { api.getSiteSettings().then(setSettings).catch(() => {}); }, []);

  const handleSave = async (key: string) => {
    setSaving(key);
    try {
      await api.adminUpdateSetting(key, settings[key]);
      toast.success('Setting saved!');
    } catch {
      toast.error('Failed to save.');
    } finally {
      setSaving('');
    }
  };

  const SETTING_GROUPS = [
    {
      label: 'Donation Details',
      keys: ['bank_name', 'account_name', 'account_number', 'confirmation_phone'],
    },
    {
      label: 'Contact Information',
      keys: ['contact_email', 'contact_phone', 'office_address'],
    },
    {
      label: 'Social Media',
      keys: ['facebook_url', 'whatsapp_number', 'instagram_url', 'telegram_url'],
    },
    {
      label: 'Leadership Names',
      keys: ['chairman_name', 'training_secretary_name'],
    },
  ];

  const formatKey = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-nifes-green">Site Settings</h2>
      {SETTING_GROUPS.map((group) => (
        <div key={group.label}>
          <h3 className="font-semibold text-nifes-text text-sm mb-3">{group.label}</h3>
          <div className="space-y-3">
            {group.keys.map((key) => (
              <div key={key} className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-xs text-nifes-muted mb-1 block">{formatKey(key)}</label>
                  <input
                    type="text"
                    value={settings[key] || ''}
                    onChange={e => setSettings(p => ({ ...p, [key]: e.target.value }))}
                    className="form-input"
                  />
                </div>
                <button
                  onClick={() => handleSave(key)}
                  disabled={saving === key}
                  className="flex-shrink-0 btn-primary py-2 px-3 text-xs mt-5"
                >
                  {saving === key ? '…' : <Save size={14} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Overview panel ──
function OverviewPanel({ admin }: { admin: any }) {
  return (
    <div className="space-y-6">
      <div className="bg-nifes-green rounded-2xl p-6 text-white">
        <p className="text-white/60 text-sm">Welcome back,</p>
        <p className="font-display text-2xl font-bold">{admin?.name || 'Admin'}</p>
        <p className="text-white/60 text-xs mt-1">NIFES Awka Zone — Media Officer</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Manage Hero', icon: '🖼️', panel: 'hero' },
          { label: 'Update Word', icon: '📖', panel: 'word' },
          { label: 'Add News', icon: '📰', panel: 'news' },
          { label: 'Add Event', icon: '📅', panel: 'events' },
          { label: 'Create Quiz', icon: '📝', panel: 'quiz' },
          { label: 'View Prayers', icon: '🙏', panel: 'prayer' },
        ].map((item) => (
          <button
            key={item.panel}
            className="bg-white rounded-xl p-4 border border-nifes-warm-gray text-center hover:border-nifes-green/40 hover:-translate-y-0.5 transition-all"
          >
            <p className="text-2xl mb-1">{item.icon}</p>
            <p className="text-xs font-semibold text-nifes-text">{item.label}</p>
          </button>
        ))}
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="font-semibold text-amber-800 text-sm mb-1">📌 Quick Reminders</p>
        <ul className="text-xs text-amber-700 space-y-1">
          <li>• Upload new quiz every <strong>Friday morning</strong></li>
          <li>• Update Word for Today <strong>daily</strong></li>
          <li>• Review prayer requests <strong>weekly</strong></li>
          <li>• Approve testimonies before they go <strong>live</strong></li>
        </ul>
      </div>
    </div>
  );
}

// ── Main Dashboard ──
export default function AdminDashboard() {
  const { admin, logout } = useAdminAuth();
  const [activePanel, setActivePanel] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!admin) {
    return (
      <div className="min-h-screen bg-nifes-green flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-nifes-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const renderPanel = () => {
    switch (activePanel) {
      case 'overview':    return <OverviewPanel admin={admin} />;
      case 'word':        return <WordPanel />;
      case 'quiz':        return <QuizPanel />;
      case 'newsletter':  return <NewsletterPanel />;
      case 'prayer':      return <PrayerPanel />;
      case 'settings':    return <SettingsPanel />;
      default:
        return (
          <div className="text-center py-12 text-nifes-muted">
            <p className="text-3xl mb-3">🔧</p>
            <p className="font-semibold">{NAV_ITEMS.find(n => n.id === activePanel)?.label} management</p>
            <p className="text-sm mt-1">This panel is ready for content. Connect it to your API data.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-nifes-warm-gray flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-nifes-green flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Brand */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display font-bold text-white text-base">NIFES Admin</p>
              <p className="text-white/50 text-xs">Awka Zone Portal</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden w-8 h-8 text-white/60 hover:text-white">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { setActivePanel(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  activePanel === item.id
                    ? 'bg-white/15 text-white border-r-2 border-nifes-gold'
                    : 'text-white/65 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={16} className="flex-shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <div className="bg-white/10 rounded-xl p-3 mb-2">
            <p className="text-white text-xs font-semibold">{admin.name}</p>
            <p className="text-white/50 text-xs">{admin.email}</p>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2.5 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors text-sm">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-nifes-warm-gray px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 flex items-center justify-center text-nifes-text hover:bg-nifes-warm-gray rounded-lg">
            <Menu size={20} />
          </button>
          <div>
            <h1 className="font-semibold text-nifes-text text-base">
              {NAV_ITEMS.find(n => n.id === activePanel)?.label || 'Dashboard'}
            </h1>
            <p className="text-nifes-muted text-xs hidden sm:block">
              {format(new Date(), 'EEEE, d MMMM yyyy')}
            </p>
          </div>
          <div className="ml-auto">
            <a href="/" target="_blank" className="flex items-center gap-1 text-xs text-nifes-green font-semibold hover:underline">
              <Eye size={14} /> View Site
            </a>
          </div>
        </header>

        {/* Panel content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-3xl mx-auto">
            {renderPanel()}
          </div>
        </main>
      </div>
    </div>
  );
}

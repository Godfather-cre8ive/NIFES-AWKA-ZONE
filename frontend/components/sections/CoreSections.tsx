// ============================================================
// FILE: frontend/components/sections/HeroSlider.tsx
// PURPOSE: 3-slide hero carousel. Auto-plays every 6s.
//          Social icons NOT included (per spec).
//          Fully touch/swipe compatible via Embla carousel.
// ============================================================

'use client';

import { useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
  id: string;
  slide_number: number;
  title: string;
  subtitle?: string;
  message?: string;
  button_text?: string;
  button_link?: string;
  image_url?: string;
}

const SLIDE_GRADIENTS = [
  'from-nifes-green/90 via-nifes-green/70 to-nifes-navy/80',
  'from-nifes-navy/90 via-nifes-green-mid/70 to-nifes-green/80',
  'from-nifes-navy/90 via-nifes-navy/60 to-nifes-green/80',
];

export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 6000 })]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Use default slides if API returns empty
  const displaySlides = slides.length > 0 ? slides : [
    { id: '1', slide_number: 1, title: 'Welcome to NIFES Awka Zone', subtitle: 'Training Students to Transform Society', message: 'We are a fellowship of evangelical students committed to the total evangelisation of the Nigerian university campus.', button_text: 'Learn More', button_link: '#about' },
    { id: '2', slide_number: 2, title: 'Zonal Congress 2026', subtitle: 'Where God\'s Word Meets Student Hearts', message: 'Join us for a life-changing zonal congress — sessions, worship, and fellowship.', button_text: 'Register Now', button_link: '#events' },
    { id: '3', slide_number: 3, title: 'Chairman\'s Message', subtitle: 'A Word for Every Student', message: 'God is raising a generation of students who will not bow to the pressures of the world. Stand firm in your faith.', button_text: 'Read More', button_link: '#about' },
  ];

  return (
    <section id="hero" className="relative h-screen min-h-[560px] max-h-[800px] overflow-hidden">
      <div className="h-full" ref={emblaRef}>
        <div className="flex h-full">
          {displaySlides.map((slide, idx) => (
            <div
              key={slide.id}
              className="relative flex-none w-full h-full"
              role="group"
              aria-label={`Slide ${idx + 1} of ${displaySlides.length}`}
            >
              {/* Background: image or gradient fallback */}
              {slide.image_url ? (
                <Image
                  src={slide.image_url}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={idx === 0}
                  // Blur placeholder for faster perceived load on mobile
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                />
              ) : (
                // SVG pattern background as data-efficient fallback
                <div className={`absolute inset-0 bg-gradient-to-br ${SLIDE_GRADIENTS[idx % 3]}`}>
                  {/* Subtle dot pattern */}
                  <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id={`dot-${idx}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.5" fill="white" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#dot-${idx})`} />
                  </svg>
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="section-container w-full">
                  <div className="max-w-2xl">
                    {slide.subtitle && (
                      <p className="text-nifes-gold font-semibold text-sm tracking-widest uppercase mb-3 opacity-90">
                        {slide.subtitle}
                      </p>
                    )}
                    <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                      {slide.title}
                    </h1>
                    {slide.message && (
                      <p className="text-white/85 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
                        {slide.message}
                      </p>
                    )}
                    {slide.button_text && (
                      <a href={slide.button_link || '#'} className="btn-gold text-sm sm:text-base">
                        {slide.button_text}
                        <ChevronRight size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrow controls */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors z-10"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/60 animate-bounce">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 4v12M5 11l5 5 5-5"/>
        </svg>
      </div>
    </section>
  );
}


// ============================================================
// FILE: frontend/components/sections/WordForToday.tsx
// ============================================================

interface Word {
  scripture_text: string;
  reference: string;
  reflection?: string;
}

export default function WordForToday({ word }: { word: Word | null }) {
  const text = word?.scripture_text || '"Let the word of Christ dwell in you richly"';
  const ref  = word?.reference     || 'Colossians 3:16';

  return (
    <section className="bg-nifes-green py-8 sm:py-10">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Label */}
          <div className="flex-shrink-0 bg-nifes-gold px-4 py-2 rounded-xl">
            <p className="font-display font-bold text-nifes-green text-sm whitespace-nowrap">
              📖 Word for Today
            </p>
          </div>
          {/* Scripture */}
          <div className="flex-1 min-w-0">
            <p className="font-display italic text-white text-base sm:text-lg leading-relaxed">
              {text}
            </p>
            <p className="text-nifes-gold text-sm font-semibold mt-1">— {ref}</p>
          </div>
        </div>
        {word?.reflection && (
          <p className="mt-4 text-white/70 text-sm leading-relaxed border-t border-white/15 pt-4">
            {word.reflection}
          </p>
        )}
      </div>
    </section>
  );
}


// ============================================================
// FILE: frontend/components/sections/QuizSection.tsx
// PURPOSE: Weekly Bible Quiz — supports multiple choice AND
//          chronological arrangement. Mobile-first swipeable
//          card interface. Score display with social sharing.
// ============================================================

'use client';

import { useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { submitQuiz } from '@/lib/api';
import { CheckCircle, XCircle, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

// ── Drag-and-drop for chronological quiz ──
// Simple state-based drag (no library needed for this use case)
function ChronologicalQuiz({ events, quizId, onComplete }: {
  events: Array<{ id: string; event_name: string }>;
  quizId: string;
  onComplete: (results: any) => void;
}) {
  const [items, setItems] = useState(events);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null);

  const handleDragStart = (idx: number) => setDragging(idx);

  const handleDrop = (targetIdx: number) => {
    if (dragging === null || dragging === targetIdx) return;
    const next = [...items];
    const [moved] = next.splice(dragging, 1);
    next.splice(targetIdx, 0, moved);
    setItems(next);
    setDragging(null);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const answers = items.map((item, idx) => ({ event_id: item.id, position: idx + 1 }));
      const result = await submitQuiz({ quiz_id: quizId, participant_name: name, answers });
      onComplete(result);
    } catch {
      toast.error('Failed to submit quiz. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-nifes-muted">
        Drag and drop the events into the correct chronological order (oldest first).
      </p>

      <div className="space-y-2">
        {items.map((item, idx) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(idx)}
            className={`flex items-center gap-3 p-3 bg-white border-2 rounded-xl cursor-grab active:cursor-grabbing transition-colors ${
              dragging === idx ? 'border-nifes-green bg-nifes-green/5 opacity-50' : 'border-nifes-warm-gray'
            }`}
          >
            <span className="w-7 h-7 bg-nifes-green text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
              {idx + 1}
            </span>
            <span className="text-sm font-medium text-nifes-text">{item.event_name}</span>
            <span className="ml-auto text-nifes-muted text-xs">⠿</span>
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Your name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="form-input"
      />

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="btn-primary w-full justify-center"
      >
        {submitting ? 'Submitting…' : 'Submit Arrangement'}
      </button>
    </div>
  );
}

// ── Multiple choice quiz with swipeable cards ──
function MultipleChoiceQuiz({ questions, quizId, onComplete }: {
  questions: Array<{ id: string; question_text: string; option_a: string; option_b: string; option_c: string; option_d: string }>;
  quizId: string;
  onComplete: (results: any) => void;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: false });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAnswer = (questionId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
    // Auto-advance to next question after 500ms
    if (currentIdx < questions.length - 1) {
      setTimeout(() => {
        emblaApi?.scrollNext();
        setCurrentIdx(i => i + 1);
      }, 500);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error(`Please answer all ${questions.length} questions before submitting.`);
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitQuiz({ quiz_id: quizId, participant_name: name, answers });
      onComplete(result);
    } catch {
      toast.error('Failed to submit. Check your internet connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const OPTIONS = ['A', 'B', 'C', 'D'] as const;
  const optionText = (q: any, o: string) => (q as any)[`option_${o.toLowerCase()}`];

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-nifes-warm-gray rounded-full h-2">
          <div
            className="bg-nifes-green h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-nifes-muted whitespace-nowrap">
          {currentIdx + 1}/{questions.length}
        </span>
      </div>

      {/* Swipeable question cards */}
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {questions.map((q, idx) => (
            <div key={q.id} className="flex-none w-full px-1">
              <div className="card p-5">
                <p className="text-xs font-bold text-nifes-green-light uppercase tracking-wider mb-3">
                  Question {idx + 1}
                </p>
                <p className="font-semibold text-nifes-text text-base leading-relaxed mb-5">
                  {q.question_text}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(q.id, opt)}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 text-sm font-medium text-left transition-all ${
                        answers[q.id] === opt
                          ? 'border-nifes-green bg-nifes-green/10 text-nifes-green'
                          : 'border-nifes-warm-gray bg-white text-nifes-text hover:border-nifes-green/50'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        answers[q.id] === opt ? 'bg-nifes-green text-white' : 'bg-nifes-warm-gray text-nifes-muted'
                      }`}>{opt}</span>
                      {optionText(q, opt)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Show submit only on last question */}
      {currentIdx === questions.length - 1 && (
        <div className="space-y-3">
          <input type="text" placeholder="Your name (optional)" value={name} onChange={e => setName(e.target.value)} className="form-input" />
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full justify-center">
            {submitting ? 'Marking…' : `Submit All ${questions.length} Answers`}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Score results display ──
function QuizResults({ result, onReset }: { result: any; onReset: () => void }) {
  const pct = result.percentage;
  const shareText = encodeURIComponent(result.share_text || `I scored ${result.score}/${result.total} on the NIFES Awka Zone Bible Quiz!`);

  return (
    <div className="space-y-5">
      {/* Score circle */}
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-28 h-28 rounded-full border-4 border-nifes-green bg-nifes-green/10 mb-4">
          <div>
            <p className="font-display text-4xl font-bold text-nifes-green">{result.score}</p>
            <p className="text-sm text-nifes-muted">out of {result.total}</p>
          </div>
        </div>
        <p className="font-semibold text-nifes-text text-lg">{result.message}</p>
        <p className="text-nifes-muted text-sm mt-1">{pct}% score</p>
      </div>

      {/* Share buttons */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-nifes-muted mb-2 flex items-center gap-1">
          <Share2 size={12} /> Share Your Score
        </p>
        <div className="flex gap-2 flex-wrap">
          <a href={`https://wa.me/?text=${shareText}`} target="_blank" rel="noopener noreferrer"
            className="btn-primary text-xs px-3 py-2 bg-green-500">WhatsApp</a>
          <a href={`https://www.facebook.com/sharer/sharer.php?quote=${shareText}`} target="_blank" rel="noopener noreferrer"
            className="btn-primary text-xs px-3 py-2 bg-blue-600">Facebook</a>
          <a href={`https://twitter.com/intent/tweet?text=${shareText}`} target="_blank" rel="noopener noreferrer"
            className="btn-primary text-xs px-3 py-2 bg-sky-500">Twitter / X</a>
        </div>
      </div>

      {/* Wrong answers review */}
      {result.results && (
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-nifes-muted">Review Answers</p>
          {result.results.map((r: any, i: number) => (
            <div key={i} className={`p-3 rounded-xl border ${r.is_correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <div className="flex items-start gap-2">
                {r.is_correct ? <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" /> : <XCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />}
                <div>
                  <p className="text-xs font-semibold text-nifes-text">{r.question_text || r.event_name}</p>
                  {!r.is_correct && r.correct_answer && (
                    <p className="text-xs text-green-700 mt-1">
                      Correct: <strong>{r.correct_answer}</strong>
                      {r.options?.[r.correct_answer] && ` — ${r.options[r.correct_answer]}`}
                    </p>
                  )}
                  {r.explanation && <p className="text-xs text-nifes-muted mt-1 italic">{r.explanation}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={onReset} className="btn-secondary w-full justify-center text-sm">
        Take Quiz Again
      </button>
    </div>
  );
}

// ── Main quiz section ──
export default function QuizSection({ initialQuiz }: { initialQuiz: any }) {
  const [quiz] = useState(initialQuiz);
  const [results, setResults] = useState<any>(null);

  if (!quiz || !quiz.id) {
    return (
      <section id="quiz" className="py-16 bg-nifes-warm-gray">
        <div className="section-container text-center">
          <p className="section-label justify-center">📖 Bible Quiz</p>
          <h2 className="section-title mb-4">Weekly Bible Quiz</h2>
          <div className="max-w-md mx-auto card p-8">
            <p className="text-3xl mb-3">🕐</p>
            <p className="font-semibold text-nifes-text">No active quiz this week</p>
            <p className="text-sm text-nifes-muted mt-2">
              New quizzes go live every <strong>Friday</strong>. Check back then!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="quiz" className="py-16 bg-nifes-warm-gray">
      <div className="section-container">
        <div className="text-center mb-8">
          <p className="section-label justify-center">📖 Weekly Bible Quiz</p>
          <h2 className="section-title">{quiz.title}</h2>
          <p className="text-nifes-muted text-sm mt-2">
            {quiz.quiz_type === 'multiple_choice' ? `${quiz.questions?.length || 10} questions` : 'Chronological Arrangement'}
            {' · '}Active until {new Date(quiz.end_date).toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'short' })}
          </p>
        </div>

        <div className="max-w-lg mx-auto card p-5 sm:p-6">
          {results ? (
            <QuizResults result={results} onReset={() => setResults(null)} />
          ) : quiz.quiz_type === 'multiple_choice' ? (
            <MultipleChoiceQuiz questions={quiz.questions || []} quizId={quiz.id} onComplete={setResults} />
          ) : (
            <ChronologicalQuiz events={quiz.events || []} quizId={quiz.id} onComplete={setResults} />
          )}
        </div>
      </div>
    </section>
  );
}


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

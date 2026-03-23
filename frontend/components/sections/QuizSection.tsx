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
import { Router } from 'express';
import { supabase } from '../db/supabase';
import { requireAuth } from '../middleware/auth';

const quizRouter = Router();

// GET /api/quiz/current — returns active quiz for this week
quizRouter.get('/current', async (_req, res) => {
  const today = new Date().toISOString().split('T')[0];

  const { data: quiz, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('is_active', true)
    .lte('start_date', today)
    .gte('end_date', today)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !quiz) {
    return res.status(404).json({ message: 'No active quiz this week. Check back Friday!' });
  }

  // Fetch questions or events based on quiz type
  if (quiz.quiz_type === 'multiple_choice') {
    const { data: questions } = await supabase
      .from('quiz_questions')
      .select('id, question_text, option_a, option_b, option_c, option_d, question_order')
      // NOTE: correct_answer is NOT sent to client — only checked on submit
      .eq('quiz_id', quiz.id)
      .order('question_order');

    return res.json({ ...quiz, questions });
  }

  if (quiz.quiz_type === 'chronological') {
    const { data: events } = await supabase
      .from('quiz_events')
      .select('id, event_name, display_order')
      // correct_position NOT sent to client
      .eq('quiz_id', quiz.id)
      .order('display_order');

    // Shuffle events for display
    const shuffled = events?.sort(() => Math.random() - 0.5);
    return res.json({ ...quiz, events: shuffled });
  }

  res.json(quiz);
});

// POST /api/quiz/submit — submit answers and get score
quizRouter.post('/submit', async (req, res) => {
  const { quiz_id, participant_name, participant_email, school, answers } = req.body;

  if (!quiz_id || !answers) {
    return res.status(400).json({ error: 'quiz_id and answers are required.' });
  }

  // Fetch the quiz to determine type
  const { data: quiz } = await supabase.from('quizzes').select('*').eq('id', quiz_id).single();
  if (!quiz) return res.status(404).json({ error: 'Quiz not found.' });

  let score = 0;
  let total = 0;
  let results: any[] = [];

  if (quiz.quiz_type === 'multiple_choice') {
    // answers = { questionId: 'A'|'B'|'C'|'D' }
    const { data: questions } = await supabase
      .from('quiz_questions')
      .select('id, question_text, correct_answer, option_a, option_b, option_c, option_d, explanation')
      .eq('quiz_id', quiz_id);

    total = questions?.length || 0;

    results = (questions || []).map((q) => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correct_answer;
      if (isCorrect) score++;
      return {
        question_id: q.id,
        question_text: q.question_text,
        user_answer: userAnswer,
        correct_answer: q.correct_answer,
        is_correct: isCorrect,
        explanation: q.explanation,
        options: { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d },
      };
    });
  }

  if (quiz.quiz_type === 'chronological') {
    // answers = [{ event_id, position }] — user's arrangement
    const { data: events } = await supabase
      .from('quiz_events')
      .select('id, event_name, correct_position')
      .eq('quiz_id', quiz_id);

    total = events?.length || 0;

    results = (events || []).map((e) => {
      const userPos = answers.find((a: any) => a.event_id === e.id)?.position;
      const isCorrect = userPos === e.correct_position;
      if (isCorrect) score++;
      return {
        event_id: e.id,
        event_name: e.event_name,
        user_position: userPos,
        correct_position: e.correct_position,
        is_correct: isCorrect,
      };
    });
  }

  // Save submission to leaderboard
  await supabase.from('quiz_submissions').insert({
    quiz_id,
    participant_name: participant_name || 'Anonymous',
    participant_email,
    school,
    score,
    total_questions: total,
    answers,
  });

  res.json({
    score,
    total,
    percentage: Math.round((score / total) * 100),
    results,
    message: score === total
      ? '🎉 Perfect score! Excellent work!'
      : score >= total * 0.7
      ? '👏 Great job! Well done!'
      : '📖 Keep studying! Review the answers below.',
    share_text: `I scored ${score}/${total} on the NIFES Awka Zone Bible Quiz! Can you beat me? Try at nifesawka.org 🎓`,
  });
});

// GET /api/quiz/leaderboard/:quizId
quizRouter.get('/leaderboard/:quizId', async (req, res) => {
  const { data, error } = await supabase
    .from('quiz_submissions')
    .select('participant_name, school, score, total_questions, submitted_at')
    .eq('quiz_id', req.params.quizId)
    .order('score', { ascending: false })
    .order('submitted_at', { ascending: true })  // Earlier submission wins tie
    .limit(10);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ── ADMIN: Create quiz ──
quizRouter.post('/', requireAuth, async (req: any, res) => {
  const { title, quiz_type, start_date, end_date, questions, events } = req.body;

  // Validate start_date is a Friday
  const startDay = new Date(start_date).getDay();
  if (startDay !== 5) {
    return res.status(400).json({ error: 'Quiz start_date must be a Friday (day 5).' });
  }

  const { data: quiz, error } = await supabase
    .from('quizzes')
    .insert({ title, quiz_type, start_date, end_date })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  // Insert questions/events
  if (quiz_type === 'multiple_choice' && questions?.length) {
    await supabase.from('quiz_questions').insert(
      questions.map((q: any, i: number) => ({ ...q, quiz_id: quiz.id, question_order: i + 1 }))
    );
  }

  if (quiz_type === 'chronological' && events?.length) {
    await supabase.from('quiz_events').insert(
      events.map((e: any, i: number) => ({ ...e, quiz_id: quiz.id, display_order: i + 1 }))
    );
  }

  res.status(201).json(quiz);
});

export { quizRouter as default };


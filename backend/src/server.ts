// ============================================================
// FILE: backend/src/server.ts
// PURPOSE: Express server entry point — sets up middleware,
//          routes, and starts listening on configured PORT.
// ============================================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Import all route modules
import authRoutes from './routes/auth.routes';
import heroRoutes from './routes/hero.routes';
import wordRoutes from './routes/word.routes';
import aboutRoutes from './routes/about.routes';
import staffRoutes from './routes/staff.routes';
import studentsRoutes from './routes/students.routes';
import schoolsRoutes from './routes/schools.routes';
import testimoniesRoutes from './routes/testimonies.routes';
import newsRoutes from './routes/news.routes';
import eventsRoutes from './routes/events.routes';
import galleryRoutes from './routes/gallery.routes';
import resourcesRoutes from './routes/resources.routes';
import quizRoutes from './routes/quiz.routes';
import newsletterRoutes from './routes/newsletter.routes';
import prayerRoutes from './routes/prayer.routes';
import settingsRoutes from './routes/settings.routes';
import nacfRoutes from './routes/nacf.routes';

const app = express();
const PORT = process.env.PORT || 4000;

// ── Security middleware ──
// Helmet sets secure HTTP headers
app.use(helmet());

// CORS: allow only our frontend domain
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting: protect against abuse
// 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Please wait 15 minutes.' },
});

// ── Body parsing ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Logging ──
// 'dev' format in development, 'combined' in production
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── Health check endpoint ──
// Used by Railway to verify the service is running
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'nifes-awka-api' });
});

// ── API Routes ──
// All routes are prefixed with /api/
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/word', wordRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/schools', schoolsRoutes);
app.use('/api/testimonies', testimoniesRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/prayer', prayerRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/nacf', nacfRoutes);

// ── 404 handler ──
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global error handler ──
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[ERROR]', err.message);
  const statusCode = (err as any).statusCode || 500;
  res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// ── Start server ──
app.listen(PORT, () => {
  console.log(`\n✅ NIFES Awka API running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health check: http://localhost:${PORT}/health\n`);
});

export default app;

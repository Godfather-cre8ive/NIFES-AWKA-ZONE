// ============================================================
// FILE: frontend/lib/api.ts
// PURPOSE: Centralized API client. All components call these
//          functions — never fetch() directly in components.
//          Update API_BASE_URL via environment variable only.
// ============================================================

import axios from 'axios';
import Cookies from 'js-cookie';

// Base URL from environment — set in .env.local
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Create axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,  // 15s timeout — important for slow mobile connections
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token from cookie to every request (for admin calls)
api.interceptors.request.use((config) => {
  const token = Cookies.get('nifes_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      Cookies.remove('nifes_admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// ── Public API functions ──

export const getHeroSlides = () => api.get('/hero').then(r => r.data);
export const getWordForToday = () => api.get('/word').then(r => r.data);
export const getAboutPages = () => api.get('/about').then(r => r.data);
export const getAboutPage = (slug: string) => api.get(`/about/${slug}`).then(r => r.data);
export const getStaff = () => api.get('/staff').then(r => r.data);
export const getStudentLeaders = () => api.get('/students').then(r => r.data);
export const getSchools = () => api.get('/schools').then(r => r.data);
export const getTestimonies = () => api.get('/testimonies').then(r => r.data);
export const getNewsPosts = () => api.get('/news').then(r => r.data);
export const getNewsPost = (slug: string) => api.get(`/news/${slug}`).then(r => r.data);
export const getEvents = () => api.get('/events').then(r => r.data);
export const getGalleryAlbums = () => api.get('/gallery/albums').then(r => r.data);
export const getGalleryImages = (albumId: string) => api.get(`/gallery/albums/${albumId}/images`).then(r => r.data);
export const getResources = () => api.get('/resources').then(r => r.data);
export const getSiteSettings = () => api.get('/settings').then(r => r.data);
export const getNacfSection = () => api.get('/nacf').then(r => r.data);
export const getCurrentQuiz = () => api.get('/quiz/current').then(r => r.data);
export const getQuizLeaderboard = (quizId: string) => api.get(`/quiz/leaderboard/${quizId}`).then(r => r.data);

// ── Submission functions ──

export const submitQuiz = (data: {
  quiz_id: string;
  participant_name?: string;
  participant_email?: string;
  school?: string;
  answers: any;
}) => api.post('/quiz/submit', data).then(r => r.data);

export const subscribeNewsletter = (data: { email: string; name?: string }) =>
  api.post('/newsletter/subscribe', data).then(r => r.data);

export const submitPrayerRequest = (data: {
  name?: string;
  email?: string;
  request_message: string;
}) => api.post('/prayer/submit', data).then(r => r.data);

// ── Admin API functions (require JWT) ──

export const adminLogin = (email: string, password: string) =>
  api.post('/auth/login', { email, password }).then(r => r.data);

export const adminGetNewsletterSubscribers = (format?: 'csv') =>
  api.get('/newsletter/subscribers', { params: { format }, responseType: format === 'csv' ? 'blob' : 'json' }).then(r => r.data);

export const adminGetPrayerRequests = () => api.get('/prayer').then(r => r.data);

// Generic admin CRUD
export const adminCreate = (resource: string, data: any) =>
  api.post(`/${resource}`, data).then(r => r.data);

export const adminUpdate = (resource: string, id: string, data: any) =>
  api.put(`/${resource}/${id}`, data).then(r => r.data);

export const adminDelete = (resource: string, id: string) =>
  api.delete(`/${resource}/${id}`).then(r => r.data);

export const adminUpdateSetting = (key: string, value: string) =>
  api.put(`/settings/${key}`, { value }).then(r => r.data);

export default api;

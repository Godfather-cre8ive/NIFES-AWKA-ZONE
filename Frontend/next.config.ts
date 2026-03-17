// FILE: frontend/next.config.ts
// PURPOSE: Next.js configuration — image domains, API rewrites

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow images from these external domains
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'drive.google.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  // Compress output for faster delivery on mobile
  compress: true,
  // Rewrite /api/* to backend during development
  async rewrites() {
    return process.env.NODE_ENV === 'development'
      ? [{ source: '/backend/:path*', destination: 'http://localhost:4000/api/:path*' }]
      : [];
  },
};

export default nextConfig;

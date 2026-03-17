// FILE: frontend/tailwind.config.ts
// PURPOSE: Custom Tailwind theme for NIFES Awka Zone brand

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // NIFES brand colors: deep green + gold
      colors: {
        nifes: {
          green:      '#1B4332',  // Deep forest green (primary)
          'green-mid':'#2D6A4F',  // Mid green
          'green-light':'#40916C',// Light green
          gold:       '#D4A017',  // Gold accent
          'gold-light':'#F4D03F', // Light gold
          cream:      '#F9F6EE',  // Warm off-white background
          'warm-gray':'#EDE8DE',
          navy:       '#1A1F4B',  // Deep navy for contrast
          text:       '#1C2B2D',
          muted:      '#5A6B6C',
        },
      },
      fontFamily: {
        // Crimson Pro: elegant serif for headings (Nigerian academic/church aesthetic)
        display: ['var(--font-crimson)', 'Georgia', 'serif'],
        // Nunito: friendly, highly legible for body (great on mobile)
        body: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-in': 'slideIn 0.5s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

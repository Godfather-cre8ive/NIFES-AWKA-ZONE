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
// ============================================================
// FILE: frontend/components/sections/AboutCarousel.tsx
// PURPOSE: Horizontal sliding carousel of about cards.
//          Each card links to a full page at /about/[slug]
// ============================================================

'use client';

import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronRight } from 'lucide-react';

interface AboutPage {
  slug: string;
  title: string;
  card_summary: string;
  icon?: string;
}

const ICON_BG: Record<string, string> = {
  '🎓': 'bg-blue-50',
  '👁️': 'bg-purple-50',
  '🎯': 'bg-red-50',
  '📖': 'bg-amber-50',
  '✝️': 'bg-green-50',
};

export default function AboutCarousel({ pages }: { pages: AboutPage[] }) {
  const [emblaRef] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });

  const defaultPages: AboutPage[] = [
    { slug: 'about-nifes', title: 'About NIFES', card_summary: 'The Nigeria Fellowship of Evangelical Students — winning students for Christ since 1969.', icon: '🎓' },
    { slug: 'vision', title: 'Our Vision', card_summary: 'To see every student in Nigeria impacted by the Gospel and discipled into a lifestyle of faith.', icon: '👁️' },
    { slug: 'mission', title: 'Our Mission', card_summary: 'Training and mobilising students to evangelise campuses and transform Nigeria through the Word.', icon: '🎯' },
    { slug: 'history-awka', title: 'History of Awka Zone', card_summary: 'The story of NIFES Awka Zone — from humble beginnings to a thriving student movement.', icon: '📖' },
    { slug: 'statement-of-faith', title: 'Statement of Faith', card_summary: 'We affirm the inspiration and authority of the Bible as the only infallible rule of faith.', icon: '✝️' },
  ];

  const displayPages = pages.length > 0 ? pages : defaultPages;

  return (
    <section id="about" className="py-16 bg-white">
      <div className="section-container">
        <p className="section-label">Who We Are</p>
        <h2 className="section-title mb-8">About NIFES Awka Zone</h2>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 pb-2">
            {displayPages.map((page) => (
              <Link
                key={page.slug}
                href={`/about/${page.slug}`}
                className="flex-none w-[260px] sm:w-[280px] card p-5 hover:border-nifes-green/40 group"
              >
                <div className={`w-12 h-12 ${ICON_BG[page.icon || ''] || 'bg-nifes-warm-gray'} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                  {page.icon || '📄'}
                </div>
                <h3 className="font-display font-bold text-nifes-green text-base mb-2 group-hover:text-nifes-green-light transition-colors">
                  {page.title}
                </h3>
                <p className="text-nifes-muted text-sm leading-relaxed line-clamp-3 mb-4">
                  {page.card_summary}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-nifes-green group-hover:gap-2 transition-all">
                  Read More <ChevronRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
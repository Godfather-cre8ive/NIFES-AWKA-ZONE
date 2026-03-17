// ============================================================
// FILE: frontend/components/sections/TestimonySection.tsx
// PURPOSE: Carousel showing headline + name only.
//          Click opens full testimony in a modal.
// ============================================================

'use client';

import { useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { X, MessageSquareQuote } from 'lucide-react';
import { format } from 'date-fns';

interface Testimony {
  id: string;
  headline: string;
  testifier_name: string;
  full_testimony: string;
  testimony_date: string;
}

function TestimonyModal({ testimony, onClose }: { testimony: Testimony; onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-nifes-green/10 rounded-xl flex items-center justify-center">
              <MessageSquareQuote size={20} className="text-nifes-green" />
            </div>
            <button onClick={onClose} className="w-8 h-8 bg-nifes-warm-gray rounded-full flex items-center justify-center text-nifes-muted hover:bg-red-100 hover:text-red-500 transition-colors">
              <X size={16} />
            </button>
          </div>
          <h3 className="font-display font-bold text-nifes-green text-xl leading-tight mb-2">
            {testimony.headline}
          </h3>
          <p className="text-nifes-gold text-sm font-semibold mb-1">{testimony.testifier_name}</p>
          <p className="text-nifes-muted text-xs mb-4">
            {format(new Date(testimony.testimony_date), 'MMMM d, yyyy')}
          </p>
          <div className="border-t border-nifes-warm-gray pt-4">
            <p className="text-nifes-text text-sm leading-relaxed whitespace-pre-wrap">
              {testimony.full_testimony}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonySection({ testimonies }: { testimonies: Testimony[] }) {
  const [emblaRef] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });
  const [selected, setSelected] = useState<Testimony | null>(null);

  const defaultTestimonies: Testimony[] = [
    { id: '1', headline: 'God healed me in my final year exams', testifier_name: 'Chidi O.', full_testimony: 'I was so sick I could not study, but God showed up and I passed all my papers...', testimony_date: new Date().toISOString() },
    { id: '2', headline: 'NIFES fellowship saved me from dropping out', testifier_name: 'Ngozi A.', full_testimony: 'I was about to give up when a NIFES student reached out to me...', testimony_date: new Date().toISOString() },
    { id: '3', headline: 'Provision came just in time', testifier_name: 'Emeka P.', full_testimony: 'I had no school fees and the deadline was the next day...', testimony_date: new Date().toISOString() },
  ];

  const displayTestimonies = testimonies.length > 0 ? testimonies : defaultTestimonies;

  return (
    <section id="testimonies" className="py-16 bg-nifes-warm-gray">
      <div className="section-container">
        <p className="section-label">Testimonies</p>
        <h2 className="section-title mb-2">What God Has Done</h2>
        <p className="text-nifes-muted text-sm mb-8">
          Real stories of God&apos;s faithfulness among students. Click any card to read the full testimony.
        </p>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 pb-2">
            {displayTestimonies.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t)}
                className="flex-none w-[240px] card p-5 text-left hover:border-nifes-green/40 group cursor-pointer"
              >
                <div className="w-8 h-8 bg-nifes-green/10 rounded-lg flex items-center justify-center mb-3">
                  <MessageSquareQuote size={16} className="text-nifes-green" />
                </div>
                <h3 className="font-display font-semibold text-nifes-text text-sm leading-snug mb-2 group-hover:text-nifes-green transition-colors line-clamp-3">
                  {t.headline}
                </h3>
                <p className="text-nifes-gold text-xs font-semibold">— {t.testifier_name}</p>
                <span className="text-xs text-nifes-green font-semibold mt-3 inline-block group-hover:underline">
                  Read full testimony →
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selected && <TestimonyModal testimony={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}


// ============================================================
// FILE: frontend/components/sections/NewsSection.tsx
// ============================================================

'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

interface NewsPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  cover_image_url?: string;
  published_at: string;
  author?: string;
}

export default function NewsSection({ posts }: { posts: NewsPost[] }) {
  const [emblaRef] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });

  return (
    <section id="news" className="py-16 bg-white">
      <div className="section-container">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="section-label">Updates</p>
            <h2 className="section-title">News & Blog</h2>
          </div>
          <Link href="/news" className="text-xs font-semibold text-nifes-green hover:underline">
            View all →
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-nifes-muted py-8">No posts yet. Check back soon!</p>
        ) : (
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 pb-2">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/news/${post.slug}`}
                  className="flex-none w-[260px] sm:w-[280px] card group"
                >
                  {/* Cover image */}
                  <div className="aspect-video bg-nifes-warm-gray relative overflow-hidden">
                    {post.cover_image_url ? (
                      <Image
                        src={post.cover_image_url}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">📰</div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-nifes-muted text-xs mb-2">
                      {format(new Date(post.published_at), 'dd MMM yyyy')}
                    </p>
                    <h3 className="font-display font-bold text-nifes-green text-sm leading-snug group-hover:text-nifes-green-light transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-nifes-muted text-xs mt-2 line-clamp-2">{post.excerpt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


// ============================================================
// FILE: frontend/components/sections/EventsSection.tsx
// ============================================================

'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { format } from 'date-fns';
import { MapPin, Calendar, ExternalLink } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  event_time?: string;
  location?: string;
  registration_link?: string;
  cover_image_url?: string;
}

export default function EventsSection({ events }: { events: Event[] }) {
  const [emblaRef] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });

  return (
    <section id="events" className="py-16 bg-nifes-warm-gray">
      <div className="section-container">
        <p className="section-label">Calendar</p>
        <h2 className="section-title mb-8">Upcoming Events</h2>

        {events.length === 0 ? (
          <p className="text-center text-nifes-muted py-8">No upcoming events at the moment.</p>
        ) : (
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 pb-2">
              {events.map((event) => {
                const date = new Date(event.event_date);
                return (
                  <div key={event.id} className="flex-none w-[260px] card p-5">
                    {/* Date badge */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-nifes-green rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0">
                        <span className="font-bold text-lg leading-none">{format(date, 'd')}</span>
                        <span className="text-xs font-semibold leading-none mt-0.5">{format(date, 'MMM')}</span>
                      </div>
                      <div>
                        <p className="font-display font-bold text-nifes-green text-sm leading-tight">{event.title}</p>
                        <p className="text-nifes-muted text-xs">{format(date, 'EEEE, yyyy')}</p>
                      </div>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1.5 text-xs text-nifes-muted mb-3">
                        <MapPin size={12} />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.event_time && (
                      <div className="flex items-center gap-1.5 text-xs text-nifes-muted mb-3">
                        <Calendar size={12} />
                        <span>{event.event_time}</span>
                      </div>
                    )}
                    {event.description && (
                      <p className="text-nifes-muted text-xs line-clamp-2 mb-3">{event.description}</p>
                    )}
                    {event.registration_link && (
                      <a
                        href={event.registration_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-xs w-full justify-center py-2.5"
                      >
                        Register <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


// ============================================================
// FILE: frontend/components/sections/AlumniSection.tsx
// PURPOSE: NACF / Alumni corner
// ============================================================

'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { format } from 'date-fns';

interface NacfData {
  chairman_name?: string;
  chairman_message?: string;
  chairman_photo_url?: string;
  announcements?: Array<{
    id: string;
    title: string;
    content: string;
    announcement_type: string;
    event_date?: string;
  }>;
  leader_contact?: string;
}

export default function AlumniSection({ nacf }: { nacf: NacfData | null }) {
  const [emblaRef] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });

  const announcements = nacf?.announcements || [];

  const typeColors: Record<string, string> = {
    reunion: 'bg-amber-100 text-amber-700',
    meeting: 'bg-blue-100 text-blue-700',
    event: 'bg-purple-100 text-purple-700',
    general: 'bg-nifes-warm-gray text-nifes-muted',
  };

  return (
    <section id="alumni" className="py-16 bg-white">
      <div className="section-container">
        <p className="section-label">Associates</p>
        <h2 className="section-title mb-2">Alumni & NACF Corner</h2>
        <p className="text-nifes-muted text-sm mb-8">
          NIFES Associates Community Fellowship — staying connected beyond campus.
        </p>

        {/* Chairman message */}
        {nacf?.chairman_name && (
          <div className="card p-5 sm:p-6 mb-8 border-l-4 border-nifes-gold">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-nifes-warm-gray overflow-hidden flex-shrink-0">
                {nacf.chairman_photo_url ? (
                  <Image src={nacf.chairman_photo_url} alt={nacf.chairman_name} width={56} height={56} className="w-full h-full object-cover" />
                ) : <div className="w-full h-full flex items-center justify-center text-xl">👤</div>}
              </div>
              <div>
                <p className="text-nifes-gold text-xs font-bold uppercase tracking-widest mb-1">
                  Message from the NACF Chairman
                </p>
                <h3 className="font-display font-bold text-nifes-green text-lg">{nacf.chairman_name}</h3>
                {nacf.chairman_message && (
                  <p className="text-nifes-text text-sm leading-relaxed italic mt-2">
                    &ldquo;{nacf.chairman_message}&rdquo;
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Announcements carousel */}
        {announcements.length > 0 && (
          <>
            <h3 className="font-semibold text-nifes-text text-sm mb-4">Announcements & Updates</h3>
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4 pb-2">
                {announcements.map((ann) => (
                  <div key={ann.id} className="flex-none w-[260px] card p-4">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${typeColors[ann.announcement_type] || typeColors.general}`}>
                      {ann.announcement_type}
                    </span>
                    <h4 className="font-semibold text-nifes-green text-sm mt-2 mb-1">{ann.title}</h4>
                    <p className="text-nifes-muted text-xs line-clamp-3">{ann.content}</p>
                    {ann.event_date && (
                      <p className="text-nifes-gold text-xs font-semibold mt-2">
                        📅 {format(new Date(ann.event_date), 'EEEE, d MMM yyyy')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {!nacf?.chairman_name && announcements.length === 0 && (
          <p className="text-center text-nifes-muted py-8">NACF section coming soon.</p>
        )}
      </div>
    </section>
  );
}

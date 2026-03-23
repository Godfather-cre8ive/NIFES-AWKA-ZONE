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
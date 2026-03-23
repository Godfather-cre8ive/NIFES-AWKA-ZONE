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
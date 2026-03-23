// ============================================================
// FILE: frontend/components/sections/StudentCorner.tsx
// ============================================================

'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { Phone } from 'lucide-react';

interface StudentLeader {
  id: string;
  name: string;
  office: string;
  school: string;
  contact_phone?: string;
  contact_email?: string;
  photo_url?: string;
  leader_type: 'zonal' | 'sub-zonal';
  is_president?: boolean;
  president_message?: string;
}

export default function StudentCorner({ leaders }: { leaders: StudentLeader[] }) {
  const [emblaRef] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });

  const president = leaders.find((l) => l.is_president);
  const others = leaders.filter((l) => !l.is_president);
  const zonal = others.filter((l) => l.leader_type === 'zonal');
  const subZonal = others.filter((l) => l.leader_type === 'sub-zonal');
  const allOthers = [...zonal, ...subZonal];

  return (
    <section id="students" className="py-16 bg-white">
      <div className="section-container">
        <p className="section-label">Students</p>
        <h2 className="section-title mb-8">Student Corner</h2>

        {/* President message */}
        {president && (
          <div className="card p-5 sm:p-6 mb-8 border-l-4 border-nifes-gold">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-nifes-warm-gray overflow-hidden flex-shrink-0">
                {president.photo_url ? (
                  <Image src={president.photo_url} alt={president.name} width={56} height={56} className="w-full h-full object-cover" />
                ) : <div className="w-full h-full flex items-center justify-center text-xl">👤</div>}
              </div>
              <div>
                <p className="text-nifes-gold text-xs font-bold uppercase tracking-widest mb-1">Message from the Zonal President</p>
                <h3 className="font-display font-bold text-nifes-green text-lg">{president.name}</h3>
                <p className="text-xs text-nifes-muted mb-2">{president.school}</p>
                {president.president_message && (
                  <p className="text-nifes-text text-sm leading-relaxed italic">
                    &ldquo;{president.president_message}&rdquo;
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Leaders carousel */}
        {allOthers.length > 0 && (
          <>
            <div className="flex gap-3 mb-4 overflow-x-auto no-scrollbar">
              <span className="flex-shrink-0 text-xs font-semibold px-3 py-1 bg-nifes-green text-white rounded-full">All Leaders</span>
              <span className="flex-shrink-0 text-xs font-semibold px-3 py-1 bg-nifes-warm-gray text-nifes-text rounded-full">Zonal ({zonal.length})</span>
              <span className="flex-shrink-0 text-xs font-semibold px-3 py-1 bg-nifes-warm-gray text-nifes-text rounded-full">Sub-Zonal ({subZonal.length})</span>
            </div>
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4 pb-2">
                {allOthers.map((l) => (
                  <div key={l.id} className="flex-none w-[200px] card p-4">
                    <div className="w-12 h-12 rounded-xl bg-nifes-warm-gray overflow-hidden mb-3">
                      {l.photo_url ? (
                        <Image src={l.photo_url} alt={l.name} width={48} height={48} className="w-full h-full object-cover" />
                      ) : <div className="w-full h-full flex items-center justify-center">👤</div>}
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${l.leader_type === 'zonal' ? 'bg-nifes-green/10 text-nifes-green' : 'bg-amber-100 text-amber-700'}`}>
                      {l.leader_type === 'zonal' ? 'Zonal' : 'Sub-Zonal'}
                    </span>
                    <p className="font-semibold text-nifes-text text-sm mt-2">{l.name}</p>
                    <p className="text-nifes-gold text-xs font-semibold">{l.office}</p>
                    <p className="text-nifes-muted text-xs mt-1">{l.school}</p>
                    {l.contact_phone && (
                      <a href={`tel:${l.contact_phone}`} className="flex items-center gap-1 text-xs text-nifes-green mt-2 hover:underline">
                        <Phone size={11} /> {l.contact_phone}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {leaders.length === 0 && (
          <p className="text-center text-nifes-muted py-8">Student leadership profiles coming soon.</p>
        )}
      </div>
    </section>
  );
}
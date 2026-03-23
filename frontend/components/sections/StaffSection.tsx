// ============================================================
// FILE: frontend/components/sections/StaffSection.tsx
// PURPOSE: Training Secretary featured message + staff carousel
// ============================================================

'use client';

import { useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { Mail, Phone, X } from 'lucide-react';

interface Staff {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photo_url?: string;
  contact_email?: string;
  contact_phone?: string;
  is_featured?: boolean;
  featured_message?: string;
}

function StaffModal({ staff, onClose }: { staff: Staff; onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-nifes-warm-gray overflow-hidden flex-shrink-0">
                {staff.photo_url ? (
                  <Image src={staff.photo_url} alt={staff.name} width={64} height={64} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                )}
              </div>
              <div>
                <h3 className="font-display font-bold text-nifes-green text-lg">{staff.name}</h3>
                <p className="text-nifes-gold text-sm font-semibold">{staff.role}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 bg-nifes-warm-gray rounded-full flex items-center justify-center text-nifes-muted hover:bg-nifes-green hover:text-white transition-colors flex-shrink-0">
              <X size={16} />
            </button>
          </div>
          {staff.bio && <p className="text-nifes-text text-sm leading-relaxed mb-4">{staff.bio}</p>}
          <div className="space-y-2">
            {staff.contact_email && (
              <a href={`mailto:${staff.contact_email}`} className="flex items-center gap-2 text-sm text-nifes-green hover:underline">
                <Mail size={14} /> {staff.contact_email}
              </a>
            )}
            {staff.contact_phone && (
              <a href={`tel:${staff.contact_phone}`} className="flex items-center gap-2 text-sm text-nifes-green hover:underline">
                <Phone size={14} /> {staff.contact_phone}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StaffSection({ staff }: { staff: Staff[] }) {
  const [emblaRef] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const featured = staff.find((s) => s.is_featured);
  const others = staff.filter((s) => !s.is_featured);

  return (
    <section id="staff" className="py-16 bg-nifes-warm-gray">
      <div className="section-container">
        <p className="section-label">Leadership</p>
        <h2 className="section-title mb-8">Meet the Staff</h2>

        {/* Featured: Training Secretary */}
        {featured && (
          <div className="card p-5 sm:p-6 mb-8 bg-nifes-green text-white rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 overflow-hidden flex-shrink-0">
                {featured.photo_url ? (
                  <Image src={featured.photo_url} alt={featured.name} width={80} height={80} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">👤</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-nifes-gold text-xs font-bold uppercase tracking-widest mb-1">Message from the Training Secretary</p>
                <h3 className="font-display font-bold text-xl mb-2">{featured.name}</h3>
                {featured.featured_message && (
                  <p className="text-white/85 text-sm leading-relaxed italic">
                    &ldquo;{featured.featured_message}&rdquo;
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Staff carousel */}
        {others.length > 0 && (
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 pb-2">
              {others.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStaff(s)}
                  className="flex-none w-[200px] card p-4 text-left hover:border-nifes-green/40 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-nifes-warm-gray overflow-hidden mb-3">
                    {s.photo_url ? (
                      <Image src={s.photo_url} alt={s.name} width={56} height={56} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">👤</div>
                    )}
                  </div>
                  <p className="font-semibold text-nifes-text text-sm group-hover:text-nifes-green transition-colors">{s.name}</p>
                  <p className="text-nifes-gold text-xs font-semibold mt-0.5">{s.role}</p>
                  {s.bio && <p className="text-nifes-muted text-xs mt-2 line-clamp-2">{s.bio}</p>}
                  <span className="text-xs text-nifes-green font-semibold mt-2 inline-block">View profile →</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {staff.length === 0 && (
          <p className="text-center text-nifes-muted py-8">Staff profiles coming soon.</p>
        )}
      </div>

      {selectedStaff && <StaffModal staff={selectedStaff} onClose={() => setSelectedStaff(null)} />}
    </section>
  );
}
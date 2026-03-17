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


// ============================================================
// FILE: frontend/components/sections/SchoolsDirectory.tsx
// ============================================================

interface School {
  id: string;
  school_name: string;
  meeting_day?: string;
  venue?: string;
  fellowship_email?: string;
  leader_name?: string;
  leader_contact?: string;
  google_maps_url?: string;
}

export default function SchoolsDirectory({ schools }: { schools: School[] }) {
  return (
    <section id="schools" className="py-16 bg-nifes-warm-gray">
      <div className="section-container">
        <p className="section-label">Directory</p>
        <h2 className="section-title mb-2">Fellowship Schools</h2>
        <p className="text-nifes-muted text-sm mb-8">
          NIFES fellowships across universities and polytechnics in the Awka Zone.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {schools.length > 0 ? schools.map((school) => (
            <div key={school.id} className="card p-4 sm:p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-nifes-green rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0">🏫</div>
                <div>
                  <h3 className="font-display font-bold text-nifes-green text-sm leading-tight">{school.school_name}</h3>
                  {school.meeting_day && (
                    <p className="text-xs text-nifes-gold font-semibold mt-0.5">📅 {school.meeting_day}</p>
                  )}
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-nifes-muted mb-4">
                {school.venue && <p>📍 {school.venue}</p>}
                {school.leader_name && <p>👤 Leader: <span className="text-nifes-text font-medium">{school.leader_name}</span></p>}
                {school.leader_contact && <p>📞 {school.leader_contact}</p>}
                {school.fellowship_email && (
                  <a href={`mailto:${school.fellowship_email}`} className="text-nifes-green hover:underline block">
                    ✉️ {school.fellowship_email}
                  </a>
                )}
              </div>
              {school.google_maps_url && (
                <a
                  href={school.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs w-full justify-center py-2"
                >
                  🗺️ View on Map
                </a>
              )}
            </div>
          )) : (
            <div className="sm:col-span-2 lg:col-span-3 text-center py-10 text-nifes-muted">
              Schools directory coming soon.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


// ============================================================
// FILE: frontend/components/sections/GallerySection.tsx
// PURPOSE: Shows album titles only on homepage.
//          Click opens popup slideshow — images load on demand
//          (important for mobile data saving).
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { getGalleryImages } from '@/lib/api';

interface Album {
  id: string;
  title: string;
  description?: string;
  cover_image_url?: string;
}

function GallerySlideshow({ album, onClose }: { album: Album; onClose: () => void }) {
  const [images, setImages] = useState<Array<{ id: string; image_url: string; caption?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    getGalleryImages(album.id)
      .then(setImages)
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, [album.id]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="bg-black rounded-2xl max-w-2xl w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="font-display font-bold text-white">{album.title}</h3>
          <button onClick={onClose} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Slideshow */}
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-nifes-gold border-t-transparent rounded-full" />
          </div>
        ) : images.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-white/50">
            <div className="text-center">
              <ImageIcon size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No images in this album yet.</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {images.map((img) => (
                  <div key={img.id} className="flex-none w-full aspect-video relative">
                    <Image
                      src={img.image_url}
                      alt={img.caption || album.title}
                      fill
                      className="object-cover"
                    />
                    {img.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <p className="text-white text-xs">{img.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {images.length > 1 && (
              <>
                <button onClick={() => emblaApi?.scrollPrev()} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={() => emblaApi?.scrollNext()} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center">
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>
        )}

        <div className="p-3 text-center">
          <p className="text-white/40 text-xs">{images.length} photo{images.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
    </div>
  );
}

export default function GallerySection({ albums }: { albums: Album[] }) {
  const [emblaRef] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  const defaultAlbums: Album[] = [
    { id: '1', title: 'Alumni Reunion' },
    { id: '2', title: 'Leadership Training Conference' },
    { id: '3', title: 'National Missions Conference' },
    { id: '4', title: 'Zonal Congress' },
    { id: '5', title: 'Fellowship Activities' },
  ];

  const displayAlbums = albums.length > 0 ? albums : defaultAlbums;

  return (
    <section id="gallery" className="py-16 bg-nifes-green">
      <div className="section-container">
        <p className="section-label" style={{ color: 'rgba(255,255,255,0.6)' }}>Photos</p>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">Gallery</h2>
        <p className="text-white/70 text-sm mb-8">Click any album to view photos from that event.</p>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 pb-2">
            {displayAlbums.map((album) => (
              <button
                key={album.id}
                onClick={() => setSelectedAlbum(album)}
                className="flex-none w-[200px] sm:w-[220px] bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl p-5 text-left transition-all group"
              >
                <div className="w-10 h-10 bg-nifes-gold rounded-xl flex items-center justify-center text-nifes-green text-xl mb-3">
                  📸
                </div>
                <p className="font-semibold text-white text-sm leading-snug mb-1">{album.title}</p>
                {album.description && <p className="text-white/55 text-xs line-clamp-2">{album.description}</p>}
                <span className="text-nifes-gold text-xs font-semibold mt-3 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Photos <ChevronRight size={12} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedAlbum && <GallerySlideshow album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />}
    </section>
  );
}


// ============================================================
// FILE: frontend/components/sections/ResourcesSection.tsx
// PURPOSE: Categories linking to Google Drive.
//          Anchor Devotional shows today's date automatically.
// ============================================================

import { format } from 'date-fns';

interface Resource {
  id: string;
  category: string;
  description?: string;
  drive_url: string;
  icon?: string;
  is_devotional?: boolean;
  display_order: number;
}

export default function ResourcesSection({ resources }: { resources: Resource[] }) {
  // Format today's date for Anchor Devotional: "Saturday, 7 March 2026"
  const todayFormatted = format(new Date(), 'EEEE, d MMMM yyyy');

  const defaultResources: Resource[] = [
    { id: '1', category: 'Anchor Devotional', description: 'Daily devotional for students', drive_url: '#', icon: '📖', is_devotional: true, display_order: 1 },
    { id: '2', category: 'Daily Prayer Bulletin', drive_url: '#', icon: '🙏', is_devotional: false, display_order: 2 },
    { id: '3', category: 'Bible Study Outlines', drive_url: '#', icon: '📋', is_devotional: false, display_order: 3 },
    { id: '4', category: 'Spiritual Books', drive_url: '#', icon: '📚', is_devotional: false, display_order: 4 },
    { id: '5', category: 'Sermons', drive_url: '#', icon: '🎤', is_devotional: false, display_order: 5 },
    { id: '6', category: 'Music Ministrations', drive_url: '#', icon: '🎵', is_devotional: false, display_order: 6 },
    { id: '7', category: 'Drama Presentations', drive_url: '#', icon: '🎭', is_devotional: false, display_order: 7 },
    { id: '8', category: 'Training Manuals', drive_url: '#', icon: '📝', is_devotional: false, display_order: 8 },
    { id: '9', category: 'Self-Help Books', drive_url: '#', icon: '💡', is_devotional: false, display_order: 9 },
  ];

  const displayResources = resources.length > 0 ? resources : defaultResources;
  const devotional = displayResources.find((r) => r.is_devotional);
  const others = displayResources.filter((r) => !r.is_devotional);

  return (
    <section id="resources" className="py-16 bg-white">
      <div className="section-container">
        <p className="section-label">Downloads</p>
        <h2 className="section-title mb-8">Resources</h2>

        {/* Anchor Devotional — featured card */}
        {devotional && (
          <a
            href={devotional.drive_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block card p-5 sm:p-6 mb-6 bg-gradient-to-r from-nifes-green to-nifes-green-mid text-white hover:-translate-y-0 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">{devotional.icon}</div>
              <div>
                <p className="font-display font-bold text-xl">{devotional.category} for Today</p>
                <p className="text-nifes-gold text-sm font-semibold mt-0.5">{todayFormatted}</p>
                {devotional.description && <p className="text-white/75 text-xs mt-1">{devotional.description}</p>}
                <span className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-nifes-gold">
                  Open on Google Drive →
                </span>
              </div>
            </div>
          </a>
        )}

        {/* Other resources grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {others.map((res) => (
            <a
              key={res.id}
              href={res.drive_url}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-4 text-center hover:border-nifes-green/40 group"
            >
              <div className="text-3xl mb-2">{res.icon}</div>
              <p className="font-semibold text-nifes-text text-xs leading-tight group-hover:text-nifes-green transition-colors">
                {res.category}
              </p>
              <span className="text-xs text-nifes-green font-semibold mt-2 inline-block opacity-0 group-hover:opacity-100 transition-opacity">
                Open ↗
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}


// ============================================================
// FILE: frontend/components/sections/DonateSection.tsx
// ============================================================

export default function DonateSection({ settings }: { settings: Record<string, string> }) {
  return (
    <section id="donate" className="py-16 bg-nifes-warm-gray">
      <div className="section-container">
        <div className="max-w-md mx-auto text-center">
          <p className="section-label justify-center">💛 Give</p>
          <h2 className="section-title mb-2">Support the Ministry</h2>
          <p className="text-nifes-muted text-sm mb-8">
            Your giving supports student evangelism, training, and zonal activities.
          </p>
          <div className="card p-6 space-y-4">
            <div className="space-y-3">
              {[
                { label: 'Bank Name', value: settings.bank_name || 'First Bank of Nigeria', icon: '🏦' },
                { label: 'Account Name', value: settings.account_name || 'NIFES Awka Zonal Fellowship', icon: '👤' },
                { label: 'Account Number', value: settings.account_number || '1234567890', icon: '🔢' },
                { label: 'Confirmation', value: settings.confirmation_phone || '+234 801 234 5678', icon: '📞' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-nifes-warm-gray last:border-b-0">
                  <span className="text-xs font-bold uppercase tracking-wider text-nifes-muted">{item.icon} {item.label}</span>
                  <span className="font-semibold text-nifes-text text-sm">{item.value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-nifes-muted pt-2">
              After transferring, please call the confirmation number to confirm your donation. Thank you! 🙏
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


// ============================================================
// FILE: frontend/components/sections/ContactSection.tsx
// ============================================================

import { Facebook, Instagram, Send, Mail, Phone, MapPin } from 'lucide-react';

function WhatsAppSVG() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.124 1.534 5.852L.057 23.997l6.304-1.654A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.002-1.369l-.359-.213-3.718.976.991-3.614-.234-.372A9.788 9.788 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
    </svg>
  );
}

export default function ContactSection({ settings }: { settings: Record<string, string> }) {
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="section-container">
        <p className="section-label">Get in Touch</p>
        <h2 className="section-title mb-8">Contact Us</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
          {settings.contact_email && (
            <a href={`mailto:${settings.contact_email}`} className="card p-4 flex items-center gap-3 hover:border-nifes-green/40">
              <div className="w-10 h-10 bg-nifes-green/10 rounded-xl flex items-center justify-center">
                <Mail size={18} className="text-nifes-green" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-nifes-muted">Email</p>
                <p className="text-sm font-semibold text-nifes-text">{settings.contact_email}</p>
              </div>
            </a>
          )}
          {settings.contact_phone && (
            <a href={`tel:${settings.contact_phone}`} className="card p-4 flex items-center gap-3 hover:border-nifes-green/40">
              <div className="w-10 h-10 bg-nifes-green/10 rounded-xl flex items-center justify-center">
                <Phone size={18} className="text-nifes-green" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-nifes-muted">Phone</p>
                <p className="text-sm font-semibold text-nifes-text">{settings.contact_phone}</p>
              </div>
            </a>
          )}
          {settings.office_address && (
            <div className="card p-4 flex items-center gap-3 sm:col-span-2">
              <div className="w-10 h-10 bg-nifes-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-nifes-green" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-nifes-muted">Office</p>
                <p className="text-sm font-semibold text-nifes-text">{settings.office_address}</p>
              </div>
            </div>
          )}
        </div>

        {/* Social icons — appear in contact section (and footer), NOT hero */}
        <div className="mt-8">
          <p className="text-xs font-bold uppercase tracking-wider text-nifes-muted mb-3">Follow Us</p>
          <div className="flex items-center gap-3">
            {settings.facebook_url && (
              <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer"
                className="w-11 h-11 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:opacity-80 transition-opacity">
                <Facebook size={20} />
              </a>
            )}
            {settings.whatsapp_number && (
              <a href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                className="w-11 h-11 bg-green-500 text-white rounded-xl flex items-center justify-center hover:opacity-80 transition-opacity">
                <WhatsAppSVG />
              </a>
            )}
            {settings.instagram_url && (
              <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer"
                className="w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl flex items-center justify-center hover:opacity-80 transition-opacity">
                <Instagram size={20} />
              </a>
            )}
            {settings.telegram_url && (
              <a href={settings.telegram_url} target="_blank" rel="noopener noreferrer"
                className="w-11 h-11 bg-sky-500 text-white rounded-xl flex items-center justify-center hover:opacity-80 transition-opacity">
                <Send size={20} />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

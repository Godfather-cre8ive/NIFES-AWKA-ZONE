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
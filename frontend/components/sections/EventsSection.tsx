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
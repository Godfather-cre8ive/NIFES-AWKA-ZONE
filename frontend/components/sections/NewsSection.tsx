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
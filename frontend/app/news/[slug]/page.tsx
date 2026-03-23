// ============================================================
// FILE: frontend/app/news/[slug]/page.tsx
// PURPOSE: Full news article page. Fetched server-side for SEO.
// ============================================================

import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

async function getPost(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${slug}`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.excerpt || `Read ${post.title} on NIFES Awka Zone`,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
  };
}

export default async function NewsPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Cover image */}
      {post.cover_image_url && (
        <div className="w-full h-48 sm:h-64 lg:h-80 bg-nifes-warm-gray overflow-hidden relative">
          {/* Using img tag for simplicity — can upgrade to next/image with proper domain config */}
          <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="section-container py-8 max-w-2xl">
        {/* Back link */}
        <Link href="/#news" className="inline-flex items-center gap-1.5 text-sm text-nifes-green font-semibold mb-6 hover:underline">
          <ArrowLeft size={16} /> Back to News
        </Link>

        {/* Meta */}
        <div className="mb-6">
          <p className="text-nifes-muted text-xs mb-2">
            {format(new Date(post.published_at), 'EEEE, d MMMM yyyy')} · {post.author || 'NIFES Awka Zone'}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-nifes-green leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-nifes-muted text-base mt-3 leading-relaxed">{post.excerpt}</p>
          )}
        </div>

        {/* Content — rendered as HTML (admin can use rich text editor) */}
        <div
          className="prose prose-sm max-w-none text-nifes-text leading-relaxed [&_h2]:font-display [&_h2]:text-nifes-green [&_a]:text-nifes-green"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share */}
        <div className="mt-8 pt-6 border-t border-nifes-warm-gray">
          <p className="text-xs font-bold uppercase tracking-wider text-nifes-muted mb-3">Share this post</p>
          <div className="flex gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + window?.location?.href || '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-xs py-2 px-4 bg-green-500"
            >
              WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-xs py-2 px-4 bg-blue-600"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
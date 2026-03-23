// ============================================================
// FILE: frontend/app/about/[slug]/page.tsx
// PURPOSE: Full about page (About NIFES, Vision, Mission, etc.)
// ============================================================

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

async function getAboutPage(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/about/${slug}`, {
      next: { revalidate: 3600 },  // About pages rarely change — cache for 1 hour
    });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = await getAboutPage(params.slug);
  if (!page) return { title: 'Page Not Found' };
  return {
    title: page.title,
    description: page.card_summary,
  };
}

export default async function AboutPage({ params }: { params: { slug: string } }) {
  const page = await getAboutPage(params.slug);
  if (!page) notFound();

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <div className="bg-nifes-green py-10">
        <div className="section-container max-w-2xl">
          <Link href="/#about" className="inline-flex items-center gap-1.5 text-white/60 text-sm hover:text-white mb-4">
            <ArrowLeft size={16} /> Back
          </Link>
          <div className="flex items-center gap-4">
            {page.icon && <span className="text-4xl">{page.icon}</span>}
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">{page.title}</h1>
          </div>
          <p className="text-white/70 text-base mt-2">{page.card_summary}</p>
        </div>
      </div>

      {/* Content */}
      <div className="section-container max-w-2xl py-10">
        <div
          className="prose prose-sm max-w-none text-nifes-text leading-relaxed [&_h2]:font-display [&_h2]:text-nifes-green [&_h3]:font-display [&_h3]:text-nifes-green"
          dangerouslySetInnerHTML={{ __html: page.full_content }}
        />
      </div>
    </div>
  );
}

// ============================================================
// FILE: frontend/components/layout/Navbar.tsx
// PURPOSE: Sticky top navigation. Mobile: hamburger menu.
//          Desktop: full nav links.
//          NOTE: Social icons do NOT appear in navbar per spec.
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home',       href: '#hero' },
  { label: 'About',      href: '#about' },
  { label: 'Staff',      href: '#staff' },
  { label: 'Students',   href: '#students' },
  { label: 'Schools',    href: '#schools' },
  { label: 'News',       href: '#news' },
  { label: 'Events',     href: '#events' },
  { label: 'Gallery',    href: '#gallery' },
  { label: 'Resources',  href: '#resources' },
  { label: 'Quiz',       href: '#quiz' },
  { label: 'Contact',    href: '#contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu when clicking a link
  const handleLinkClick = () => setOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="section-container">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            {/* Inline SVG cross logo */}
            <div className="w-9 h-9 bg-nifes-green rounded-xl flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M12 3v18M8 8h8" stroke="#D4A017" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M9 7c1 0 2 .5 3 1.5C13 7.5 14 7 15 7" stroke="#D4A017" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className={`font-display font-bold text-base leading-none ${scrolled ? 'text-nifes-green' : 'text-white'}`}>
                NIFES
              </p>
              <p className={`font-body text-xs leading-none mt-0.5 ${scrolled ? 'text-nifes-muted' : 'text-white/80'}`}>
                Awka Zone
              </p>
            </div>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${
                    scrolled
                      ? 'text-nifes-text hover:bg-nifes-warm-gray hover:text-nifes-green'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Admin link (subtle) + hamburger */}
          <div className="flex items-center gap-2">
            <Link
              href="/admin/login"
              className={`hidden sm:inline-flex text-xs font-semibold px-3 py-2 rounded-lg border transition-colors ${
                scrolled
                  ? 'border-nifes-green text-nifes-green hover:bg-nifes-green hover:text-white'
                  : 'border-white/40 text-white hover:border-white'
              }`}
            >
              Admin
            </Link>

            <button
              onClick={() => setOpen(!open)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                scrolled ? 'text-nifes-green hover:bg-nifes-warm-gray' : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden bg-white border-t border-nifes-warm-gray shadow-lg max-h-[80vh] overflow-y-auto">
          <ul className="section-container py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={handleLinkClick}
                  className="flex items-center text-sm font-semibold text-nifes-text hover:text-nifes-green hover:bg-nifes-warm-gray px-4 py-3 rounded-xl transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/admin/login"
                onClick={handleLinkClick}
                className="flex items-center justify-center text-sm font-semibold text-white bg-nifes-green px-4 py-3 rounded-xl"
              >
                Admin Portal
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
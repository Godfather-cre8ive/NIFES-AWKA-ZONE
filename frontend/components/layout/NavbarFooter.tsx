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


// ============================================================
// FILE: frontend/components/layout/Footer.tsx
// PURPOSE: Footer with quick links, contact, social icons.
//          Social icons appear here (NOT in hero per spec).
// ============================================================

import Link from 'next/link';
import { Facebook, Instagram, Send } from 'lucide-react'; // Send = Telegram

// WhatsApp icon (lucide doesn't have it — inline SVG)
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.124 1.534 5.852L.057 23.997l6.304-1.654A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.002-1.369l-.359-.213-3.718.976.991-3.614-.234-.372A9.788 9.788 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
    </svg>
  );
}

const QUICK_LINKS = [
  { label: 'About NIFES', href: '#about' },
  { label: 'Meet the Staff', href: '#staff' },
  { label: 'Student Corner', href: '#students' },
  { label: 'Schools Directory', href: '#schools' },
  { label: 'Testimonies', href: '#testimonies' },
  { label: 'News & Blog', href: '#news' },
  { label: 'Events', href: '#events' },
  { label: 'Resources', href: '#resources' },
  { label: 'Bible Quiz', href: '#quiz' },
  { label: 'Prayer Request', href: '#prayer' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-nifes-green text-white">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-nifes-gold rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                  <path d="M12 3v18M8 8h8" stroke="#1B4332" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="font-display font-bold text-lg leading-none">NIFES Awka Zone</p>
                <p className="text-white/70 text-xs mt-0.5">Training Students to Transform Society</p>
              </div>
            </div>
            <p className="text-sm text-white/75 leading-relaxed max-w-xs">
              The Nigeria Fellowship of Evangelical Students, Awka Zone — committed to winning, building, and sending students for Christ.
            </p>
            {/* Social icons — in footer only, NOT hero */}
            <div className="flex items-center gap-3 mt-5">
              <a href="#" aria-label="Facebook" className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-nifes-gold hover:text-nifes-green transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="WhatsApp" className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-nifes-gold hover:text-nifes-green transition-colors">
                <WhatsAppIcon />
              </a>
              <a href="#" aria-label="Instagram" className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-nifes-gold hover:text-nifes-green transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="Telegram" className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-nifes-gold hover:text-nifes-green transition-colors">
                <Send size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-nifes-gold text-sm mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {QUICK_LINKS.slice(0, 6).map(l => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-white/70 hover:text-white transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-nifes-gold text-sm mb-3">Contact Us</h4>
            <div className="space-y-2 text-sm text-white/70">
              <p>📧 nifesawkazone@gmail.com</p>
              <p>📞 +234 802 345 6789</p>
              <p>📍 Awka, Anambra State, Nigeria</p>
            </div>
            <div className="mt-4">
              <Link href="/admin/login" className="text-xs text-white/40 hover:text-white/70 transition-colors">
                Admin Portal
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="border-t border-white/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/50">
            © {year} NIFES Awka Zone. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Built with ❤️ for God&apos;s Kingdom
          </p>
        </div>
      </div>
    </footer>
  );
}

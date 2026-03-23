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
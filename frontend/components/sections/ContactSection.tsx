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
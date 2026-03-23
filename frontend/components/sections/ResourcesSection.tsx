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
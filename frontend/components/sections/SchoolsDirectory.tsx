// ============================================================
// FILE: frontend/components/sections/SchoolsDirectory.tsx
// ============================================================

interface School {
  id: string;
  school_name: string;
  meeting_day?: string;
  venue?: string;
  fellowship_email?: string;
  leader_name?: string;
  leader_contact?: string;
  google_maps_url?: string;
}

export default function SchoolsDirectory({ schools }: { schools: School[] }) {
  return (
    <section id="schools" className="py-16 bg-nifes-warm-gray">
      <div className="section-container">
        <p className="section-label">Directory</p>
        <h2 className="section-title mb-2">Fellowship Schools</h2>
        <p className="text-nifes-muted text-sm mb-8">
          NIFES fellowships across universities and polytechnics in the Awka Zone.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {schools.length > 0 ? schools.map((school) => (
            <div key={school.id} className="card p-4 sm:p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-nifes-green rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0">🏫</div>
                <div>
                  <h3 className="font-display font-bold text-nifes-green text-sm leading-tight">{school.school_name}</h3>
                  {school.meeting_day && (
                    <p className="text-xs text-nifes-gold font-semibold mt-0.5">📅 {school.meeting_day}</p>
                  )}
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-nifes-muted mb-4">
                {school.venue && <p>📍 {school.venue}</p>}
                {school.leader_name && <p>👤 Leader: <span className="text-nifes-text font-medium">{school.leader_name}</span></p>}
                {school.leader_contact && <p>📞 {school.leader_contact}</p>}
                {school.fellowship_email && (
                  <a href={`mailto:${school.fellowship_email}`} className="text-nifes-green hover:underline block">
                    ✉️ {school.fellowship_email}
                  </a>
                )}
              </div>
              {school.google_maps_url && (
                <a
                  href={school.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs w-full justify-center py-2"
                >
                  🗺️ View on Map
                </a>
              )}
            </div>
          )) : (
            <div className="sm:col-span-2 lg:col-span-3 text-center py-10 text-nifes-muted">
              Schools directory coming soon.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
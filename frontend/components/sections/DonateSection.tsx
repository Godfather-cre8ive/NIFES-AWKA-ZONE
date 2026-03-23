// ============================================================
// FILE: frontend/components/sections/DonateSection.tsx
// ============================================================

export default function DonateSection({ settings }: { settings: Record<string, string> }) {
  return (
    <section id="donate" className="py-16 bg-nifes-warm-gray">
      <div className="section-container">
        <div className="max-w-md mx-auto text-center">
          <p className="section-label justify-center">💛 Give</p>
          <h2 className="section-title mb-2">Support the Ministry</h2>
          <p className="text-nifes-muted text-sm mb-8">
            Your giving supports student evangelism, training, and zonal activities.
          </p>
          <div className="card p-6 space-y-4">
            <div className="space-y-3">
              {[
                { label: 'Bank Name', value: settings.bank_name || 'First Bank of Nigeria', icon: '🏦' },
                { label: 'Account Name', value: settings.account_name || 'NIFES Awka Zonal Fellowship', icon: '👤' },
                { label: 'Account Number', value: settings.account_number || '1234567890', icon: '🔢' },
                { label: 'Confirmation', value: settings.confirmation_phone || '+234 801 234 5678', icon: '📞' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-nifes-warm-gray last:border-b-0">
                  <span className="text-xs font-bold uppercase tracking-wider text-nifes-muted">{item.icon} {item.label}</span>
                  <span className="font-semibold text-nifes-text text-sm">{item.value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-nifes-muted pt-2">
              After transferring, please call the confirmation number to confirm your donation. Thank you! 🙏
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
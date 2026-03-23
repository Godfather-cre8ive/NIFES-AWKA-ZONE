// ============================================================
// FILE: frontend/components/sections/WordForToday.tsx
// ============================================================

interface Word {
  scripture_text: string;
  reference: string;
  reflection?: string;
}

export default function WordForToday({ word }: { word: Word | null }) {
  const text = word?.scripture_text || '"Let the word of Christ dwell in you richly"';
  const ref  = word?.reference     || 'Colossians 3:16';

  return (
    <section className="bg-nifes-green py-8 sm:py-10">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Label */}
          <div className="flex-shrink-0 bg-nifes-gold px-4 py-2 rounded-xl">
            <p className="font-display font-bold text-nifes-green text-sm whitespace-nowrap">
              📖 Word for Today
            </p>
          </div>
          {/* Scripture */}
          <div className="flex-1 min-w-0">
            <p className="font-display italic text-white text-base sm:text-lg leading-relaxed">
              {text}
            </p>
            <p className="text-nifes-gold text-sm font-semibold mt-1">— {ref}</p>
          </div>
        </div>
        {word?.reflection && (
          <p className="mt-4 text-white/70 text-sm leading-relaxed border-t border-white/15 pt-4">
            {word.reflection}
          </p>
        )}
      </div>
    </section>
  );
}
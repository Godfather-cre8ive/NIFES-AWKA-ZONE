// ============================================================
// FILE: frontend/app/page.tsx
// PURPOSE: Main homepage — assembles all section components.
//          Uses async server components for initial data fetching
//          (better SEO and mobile performance — no loading flash).
// ============================================================

import HeroSlider from '@/components/sections/HeroSlider';
import WordForToday from '@/components/sections/WordForToday';
import AboutCarousel from '@/components/sections/AboutCarousel';
import StaffSection from '@/components/sections/StaffSection';
import AlumniSection from '@/components/sections/AlumniSection';
import StudentCorner from '@/components/sections/StudentCorner';
import SchoolsDirectory from '@/components/sections/SchoolsDirectory';
import TestimonySection from '@/components/sections/TestimonySection';
import NewsSection from '@/components/sections/NewsSection';
import EventsSection from '@/components/sections/EventsSection';
import GallerySection from '@/components/sections/GallerySection';
import ResourcesSection from '@/components/sections/ResourcesSection';
import QuizSection from '@/components/sections/QuizSection';
import NewsletterForm from '@/components/sections/NewsletterForm';
import PrayerRequestForm from '@/components/sections/PrayerRequestForm';
import DonateSection from '@/components/sections/DonateSection';
import ContactSection from '@/components/sections/ContactSection';

// Server-side data fetch — cached and revalidated every 60s
// This means faster first load for mobile users
async function fetchData(endpoint: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, {
      next: { revalidate: 60 },  // ISR: refresh data every 60 seconds
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;  // Graceful fallback — section shows placeholder
  }
}

export default async function HomePage() {
  // Fetch all data in parallel for maximum speed
  const [hero, word, settings, about, staff, students, schools,
         testimonies, news, events, albums, resources, quiz, nacf] = await Promise.all([
    fetchData('hero'),
    fetchData('word'),
    fetchData('settings'),
    fetchData('about'),
    fetchData('staff'),
    fetchData('students'),
    fetchData('schools'),
    fetchData('testimonies'),
    fetchData('news'),
    fetchData('events'),
    fetchData('gallery/albums'),
    fetchData('resources'),
    fetchData('quiz/current'),
    fetchData('nacf'),
  ]);

  return (
    <>
      {/* 1. Hero Slider */}
      <HeroSlider slides={hero || []} />

      {/* 2. Word for Today */}
      <WordForToday word={word} />

      {/* 3. About Carousel */}
      <AboutCarousel pages={about || []} />

      {/* 4. Staff Section */}
      <StaffSection staff={staff || []} />

      {/* 5. Alumni & NACF Corner */}
      <AlumniSection nacf={nacf} />

      {/* 6. Student Corner */}
      <StudentCorner leaders={students || []} />

      {/* 7. Fellowship Schools */}
      <SchoolsDirectory schools={schools || []} />

      {/* 8. Testimonies */}
      <TestimonySection testimonies={testimonies || []} />

      {/* 9. News & Blog */}
      <NewsSection posts={news || []} />

      {/* 10. Events */}
      <EventsSection events={events || []} />

      {/* 11. Gallery */}
      <GallerySection albums={albums || []} />

      {/* 12. Resources */}
      <ResourcesSection resources={resources || []} />

      {/* 13. Weekly Bible Quiz */}
      <QuizSection initialQuiz={quiz} />

      {/* 14. Newsletter */}
      <NewsletterForm />

      {/* 15. Prayer Requests */}
      <PrayerRequestForm />

      {/* 16. Donate */}
      <DonateSection settings={settings || {}} />

      {/* 17. Contact */}
      <ContactSection settings={settings || {}} />
    </>
  );
}

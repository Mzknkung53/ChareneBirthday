import { Suspense } from 'react';
import { Navbar } from '@/components/birthday/Navbar';
import { HeroSection } from '@/components/birthday/HeroSection';
import { SpecialMessage } from '@/components/birthday/SpecialMessage';
import { WishSection } from '@/components/wishes/WishSection';
import { MemoryGallery } from '@/components/gallery/MemoryGallery';
import { Footer } from '@/components/birthday/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen pb-[env(safe-area-inset-bottom)]">
      <Navbar />
      <Suspense fallback={null}>
        <HeroSection />
      </Suspense>
      <WishSection />
      <SpecialMessage />
      <MemoryGallery />
      <Footer />
    </main>
  );
}

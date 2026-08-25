import { Navbar } from '@/components/birthday/Navbar';
import { HeroSection } from '@/components/birthday/HeroSection';
import { SakuraPetals } from '@/components/birthday/SakuraPetals';
import { SpecialMessage } from '@/components/birthday/SpecialMessage';
import { WishSection } from '@/components/wishes/WishSection';
import { MemoryGallery } from '@/components/gallery/MemoryGallery';
import { Footer } from '@/components/birthday/Footer';
import { ScrollToTopButton } from '@/components/ui/ScrollToTopButton';

export default function HomePage() {
  return (
    <>
      <SakuraPetals />
      <main className="min-h-screen pb-[env(safe-area-inset-bottom)]">
      <Navbar />
      <HeroSection />
      <WishSection />
      <SpecialMessage />
      <MemoryGallery />
      <Footer />
      <ScrollToTopButton />
      </main>
    </>
  );
}

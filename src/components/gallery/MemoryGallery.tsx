import { SectionHeading } from '@/components/ui/SectionHeading';
import { MemoryCard } from '@/components/gallery/MemoryCard';
import { MEMORIES } from '@/data/memories';

export function MemoryGallery() {
  return (
    <section id="memories" className="mx-auto mt-14 max-w-container scroll-mt-24 px-4 sm:mt-20 sm:px-8 lg:mt-28 lg:px-12">
      <SectionHeading eyebrow="Scrapbook" title="Memory Gallery" sub="A year of streams, in a handful of photos." />
      <div className="flex flex-wrap justify-center gap-4 sm:gap-7 lg:gap-9">
        {MEMORIES.map((photo) => (
          <MemoryCard key={photo.id} photo={photo} />
        ))}
      </div>
    </section>
  );
}

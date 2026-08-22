'use client';

import { useState } from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ConfettiBurst } from '@/components/birthday/ConfettiBurst';
import { WishForm } from '@/components/wishes/WishForm';

/** Wish form only — submissions are private; only Charene sees them on /charene. */
export function WishSection() {
  const [fire, setFire] = useState(0);

  return (
    <>
      <ConfettiBurst fireKey={fire} />

      <section id="write" className="mx-auto max-w-container scroll-mt-24 px-4 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Two minutes, forever kept"
          title="Write a Birthday Wish"
          sub="เขียนเป็นภาษาไทยหรืออังกฤษก็ได้ — only Charene will read it. It stays between you and her."
        />
        <WishForm onSent={() => setFire((n) => n + 1)} />
      </section>
    </>
  );
}

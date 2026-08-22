'use client';

import { useState } from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ConfettiBurst } from '@/components/birthday/ConfettiBurst';
import { WishForm } from '@/components/wishes/WishForm';
import { WishWall } from '@/components/wishes/WishWall';
import { useWishes } from '@/hooks/useWishes';

/** Owns the wish state so the form and the wall stay in step. */
export function WishSection() {
  const { wishes, state, error, reacted, reload, submit, react } = useWishes();
  const [fire, setFire] = useState(0);

  return (
    <>
      <ConfettiBurst fireKey={fire} />

      <section id="write" className="mx-auto max-w-container scroll-mt-24 px-4 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="Two minutes, forever kept"
          title="Write a Birthday Wish"
          sub="เขียนเป็นภาษาไทยหรืออังกฤษก็ได้ — write in Thai or English, both look lovely on the wall."
        />
        <WishForm onSubmit={submit} onSent={() => setFire((n) => n + 1)} />
      </section>

      <section id="wall" className="mx-auto mt-14 max-w-container scroll-mt-24 px-4 sm:mt-20 sm:px-8 lg:mt-28 lg:px-12">
        <SectionHeading
          eyebrow="From everyone"
          title="Birthday Wish Wall"
          sub={state === 'ready' ? wishes.length + ' wishes so far — tap a heart to add yours to one.' : undefined}
        />
        <WishWall wishes={wishes} state={state} error={error} reacted={reacted} onReact={react} onRetry={reload} />
      </section>
    </>
  );
}

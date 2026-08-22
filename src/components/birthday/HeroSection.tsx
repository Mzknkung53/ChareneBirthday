'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BirthdayCountdown } from '@/components/birthday/BirthdayCountdown';
import { ConfettiBurst } from '@/components/birthday/ConfettiBurst';
import { PetalField } from '@/components/birthday/PetalField';
import { SITE } from '@/data/site';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function HeroSection() {
  const reduced = usePrefersReducedMotion();
  const [fire, setFire] = useState(0);
  const [isBirthday, setIsBirthday] = useState(false);

  // Confetti when a visitor opens the page on the birthday itself.
  useEffect(() => {
    if (Date.now() < new Date(SITE.birthdayISO).getTime()) return;
    setIsBirthday(true);
    const id = window.setTimeout(() => setFire((n) => n + 1), 700);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section id="top" className="relative overflow-hidden px-4 pb-12 pt-7 sm:px-8 sm:pb-20 sm:pt-14 lg:px-12 lg:pb-24 lg:pt-16">
      <ConfettiBurst fireKey={fire} />
      <PetalField density={13} />

      <div className="relative mx-auto grid max-w-container items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 0.84, 0.44, 1] }}
          className="order-2 grid justify-items-start gap-4 sm:gap-6 lg:order-1"
        >
          <Badge tone="blue" icon="✨" uppercase>
            {SITE.birthdayLabel}
          </Badge>
          <h1 className="text-pretty font-display text-[clamp(38px,8.5vw,74px)] font-semibold leading-[1.12] text-ink-900">
            Happy Birthday
            <br />
            Charene <span className="text-rose-500">♡</span>
          </h1>
          <p className="max-w-[44ch] text-pretty text-[clamp(16px,2vw,18px)] leading-[1.85]">
            วันนี้เป็นวันของเธอ — a whole page of wishes from everyone who found you on stream. Leave yours below, it stays here
            forever.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="#write" size="lg" iconRight="♡">
              Write a Birthday Wish
            </Button>
            <Button href="#wall" size="lg" variant="secondary" iconRight="✨">
              View Wishes
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 0.84, 0.44, 1] }}
          className="relative order-1 mx-auto aspect-square w-[min(360px,78vw)] lg:order-2"
        >
          <div className="absolute -inset-[10%] rounded-full bg-[radial-gradient(closest-side,rgba(255,159,195,.5),rgba(255,159,195,0))]" />
          <div className="absolute -inset-[6%] translate-x-[8%] translate-y-[10%] rounded-full bg-[radial-gradient(closest-side,rgba(168,216,244,.38),rgba(168,216,244,0))]" />
          {/* Replace this file with the real artwork, same path. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/Charene-Profile.png"
            alt="Charene9's profile artwork — a pastel portrait among falling sakura"
            className="relative h-full w-full rounded-full border-[7px] border-white/90 object-cover object-top shadow-lift"
          />
          <span className="absolute -right-1 bottom-[6%] rounded-full border border-pink-200 bg-white/90 px-4 py-2 font-display text-sm text-rose-600 shadow-soft backdrop-blur">
            {SITE.handle}
          </span>
        </motion.div>
      </div>

      <div className="glass relative mx-auto mt-10 grid max-w-[640px] justify-items-center gap-4 rounded-feature bg-gradient-to-br from-white/74 to-pink-300/25 p-5 text-center shadow-card sm:mt-16 sm:p-8">
        <span className="eyebrow">{isBirthday ? 'Her day is here' : 'Counting down to her day'}</span>
        <BirthdayCountdown targetISO={SITE.birthdayISO} />
      </div>
    </section>
  );
}

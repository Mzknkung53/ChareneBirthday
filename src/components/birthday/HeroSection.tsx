'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BirthdayCelebration } from '@/components/birthday/BirthdayCelebration';
import { BirthdayCountdown } from '@/components/birthday/BirthdayCountdown';
import { PetalField } from '@/components/birthday/PetalField';
import { SITE } from '@/data/site';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

import { BIRTHDAY_EFFECTS_MS } from '@/utils/birthdayEffects';

export function HeroSection() {
  const reduced = usePrefersReducedMotion();
  const celebratedRef = useRef(false);
  const effectsTimerRef = useRef<number | null>(null);

  const [fireKey, setFireKey] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const [showEffects, setShowEffects] = useState(false);

  const runEffects = useCallback(() => {
    if (effectsTimerRef.current) window.clearTimeout(effectsTimerRef.current);

    setShowEffects(true);
    setFireKey((key) => key + 1);

    effectsTimerRef.current = window.setTimeout(() => {
      setShowEffects(false);
    }, BIRTHDAY_EFFECTS_MS);
  }, []);

  const celebrate = useCallback(
    (replay = false) => {
      if (celebratedRef.current && !replay) return;
      if (!replay) celebratedRef.current = true;

      setCelebrating(true);
      runEffects();
    },
    [runEffects],
  );

  useEffect(() => {
    return () => {
      if (effectsTimerRef.current) window.clearTimeout(effectsTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (Date.now() >= new Date(SITE.birthdayISO).getTime()) {
      const id = window.setTimeout(celebrate, 700);
      return () => window.clearTimeout(id);
    }
  }, [celebrate]);

  const replayFireworks = () => {
    setCelebrating(true);
    runEffects();
  };

  return (
    <>
      <BirthdayCelebration showEffects={showEffects} fireKey={fireKey} />

      <section id="top" className="relative overflow-hidden px-4 pb-12 pt-7 sm:px-8 sm:pb-20 sm:pt-14 lg:px-12 lg:pb-24 lg:pt-16">
        <PetalField density={13} />

        <div className="relative mx-auto grid max-w-container items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={reduced || celebrating ? false : { opacity: 0, y: 18 }}
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
              <Button href="#message" size="lg" variant="secondary" iconRight="✨">
                Special message
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={reduced || celebrating ? false : { opacity: 0, scale: 0.94 }}
            animate={
              celebrating && !reduced
                ? { opacity: 1, scale: [1, 1.03, 1], rotate: [0, -1, 1, 0] }
                : { opacity: 1, scale: 1 }
            }
            transition={
              celebrating && !reduced
                ? { duration: 1.2, ease: [0.16, 0.84, 0.44, 1] }
                : { duration: 0.6, ease: [0.16, 0.84, 0.44, 1] }
            }
            className="relative order-1 mx-auto aspect-square w-[min(360px,78vw)] lg:order-2"
          >
            <div className="absolute -inset-[10%] rounded-full bg-[radial-gradient(closest-side,rgba(255,159,195,.5),rgba(255,159,195,0))]" />
            <div className="absolute -inset-[6%] translate-x-[8%] translate-y-[10%] rounded-full bg-[radial-gradient(closest-side,rgba(168,216,244,.38),rgba(168,216,244,0))]" />
            {celebrating ? (
              <div
                aria-hidden="true"
                className="absolute -inset-[4%] animate-glow-pulse rounded-full bg-[radial-gradient(closest-side,rgba(242,115,159,.28),rgba(242,115,159,0))]"
              />
            ) : null}
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

        <div
          className={`glass relative mx-auto mt-10 grid max-w-[640px] justify-items-center gap-4 rounded-feature p-5 text-center shadow-card sm:mt-16 sm:p-8 ${
            celebrating ? 'bg-gradient-to-br from-white/80 via-pink-100/70 to-sky-100/60' : 'bg-gradient-to-br from-white/74 to-pink-300/25'
          }`}
        >
          <span className="eyebrow">{celebrating ? 'Her day is here 🎆' : 'Counting down to her day'}</span>
          <BirthdayCountdown targetISO={SITE.birthdayISO} celebrating={celebrating} onReached={celebrate} />
          {celebrating ? (
            <button
              type="button"
              onClick={replayFireworks}
              className="font-ui text-xs text-ink-300 underline-offset-2 transition-colors hover:text-rose-600 hover:underline"
            >
              Replay fireworks 🎆
            </button>
          ) : null}
        </div>
      </section>
    </>
  );
}

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/utils/cn';

interface WishSentSuccessProps {
  open: boolean;
  onDismiss?: () => void;
  durationMs?: number;
}

const smoothOut = [0.22, 1, 0.36, 1] as const;

const textContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.55 },
  },
};

const textItem = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: smoothOut },
  },
};

function AnimatedCheckmark({ reduced }: { reduced: boolean }) {
  if (reduced) {
    return (
      <svg viewBox="0 0 52 52" className="mx-auto h-14 w-14 text-emerald-500" aria-hidden="true">
        <circle cx="26" cy="26" r="23" fill="currentColor" fillOpacity={0.12} />
        <circle cx="26" cy="26" r="23" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path
          d="M14.5 26.5 21.5 33.5 37.5 17.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <motion.div
      className="relative mx-auto grid h-16 w-16 place-items-center"
      initial={{ scale: 0.72, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22, mass: 0.85 }}
    >
      <motion.span
        className="absolute inset-0 rounded-full bg-emerald-400/20"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: [0.6, 1.08, 1], opacity: [0, 0.85, 0.55] }}
        transition={{ duration: 0.9, ease: smoothOut, times: [0, 0.55, 1] }}
        aria-hidden="true"
      />

      <motion.svg viewBox="0 0 52 52" className="relative h-14 w-14 text-emerald-500" aria-hidden="true">
        <motion.circle
          cx="26"
          cy="26"
          r="23"
          fill="currentColor"
          fillOpacity={0.1}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24, delay: 0.05 }}
          style={{ transformOrigin: '26px 26px' }}
        />
        <motion.circle
          cx="26"
          cy="26"
          r="23"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          initial={{ pathLength: 0, opacity: 0.4 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.65, ease: smoothOut }}
        />
        <motion.path
          d="M14.5 26.5 21.5 33.5 37.5 17.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.42, ease: smoothOut }}
        />
      </motion.svg>
    </motion.div>
  );
}

export function WishSentSuccess({ open, onDismiss, durationMs = 5200 }: WishSentSuccessProps) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!open || !onDismiss) return;
    const id = window.setTimeout(onDismiss, durationMs);
    return () => window.clearTimeout(id);
  }, [open, onDismiss, durationMs]);

  return (
    <AnimatePresence mode="wait">
      {open ? (
        <motion.div
          key="wish-sent-backdrop"
          className="fixed inset-0 z-[60] grid place-items-center p-4"
          role="status"
          aria-live="polite"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.45, ease: smoothOut }}
        >
          <motion.div
            className="absolute inset-0 bg-white/35 backdrop-blur-md"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.55, ease: smoothOut }}
            aria-hidden="true"
          />

          <motion.div
            className={cn(
              'relative grid max-w-[min(100%,320px)] gap-4 rounded-feature border border-emerald-200/70',
              'bg-white/95 px-8 py-7 text-center shadow-[0_20px_50px_rgba(16,185,129,0.12)] backdrop-blur-sm',
            )}
            initial={reduced ? false : { opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, scale: 0.96, y: -10 }}
            transition={
              reduced
                ? { duration: 0 }
                : {
                    type: 'spring',
                    stiffness: 240,
                    damping: 26,
                    mass: 0.9,
                  }
            }
          >
            <AnimatedCheckmark reduced={reduced} />

            {reduced ? (
              <div className="grid gap-1">
                <p className="font-ui text-lg font-semibold text-ink-900">ส่งเสร็จแล้ว!</p>
                <p className="text-sm text-ink-300">Your wish was sent ♡ Charene will read it soon.</p>
              </div>
            ) : (
              <motion.div className="grid gap-1" variants={textContainer} initial="hidden" animate="visible">
                <motion.p className="font-ui text-lg font-semibold text-ink-900" variants={textItem}>
                  ส่งเสร็จแล้ว!
                </motion.p>
                <motion.p className="text-sm text-ink-300" variants={textItem}>
                  Your wish was sent ♡ Charene will read it soon.
                </motion.p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

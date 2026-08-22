'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/utils/cn';
import { smoothScrollToTop } from '@/utils/smoothScroll';

const SHOW_AFTER_PX = 320;

export function ScrollToTopButton() {
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          aria-label="Back to top"
          title="Back to top"
          onClick={() => smoothScrollToTop()}
          initial={reduced ? false : { opacity: 0, y: 18, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? undefined : { opacity: 0, y: 14, scale: 0.9 }}
          transition={{ duration: reduced ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'fixed z-[45] grid h-12 w-12 place-items-center rounded-full border border-pink-200/80',
            'bg-white/90 font-ui text-xl leading-none text-rose-600 shadow-soft backdrop-blur-sm',
            'transition-[transform,box-shadow,background-color] duration-300 ease-glide',
            'hover:scale-105 hover:border-rose-300 hover:bg-white hover:shadow-card',
            'active:scale-[0.96]',
            'bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 sm:right-6',
          )}
        >
          <span aria-hidden="true">↑</span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}

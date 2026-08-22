'use client';

import { motion } from 'framer-motion';
import type { MemoryPhoto } from '@/types';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function MemoryCard({ photo }: { photo: MemoryPhoto }) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.figure
      initial={false}
      style={{ rotate: reduced ? 0 : photo.rotate }}
      whileHover={reduced ? undefined : { rotate: 0, y: -6, scale: 1.02 }}
      transition={{ duration: 0.42, ease: [0.22, 0.61, 0.36, 1] }}
      className="m-0 w-[min(224px,72vw)] rounded-field bg-white p-3 pb-0 shadow-card"
    >
      {photo.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo.src} alt={photo.alt} loading="lazy" className="block aspect-square w-full rounded-[6px] object-cover" />
      ) : (
        <div className="grad-dream grid aspect-square w-full place-items-center rounded-[6px] px-3 text-center text-xs text-rose-600">
          {photo.alt}
        </div>
      )}
      <figcaption className="py-3 text-center font-display text-sm text-ink-700">{photo.caption}</figcaption>
    </motion.figure>
  );
}

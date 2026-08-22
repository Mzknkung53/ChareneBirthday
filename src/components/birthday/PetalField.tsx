'use client';

import { useMemo } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const GLYPHS = ['🌸', '✦', '♡', '✧', '🌷'];

interface PetalFieldProps {
  density?: number;
}

/** Ambient sakura drifting down behind the hero. Never over interactive content. */
export function PetalField({ density = 13 }: PetalFieldProps) {
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const count = mobile ? Math.min(8, density) : density;

  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.round(((i + 0.5) / count) * 100),
        glyph: GLYPHS[i % GLYPHS.length],
        delay: Math.round(Math.random() * 12000) / 1000,
        duration: 11 + Math.round(Math.random() * 10000) / 1000,
        size: 12 + Math.round(Math.random() * 12),
        opacity: 0.4 + Math.random() * 0.4,
      })),
    [count],
  );

  if (reduced) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute top-0"
          style={{
            left: p.left + '%',
            fontSize: p.size,
            opacity: p.opacity,
            animation: 'c9-petal-fall ' + p.duration + 's linear ' + p.delay + 's infinite',
          }}
        >
          {p.glyph}
        </span>
      ))}
    </div>
  );
}

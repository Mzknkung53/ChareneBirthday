'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useIsMobile } from '@/hooks/useIsMobile';

const COLORS = ['#FFBFD8', '#F2739F', '#A8D8F4', '#7FD1E6', '#C9BCEF', '#DFB964', '#FFFFFF'];

interface ConfettiBurstProps {
  /** Increment to fire. Confetti fires only on wish submit and on the birthday — never idle. */
  fireKey: number;
  count?: number;
  duration?: number;
}

export function ConfettiBurst({ fireKey, count = 90, duration = 2600 }: ConfettiBurstProps) {
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const [visible, setVisible] = useState(false);
  const pieces = useMemo(
    () =>
      Array.from({ length: mobile ? Math.round(count / 2) : count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 350,
        dur: duration * (0.7 + Math.random() * 0.6),
        size: 5 + Math.random() * 7,
        color: COLORS[i % COLORS.length],
        round: i % 3 === 0,
      })),
    [count, duration, mobile, fireKey],
  );

  useEffect(() => {
    if (fireKey === 0 || reduced) return;
    setVisible(true);
    const id = window.setTimeout(() => setVisible(false), duration + 900);
    return () => window.clearTimeout(id);
  }, [fireKey, reduced, duration]);

  if (!visible) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 block"
          style={{
            left: p.left + '%',
            width: p.size,
            height: p.size * (p.round ? 1 : 1.8),
            background: p.color,
            borderRadius: p.round ? '50%' : 2,
            animation: 'c9-confetti-fall ' + p.dur + 'ms cubic-bezier(.22,.61,.36,1) ' + p.delay + 'ms forwards',
          }}
        />
      ))}
    </div>
  );
}

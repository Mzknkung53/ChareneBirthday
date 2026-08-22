'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

export function SakuraPetals() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const petals = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 10 + Math.random() * 10,
        size: 12 + Math.random() * 10,
        driftLeft: i % 2 === 0,
      })),
    [],
  );

  if (!mounted) return null;

  return createPortal(
    <div
      data-sakura-layer
      className="pointer-events-none fixed inset-0 z-[38] overflow-hidden"
      aria-hidden="true"
    >
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="sakura-petal"
          style={{
            left: `${petal.left}%`,
            width: `${petal.size}px`,
            height: `${petal.size * (16 / 12)}px`,
            animation: `${petal.driftLeft ? 'sakura-fall-left' : 'sakura-fall-right'} ${petal.duration}s linear ${petal.delay}s infinite`,
          }}
        />
      ))}
    </div>,
    document.body,
  );
}

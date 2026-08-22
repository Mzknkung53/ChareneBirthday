'use client';

import { useLayoutEffect, useRef } from 'react';
import type { Fireworks as FireworksInstance } from 'fireworks-js';
import { BIRTHDAY_EFFECTS_MS } from '@/utils/birthdayEffects';

interface BirthdayFireworksProps {
  sessionKey: number;
  duration?: number;
}

const BASE_OPTIONS = {
  autoresize: true,
  opacity: 0.5,
  acceleration: 1.04,
  friction: 0.97,
  gravity: 1.3,
  traceLength: 4,
  traceSpeed: 8,
  intensity: 35,
  flickering: 45,
  lineStyle: 'round' as const,
  hue: { min: 300, max: 360 },
  delay: { min: 15, max: 40 },
  rocketsPoint: { min: 15, max: 85 },
  lineWidth: {
    explosion: { min: 1, max: 4 },
    trace: { min: 1, max: 2 },
  },
  brightness: { min: 55, max: 90 },
  decay: { min: 0.01, max: 0.025 },
  mouse: { click: false, move: false, max: 1 },
};

/** Pick small / medium / large burst settings for the next rockets. */
function randomBurstSize() {
  const roll = Math.random();

  if (roll < 0.4) {
    return {
      particles: 45 + Math.floor(Math.random() * 25),
      explosion: 4 + Math.floor(Math.random() * 2),
      lineWidth: { explosion: { min: 1, max: 2 }, trace: { min: 1, max: 2 } },
    };
  }

  if (roll < 0.78) {
    return {
      particles: 75 + Math.floor(Math.random() * 35),
      explosion: 6 + Math.floor(Math.random() * 2),
      lineWidth: { explosion: { min: 1.5, max: 3 }, trace: { min: 1, max: 2 } },
    };
  }

  return {
    particles: 110 + Math.floor(Math.random() * 45),
    explosion: 8 + Math.floor(Math.random() * 3),
    lineWidth: { explosion: { min: 2, max: 4.5 }, trace: { min: 1, max: 2.5 } },
  };
}

export function BirthdayFireworks({ sessionKey, duration = BIRTHDAY_EFFECTS_MS }: BirthdayFireworksProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fireworksRef = useRef<FireworksInstance | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let timer = 0;
    let raf = 0;
    let sizeTimer = 0;

    const cleanup = () => {
      window.clearTimeout(timer);
      window.clearInterval(sizeTimer);
      cancelAnimationFrame(raf);
      fireworksRef.current?.stop(true);
      fireworksRef.current = null;
      container.replaceChildren();
    };

    raf = requestAnimationFrame(() => {
      void (async () => {
        const { Fireworks } = await import('fireworks-js');
        if (disposed || !containerRef.current) return;

        container.replaceChildren();

        const fireworks = new Fireworks(container, {
          ...BASE_OPTIONS,
          ...randomBurstSize(),
          boundaries: {
            x: 50,
            y: 50,
            width: window.innerWidth,
            height: window.innerHeight,
          },
        });

        fireworksRef.current = fireworks;
        fireworks.start();

        sizeTimer = window.setInterval(() => {
          fireworks.updateOptions(randomBurstSize());
        }, 450);

        timer = window.setTimeout(() => {
          void fireworks.waitStop(true);
          fireworksRef.current = null;
        }, duration);
      })();
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [sessionKey, duration]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}

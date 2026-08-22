'use client';

import { useEffect, useState } from 'react';

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  reached: boolean;
  /** False until the first client tick, so SSR and hydration agree. */
  ready: boolean;
}

const ZERO: CountdownParts = { days: 0, hours: 0, minutes: 0, seconds: 0, reached: false, ready: false };

function parts(targetMs: number, nowMs: number): CountdownParts {
  const diff = targetMs - nowMs;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, reached: true, ready: true };
  const seconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
    reached: false,
    ready: true,
  };
}

export function useCountdown(targetISO: string): CountdownParts {
  const [state, setState] = useState<CountdownParts>(ZERO);

  useEffect(() => {
    const target = new Date(targetISO).getTime();
    const tick = () => setState(parts(target, Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetISO]);

  return state;
}

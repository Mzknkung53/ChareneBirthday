'use client';

import { useEffect, useRef } from 'react';
import { useCountdown } from '@/hooks/useCountdown';
import { pad2 } from '@/utils/format';

interface BirthdayCountdownProps {
  targetISO: string;
  celebrating?: boolean;
  onReached?: () => void;
}

function Tile({ value, label }: { value: string; label: string }) {
  return (
    <div className="grid min-w-0 justify-items-center gap-1 rounded-field border border-white/70 bg-white/70 px-2 py-3 sm:px-4">
      <span className="tabular font-serif text-[clamp(26px,7vw,44px)] leading-none text-ink-900">{value}</span>
      <span className="text-[10px] uppercase tracking-[0.14em] text-ink-300 sm:text-[11px]">{label}</span>
    </div>
  );
}

export function BirthdayCountdown({ targetISO, celebrating, onReached }: BirthdayCountdownProps) {
  const { days, hours, minutes, seconds, reached, ready } = useCountdown(targetISO);
  const wasReached = useRef(false);
  const showCelebration = celebrating || reached;

  useEffect(() => {
    if (reached && !wasReached.current) {
      onReached?.();
    }
    wasReached.current = reached;
  }, [reached, onReached]);

  if (showCelebration) {
    return (
      <div className="grid gap-2">
        <p className="font-display text-[clamp(24px,5vw,38px)] font-semibold text-rose-600">
          Today is Charene&apos;s Birthday! <span aria-hidden="true">🎂</span>
        </p>
        <p className="font-ui text-sm text-ink-300">Happy birthday — leave a wish below ♡</p>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-4 gap-2 sm:gap-3" aria-live="off">
      <Tile value={ready ? String(days) : '—'} label="days" />
      <Tile value={ready ? pad2(hours) : '—'} label="hours" />
      <Tile value={ready ? pad2(minutes) : '—'} label="minutes" />
      <Tile value={ready ? pad2(seconds) : '—'} label="seconds" />
    </div>
  );
}

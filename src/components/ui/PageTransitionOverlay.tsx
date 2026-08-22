'use client';

import { cn } from '@/utils/cn';

interface PageTransitionOverlayProps {
  open: boolean;
  label?: string;
}

export function PageTransitionOverlay({ open, label = 'Loading…' }: PageTransitionOverlayProps) {
  if (!open) return null;

  return (
    <div
      className="animate-overlay-in fixed inset-0 z-[200] grid place-items-center bg-white/45 p-4 backdrop-blur-[3px]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className={cn(
          'animate-overlay-card-in grid min-w-[220px] gap-3 rounded-feature border border-pink-200/80',
          'bg-white/95 px-8 py-6 text-center shadow-card backdrop-blur-sm',
        )}
      >
        <span className="animate-twinkle text-2xl leading-none" aria-hidden="true">
          ✧
        </span>
        <p className="font-ui text-sm text-ink-300">{label}</p>
      </div>
    </div>
  );
}

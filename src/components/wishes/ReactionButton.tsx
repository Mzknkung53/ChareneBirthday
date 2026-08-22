'use client';

import { cn } from '@/utils/cn';
import type { ReactionEmoji } from '@/types';

interface ReactionButtonProps {
  emoji: ReactionEmoji;
  count?: number;
  active?: boolean;
  onClick: () => void;
}

export function ReactionButton({ emoji, count = 0, active, onClick }: ReactionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={'React with ' + emoji + (count ? ', ' + count + ' so far' : '')}
      className={cn(
        'inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-2.5 text-sm',
        'transition-transform duration-200 ease-[cubic-bezier(.34,1.56,.64,1)] active:scale-95',
        active ? 'border-rose-500 bg-pink-100 text-rose-700' : 'border-pink-200 bg-white/80 text-ink-300 hover:-translate-y-0.5',
      )}
    >
      <span aria-hidden="true">{emoji}</span>
      {count > 0 ? <span className="tabular text-xs">{count}</span> : null}
    </button>
  );
}

'use client';

import { WishCard } from '@/components/wishes/WishCard';
import { Button } from '@/components/ui/Button';
import type { BirthdayWish, LoadState, ReactionEmoji } from '@/types';

interface WishWallProps {
  wishes: BirthdayWish[];
  state: LoadState;
  error: string | null;
  reacted: Record<string, ReactionEmoji[]>;
  onReact: (wishId: string, emoji: ReactionEmoji) => void;
  onRetry: () => void;
}

function Skeleton() {
  return (
    <div className="grid gap-3 rounded-card border border-pink-200/60 bg-white/60 p-5">
      <div className="h-4 w-24 rounded-full bg-pink-100" />
      <div className="h-3 w-full rounded-full bg-pink-100/80" />
      <div className="h-3 w-5/6 rounded-full bg-pink-100/80" />
      <div className="h-3 w-2/3 rounded-full bg-pink-100/80" />
    </div>
  );
}

export function WishWall({ wishes, state, error, reacted, onReact, onRetry }: WishWallProps) {
  if (state === 'loading' || state === 'idle') {
    return (
      <div className="grid animate-pulse grid-cols-[repeat(auto-fill,minmax(min(100%,282px),1fr))] gap-4 sm:gap-6">
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="glass grid justify-items-center gap-4 rounded-feature p-8 text-center">
        <p className="text-ink-500">{error ?? 'The wall could not load just now.'}</p>
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      </div>
    );
  }

  if (wishes.length === 0) {
    return (
      <div className="glass grid justify-items-center gap-2 rounded-feature p-10 text-center">
        <span aria-hidden="true" className="text-2xl">🌸</span>
        <p className="font-display text-lg text-ink-900">No wishes yet</p>
        <p className="text-sm text-ink-300">Be the first — the wall fills up fast.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,282px),1fr))] items-start gap-4 sm:gap-6">
      {wishes.map((wish, i) => (
        <WishCard
          key={wish.id}
          wish={wish}
          index={i}
          activeReactions={reacted[wish.id] ?? []}
          onReact={(emoji) => onReact(wish.id, emoji)}
        />
      ))}
    </div>
  );
}

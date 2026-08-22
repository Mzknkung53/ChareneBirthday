'use client';

import { motion } from 'framer-motion';
import { WishMedia } from '@/components/wishes/WishMedia';
import type { BirthdayWish } from '@/types';
import { cn } from '@/utils/cn';
import { relativeTime, tintFor } from '@/utils/format';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface WishCardProps {
  wish: BirthdayWish;
  index?: number;
  preview?: boolean;
  onHide?: (id: string, hidden: boolean) => void;
}

export function WishCard({ wish, index = 0, preview, onHide }: WishCardProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.article
      initial={reduced || preview ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, delay: Math.min(index * 0.07, 0.5), ease: [0.16, 0.84, 0.44, 1] }}
      whileHover={reduced ? undefined : { y: -6 }}
      className={cn(
        'grid min-w-0 gap-3 rounded-card border border-pink-200/70 p-5 shadow-soft',
        'transition-shadow duration-200 hover:shadow-lift',
        wish.isHidden && !preview ? 'opacity-55' : '',
        tintFor(index),
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="grid min-w-0 gap-0.5">
          <span className="truncate font-display text-[17px] font-medium text-ink-900">{wish.displayName}</span>
          {wish.handle ? <span className="truncate text-xs text-ink-300">@{wish.handle}</span> : null}
        </div>
        {wish.sticker ? (
          <span aria-hidden="true" className="text-xl">
            {wish.sticker}
          </span>
        ) : null}
      </header>

      {wish.mediaUrl && wish.mediaType ? (
        <WishMedia
          url={wish.mediaUrl}
          mediaType={wish.mediaType}
          alt={(wish.mediaType === 'video' ? 'Video from ' : 'Photo from ') + wish.displayName}
        />
      ) : null}

      <p className="whitespace-pre-line text-pretty text-[15px] leading-[1.8] text-ink-700">{wish.message}</p>

      <footer className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs lowercase text-ink-300">{preview ? 'just now' : relativeTime(wish.createdAt)}</span>
        {onHide && !preview ? (
          <button
            type="button"
            onClick={() => onHide(wish.id, !wish.isHidden)}
            className="min-h-[44px] rounded-full px-3 text-sm text-ink-300 hover:bg-pink-100/70 hover:text-rose-600"
          >
            {wish.isHidden ? 'Unhide' : 'Hide'}
          </button>
        ) : null}
      </footer>
    </motion.article>
  );
}

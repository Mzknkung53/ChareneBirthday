'use client';

import { motion } from 'framer-motion';
import { BlurredWishBody } from '@/components/wishes/BlurredWishBody';
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
  const blurred = Boolean(wish.hideFromLive);

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
      <header className="grid gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="grid min-w-0 gap-0.5">
            <span className="truncate font-display text-[17px] font-medium text-ink-900">{wish.displayName}</span>
            {wish.handle ? <span className="truncate text-xs text-ink-300">@{wish.handle}</span> : null}
          </div>
          {wish.sticker ? (
            <span aria-hidden="true" className="text-xl">
              {wish.sticker}
            </span>
          ) : null}
        </div>
        {!preview ? (
          <div className="flex flex-wrap gap-1.5">
            <span
              className={cn(
                'rounded-full px-2.5 py-1 text-[11px] font-medium',
                blurred ? 'bg-lavender-200/60 text-[#8A73C8]' : 'bg-sky-200/50 text-[#3C8FB0]',
              )}
            >
              {blurred ? '🌙 Blurred — tap to read' : '✨ OK for live'}
            </span>
            {wish.isHidden ? (
              <span className="rounded-full bg-pink-100 px-2.5 py-1 text-[11px] font-medium text-ink-300">Archived</span>
            ) : null}
          </div>
        ) : blurred ? (
          <span className="w-fit rounded-full bg-lavender-200/60 px-2.5 py-1 text-[11px] font-medium text-[#8A73C8]">
            🌙 Blurred until tapped
          </span>
        ) : (
          <span className="w-fit rounded-full bg-sky-200/50 px-2.5 py-1 text-[11px] font-medium text-[#3C8FB0]">
            ✨ OK for live
          </span>
        )}
      </header>

      <BlurredWishBody
        message={wish.message}
        mediaUrl={wish.mediaUrl}
        mediaType={wish.mediaType}
        displayName={wish.displayName}
        blurred={blurred}
        demo={preview}
      />

      <footer className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs lowercase text-ink-300">{preview ? 'just now' : relativeTime(wish.createdAt)}</span>
        {onHide && !preview ? (
          <button
            type="button"
            onClick={() => onHide(wish.id, !wish.isHidden)}
            className="min-h-[44px] rounded-full px-3 text-sm text-ink-300 hover:bg-pink-100/70 hover:text-rose-600"
          >
            {wish.isHidden ? 'Unarchive' : 'Archive'}
          </button>
        ) : null}
      </footer>
    </motion.article>
  );
}

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
  onToggleHideFromLive?: (id: string, hideFromLive: boolean) => void;
  onDelete?: (id: string) => void;
}

export function WishCard({ wish, index = 0, preview, onHide, onToggleHideFromLive, onDelete }: WishCardProps) {
  const reduced = usePrefersReducedMotion();
  const hideFromLive = Boolean(wish.hideFromLive);

  return (
    <motion.article
      initial={reduced || preview ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, delay: Math.min(index * 0.07, 0.5), ease: [0.16, 0.84, 0.44, 1] }}
      whileHover={reduced ? undefined : { y: -6 }}
      className={cn(
        'flex h-full min-w-0 flex-col gap-3 rounded-card border border-pink-200/70 p-5 shadow-soft',
        'transition-shadow duration-200 hover:shadow-lift',
        wish.isHidden && !preview ? 'opacity-55' : '',
        tintFor(index),
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="grid min-w-0 gap-0.5">
          <span className="truncate font-ui text-[15px] font-semibold text-ink-900">{wish.displayName}</span>
          {wish.handle ? <span className="truncate font-ui text-xs text-ink-300">@{wish.handle}</span> : null}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {wish.isHidden && !preview ? (
            <span className="rounded-full bg-pink-100 px-2.5 py-1 font-ui text-[11px] font-medium text-ink-300">Archived</span>
          ) : null}
          {wish.sticker ? (
            <span aria-hidden="true" className="text-xl leading-none">
              {wish.sticker}
            </span>
          ) : null}
        </div>
      </header>

      <BlurredWishBody
        message={wish.message}
        mediaUrl={wish.mediaUrl}
        mediaType={wish.mediaType}
        displayName={wish.displayName}
        hideFromLive={hideFromLive}
        demo={preview}
        onToggleHideFromLive={
          !preview && onToggleHideFromLive ? (hidden) => onToggleHideFromLive(wish.id, hidden) : undefined
        }
      />

      <footer className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-pink-100/80 pt-3">
        <span className="font-ui text-xs lowercase text-ink-300">{preview ? 'just now' : relativeTime(wish.createdAt)}</span>
        {onHide && !preview ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onHide(wish.id, !wish.isHidden)}
              className="min-h-[40px] rounded-full px-3 font-ui text-sm text-ink-300 hover:bg-pink-100/70 hover:text-rose-600"
            >
              {wish.isHidden ? 'Unarchive' : 'Archive'}
            </button>
            {onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(wish.id)}
                className="min-h-[40px] rounded-full px-3 font-ui text-sm text-ink-300 hover:bg-rose-50 hover:text-rose-700"
              >
                Delete
              </button>
            ) : null}
          </div>
        ) : null}
      </footer>
    </motion.article>
  );
}

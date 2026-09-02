'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { WishMedia, WishMediaPlaceholder } from '@/components/wishes/WishMedia';
import type { WishMediaVariant } from '@/components/wishes/WishMedia';
import type { WishMediaType } from '@/types';

const badgeBase =
  'inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-full px-3 font-ui text-xs font-medium leading-none whitespace-nowrap transition-colors';

interface BlurredWishBodyProps {
  message: string;
  mediaUrl?: string;
  mediaType?: WishMediaType;
  displayName: string;
  hideFromLive: boolean;
  /** Preview on the form — tap toggles blur for demo. */
  demo?: boolean;
  /** Admin inbox — tap badge to persist blur, tap overlay to read. */
  onToggleHideFromLive?: (hidden: boolean) => void;
  mediaClassName?: string;
  /** 'card' keeps grid cards level; 'feature' lets the media keep its own shape. */
  mediaVariant?: WishMediaVariant;
  messageClassName?: string;
  /** Reader layout — skip the empty media slot when there is no attachment. */
  hideEmptyMedia?: boolean;
}

export function BlurredWishBody({
  message,
  mediaUrl,
  mediaType,
  displayName,
  hideFromLive,
  demo,
  onToggleHideFromLive,
  mediaClassName,
  mediaVariant = 'card',
  messageClassName,
  hideEmptyMedia,
}: BlurredWishBodyProps) {
  const [revealed, setRevealed] = useState(!hideFromLive);
  const hasMedia = Boolean(mediaUrl && mediaType);

  useEffect(() => {
    setRevealed(!hideFromLive);
  }, [hideFromLive]);

  const canPersistToggle = Boolean(onToggleHideFromLive);
  const locked = hideFromLive && !revealed;

  const togglePersisted = () => {
    if (canPersistToggle) {
      onToggleHideFromLive?.(!hideFromLive);
      return;
    }
    if (demo) setRevealed((open) => !open);
  };

  const badgeClass = hideFromLive
    ? 'border border-lavender-200/80 bg-lavender-200/70 text-[#7A63BC]'
    : 'border border-sky-200/80 bg-sky-100/90 text-[#3C8FB0]';

  const badgeLabel = hideFromLive ? '🌙 Blurred' : '✨ OK for live';
  const badgeHint = hideFromLive
    ? canPersistToggle
      ? 'Tap to mark OK for live'
      : demo
        ? 'Tap to preview blur'
        : undefined
    : canPersistToggle
      ? 'Tap to blur'
      : undefined;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {canPersistToggle || demo ? (
        <button
          type="button"
          onClick={togglePersisted}
          title={badgeHint}
          className={cn(badgeBase, badgeClass, 'self-start cursor-pointer hover:brightness-[0.98]')}
        >
          {badgeLabel}
        </button>
      ) : (
        <span className={cn(badgeBase, badgeClass, 'self-start')}>{badgeLabel}</span>
      )}

      <div className="relative flex min-h-0 flex-1 flex-col">
        <div
          className={cn(
            'grid gap-3 transition-[filter,opacity] duration-300',
            locked && 'pointer-events-none select-none blur-2xl opacity-25',
          )}
        >
          {hasMedia ? (
            <WishMedia
              url={mediaUrl!}
              mediaType={mediaType!}
              alt={(mediaType === 'video' ? 'Video from ' : 'Photo from ') + displayName}
              className={mediaClassName}
              variant={mediaVariant}
            />
          ) : hideEmptyMedia ? null : (
            <WishMediaPlaceholder className={mediaClassName} variant={mediaVariant} />
          )}

          <div className="min-h-[3.5rem]">
            <p
              className={cn(
                'whitespace-pre-line text-pretty font-ui text-[15px] font-normal leading-[1.75] text-ink-700',
                messageClassName,
              )}
            >
              {message}
            </p>
          </div>
        </div>

        {locked ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            aria-label="Tap to read wish"
            className="absolute inset-0 rounded-field bg-white/45 backdrop-blur-md transition-colors hover:bg-white/55"
          />
        ) : null}
      </div>
    </div>
  );
}

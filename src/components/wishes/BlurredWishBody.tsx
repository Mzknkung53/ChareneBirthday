'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { WishMedia } from '@/components/wishes/WishMedia';
import type { WishMediaType } from '@/types';

interface BlurredWishBodyProps {
  message: string;
  mediaUrl?: string;
  mediaType?: WishMediaType;
  displayName: string;
  /** When true, content starts blurred until tapped. */
  blurred: boolean;
  /** Preview on the form — always allows tap to demo the reveal. */
  demo?: boolean;
}

export function BlurredWishBody({ message, mediaUrl, mediaType, displayName, blurred, demo }: BlurredWishBodyProps) {
  const [revealed, setRevealed] = useState(!blurred);

  useEffect(() => {
    setRevealed(!blurred);
  }, [blurred, message]);

  const locked = blurred && !revealed;

  return (
    <div className="relative grid gap-3">
      <div className={cn('grid gap-3 transition-[filter] duration-300', locked && 'blur-lg select-none')}>
        {mediaUrl && mediaType ? (
          <WishMedia
            url={mediaUrl}
            mediaType={mediaType}
            alt={(mediaType === 'video' ? 'Video from ' : 'Photo from ') + displayName}
          />
        ) : null}
        <p className="whitespace-pre-line text-pretty text-[15px] leading-[1.8] text-ink-700">{message}</p>
      </div>

      {locked ? (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className={cn(
            'absolute inset-0 grid place-items-center rounded-field',
            'bg-white/35 backdrop-blur-[2px]',
            'transition-colors hover:bg-white/45',
          )}
        >
          <span className="glass rounded-full px-5 py-2.5 text-sm font-medium text-rose-600 shadow-soft">
            {demo ? 'Tap to preview reveal ♡' : 'Tap to read ♡'}
          </span>
        </button>
      ) : null}
    </div>
  );
}

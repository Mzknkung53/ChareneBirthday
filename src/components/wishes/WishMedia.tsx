import type { WishMediaType } from '@/types';
import { cn } from '@/utils/cn';

/**
 * Media never gets cropped: the picture is always contained inside its frame and a
 * blurred copy of the same picture fills whatever space is left over.
 * - `card`  — fixed height so every card in a grid stays level.
 * - `feature` — frame hugs the media, capped by the viewport (reader / focus view).
 */
export type WishMediaVariant = 'card' | 'feature';

const frameBase = 'relative w-full shrink-0 overflow-hidden rounded-field bg-ink-900/5';

const frameByVariant: Record<WishMediaVariant, string> = {
  card: 'h-48 sm:h-52',
  feature: 'grid place-items-center py-1',
};

const mediaByVariant: Record<WishMediaVariant, string> = {
  card: 'absolute inset-0 h-full w-full object-contain object-center',
  feature: 'relative block max-h-[58vh] w-auto max-w-full object-contain object-center sm:max-h-[64vh]',
};

interface WishMediaProps {
  url: string;
  mediaType: WishMediaType;
  alt: string;
  className?: string;
  variant?: WishMediaVariant;
}

export function WishMediaPlaceholder({
  className,
  variant = 'card',
}: {
  className?: string;
  variant?: WishMediaVariant;
}) {
  return <div className={cn(frameBase, frameByVariant[variant], className)} aria-hidden="true" />;
}

/** Blurred copy of the media, so letterboxed edges read as soft colour instead of grey bars. */
function MediaBackdrop({ url, mediaType }: { url: string; mediaType: WishMediaType }) {
  if (mediaType === 'video') {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-pink-100/70 via-white/40 to-lavender-200/60"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover object-center opacity-45 blur-xl"
    />
  );
}

export function WishMedia({ url, mediaType, alt, className, variant = 'card' }: WishMediaProps) {
  return (
    <div className={cn(frameBase, frameByVariant[variant], className)}>
      <MediaBackdrop url={url} mediaType={mediaType} />

      {mediaType === 'video' ? (
        <video
          src={url}
          controls
          playsInline
          preload="metadata"
          className={cn('mx-auto', mediaByVariant[variant])}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={alt} loading="lazy" className={cn('mx-auto', mediaByVariant[variant])} />
      )}
    </div>
  );
}

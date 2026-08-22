import type { WishMediaType } from '@/types';
import { cn } from '@/utils/cn';

/** Fixed media height so photos and videos occupy the same space in every card. */
export const wishMediaFrameClass =
  'relative h-44 w-full shrink-0 overflow-hidden rounded-field bg-ink-900/5';

interface WishMediaProps {
  url: string;
  mediaType: WishMediaType;
  alt: string;
  className?: string;
}

export function WishMediaPlaceholder({ className }: { className?: string }) {
  return <div className={cn(wishMediaFrameClass, className)} aria-hidden="true" />;
}

export function WishMedia({ url, mediaType, alt, className }: WishMediaProps) {
  if (mediaType === 'video') {
    return (
      <div className={cn(wishMediaFrameClass, className)}>
        <video
          src={url}
          controls
          playsInline
          preload="metadata"
          className="block h-full w-full object-cover object-center"
        />
      </div>
    );
  }

  return (
    <div className={cn(wishMediaFrameClass, className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={alt} loading="lazy" className="block h-full w-full object-cover object-center" />
    </div>
  );
}

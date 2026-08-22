import type { WishMediaType } from '@/types';

interface WishMediaProps {
  url: string;
  mediaType: WishMediaType;
  alt: string;
}

export function WishMedia({ url, mediaType, alt }: WishMediaProps) {
  if (mediaType === 'video') {
    return (
      <video
        src={url}
        controls
        playsInline
        preload="metadata"
        className="aspect-[4/3] w-full rounded-field bg-ink-900/5 object-cover"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={alt} loading="lazy" className="aspect-[4/3] w-full rounded-field object-cover" />
  );
}

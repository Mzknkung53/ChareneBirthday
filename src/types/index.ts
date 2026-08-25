export type WishMediaType = 'image' | 'video';

export interface BirthdayWish {
  id: string;
  displayName: string;
  handle?: string;
  message: string;
  sticker?: string;
  mediaUrl?: string;
  mediaType?: WishMediaType;
  isHidden?: boolean;
  hideFromLive?: boolean;
  createdAt: string;
}

/** What the wish form hands to the service layer. */
export interface WishDraft {
  displayName: string;
  handle?: string;
  message: string;
  sticker?: string;
  media?: File | null;
  /** When true, Charene can read in inbox but should not read on live stream. */
  hideFromLive?: boolean;
}

export interface MemoryPhoto {
  id: string;
  src?: string;
  caption: string;
  rotate: number;
  alt: string;
  /** CSS object-position when the square crop should favor a side. */
  objectPosition?: string;
}

export type LoadState = 'idle' | 'loading' | 'ready' | 'error';

export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

export interface UploadedWishMedia {
  url: string;
  mediaType: WishMediaType;
  storagePath?: string;
}

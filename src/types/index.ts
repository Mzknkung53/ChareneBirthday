export type WishStatus = 'pending' | 'approved' | 'rejected';

export type ReactionEmoji = '♡' | '🌸' | '🎂' | '✨';

export interface BirthdayWish {
  id: string;
  displayName: string;
  handle?: string;
  message: string;
  sticker?: string;
  imageUrl?: string;
  status: WishStatus;
  createdAt: string;
  reactions?: Partial<Record<ReactionEmoji, number>>;
}

/** What the wish form hands to the service layer. */
export interface WishDraft {
  displayName: string;
  handle?: string;
  message: string;
  sticker?: string;
  /** Local File chosen in the browser; uploaded by the uploads service. */
  image?: File | null;
}

export interface MemoryPhoto {
  id: string;
  src?: string;
  caption: string;
  rotate: number;
  alt: string;
}

export type LoadState = 'idle' | 'loading' | 'ready' | 'error';

export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

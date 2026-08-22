import type { BirthdayWish, WishMediaType } from '@/types';

export interface WishRow {
  id: string;
  display_name: string;
  handle: string | null;
  message: string;
  sticker: string | null;
  media_url: string | null;
  media_type: WishMediaType | null;
  is_hidden: boolean;
  created_at: string;
}

export function mapWishRow(row: WishRow): BirthdayWish {
  return {
    id: row.id,
    displayName: row.display_name,
    handle: row.handle ?? undefined,
    message: row.message,
    sticker: row.sticker ?? undefined,
    mediaUrl: row.media_url ?? undefined,
    mediaType: row.media_type ?? undefined,
    isHidden: row.is_hidden,
    createdAt: row.created_at,
  };
}

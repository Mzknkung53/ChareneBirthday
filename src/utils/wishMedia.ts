import type { WishMediaType } from '@/types';

export const WISH_MEDIA_BUCKET = 'wish-media';

const EXT_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
};

const TYPE_BY_EXT: Record<string, WishMediaType> = {
  jpg: 'image',
  png: 'image',
  webp: 'image',
  mp4: 'video',
  webm: 'video',
  mov: 'video',
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MEDIA_PATH_RE = /^([0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\/(\d+)\.(jpg|png|webp|mp4|webm|mov)$/i;

export function isWishId(value: string): boolean {
  return UUID_RE.test(value);
}

export function extForMime(type: string): string | null {
  return EXT_BY_TYPE[type] ?? null;
}

export function buildWishMediaPath(wishId: string, file: File): string {
  const ext = extForMime(file.type) ?? 'bin';
  return `${wishId}/${Date.now()}.${ext}`;
}

export function mediaTypeFromPath(path: string): WishMediaType | null {
  const match = path.match(MEDIA_PATH_RE);
  if (!match) return null;
  return TYPE_BY_EXT[match[3].toLowerCase()] ?? null;
}

/** Accept only wish-media/<uuid>/<timestamp>.<ext> owned by this wish. */
export function isValidWishMediaPath(path: string, wishId: string): boolean {
  if (!isWishId(wishId)) return false;
  const match = path.match(MEDIA_PATH_RE);
  if (!match) return false;
  return match[1].toLowerCase() === wishId.toLowerCase();
}

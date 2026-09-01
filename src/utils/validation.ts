import type { WishDraft, WishMediaType } from '@/types';

export const MESSAGE_MAX = 400;
export const NAME_MAX = 32;
export const ANONYMOUS_DISPLAY_NAME = 'Anonymous';

export function resolveDisplayName(raw: string): string {
  const trimmed = raw.trim();
  return trimmed || ANONYMOUS_DISPLAY_NAME;
}
export const IMAGE_MAX_BYTES = 8 * 1024 * 1024;
export const VIDEO_MAX_BYTES = 50 * 1024 * 1024;
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
export const MEDIA_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES];

export type WishErrors = Partial<Record<'displayName' | 'message' | 'media', string>>;

export function mediaKind(file: File): WishMediaType | null {
  if (IMAGE_TYPES.includes(file.type)) return 'image';
  if (VIDEO_TYPES.includes(file.type)) return 'video';
  return null;
}

/** Errors are apologetic and specific — never red-alarm shouting. */
export function validateWish(draft: WishDraft): WishErrors {
  const errors: WishErrors = {};
  const name = draft.displayName.trim();
  const message = draft.message.trim();

  if (name.length > NAME_MAX) errors.displayName = 'That name is a little long — up to ' + NAME_MAX + ' characters.';

  if (!message) errors.message = 'The card is still empty — write a line for her, in Thai or English.';
  else if (message.length > MESSAGE_MAX) errors.message = 'That message is a little long — try trimming to ' + MESSAGE_MAX + ' characters.';

  if (draft.media) {
    const kind = mediaKind(draft.media);
    if (!kind) {
      errors.media = 'That file type will not open here — JPG, PNG, WebP, MP4, WebM or MOV works.';
    } else if (kind === 'image' && draft.media.size > IMAGE_MAX_BYTES) {
      errors.media = 'That photo is over 8 MB — a smaller one will upload faster.';
    } else if (kind === 'video' && draft.media.size > VIDEO_MAX_BYTES) {
      errors.media = 'That video is over 50 MB — a shorter clip will upload faster.';
    }
  }

  return errors;
}

export function hasErrors(errors: WishErrors): boolean {
  return Object.keys(errors).length > 0;
}

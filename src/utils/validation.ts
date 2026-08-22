import type { WishDraft } from '@/types';

export const MESSAGE_MAX = 400;
export const NAME_MAX = 32;
export const IMAGE_MAX_BYTES = 8 * 1024 * 1024;
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export type WishErrors = Partial<Record<'displayName' | 'message' | 'image', string>>;

/** Errors are apologetic and specific — never red-alarm shouting. */
export function validateWish(draft: WishDraft): WishErrors {
  const errors: WishErrors = {};
  const name = draft.displayName.trim();
  const message = draft.message.trim();

  if (!name) errors.displayName = 'We need a name to put on the card — anything you like.';
  else if (name.length > NAME_MAX) errors.displayName = 'That name is a little long — up to ' + NAME_MAX + ' characters.';

  if (!message) errors.message = 'The card is still empty — write a line for her, in Thai or English.';
  else if (message.length > MESSAGE_MAX) errors.message = 'That message is a little long — try trimming to ' + MESSAGE_MAX + ' characters.';

  if (draft.image) {
    if (!IMAGE_TYPES.includes(draft.image.type)) errors.image = 'That file type will not open here — JPG, PNG or WebP works.';
    else if (draft.image.size > IMAGE_MAX_BYTES) errors.image = 'That photo is over 8 MB — a smaller one will upload faster.';
  }

  return errors;
}

export function hasErrors(errors: WishErrors): boolean {
  return Object.keys(errors).length > 0;
}

import type { ServiceResult } from '@/types';
import { IMAGE_MAX_BYTES, IMAGE_TYPES } from '@/utils/validation';
import { isSupabaseConfigured } from '@/lib/supabase/client';

/**
 * Returns a URL the wish card can render.
 * Mock behaviour: a local object URL, which lives only for this page session.
 * TODO: Replace mock implementation with Supabase Storage upload
 * (bucket: wish-media) and return the public URL.
 */
export async function uploadWishImage(file: File): Promise<ServiceResult<string>> {
  if (!IMAGE_TYPES.includes(file.type)) {
    return { data: null, error: 'That file type will not open here — JPG, PNG or WebP works.' };
  }
  if (file.size > IMAGE_MAX_BYTES) {
    return { data: null, error: 'That photo is over 8 MB — a smaller one will upload faster.' };
  }
  if (isSupabaseConfigured) {
    // TODO: supabase.storage.from('wish-media').upload(path, file)
  }
  await new Promise<void>((r) => setTimeout(r, 300));
  return { data: URL.createObjectURL(file), error: null };
}

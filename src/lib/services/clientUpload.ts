'use client';

import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import type { ServiceResult, WishMediaType } from '@/types';
import { IMAGE_MAX_BYTES, IMAGE_TYPES, VIDEO_MAX_BYTES, VIDEO_TYPES, mediaKind } from '@/utils/validation';
import { WISH_MEDIA_BUCKET, buildWishMediaPath } from '@/utils/wishMedia';

/** Browser → Supabase Storage (no file bytes through Next.js). */
export async function uploadWishMediaDirect(
  file: File,
  wishId: string,
): Promise<ServiceResult<{ storagePath: string; mediaType: WishMediaType }>> {
  const kind = mediaKind(file);
  if (!kind) {
    return { data: null, error: 'That file type will not open here — JPG, PNG, WebP, MP4, WebM or MOV works.' };
  }
  if (kind === 'image' && (!IMAGE_TYPES.includes(file.type) || file.size > IMAGE_MAX_BYTES)) {
    return { data: null, error: 'That photo is over 8 MB — a smaller one will upload faster.' };
  }
  if (kind === 'video' && (!VIDEO_TYPES.includes(file.type) || file.size > VIDEO_MAX_BYTES)) {
    return { data: null, error: 'That video is over 50 MB — a shorter clip will upload faster.' };
  }

  if (!isSupabaseConfigured) {
    return {
      data: null,
      error: 'Media upload is not configured yet — add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    };
  }

  try {
    const supabase = createClient();
    const storagePath = buildWishMediaPath(wishId, file);
    const { error } = await supabase.storage.from(WISH_MEDIA_BUCKET).upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) return { data: null, error: 'That file could not upload — try a smaller one.' };
    return { data: { storagePath, mediaType: kind }, error: null };
  } catch {
    return { data: null, error: 'That file could not upload — try a smaller one.' };
  }
}

import type { ServiceResult, UploadedWishMedia } from '@/types';
import { createAdminClient, isSupabaseAdminConfigured } from '@/lib/supabase/admin';
import { IMAGE_MAX_BYTES, IMAGE_TYPES, VIDEO_MAX_BYTES, VIDEO_TYPES, mediaKind } from '@/utils/validation';

const BUCKET = 'wish-media';

function extFor(file: File): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/quicktime': 'mov',
  };
  return map[file.type] ?? 'bin';
}

/** Upload to Supabase Storage. Returns a storage path stored in the DB. */
export async function uploadWishMedia(file: File, wishId: string): Promise<ServiceResult<UploadedWishMedia>> {
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

  const admin = createAdminClient();
  if (!isSupabaseAdminConfigured || !admin) {
    return {
      data: null,
      error: 'Media upload is not configured yet — add SUPABASE_SERVICE_ROLE_KEY to .env.local.',
    };
  }

  const storagePath = `${wishId}/${Date.now()}.${extFor(file)}`;
  // Pass the File/Blob through — avoid an extra Buffer copy of large uploads.
  const { error } = await admin.storage.from(BUCKET).upload(storagePath, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) return { data: null, error: 'That file could not upload — try a smaller one.' };

  return { data: { url: storagePath, mediaType: kind, storagePath }, error: null };
}

/** Turn a stored storage path into a temporary signed URL for admin viewing. */
export async function signedMediaUrl(storagePath: string): Promise<string | null> {
  const map = await signedMediaUrls([storagePath]);
  return map.get(storagePath) ?? null;
}

/** Sign many storage paths in one Storage API call. */
export async function signedMediaUrls(storagePaths: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const unique = [...new Set(storagePaths.filter(Boolean))];
  if (!unique.length) return map;

  const admin = createAdminClient();
  if (!admin) return map;

  const { data } = await admin.storage.from(BUCKET).createSignedUrls(unique, 60 * 60);
  for (const item of data ?? []) {
    const url = item.signedUrl ?? item.signedURL;
    if (item.path && url) map.set(item.path, url);
  }
  return map;
}

/** Remove uploaded media from storage (best-effort). */
export async function deleteWishMedia(storagePath: string): Promise<void> {
  const admin = createAdminClient();
  if (!admin) return;
  await admin.storage.from(BUCKET).remove([storagePath]);
}

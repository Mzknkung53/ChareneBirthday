import { createAdminClient } from '@/lib/supabase/admin';
import { WISH_MEDIA_BUCKET } from '@/utils/wishMedia';

/** Confirm an uploaded object exists before linking it to a wish. */
export async function wishMediaExists(storagePath: string): Promise<boolean> {
  const admin = createAdminClient();
  if (!admin) return false;
  const { data, error } = await admin.storage.from(WISH_MEDIA_BUCKET).createSignedUrl(storagePath, 60);
  return Boolean(!error && data?.signedUrl);
}

/** Sign many storage paths in one Storage API call. */
export async function signedMediaUrls(storagePaths: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const unique = [...new Set(storagePaths.filter(Boolean))];
  if (!unique.length) return map;

  const admin = createAdminClient();
  if (!admin) return map;

  const { data } = await admin.storage.from(WISH_MEDIA_BUCKET).createSignedUrls(unique, 60 * 60);
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
  await admin.storage.from(WISH_MEDIA_BUCKET).remove([storagePath]);
}

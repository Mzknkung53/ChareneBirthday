import type { BirthdayWish, ServiceResult, WishDraft } from '@/types';
import { MOCK_WISHES } from '@/data/mock-wishes';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { uploadWishImage } from '@/lib/services/uploads';

/** In-memory store standing in for the wishes table. */
let memory: BirthdayWish[] = [...MOCK_WISHES];

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Approved wishes, newest first. */
export async function listWishes(): Promise<ServiceResult<BirthdayWish[]>> {
  if (isSupabaseConfigured) {
    // TODO: Replace mock implementation with Supabase query:
    // select * from wishes where status = 'approved' order by created_at desc
  }
  await delay(420);
  const data = memory
    .filter((w) => w.status === 'approved')
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  return { data, error: null };
}

export async function createWish(draft: WishDraft): Promise<ServiceResult<BirthdayWish>> {
  if (isSupabaseConfigured) {
    // TODO: Replace mock implementation with Supabase insert + Turnstile verification
    // and rate limiting in a server action / route handler.
  }
  await delay(650);

  let imageUrl: string | undefined;
  if (draft.image) {
    const upload = await uploadWishImage(draft.image);
    if (upload.error) return { data: null, error: upload.error };
    imageUrl = upload.data ?? undefined;
  }

  const wish: BirthdayWish = {
    id: 'w-' + Date.now(),
    displayName: draft.displayName.trim(),
    handle: draft.handle?.trim() || undefined,
    message: draft.message.trim(),
    sticker: draft.sticker,
    imageUrl,
    // Moderation lands later; until then a new wish shows on the wall immediately.
    status: 'approved',
    createdAt: new Date().toISOString(),
    reactions: {},
  };
  memory = [wish, ...memory];
  return { data: wish, error: null };
}

/** TODO: admin-only, behind Supabase auth. */
export async function moderateWish(id: string, status: 'approved' | 'rejected'): Promise<ServiceResult<true>> {
  await delay(200);
  memory = memory.map((w) => (w.id === id ? { ...w, status } : w));
  return { data: true, error: null };
}

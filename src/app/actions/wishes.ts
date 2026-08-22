'use server';

import { randomUUID } from 'crypto';
import { getDb, isDatabaseConfigured } from '@/lib/db';
import { mapWishRow, type WishRow } from '@/lib/db/wishes';
import { createClient } from '@/lib/supabase/server';
import { signedMediaUrl, uploadWishMedia } from '@/lib/services/uploads';
import type { BirthdayWish, ServiceResult, WishDraft } from '@/types';
import { hasErrors, validateWish } from '@/utils/validation';

/** Public: submit a wish — stored in DB, not shown to the sender or anyone else. */
export async function submitWish(draft: WishDraft): Promise<ServiceResult<true>> {
  const errors = validateWish(draft);
  if (hasErrors(errors)) {
    const first = errors.displayName ?? errors.message ?? errors.media ?? 'Please check the form.';
    return { data: null, error: first };
  }

  if (!isDatabaseConfigured) {
    return { data: null, error: 'Database is not configured yet — add DATABASE_URL to .env.local.' };
  }

  const db = getDb();
  if (!db) return { data: null, error: 'Could not connect to the database.' };

  const wishId = randomUUID();
  let mediaPath: string | null = null;
  let mediaType: WishRow['media_type'] = null;

  if (draft.media) {
    const upload = await uploadWishMedia(draft.media, wishId);
    if (upload.error) return { data: null, error: upload.error };
    mediaPath = upload.data?.storagePath ?? null;
    mediaType = upload.data?.mediaType ?? null;
  }

  try {
    await db`
      insert into public.wishes (
        id, display_name, handle, message, sticker, media_url, media_type, hide_from_live
      ) values (
        ${wishId},
        ${draft.displayName.trim()},
        ${draft.handle?.trim() || null},
        ${draft.message.trim()},
        ${draft.sticker ?? null},
        ${mediaPath ?? null},
        ${mediaType ?? null},
        ${draft.hideFromLive ?? false}
      )
    `;
    return { data: true, error: null };
  } catch {
    return { data: null, error: 'Your wish did not send. Try once more in a moment.' };
  }
}

async function requireAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { error: 'Supabase auth is not configured.' as const, user: null };
  }
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: 'Please sign in.' as const, user: null };

    const { data: admin } = await supabase.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle();
    if (!admin) return { error: 'You do not have access to this page.' as const, user: null };

    return { error: null, user };
  } catch {
    return { error: 'Could not verify your session.' as const, user: null };
  }
}

async function withSignedMedia(wish: BirthdayWish): Promise<BirthdayWish> {
  if (!wish.mediaUrl || wish.mediaUrl.startsWith('http')) return wish;
  const url = await signedMediaUrl(wish.mediaUrl);
  return url ? { ...wish, mediaUrl: url } : wish;
}

/** Admin: list all wishes (newest first). */
export async function listWishesForAdmin(): Promise<ServiceResult<BirthdayWish[]>> {
  const gate = await requireAdmin();
  if (gate.error) return { data: null, error: gate.error };

  const db = getDb();
  if (!db) return { data: null, error: 'Database is not configured.' };

  try {
    const rows = await db<WishRow[]>`
      select id, display_name, handle, message, sticker, media_url, media_type, is_hidden, hide_from_live, created_at
      from public.wishes
      order by created_at desc
    `;
    const wishes = await Promise.all(rows.map((row) => withSignedMedia(mapWishRow(row))));
    return { data: wishes, error: null };
  } catch {
    return { data: null, error: 'Could not load wishes.' };
  }
}

/** Admin: hide or unhide a wish. */
export async function setWishHidden(id: string, hidden: boolean): Promise<ServiceResult<true>> {
  const gate = await requireAdmin();
  if (gate.error) return { data: null, error: gate.error };

  const db = getDb();
  if (!db) return { data: null, error: 'Database is not configured.' };

  try {
    await db`update public.wishes set is_hidden = ${hidden} where id = ${id}`;
    return { data: true, error: null };
  } catch {
    return { data: null, error: 'Could not update that wish.' };
  }
}

export async function signInAdmin(email: string, password: string): Promise<ServiceResult<true>> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { data: null, error: 'Supabase auth is not configured — add your anon key to .env.local.' };
  }
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { data: null, error: 'Email or password did not match.' };
  return { data: true, error: null };
}

export async function signOutAdmin(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}

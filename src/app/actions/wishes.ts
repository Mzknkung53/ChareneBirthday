'use server';

import { headers } from 'next/headers';
import { getDb, isDatabaseConfigured } from '@/lib/db';
import { mapWishRow, type WishRow } from '@/lib/db/wishes';
import { createClient } from '@/lib/supabase/server';
import { deleteWishMedia, signedMediaUrls, wishMediaExists } from '@/lib/services/uploads';
import type { BirthdayWish, ServiceResult, WishDraft, WishMediaType } from '@/types';
import { hasErrors, validateWish } from '@/utils/validation';
import { isValidWishMediaPath, isWishId, mediaTypeFromPath } from '@/utils/wishMedia';

const RATE_LIMIT_WINDOW_MINUTES = 15;
const RATE_LIMIT_MAX_PER_WINDOW = 5;
const MIN_FILL_TIME_MS = 1500;

function getClientIp(): string {
  const list = headers();
  const forwarded = list.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return list.get('x-real-ip') ?? 'unknown';
}

/** Best-effort: if wish_rate_limits isn't migrated in yet, fail open rather than block submissions. */
async function isRateLimited(db: NonNullable<ReturnType<typeof getDb>>, ip: string): Promise<boolean> {
  if (ip === 'unknown') return false;
  try {
    const rows = await db<{ count: string }[]>`
      select count(*)::text as count
      from public.wish_rate_limits
      where ip = ${ip} and created_at > now() - make_interval(mins => ${RATE_LIMIT_WINDOW_MINUTES})
    `;
    return Number(rows[0]?.count ?? 0) >= RATE_LIMIT_MAX_PER_WINDOW;
  } catch {
    return false;
  }
}

/** Best-effort: never let logging failure turn an already-saved wish into a reported failure. */
async function logSubmission(db: NonNullable<ReturnType<typeof getDb>>, ip: string): Promise<void> {
  if (ip === 'unknown') return;
  try {
    await db`insert into public.wish_rate_limits (ip) values (${ip})`;
  } catch {
    // ignore — the wish itself already saved successfully
  }
}

function draftFromFormData(formData: FormData): WishDraft {
  return {
    displayName: String(formData.get('displayName') ?? ''),
    handle: String(formData.get('handle') ?? '') || undefined,
    message: String(formData.get('message') ?? ''),
    sticker: String(formData.get('sticker') ?? '♡') || undefined,
    hideFromLive: formData.get('hideFromLive') === 'true',
    media: null,
  };
}

async function cleanupOrphanMedia(mediaPath: string | null, wishId: string) {
  if (!mediaPath || !isValidWishMediaPath(mediaPath, wishId)) return;
  await deleteWishMedia(mediaPath);
}

/** Public: submit a wish — media already uploaded from the browser when present. */
export async function submitWish(formData: FormData): Promise<ServiceResult<true>> {
  const draft = draftFromFormData(formData);
  const wishId = String(formData.get('wishId') ?? '');
  const mediaPathRaw = String(formData.get('mediaPath') ?? '').trim();
  const mediaPath = mediaPathRaw || null;
  const mediaTypeClaim = String(formData.get('mediaType') ?? '').trim() as WishMediaType | '';

  const honeypot = String(formData.get('company') ?? '').trim();
  const renderedAt = Number(formData.get('renderedAt') ?? 0);
  const tooFast = renderedAt > 0 && Date.now() - renderedAt < MIN_FILL_TIME_MS;
  if (honeypot || tooFast) {
    // Bot-shaped submission — pretend success so it doesn't get retried, without touching the database.
    await cleanupOrphanMedia(mediaPath, wishId);
    return { data: true, error: null };
  }

  const errors = validateWish(draft);
  if (hasErrors(errors)) {
    const first = errors.displayName ?? errors.message ?? errors.media ?? 'Please check the form.';
    await cleanupOrphanMedia(mediaPath, wishId);
    return { data: null, error: first };
  }

  if (!isWishId(wishId)) {
    await cleanupOrphanMedia(mediaPath, wishId);
    return { data: null, error: 'Your wish did not send. Try once more in a moment.' };
  }

  let mediaType: WishRow['media_type'] = null;

  if (mediaPath) {
    if (!isValidWishMediaPath(mediaPath, wishId)) {
      await cleanupOrphanMedia(mediaPath, wishId);
      return { data: null, error: 'That file could not upload — try a smaller one.' };
    }

    const inferred = mediaTypeFromPath(mediaPath);
    if (!inferred || (mediaTypeClaim && mediaTypeClaim !== inferred)) {
      await cleanupOrphanMedia(mediaPath, wishId);
      return { data: null, error: 'That file type will not open here — JPG, PNG, WebP, MP4, WebM or MOV works.' };
    }

    const exists = await wishMediaExists(mediaPath);
    if (!exists) {
      return { data: null, error: 'That file could not upload — try a smaller one.' };
    }

    mediaType = inferred;
  }

  if (!isDatabaseConfigured) {
    await cleanupOrphanMedia(mediaPath, wishId);
    return { data: null, error: 'Database is not configured yet — add DATABASE_URL to .env.local.' };
  }

  const db = getDb();
  if (!db) {
    await cleanupOrphanMedia(mediaPath, wishId);
    return { data: null, error: 'Could not connect to the database.' };
  }

  const ip = getClientIp();
  if (await isRateLimited(db, ip)) {
    await cleanupOrphanMedia(mediaPath, wishId);
    return { data: null, error: "You're sending wishes a little too fast — please wait a few minutes and try again." };
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
        ${mediaPath},
        ${mediaType},
        ${draft.hideFromLive ?? false}
      )
    `;
    await logSubmission(db, ip);
    return { data: true, error: null };
  } catch {
    await cleanupOrphanMedia(mediaPath, wishId);
    return { data: null, error: 'Your wish did not send. Try once more in a moment.' };
  }
}

async function requireAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { error: 'Supabase auth is not configured.' as const, user: null };
  }

  const db = getDb();
  if (!db) return { error: 'Database is not configured.' as const, user: null };

  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: 'Please sign in.' as const, user: null };

    const rows = await db<{ user_id: string }[]>`
      select user_id from public.admin_users where user_id = ${user.id} limit 1
    `;
    if (!rows.length) {
      return {
        error: `You do not have access to this page. Signed in as ${user.email ?? user.id}. Add this user to admin_users in Supabase.`,
        user: null,
      };
    }

    return { error: null, user };
  } catch {
    return { error: 'Could not verify your session.' as const, user: null };
  }
}

async function withSignedMedia(wishes: BirthdayWish[]): Promise<BirthdayWish[]> {
  const paths = wishes
    .map((wish) => wish.mediaUrl)
    .filter((path): path is string => typeof path === 'string' && !path.startsWith('http'));

  if (!paths.length) return wishes;

  const signed = await signedMediaUrls(paths);
  return wishes.map((wish) => {
    if (!wish.mediaUrl || wish.mediaUrl.startsWith('http')) return wish;
    const url = signed.get(wish.mediaUrl);
    return url ? { ...wish, mediaUrl: url } : wish;
  });
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
    const wishes = await withSignedMedia(rows.map(mapWishRow));
    return { data: wishes, error: null };
  } catch {
    return { data: null, error: 'Could not load wishes.' };
  }
}

/** Admin: blur or unblur a wish on any future live display. */
export async function setWishHideFromLive(id: string, hideFromLive: boolean): Promise<ServiceResult<true>> {
  const gate = await requireAdmin();
  if (gate.error) return { data: null, error: gate.error };

  const db = getDb();
  if (!db) return { data: null, error: 'Database is not configured.' };

  try {
    await db`update public.wishes set hide_from_live = ${hideFromLive} where id = ${id}`;
    return { data: true, error: null };
  } catch {
    return { data: null, error: 'Could not update that wish.' };
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

/** Admin: permanently delete a wish and its media. */
export async function deleteWish(id: string): Promise<ServiceResult<true>> {
  const gate = await requireAdmin();
  if (gate.error) return { data: null, error: gate.error };

  const db = getDb();
  if (!db) return { data: null, error: 'Database is not configured.' };

  try {
    const rows = await db<{ media_url: string | null }[]>`
      select media_url from public.wishes where id = ${id} limit 1
    `;
    if (!rows.length) return { data: null, error: 'That wish was not found.' };

    const mediaPath = rows[0].media_url;
    if (mediaPath && !mediaPath.startsWith('http')) {
      await deleteWishMedia(mediaPath);
    }

    await db`delete from public.wishes where id = ${id}`;
    return { data: true, error: null };
  } catch {
    return { data: null, error: 'Could not delete that wish.' };
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

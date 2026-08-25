import type { BirthdayWish } from '@/types';

const TTL_MS = 45_000;

let cached: { wishes: BirthdayWish[]; at: number } | null = null;

export function peekAdminWishesCache(): BirthdayWish[] | null {
  if (!cached) return null;
  if (Date.now() - cached.at > TTL_MS) {
    cached = null;
    return null;
  }
  return cached.wishes;
}

export function setAdminWishesCache(wishes: BirthdayWish[]) {
  cached = { wishes, at: Date.now() };
}

export function patchAdminWishesCache(updater: (wishes: BirthdayWish[]) => BirthdayWish[]) {
  if (!cached) return;
  cached = { wishes: updater(cached.wishes), at: cached.at };
}

export function clearAdminWishesCache() {
  cached = null;
}

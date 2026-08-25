'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteWish, listWishesForAdmin, setWishHidden, setWishHideFromLive } from '@/app/actions/wishes';
import {
  clearAdminWishesCache,
  patchAdminWishesCache,
  peekAdminWishesCache,
  setAdminWishesCache,
} from '@/lib/adminWishesCache';
import type { BirthdayWish, LoadState } from '@/types';

export function useAdminWishes() {
  const router = useRouter();
  const [wishes, setWishes] = useState<BirthdayWish[]>(() => peekAdminWishesCache() ?? []);
  const [state, setState] = useState<LoadState>(() => (peekAdminWishesCache() ? 'ready' : 'idle'));
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BirthdayWish | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    // Keep showing existing cards while refreshing — don't flash skeletons.
    setState((current) => (current === 'ready' || peekAdminWishesCache() ? 'ready' : 'loading'));

    const res = await listWishesForAdmin();
    if (res.error) {
      if (res.error === 'Please sign in.') {
        clearAdminWishesCache();
        router.replace('/charene');
        return;
      }
      if (res.error.startsWith('You do not have access')) {
        clearAdminWishesCache();
        setError(res.error);
        setState('error');
        return;
      }
      // Soft-fail on refresh: keep stale data if we already have it.
      if (peekAdminWishesCache()) {
        setError(null);
        setState('ready');
        return;
      }
      setError(res.error);
      setState('error');
      return;
    }

    const next = res.data ?? [];
    setAdminWishesCache(next);
    setWishes(next);
    setError(null);
    setState('ready');
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleHide = async (id: string, hidden: boolean) => {
    const patch = (list: BirthdayWish[]) => list.map((w) => (w.id === id ? { ...w, isHidden: hidden } : w));
    setWishes(patch);
    patchAdminWishesCache(patch);
    const res = await setWishHidden(id, hidden);
    if (res.error) void load();
  };

  const handleToggleHideFromLive = async (id: string, hideFromLive: boolean) => {
    const patch = (list: BirthdayWish[]) => list.map((w) => (w.id === id ? { ...w, hideFromLive } : w));
    setWishes(patch);
    patchAdminWishesCache(patch);
    const res = await setWishHideFromLive(id, hideFromLive);
    if (res.error) void load();
  };

  const handleDeleteRequest = (id: string) => {
    const wish = wishes.find((w) => w.id === id);
    if (wish) setDeleteTarget(wish);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || deleting) return;

    const id = deleteTarget.id;
    setDeleting(true);
    const patch = (list: BirthdayWish[]) => list.filter((w) => w.id !== id);
    setWishes(patch);
    patchAdminWishesCache(patch);
    setDeleteTarget(null);

    const res = await deleteWish(id);
    setDeleting(false);
    if (res.error) void load();
    return id;
  };

  return {
    wishes,
    state,
    error,
    load,
    deleteTarget,
    setDeleteTarget,
    deleting,
    handleHide,
    handleToggleHideFromLive,
    handleDeleteRequest,
    handleDeleteConfirm,
  };
}

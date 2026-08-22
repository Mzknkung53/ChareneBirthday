'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteWish, listWishesForAdmin, setWishHidden, setWishHideFromLive } from '@/app/actions/wishes';
import type { BirthdayWish, LoadState } from '@/types';

export function useAdminWishes() {
  const router = useRouter();
  const [wishes, setWishes] = useState<BirthdayWish[]>([]);
  const [state, setState] = useState<LoadState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BirthdayWish | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setState('loading');
    const res = await listWishesForAdmin();
    if (res.error) {
      if (res.error === 'Please sign in.') {
        router.replace('/charene');
        return;
      }
      if (res.error.startsWith('You do not have access')) {
        setError(res.error);
        setState('error');
        return;
      }
      setError(res.error);
      setState('error');
      return;
    }
    setWishes(res.data ?? []);
    setError(null);
    setState('ready');
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleHide = async (id: string, hidden: boolean) => {
    setWishes((list) => list.map((w) => (w.id === id ? { ...w, isHidden: hidden } : w)));
    const res = await setWishHidden(id, hidden);
    if (res.error) void load();
  };

  const handleToggleHideFromLive = async (id: string, hideFromLive: boolean) => {
    setWishes((list) => list.map((w) => (w.id === id ? { ...w, hideFromLive } : w)));
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
    setWishes((list) => list.filter((w) => w.id !== id));
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

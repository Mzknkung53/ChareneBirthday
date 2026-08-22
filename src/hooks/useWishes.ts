'use client';

import { useCallback, useEffect, useState } from 'react';
import type { BirthdayWish, LoadState, ReactionEmoji, WishDraft } from '@/types';
import { createWish, listWishes } from '@/lib/services/wishes';
import { toggleReaction } from '@/lib/services/reactions';

export function useWishes() {
  const [wishes, setWishes] = useState<BirthdayWish[]>([]);
  const [state, setState] = useState<LoadState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [reacted, setReacted] = useState<Record<string, ReactionEmoji[]>>({});

  const load = useCallback(async () => {
    setState('loading');
    const res = await listWishes();
    if (res.error || !res.data) {
      setError(res.error ?? 'The wall could not load just now.');
      setState('error');
      return;
    }
    setWishes(res.data);
    setError(null);
    setState('ready');
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const submit = useCallback(async (draft: WishDraft) => {
    const res = await createWish(draft);
    if (res.data) setWishes((list) => [res.data as BirthdayWish, ...list]);
    return res;
  }, []);

  const react = useCallback(
    (wishId: string, emoji: ReactionEmoji) => {
      const on = (reacted[wishId] ?? []).includes(emoji);
      setReacted((map) => ({
        ...map,
        [wishId]: on ? (map[wishId] ?? []).filter((e) => e !== emoji) : [...(map[wishId] ?? []), emoji],
      }));
      setWishes((list) =>
        list.map((w) => {
          if (w.id !== wishId) return w;
          const current = w.reactions?.[emoji] ?? 0;
          return { ...w, reactions: { ...w.reactions, [emoji]: Math.max(0, current + (on ? -1 : 1)) } };
        }),
      );
      void toggleReaction(wishId, emoji, !on);
    },
    [reacted],
  );

  return { wishes, state, error, reacted, reload: load, submit, react };
}

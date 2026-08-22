'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteWish, listWishesForAdmin, setWishHidden, setWishHideFromLive } from '@/app/actions/wishes';
import { Button } from '@/components/ui/Button';
import { WishCard } from '@/components/wishes/WishCard';
import { createClient } from '@/lib/supabase/client';
import type { BirthdayWish, LoadState } from '@/types';
import { cn } from '@/utils/cn';

type Filter = 'all' | 'live-ok' | 'live-hidden' | 'archived';

export function ChareneInbox() {
  const router = useRouter();
  const [wishes, setWishes] = useState<BirthdayWish[]>([]);
  const [state, setState] = useState<LoadState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

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

  const filtered = useMemo(() => {
    if (filter === 'live-ok') return wishes.filter((w) => !w.hideFromLive && !w.isHidden);
    if (filter === 'live-hidden') return wishes.filter((w) => w.hideFromLive);
    if (filter === 'archived') return wishes.filter((w) => w.isHidden);
    return wishes;
  }, [filter, wishes]);

  const stats = useMemo(
    () => ({
      total: wishes.length,
      liveOk: wishes.filter((w) => !w.hideFromLive).length,
      liveHidden: wishes.filter((w) => w.hideFromLive).length,
    }),
    [wishes],
  );

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/charene');
    router.refresh();
  };

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

  const handleDelete = async (id: string) => {
    const wish = wishes.find((w) => w.id === id);
    if (!wish) return;
    const ok = window.confirm(`Delete this wish from ${wish.displayName}? This cannot be undone.`);
    if (!ok) return;

    setWishes((list) => list.filter((w) => w.id !== id));
    const res = await deleteWish(id);
    if (res.error) void load();
  };

  const tabs: { id: Filter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: stats.total },
    { id: 'live-ok', label: 'OK for live', count: stats.liveOk },
    { id: 'live-hidden', label: 'Blurred', count: stats.liveHidden },
    { id: 'archived', label: 'Archived', count: wishes.filter((w) => w.isHidden).length },
  ];

  return (
    <div className="mx-auto grid max-w-container gap-8 px-4 py-8 sm:px-8 lg:px-12">
      <section className="glass rounded-feature p-6 shadow-card sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="grid gap-2">
            <span className="eyebrow">Private inbox</span>
            <h1 className="font-display text-[clamp(28px,5vw,42px)] text-rose-600">Your wishes ♡</h1>
            <p className="max-w-[50ch] text-sm leading-relaxed text-ink-300">
              Every message sent from the site lands here — only you can read them.
            </p>
          </div>
          <Button variant="secondary" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Total', value: stats.total, tone: 'from-pink-100/90 to-white/80' },
            { label: 'OK for live', value: stats.liveOk, tone: 'from-sky-100/80 to-white/80' },
            { label: 'Blurred', value: stats.liveHidden, tone: 'from-lavender-200/50 to-white/80' },
          ].map((item) => (
            <div
              key={item.label}
              className={cn('rounded-field border border-pink-200/60 bg-gradient-to-br p-4', item.tone)}
            >
              <p className="font-ui text-xs font-medium uppercase tracking-[0.12em] text-ink-300">{item.label}</p>
              <p className="font-ui text-3xl font-semibold tabular-nums text-ink-900">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={cn(
              'min-h-[44px] rounded-full border px-4 text-sm transition-colors',
              filter === tab.id
                ? 'border-rose-500 bg-rose-500 text-white'
                : 'border-pink-200 bg-white/70 text-ink-300 hover:text-rose-600',
            )}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
        <Button variant="ghost" size="sm" onClick={() => void load()} className="ml-auto">
          Refresh
        </Button>
      </div>

      {state === 'loading' ? (
        <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-52 animate-pulse rounded-card bg-pink-100/60" />
          ))}
        </div>
      ) : null}

      {error ? <p className="text-sm text-rose-700">{error}</p> : null}

      {state === 'ready' && filtered.length === 0 ? (
        <div className="glass grid place-items-center gap-3 rounded-feature px-6 py-16 text-center shadow-soft">
          <span className="text-4xl" aria-hidden="true">
            ♡
          </span>
          <p className="font-display text-xl text-rose-600">No wishes here yet</p>
          <p className="max-w-sm text-sm text-ink-300">
            When someone sends a message from the homepage, it will appear in this inbox.
          </p>
        </div>
      ) : null}

      {state === 'ready' && filtered.length > 0 ? (
        <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((wish, index) => (
            <WishCard
              key={wish.id}
              wish={wish}
              index={index}
              onHide={handleHide}
              onToggleHideFromLive={handleToggleHideFromLive}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { BlurredWishBody } from '@/components/wishes/BlurredWishBody';
import { useAdminWishes } from '@/hooks/useAdminWishes';
import { clearAdminWishesCache } from '@/lib/adminWishesCache';
import { clearReaderPosition, readReaderPosition, saveReaderPosition } from '@/lib/readerPosition';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { createClient } from '@/lib/supabase/client';
import type { BirthdayWish } from '@/types';
import { cn } from '@/utils/cn';
import { relativeTime, tintFor } from '@/utils/format';

type Filter = 'all' | 'live-ok' | 'live-hidden' | 'archived';

const FILTERS: Filter[] = ['all', 'live-ok', 'live-hidden', 'archived'];

function parseFilter(value: string | null): Filter {
  return FILTERS.includes(value as Filter) ? (value as Filter) : 'all';
}

function filterWishes(wishes: BirthdayWish[], filter: Filter) {
  if (filter === 'live-ok') return wishes.filter((w) => !w.hideFromLive && !w.isHidden);
  if (filter === 'live-hidden') return wishes.filter((w) => w.hideFromLive);
  if (filter === 'archived') return wishes.filter((w) => w.isHidden);
  return wishes;
}

function clampIndex(index: number, length: number) {
  if (length <= 0) return 0;
  return Math.max(0, Math.min(index, length - 1));
}

function NavArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: 'prev' | 'next';
  disabled: boolean;
  onClick: () => void;
}) {
  const label = direction === 'prev' ? 'Previous wish' : 'Next wish';

  return (
    /**
     * Pinned near the top of the card and sticky at mid-viewport, so the arrows sit in the
     * same spot for every wish instead of drifting with the height of the attached photo.
     */
    <div className="sticky top-[calc(50vh-1.5rem)] mt-24 shrink-0">
      <button
        type="button"
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          'grid h-12 w-12 place-items-center rounded-full border border-pink-200/80 bg-white/90',
          'font-ui text-xl text-rose-600 shadow-soft transition-all',
          'hover:border-rose-300 hover:bg-white hover:shadow-card',
          'disabled:pointer-events-none disabled:opacity-35',
        )}
      >
        {direction === 'prev' ? '‹' : '›'}
      </button>
    </div>
  );
}

function WishReaderSlide({
  wish,
  index,
  onHide,
  onToggleHideFromLive,
  onDelete,
}: {
  wish: BirthdayWish;
  index: number;
  onHide: (id: string, hidden: boolean) => void;
  onToggleHideFromLive: (id: string, hideFromLive: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const hideFromLive = Boolean(wish.hideFromLive);

  return (
    <article
      className={cn(
        'mx-auto grid w-full max-w-reading gap-5 rounded-feature border border-pink-200/70 p-6 shadow-card sm:p-8',
        tintFor(index),
      )}
    >
      <header className="grid gap-3 text-center">
        <div className="flex items-center justify-center gap-2">
          {wish.sticker ? (
            <span aria-hidden="true" className="text-3xl leading-none">
              {wish.sticker}
            </span>
          ) : null}
          {wish.isHidden ? (
            <span className="rounded-full bg-pink-100 px-2.5 py-1 font-ui text-[11px] font-medium text-ink-300">
              Archived
            </span>
          ) : null}
        </div>
        <div className="grid gap-1">
          <h2 className="font-ui text-xl font-semibold text-ink-900">{wish.displayName}</h2>
          {wish.handle ? <p className="font-ui text-sm text-ink-300">@{wish.handle}</p> : null}
        </div>
      </header>

      <BlurredWishBody
        message={wish.message}
        mediaUrl={wish.mediaUrl}
        mediaType={wish.mediaType}
        displayName={wish.displayName}
        hideFromLive={hideFromLive}
        hideEmptyMedia
        mediaVariant="feature"
        messageClassName="text-center text-[17px] leading-[1.85] sm:text-lg"
        onToggleHideFromLive={(hidden) => onToggleHideFromLive(wish.id, hidden)}
      />

      <footer className="grid gap-3 border-t border-pink-100/80 pt-4">
        <p className="text-center font-ui text-xs lowercase text-ink-300">{relativeTime(wish.createdAt)}</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => onHide(wish.id, !wish.isHidden)}>
            {wish.isHidden ? 'Unarchive' : 'Archive'}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(wish.id)}>
            Delete
          </Button>
        </div>
      </footer>
    </article>
  );
}

/** Dots stay a fixed width no matter how many wishes there are — only a window slides. */
const DOT_WINDOW = 9;

function WishDots({
  wishes,
  index,
  onSelect,
}: {
  wishes: BirthdayWish[];
  index: number;
  onSelect: (wishId: string, step: number) => void;
}) {
  const total = wishes.length;
  const size = Math.min(DOT_WINDOW, total);
  const start = clampIndex(index - Math.floor(size / 2), total - size + 1);
  const visible = wishes.slice(start, start + size);

  return (
    <div className="flex items-center gap-1.5">
      {visible.map((wish, slot) => {
        const dotIndex = start + slot;
        const isActive = dotIndex === index;
        // Distance to a hidden neighbour — the taper hints there is more in that direction.
        const beforeHidden = start > 0 ? slot : Infinity;
        const afterHidden = start + size < total ? size - 1 - slot : Infinity;
        const fromHidden = Math.min(beforeHidden, afterHidden);

        return (
          <button
            key={wish.id}
            type="button"
            aria-label={`Go to wish ${dotIndex + 1}`}
            aria-current={isActive ? 'true' : undefined}
            onClick={() => onSelect(wish.id, dotIndex > index ? 1 : -1)}
            className={cn(
              // Scale, not width, so the row never changes size.
              'h-2 rounded-full transition-all duration-200',
              isActive ? 'w-6 bg-rose-500' : 'w-2 bg-pink-200 hover:bg-pink-300',
              !isActive && fromHidden === 0 ? 'scale-50' : '',
              !isActive && fromHidden === 1 ? 'scale-75' : '',
            )}
          />
        );
      })}
    </div>
  );
}

export function ChareneWishReader() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduced = usePrefersReducedMotion();
  const [filter, setFilter] = useState<Filter>(() => parseFilter(searchParams.get('filter')));
  const [activeId, setActiveId] = useState<string | null>(() => searchParams.get('id'));
  const [direction, setDirection] = useState(0);

  const {
    wishes,
    state,
    error,
    refresh,
    refreshing,
    deleteTarget,
    setDeleteTarget,
    deleting,
    handleHide,
    handleToggleHideFromLive,
    handleDeleteRequest,
    handleDeleteConfirm,
  } = useAdminWishes();

  const filtered = useMemo(() => filterWishes(wishes, filter), [filter, wishes]);

  const index = useMemo(() => {
    if (filtered.length === 0) return 0;
    if (!activeId) return 0;
    const found = filtered.findIndex((w) => w.id === activeId);
    return found >= 0 ? found : 0;
  }, [activeId, filtered]);

  useEffect(() => {
    if (filtered.length === 0) return;
    if (activeId && filtered.some((w) => w.id === activeId)) return;

    // Nothing selected yet (no ?id= in the URL) — pick up where this admin left off.
    const remembered = activeId ? null : readReaderPosition();
    const resume = remembered ? filtered.find((w) => w.id === remembered) : undefined;
    setActiveId(resume?.id ?? filtered[0].id);
  }, [activeId, filtered]);

  useEffect(() => {
    if (activeId) saveReaderPosition(activeId);
  }, [activeId]);

  useEffect(() => {
    if (!activeId) return;

    const params = new URLSearchParams();
    params.set('id', activeId);
    if (filter !== 'all') params.set('filter', filter);

    const nextQuery = params.toString();
    if (nextQuery === searchParams.toString()) return;

    router.replace(`${pathname}?${nextQuery}`, { scroll: false });
  }, [activeId, filter, pathname, router, searchParams]);

  const current = filtered[index];

  const selectWish = useCallback(
    (wishId: string, step: number) => {
      setDirection(step);
      setActiveId(wishId);
    },
    [],
  );

  const go = useCallback(
    (step: number) => {
      if (filtered.length <= 1) return;
      const nextIndex = clampIndex(index + step, filtered.length);
      const nextWish = filtered[nextIndex];
      if (!nextWish) return;
      selectWish(nextWish.id, step);
    },
    [filtered, index, selectWish],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (deleteTarget) return;
      if (event.key === 'ArrowLeft') go(-1);
      if (event.key === 'ArrowRight') go(1);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [deleteTarget, go]);

  const handleSignOut = async () => {
    clearAdminWishesCache();
    clearReaderPosition();
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/charene');
    router.refresh();
  };

  const handleDeleteConfirmWithIndex = async () => {
    const removedId = deleteTarget?.id;
    const wasActive = removedId === activeId;
    const wasAtIndex = index;
    await handleDeleteConfirm();
    if (!removedId || !wasActive) return;

    const remaining = filtered.filter((w) => w.id !== removedId);
    if (remaining.length === 0) {
      setActiveId(null);
      return;
    }

    const nextIndex = clampIndex(wasAtIndex, remaining.length);
    setActiveId(remaining[nextIndex]?.id ?? remaining[0].id);
  };

  const tabs: { id: Filter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: wishes.length },
    { id: 'live-ok', label: 'OK for live', count: wishes.filter((w) => !w.hideFromLive && !w.isHidden).length },
    { id: 'live-hidden', label: 'Blurred', count: wishes.filter((w) => w.hideFromLive).length },
    { id: 'archived', label: 'Archived', count: wishes.filter((w) => w.isHidden).length },
  ];

  const slideVariants = reduced
    ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        enter: (d: number) => ({ opacity: 0, x: d > 0 ? 80 : -80 }),
        center: { opacity: 1, x: 0 },
        exit: (d: number) => ({ opacity: 0, x: d > 0 ? -80 : 80 }),
      };

  return (
    <>
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this wish?"
        message={
          deleteTarget
            ? `Remove the message from ${deleteTarget.displayName}? This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleting}
        onConfirm={() => void handleDeleteConfirmWithIndex()}
        onCancel={() => {
          if (!deleting) setDeleteTarget(null);
        }}
      />

      <div className="mx-auto grid max-w-container gap-6 px-4 py-8 sm:px-8 lg:px-12">
        <section className="glass rounded-feature p-5 shadow-soft sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="grid gap-1">
              <span className="eyebrow">Focus view</span>
              <h1 className="font-display text-[clamp(24px,4vw,34px)] text-rose-600">One wish at a time ♡</h1>
              <p className="max-w-[48ch] text-sm leading-relaxed text-ink-300">
                Swipe or use the arrows to move between messages.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button href="/charene/inbox" variant="ghost" size="sm">
                Grid view
              </Button>
              <Button variant="ghost" size="sm" loading={refreshing} onClick={() => void refresh()}>
                Refresh
              </Button>
              <Button variant="secondary" size="sm" onClick={handleSignOut}>
                Sign out
              </Button>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                const nextFilter = tab.id;
                setFilter(nextFilter);
                const nextFiltered = filterWishes(wishes, nextFilter);
                if (activeId && nextFiltered.some((w) => w.id === activeId)) return;
                setActiveId(nextFiltered[0]?.id ?? null);
              }}
              className={cn(
                'min-h-[44px] rounded-full border px-4 font-ui text-sm transition-colors',
                filter === tab.id
                  ? 'border-rose-500 bg-rose-500 text-white'
                  : 'border-pink-200 bg-white/70 text-ink-300 hover:text-rose-600',
              )}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {state === 'loading' ? (
          <div className="mx-auto h-[420px] w-full max-w-reading animate-pulse rounded-feature bg-pink-100/60" />
        ) : null}

        {error ? <p className="text-center text-sm text-rose-700">{error}</p> : null}

        {state === 'ready' && filtered.length === 0 ? (
          <div className="glass grid place-items-center gap-3 rounded-feature px-6 py-16 text-center shadow-soft">
            <span className="text-4xl" aria-hidden="true">
              ♡
            </span>
            <p className="font-display text-xl text-rose-600">No wishes here yet</p>
            <p className="max-w-sm text-sm text-ink-300">Switch filters or wait for new messages from the site.</p>
          </div>
        ) : null}

        {state === 'ready' && current ? (
          <div className="grid gap-4">
            <div className="flex items-center justify-center gap-3">
              <p className="font-ui text-sm tabular-nums text-ink-300">
                {index + 1} / {filtered.length}
              </p>
              <WishDots wishes={filtered} index={index} onSelect={selectWish} />
            </div>

            <div className="flex items-start gap-3 sm:gap-5">
              <NavArrow direction="prev" disabled={index <= 0} onClick={() => go(-1)} />

              <div className="min-w-0 flex-1 touch-pan-y">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={current.id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: reduced ? 0.12 : 0.28, ease: [0.16, 0.84, 0.44, 1] }}
                    drag={reduced ? false : 'x'}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.12}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -72) go(1);
                      else if (info.offset.x > 72) go(-1);
                    }}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <WishReaderSlide
                      wish={current}
                      index={index}
                      onHide={handleHide}
                      onToggleHideFromLive={handleToggleHideFromLive}
                      onDelete={handleDeleteRequest}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <NavArrow direction="next" disabled={index >= filtered.length - 1} onClick={() => go(1)} />
            </div>

            <p className="text-center font-ui text-xs text-ink-300">Swipe left or right · arrow keys work too</p>
          </div>
        ) : null}
      </div>
    </>
  );
}

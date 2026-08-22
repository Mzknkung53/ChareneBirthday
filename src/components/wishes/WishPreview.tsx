'use client';

import { WishCard } from '@/components/wishes/WishCard';
import type { BirthdayWish, WishDraft, WishMediaType } from '@/types';

interface WishPreviewProps {
  draft: WishDraft;
  mediaUrl: string | null;
  mediaType: WishMediaType | null;
}

/** Local preview only — the submitted wish is not shown on any public wall. */
export function WishPreview({ draft, mediaUrl, mediaType }: WishPreviewProps) {
  const wish: BirthdayWish = {
    id: 'preview',
    displayName: draft.displayName.trim() || 'your name',
    handle: draft.handle?.trim() || undefined,
    message: draft.message.trim() || 'เขียนคำอวยพรถึงชาลีน… your wish will look like this for Charene.',
    sticker: draft.sticker,
    mediaUrl: mediaUrl ?? undefined,
    mediaType: mediaType ?? undefined,
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="grid gap-3 lg:sticky lg:top-24">
      <span className="eyebrow text-center">Preview (only you see this)</span>
      <WishCard wish={wish} preview />
    </div>
  );
}

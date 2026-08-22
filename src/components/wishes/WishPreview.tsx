'use client';

import { WishCard } from '@/components/wishes/WishCard';
import type { BirthdayWish, WishDraft } from '@/types';

interface WishPreviewProps {
  draft: WishDraft;
  imageUrl: string | null;
}

/** Shows the card exactly as it will land on the wall. */
export function WishPreview({ draft, imageUrl }: WishPreviewProps) {
  const wish: BirthdayWish = {
    id: 'preview',
    displayName: draft.displayName.trim() || 'your name',
    handle: draft.handle?.trim() || undefined,
    message: draft.message.trim() || 'เขียนคำอวยพรถึงชาลีน… your wish will look like this on the wall.',
    sticker: draft.sticker,
    imageUrl: imageUrl ?? undefined,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="grid gap-3 lg:sticky lg:top-24">
      <span className="eyebrow text-center">Preview on the wall</span>
      <WishCard wish={wish} preview />
    </div>
  );
}

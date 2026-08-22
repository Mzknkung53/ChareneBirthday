'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { MessageField } from '@/components/ui/MessageField';
import { PhotoDrop } from '@/components/ui/PhotoDrop';
import { StickerPicker } from '@/components/ui/StickerPicker';
import { TextField } from '@/components/ui/TextField';
import { WishPreview } from '@/components/wishes/WishPreview';
import type { ServiceResult, BirthdayWish, WishDraft } from '@/types';
import { NAME_MAX, hasErrors, validateWish, type WishErrors } from '@/utils/validation';

interface WishFormProps {
  onSubmit: (draft: WishDraft) => Promise<ServiceResult<BirthdayWish>>;
  onSent?: () => void;
}

const EMPTY: WishDraft = { displayName: '', handle: '', message: '', sticker: '♡', image: null };

export function WishForm({ onSubmit, onSent }: WishFormProps) {
  const [draft, setDraft] = useState<WishDraft>(EMPTY);
  const [errors, setErrors] = useState<WishErrors>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  useEffect(() => {
    if (!draft.image) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(draft.image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [draft.image]);

  const set = <K extends keyof WishDraft>(key: K, value: WishDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setSent(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validateWish(draft);
    setErrors(found);
    if (hasErrors(found)) return;

    setSending(true);
    setFailure(null);
    const res = await onSubmit(draft);
    setSending(false);

    if (res.error || !res.data) {
      setFailure(res.error ?? 'Your wish did not send. Try once more in a moment.');
      return;
    }
    setDraft(EMPTY);
    setSent(true);
    onSent?.();
  };

  return (
    <div className="mx-auto grid max-w-[1000px] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:gap-8">
      <form onSubmit={handleSubmit} noValidate className="glass grid min-w-0 gap-4 rounded-feature p-5 shadow-card sm:p-8">
        <TextField
          label="Display name"
          placeholder="ชื่อของคุณ / your name"
          value={draft.displayName}
          maxLength={NAME_MAX}
          error={errors.displayName}
          onChange={(e) => set('displayName', e.target.value)}
        />

        <TextField
          label="Social username"
          optional
          prefix="@"
          placeholder="charene9fan"
          value={draft.handle ?? ''}
          onChange={(e) => set('handle', e.target.value.replace(/^@/, ''))}
        />

        <MessageField
          value={draft.message}
          error={errors.message}
          placeholder="เขียนคำอวยพรถึงชาลีน… / write your wish here"
          onChange={(e) => set('message', e.target.value)}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <PhotoDrop file={draft.image ?? null} previewUrl={previewUrl} error={errors.image} onPick={(file) => set('image', file)} />
          <StickerPicker value={draft.sticker} onSelect={(s) => set('sticker', s)} />
        </div>

        {failure ? (
          <p role="alert" className="flex items-start gap-2 rounded-field border border-rose-500/40 bg-pink-100/90 p-3 text-sm text-rose-700">
            <span aria-hidden="true">✕</span>
            <span>{failure}</span>
          </p>
        ) : null}

        <Button type="submit" size="lg" fullWidth iconRight="♡" loading={sending} disabled={sending}>
          {sending ? 'Sending…' : 'Send my wish'}
        </Button>

        <p className="text-center text-[13px] text-ink-300" aria-live="polite">
          {sent ? 'Sent ♡ your wish is at the top of the wall.' : 'Your wish appears on the wall right away.'}
        </p>
      </form>

      <WishPreview draft={draft} imageUrl={previewUrl} />
    </div>
  );
}

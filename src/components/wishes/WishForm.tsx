'use client';

import { useEffect, useState } from 'react';
import { submitWish } from '@/app/actions/wishes';
import { Button } from '@/components/ui/Button';
import { MessageField } from '@/components/ui/MessageField';
import { MediaDrop } from '@/components/ui/MediaDrop';
import { StickerPicker } from '@/components/ui/StickerPicker';
import { TextField } from '@/components/ui/TextField';
import { LivePrivacyPicker } from '@/components/wishes/LivePrivacyPicker';
import { WishPreview } from '@/components/wishes/WishPreview';
import { WishSentSuccess } from '@/components/wishes/WishSentSuccess';
import type { WishDraft, WishMediaType } from '@/types';
import { NAME_MAX, hasErrors, mediaKind, validateWish, type WishErrors } from '@/utils/validation';

interface WishFormProps {
  onSent?: () => void;
}

const EMPTY: WishDraft = { displayName: '', handle: '', message: '', sticker: '♡', media: null, hideFromLive: false };

export function WishForm({ onSent }: WishFormProps) {
  const [draft, setDraft] = useState<WishDraft>(EMPTY);
  const [errors, setErrors] = useState<WishErrors>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewMediaType, setPreviewMediaType] = useState<WishMediaType | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  useEffect(() => {
    if (!draft.media) {
      setPreviewUrl(null);
      setPreviewMediaType(null);
      return;
    }
    const url = URL.createObjectURL(draft.media);
    setPreviewUrl(url);
    setPreviewMediaType(mediaKind(draft.media));
    return () => URL.revokeObjectURL(url);
  }, [draft.media]);

  const set = <K extends keyof WishDraft>(key: K, value: WishDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setSent(false);
    setSuccessVisible(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validateWish(draft);
    setErrors(found);
    if (hasErrors(found)) return;

    setSending(true);
    setFailure(null);

    const formData = new FormData();
    formData.set('displayName', draft.displayName.trim());
    formData.set('handle', draft.handle?.trim() ?? '');
    formData.set('message', draft.message.trim());
    formData.set('sticker', draft.sticker ?? '♡');
    formData.set('hideFromLive', String(draft.hideFromLive ?? false));
    if (draft.media) formData.set('media', draft.media);

    const res = await submitWish(formData);
    setSending(false);

    if (res.error || !res.data) {
      setFailure(res.error ?? 'Your wish did not send. Try once more in a moment.');
      return;
    }
    setDraft(EMPTY);
    setSent(true);
    setSuccessVisible(true);
    onSent?.();
  };

  return (
    <>
      <WishSentSuccess open={successVisible} onDismiss={() => setSuccessVisible(false)} />

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

        <div className="grid gap-4 sm:grid-cols-2 sm:items-start">
          <MediaDrop
            file={draft.media ?? null}
            previewUrl={previewUrl}
            mediaType={previewMediaType}
            error={errors.media}
            onPick={(file) => set('media', file)}
          />
          <StickerPicker value={draft.sticker} onSelect={(s) => set('sticker', s)} />
        </div>

        <LivePrivacyPicker hideFromLive={draft.hideFromLive ?? false} onChange={(v) => set('hideFromLive', v)} />

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
          {sent ? 'Sent ♡ Charene will read your wish — it stays private between you and her.' : 'Only Charene can read your wish.'}
        </p>
      </form>

      <WishPreview draft={draft} mediaUrl={previewUrl} mediaType={previewMediaType} />
      </div>
    </>
  );
}

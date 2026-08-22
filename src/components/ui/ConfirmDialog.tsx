'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) onCancel();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-4" role="presentation">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-ink-900/35"
        onClick={loading ? undefined : onCancel}
        disabled={loading}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        className={cn(
          'relative z-[101] grid w-full max-w-[min(420px,100%)] gap-5 rounded-feature border border-pink-200/80',
          'bg-white/95 p-6 shadow-card backdrop-blur-sm',
        )}
      >
        <div className="grid gap-2 text-center">
          <h2 id="confirm-dialog-title" className="font-ui text-lg font-semibold text-ink-900">
            {title}
          </h2>
          <p id="confirm-dialog-message" className="font-ui text-sm leading-relaxed text-ink-300">
            {message}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading} fullWidth>
            {cancelLabel}
          </Button>
          <Button type="button" variant="primary" onClick={onConfirm} loading={loading} fullWidth>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

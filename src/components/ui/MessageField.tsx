'use client';

import { cn } from '@/utils/cn';
import { MESSAGE_MAX } from '@/utils/validation';

interface MessageFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  value: string;
  max?: number;
  error?: string;
}

export function MessageField({
  label = 'Birthday message',
  value,
  max = MESSAGE_MAX,
  error,
  className,
  ...rest
}: MessageFieldProps) {
  const len = value.length;
  const ratio = len / max;
  const counterColor = ratio > 1 ? 'text-rose-600' : ratio > 0.85 ? 'text-gold-500' : 'text-ink-300';

  return (
    <div className="grid min-w-0 gap-2">
      <label htmlFor="wish-message" className="flex flex-wrap items-baseline justify-between gap-2 text-sm font-medium text-ink-900">
        {label}
        <span className={cn('tabular text-xs font-light', counterColor)}>
          {len}/{max}
        </span>
      </label>
      <textarea
        id="wish-message"
        value={value}
        rows={5}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? 'wish-message-error' : undefined}
        className={cn(
          'min-h-[150px] w-full resize-y rounded-field border bg-white/90 p-4 text-[16px] leading-[1.85] text-ink-900',
          'placeholder:text-ink-300/80 outline-none transition-all duration-200',
          'focus:border-rose-500 focus:ring-4 focus:ring-rose-500/25',
          error ? 'border-rose-500 ring-4 ring-rose-500/25' : 'border-pink-200',
          className,
        )}
        {...rest}
      />
      {error ? (
        <p id="wish-message-error" role="alert" className="flex items-start gap-2 text-sm text-rose-700">
          <span aria-hidden="true">✕</span>
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

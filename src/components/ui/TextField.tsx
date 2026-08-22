'use client';

import { cn } from '@/utils/cn';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  optional?: boolean;
  prefix?: string;
  error?: string;
  hint?: string;
}

export function TextField({ label, optional, prefix, error, hint, className, id, ...rest }: TextFieldProps) {
  const fieldId = id ?? 'field-' + label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="grid min-w-0 gap-2">
      <label htmlFor={fieldId} className="flex flex-wrap items-baseline gap-2 text-sm font-medium text-ink-900">
        {label}
        {optional ? <span className="text-xs font-light text-ink-300">optional</span> : null}
      </label>
      <div
        className={cn(
          'flex min-h-[52px] items-center gap-1 rounded-field border bg-white/90 px-4 transition-all duration-200',
          'focus-within:border-rose-500 focus-within:ring-4 focus-within:ring-rose-500/25',
          error ? 'border-rose-500 ring-4 ring-rose-500/25' : 'border-pink-200',
        )}
      >
        {prefix ? <span className="shrink-0 text-ink-300">{prefix}</span> : null}
        <input
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? fieldId + '-error' : undefined}
          className={cn(
            'h-[52px] w-full min-w-0 bg-transparent text-[16px] text-ink-900 placeholder:text-ink-300/80',
            'border-0 outline-none ring-0 focus:outline-none focus:ring-0',
            className,
          )}
          {...rest}
        />
      </div>
      {error ? (
        <p id={fieldId + '-error'} role="alert" className="flex items-start gap-2 text-sm text-rose-700">
          <span aria-hidden="true">✕</span>
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p className="text-xs text-ink-300">{hint}</p>
      ) : null}
    </div>
  );
}

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
          'flex items-center gap-1 rounded-field border bg-white/90 px-4 transition-colors duration-200',
          error ? 'border-rose-500' : 'border-pink-200 focus-within:border-rose-500',
        )}
      >
        {prefix ? <span className="text-ink-300">{prefix}</span> : null}
        <input
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? fieldId + '-error' : undefined}
          className={cn(
            'min-h-[48px] w-full bg-transparent text-[16px] text-ink-900 placeholder:text-ink-300/80 focus:outline-none',
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

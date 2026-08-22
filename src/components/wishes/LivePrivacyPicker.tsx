'use client';

import { cn } from '@/utils/cn';

interface LivePrivacyPickerProps {
  hideFromLive: boolean;
  onChange: (hideFromLive: boolean) => void;
}

const options = [
  {
    value: false,
    label: 'OK for live',
    sub: 'Charene can read this on stream',
    glyph: '✨',
  },
  {
    value: true,
    label: 'Hidden',
    sub: 'Blurred in inbox — tap to read (safe on stream)',
    glyph: '🌙',
  },
] as const;

export function LivePrivacyPicker({ hideFromLive, onChange }: LivePrivacyPickerProps) {
  return (
    <div className="grid min-w-0 gap-2">
      <span className="text-sm font-medium text-ink-900">Live stream</span>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((opt) => {
          const active = hideFromLive === opt.value;
          return (
            <button
              key={opt.label}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(opt.value)}
              className={cn(
                'grid min-h-[88px] gap-1 rounded-field border p-3 text-left transition-colors duration-200',
                active
                  ? 'border-rose-500 bg-pink-100/80 shadow-soft'
                  : 'border-pink-200 bg-white/70 hover:bg-pink-50',
              )}
            >
              <span className="flex items-center gap-2 font-medium text-ink-900">
                <span aria-hidden="true">{opt.glyph}</span>
                {opt.label}
              </span>
              <span className="text-xs leading-relaxed text-ink-300">{opt.sub}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

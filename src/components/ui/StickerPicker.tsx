'use client';

import { cn } from '@/utils/cn';

export const STICKERS = ['♡', '🌸', '🎂', '✨', '🎀', '🧸', '🌷', '⭐', '🍓', '🫧'];

interface StickerPickerProps {
  value?: string;
  onSelect: (sticker: string) => void;
  label?: string;
}

export function StickerPicker({ value, onSelect, label = 'Pick a sticker' }: StickerPickerProps) {
  return (
    <div className="grid min-w-0 gap-2">
      <span className="text-sm font-medium text-ink-900">
        {label} <span className="text-xs font-light text-ink-300">optional</span>
      </span>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
        {STICKERS.map((s) => {
          const on = value === s;
          return (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={'sticker ' + s}
              onClick={() => onSelect(s)}
              className={cn(
                'grid h-11 w-11 place-items-center rounded-full border text-lg',
                'transition-transform duration-200 ease-[cubic-bezier(.34,1.56,.64,1)] active:scale-95',
                on
                  ? 'border-rose-500 bg-pink-100 shadow-soft'
                  : 'border-pink-200 bg-white/80 hover:-translate-y-0.5 hover:bg-pink-50',
              )}
            >
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
}

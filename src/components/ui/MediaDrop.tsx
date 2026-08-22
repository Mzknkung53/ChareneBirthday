'use client';

import { useRef, useState } from 'react';
import { cn } from '@/utils/cn';
import { mediaKind } from '@/utils/validation';
import type { WishMediaType } from '@/types';

interface MediaDropProps {
  file: File | null;
  previewUrl: string | null;
  mediaType: WishMediaType | null;
  error?: string;
  onPick: (file: File | null) => void;
}

export function MediaDrop({ file, previewUrl, mediaType, error, onPick }: MediaDropProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  const pickFromList = (files: FileList | null | undefined) => {
    const next = files?.[0] ?? null;
    if (!next) {
      onPick(null);
      return;
    }
    if (!mediaKind(next)) return;
    onPick(next);
  };

  return (
    <div className="grid min-w-0 gap-2">
      <span className="flex flex-wrap items-baseline gap-2 text-sm font-medium text-ink-900">
        Add a photo or video <span className="text-xs font-light text-ink-300">optional</span>
      </span>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={(e) => pickFromList(e.target.files)}
      />

      {previewUrl && file && mediaType ? (
        <figure className="relative m-0 overflow-hidden rounded-field border border-pink-200 bg-white">
          {mediaType === 'video' ? (
            <video
              src={previewUrl}
              controls
              playsInline
              preload="metadata"
              className="block aspect-[4/3] w-full bg-ink-900/5 object-cover"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt={'Preview of ' + file.name} className="block aspect-[4/3] w-full object-cover" />
          )}
          <div className="flex items-center justify-between gap-2 p-2">
            <span className="truncate text-xs text-ink-300">{file.name}</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="min-h-[44px] rounded-full px-3 text-sm text-rose-600 hover:bg-pink-100/70"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => onPick(null)}
                className="min-h-[44px] rounded-full px-3 text-sm text-rose-600 hover:bg-pink-100/70"
              >
                Remove
              </button>
            </div>
          </div>
        </figure>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            pickFromList(e.dataTransfer.files);
          }}
          className={cn(
            'grid min-h-[130px] place-items-center gap-1.5 rounded-field border-[1.5px] border-dashed p-4 text-center text-sm',
            'transition-colors duration-200',
            over ? 'border-rose-500 bg-pink-100' : 'border-pink-300 bg-white/70 text-ink-300 hover:bg-pink-50',
          )}
        >
          <span aria-hidden="true" className="text-2xl">
            🌸
          </span>
          <span>Drop a photo or video — or tap to choose</span>
          <span className="text-xs">JPG, PNG, WebP · up to 8 MB · MP4, WebM, MOV · up to 50 MB</span>
        </button>
      )}

      {error ? (
        <p role="alert" className="flex items-start gap-2 text-sm text-rose-700">
          <span aria-hidden="true">✕</span>
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

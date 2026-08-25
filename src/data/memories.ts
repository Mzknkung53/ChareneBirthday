import type { MemoryPhoto } from '@/types';

/**
 * Replace src with real photos in /public/images. Leave src undefined to render
 * the pastel placeholder frame that says what belongs there.
 */
export const MEMORIES: MemoryPhoto[] = [
  { id: 'm-1', src: '/images/Charene-Profile.png', caption: 'the sakura era ♡', rotate: -3, alt: "Charene's profile artwork" },
  { id: 'm-2', src: '/images/sweetest-little-moment.png', caption: 'sweetest little moment 🍓', rotate: 2, alt: 'Chibi strawberry cake illustration' },
  { id: 'm-3', src: '/images/creating-little-dreams.png', caption: 'creating little dreams ♡', rotate: -1, alt: 'Charene drawing and creating art' },
  {
    id: 'm-4',
    src: '/images/soft-days-warm-nights.png',
    caption: 'soft days, warm nights ☁️',
    rotate: 3,
    alt: 'Soft moment hugging a plushie',
    objectPosition: '25% 20%',
  },
];

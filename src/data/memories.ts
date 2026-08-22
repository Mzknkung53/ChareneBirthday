import type { MemoryPhoto } from '@/types';

/**
 * Replace src with real photos in /public/images. Leave src undefined to render
 * the pastel placeholder frame that says what belongs there.
 */
export const MEMORIES: MemoryPhoto[] = [
  { id: 'm-1', src: '/images/Charene-Profile.png', caption: 'the sakura era ♡', rotate: -3, alt: "Charene's profile artwork" },
  { id: 'm-2', caption: 'first ever stream', rotate: 2, alt: 'photo from her first stream' },
  { id: 'm-3', caption: '12.9K friends 🎀', rotate: -1, alt: 'follower milestone photo' },
  { id: 'm-4', caption: 'cake night 🎂', rotate: 3, alt: 'birthday cake photo' },
];

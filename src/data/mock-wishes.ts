import type { BirthdayWish } from '@/types';

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();

/**
 * Temporary content so the wall can be built and tested without a database.
 * Delete this file once the Supabase queries in lib/services/wishes.ts are live.
 */
export const MOCK_WISHES: BirthdayWish[] = [
  {
    id: 'w-1',
    displayName: 'Ploy',
    handle: 'ploysunday',
    message: 'สุขสันต์วันเกิดนะคะ ขอให้ปีนี้เป็นปีที่ดีที่สุดของชาลีน มีความสุขเยอะๆ สุขภาพแข็งแรง แล้วอย่าลืมพักผ่อนด้วยนะคะ ♡',
    sticker: '🌸',
    status: 'approved',
    createdAt: hoursAgo(2),
    reactions: { '♡': 12, '🌸': 4 },
  },
  {
    id: 'w-2',
    displayName: 'Kevin',
    handle: 'kev.streams',
    message: 'Happy birthday Charene! Your late-night streams got me through a rough year. Wishing you the softest, sparkliest day.',
    sticker: '✨',
    status: 'approved',
    createdAt: hoursAgo(4),
    reactions: { '♡': 7 },
  },
  {
    id: 'w-3',
    displayName: 'Yuki',
    handle: 'yuki_sakura',
    message: 'From Tokyo with love — thank you for making a stranger on the internet feel at home.',
    sticker: '♡',
    status: 'approved',
    createdAt: hoursAgo(26),
    reactions: { '♡': 9, '✨': 3 },
  },
  {
    id: 'w-4',
    displayName: 'เบส',
    handle: 'bestbest',
    message: 'ตามมาตั้งแต่พันแรกเลย ดีใจที่ได้เห็นชาลีนโตขึ้นทุกปี ขอให้ปีนี้ยิ้มเยอะกว่าเดิมนะ',
    sticker: '🎂',
    status: 'approved',
    createdAt: hoursAgo(30),
    reactions: { '🎂': 5 },
  },
  {
    id: 'w-5',
    displayName: 'Mina',
    handle: 'minaminaa',
    message: 'You are the reason my Discord friends and I met. Happy birthday to the softest streamer on the internet.',
    sticker: '🎀',
    status: 'approved',
    createdAt: hoursAgo(50),
    reactions: { '♡': 15 },
  },
  {
    id: 'w-6',
    displayName: 'Tar',
    handle: 'tar.k',
    message: 'ขอให้ทุกวันของชาลีนเบาสบายเหมือนเสียงหัวเราะตอนไลฟ์นะครับ 🌷',
    sticker: '⭐',
    status: 'approved',
    createdAt: hoursAgo(74),
    reactions: { '♡': 6, '🌸': 2 },
  },
];

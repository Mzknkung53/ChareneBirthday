/** Single place to edit the celebration facts and links. */
export const SITE = {
  name: 'Charene9',
  handle: '@c.charene9',
  /** Birthday, Asia/Bangkok. The countdown flips to the birthday state at this moment. */
  birthdayISO: '2026-09-04T00:00:00+07:00',
  birthdayLabel: '4 September 2026',
  links: [
    { label: 'TikTok', glyph: '♪', href: 'https://www.tiktok.com/@c.charene9?_r=1&_t=ZS-995ne06A1hN', tone: 'pink' as const },
    { label: 'Linktree', glyph: '✦', href: 'https://linktr.ee/charene9', tone: 'blue' as const },
    { label: 'Discord', glyph: '✧', href: 'https://discord.com/invite/2aP4zJcQwJ', tone: 'lavender' as const },
  ],
  specialMessage: {
    from: 'Nine',
    title: 'To my favourite person ♡',
    paragraphs: [
      'ขอบคุณที่อยู่ข้างกันมาตลอดปีนี้ — ทุกครั้งที่เธอเปิดไลฟ์ วันของฉันก็ดีขึ้นเสมอ วันนี้เป็นวันของเธอ ขอให้เป็นปีที่อ่อนโยนกับเธอที่สุด',
      'Thank you for letting all of us be part of your year — for the late streams, the quiet chats, the little laugh you do when chat teases you. I hope this page feels like a room full of people saying your name kindly, all at once.',
    ],
  },
};

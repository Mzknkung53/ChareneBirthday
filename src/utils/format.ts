/** Lowercase relative timestamps, per the brand voice: "just now", "2 hours ago". */
export function relativeTime(iso: string, now: number = Date.now()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + (mins === 1 ? ' minute ago' : ' minutes ago');
  const hours = Math.floor(mins / 60);
  if (hours < 24) return hours + (hours === 1 ? ' hour ago' : ' hours ago');
  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return days + ' days ago';
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return weeks + (weeks === 1 ? ' week ago' : ' weeks ago');
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toLowerCase();
}

export function pad2(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

/** Wish cards rotate through five pastel tints so neighbours differ. */
export const WISH_TINTS = ['bg-wish-1', 'bg-wish-2', 'bg-wish-3', 'bg-wish-4', 'bg-wish-5'] as const;

export function tintFor(index: number): string {
  return WISH_TINTS[index % WISH_TINTS.length];
}

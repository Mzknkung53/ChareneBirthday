/**
 * Remembers which wish the admin was reading in the focus view, so reopening the page
 * lands there instead of back at the top of the list.
 *
 * Stored by wish id, not by index — new wishes arriving from the site shift every index.
 */
const STORAGE_KEY = 'charene:reader-last-wish';

export function readReaderPosition(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Private mode / storage disabled — the reader just starts at the first wish.
    return null;
  }
}

export function saveReaderPosition(wishId: string) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, wishId);
  } catch {
    // Ignore — remembering the spot is a convenience, never required.
  }
}

export function clearReaderPosition() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore.
  }
}

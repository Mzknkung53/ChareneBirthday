import type { MouseEventHandler, MouseEvent as ReactMouseEvent } from 'react';

const DEFAULT_OFFSET = 92;
const MIN_DURATION = 1200;
const MAX_DURATION = 2400;
const MS_PER_PX = 1.6;

let activeFrame: number | null = null;

/** Starts moving right away, then eases into the section. */
function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function durationForDistance(distance: number) {
  return Math.min(MAX_DURATION, Math.max(MIN_DURATION, Math.abs(distance) * MS_PER_PX));
}

function readScrollY() {
  return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

function writeScrollY(y: number) {
  window.scrollTo(0, y);
  document.documentElement.scrollTop = y;
  document.body.scrollTop = y;
}

function cancelActiveScroll() {
  if (activeFrame !== null) {
    cancelAnimationFrame(activeFrame);
    activeFrame = null;
  }
}

function animateScrollTo(targetY: number, duration?: number) {
  cancelActiveScroll();

  const startY = readScrollY();
  const distance = targetY - startY;
  if (Math.abs(distance) < 2) return;

  const totalDuration = duration ?? durationForDistance(distance);
  let startTime: number | null = null;

  const step = (now: number) => {
    if (startTime === null) startTime = now;
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / totalDuration, 1);
    writeScrollY(startY + distance * easeOutCubic(progress));
    if (progress < 1) {
      activeFrame = requestAnimationFrame(step);
    } else {
      activeFrame = null;
    }
  };

  activeFrame = requestAnimationFrame(step);
}

export function smoothScrollToElement(
  element: HTMLElement,
  { offset = DEFAULT_OFFSET, duration }: { offset?: number; duration?: number } = {},
) {
  const targetY = element.getBoundingClientRect().top + readScrollY() - offset;
  animateScrollTo(targetY, duration);
}

export function smoothScrollToId(hash: string, options?: { offset?: number; duration?: number }) {
  const id = hash.replace(/^#/, '');
  if (!id) {
    animateScrollTo(0, options?.duration ?? MIN_DURATION);
    return;
  }

  const element = document.getElementById(id);
  if (!element) return;
  smoothScrollToElement(element, options);
}

export function smoothScrollToTop(duration?: number) {
  animateScrollTo(0, duration ?? MIN_DURATION);
}

/** Same-page hash links — used by the global capture listener. */
export function bindSmoothScrollAnchors(root: Document | HTMLElement = document) {
  const onClick = (event: Event) => {
    if (!(event instanceof MouseEvent)) return;
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const anchor = (event.target as Element | null)?.closest('a[href^="#"]');
    if (!(anchor instanceof HTMLAnchorElement)) return;

    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;

    const id = href.slice(1);
    if (!id || !document.getElementById(id)) return;

    event.preventDefault();
    smoothScrollToId(href);

    // Keep the hash in the URL without triggering a jump.
    window.history.pushState(null, '', href);
  };

  root.addEventListener('click', onClick, true);
  return () => root.removeEventListener('click', onClick, true);
}

export function handleSmoothScrollClick(
  event: ReactMouseEvent<HTMLAnchorElement>,
  href: string,
  onClick?: MouseEventHandler<HTMLAnchorElement>,
) {
  if (event.defaultPrevented) return false;
  onClick?.(event);
  if (event.defaultPrevented || !href.startsWith('#')) return false;
  event.preventDefault();
  smoothScrollToId(href);
  window.history.pushState(null, '', href);
  return true;
}

'use client';

import { useLayoutEffect } from 'react';
import { bindSmoothScrollAnchors } from '@/utils/smoothScroll';

/** Intercepts in-page hash links so every section jump uses the eased scroll animation. */
export function SmoothScrollRoot() {
  useLayoutEffect(() => bindSmoothScrollAnchors(), []);
  return null;
}

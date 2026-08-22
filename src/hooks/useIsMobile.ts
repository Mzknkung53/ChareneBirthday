'use client';

import { useEffect, useState } from 'react';

/** Used to thin out decorative particles on small screens. */
export function useIsMobile(breakpoint = 640): boolean {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: ' + breakpoint + 'px)');
    setMobile(mq.matches);
    const onChange = () => setMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [breakpoint]);

  return mobile;
}

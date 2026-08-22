'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { BirthdayFireworks } from '@/components/birthday/BirthdayFireworks';

interface BirthdayCelebrationProps {
  showEffects: boolean;
  fireKey: number;
}

export function BirthdayCelebration({ showEffects, fireKey }: BirthdayCelebrationProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !showEffects || fireKey === 0) return null;

  return createPortal(
    <BirthdayFireworks sessionKey={fireKey} />,
    document.body,
  );
}

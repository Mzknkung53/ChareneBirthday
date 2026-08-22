import { Suspense } from 'react';
import { ChareneAdminHeader } from '@/components/charene/ChareneAdminHeader';
import { ChareneWishReader } from '@/components/charene/ChareneWishReader';

export const metadata = {
  title: 'Focus — Charene',
  robots: { index: false, follow: false },
};

export default function ChareneReaderPage() {
  return (
    <main className="min-h-screen pb-[env(safe-area-inset-bottom)]">
      <ChareneAdminHeader active="focus" label="Focus view" />
      <Suspense fallback={<div className="mx-auto h-[420px] max-w-reading animate-pulse rounded-feature bg-pink-100/60" />}>
        <ChareneWishReader />
      </Suspense>
    </main>
  );
}

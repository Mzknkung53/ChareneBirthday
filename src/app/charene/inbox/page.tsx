import Link from 'next/link';
import { ChareneInbox } from '@/components/charene/ChareneInbox';
import { SITE } from '@/data/site';

export const metadata = {
  title: 'Inbox — Charene',
  robots: { index: false, follow: false },
};

export default function ChareneInboxPage() {
  return (
    <main className="min-h-screen pb-[env(safe-area-inset-bottom)]">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/70 px-4 py-3 backdrop-blur-md sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-container items-center justify-between gap-4">
          <Link href="/" className="font-display text-lg text-rose-600 no-underline hover:text-rose-500">
            ← {SITE.name}
          </Link>
          <span className="text-xs uppercase tracking-[0.14em] text-ink-300">Admin inbox</span>
        </div>
      </header>
      <ChareneInbox />
    </main>
  );
}

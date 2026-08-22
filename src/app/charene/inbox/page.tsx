import { ChareneAdminHeader } from '@/components/charene/ChareneAdminHeader';
import { ChareneInbox } from '@/components/charene/ChareneInbox';

export const metadata = {
  title: 'Inbox — Charene',
  robots: { index: false, follow: false },
};

export default function ChareneInboxPage() {
  return (
    <main className="min-h-screen pb-[env(safe-area-inset-bottom)]">
      <ChareneAdminHeader active="grid" />
      <ChareneInbox />
    </main>
  );
}

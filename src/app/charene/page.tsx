import { ChareneDashboard } from '@/components/charene/ChareneDashboard';

export const metadata = {
  title: 'Charene — Birthday Wishes',
  robots: { index: false, follow: false },
};

export default function CharenePage() {
  return (
    <main className="min-h-screen pb-[env(safe-area-inset-bottom)]">
      <ChareneDashboard />
    </main>
  );
}

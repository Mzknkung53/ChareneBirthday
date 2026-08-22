import Link from 'next/link';
import { SITE } from '@/data/site';
import { cn } from '@/utils/cn';

type AdminView = 'grid' | 'focus';

interface ChareneAdminHeaderProps {
  active: AdminView;
  label?: string;
}

const views: { id: AdminView; href: string; label: string }[] = [
  { id: 'focus', href: '/charene/reader', label: 'Focus' },
  { id: 'grid', href: '/charene/inbox', label: 'Grid' },
];

export function ChareneAdminHeader({ active, label = 'Admin inbox' }: ChareneAdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/70 px-4 py-3 backdrop-blur-md sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-container gap-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="font-display text-lg text-rose-600 no-underline hover:text-rose-500">
            ← {SITE.name}
          </Link>
          <span className="text-xs uppercase tracking-[0.14em] text-ink-300">{label}</span>
        </div>

        <nav aria-label="Inbox views" className="flex gap-2">
          {views.map((view) => {
            const isActive = active === view.id;

            return (
              <Link
                key={view.id}
                href={view.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'inline-flex min-h-[40px] min-w-[5.5rem] items-center justify-center rounded-full border px-5',
                  'font-ui text-sm font-medium leading-none no-underline transition-colors',
                  isActive
                    ? 'border-rose-500 bg-rose-500 !text-white hover:border-rose-600 hover:bg-rose-600 hover:!text-white'
                    : 'border-pink-200 bg-white !text-ink-500 hover:border-rose-300 hover:bg-rose-50 hover:!text-rose-700',
                )}
              >
                {view.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

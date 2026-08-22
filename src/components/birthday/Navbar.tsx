'use client';

import { Button } from '@/components/ui/Button';
import { InboxNavLink } from '@/components/ui/NavPageLink';
import { SmoothScrollLink } from '@/components/ui/SmoothScrollLink';
import { SITE } from '@/data/site';

const links = [
  { href: '#write', label: 'Write' },
  { href: '#message', label: 'Message' },
  { href: '#memories', label: 'Memories' },
];

export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-2 border-b border-white/70 bg-white/70 px-4 py-3 backdrop-blur-md sm:gap-6 sm:px-8 lg:px-12">
      <SmoothScrollLink
        href="#top"
        className="flex items-center gap-2.5 font-display text-[clamp(17px,4vw,22px)] font-semibold !text-rose-600 no-underline hover:!text-rose-500"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/Charene-Profile.png"
          alt=""
          width={32}
          height={32}
          className="h-8 w-8 rounded-full border-2 border-white/90 object-cover object-top shadow-soft"
        />
        {SITE.name} <span className="text-pink-400">♡</span>
      </SmoothScrollLink>

      <div className="flex flex-wrap items-center gap-1 text-sm sm:gap-3">
        {links.map((l) => (
          <SmoothScrollLink
            key={l.href}
            href={l.href}
            className="min-h-[44px] px-2 font-ui !text-ink-300 no-underline hover:!text-rose-600"
          >
            {l.label}
          </SmoothScrollLink>
        ))}
        <Button href="#write" size="sm" iconRight="♡">
          Write a wish
        </Button>
        <InboxNavLink />
      </div>
    </nav>
  );
}

'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { InboxNavLink } from '@/components/ui/NavPageLink';
import { SmoothScrollLink } from '@/components/ui/SmoothScrollLink';
import { SITE } from '@/data/site';

const links = [
  { href: '#write', label: 'Write' },
  { href: '#message', label: 'Message' },
  { href: '#memories', label: 'Memories' },
];

function NavLogo() {
  return (
    <SmoothScrollLink
      href="#top"
      className="flex shrink-0 items-center gap-2.5 font-display text-[clamp(17px,4vw,22px)] font-semibold !text-rose-600 no-underline hover:!text-rose-500"
    >
      <Image
        src="/images/Charene-Profile.png"
        alt=""
        width={32}
        height={32}
        className="h-8 w-8 rounded-full border-2 border-white/90 object-cover object-top shadow-soft"
      />
      {SITE.name} <span className="text-pink-400">♡</span>
    </SmoothScrollLink>
  );
}

function NavActions({ compact = false }: { compact?: boolean }) {
  return (
    <>
      {links.map((l) => (
        <SmoothScrollLink
          key={l.href}
          href={l.href}
          className="shrink-0 min-h-[44px] px-2 font-ui !text-ink-300 no-underline hover:!text-rose-600"
        >
          {l.label}
        </SmoothScrollLink>
      ))}
      <Button href="#write" size="sm" iconRight="♡" className="shrink-0 whitespace-nowrap px-3.5 sm:px-4">
        {compact ? 'Wish' : 'Write a wish'}
      </Button>
    </>
  );
}

export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-white/70 bg-white/70 px-4 py-3 backdrop-blur-md sm:px-8 lg:px-12">
      <div className="sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <NavLogo />
          <InboxNavLink />
        </div>
        <div className="mt-2.5 flex items-center gap-0.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <NavActions compact />
        </div>
      </div>

      <div className="hidden sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:gap-6">
        <NavLogo />
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <NavActions />
          <InboxNavLink />
        </div>
      </div>
    </nav>
  );
}

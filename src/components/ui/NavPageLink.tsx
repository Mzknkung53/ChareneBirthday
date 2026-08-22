'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageTransitionOverlay } from '@/components/ui/PageTransitionOverlay';
import { cn } from '@/utils/cn';

interface NavPageLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  loadingLabel?: string;
}

const NAV_DELAY_MS = 320;

export function NavPageLink({ href, loadingLabel = 'Opening…', onClick, className, children, ...rest }: NavPageLinkProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <>
      <PageTransitionOverlay open={loading} label={loadingLabel} />
      <a
        href={href}
        className={className}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented || loading) return;
          event.preventDefault();
          setLoading(true);
          window.setTimeout(() => router.push(href), NAV_DELAY_MS);
        }}
        {...rest}
      >
        {children}
      </a>
    </>
  );
}

interface InboxNavLinkProps {
  className?: string;
  showLabel?: boolean;
}

export function InboxNavLink({ className, showLabel = true }: InboxNavLinkProps) {
  return (
    <NavPageLink
      href="/charene/reader"
      loadingLabel="Opening inbox…"
      aria-label="Admin inbox — sign in to read wishes"
      className={cn(
        'inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-lavender-200/80 bg-white/60 px-3.5',
        'text-sm !text-[#8A73C8] no-underline transition-[transform,background-color,color] duration-300 ease-glide',
        'hover:scale-105 hover:bg-white/90 hover:!text-[#6F5BB0] active:scale-[0.97]',
        className,
      )}
    >
      <span aria-hidden="true">✧</span>
      {showLabel ? <span className="hidden sm:inline">Inbox</span> : null}
    </NavPageLink>
  );
}

'use client';

import { cn } from '@/utils/cn';
import { handleSmoothScrollClick } from '@/utils/smoothScroll';

interface SmoothScrollLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  interactive?: boolean;
}

export function SmoothScrollLink({
  href,
  onClick,
  className,
  interactive = true,
  children,
  ...rest
}: SmoothScrollLinkProps) {
  return (
    <a
      href={href}
      onClick={(event) => handleSmoothScrollClick(event, href, onClick)}
      className={cn(
        interactive &&
          'inline-flex items-center transition-[transform,color] duration-300 ease-glide hover:scale-105 active:scale-[0.97]',
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}

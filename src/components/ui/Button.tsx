'use client';

import { cn } from '@/utils/cn';
import { handleSmoothScrollClick } from '@/utils/smoothScroll';

type Variant = 'primary' | 'secondary' | 'cyan' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary:
    'grad-primary !text-white shadow-glow hover:shadow-[0_14px_34px_rgba(242,115,159,.45)] hover:!text-white active:!text-white',
  secondary: 'glass !text-rose-600 border-pink-200 hover:bg-white/80 hover:!text-rose-600',
  cyan: 'text-white shadow-[0_8px_24px_rgba(127,209,230,.4)] bg-gradient-to-br from-sky-300 to-cyan-400',
  ghost: '!text-rose-600 hover:bg-pink-100/70 hover:!text-rose-600',
};

const sizes: Record<Size, string> = {
  sm: 'min-h-[40px] px-4 text-sm',
  md: 'min-h-[44px] px-5 text-[15px]',
  lg: 'min-h-[56px] px-7 text-base',
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  iconRight?: string;
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AnchorProps = BaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button(props: ButtonProps | AnchorProps) {
  const { variant = 'primary', size = 'md', iconRight, fullWidth, loading, className, children, ...rest } = props;

  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-ui font-medium no-underline',
    'transition-[transform,box-shadow,background-color] duration-300 ease-glide',
    'hover:scale-[1.05] hover:-translate-y-0.5',
    'active:scale-[0.96] active:translate-y-0',
    'disabled:pointer-events-none disabled:opacity-60',
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    className,
  );

  const content = (
    <>
      {loading ? <span className="animate-twinkle">✧</span> : null}
      <span>{children}</span>
      {iconRight ? <span aria-hidden="true">{iconRight}</span> : null}
    </>
  );

  if (typeof (props as AnchorProps).href === 'string') {
    const anchorRest = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    const href = (props as AnchorProps).href;

    return (
      <a
        className={classes}
        {...anchorRest}
        href={href}
        onClick={(event) => handleSmoothScrollClick(event, href, anchorRest.onClick)}
      >
        {content}
      </a>
    );
  }

  const buttonRest = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" className={classes} {...buttonRest} disabled={loading || buttonRest.disabled}>
      {content}
    </button>
  );
}

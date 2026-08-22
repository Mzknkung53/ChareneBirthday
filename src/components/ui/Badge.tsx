import { cn } from '@/utils/cn';

interface BadgeProps {
  tone?: 'pink' | 'blue' | 'gold' | 'lavender';
  icon?: string;
  uppercase?: boolean;
  className?: string;
  children: React.ReactNode;
}

const tones = {
  pink: 'bg-pink-100/80 text-rose-600 border-pink-200',
  blue: 'bg-sky-100/90 text-[#3C8FB0] border-sky-200',
  gold: 'bg-[#FFF6E6]/90 text-[#A8822F] border-[rgba(223,185,100,.5)]',
  lavender: 'bg-lavender-200/60 text-[#7A63BC] border-lavender-200',
};

export function Badge({ tone = 'pink', icon, uppercase, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs',
        uppercase && 'uppercase tracking-[0.16em]',
        tones[tone],
        className,
      )}
    >
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      {children}
    </span>
  );
}

import { cn } from '@/utils/cn';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tint?: 'clear' | 'pink' | 'blue' | 'cream';
  as?: 'div' | 'section' | 'article';
}

const tints: Record<NonNullable<GlassCardProps['tint']>, string> = {
  clear: '',
  pink: 'bg-gradient-to-br from-white/74 to-pink-300/25',
  blue: 'bg-gradient-to-br from-white/74 to-sky-200/35',
  cream: 'bg-gradient-to-br from-white/80 to-cream/90',
};

export function GlassCard({ tint = 'clear', as: Tag = 'div', className, children, ...rest }: GlassCardProps) {
  return (
    <Tag className={cn('glass rounded-feature shadow-card', tints[tint], className)} {...rest}>
      {children}
    </Tag>
  );
}

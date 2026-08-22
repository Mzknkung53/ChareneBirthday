import { cn } from '@/utils/cn';
import { SITE } from '@/data/site';

const tones = {
  pink: 'border-pink-200 text-rose-600',
  blue: 'border-sky-200 text-[#3C8FB0]',
  lavender: 'border-lavender-200 text-[#8A73C8]',
};

export function Footer() {
  return (
    <footer className="mt-14 grid justify-items-center gap-5 border-t border-pink-200/70 px-4 pb-11 pt-14 text-center sm:mt-20 sm:px-8 sm:pt-20 lg:mt-28">
      <p className="font-display text-[clamp(19px,3vw,22px)] text-rose-600">Made with ♡ for {SITE.name}</p>

      <div className="flex flex-wrap justify-center gap-2.5">
        {SITE.links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'flex min-h-[44px] items-center gap-2 rounded-full border bg-white/75 px-5 text-sm no-underline',
              'transition-transform duration-200 hover:-translate-y-0.5',
              tones[l.tone],
            )}
          >
            <span aria-hidden="true">{l.glyph}</span>
            {l.label}
          </a>
        ))}
      </div>

      <p className="text-[13px] text-ink-300">A fan project · not an official page</p>
    </footer>
  );
}

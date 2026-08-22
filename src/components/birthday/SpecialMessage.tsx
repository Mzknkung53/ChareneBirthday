import { Badge } from '@/components/ui/Badge';
import { SITE } from '@/data/site';

export function SpecialMessage() {
  const { from, title, paragraphs } = SITE.specialMessage;

  return (
    <section className="mx-auto mt-14 max-w-[900px] px-4 sm:mt-20 sm:px-8 lg:mt-28 lg:px-12">
      <article className="grid justify-items-center gap-5 rounded-special border border-[rgba(223,185,100,.38)] bg-gradient-to-br from-white/90 via-pink-100/80 to-sky-100/85 p-7 text-center shadow-[0_18px_44px_rgba(180,126,158,.18),0_0_60px_rgba(223,185,100,.18)] backdrop-blur sm:p-12">
        <Badge tone="gold" icon="✨" uppercase>
          Special message
        </Badge>
        <h2 className="font-display text-[clamp(26px,4.5vw,38px)] font-medium text-ink-900">{title}</h2>
        <div className="grid max-w-[56ch] gap-4 text-pretty text-[clamp(16px,1.8vw,18px)] leading-[1.9] text-ink-700">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <p className="font-display text-lg text-rose-600">— {from}</p>
      </article>
    </section>
  );
}

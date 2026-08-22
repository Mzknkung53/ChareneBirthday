interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  sub?: string;
  id?: string;
}

export function SectionHeading({ eyebrow, title, sub, id }: SectionHeadingProps) {
  return (
    <header className="mb-8 grid justify-items-center gap-3 text-center sm:mb-9">
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2 id={id} className="font-display text-[clamp(27px,4.5vw,40px)] font-medium leading-tight text-ink-900">
        {title}
      </h2>
      {sub ? <p className="max-w-[46ch] text-pretty leading-[1.8] text-ink-300">{sub}</p> : null}
    </header>
  );
}

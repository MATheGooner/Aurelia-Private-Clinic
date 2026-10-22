type Props = { eyebrow?: string; title: string; intro?: string };

export function SectionHeading({ eyebrow, title, intro }: Props) {
  return <div className="max-w-2xl space-y-4">
    {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>}
    <h2 className="font-display text-4xl leading-tight text-ink sm:text-5xl">{title}</h2>
    {intro && <p className="max-w-xl text-lg leading-8 text-muted">{intro}</p>}
  </div>;
}

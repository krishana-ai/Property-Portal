import { IMG } from "@/lib/site/images";
import { ParallaxImage } from "./motion/parallax-image";
import { Reveal } from "./motion/reveal";
import { SplitText } from "./motion/split-text";

/** Dark full-bleed intro used by secondary pages that sit under the transparent header. */
export function PageHero({ eyebrow, title, description, image = IMG.jaipurSkyline }: { eyebrow: string; title: string; description?: string; image?: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink-950 pb-20 pt-40 text-white lg:pb-28 lg:pt-48">
      <ParallaxImage src={image} alt="" className="absolute inset-0 -z-10 opacity-40" priority amount={14} />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/70 via-ink-950/60 to-ink-950" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal><p className="eyebrow text-brass-300">{eyebrow}</p></Reveal>
        <SplitText as="h1" immediate text={title} className="mt-5 block max-w-4xl font-display text-[clamp(2.4rem,6vw,4.8rem)] leading-[1] tracking-[-0.02em]" />
        {description && (
          <Reveal delay={0.4}><p className="mt-6 max-w-xl text-lg text-white/70">{description}</p></Reveal>
        )}
      </div>
    </section>
  );
}

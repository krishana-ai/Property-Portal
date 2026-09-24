import { DEVELOPERS, STATS } from "@/lib/site/content";
import { Counter } from "../motion/counter";
import { Marquee } from "../motion/marquee";
import { Stagger, StaggerItem } from "../motion/reveal";
import { SplitText } from "../motion/split-text";

export function StatsBand() {
  return (
    <section className="grain relative overflow-hidden bg-ink-900 py-24 text-white lg:py-28">
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-brass-500/10 blur-[120px]" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SplitText
          as="h2"
          text="Numbers we are accountable for — not vanity metrics."
          className="block max-w-3xl font-display text-[clamp(1.8rem,3.6vw,3rem)] leading-[1.08]"
        />

        <Stagger className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-white/10 lg:grid-cols-4">
          {STATS.map((s) => (
            <StaggerItem key={s.label} className="bg-ink-900 p-6 sm:p-8">
              <Counter value={s.value} suffix={s.suffix} className="block font-display text-[clamp(2.4rem,5vw,4rem)] leading-none text-brass-300" />
              <p className="mt-4 text-sm font-semibold">{s.label}</p>
              <p className="mt-1 text-xs text-white/50">{s.note}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <div className="relative mt-20">
        <p className="mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">Projects from Jaipur&apos;s trusted developers</p>
        <Marquee duration={45}>
          {DEVELOPERS.map((d) => (
            <span key={d} className="mx-8 whitespace-nowrap font-display text-2xl text-white/35 transition-colors hover:text-white sm:text-3xl">
              {d}
              <span className="ml-16 text-brass-500/60">✦</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

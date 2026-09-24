import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { IMG } from "@/lib/site/images";
import { Magnetic } from "../motion/magnetic";
import { ParallaxImage } from "../motion/parallax-image";
import { Reveal } from "../motion/reveal";
import { SplitText } from "../motion/split-text";

const POINTS = ["Free to post, always", "Guided 8-minute listing", "Leads with context, not just a number", "Dashboard for views, leads & visits"];

export function SellerCta() {
  return (
    <section className="px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-ink-950 text-white">
        <ParallaxImage src={IMG.townhouses} alt="" className="absolute inset-0 opacity-45" amount={10} />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/20" />
        <div className="relative grid gap-10 p-8 sm:p-14 lg:grid-cols-2 lg:p-20">
          <div>
            <Reveal><p className="eyebrow text-brass-300">For owners & agents</p></Reveal>
            <SplitText as="h2" text="List once. Hear from people who are serious." className="mt-4 block font-display text-[clamp(2.2rem,4.6vw,3.8rem)] leading-[1.02]" />
            <Reveal delay={0.2}>
              <ul className="mt-8 grid gap-3 text-white/80 sm:grid-cols-2">
                {POINTS.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brass-400" /> {p}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.3} className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic>
                <Link href="/post-property" className="group inline-flex items-center gap-3 rounded-full bg-brass-500 py-4 pl-7 pr-4 font-semibold text-ink-900 transition hover:bg-brass-400">
                  Post your property
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-ink-900 text-brass-300 transition-transform duration-500 group-hover:rotate-[-45deg]">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </Magnetic>
              <Link href="/account" className="text-sm font-medium text-white/70 underline-offset-4 hover:text-white hover:underline">
                Go to my account
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { blurProps } from "@/lib/site/images";
import Link from "next/link";
import { CATEGORIES } from "@/lib/site/content";
import { cn } from "@/lib/utils";
import { Stagger, StaggerItem } from "../motion/reveal";
import { SectionHeading } from "../section-heading";

/** Bento grid — the first two tiles are larger to anchor the layout. */
const SPANS = ["lg:col-span-2 lg:row-span-2", "lg:col-span-2", "", "", "lg:col-span-2", "lg:col-span-2"];

export function Categories() {
  return (
    <section id="discover" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <SectionHeading
        eyebrow="Browse by what you need"
        title="Every kind of space, one honest search."
        description="Buyers, renters, students and businesses each get filters built for their journey."
      />

      <Stagger className="mt-14 grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[240px] lg:grid-cols-6" stagger={0.07}>
        {CATEGORIES.map((c, i) => (
          <StaggerItem key={c.title} className={cn("group relative overflow-hidden rounded-3xl", SPANS[i])}>
            <Link href={c.href} className="absolute inset-0 z-10" aria-label={`Browse ${c.title}`} />
            <Image
              src={c.image}
              {...blurProps(c.image)}
              alt=""
              fill
              sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-white">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">{c.count}</p>
                <h3 className={cn("mt-1 font-display leading-tight", i === 0 ? "text-4xl" : "text-2xl")}>{c.title}</h3>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white/15 backdrop-blur transition-all duration-500 group-hover:rotate-45 group-hover:bg-brass-500 group-hover:text-ink-900">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

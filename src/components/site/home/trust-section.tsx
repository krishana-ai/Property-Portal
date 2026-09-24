import { BadgeCheck, FileCheck2, ShieldAlert, Sparkles, User, UserCheck } from "lucide-react";
import { TRUST_BADGES } from "@/lib/site/content";
import { cn } from "@/lib/utils";
import { Reveal, Stagger, StaggerItem } from "../motion/reveal";
import { SectionHeading } from "../section-heading";

const ICONS = { verified: BadgeCheck, rera: FileCheck2, owner: User, certified: UserCheck, featured: Sparkles } as const;
const TONES = {
  verified: "bg-emerald-50 text-emerald-700",
  rera: "bg-sky-50 text-sky-700",
  owner: "bg-ink-900/5 text-ink-700",
  certified: "bg-violet-50 text-violet-700",
  featured: "bg-ink-900 text-brass-300",
} as const;

export function TrustSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Trust, spelled out"
            title="One badge, one meaning. No green ticks for sale."
            description="Most portals blur “verified” with “paid”. We keep every signal separate so you always know what was actually checked."
          />
          <Reveal delay={0.2} className="mt-10 rounded-3xl bg-amber-50 p-6 ring-1 ring-amber-600/15">
            <div className="flex gap-4">
              <ShieldAlert className="h-6 w-6 shrink-0 text-amber-700" />
              <div className="text-sm leading-relaxed text-amber-900">
                <p className="font-semibold">Stay safe</p>
                <p className="mt-1">Never pay a token amount before visiting the property and checking documents. Our team will never ask for your OTP.</p>
              </div>
            </div>
          </Reveal>
        </div>

        <Stagger className="grid gap-4 sm:grid-cols-2" stagger={0.1}>
          {TRUST_BADGES.map((b, i) => {
            const Icon = ICONS[b.key as keyof typeof ICONS];
            return (
              <StaggerItem
                key={b.key}
                className={cn(
                  "group rounded-3xl bg-white p-6 ring-1 ring-ink-900/[0.06] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgb(11_17_32/0.4)]",
                  i === TRUST_BADGES.length - 1 && "sm:col-span-2 bg-ink-900 text-white ring-0",
                )}
              >
                <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold", TONES[b.key as keyof typeof TONES])}>
                  <Icon className="h-4 w-4 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" /> {b.title}
                </span>
                <p className={cn("mt-4 text-sm leading-relaxed", i === TRUST_BADGES.length - 1 ? "text-white/70" : "text-ink-600")}>{b.body}</p>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

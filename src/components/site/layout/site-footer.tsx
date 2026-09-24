import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { BRAND, FOOTER_COLUMNS } from "@/lib/site/content";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="grain relative overflow-hidden bg-ink-950 text-white/70">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 pb-28 pt-20 sm:px-6 lg:px-8 lg:pb-12">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-sm">
            <Logo tone="light" />
            <p className="mt-5 text-sm leading-relaxed">
              A trusted property marketplace for Jaipur — verified homes, honest prices and sellers who reply.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brass-400" />{BRAND.address}</li>
              <li><a href={`tel:${BRAND.phone.replace(/\s/g, "")}`} className="flex gap-3 hover:text-white"><Phone className="h-4 w-4 text-brass-400" />{BRAND.phone}</a></li>
              <li><a href={`mailto:${BRAND.email}`} className="flex gap-3 hover:text-white"><Mail className="h-4 w-4 text-brass-400" />{BRAND.email}</a></li>
            </ul>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white">{col.title}</h3>
              <ul className="mt-5 space-y-3 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="group inline-flex items-center gap-1 transition-colors hover:text-white">
                      {l.label}
                      <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-16 select-none font-display text-[clamp(4rem,16vw,13rem)] leading-[0.8] tracking-tight text-white/[0.06]" aria-hidden>
          Anavrin
        </p>

        <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {BRAND.full}. All rights reserved.</p>
          <p className="text-white/50">
            Never pay before visiting a property or verifying documents. We will never ask for your OTP.
          </p>
        </div>
      </div>
    </footer>
  );
}

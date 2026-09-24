"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Heart, Home, Loader2, LogOut, Phone, PlusCircle, Search, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { loginHref, useCustomerSession } from "@/hooks/use-customer-session";
import { useSavedProperties } from "@/hooks/use-saved-properties";
import { PROPERTIES } from "@/lib/site/catalog";
import { initials } from "@/lib/site/format";
import { EASE_OUT, Stagger, StaggerItem } from "../motion/reveal";
import { PropertyCard } from "../property/property-card";

export function AccountView() {
  const router = useRouter();
  const { customer, ready, signOut } = useCustomerSession();
  const { saved } = useSavedProperties();

  useEffect(() => {
    if (ready && !customer) router.replace(loginHref("/account"));
  }, [ready, customer, router]);

  if (!customer) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-ink-600" />
      </div>
    );
  }

  const shortlist = PROPERTIES.filter((p) => saved.includes(p.slug)).slice(0, 3);
  const isSeller = customer.role === "Owner" || customer.role === "Agent";
  const shortcuts = [
    { href: "/saved", icon: Heart, label: "Saved properties", note: `${saved.length} shortlisted` },
    { href: "/search?intent=buy", icon: Search, label: "Find a home", note: "Buy, rent, PG, plots" },
    { href: "/post-property", icon: PlusCircle, label: isSeller ? "Post a property" : "Selling or renting out?", note: "Free, about 8 minutes" },
    { href: "/projects", icon: Home, label: "New projects", note: "RERA-registered launches" },
  ];

  function logout() {
    signOut();
    router.replace("/");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-32 pt-32 sm:px-6 lg:px-8 lg:pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
        className="grain relative overflow-hidden rounded-[32px] bg-ink-900 p-8 text-white sm:p-12"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brass-500/20 blur-[90px]" aria-hidden />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-brass-500 font-display text-2xl text-ink-900">
              {initials(customer.name)}
            </span>
            <div>
              <p className="text-sm text-white/60">Namaste,</p>
              <h1 className="font-display text-4xl leading-tight">{customer.name}</h1>
              <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/65">
                <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> +91 {customer.phone.slice(0, 5)} {customer.phone.slice(5)}</span>
                <span className="inline-flex items-center gap-1.5"><UserRound className="h-3.5 w-3.5" /> {customer.role}</span>
                <span>Member since {new Date(customer.since).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
              </p>
            </div>
          </div>
          <button type="button" onClick={logout} className="inline-flex items-center gap-2 self-start rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium transition hover:bg-white hover:text-ink-900 sm:self-auto">
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </motion.div>

      <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {shortcuts.map((s) => (
          <StaggerItem key={s.label}>
            <Link href={s.href} className="group flex h-full items-start justify-between gap-4 rounded-3xl bg-white p-6 ring-1 ring-ink-900/[0.06] transition hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgb(11_17_32/0.4)]">
              <div>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brass-100 text-brass-700"><s.icon className="h-5 w-5" /></span>
                <p className="mt-4 font-semibold text-ink-900">{s.label}</p>
                <p className="mt-0.5 text-sm text-ink-600">{s.note}</p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-ink-600 transition group-hover:rotate-45 group-hover:text-ink-900" />
            </Link>
          </StaggerItem>
        ))}
      </Stagger>

      <section className="mt-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-brass-700">Your shortlist</p>
            <h2 className="mt-3 font-display text-3xl text-ink-900">Recently saved</h2>
          </div>
          {saved.length > 0 && <Link href="/saved" className="text-sm font-semibold text-ink-900 hover:underline">View all ({saved.length})</Link>}
        </div>
        {shortlist.length ? (
          <Stagger className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shortlist.map((p) => <StaggerItem key={p.slug}><PropertyCard property={p} /></StaggerItem>)}
          </Stagger>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-ink-900/15 p-10 text-center">
            <p className="text-ink-600">Tap the heart on any property and it will appear here.</p>
            <Link href="/search" className="mt-5 inline-flex rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-800">Start exploring</Link>
          </div>
        )}
      </section>
    </div>
  );
}

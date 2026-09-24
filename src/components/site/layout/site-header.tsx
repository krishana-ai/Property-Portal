"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Heart, Menu, Phone, Plus, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { loginHref, useCustomerSession } from "@/hooks/use-customer-session";
import { useSavedProperties } from "@/hooks/use-saved-properties";
import { BRAND, NAV_LINKS } from "@/lib/site/content";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "../motion/reveal";
import { AccountMenu } from "./account-menu";
import { Logo } from "./logo";
import { useLenis } from "./smooth-scroll";

/** Pages whose first section is a full-bleed dark hero the header can sit on. */
const OVERLAY_ROUTES = ["/", "/projects"];

export function SiteHeader() {
  const pathname = usePathname();
  const params = useSearchParams();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const { saved } = useSavedProperties();
  const { customer, signOut } = useCustomerSession();
  const lenis = useLenis();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    // Hide on scroll down, reveal on scroll up — keeps content in focus.
    setHidden(y > 320 && y > prev && !open);
  });

  useEffect(() => setOpen(false), [pathname, params]);
  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open, lenis]);

  // Transparent + light over dark heroes, and always while the dark mobile menu is open.
  const overlay = (OVERLAY_ROUTES.includes(pathname) && !scrolled) || open;
  const currentHref = `${pathname}${params.toString() ? `?${params}` : ""}`;

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500",
          overlay ? "bg-transparent" : "bg-sand-50/85 shadow-[0_1px_0_rgb(11_17_32/0.08)] backdrop-blur-xl",
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          <Logo tone={overlay ? "light" : "dark"} className="shrink-0" />

          <nav aria-label="Primary" className="ml-4 hidden items-center lg:flex">
            {NAV_LINKS.map((link) => {
              const active = currentHref.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group relative whitespace-nowrap rounded-full px-3 py-2 text-[13.5px] font-medium transition-colors",
                    overlay ? "text-white/80 hover:text-white" : "text-ink-700 hover:text-ink-900",
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute inset-x-3.5 -bottom-0.5 h-px origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100",
                      overlay ? "bg-white" : "bg-brass-600",
                      active && "scale-x-100",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <a
              href={`tel:${BRAND.phone.replace(/\s/g, "")}`}
              className={cn(
                "hidden items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-medium 2xl:flex",
                overlay ? "text-white/80 hover:text-white" : "text-ink-700 hover:text-ink-900",
              )}
            >
              <Phone className="h-4 w-4" /> {BRAND.phone}
            </a>
            <Link
              href="/saved"
              aria-label={`Saved properties (${saved.length})`}
              className={cn(
                "relative grid h-10 w-10 place-items-center rounded-full transition-colors",
                overlay ? "text-white hover:bg-white/10" : "text-ink-800 hover:bg-ink-900/5",
              )}
            >
              <Heart className="h-[18px] w-[18px]" />
              <AnimatePresence>
                {saved.length > 0 && (
                  <motion.span
                    key={saved.length}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brass-500 px-1 text-[10px] font-bold text-ink-900"
                  >
                    {saved.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            <AccountMenu overlay={overlay} returnTo={currentHref} />
            <Link
              href="/post-property"
              className="group hidden items-center gap-2 whitespace-nowrap rounded-full bg-brass-500 py-2 pl-4 pr-2 text-[13.5px] font-semibold text-ink-900 transition hover:bg-brass-400 sm:inline-flex"
            >
              Post property
              <span className="rounded-full bg-ink-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brass-300">
                Free
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className={cn(
                "grid h-10 w-10 place-items-center rounded-full lg:hidden",
                overlay ? "text-white hover:bg-white/10" : "text-ink-900 hover:bg-ink-900/5",
              )}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="grain fixed inset-0 z-[45] flex flex-col bg-ink-900 px-6 pb-10 pt-28 text-white lg:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: EASE_OUT }}
                >
                  <Link href={link.href} className="flex items-baseline gap-4 border-b border-white/10 py-4 font-display text-3xl">
                    <span className="font-sans text-xs text-brass-400">0{i + 1}</span>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-auto grid gap-3"
            >
              <Link href="/post-property" className="flex items-center justify-center gap-2 rounded-full bg-brass-500 py-3.5 font-semibold text-ink-900">
                <Plus className="h-4 w-4" /> Post property — free
              </Link>
              {customer ? (
                <div className="flex gap-3">
                  <Link href="/account" className="flex-1 rounded-full border border-white/20 py-3.5 text-center font-medium">
                    My account
                  </Link>
                  <button type="button" onClick={() => { signOut(); setOpen(false); }} className="rounded-full border border-white/20 px-5 py-3.5 font-medium text-rose-300">
                    Log out
                  </button>
                </div>
              ) : (
                <Link href={loginHref(currentHref)} className="rounded-full border border-white/20 py-3.5 text-center font-medium">
                  Log in
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

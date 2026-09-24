"use client";

import { motion } from "motion/react";
import { Heart, Home, PlusCircle, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/saved", label: "Saved", icon: Heart },
  { href: "/post-property", label: "Post", icon: PlusCircle },
  { href: "/account", label: "Account", icon: User },
];

/** Mobile bottom navigation (spec §4) — search is always one tap away. */
export function MobileTabBar() {
  const pathname = usePathname();
  // The property page has its own sticky contact bar in this slot.
  if (pathname.startsWith("/property/") || pathname === "/login") return null;

  return (
    <nav
      aria-label="Mobile tabs"
      className="fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-ink-900/10 bg-white/90 p-1.5 shadow-[0_12px_40px_-12px_rgb(11_17_32/0.35)] backdrop-blur-xl lg:hidden"
    >
      <ul className="grid grid-cols-5">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link href={href} className="relative flex flex-col items-center gap-0.5 rounded-xl py-2 text-[10.5px] font-medium">
                {active && (
                  <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-xl bg-ink-900" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                )}
                <Icon className={cn("relative h-5 w-5", active ? "text-brass-400" : "text-ink-600")} />
                <span className={cn("relative", active ? "text-white" : "text-ink-600")}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

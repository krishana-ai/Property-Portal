"use client";

import { AnimatePresence, motion } from "motion/react";
import { Heart, LogOut, PlusCircle, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { loginHref, useCustomerSession } from "@/hooks/use-customer-session";
import { useSavedProperties } from "@/hooks/use-saved-properties";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/site/format";

/** Header control: "Log in" when signed out, avatar + menu when signed in. */
export function AccountMenu({ overlay, returnTo }: { overlay: boolean; returnTo: string }) {
  const { customer, ready, signOut } = useCustomerSession();
  const { saved } = useSavedProperties();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const tone = overlay ? "text-white hover:bg-white/10" : "text-ink-800 hover:bg-ink-900/5";

  // Reserve the space during hydration so the header doesn't jump.
  if (!ready) return <span className="hidden h-10 w-[76px] sm:inline-block" aria-hidden />;

  if (!customer) {
    return (
      <Link href={loginHref(returnTo)} className={cn("hidden whitespace-nowrap rounded-full px-4 py-2 text-[13.5px] font-medium sm:inline-flex", tone)}>
        Log in
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn("flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-[13.5px] font-medium transition", tone)}
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-brass-500 text-xs font-bold text-ink-900">{initials(customer.name)}</span>
        <span className="max-w-[110px] truncate">{customer.name.split(" ")[0]}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-[calc(100%+10px)] w-64 origin-top-right overflow-hidden rounded-2xl bg-white p-2 text-ink-900 shadow-2xl ring-1 ring-ink-900/10"
          >
            <div className="px-3 pb-3 pt-2">
              <p className="truncate font-semibold">{customer.name}</p>
              <p className="text-xs text-ink-600">+91 {customer.phone.slice(0, 5)} {customer.phone.slice(5)} · {customer.role}</p>
            </div>
            <div className="border-t border-ink-900/[0.06] pt-1">
              <MenuLink href="/account" icon={UserRound}>My account</MenuLink>
              <MenuLink href="/saved" icon={Heart}>Saved properties <span className="ml-auto text-xs text-ink-600">{saved.length}</span></MenuLink>
              <MenuLink href="/post-property" icon={PlusCircle}>Post a property</MenuLink>
            </div>
            <div className="mt-1 border-t border-ink-900/[0.06] pt-1">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  signOut();
                  setOpen(false);
                  if (pathname.startsWith("/account")) router.replace("/");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuLink({ href, icon: Icon, children }: { href: string; icon: typeof Heart; children: React.ReactNode }) {
  return (
    <Link href={href} role="menuitem" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-sand-100">
      <Icon className="h-4 w-4 text-ink-600" /> {children}
    </Link>
  );
}

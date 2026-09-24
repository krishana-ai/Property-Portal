"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand/brand-logo";
import { cn } from "@/lib/utils";
import { NAV_GROUPS } from "./nav-config";

export function Sidebar({ open, onNavigate }: { open: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-14 items-center justify-between gap-2 border-b border-slate-200 px-5">
        <Link href="/admin" aria-label="Admin dashboard" onClick={onNavigate} className="min-w-0">
          <BrandLogo size="sm" />
        </Link>
        <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-slate-500">
          Admin
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group, idx) => (
          <div
            key={group.label}
            className={cn("mb-4", idx > 0 && "border-t border-slate-100 pt-4")}
          >
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary-50 text-primary-600"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary-600" : "text-slate-400")} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

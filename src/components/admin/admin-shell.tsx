"use client";

import { type ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setMobileNavOpen, toggleMobileNav } from "@/lib/redux/slices/ui-slice";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { Footer } from "./footer";

export function AdminShell({ children }: { children: ReactNode }) {
  const mobileNavOpen = useAppSelector((state) => state.ui.mobileNavOpen);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar open={mobileNavOpen} onNavigate={() => dispatch(setMobileNavOpen(false))} />

      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
          onClick={() => dispatch(setMobileNavOpen(false))}
        />
      )}

      <div className="flex min-h-screen flex-col lg:pl-64">
        <Topbar onMenuClick={() => dispatch(toggleMobileNav())} />
        <main className="mx-auto w-full max-w-8xl flex-1 py-4 px-5">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

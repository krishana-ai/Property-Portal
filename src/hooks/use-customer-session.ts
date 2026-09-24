"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Website (customer) session — buyers, tenants, owners and agents.
 *
 * Completely separate from the admin session in Redux: logging in here never
 * grants access to /admin, and the admin login lives at /admin/login.
 * Persisted in localStorage until the OTP/auth API is connected.
 */
export type CustomerRole = "Buyer" | "Tenant" | "Owner" | "Agent";

export interface Customer {
  name: string;
  phone: string; // 10-digit Indian mobile, no country code
  role: CustomerRole;
  since: string; // ISO date of first login
}

const SESSION_KEY = "anavrin:customer";
const PROFILES_KEY = "anavrin:customer-profiles";
const listeners = new Set<() => void>();
let cache: Customer | null | undefined;

function read(): Customer | null {
  if (cache !== undefined) return cache;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    cache = raw ? (JSON.parse(raw) as Customer) : null;
  } catch {
    cache = null;
  }
  return cache;
}

function write(next: Customer | null) {
  cache = next;
  try {
    if (next) window.localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    else window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // Storage unavailable (private mode) — session lasts for this tab only.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === SESSION_KEY) {
      cache = undefined;
      listener();
    }
  };
  window.addEventListener("storage", onStorage); // keep other tabs in sync
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Returning users skip the "tell us about you" step. */
export function findProfile(phone: string): Omit<Customer, "phone"> | null {
  try {
    const all = JSON.parse(window.localStorage.getItem(PROFILES_KEY) ?? "{}") as Record<string, Omit<Customer, "phone">>;
    return all[phone] ?? null;
  } catch {
    return null;
  }
}

function rememberProfile(c: Customer) {
  try {
    const all = JSON.parse(window.localStorage.getItem(PROFILES_KEY) ?? "{}");
    all[c.phone] = { name: c.name, role: c.role, since: c.since };
    window.localStorage.setItem(PROFILES_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}

export function useCustomerSession() {
  // Server snapshot is `undefined` so the UI can tell "not loaded yet" from "logged out".
  const customer = useSyncExternalStore<Customer | null | undefined>(subscribe, read, () => undefined);

  const signIn = useCallback((c: Customer) => {
    rememberProfile(c);
    write(c);
  }, []);
  const signOut = useCallback(() => write(null), []);

  return { customer: customer ?? null, ready: customer !== undefined, signIn, signOut };
}

/* ─── Pending action: finish what the user started before logging in (spec §21) ─── */

export type PendingAction = { type: "save"; slug: string };
const PENDING_KEY = "anavrin:pending-action";

export function setPendingAction(action: PendingAction) {
  try {
    window.sessionStorage.setItem(PENDING_KEY, JSON.stringify(action));
  } catch {
    /* ignore */
  }
}

export function takePendingAction(): PendingAction | null {
  try {
    const raw = window.sessionStorage.getItem(PENDING_KEY);
    window.sessionStorage.removeItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as PendingAction) : null;
  } catch {
    return null;
  }
}

/**
 * Where to send the user after login. Only same-site, non-admin paths are
 * allowed — the website login must never redirect into the admin console.
 */
export function safeReturnPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/";
  if (next.startsWith("/admin") || next.startsWith("/login")) return "/";
  return next;
}

export function loginHref(returnTo: string) {
  return `/login?next=${encodeURIComponent(returnTo)}`;
}

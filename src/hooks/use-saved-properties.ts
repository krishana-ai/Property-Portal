"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Shortlist persisted in localStorage (spec §22 — saving must be instant and
 * reversible). Swap the storage calls for the favorites API once auth is wired.
 */
const KEY = "anavrin:saved";
const EMPTY: string[] = [];
const listeners = new Set<() => void>();
let cache: string[] | null = null;

function read(): string[] {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    cache = Array.isArray(parsed) ? parsed : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: string[]) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage can be unavailable (private mode); the in-memory cache still works.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Add a property to the shortlist outside React (used to finish a save after login). */
export function saveProperty(slug: string) {
  const current = read();
  if (!current.includes(slug)) write([...current, slug]);
}

export function useSavedProperties() {
  const saved = useSyncExternalStore(subscribe, read, () => EMPTY);

  const toggle = useCallback((slug: string) => {
    const current = read();
    write(current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]);
  }, []);

  const isSaved = useCallback((slug: string) => saved.includes(slug), [saved]);

  return { saved, toggle, isSaved };
}

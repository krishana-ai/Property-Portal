"use client";

import Lenis from "lenis";
import { MotionConfig } from "motion/react";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";

const LenisContext = createContext<React.MutableRefObject<Lenis | null> | null>(null);

/** Access the Lenis instance (e.g. to stop scrolling while a drawer is open). */
export function useLenis() {
  return useContext(LenisContext)?.current ?? null;
}

/**
 * Inertial smooth scrolling + global motion config. Both respect the user's
 * reduced-motion preference: Lenis is skipped entirely and Motion drops
 * transform animations.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), touchMultiplier: 1.4 });
    lenisRef.current = lenis;
    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // New page → start at the top without an animated scroll.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return (
    <LenisContext.Provider value={lenisRef}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LenisContext.Provider>
  );
}

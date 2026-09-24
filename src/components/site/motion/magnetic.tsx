"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";

/** Pulls its child gently toward the pointer — used on primary CTAs. */
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 15, mass: 0.2 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 15, mass: 0.2 });

  function onMove(e: React.PointerEvent) {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ x, y }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

/** Counts up from zero once when scrolled into view. */
export function Counter({ value, suffix = "", prefix = "", duration = 2, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;
    const format = (n: number) => `${prefix}${Math.round(n).toLocaleString("en-IN")}${suffix}`;
    if (reduced) {
      node.textContent = format(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (node.textContent = format(v)),
    });
    return () => controls.stop();
  }, [inView, value, suffix, prefix, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}

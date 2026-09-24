"use client";

import { motion, type HTMLMotionProps, type Variants } from "motion/react";

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

type Direction = "up" | "down" | "left" | "right" | "none";

const offset: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: 48 },
  right: { x: -48 },
  none: {},
};

interface RevealProps extends HTMLMotionProps<"div"> {
  from?: Direction;
  delay?: number;
  duration?: number;
  blur?: boolean;
  once?: boolean;
}

/** Fades and slides content in when it scrolls into view. */
export function Reveal({
  from = "up",
  delay = 0,
  duration = 0.9,
  blur = false,
  once = true,
  children,
  ...props
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, ...offset[from], filter: blur ? "blur(10px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration, delay, ease: EASE_OUT }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

const container: Variants = {
  hidden: {},
  show: (stagger: number = 0.08) => ({ transition: { staggerChildren: stagger } }),
};

const item: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
};

interface StaggerProps extends HTMLMotionProps<"div"> {
  stagger?: number;
}

/** Parent that reveals its <StaggerItem> children one after another. */
export function Stagger({ stagger = 0.08, children, ...props }: StaggerProps) {
  return (
    <motion.div
      variants={container}
      custom={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={item} {...props}>
      {children}
    </motion.div>
  );
}

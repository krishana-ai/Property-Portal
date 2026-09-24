"use client";

import { motion } from "motion/react";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "./reveal";

interface SplitTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  /** Animate on mount (hero) instead of when scrolled into view. */
  immediate?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

/**
 * Word-by-word masked reveal. The full sentence stays in the DOM as plain text
 * for screen readers and SEO; the animated copies are aria-hidden.
 */
export function SplitText({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.06,
  immediate = false,
  as: Tag = "span",
}: SplitTextProps) {
  const words = text.split(" ");
  const trigger = immediate
    ? { animate: "show" as const }
    : { whileInView: "show" as const, viewport: { once: true, margin: "-60px" } };

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        initial="hidden"
        {...trigger}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
        className="inline"
      >
        {words.map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
              <motion.span
                className={cn("inline-block will-change-transform", wordClassName)}
                variants={{
                  hidden: { y: "110%", rotate: 4 },
                  show: { y: "0%", rotate: 0, transition: { duration: 0.95, ease: EASE_OUT } },
                }}
              >
                {word}
              </motion.span>
            </span>
            {/* Real space between inline-blocks so the line can wrap and words don't collide. */}
            {i < words.length - 1 && " "}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}

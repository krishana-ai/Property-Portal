"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { blurProps } from "@/lib/site/images";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Percentage the image travels across the viewport pass. */
  amount?: number;
  sizes?: string;
  priority?: boolean;
}

/** Image that drifts slower than the page while scrolling. */
export function ParallaxImage({ src, alt, className, amount = 12, sizes = "100vw", priority }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div style={{ y }} className="absolute -inset-y-[15%] inset-x-0">
        <Image src={src} {...blurProps(src)} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </motion.div>
    </div>
  );
}

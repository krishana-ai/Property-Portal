import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion/reveal";
import { SplitText } from "./motion/split-text";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({ eyebrow, title, description, action, tone = "dark", align = "left", className }: SectionHeadingProps) {
  const light = tone === "light";
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        <Reveal>
          <p className={cn("eyebrow", light ? "text-brass-300" : "text-brass-700")}>{eyebrow}</p>
        </Reveal>
        <SplitText
          as="h2"
          text={title}
          className={cn("mt-4 block font-display text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.04] tracking-[-0.015em]", light ? "text-white" : "text-ink-900")}
        />
        {description && (
          <Reveal delay={0.15}>
            <p className={cn("mt-4 text-base leading-relaxed sm:text-lg", light ? "text-white/65" : "text-ink-600")}>{description}</p>
          </Reveal>
        )}
      </div>
      {action && <Reveal delay={0.2} className="shrink-0">{action}</Reveal>}
    </div>
  );
}

import { cn } from "@/lib/utils";
import type { CSSProperties, ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
}

/**
 * Infinite CSS marquee. Content is rendered twice and translated -50% so the
 * loop is seamless; the duplicate is hidden from assistive tech. Pauses on hover.
 */
export function Marquee({ children, duration = 40, reverse = false, className }: MarqueeProps) {
  return (
    <div
      className={cn(
        "marquee-pause relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      <div
        className={cn("flex w-max shrink-0", reverse ? "animate-marquee-reverse" : "animate-marquee")}
        style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

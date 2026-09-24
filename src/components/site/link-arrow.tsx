import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Text link whose arrow slides and whose underline draws on hover. */
export function LinkArrow({ href, children, tone = "dark", className }: { href: string; children: React.ReactNode; tone?: "dark" | "light"; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 text-sm font-semibold",
        tone === "light" ? "text-white" : "text-ink-900",
        className,
      )}
    >
      <span className="relative">
        {children}
        <span className={cn("absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100", tone === "light" ? "bg-white" : "bg-ink-900")} />
      </span>
      <span className={cn("grid h-8 w-8 place-items-center overflow-hidden rounded-full transition-colors", tone === "light" ? "bg-white/10 group-hover:bg-brass-500 group-hover:text-ink-900" : "bg-ink-900 text-white group-hover:bg-brass-500 group-hover:text-ink-900")}>
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

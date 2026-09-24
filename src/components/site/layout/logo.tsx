import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { cn } from "@/lib/utils";

export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Anavrin Properties — home"
      className={cn("group inline-flex items-center transition-opacity hover:opacity-90", className)}
    >
      <BrandLogo tone={tone} size="md" className="[&_svg]:transition-transform [&_svg]:duration-500 group-hover:[&_svg]:-translate-y-0.5" />
    </Link>
  );
}

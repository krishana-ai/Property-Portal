import { BadgeCheck, FileCheck2, Sparkles, User, UserCheck } from "lucide-react";
import type { Property } from "@/lib/site/types";
import { cn } from "@/lib/utils";

/**
 * Distinct trust concepts (spec §13). "Featured" is paid placement and is
 * deliberately styled differently so it can never be mistaken for verification.
 */
export function TrustBadges({ property, size = "sm", className }: { property: Property; size?: "sm" | "md"; className?: string }) {
  const chip = cn(
    "inline-flex items-center gap-1 rounded-full font-medium",
    size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
  );
  const icon = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {property.verified && (
        <span className={cn(chip, "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/15")} title="Address, photos and seller identity confirmed by our team">
          <BadgeCheck className={icon} /> Verified
        </span>
      )}
      {property.rera && (
        <span className={cn(chip, "bg-sky-50 text-sky-700 ring-1 ring-sky-600/15")} title={`RERA: ${property.rera}`}>
          <FileCheck2 className={icon} /> RERA
        </span>
      )}
      {property.seller.type === "Owner" && (
        <span className={cn(chip, "bg-ink-900/5 text-ink-700 ring-1 ring-ink-900/10")}>
          <User className={icon} /> Owner
        </span>
      )}
      {property.seller.certified && (
        <span className={cn(chip, "bg-violet-50 text-violet-700 ring-1 ring-violet-600/15")}>
          <UserCheck className={icon} /> Certified agent
        </span>
      )}
    </div>
  );
}

export function FeaturedTag({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md bg-ink-900/85 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-brass-300 backdrop-blur", className)}>
      <Sparkles className="h-3 w-3" /> Featured
    </span>
  );
}

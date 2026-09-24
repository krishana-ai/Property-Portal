import { cn } from "@/lib/utils";

/**
 * Anavrin Properties brand lockup, shared by the public site and the admin.
 *
 * Rebuilt from `public/brand/anavrin-horizontal-logo.svg` so it can render on
 * any background: the source file ships with a solid cream background rect and
 * ~180px of empty canvas on the right, which makes it unusable on dark
 * surfaces and hard to size. Paths and colours below are taken 1:1 from it.
 */
export const BRAND_COLORS = {
  navy: "#1B2A41",
  gold: "#B8935F",
  cream: "#FAF8F4",
  divider: "#D8D2C4",
} as const;

type Tone = "dark" | "light";

/** Roofline "A" monogram, cropped tight to its artwork (source viewBox 640×140). */
export function BrandMark({ tone = "dark", className }: { tone?: Tone; className?: string }) {
  return (
    <svg viewBox="-37 -47 74 79" className={className} aria-hidden focusable="false">
      <path d="M 0 -46 L 36 31 L 22 31 L 0 -15 L -22 31 L -36 31 Z" fill={tone === "light" ? BRAND_COLORS.cream : BRAND_COLORS.navy} />
      <rect x="-7" y="10" width="14" height="21" fill={BRAND_COLORS.gold} />
      <line x1="-13" y1="0" x2="13" y2="0" stroke={BRAND_COLORS.gold} strokeWidth="3" />
    </svg>
  );
}

const SIZES = {
  sm: { mark: "h-7", gap: "gap-2.5", divider: "h-7", name: "text-[15px] tracking-[0.14em]", sub: "text-[7.5px] tracking-[0.42em]" },
  md: { mark: "h-9", gap: "gap-3", divider: "h-9", name: "text-[19px] tracking-[0.14em]", sub: "text-[8.5px] tracking-[0.42em]" },
  lg: { mark: "h-12", gap: "gap-4", divider: "h-12", name: "text-[26px] tracking-[0.14em]", sub: "text-[11px] tracking-[0.42em]" },
} as const;

interface BrandLogoProps {
  tone?: Tone;
  size?: keyof typeof SIZES;
  /** Hide the wordmark on very tight layouts; the mark stays. */
  markOnly?: boolean;
  className?: string;
}

export function BrandLogo({ tone = "dark", size = "md", markOnly = false, className }: BrandLogoProps) {
  const s = SIZES[size];
  const light = tone === "light";

  return (
    <span className={cn("inline-flex items-center", s.gap, className)}>
      <BrandMark tone={tone} className={cn(s.mark, "w-auto shrink-0")} />
      {!markOnly && (
        <>
          <span aria-hidden className={cn("w-px shrink-0", s.divider)} style={{ background: light ? "rgb(250 248 244 / 0.25)" : BRAND_COLORS.divider }} />
          {/* Georgia matches the serif specified in the source lockup. */}
          <span className="flex flex-col leading-none" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            <span className={cn(s.name, "uppercase")} style={{ color: light ? BRAND_COLORS.cream : BRAND_COLORS.navy }}>
              Anavrin
            </span>
            <span className={cn(s.sub, "mt-1 uppercase")} style={{ color: BRAND_COLORS.gold }}>
              Properties
            </span>
          </span>
        </>
      )}
      <span className="sr-only">Anavrin Properties</span>
    </span>
  );
}

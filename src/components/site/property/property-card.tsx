"use client";

import { motion } from "motion/react";
import { Camera, Clock, Maximize2, MapPin, PlayCircle, Users, Utensils } from "lucide-react";
import Image from "next/image";
import { blurProps } from "@/lib/site/images";
import Link from "next/link";
import { formatArea, formatPropertyPrice, postedLabel, pricePerSqft, propertyHeadline } from "@/lib/site/format";
import type { Property } from "@/lib/site/types";
import { cn } from "@/lib/utils";
import { SaveButton } from "./save-button";
import { FeaturedTag, TrustBadges } from "./trust-badges";

interface PropertyCardProps {
  property: Property;
  layout?: "grid" | "row";
  active?: boolean;
  onHover?: (slug: string | null) => void;
  priority?: boolean;
  /** Static preview (e.g. the posting wizard) — no link, no save button. */
  preview?: boolean;
}

/**
 * Card answers six questions at a glance (spec §11): what, where, how much,
 * how big, status, can I trust/contact it. Intentionally no long description.
 */
export function PropertyCard({ property: p, layout = "grid", active, onHover, priority, preview = false }: PropertyCardProps) {
  const psf = pricePerSqft(p);
  const row = layout === "row";

  return (
    <motion.article
      layout
      onPointerEnter={() => onHover?.(p.slug)}
      onPointerLeave={() => onHover?.(null)}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl bg-white ring-1 ring-ink-900/[0.06] transition-shadow duration-500",
        "hover:shadow-[0_30px_60px_-30px_rgb(11_17_32/0.35)]",
        active && "ring-2 ring-brass-500",
        row && "sm:grid sm:grid-cols-[200px_1fr]",
      )}
    >
      {!preview && <Link href={`/property/${p.slug}`} className="absolute inset-0 z-10" aria-label={`${p.title}, ${p.locality}`} />}

      <div className={cn("relative overflow-hidden", row ? "aspect-[4/3] sm:aspect-auto sm:h-full" : "aspect-[4/3]")}>
        <Image
          src={p.images[0]}
          {...blurProps(p.images[0])}
          alt={`${propertyHeadline(p)} in ${p.locality}`}
          fill
          priority={priority}
          unoptimized={p.images[0].startsWith("blob:")}
          sizes={row ? "(min-width: 640px) 200px, 100vw" : "(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"}
          className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-ink-950/20" />
        <div className="absolute left-3 top-3 flex gap-2">{p.featured && <FeaturedTag />}</div>
        {!preview && <SaveButton slug={p.slug} className="absolute right-3 top-3 z-20 bg-white/90 text-ink-900 backdrop-blur hover:bg-white" />}

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div className="flex gap-1.5 text-[11px] font-medium">
            <span className="inline-flex items-center gap-1 rounded-md bg-black/40 px-2 py-1 backdrop-blur">
              <Camera className="h-3 w-3" /> {p.images.length} {p.images.length === 1 ? "Photo" : "Photos"}
            </span>
            {p.hasVideo && (
              <span className="inline-flex items-center gap-1 rounded-md bg-black/40 px-2 py-1 backdrop-blur">
                <PlayCircle className="h-3 w-3" /> Video
              </span>
            )}
            {p.hasFloorPlan && <span className="hidden rounded-md bg-black/40 px-2 py-1 backdrop-blur sm:inline">Floor plan</span>}
          </div>
        </div>
      </div>

      <div className="relative flex flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brass-700">{propertyHeadline(p)}</p>
            <h3 className="mt-1 truncate font-display text-xl leading-tight text-ink-900">{p.title}</h3>
          </div>
        </div>

        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-600">
          <MapPin className="h-3.5 w-3.5 shrink-0" /> {p.locality}, {p.city}
        </p>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight text-ink-900">{formatPropertyPrice(p)}</span>
          {psf && <span className="text-xs text-ink-600">{psf}</span>}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink-700">
          {p.pg ? (
            <>
              <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {p.pg.forGender === "Any" ? "Anyone" : p.pg.forGender}</span>
              <span>{p.pg.sharing.join(" / ")}</span>
              {p.pg.foodIncluded && <span className="inline-flex items-center gap-1"><Utensils className="h-3.5 w-3.5" /> Food</span>}
            </>
          ) : (
            <>
              <span className="inline-flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5" /> {formatArea(p)}</span>
              <span className="h-1 w-1 rounded-full bg-ink-600/40" />
              <span>{p.availability}</span>
            </>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-ink-900/[0.06] pt-4">
          <TrustBadges property={p} />
          <span className="inline-flex shrink-0 items-center gap-1 text-[11px] text-ink-600">
            <Clock className="h-3 w-3" /> {postedLabel(p.postedDaysAgo).replace("Posted ", "")}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-ink-900/[0.06]">
      <div className="shimmer aspect-[4/3] bg-sand-200" />
      <div className="space-y-3 p-5">
        <div className="shimmer h-3 w-24 rounded bg-sand-200" />
        <div className="shimmer h-5 w-3/4 rounded bg-sand-200" />
        <div className="shimmer h-6 w-1/3 rounded bg-sand-200" />
      </div>
    </div>
  );
}

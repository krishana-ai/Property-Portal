import type { Metadata } from "next";
import { Suspense } from "react";
import { PropertyCardSkeleton } from "@/components/site/property/property-card";
import { SearchView } from "@/components/site/search/search-view";
import { parseFilters, searchTitle } from "@/lib/site/search";

type Props = { searchParams: Record<string, string | string[] | undefined> };

export function generateMetadata({ searchParams }: Props): Metadata {
  const params = new URLSearchParams(
    Object.entries(searchParams).flatMap(([k, v]) => (typeof v === "string" ? [[k, v]] : [])),
  );
  return {
    title: searchTitle(parseFilters(params)),
    // Arbitrary filter combinations should not be indexed (spec §64).
    robots: params.size > 2 ? { index: false, follow: true } : undefined,
  };
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchView />
    </Suspense>
  );
}

function SearchSkeleton() {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 pt-40 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
      {Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
    </div>
  );
}

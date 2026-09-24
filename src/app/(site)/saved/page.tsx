import type { Metadata } from "next";
import { SavedList } from "@/components/site/saved/saved-list";

export const metadata: Metadata = {
  title: "Saved properties",
  robots: { index: false, follow: false },
};

export default function SavedPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-32 pt-32 sm:px-6 lg:px-8 lg:pb-24">
      <p className="eyebrow text-brass-700">Your shortlist</p>
      <h1 className="mt-3 font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-tight text-ink-900">Saved properties</h1>
      <div className="mt-10">
        <SavedList />
      </div>
    </div>
  );
}

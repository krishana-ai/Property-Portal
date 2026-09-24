import type { Metadata } from "next";
import { PostWizard } from "@/components/site/post/post-wizard";

export const metadata: Metadata = {
  title: "Post your property for free",
  description: "List your flat, house, plot, shop or PG in Jaipur for free. A guided listing that takes about eight minutes.",
};

export default function PostPropertyPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-32 pt-32 sm:px-6 lg:px-8 lg:pb-24">
      <p className="eyebrow text-brass-700">Post property · free</p>
      <h1 className="mt-3 max-w-2xl font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-tight text-ink-900">
        List in about eight minutes. Hear from serious buyers.
      </h1>
      <div className="mt-10">
        <PostWizard />
      </div>
    </div>
  );
}

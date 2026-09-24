"use client";

import { AnimatePresence, motion } from "motion/react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginHref, setPendingAction, useCustomerSession } from "@/hooks/use-customer-session";
import { useSavedProperties } from "@/hooks/use-saved-properties";
import { cn } from "@/lib/utils";

export function SaveButton({ slug, className, withLabel = false }: { slug: string; className?: string; withLabel?: boolean }) {
  const { isSaved, toggle } = useSavedProperties();
  const { customer } = useCustomerSession();
  const router = useRouter();
  const saved = isSaved(slug);

  function onSave() {
    // Saving needs an account (spec §56). Remember the intent so it completes right after login.
    if (!customer && !saved) {
      setPendingAction({ type: "save", slug });
      router.push(loginHref(`${window.location.pathname}${window.location.search}`));
      return;
    }
    toggle(slug);
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSave();
      }}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save property"}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-full transition-colors",
        withLabel ? "h-11 px-5 text-sm font-medium" : "h-10 w-10",
        className,
      )}
    >
      <span className="relative grid place-items-center">
        <Heart className={cn("h-[18px] w-[18px] transition-colors", saved ? "fill-rose-500 text-rose-500" : "")} />
        <AnimatePresence>
          {saved && (
            <motion.span
              key="burst"
              initial={{ scale: 0.4, opacity: 0.8 }}
              animate={{ scale: 2.4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border-2 border-rose-400"
            />
          )}
        </AnimatePresence>
      </span>
      {withLabel && (saved ? "Saved" : "Save")}
    </motion.button>
  );
}

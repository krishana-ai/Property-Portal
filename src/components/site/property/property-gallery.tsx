"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Grid2X2, X } from "lucide-react";
import Image from "next/image";
import { blurProps } from "@/lib/site/images";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useLenis } from "../layout/smooth-scroll";

export function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const [dir, setDir] = useState(1);
  const lenis = useLenis();

  const go = useCallback(
    (step: number) => {
      setDir(step);
      setOpen((i) => (i === null ? i : (i + step + images.length) % images.length));
    },
    [images.length],
  );

  useEffect(() => {
    if (open === null) {
      lenis?.start();
      return;
    }
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go, lenis]);

  const tiles = images.slice(0, 5);

  return (
    <>
      <div className="grid h-[52vh] min-h-[340px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-[28px] sm:gap-3 lg:h-[64vh]">
        {tiles.map((src, i) => (
          <motion.button
            key={src}
            type="button"
            onClick={() => setOpen(i)}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "group relative overflow-hidden",
              i === 0 ? "col-span-4 row-span-2 md:col-span-2" : "hidden md:block",
              tiles.length === 2 && i === 1 && "md:col-span-2 md:row-span-2",
              tiles.length === 3 && i > 0 && "md:col-span-2",
            )}
            aria-label={`Open photo ${i + 1} of ${images.length}`}
          >
            <Image src={src} {...blurProps(src)} alt={i === 0 ? title : ""} fill priority={i === 0} sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "25vw"} className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105" />
            <span className="absolute inset-0 bg-ink-950/0 transition-colors duration-500 group-hover:bg-ink-950/15" />
          </motion.button>
        ))}
      </div>
      <button type="button" onClick={() => setOpen(0)} className="relative -mt-16 ml-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-900 shadow-lg transition hover:scale-105">
        <Grid2X2 className="h-4 w-4" /> Show all {images.length} photos
      </button>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Photo gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex flex-col bg-ink-950/95 backdrop-blur"
          >
            <div className="flex items-center justify-between p-4 text-white">
              <span className="text-sm tabular-nums">{open + 1} / {images.length}</span>
              <button type="button" onClick={() => setOpen(null)} aria-label="Close gallery" autoFocus className="grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-white/20">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative flex-1 overflow-hidden">
              <AnimatePresence initial={false} custom={dir}>
                <motion.div
                  key={open}
                  custom={dir}
                  initial={{ x: `${dir * 100}%`, opacity: 0.4 }}
                  animate={{ x: "0%", opacity: 1 }}
                  exit={{ x: `${dir * -100}%`, opacity: 0.4 }}
                  transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -80) go(1);
                    if (info.offset.x > 80) go(-1);
                  }}
                  className="absolute inset-4"
                >
                  <Image src={images[open]} {...blurProps(images[open])} alt={`${title} — photo ${open + 1}`} fill sizes="100vw" className="object-contain" />
                </motion.div>
              </AnimatePresence>
              <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/25">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/25">
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
            <div className="no-scrollbar flex justify-center gap-2 overflow-x-auto p-4">
              {images.map((src, i) => (
                <button key={src} type="button" onClick={() => { setDir(i > open ? 1 : -1); setOpen(i); }} aria-label={`Photo ${i + 1}`} className={cn("relative h-14 w-20 shrink-0 overflow-hidden rounded-lg transition", i === open ? "ring-2 ring-brass-400" : "opacity-50 hover:opacity-100")}>
                  <Image src={src} {...blurProps(src)} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const PRESETS = [
  "Today",
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
  "Month to date",
] as const;

export function DateRangePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-600"
      >
        <Calendar className="h-4 w-4 text-slate-400" />
        {value}
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-48 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                onChange(preset);
                setOpen(false);
              }}
              className={cn(
                "flex w-full cursor-pointer items-center justify-between px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-100"
              )}
            >
              {preset}
              {value === preset && <Check className="h-3.5 w-3.5 text-primary-600" />}
            </button>
          ))}
          <div className="mt-1 border-t border-slate-200 px-3 pt-2">
            <p className="mb-1.5 text-xs font-medium text-slate-400">Custom range</p>
            <div className="flex items-center gap-1.5">
              <input type="date" className="h-7 w-full rounded border border-slate-200 px-1.5 text-xs" />
              <span className="text-slate-400">–</span>
              <input type="date" className="h-7 w-full rounded border border-slate-200 px-1.5 text-xs" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

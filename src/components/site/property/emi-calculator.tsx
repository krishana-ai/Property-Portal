"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useId, useMemo, useState } from "react";
import { formatPrice } from "@/lib/site/format";
import { cn } from "@/lib/utils";

interface EmiCalculatorProps {
  defaultPrice?: number;
  tone?: "light" | "dark";
  className?: string;
}

/** Standard reducing-balance EMI. Assumptions are shown next to the result. */
export function EmiCalculator({ defaultPrice = 8_000_000, tone = "light", className }: EmiCalculatorProps) {
  const [price, setPrice] = useState(defaultPrice);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const { emi, interest, loan } = useMemo(() => {
    const loan = price * (1 - downPct / 100);
    const r = rate / 12 / 100;
    const n = years * 12;
    const emi = r === 0 ? loan / n : (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return { emi, loan, interest: emi * n - loan };
  }, [price, downPct, rate, years]);

  const principalShare = loan / (loan + interest);
  const dark = tone === "dark";

  return (
    <div className={cn("grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center", className)}>
      <div className="space-y-6">
        <Slider label="Property price" value={price} min={1_000_000} max={50_000_000} step={100_000} onChange={setPrice} display={formatPrice(price)} dark={dark} />
        <Slider label="Down payment" value={downPct} min={10} max={60} step={1} onChange={setDownPct} display={`${downPct}% · ${formatPrice((price * downPct) / 100)}`} dark={dark} />
        <Slider label="Interest rate" value={rate} min={6.5} max={12} step={0.05} onChange={setRate} display={`${rate.toFixed(2)}% p.a.`} dark={dark} />
        <Slider label="Tenure" value={years} min={5} max={30} step={1} onChange={setYears} display={`${years} years`} dark={dark} />
      </div>

      <div className="flex flex-col items-center text-center">
        <Donut share={principalShare} dark={dark} />
        <p className={cn("mt-6 text-xs uppercase tracking-[0.2em]", dark ? "text-white/50" : "text-ink-600")}>Monthly EMI</p>
        <AnimatedRupees value={emi} className={cn("font-display text-5xl", dark ? "text-white" : "text-ink-900")} />
        <div className={cn("mt-5 grid w-full grid-cols-2 gap-3 text-left text-sm", dark ? "text-white/70" : "text-ink-600")}>
          <p><span className="mr-2 inline-block h-2 w-2 rounded-full bg-brass-500" />Loan {formatPrice(Math.round(loan))}</p>
          <p><span className={cn("mr-2 inline-block h-2 w-2 rounded-full", dark ? "bg-white/25" : "bg-ink-900/20")} />Interest {formatPrice(Math.round(interest))}</p>
        </div>
        <p className={cn("mt-4 text-[11px]", dark ? "text-white/40" : "text-ink-600/80")}>
          Indicative only. Actual rates depend on the lender and your credit profile.
        </p>
      </div>
    </div>
  );
}

function Slider({
  label, value, min, max, step, onChange, display, dark,
}: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; display: string; dark: boolean }) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className={cn("text-sm font-medium", dark ? "text-white/80" : "text-ink-700")}>{label}</label>
        <span className={cn("text-sm font-semibold tabular-nums", dark ? "text-white" : "text-ink-900")}>{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ background: `linear-gradient(to right, #c8a15e ${pct}%, ${dark ? "rgb(255 255 255 / 0.15)" : "rgb(11 17 32 / 0.1)"} ${pct}%)` }}
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-brass-600 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-brass-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125"
      />
    </div>
  );
}

function Donut({ share, dark }: { share: number; dark: boolean }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 180 180" className="h-44 w-44 -rotate-90" aria-hidden>
      <circle cx="90" cy="90" r={r} fill="none" strokeWidth="18" className={dark ? "stroke-white/15" : "stroke-ink-900/10"} />
      <motion.circle
        cx="90" cy="90" r={r} fill="none" strokeWidth="18" strokeLinecap="round" className="stroke-brass-500"
        strokeDasharray={c}
        animate={{ strokeDashoffset: c * (1 - share) }}
        transition={{ type: "spring", stiffness: 90, damping: 20 }}
      />
    </svg>
  );
}

function AnimatedRupees({ value, className }: { value: number; className?: string }) {
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => `₹${Math.round(v).toLocaleString("en-IN")}`);
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.6, ease: "easeOut" });
    return () => controls.stop();
  }, [value, mv]);
  return <motion.span className={className}>{text}</motion.span>;
}

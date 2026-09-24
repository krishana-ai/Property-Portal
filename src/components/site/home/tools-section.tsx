import { Calculator } from "lucide-react";
import { EmiCalculator } from "../property/emi-calculator";
import { Reveal } from "../motion/reveal";
import { SectionHeading } from "../section-heading";

export function ToolsSection() {
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Plan the money side"
          title="What will it really cost each month?"
          description="Move the sliders — the EMI, loan and total interest update instantly."
        />
        <Reveal className="mt-14 rounded-[32px] bg-sand-100 p-6 ring-1 ring-ink-900/[0.05] sm:p-10 lg:p-14">
          <div className="mb-8 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink-900 text-brass-300"><Calculator className="h-5 w-5" /></span>
            <p className="font-semibold text-ink-900">Home loan EMI calculator</p>
          </div>
          <EmiCalculator />
        </Reveal>
      </div>
    </section>
  );
}

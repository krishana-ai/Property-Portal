import { formatNumber } from "@/lib/utils";
import type { FunnelStep } from "@/lib/mock/reports";

export function FunnelChart({ steps }: { steps: FunnelStep[] }) {
  const max = steps[0]?.count || 1;

  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        const width = (step.count / max) * 100;
        const dropoff =
          i > 0 ? (((steps[i - 1].count - step.count) / steps[i - 1].count) * 100).toFixed(1) : null;
        return (
          <div key={step.label}>
            {dropoff && (
              <p className="mb-1 ml-24 text-xs font-medium text-danger-600">-{dropoff}% drop-off</p>
            )}
            <div className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-sm font-medium text-slate-700">{step.label}</span>
              <div className="h-8 flex-1 rounded-md bg-slate-100">
                <div
                  className="flex h-8 items-center rounded-md bg-primary-600 px-3 text-xs font-semibold text-white transition-all"
                  style={{ width: `${width}%` }}
                >
                  {formatNumber(step.count)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

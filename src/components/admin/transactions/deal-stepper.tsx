import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEAL_STAGES, type DealStage } from "@/lib/mock/transactions";

export function DealStepper({
  currentStage,
  showLabels,
}: {
  currentStage: DealStage;
  showLabels?: boolean;
}) {
  const currentIdx = DEAL_STAGES.indexOf(currentStage);

  return (
    <div className="flex items-center">
      {DEAL_STAGES.map((stage, i) => {
        const isDone = i < currentIdx;
        const isCurrent = i === currentIdx;
        return (
          <div key={stage} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                  isDone && "bg-success-600 text-white",
                  isCurrent && "bg-primary-600 text-white",
                  !isDone && !isCurrent && "bg-slate-200 text-slate-500"
                )}
                title={stage}
              >
                {isDone ? <Check className="h-3 w-3" /> : i + 1}
              </div>
              {showLabels && (
                <span
                  className={cn(
                    "mt-1 w-14 text-center text-[10px]",
                    isCurrent ? "font-semibold text-primary-600" : "text-slate-400"
                  )}
                >
                  {stage}
                </span>
              )}
            </div>
            {i < DEAL_STAGES.length - 1 && (
              <div className={cn("h-0.5 w-4 shrink-0 sm:w-6", isDone ? "bg-success-600" : "bg-slate-200")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

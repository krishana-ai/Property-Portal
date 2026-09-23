import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
} from "@/components/ui/dialog";
import { DealStepper } from "./deal-stepper";
import { formatDate } from "@/lib/utils";
import type { Deal } from "@/lib/mock/transactions";

export function TransactionDetailDialog({
  deal,
  open,
  onOpenChange,
}: {
  deal: Deal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!deal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>{deal.id}</DialogTitle>
          <DialogDescription>
            {deal.buyer} · {deal.property}
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-6">
          <div className="overflow-x-auto pb-2">
            <DealStepper currentStage={deal.currentStage} showLabels />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Stage timeline
            </p>
            <ul className="space-y-2">
              {deal.timeline.map((entry) => (
                <li key={entry.stage} className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success-600 text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex-1 text-sm font-medium text-slate-900">{entry.stage}</span>
                  <span className="text-xs text-slate-400">{formatDate(entry.date)}</span>
                </li>
              ))}
            </ul>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

import { Building2, ArrowLeftRight } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import type { DuplicateSide } from "@/lib/mock/duplicates";

function MiniPropertyCard({ side }: { side: DuplicateSide }) {
  return (
    <div className="flex flex-1 items-center gap-2 rounded-md border border-slate-200 p-2">
      <ImagePlaceholder icon={Building2} size="sm" />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-900">{side.address}</p>
        <p className="text-xs text-slate-400">
          {side.id} · {side.postedBy} · {side.price}
        </p>
      </div>
    </div>
  );
}

export function DuplicatePairCard({ a, b }: { a: DuplicateSide; b: DuplicateSide }) {
  return (
    <div className="flex min-w-[26rem] items-center gap-2">
      <MiniPropertyCard side={a} />
      <ArrowLeftRight className="h-4 w-4 shrink-0 text-slate-300" />
      <MiniPropertyCard side={b} />
    </div>
  );
}

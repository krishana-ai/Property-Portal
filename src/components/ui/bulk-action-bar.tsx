import { type ReactNode } from "react";
import { X } from "lucide-react";

export function BulkActionBar({
  count,
  onClear,
  children,
}: {
  count: number;
  onClear: () => void;
  children: ReactNode;
}) {
  if (count === 0) return null;

  return (
    <div className="flex items-center justify-between rounded-lg border border-primary-100 bg-primary-50 px-4 py-2.5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onClear}
          className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-primary-600 hover:bg-primary-100"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <span className="text-sm font-medium text-primary-700">{count} selected</span>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

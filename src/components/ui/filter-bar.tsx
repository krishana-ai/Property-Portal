"use client";

import { type ReactNode } from "react";
import { Search, X } from "lucide-react";
import { Input } from "./input";
import { Badge } from "./badge";

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  activeFilterCount = 0,
  onClearFilters,
  children,
  right,
}: {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  activeFilterCount?: number;
  onClearFilters?: () => void;
  children?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex flex-wrap items-center gap-2">
        {onSearchChange && (
          <div className="relative w-56">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-8"
            />
          </div>
        )}
        {children}
        {activeFilterCount > 0 && (
          <>
            <Badge variant="info">{activeFilterCount} active</Badge>
            {onClearFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className="flex cursor-pointer items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
              >
                <X className="h-3 w-3" />
                Clear filters
              </button>
            )}
          </>
        )}
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}

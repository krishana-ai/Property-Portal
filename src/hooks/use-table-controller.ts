import { useMemo, useState } from "react";
import { useDebounce } from "./use-debounce";
import type { SortDirection } from "@/components/ui/data-table";

interface UseTableControllerOptions<T> {
  data: T[];
  searchableFields?: (keyof T)[];
  pageSize?: number;
}

/**
 * Shared search + filter + sort + pagination + row-selection state for any
 * module's list page (Listings, Users, Leads, Payments, Reviews, ...).
 * Keeps every module's DataTable/FilterBar wiring identical instead of
 * re-implementing the same state machine per page.
 */
export function useTableController<T extends object>({
  data,
  searchableFields = [],
  pageSize = 8,
}: UseTableControllerOptions<T>) {
  const [search, setSearchRaw] = useState("");
  const debouncedSearch = useDebounce(search, 250);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<string | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  function setSearch(value: string) {
    setSearchRaw(value);
    setPage(1);
  }

  function setFilter(key: string, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }

  function clearFilters() {
    setFilters({});
    setSearchRaw("");
    setPage(1);
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const filtered = useMemo(() => {
    let rows = data;

    if (debouncedSearch && searchableFields.length > 0) {
      const query = debouncedSearch.toLowerCase();
      rows = rows.filter((row) =>
        searchableFields.some((field) => String(row[field] ?? "").toLowerCase().includes(query))
      );
    }

    for (const [key, value] of Object.entries(filters)) {
      if (!value) continue;
      rows = rows.filter((row) => String((row as Record<string, unknown>)[key] ?? "") === value);
    }

    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const av = (a as Record<string, unknown>)[sortKey];
        const bv = (b as Record<string, unknown>)[sortKey];
        const cmp =
          typeof av === "number" && typeof bv === "number"
            ? av - bv
            : String(av ?? "").localeCompare(String(bv ?? ""));
        return sortDirection === "asc" ? cmp : -cmp;
      });
    }

    return rows;
  }, [data, debouncedSearch, filters, sortKey, sortDirection, searchableFields]);

  const total = filtered.length;
  const pageData = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize]
  );

  function onSortChange(key: string, direction: SortDirection) {
    setSortKey(key);
    setSortDirection(direction);
  }

  return {
    search,
    setSearch,
    filters,
    setFilter,
    clearFilters,
    activeFilterCount,
    sortKey,
    sortDirection,
    onSortChange,
    page,
    setPage,
    pageSize,
    total,
    data: pageData,
    selectedIds,
    setSelectedIds,
  };
}

export interface BarSegment {
  label: string;
  value: number;
  colorClass: string;
}

export function StackedBarCell({ segments, width = "w-28" }: { segments: BarSegment[]; width?: string }) {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0) || 1;

  return (
    <div>
      <div className={`flex h-2 ${width} overflow-hidden rounded-full bg-slate-100`}>
        {segments.map((seg) => (
          <div
            key={seg.label}
            className={seg.colorClass}
            style={{ width: `${(seg.value / total) * 100}%` }}
            title={`${seg.label}: ${seg.value}`}
          />
        ))}
      </div>
      <div className="mt-1 flex flex-wrap gap-x-2 text-[10px] text-slate-400">
        {segments.map((seg) => (
          <span key={seg.label}>
            {seg.label} {seg.value}
          </span>
        ))}
      </div>
    </div>
  );
}

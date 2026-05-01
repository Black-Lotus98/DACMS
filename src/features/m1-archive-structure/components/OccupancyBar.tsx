interface OccupancyBarProps {
  pct:       number;
  showLabel?: boolean;
  warning?:  number;
  critical?: number;
}

export function OccupancyBar({ pct, showLabel = true, warning = 70, critical = 90 }: OccupancyBarProps) {
  const color     = pct >= critical ? 'bg-red-500'    : pct >= warning ? 'bg-amber-400'  : 'bg-green-500';
  const textColor = pct >= critical ? 'text-red-500'  : pct >= warning ? 'text-amber-500': 'text-green-600';

  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Occupancy</span>
          <span className={textColor}>{pct}%</span>
        </div>
      )}
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}

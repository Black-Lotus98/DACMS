interface OccupancyBarProps {
  pct: number;
  showLabel?: boolean;
}

export function OccupancyBar({ pct, showLabel = true }: OccupancyBarProps) {
  const color =
    pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-400' : 'bg-green-500';
  const textColor =
    pct >= 90 ? 'text-red-500' : pct >= 70 ? 'text-amber-500' : 'text-green-600';

  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">الإشغال</span>
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

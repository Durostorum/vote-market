import { cn } from "@/lib/utils";

interface VoteBarProps {
  upCount: number;
  downCount: number;
  className?: string;
}

export function VoteBar({ upCount, downCount, className }: VoteBarProps) {
  const total = upCount + downCount;
  const upPercentage = total > 0 ? (upCount / total) * 100 : 0;

  const upPct = Math.round(upPercentage)
  const downPct = Math.round(100 - upPercentage)

  return (
    <div className={cn("space-y-2", className)}>
      <div
        role="meter"
        aria-valuenow={upPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${upPct}% upvotes, ${downPct}% downvotes (${upCount + downCount} total votes)`}
        className="h-2 bg-background rounded-full overflow-hidden"
      >
        <div className="h-full bg-primary transition-all" style={{ width: `${upPercentage}%` }} />
      </div>
      <div className="flex justify-between text-sm" aria-hidden="true">
        <span className="text-primary">{upPct}% up</span>
        <span className="text-slate-400">{downPct}% down</span>
      </div>
    </div>
  );
}

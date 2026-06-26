import { cn } from "@/lib/utils";

interface VoteBarProps {
  upCount: number;
  downCount: number;
  className?: string;
}

export function VoteBar({ upCount, downCount, className }: VoteBarProps) {
  const total = upCount + downCount;
  const upPercentage = total > 0 ? (upCount / total) * 100 : 0;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="h-2 bg-background rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all" style={{ width: `${upPercentage}%` }} />
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-primary">{Math.round(upPercentage)}% up</span>
        <span className="text-slate-400">{Math.round(100 - upPercentage)}% down</span>
      </div>
    </div>
  );
}

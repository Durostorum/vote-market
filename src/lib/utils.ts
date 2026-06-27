import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    TECH: "bg-blue-500/20 text-blue-400",
    WORLD: "bg-purple-500/20 text-purple-400",
    BUSINESS: "bg-yellow-500/20 text-yellow-400",
    OTHER: "bg-slate-500/20 text-slate-400",
  };
  return colors[category] || colors.OTHER;
}

export function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

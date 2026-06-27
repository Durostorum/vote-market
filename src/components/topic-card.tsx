"use client";

import { useRouter } from "next/navigation";
import { VoteBar } from "./vote-bar";
import { cn } from "@/lib/utils";

interface Topic {
  id: string;
  title: string;
  description: string;
  category: string;
  upCount: number;
  downCount: number;
  createdAt: string;
  userVote?: "UP" | "DOWN";
}

interface TopicCardProps {
  topic: Topic;
  onVote?: (topicId: string, direction: "UP" | "DOWN") => void;
}

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    TECH: "bg-blue-500/20 text-blue-400",
    WORLD: "bg-purple-500/20 text-purple-400",
    BUSINESS: "bg-yellow-500/20 text-yellow-400",
    OTHER: "bg-slate-500/20 text-slate-400",
  };
  return colors[category] || colors.OTHER;
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function TopicCard({ topic, onVote }: TopicCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/topics/${topic.id}`);
  };

  return (
    <div 
      className="bg-surface border border-border rounded-xl p-5 hover:border-slate-500 transition-colors cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={cn("px-2 py-1 text-xs font-medium rounded-full", getCategoryColor(topic.category))}>
          {topic.category}
        </span>
        <span className="text-slate-500 text-xs">{formatTimeAgo(topic.createdAt)}</span>
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-3">{topic.title}</h3>
      
      <VoteBar upCount={topic.upCount} downCount={topic.downCount} className="mb-4" />
      
      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onVote?.(topic.id, "UP")}
          className={cn(
            "flex-1 py-2 rounded-lg font-medium transition-colors",
            topic.userVote === "UP"
              ? "bg-primary/20 border border-primary/50 text-primary"
              : "bg-background border border-border text-slate-300 hover:border-slate-500"
          )}
        >
          👍 Up
        </button>
        <button
          onClick={() => onVote?.(topic.id, "DOWN")}
          className={cn(
            "flex-1 py-2 rounded-lg font-medium transition-colors",
            topic.userVote === "DOWN"
              ? "bg-danger/20 border border-danger/50 text-danger"
              : "bg-background border border-border text-slate-300 hover:border-slate-500"
          )}
        >
          👎 Down
        </button>
      </div>
    </div>
  );
}

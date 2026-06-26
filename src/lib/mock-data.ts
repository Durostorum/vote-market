export type Category = "WORLD" | "TECH" | "BUSINESS" | "OTHER";

export interface Topic {
  id: string;
  title: string;
  description: string;
  category: Category;
  upCount: number;
  downCount: number;
  createdAt: Date;
  userVote?: "UP" | "DOWN" | null;
}

export interface NewsArticle {
  id: string;
  source: string;
  title: string;
  summary: string;
  link: string;
  category: Category;
  publishedAt: Date;
}

export const mockTopics: Topic[] = [
  {
    id: "1",
    title: "Will AI replace software engineers by 2030?",
    description: "With rapid advancements in AI coding assistants like GitHub Copilot and Claude, there's growing debate about whether AI will fully replace human software engineers within the next decade.",
    category: "TECH",
    upCount: 156,
    downCount: 95,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    userVote: "UP",
  },
  {
    id: "2",
    title: "Will global carbon emissions peak before 2025?",
    description: "Climate scientists and policymakers debate whether global greenhouse gas emissions will reach their maximum before 2025, a critical milestone for limiting warming to 1.5°C.",
    category: "WORLD",
    upCount: 89,
    downCount: 108,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    userVote: null,
  },
  {
    id: "3",
    title: "Will Tesla's stock reach $500 by end of 2024?",
    description: "Analysts are divided on Tesla's stock trajectory, with bulls citing autonomous driving progress and bears pointing to increased competition in the EV market.",
    category: "BUSINESS",
    upCount: 45,
    downCount: 116,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    userVote: null,
  },
  {
    id: "4",
    title: "Will Apple release AR glasses in 2024?",
    description: "Rumors about Apple's augmented reality glasses have circulated for years. Will 2024 finally be the year they launch to consumers?",
    category: "TECH",
    upCount: 178,
    downCount: 73,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    userVote: null,
  },
];

export const mockNews: NewsArticle[] = [
  {
    id: "1",
    source: "BBC",
    title: "OpenAI announces GPT-5 with breakthrough reasoning capabilities",
    summary: "The new model demonstrates unprecedented performance on complex reasoning tasks and coding challenges...",
    link: "https://example.com/article1",
    category: "TECH",
    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "2",
    source: "Reuters",
    title: "EU passes landmark AI regulation framework",
    summary: "European Union lawmakers have approved comprehensive AI rules that will set global standards for the technology...",
    link: "https://example.com/article2",
    category: "WORLD",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "3",
    source: "TechCrunch",
    title: "Startup raises $100M for nuclear fusion breakthrough",
    summary: "Helion Energy secures massive funding round as investors bet on clean energy revolution...",
    link: "https://example.com/article3",
    category: "TECH",
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: "4",
    source: "The Verge",
    title: "Google reveals new quantum computer with 1000 qubits",
    summary: "The Willow processor represents a major leap forward in quantum computing capabilities...",
    link: "https://example.com/article4",
    category: "TECH",
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
];

export function getCategoryColor(category: Category): string {
  switch (category) {
    case "WORLD":
      return "bg-green-500/20 text-green-400";
    case "TECH":
      return "bg-blue-500/20 text-blue-400";
    case "BUSINESS":
      return "bg-yellow-500/20 text-yellow-400";
    default:
      return "bg-slate-500/20 text-slate-400";
  }
}

export function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

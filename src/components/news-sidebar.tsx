"use client";

import { NewsArticle } from "@/lib/mock-data";
import { getCategoryColor, formatTimeAgo } from "@/lib/mock-data";

interface NewsSidebarProps {
  articles: NewsArticle[];
  onPromote?: (articleId: string) => void;
}

export function NewsSidebar({ articles, onPromote }: NewsSidebarProps) {
  return (
    <aside className="w-80 hidden lg:block">
      <h2 className="text-lg font-semibold text-white mb-4">Latest News</h2>
      <div className="space-y-3">
        {articles.map((article) => (
          <div key={article.id} className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-slate-400 font-medium">{article.source}</span>
              <span className="text-xs text-slate-500">· {formatTimeAgo(article.publishedAt)}</span>
            </div>
            <h4 className="text-sm font-medium text-white mb-2 line-clamp-2">{article.title}</h4>
            <div className="flex gap-2">
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:text-primaryHover"
              >
                Read more
              </a>
              <button
                onClick={() => onPromote?.(article.id)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Vote on this
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { CategoryFilter } from "@/components/category-filter"
import { getCategoryColor, formatTimeAgo } from "@/lib/utils"

interface NewsArticle {
  id: string
  title: string
  link: string
  summary: string | null
  imageUrl: string | null
  publishedAt: string
  feed: {
    id: string
    name: string
    category: string
  }
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [isLoading, setIsLoading] = useState(true)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchNews()
  }, [selectedCategory])

  const fetchNews = async () => {
    setIsLoading(true)
    try {
      const url = selectedCategory === "ALL" 
        ? "/api/news" 
        : `/api/news?category=${selectedCategory}`
      const response = await fetch(url)
      const data = await response.json()
      setArticles(data.articles || [])
    } catch (error) {
      console.error("Error fetching news:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Loading news...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No news found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <div key={article.id} className="bg-surface border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(article.feed.category)}`}>
                    {article.feed.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{article.feed.name}</span>
                  <span className="text-xs text-slate-500">· {formatTimeAgo(article.publishedAt)}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">{article.title}</h3>
                
                {article.summary && (
                  <p className="text-slate-300 text-sm mb-4 line-clamp-3">{article.summary}</p>
                )}
                
                <div className="flex gap-3">
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:text-primary-hover"
                  >
                    Read more →
                  </a>
                  <button
                    onClick={() => {
                      // This will be implemented to promote to topic
                      console.log("Promote:", article.id)
                    }}
                    className="text-sm text-slate-400 hover:text-white"
                  >
                    Vote on this
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

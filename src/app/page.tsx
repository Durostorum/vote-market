"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { CategoryFilter } from "@/components/category-filter"
import { TopicCard } from "@/components/topic-card"
import { NewsSidebar } from "@/components/news-sidebar"
import { TopicCardSkeleton, NewsCardSkeleton } from "@/components/loading-skeleton"

interface Topic {
  id: string
  title: string
  description: string
  category: string
  upCount: number
  downCount: number
  createdAt: string
  userVote?: "UP" | "DOWN"
}

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

export default function Home() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([])
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTopics()
    fetchNews()
  }, [selectedCategory])

  const fetchTopics = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const url = selectedCategory === "ALL" 
        ? "/api/topics" 
        : `/api/topics?category=${selectedCategory}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error("Failed to fetch topics")
      }
      
      const data = await response.json()
      setTopics(data.topics || [])
    } catch (error) {
      console.error("Error fetching topics:", error)
      setError("Failed to load topics. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchNews = async () => {
    try {
      const url = selectedCategory === "ALL" 
        ? "/api/news" 
        : `/api/news?category=${selectedCategory}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error("Failed to fetch news")
      }
      
      const data = await response.json()
      setNewsArticles(data.articles || [])
    } catch (error) {
      console.error("Error fetching news:", error)
    }
  }

  const handleVote = async (topicId: string, direction: "UP" | "DOWN") => {
    try {
      const response = await fetch(`/api/topics/${topicId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ direction }),
      })

      if (!response.ok) {
        const error = await response.json()
        if (error.error === "Unauthorized") {
          window.location.href = "/login"
          return
        }
        console.error("Vote error:", error)
        setError("Failed to vote. Please try again.")
        return
      }

      const data = await response.json()
      
      setTopics((prevTopics) =>
        prevTopics.map((topic) =>
          topic.id === topicId
            ? {
                ...topic,
                upCount: data.upCount,
                downCount: data.downCount,
                userVote: direction,
              }
            : topic
        )
      )
    } catch (error) {
      console.error("Error voting:", error)
      setError("Failed to vote. Please try again.")
    }
  }

  const handlePromote = async (articleId: string) => {
    // This will be implemented with RSS feed integration
    console.log("Promote article:", articleId)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
            <button 
              onClick={fetchTopics}
              className="ml-4 underline hover:text-red-400"
            >
              Retry
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <TopicCardSkeleton />
                <TopicCardSkeleton />
                <TopicCardSkeleton />
                <TopicCardSkeleton />
                <TopicCardSkeleton />
                <TopicCardSkeleton />
              </div>
            ) : topics.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400">No topics found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {topics.map((topic) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    onVote={handleVote}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="hidden lg:block w-80 flex-shrink-0">
            <NewsSidebar 
              articles={newsArticles}
              onPromote={handlePromote}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

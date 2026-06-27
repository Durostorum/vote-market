"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { CategoryFilter } from "@/components/category-filter"
import { TopicCard } from "@/components/topic-card"

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

export default function Home() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTopics()
  }, [selectedCategory])

  const fetchTopics = async () => {
    setIsLoading(true)
    try {
      const url = selectedCategory === "ALL" 
        ? "/api/topics" 
        : `/api/topics?category=${selectedCategory}`
      const response = await fetch(url)
      const data = await response.json()
      setTopics(data.topics || [])
    } catch (error) {
      console.error("Error fetching topics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVote = async (topicId: string, direction: "UP" | "DOWN") => {
    // This will be implemented in Issue #4
    console.log("Vote:", topicId, direction)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Loading topics...</p>
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No topics found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onVote={handleVote}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

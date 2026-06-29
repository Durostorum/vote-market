"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { VoteBar } from "@/components/vote-bar"
import { useSession } from "next-auth/react"
import { getCategoryColor, formatTimeAgo } from "@/lib/utils"

interface Comment {
  id: string
  body: string
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
}

interface Topic {
  id: string
  title: string
  description: string
  category: string
  upCount: number
  downCount: number
  createdAt: string
  sourceUrl: string | null
  promotedBy: {
    id: string
    name: string | null
    email: string
    image: string | null
  } | null
  comments: Comment[]
  _count: {
    votes: number
    comments: number
  }
}

export default function TopicDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchTopic(params.id as string)
    }
  }, [params.id])

  const fetchTopic = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/topics/${id}`)
      const data = await response.json()
      setTopic(data.topic)
    } catch (error) {
      console.error("Error fetching topic:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVote = async (direction: "UP" | "DOWN") => {
    if (!topic) return

    try {
      const response = await fetch(`/api/topics/${topic.id}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ direction }),
      })

      if (!response.ok) {
        const error = await response.json()
        if (error.error === "Unauthorized") {
          router.push("/login")
          return
        }
        console.error("Vote error:", error)
        return
      }

      const data = await response.json()
      
      setTopic({
        ...topic,
        upCount: data.upCount,
        downCount: data.downCount,
      })
    } catch (error) {
      console.error("Error voting:", error)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim() || !topic) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/topics/${topic.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: comment }),
      })

      if (!response.ok) {
        const error = await response.json()
        if (error.error === "Unauthorized") {
          router.push("/login")
          return
        }
        console.error("Comment error:", error)
        return
      }

      const data = await response.json()
      setTopic({
        ...topic,
        comments: [...topic.comments, data.comment],
      })
      setComment("")
    } catch (error) {
      console.error("Error submitting comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <p className="text-slate-400">Loading topic...</p>
        </div>
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <p className="text-slate-400">Topic not found</p>
        </div>
      </div>
    )
  }

  const total = topic.upCount + topic.downCount
  const upPercentage = total > 0 ? Math.round((topic.upCount / total) * 100) : 0

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <button
          onClick={() => router.back()}
          className="text-slate-400 hover:text-white mb-4 sm:mb-6 transition-colors text-sm"
        >
          ← Back to feed
        </button>

        <div className="bg-surface border border-border rounded-xl p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(topic.category)}`}>
              {topic.category}
            </span>
            <span className="text-slate-500 text-xs">{formatTimeAgo(topic.createdAt)}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white mb-4">{topic.title}</h1>
          
          <p className="text-slate-300 mb-4 text-sm sm:text-base">{topic.description}</p>

          {topic.sourceUrl && (
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Source:{" "}
              <a href={topic.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline">
                {new URL(topic.sourceUrl).hostname}
              </a>
            </p>
          )}

          <div className="mb-6">
            <VoteBar upCount={topic.upCount} downCount={topic.downCount} />
          </div>

          <div className="flex gap-3 sm:gap-4">
            <button
              onClick={() => handleVote("UP")}
              className="flex-1 bg-primary/20 border border-primary/50 text-primary py-3 rounded-lg font-medium hover:bg-primary/30 transition-colors min-h-[44px]"
            >
              👍 Up ({topic.upCount})
            </button>
            <button
              onClick={() => handleVote("DOWN")}
              className="flex-1 bg-danger/20 border border-danger/50 text-danger py-3 rounded-lg font-medium hover:bg-danger/30 transition-colors min-h-[44px]"
            >
              👎 Down ({topic.downCount})
            </button>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
            Comments ({topic.comments.length})
          </h2>

          <form onSubmit={handleSubmitComment} className="mb-6">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={session ? "Add a comment..." : "Sign in to comment"}
              disabled={!session || isSubmitting}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm sm:text-base"
              rows={3}
            />
            <button
              type="submit"
              disabled={!session || !comment.trim() || isSubmitting}
              className="mt-2 bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
          </form>

          {topic.comments.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No comments yet</p>
          ) : (
            <div className="space-y-4">
              {topic.comments.map((comment) => (
                <div key={comment.id} className="border-t border-border pt-4">
                  <div className="flex items-center gap-3 mb-2">
                    {comment.user.image ? (
                      <img
                        src={comment.user.image}
                        alt={comment.user.name || "User"}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-400">
                        {comment.user.name?.[0] || comment.user.email[0].toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium text-sm truncate">
                        {comment.user.name || comment.user.email}
                      </p>
                      <p className="text-slate-500 text-xs">{formatTimeAgo(comment.createdAt)}</p>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm sm:text-base">{comment.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

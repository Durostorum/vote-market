"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { signOut } from "next-auth/react"

interface UserVote {
  id: string
  direction: string
  createdAt: string
  topic: {
    id: string
    title: string
    category: string
  }
}

interface UserComment {
  id: string
  body: string
  createdAt: string
  topic: {
    id: string
    title: string
  }
}

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"profile" | "votes" | "comments">("profile")
  
  // Profile form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [profileMessage, setProfileMessage] = useState("")

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState("")

  // User data
  const [votes, setVotes] = useState<UserVote[]>([])
  const [comments, setComments] = useState<UserComment[]>([])
  const [isLoadingData, setIsLoadingData] = useState(false)

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "")
      setEmail(session.user.email || "")
    }
  }, [session])

  useEffect(() => {
    if (activeTab === "votes") {
      fetchVotes()
    } else if (activeTab === "comments") {
      fetchComments()
    }
  }, [activeTab])

  const fetchVotes = async () => {
    setIsLoadingData(true)
    try {
      const response = await fetch("/api/user/votes")
      const data = await response.json()
      setVotes(data.votes || [])
    } catch (error) {
      console.error("Error fetching votes:", error)
    } finally {
      setIsLoadingData(false)
    }
  }

  const fetchComments = async () => {
    setIsLoadingData(true)
    try {
      const response = await fetch("/api/user/comments")
      const data = await response.json()
      setComments(data.comments || [])
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setProfileMessage("")

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setProfileMessage(data.error || "Failed to update profile")
        return
      }

      setProfileMessage("Profile updated successfully")
      await update({ name, email })
    } catch (error) {
      setProfileMessage("An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMessage("")

    if (newPassword !== confirmPassword) {
      setPasswordMessage("Passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      setPasswordMessage("Password must be at least 6 characters")
      return
    }

    setIsChangingPassword(true)

    try {
      const response = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        setPasswordMessage(data.error || "Failed to change password")
        return
      }

      setPasswordMessage("Password changed successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      setPasswordMessage("An error occurred")
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return
    }

    if (!confirm("This will permanently delete all your data including votes and comments. Continue?")) {
      return
    }

    try {
      const response = await fetch("/api/user/account", {
        method: "DELETE",
      })

      if (!response.ok) {
        alert("Failed to delete account")
        return
      }

      await signOut({ callbackUrl: "/login" })
    } catch (error) {
      alert("An error occurred")
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <p className="text-slate-400">Please sign in to view your profile</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Profile</h1>

        <div className="mb-6">
          <div className="flex gap-4 border-b border-border">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "profile"
                  ? "text-white border-b-2 border-primary"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Profile Settings
            </button>
            <button
              onClick={() => setActiveTab("votes")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "votes"
                  ? "text-white border-b-2 border-primary"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Voting History
            </button>
            <button
              onClick={() => setActiveTab("comments")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "comments"
                  ? "text-white border-b-2 border-primary"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Comments
            </button>
          </div>
        </div>

        {activeTab === "profile" && (
          <div className="space-y-8">
            <div className="bg-surface border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
              
              {profileMessage && (
                <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${
                  profileMessage.includes("success") 
                    ? "bg-green-500/10 text-green-500" 
                    : "bg-red-500/10 text-red-500"
                }`}>
                  {profileMessage}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-hover disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Change Password</h2>
              
              {passwordMessage && (
                <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${
                  passwordMessage.includes("success") 
                    ? "bg-green-500/10 text-green-500" 
                    : "bg-red-500/10 text-red-500"
                }`}>
                  {passwordMessage}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-hover disabled:opacity-50"
                >
                  {isChangingPassword ? "Changing..." : "Change Password"}
                </button>
              </form>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Danger Zone</h2>
              <p className="text-slate-400 mb-4">Once you delete your account, there is no going back.</p>
              <button
                onClick={handleDeleteAccount}
                className="bg-danger text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}

        {activeTab === "votes" && (
          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Voting History</h2>
            
            {isLoadingData ? (
              <p className="text-slate-400">Loading...</p>
            ) : votes.length === 0 ? (
              <p className="text-slate-400">No votes yet</p>
            ) : (
              <div className="space-y-3">
                {votes.map((vote) => (
                  <div key={vote.id} className="border-b border-border py-3 last:border-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{vote.topic.title}</p>
                        <p className="text-slate-500 text-sm">{vote.topic.category}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        vote.direction === "UP" 
                          ? "bg-green-500/20 text-green-500" 
                          : "bg-red-500/20 text-red-500"
                      }`}>
                        {vote.direction}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "comments" && (
          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Comments</h2>
            
            {isLoadingData ? (
              <p className="text-slate-400">Loading...</p>
            ) : comments.length === 0 ? (
              <p className="text-slate-400">No comments yet</p>
            ) : (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-border py-3 last:border-0">
                    <p className="text-white font-medium mb-1">{comment.topic.title}</p>
                    <p className="text-slate-300">{comment.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

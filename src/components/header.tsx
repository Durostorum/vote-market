"use client"

import { useSession, signOut } from "next-auth/react"

export function Header() {
  const { data: session } = useSession()

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Vote Market</h1>
        
        {session?.user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-slate-300 text-sm">
                {session.user.name || session.user.email}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <a
            href="/login"
            className="text-sm text-green-500 hover:text-green-400 transition-colors"
          >
            Log in
          </a>
        )}
      </div>
    </header>
  )
}

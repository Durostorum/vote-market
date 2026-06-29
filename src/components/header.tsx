"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

export function Header() {
  const { data: session } = useSession()

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <header className="bg-slate-900 border-b border-slate-800  px-4 sm:px-6 py-3 sm:py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-lg sm:text-xl font-bold text-white">
          Vote Market
        </Link>
        
        {session?.user ? (
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex items-center gap-3">
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-slate-300 text-sm truncate max-w-[150px]">
                {session.user.name || session.user.email}
              </span>
            </div>
            <Link
              href="/profile"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="text-sm text-green-500 hover:text-green-400 transition-colors"
            >
              Log in
            </a>
            <a
              href="/signup"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Sign up
            </a>
          </div>
        )}
      </div>
    </header>
  )
}

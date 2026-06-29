"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"

export function Header() {
  const { data: session } = useSession()

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <header role="banner" className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 sm:py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-lg sm:text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-green-500 rounded">
          Vote Market
        </Link>
        
        <nav aria-label="User navigation">
          {session?.user ? (
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:flex items-center gap-3">
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={`${session.user.name || "User"}'s avatar`}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="text-slate-300 text-sm truncate max-w-[150px]" aria-label={`Signed in as ${session.user.name || session.user.email}`}>
                  {session.user.name || session.user.email}
                </span>
              </div>
              <Link
                href="/profile"
                className="text-sm text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                aria-label="Log out of your account"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <a
                href="/login"
                className="text-sm text-green-500 hover:text-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
              >
                Log in
              </a>
              <a
                href="/signup"
                className="text-sm text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
              >
                Sign up
              </a>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

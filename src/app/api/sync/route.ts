import { NextResponse } from "next/server"
import { syncRSSFeeds } from "@/lib/rss-parser"
import { env } from "@/lib/env"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { secret } = body

    // Verify cron secret
    if (secret !== env.CRON_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await syncRSSFeeds()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error syncing RSS feeds:", error)
    return NextResponse.json(
      { error: "Failed to sync RSS feeds" },
      { status: 500 }
    )
  }
}

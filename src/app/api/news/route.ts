import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    const where = category && category !== "ALL" 
      ? { 
          feed: { category },
          topic: null // Only show news that hasn't been promoted to a topic yet
        } 
      : { topic: null }

    const articles = await prisma.newsArticle.findMany({
      where,
      include: {
        feed: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: 20,
    })

    return NextResponse.json({ articles })
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    )
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { rateLimit, getRateLimitHeaders } from "@/lib/rate-limit"
import { getSecurityHeaders } from "@/lib/security"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { direction } = body

    if (direction !== "UP" && direction !== "DOWN") {
      return NextResponse.json(
        { error: "Invalid direction" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Rate limit: 10 votes per minute per user
    const identifier = `vote:${user.id}`
    if (!rateLimit(identifier, 10, 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { 
          status: 429,
          headers: getRateLimitHeaders(identifier, 10, 60 * 1000)
        }
      )
    }

    // Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_topicId: {
          userId: user.id,
          topicId: params.id,
        },
      },
    })

    if (existingVote) {
      // Update existing vote
      const updatedVote = await prisma.vote.update({
        where: { id: existingVote.id },
        data: { direction },
      })

      // Recalculate vote counts
      const votes = await prisma.vote.groupBy({
        by: ["direction"],
        where: { topicId: params.id },
        _count: true,
      })

      const upCount = votes.find((v: any) => v.direction === "UP")?._count || 0
      const downCount = votes.find((v: any) => v.direction === "DOWN")?._count || 0

      await prisma.topic.update({
        where: { id: params.id },
        data: { upCount, downCount },
      })

      return NextResponse.json({
        success: true,
        vote: updatedVote,
        upCount,
        downCount,
      })
    }

    // Create new vote
    const vote = await prisma.vote.create({
      data: {
        userId: user.id,
        topicId: params.id,
        direction,
      },
    })

    // Update topic vote counts
    const topic = await prisma.topic.update({
      where: { id: params.id },
      data: {
        upCount: direction === "UP" ? { increment: 1 } : undefined,
        downCount: direction === "DOWN" ? { increment: 1 } : undefined,
      },
    })

    return NextResponse.json({
      success: true,
      vote,
      upCount: topic.upCount,
      downCount: topic.downCount,
    }, {
      headers: getSecurityHeaders(),
    })
  } catch (error) {
    console.error("Error voting:", error)
    return NextResponse.json(
      { error: "Failed to vote" },
      { 
        status: 500,
        headers: getSecurityHeaders(),
      }
    )
  }
}

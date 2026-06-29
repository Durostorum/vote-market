import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { rateLimit, getRateLimitHeaders } from "@/lib/rate-limit"
import { getSecurityHeaders, sanitizeInput } from "@/lib/security"

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
    const { body: commentBody } = body

    if (!commentBody || commentBody.trim().length === 0) {
      return NextResponse.json(
        { error: "Comment body is required" },
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

    // Rate limit: 5 comments per minute per user
    const identifier = `comment:${user.id}`
    if (!rateLimit(identifier, 5, 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { 
          status: 429,
          headers: getRateLimitHeaders(identifier, 5, 60 * 1000)
        }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        userId: user.id,
        topicId: params.id,
        body: sanitizeInput(commentBody),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json({ comment }, { 
      status: 201,
      headers: getSecurityHeaders(),
    })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json(
      { error: "Failed to create comment" },
      { 
        status: 500,
        headers: getSecurityHeaders(),
      }
    )
  }
}

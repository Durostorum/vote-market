import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { rateLimit, getRateLimitHeaders } from "@/lib/rate-limit"
import { getSecurityHeaders } from "@/lib/security"

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Rate limit: 3 password changes per hour per user
    const identifier = `password:${user.id}`
    if (!rateLimit(identifier, 3, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many password change attempts" },
        { 
          status: 429,
          headers: getRateLimitHeaders(identifier, 3, 60 * 60 * 1000)
        }
      )
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    const isCorrectPassword = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    )

    if (!isCorrectPassword) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      )
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    })

    return NextResponse.json({ success: true }, {
      headers: getSecurityHeaders(),
    })
  } catch (error) {
    console.error("Error changing password:", error)
    return NextResponse.json(
      { error: "Failed to change password" },
      { 
        status: 500,
        headers: getSecurityHeaders(),
      }
    )
  }
}

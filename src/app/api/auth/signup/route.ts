import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { rateLimit, getRateLimitHeaders } from "@/lib/rate-limit"
import { getSecurityHeaders, sanitizeInput } from "@/lib/security"

export async function POST(request: Request) {
  try {
    // Rate limit: 3 signups per IP per hour
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    if (!rateLimit(`signup:${ip}`, 3, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many signup attempts" },
        { 
          status: 429,
          headers: getRateLimitHeaders(`signup:${ip}`, 3, 60 * 60 * 1000)
        }
      )
    }

    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name ? sanitizeInput(name) : null,
      },
    })

    return NextResponse.json(
      { 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
      { 
        status: 201,
        headers: getSecurityHeaders(),
      }
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "An error occurred during signup" },
      { 
        status: 500,
        headers: getSecurityHeaders(),
      }
    )
  }
}

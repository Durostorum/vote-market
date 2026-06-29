import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function DELETE() {
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

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Delete user (cascade will handle votes and comments)
    await prisma.user.delete({
      where: { id: user.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting account:", error)
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    )
  }
}

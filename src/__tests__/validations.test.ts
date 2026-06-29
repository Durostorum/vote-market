import { describe, it, expect } from "vitest"
import {
  loginSchema,
  signupSchema,
  commentSchema,
  profileSchema,
  passwordSchema,
} from "@/lib/validations"

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({ email: "user@example.com", password: "secret123" })
    expect(result.success).toBe(true)
  })

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({ email: "not-an-email", password: "secret123" })
    expect(result.success).toBe(false)
  })

  it("rejects short password", () => {
    const result = loginSchema.safeParse({ email: "user@example.com", password: "abc" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Password must be at least 6 characters")
    }
  })

  it("rejects missing email", () => {
    const result = loginSchema.safeParse({ password: "secret123" })
    expect(result.success).toBe(false)
  })
})

describe("signupSchema", () => {
  const validPayload = {
    name: "Alice",
    email: "alice@example.com",
    password: "password123",
    confirmPassword: "password123",
  }

  it("accepts valid signup data", () => {
    expect(signupSchema.safeParse(validPayload).success).toBe(true)
  })

  it("accepts signup without name", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name: _name, ...rest } = validPayload
    expect(signupSchema.safeParse(rest).success).toBe(true)
  })

  it("rejects mismatched passwords", () => {
    const result = signupSchema.safeParse({ ...validPayload, confirmPassword: "different" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Passwords do not match")
    }
  })

  it("rejects short name", () => {
    const result = signupSchema.safeParse({ ...validPayload, name: "A" })
    expect(result.success).toBe(false)
  })

  it("rejects invalid email", () => {
    const result = signupSchema.safeParse({ ...validPayload, email: "bad" })
    expect(result.success).toBe(false)
  })
})

describe("commentSchema", () => {
  it("accepts a valid comment", () => {
    expect(commentSchema.safeParse({ body: "Great topic!" }).success).toBe(true)
  })

  it("rejects an empty comment", () => {
    const result = commentSchema.safeParse({ body: "" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Comment cannot be empty")
    }
  })

  it("rejects a comment over 1000 characters", () => {
    const result = commentSchema.safeParse({ body: "a".repeat(1001) })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Comment too long")
    }
  })

  it("accepts a comment of exactly 1000 characters", () => {
    expect(commentSchema.safeParse({ body: "a".repeat(1000) }).success).toBe(true)
  })
})

describe("profileSchema", () => {
  it("accepts valid profile data", () => {
    expect(profileSchema.safeParse({ email: "user@example.com", name: "Alice" }).success).toBe(true)
  })

  it("accepts profile without name", () => {
    expect(profileSchema.safeParse({ email: "user@example.com" }).success).toBe(true)
  })

  it("rejects invalid email", () => {
    expect(profileSchema.safeParse({ email: "not-email" }).success).toBe(false)
  })

  it("rejects short name", () => {
    expect(profileSchema.safeParse({ email: "user@example.com", name: "A" }).success).toBe(false)
  })
})

describe("passwordSchema", () => {
  const validPayload = {
    currentPassword: "oldpassword",
    newPassword: "newpassword123",
    confirmPassword: "newpassword123",
  }

  it("accepts valid password change", () => {
    expect(passwordSchema.safeParse(validPayload).success).toBe(true)
  })

  it("rejects mismatched new passwords", () => {
    const result = passwordSchema.safeParse({ ...validPayload, confirmPassword: "different" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Passwords do not match")
    }
  })

  it("rejects short new password", () => {
    const result = passwordSchema.safeParse({ ...validPayload, newPassword: "abc", confirmPassword: "abc" })
    expect(result.success).toBe(false)
  })

  it("rejects empty current password", () => {
    const result = passwordSchema.safeParse({ ...validPayload, currentPassword: "" })
    expect(result.success).toBe(false)
  })
})

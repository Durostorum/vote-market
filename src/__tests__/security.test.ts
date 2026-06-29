import { describe, it, expect } from "vitest"
import { sanitizeInput, getSecurityHeaders, getCSPHeaders } from "@/lib/security"

describe("sanitizeInput", () => {
  it("removes < and > characters", () => {
    expect(sanitizeInput("<script>alert('xss')</script>")).toBe("scriptalert('xss')/script")
  })

  it("removes both opening and closing angle brackets", () => {
    expect(sanitizeInput("Hello <World>")).toBe("Hello World")
  })

  it("trims whitespace", () => {
    expect(sanitizeInput("  hello  ")).toBe("hello")
  })

  it("truncates strings longer than 1000 characters", () => {
    const long = "a".repeat(1500)
    expect(sanitizeInput(long)).toHaveLength(1000)
  })

  it("returns empty string for empty input", () => {
    expect(sanitizeInput("")).toBe("")
  })

  it("preserves normal text", () => {
    expect(sanitizeInput("This is a normal comment.")).toBe("This is a normal comment.")
  })
})

describe("getSecurityHeaders", () => {
  it("returns all required security headers", () => {
    const headers = getSecurityHeaders()
    expect(headers["X-Content-Type-Options"]).toBe("nosniff")
    expect(headers["X-Frame-Options"]).toBe("DENY")
    expect(headers["X-XSS-Protection"]).toBe("1; mode=block")
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin")
    expect(headers["Permissions-Policy"]).toBe("camera=(), microphone=(), geolocation=()")
  })

  it("returns an object with 5 headers", () => {
    expect(Object.keys(getSecurityHeaders())).toHaveLength(5)
  })
})

describe("getCSPHeaders", () => {
  it("returns Content-Security-Policy header", () => {
    const headers = getCSPHeaders()
    expect(headers["Content-Security-Policy"]).toBeDefined()
  })

  it("includes frame-ancestors none to prevent clickjacking", () => {
    const { "Content-Security-Policy": csp } = getCSPHeaders()
    expect(csp).toContain("frame-ancestors 'none'")
  })

  it("includes default-src self", () => {
    const { "Content-Security-Policy": csp } = getCSPHeaders()
    expect(csp).toContain("default-src 'self'")
  })
})

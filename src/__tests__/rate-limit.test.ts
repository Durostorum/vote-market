import { describe, it, expect, vi, beforeEach } from "vitest"
import { rateLimit, getRateLimitHeaders } from "@/lib/rate-limit"

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2024-01-15T12:00:00Z"))
  })

  it("allows first request", () => {
    expect(rateLimit("test-id-1", 5, 60000)).toBe(true)
  })

  it("allows requests up to the limit", () => {
    const id = "test-id-2"
    for (let i = 0; i < 5; i++) {
      expect(rateLimit(id, 5, 60000)).toBe(true)
    }
  })

  it("blocks request exceeding the limit", () => {
    const id = "test-id-3"
    for (let i = 0; i < 5; i++) {
      rateLimit(id, 5, 60000)
    }
    expect(rateLimit(id, 5, 60000)).toBe(false)
  })

  it("resets after the window expires", () => {
    const id = "test-id-4"
    for (let i = 0; i < 5; i++) {
      rateLimit(id, 5, 60000)
    }
    expect(rateLimit(id, 5, 60000)).toBe(false)

    vi.advanceTimersByTime(61000)
    expect(rateLimit(id, 5, 60000)).toBe(true)
  })

  it("tracks different identifiers independently", () => {
    const id1 = "test-id-5a"
    const id2 = "test-id-5b"
    for (let i = 0; i < 5; i++) {
      rateLimit(id1, 5, 60000)
    }
    expect(rateLimit(id1, 5, 60000)).toBe(false)
    expect(rateLimit(id2, 5, 60000)).toBe(true)
  })
})

describe("getRateLimitHeaders", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2024-01-15T12:00:00Z"))
  })

  it("returns rate limit headers", () => {
    const id = "test-headers-1"
    rateLimit(id, 10, 60000)
    const headers = getRateLimitHeaders(id, 10, 60000)
    expect(headers["X-RateLimit-Limit"]).toBe("10")
    expect(headers["X-RateLimit-Remaining"]).toBeDefined()
    expect(headers["X-RateLimit-Reset"]).toBeDefined()
  })

  it("decrements remaining count after each use", () => {
    const id = "test-headers-2"
    rateLimit(id, 10, 60000)
    rateLimit(id, 10, 60000)
    rateLimit(id, 10, 60000)
    const headers = getRateLimitHeaders(id, 10, 60000)
    expect(headers["X-RateLimit-Remaining"]).toBe("7")
  })

  it("returns valid ISO date for reset time", () => {
    const id = "test-headers-3"
    rateLimit(id, 10, 60000)
    const headers = getRateLimitHeaders(id, 10, 60000)
    expect(new Date(headers["X-RateLimit-Reset"]).getTime()).toBeGreaterThan(Date.now())
  })
})

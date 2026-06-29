import { describe, it, expect, vi, beforeEach } from "vitest"
import { cn, getCategoryColor, formatTimeAgo } from "@/lib/utils"

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible")
  })

  it("merges Tailwind classes correctly (last wins)", () => {
    expect(cn("text-sm", "text-lg")).toBe("text-lg")
  })

  it("handles undefined/null values", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(cn("base", undefined, null as any)).toBe("base")
  })
})

describe("getCategoryColor", () => {
  it("returns correct color for TECH", () => {
    expect(getCategoryColor("TECH")).toBe("bg-blue-500/20 text-blue-400")
  })

  it("returns correct color for WORLD", () => {
    expect(getCategoryColor("WORLD")).toBe("bg-purple-500/20 text-purple-400")
  })

  it("returns correct color for BUSINESS", () => {
    expect(getCategoryColor("BUSINESS")).toBe("bg-yellow-500/20 text-yellow-400")
  })

  it("returns OTHER color for unknown category", () => {
    expect(getCategoryColor("UNKNOWN")).toBe("bg-slate-500/20 text-slate-400")
  })

  it("returns OTHER color for empty string", () => {
    expect(getCategoryColor("")).toBe("bg-slate-500/20 text-slate-400")
  })

  it("returns OTHER color for OTHER category", () => {
    expect(getCategoryColor("OTHER")).toBe("bg-slate-500/20 text-slate-400")
  })
})

describe("formatTimeAgo", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2024-01-15T12:00:00Z"))
  })

  it("returns 'just now' for seconds ago", () => {
    const date = new Date("2024-01-15T11:59:30Z").toISOString()
    expect(formatTimeAgo(date)).toBe("just now")
  })

  it("returns minutes ago", () => {
    const date = new Date("2024-01-15T11:55:00Z").toISOString()
    expect(formatTimeAgo(date)).toBe("5m ago")
  })

  it("returns hours ago", () => {
    const date = new Date("2024-01-15T09:00:00Z").toISOString()
    expect(formatTimeAgo(date)).toBe("3h ago")
  })

  it("returns days ago", () => {
    const date = new Date("2024-01-13T12:00:00Z").toISOString()
    expect(formatTimeAgo(date)).toBe("2d ago")
  })

  it("returns 'just now' for exact current time", () => {
    const date = new Date("2024-01-15T12:00:00Z").toISOString()
    expect(formatTimeAgo(date)).toBe("just now")
  })
})

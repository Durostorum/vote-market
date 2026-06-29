import { z } from "zod"

// During the Next.js production build phase, server-side env vars like
// DATABASE_URL and CRON_SECRET are not available. We relax those requirements
// so `next build` can succeed; they are strictly required at runtime.
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build"

const envSchema = z.object({
  DATABASE_URL: isBuildPhase
    ? z.string().optional().default("postgres://build-placeholder")
    : z.string().min(1, "DATABASE_URL is required"),
  NEXTAUTH_SECRET: isBuildPhase
    ? z.string().optional().default("build-placeholder")
    : z.string().min(1, "NEXTAUTH_SECRET is required"),
  NEXTAUTH_URL: z.string().url("Invalid NEXTAUTH_URL").optional(),
  // Google OAuth is optional — omit to disable Google sign-in
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  CRON_SECRET: isBuildPhase
    ? z.string().optional().default("build-placeholder")
    : z.string().min(1, "CRON_SECRET is required"),
})

export const env = envSchema.parse(process.env)

export type Env = z.infer<typeof envSchema>

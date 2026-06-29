import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  NEXTAUTH_URL: z.string().url("Invalid NEXTAUTH_URL").optional(),
  // Google OAuth is optional — omit to disable Google sign-in
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  CRON_SECRET: z.string().min(1, "CRON_SECRET is required"),
})

export const env = envSchema.parse(process.env)

export type Env = z.infer<typeof envSchema>

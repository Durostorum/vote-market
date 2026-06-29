import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string().url("Invalid DATABASE_URL"),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  NEXTAUTH_URL: z.string().url("Invalid NEXTAUTH_URL").optional(),
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
  CRON_SECRET: z.string().min(1, "CRON_SECRET is required"),
})

export const env = envSchema.parse(process.env)

export type Env = z.infer<typeof envSchema>

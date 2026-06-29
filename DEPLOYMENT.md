# Deployment Guide — Netlify

Vote Market is deployed on Netlify with:
- **Netlify Database** (managed PostgreSQL) — auto-provisioned, zero config
- **Netlify Functions** — Next.js API routes and server components
- **Netlify Edge** — Next.js middleware

---

## Prerequisites

- A [Netlify account](https://app.netlify.com) (free tier works)
- Netlify CLI: `npm install -g netlify-cli`
- This repo connected to GitHub (already done)

---

## One-time Setup

### 1. Authenticate the CLI

```bash
netlify login
```

### 2. Create / link the Netlify site

```bash
# From the repo root — creates the site and writes .netlify/state.json
netlify init
```

Choose **"Create & configure a new site"**, then accept the detected build settings (`next build`, publish `.next`).

### 3. Set required environment variables

In the **Netlify dashboard → Site → Environment variables** (or via CLI):

```bash
# Generate a strong secret:  openssl rand -base64 32
netlify env:set NEXTAUTH_SECRET "your-32-char-secret"

# Your production URL (set after first deploy if unknown)
netlify env:set NEXTAUTH_URL "https://your-site.netlify.app"

# RSS sync protection secret
netlify env:set CRON_SECRET "your-cron-secret"

# Google OAuth (optional — omit to disable Google sign-in)
netlify env:set GOOGLE_CLIENT_ID "your-google-client-id"
netlify env:set GOOGLE_CLIENT_SECRET "your-google-client-secret"
```

> **DATABASE_URL is set automatically** — `netlify.toml` maps `NETLIFY_DB_URL`
> (injected by Netlify Database) to `DATABASE_URL` so Prisma picks it up.
> You do not set `DATABASE_URL` manually.

### 4. Deploy to production

```bash
netlify deploy --prod
```

Netlify will:
1. Install dependencies
2. Run `npx prisma migrate deploy` (applies `prisma/migrations/` to the provisioned DB)
3. Run `next build`
4. Upload the `.next` build to the CDN

### 5. Seed initial data (first deploy only)

```bash
netlify env:get DATABASE_URL   # copy the value
DATABASE_URL="<value>" npm run seed
```

Or run it via the Netlify dashboard's one-off function invocation.

---

## Google OAuth Setup (optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create an OAuth 2.0 Client ID (Web application)
3. Add Authorized redirect URIs:
   - `https://your-site.netlify.app/api/auth/callback/google`
4. Copy Client ID and Client Secret into the Netlify environment variables above

---

## RSS Sync Cron Job

The `/api/sync` endpoint syncs RSS feeds. Set up a Netlify scheduled function or an external cron (e.g. cron-job.org) to call it every 6 hours:

```
POST https://your-site.netlify.app/api/sync
Content-Type: application/json
Body: {"secret": "YOUR_CRON_SECRET"}
```

---

## Environment Variable Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | auto | Set from `NETLIFY_DB_URL` via `netlify.toml` — do not set manually |
| `NEXTAUTH_SECRET` | ✅ | Random 32+ char string for JWT signing |
| `NEXTAUTH_URL` | ✅ prod | Full site URL, e.g. `https://your-site.netlify.app` |
| `CRON_SECRET` | ✅ | Shared secret for `/api/sync` endpoint |
| `GOOGLE_CLIENT_ID` | optional | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | optional | Google OAuth client secret |

---

## Smoke-Test Checklist

Run this after every production deploy:

- [ ] Home page loads with topic cards
- [ ] Category filter (Tech / World / Business / All) works
- [ ] Sign up with new email → session created
- [ ] Log out → session cleared; log back in
- [ ] Upvote a topic → vote bar updates
- [ ] Navigate to topic detail → full info shown
- [ ] Post a comment → appears immediately
- [ ] Visit `/profile` → activity history shows
- [ ] Change display name → persists after refresh
- [ ] Visit `/news` → article list visible
- [ ] Anonymous vote attempt → redirected to `/login`

---

## Updating the Deployment

Every push to `main` triggers a new Netlify build automatically (Git-connected deploy).

To deploy manually:

```bash
# Preview (test URL, not live)
netlify deploy

# Production
netlify deploy --prod
```

---

## Troubleshooting

**Build fails with "DATABASE_URL is required"**
→ Check that `@netlify/database` is in `dependencies` and Netlify Database is enabled for the site (Site → Database tab).

**`prisma migrate deploy` fails**
→ Check that `prisma/migrations/migration_lock.toml` has `provider = "postgresql"` and that the migration SQL files are committed.

**NextAuth errors on first load**
→ Ensure `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set in environment variables and the deploy was triggered after setting them.

**Google sign-in fails**
→ Verify the redirect URI in Google Cloud Console exactly matches `https://your-site.netlify.app/api/auth/callback/google`.

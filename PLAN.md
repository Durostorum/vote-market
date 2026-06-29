# Vote Market — Project Plan

## Concept

Vote Market is a social platform where users vote on trending news topics. Inspired by prediction markets, it lets the crowd signal opinion on real-world stories through simple up/down votes, with a live vote bar showing the split. News articles are pulled automatically from RSS feeds and can be promoted into voteable topics by any logged-in user.

## Scope

### In scope (v1)
- Email/password sign-up and login
- Google OAuth login
- Topic feed with category filtering (All, World, Tech, Business)
- Upvote / downvote on any topic (one vote per user per topic, changeable)
- Topic detail page with full description, source link, and vote breakdown
- Comments on topics (flat, no threading)
- Automated RSS feed sync (every 6 hours via scheduled endpoint)
- News sidebar showing latest articles with a "Vote on this" promote action
- User profile: edit name/email, change password, view vote and comment history, delete account
- Mobile-first responsive design
- Security: rate limiting, input sanitisation, security headers, CRON_SECRET for sync

### Out of scope (v1)
- Topic threading / nested replies
- Real-time vote updates (WebSocket / SSE)
- User reputation / karma
- Admin dashboard
- Email notifications
- Native mobile app

### Backlog (v2 candidates)
- Migrate to PostgreSQL for production (currently SQLite — blocks Netlify deploy)
- Add `netlify.toml` and deploy to Netlify (see DEPLOYMENT.md and open Issue #13)
- Make Google OAuth credentials optional so the app boots without them
- Real-time vote counts via Server-Sent Events
- Topic expiry / archiving
- Moderation tools

---

## Data Model

```
User
  id            cuid PK
  email         string UNIQUE
  name          string?
  image         string?
  passwordHash  string?
  createdAt
  updatedAt
  → promotedTopics  Topic[]
  → votes           Vote[]
  → comments        Comment[]

Topic
  id            cuid PK
  title         string
  description   string
  slug          string UNIQUE
  category      enum (WORLD | TECH | BUSINESS | OTHER)
  topicType     string  default SENTIMENT
  sourceUrl     string?
  newsArticleId string? FK → NewsArticle (1:1)
  status        string  default OPEN
  promotedById  string? FK → User
  upCount       int     default 0
  downCount     int     default 0
  createdAt
  updatedAt
  @@index [category]
  @@index [createdAt]

Vote
  id         cuid PK
  userId     FK → User  (cascade delete)
  topicId    FK → Topic (cascade delete)
  direction  enum (UP | DOWN)
  createdAt
  @@unique [userId, topicId]   ← one vote per user per topic

Comment
  id        cuid PK
  userId    FK → User  (cascade delete)
  topicId   FK → Topic (cascade delete)
  body      string (max 1000 chars)
  createdAt
  updatedAt
  @@index [topicId]

RssFeed
  id            cuid PK
  name          string
  url           string UNIQUE
  category      string
  enabled       bool   default true
  lastFetchedAt DateTime?
  createdAt
  updatedAt

NewsArticle
  id          cuid PK
  feedId      FK → RssFeed (cascade delete)
  guid        string
  title       string
  summary     string?
  link        string
  imageUrl    string?
  publishedAt DateTime
  fetchedAt   DateTime
  @@unique [feedId, guid]
  @@index [publishedAt]
```

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | SQLite (dev) → PostgreSQL (prod) via Prisma ORM |
| Auth | NextAuth.js v5 + bcryptjs |
| Validation | Zod |
| Testing | Vitest + jsdom |
| CI | GitHub Actions |
| Deployment target | Netlify (see DEPLOYMENT.md for blockers) |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Postgres (prod) or `file:./dev.db` (local) |
| `NEXTAUTH_SECRET` | ✅ | Random 32+ char secret for JWT signing |
| `NEXTAUTH_URL` | ✅ prod | Full site URL (e.g. `https://your-site.netlify.app`) |
| `GOOGLE_CLIENT_ID` | ✅* | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | ✅* | Google OAuth client secret |
| `CRON_SECRET` | ✅ | Shared secret for the `/api/sync` RSS cron endpoint |

\* Currently required even if not using Google OAuth — tracked as a backlog item to make optional.

See `.env.example` for a template.

# Vote Market — Build Steps

Each step ends with a **Verify** checkpoint. Do not move to the next step until all checks pass.
Commit after each step using [conventional commits](https://www.conventionalcommits.org/):
`feat:`, `fix:`, `chore:`, `docs:`, `ci:`, `test:`, `refactor:`, `perf:`, `style:`

---

## Step 1 — Project scaffold & database schema ✅

**What:** Initialise Next.js 14 (App Router, TypeScript, Tailwind), add Prisma with SQLite, define all models.

**Tasks:**
- `npx create-next-app@latest` with TypeScript + Tailwind
- Install Prisma and define schema: `User`, `Topic`, `Vote`, `Comment`, `RssFeed`, `NewsArticle`
- Run `npx prisma migrate dev --name init`
- Add `.env.example` with all required keys; add `.env` and `.netlify/` to `.gitignore`

**Verify:**
- [ ] `npx prisma studio` opens without errors
- [ ] All models visible with correct relations
- [ ] `.env` not tracked by git (`git status` shows clean)

---

## Step 2 — Authentication ✅

**What:** Email/password sign-up + login, Google OAuth, JWT sessions via NextAuth.js v5.

**Tasks:**
- Install `next-auth@beta`, `@auth/prisma-adapter`, `bcryptjs`
- Configure `src/lib/auth.ts` with Credentials + Google providers
- Add `POST /api/auth/signup` route
- Add login and sign-up pages with form validation (Zod)
- Protect write routes with `auth()` session guard; redirect anon users to `/login`

**Verify:**
- [ ] Can sign up with email/password → redirected to home
- [ ] Can log in → session cookie set
- [ ] Invalid credentials → error message shown
- [ ] Attempting to vote while logged out → redirected to `/login`
- [ ] Google OAuth redirects to callback correctly (requires `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`)

---

## Step 3 — Main feed page ✅

**What:** `/` route with topic grid, category filter chips, and loading skeletons.

**Tasks:**
- `GET /api/topics?category=` route with Prisma query
- `TopicCard` component: category pill, time ago, title, vote bar, up/down buttons
- `CategoryFilter` component: All / World / Tech / Business
- Responsive grid: 1 col mobile → 2 col tablet → 3 col desktop
- `TopicCardSkeleton` for loading state

**Verify:**
- [ ] Feed loads and displays topic cards
- [ ] Category filter narrows the list
- [ ] Skeleton shown during fetch
- [ ] Empty state shown when no topics match
- [ ] Layout correct on mobile and desktop

---

## Step 4 — Voting functionality ✅

**What:** Upvote / downvote with one-vote-per-user constraint and optimistic UI updates.

**Tasks:**
- `POST /api/topics/[id]/vote` route: create or update vote, recalculate `upCount`/`downCount`
- Rate limit: 10 votes/minute per user
- Optimistic update: update local state immediately, revert on error
- Highlight active vote button (`aria-pressed`)

**Verify:**
- [ ] Logged-in user can upvote → bar updates instantly
- [ ] Changing vote (up → down) works; counts update correctly
- [ ] Unauthenticated user → redirected to `/login`
- [ ] Sending 11 votes in under a minute → 429 response
- [ ] Duplicate vote on same topic changes direction, not adds a second row

---

## Step 5 — Topic detail page ✅

**What:** `/topics/[id]` route with full topic info, large vote bar, and comments section.

**Tasks:**
- `GET /api/topics/[id]` route (includes comments + promotedBy)
- Topic header: category pill, time ago, title, description, source link
- Large `VoteBar` with percentage and total counts
- Prominent up/down vote buttons
- Back link to feed

**Verify:**
- [ ] Navigating to `/topics/[id]` renders full topic
- [ ] Vote bar reflects correct percentages
- [ ] Clicking vote buttons updates counts in real time
- [ ] Unknown `id` → "Topic not found" message
- [ ] Source link opens in new tab

---

## Step 6 — Comments system ✅

**What:** Comment list and form on the topic detail page.

**Tasks:**
- `POST /api/topics/[id]/comments` route (auth-guarded)
- Display comments: avatar, name, time ago, body
- Comment form: textarea with `label`, submit button, disabled when unauthenticated
- Empty state message when no comments exist

**Verify:**
- [ ] Logged-in user can post a comment → appears immediately below form
- [ ] Comment textarea disabled + placeholder updated for anon users
- [ ] Empty comment body → submit button disabled
- [ ] Comment body > 1000 chars → Zod validation error

---

## Step 7 — News sidebar ✅

**What:** Right-hand sidebar on the feed page showing latest news articles.

**Tasks:**
- `NewsSidebar` component: article cards with category pill, source name, time ago, title
- "Read more" link (opens in new tab) and "Vote on this" promote button
- Hidden on mobile (`hidden lg:block`); loaded with `React.lazy` + `Suspense`
- Accessible: `<aside aria-label>`, `role="list"`, `<article>` per item

**Verify:**
- [ ] Sidebar visible on desktop, hidden on mobile
- [ ] Articles display correctly (title, source, time ago)
- [ ] "Read more" opens article in new tab
- [ ] Sidebar does not block page load (lazy-loaded)

---

## Step 8 — RSS feed integration ✅

**What:** Background sync that fetches articles from configured RSS feeds and saves them to the database.

**Tasks:**
- `src/lib/rss-parser.ts`: fetch, parse, and upsert `NewsArticle` records
- `POST /api/sync` route: verify `CRON_SECRET` → call `syncRSSFeeds()`
- Pre-seed `RssFeed` records via `prisma/seed.ts`
- Cron schedule: `0 */6 * * *` (every 6 hours)

**Verify:**
- [ ] `POST /api/sync` with correct secret → returns `{ success: true }`
- [ ] `POST /api/sync` with wrong secret → 401
- [ ] New articles appear in `NewsArticle` table after sync
- [ ] Duplicate articles (same `feedId + guid`) are upserted, not duplicated

---

## Step 9 — Mobile news page ✅

**What:** `/news` route — a full-page news list for mobile users who can't see the sidebar.

**Tasks:**
- `/news` page with the same article cards as the sidebar
- Category filter (same chips as the feed)
- Loading skeleton while fetching

**Verify:**
- [ ] `/news` renders article list
- [ ] Category filter narrows articles
- [ ] Page is usable on a 375 px viewport

---

## Step 10 — User profile & settings ✅

**What:** `/profile` page for editing name/email, changing password, viewing activity, and deleting account.

**Tasks:**
- `PATCH /api/user/profile` — update name/email (auth-guarded)
- `POST /api/user/password` — change password with bcrypt (auth-guarded)
- `GET /api/user/votes` and `GET /api/user/comments` — activity history (auth-guarded)
- `DELETE /api/user/account` — cascade-delete user (auth-guarded)
- Tabbed UI: Profile / Votes / Comments

**Verify:**
- [ ] Can update display name → persisted on refresh
- [ ] Wrong current password → error message shown
- [ ] Vote history tab lists all user votes
- [ ] Delete account → session cleared, user removed from DB
- [ ] All routes return 401 for unauthenticated requests

---

## Step 11 — Error handling & loading states ✅

**What:** Consistent error boundaries, retry buttons, and loading skeletons across the app.

**Tasks:**
- `src/app/error.tsx` — global error boundary with retry
- `src/app/not-found.tsx` — 404 page
- Inline error messages with Retry button on the feed page
- `TopicCardSkeleton`, `NewsCardSkeleton`, `CommentSkeleton` components

**Verify:**
- [ ] Killing the API server mid-load shows error + Retry button
- [ ] Navigating to `/topics/nonexistent` → "Topic not found"
- [ ] Navigating to `/bad-path` → custom 404 page
- [ ] Retry button re-fetches and restores content

---

## Step 12 — Form validation ✅

**What:** Client-side and server-side Zod validation for all forms.

**Tasks:**
- Zod schemas in `src/lib/validations.ts`: `loginSchema`, `signupSchema`, `commentSchema`, `profileSchema`, `passwordSchema`
- Inline field errors shown under each input on blur/submit
- API routes validate request bodies with the same schemas

**Verify:**
- [ ] Sign-up with mismatched passwords → "Passwords do not match" under confirmPassword
- [ ] Login with invalid email → "Invalid email address"
- [ ] Comment longer than 1000 chars → validation error
- [ ] `POST /api/topics/[id]/comments` with empty body → 400 from server

---

## Step 13 — Security audit & hardening ✅

**What:** Security headers, input sanitisation, rate limiting, environment variable validation.

**Tasks:**
- `src/lib/security.ts`: `sanitizeInput`, `getSecurityHeaders`, `getCSPHeaders`
- `src/lib/rate-limit.ts`: sliding-window rate limiter applied to vote endpoint
- `src/lib/env.ts`: Zod schema validates all required env vars at startup
- Apply security headers to mutation API responses

**Verify:**
- [ ] `curl -I /api/topics` response includes `X-Frame-Options: DENY`
- [ ] App crashes at startup with clear error if `NEXTAUTH_SECRET` is missing
- [ ] Comment body with `<script>` → angle brackets stripped before save
- [ ] 11 rapid votes from same user → 429 with `X-RateLimit-*` headers

---

## Step 14 — Responsive design polish ✅

**What:** Mobile-first refinement pass across all pages.

**Tasks:**
- Minimum touch target size: `min-h-[44px]` on all buttons
- Responsive typography: `text-sm sm:text-base` patterns
- Sidebar hidden on mobile (`hidden lg:block`)
- Consistent spacing scale (`px-4 sm:px-6`, `py-6 sm:py-8`)

**Verify:**
- [ ] All pages usable at 375 px (iPhone SE) with no horizontal scroll
- [ ] Vote buttons easily tappable on mobile
- [ ] News sidebar hidden on mobile; `/news` page used instead

---

## Step 15 — Unit tests ✅

**What:** Vitest test suite covering all pure utility and validation logic.

**Tasks:**
- Install Vitest, jsdom, @testing-library/react
- `vitest.config.ts` with path aliases and 70% coverage threshold
- Test files: `utils.test.ts`, `validations.test.ts`, `security.test.ts`, `rate-limit.test.ts`
- Add `test`, `test:watch`, `test:coverage` npm scripts

**Verify:**
- [ ] `npm test` → 55 tests, all green
- [ ] `npm run lint` → exit 0 (no errors)
- [ ] `npm run test:coverage` → all thresholds met

---

## Step 16 — Performance optimisation ✅

**What:** Reduce bundle size and improve perceived load time.

**Tasks:**
- Replace `<img>` with `next/image` (lazy loading + AVIF/WebP)
- Dynamic import `NewsSidebar` with `React.lazy` + `Suspense`
- Enable `images.formats: ["image/avif", "image/webp"]` in `next.config.js`
- `experimental.optimizePackageImports` for Tailwind utility libs
- Cache headers: `s-maxage=30, stale-while-revalidate=60` on `/api/topics`; `s-maxage=60` on `/api/news`

**Verify:**
- [ ] Lighthouse Performance score ≥ 80 on production build
- [ ] Network tab shows `image/webp` or `image/avif` for optimised images
- [ ] NewsSidebar loads as a separate JS chunk
- [ ] `/api/topics` response includes `Cache-Control` header

---

## Step 17 — Accessibility improvements ✅

**What:** Meets WCAG 2.1 AA for keyboard navigation, screen readers, and colour contrast.

**Tasks:**
- Skip-to-content link in root layout
- `role="banner"`, `role="meter"`, `<nav aria-label>`, `<aside aria-label>` landmarks
- `aria-pressed` on toggle buttons; `aria-label` on all interactive elements
- `<label htmlFor>` on comment textarea; `<time dateTime>` for timestamps
- Focus rings: `focus:ring-2 focus:ring-green-500` on all focusable elements
- `aria-live="polite"` + `aria-busy` on live regions

**Verify:**
- [ ] Tab through feed page — every interactive element receives visible focus
- [ ] Skip link appears on first Tab keypress and jumps to `#main-content`
- [ ] VoiceOver / NVDA announces vote percentages via `role="meter"`
- [ ] No missing `alt` text (run axe DevTools)

---

## Step 18 — PostgreSQL migration 🔲 (pending)

**What:** Swap SQLite for PostgreSQL so the app can run on Netlify's serverless infrastructure.

**Tasks:**
- Change `prisma/schema.prisma` `provider` from `"sqlite"` to `"postgresql"`
- Run `npx prisma migrate dev --name switch-to-postgres` to generate SQL migration
- Provision a PostgreSQL database (Netlify Database, Neon, Supabase, or Railway)
- Update `DATABASE_URL` in Netlify environment variables
- Run `npx prisma migrate deploy` as part of the build command

**Verify:**
- [ ] `npx prisma migrate deploy` exits 0 against the production DB
- [ ] App starts without DB errors
- [ ] Seed data loads correctly (`npm run seed`)
- [ ] All existing features work end-to-end against Postgres

---

## Step 19 — Netlify configuration & deployment 🔲 (pending)

**What:** Add `netlify.toml`, configure environment variables in Netlify dashboard, and deploy.

**Depends on:** Step 18 (PostgreSQL migration)

**Tasks:**
- Create `netlify.toml` with build command and publish directory:
  ```toml
  [build]
  command = "npx prisma migrate deploy && next build"
  publish = ".next"
  ```
- Make `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` optional in `src/lib/env.ts`
- Add all environment variables to Netlify dashboard (Settings → Environment Variables)
- Add Netlify callback URL to Google OAuth authorized redirect URIs
- Set up `/api/sync` as a Netlify scheduled function (every 6 hours)
- Run preview deploy; smoke-test happy path + auth checks

**Verify:**
- [ ] `npx netlify deploy` (preview) completes without build errors
- [ ] Preview URL loads feed, topics, voting, and comments
- [ ] Sign-up and login work on preview URL
- [ ] `/api/sync` called manually → articles appear
- [ ] `npx netlify deploy --prod` → production deploy succeeds
- [ ] Smoke-test checklist (below) passes on live URL

---

## Smoke-test checklist (run before and after every production deploy)

- [ ] Home page loads — topic cards visible
- [ ] Category filter works (Tech, World, Business, All)
- [ ] Sign up with new email → redirected to home, session active
- [ ] Log out → session cleared
- [ ] Log in with existing credentials → session restored
- [ ] Upvote a topic → vote bar updates
- [ ] Navigate to topic detail → full info shown
- [ ] Post a comment → appears immediately
- [ ] Visit `/profile` → activity history visible
- [ ] Change display name → persisted after refresh
- [ ] Visit `/news` on mobile viewport → article list visible
- [ ] Anonymous vote attempt → redirected to `/login`

---

## Commit convention

All commits on this project use [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | When to use |
|---|---|
| `feat:` | New user-facing feature |
| `fix:` | Bug fix |
| `chore:` | Maintenance, dependency updates, config |
| `docs:` | Documentation only |
| `ci:` | CI/CD pipeline changes |
| `test:` | Adding or updating tests |
| `refactor:` | Code change with no behaviour change |
| `perf:` | Performance improvement |
| `style:` | Formatting, whitespace, no logic change |

Breaking changes: append `!` after the prefix, e.g. `feat!: rename API endpoint`.

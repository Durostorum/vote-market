# Vote Market

A voting platform for news topics where users can vote on trending news stories and discuss them.

## Features

- **User Authentication**: Email/password login and Google OAuth support
- **Topic Feed**: Browse and filter topics by category (World, Tech, Business, etc.)
- **Voting System**: Upvote/downvote topics with visual vote bars
- **News Integration**: RSS feed integration to pull news stories
- **Comments**: Comment on topics and engage in discussions
- **Responsive Design**: Mobile-first design with desktop support

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Netlify Database) via Prisma ORM
- **Authentication**: NextAuth.js v5
- **UI Components**: Custom components with class-variance-authority
- **RSS Parsing**: rss-parser for news feed integration
- **Hosting**: Netlify

## Getting Started

### Prerequisites

- Node.js 18+ installed
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (`npm install -g netlify-cli`)
- A Netlify account (free tier works)

### Local Development (recommended)

The easiest way to develop locally is with `netlify dev`, which automatically provisions a local Postgres-compatible database via Netlify Database:

```bash
# 1. Clone the repository
git clone https://github.com/Durostorum/vote-market.git
cd vote-market

# 2. Install dependencies
npm install

# 3. Log in to Netlify and link the site
netlify login
netlify link

# 4. Copy and fill in environment variables
cp .env.example .env
# Edit .env — at minimum set NEXTAUTH_SECRET and CRON_SECRET

# 5. Apply database migrations to local DB
netlify database migrations apply

# 6. Start the development server (with local DB)
netlify dev
```

Open [http://localhost:8888](http://localhost:8888) in your browser.

### Manual Local Setup (without Netlify CLI)

If you prefer not to use `netlify dev`, provide your own PostgreSQL URL:

```bash
cp .env.example .env
# Set DATABASE_URL to a PostgreSQL connection string
# (e.g. a free Neon or Supabase project)
npx prisma migrate deploy
npm run dev
```

## Available Scripts

- `npm run dev` - Start Next.js dev server (requires DATABASE_URL set in .env)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run unit tests (Vitest)
- `npm run test:coverage` - Run tests with coverage report
- `npm run seed` - Seed the database with RSS feeds and sample topics

## Project Structure

```
vote-market/
├── docs/              # Documentation and mockup screenshots
├── mockups/           # HTML mockups for UI reference
├── prisma/            # Database schema and migrations
├── scripts/           # Utility scripts
├── src/
│   ├── app/          # Next.js app router pages
│   ├── components/   # React components
│   └── lib/          # Utility functions and configurations
├── .env              # Environment variables (not committed)
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Design System

**Colors:**
- Background: `#020617` (slate-950)
- Surface: `#0f172a` (slate-900)
- Border: `#1e293b` (slate-800)
- Primary: `#22c55e` (green-500)
- Danger: `#ef4444` (red-500)

**Typography:**
- Headings: Bold, white
- Body: Regular, slate-300
- Meta info: Small, slate-400/slate-500

See [mock-up.md](./mock-up.md) for detailed UI mockups and design specifications.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private.

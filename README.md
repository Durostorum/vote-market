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
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js v5
- **UI Components**: Custom components with class-variance-authority
- **RSS Parsing**: rss-parser for news feed integration

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Durostorum/vote-market.git
cd vote-market
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database
DATABASE_URL="file:./dev.db"

# Auth
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Cron Secret for RSS sync
CRON_SECRET="your-cron-secret-change-in-production"
```

4. Initialize the database:
```bash
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run mockups:serve` - Serve HTML mockups on port 4321
- `npm run mockups:capture` - Capture mockup screenshots with Puppeteer
- `npm run mockups` - Serve and capture mockups

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

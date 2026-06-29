# Deployment Guide

This guide covers deploying the Vote Market application to production using Vercel.

## Prerequisites

- A Vercel account (https://vercel.com)
- A PostgreSQL database (recommended: Supabase, Neon, or Railway)
- Google OAuth credentials (https://console.cloud.google.com)

## Database Setup

### Option 1: Supabase (Recommended)

1. Create a new project at https://supabase.com
2. Go to Settings > Database
3. Copy the connection string
4. Run Prisma migrations:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

### Option 2: Neon

1. Create a new project at https://neon.tech
2. Copy the connection string
3. Run Prisma migrations:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

### Option 3: Railway

1. Create a new PostgreSQL database at https://railway.app
2. Copy the connection string
3. Run Prisma migrations:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

## Google OAuth Setup

1. Go to Google Cloud Console (https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to Credentials > Create Credentials > OAuth client ID
5. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`
6. Copy the Client ID and Client Secret

## Vercel Deployment

### Step 1: Connect Repository

1. Go to Vercel dashboard (https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the `vote-market` repository

### Step 2: Configure Environment Variables

Add the following environment variables in Vercel:

```
DATABASE_URL=your-postgresql-connection-string
NEXTAUTH_SECRET=generate-a-random-32-character-string
NEXTAUTH_URL=https://your-domain.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
CRON_SECRET=generate-a-random-32-character-string
```

To generate a secure NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### Step 3: Deploy

1. Click "Deploy"
2. Wait for the build tocomplete
3. Your app will be available at `https://your-project.vercel.app`

### Step 4: Run Database Migrations

After deployment, you need to run the database migrations:

1. Go to Vercel project settings
2. Navigate to "Environment Variables"
3. Add your DATABASE_URL
4. Run the following command in your terminal:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

Alternatively, you can use Vercel Postgres which handles migrations automatically.

## Setting Up Cron Job for RSS Sync

The RSS feed sync is triggered via a cron job. Set this up in Vercel:

1. Go to your Vercel project
2. Navigate to "Settings" > "Cron Jobs"
3. Add a new cron job:
   - Name: `rss-sync`
   - Schedule: `0 */6 * * *` (every 6 hours)
   - URL: `https://your-domain.vercel.app/api/sync`
   - Headers: `{"Content-Type": "application/json"}`
   - Body: `{"secret": "YOUR_CRON_SECRET"}`

## Custom Domain (Optional)

1. Go to Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update NEXTAUTH_URL to your custom domain

## Monitoring

Vercel provides built-in monitoring:
- Analytics: View visitor stats and performance
- Logs: View application logs
- Functions: Monitor serverless function performance

## Security Checklist

Before going to production, ensure:

- [ ] All environment variables are set
- [ ] DATABASE_URL is using SSL
- [ ] NEXTAUTH_SECRET is strong and unique
- [ ] CRON_SECRET is strong and unique
- [ ] Google OAuth redirect URIs are configured
- [ ] Rate limiting is enabled
- [ ] Security headers are configured
- [ ] Database migrations have been run
- [ ] Seed data has been loaded (optional)

## Troubleshooting

### Build Errors

If you encounter build errors:
1. Check the build logs in Vercel
2. Ensure all dependencies are in package.json
3. Verify environment variables are set correctly

### Database Connection Issues

If the app can't connect to the database:
1. Verify DATABASE_URL is correct
2. Ensure the database allows connections from Vercel's IP ranges
3. Check if SSL is required

### Authentication Issues

If OAuth fails:
1. Verify Google OAuth credentials
2. Check redirect URIs match exactly
3. Ensure NEXTAUTH_URL is correct

## Post-Deployment

1. Test all features:
   - User signup/login
   - Voting functionality
   - Comments
   - Profile management
   - RSS feed sync (via cron job)

2. Set up monitoring alerts

3. Configure backup strategy for your database

## Scaling

Vercel automatically scales based on traffic. For the database:
- Supabase: Auto-scales with usage
- Neon: Auto-scales with usage
- Railway: Upgrade plan as needed

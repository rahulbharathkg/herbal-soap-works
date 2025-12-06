# Vercel Deployment Guide

## Prerequisites
1. **Vercel Account**: Sign up at https://vercel.com
2. **Neon Account**: Sign up at https://neon.tech (free PostgreSQL)
3. **GitHub**: Your code should be pushed to GitHub

## Step 1: Set Up Neon PostgreSQL Database

1. Go to https://neon.tech and create an account
2. Create a new project (free tier)
3. Copy the connection string from the dashboard
   - Should look like: `postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb`
4. Save this connection string for later

## Step 2: Export Local Data

Run the export script to save your current SQLite data:

```bash
cd backend
npm run export-data
``\`

This creates `export_data.json` with all your products, users, and content.

## Step 3: Deploy to Vercel

### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npx vercel login

# Deploy
npx vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: herbal-soap-works
# - Directory: ./ (root)
```

### Option B: Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/build`

## Step 4: Set Environment Variables in Vercel

In your Vercel project dashboard:

1. Go to Settings → Environment Variables
2. Add these variables:

```
DATABASE_URL = [your Neon connection string]
JWT_SECRET = [generate a random string, e.g., use: openssl rand -hex 32]
NODE_ENV = production
```

3. **Important**: Make sure to add them for all environments (Production, Preview, Development)

## Step 5: Import Data to PostgreSQL

Create a seed script or manually run SQL:

1. Connect to your Neon database using their SQL Editor
2. The tables will be auto-created by TypeORM on first API request
3. Insert your data from `export_data.json`:
   - You can write a simple Node script to connect to DATABASE_URL and insert
   - Or use the Neon SQL editor to insert manually

**Quick import script** (run locally with DATABASE_URL env var):

```typescript
// import_data.ts
import { DataSource } from 'typeorm';
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./export_data.json', 'utf-8'));

const source = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  entities: [/* your entities */],
  synchronize: true,
});

await source.initialize();
// Insert data...
```

## Step 6: Update Frontend API URL

In `frontend/src/App.tsx`, the code already checks for `REACT_APP_API_BASE_URL`:

```typescript
const rawApiBase = process.env.REACT_APP_API_BASE_URL || ...
```

In Vercel, set this environment variable to your Vercel project URL:

```
REACT_APP_API_BASE_URL = https://your-project.vercel.app/api
```

Or, update the code to use relative URLs since frontend and API are on same domain:

```typescript
const apiBase = '/api';
```

## Step 7: Redeploy

```bash
npx vercel --prod
```

## Step 8: Verify

1. Visit your Vercel URL
2. Check if products load
3. Try admin login
4. Test all features

## Troubleshooting

### API Routes Not Working
- Check Vercel logs: `npx vercel logs`
- Verify environment variables are set
- Check `vercel.json` routing configuration

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check Neon dashboard for connection issues
- Ensure SSL is enabled in connection options

### Build Failures
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Try building locally first: `cd frontend && npm run build`

## Free Tier Limits

**Vercel**:
- 100GB bandwidth/month
- Unlimited projects
- No sleep ✅

**Neon**:
- 0.5GB storage
- 10GB data transfer/month
- Always-on (no sleep) ✅

## Cost: $0/month 🎉

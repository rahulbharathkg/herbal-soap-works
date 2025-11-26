# Herbal Soap Works

A modern, full-stack ecommerce portfolio for handmade soaps, featuring advanced animated UI, admin product management, and secure authentication.

## Features
- Animated React + TypeScript frontend (Material-UI, Framer Motion)
- Node.js + TypeScript backend (Express, TypeORM)
- PostgreSQL database (Supabase-hosted)
- JWT authentication (admin role only)
- Admin product management (create, update, delete)
- Public product listing and detail

## Prerequisites
- Node.js (v18+ recommended)
- npm

## Setup Instructions

### 1. Clone the repository (if needed)
```
git clone <your-repo-url>
cd <project-root>
```

### 2. Configure Backend
- Go to `backend/.env` and fill in your Supabase PostgreSQL password:
  - `DB_PASSWORD=<YOUR_SUPABASE_PASSWORD>`
- (Optional) Change `JWT_SECRET` for production.

### 3. Install Dependencies
```
npm install --prefix ./backend
npm install --prefix ./frontend
```

### 4. Run Backend
```
cd backend
npx tsc
node dist/index.js
```

### 5. Run Frontend
```
cd frontend
npm start
```

### 6. Access the App
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:4000/api](http://localhost:4000/api)

## Admin Account
- Register a user via `/api/auth/register` and manually set their `role` to `admin` in the database for full admin access.

## Deployment
- Use services like Vercel/Netlify (frontend) and Render/Heroku (backend) for hosting.
- Use your Supabase connection string for production database.

## Docker / Deployment scaffolding
This repo includes basic Dockerfiles and a `docker-compose.yml` for local testing of the production build:

To build and run with Docker Compose:

```bash
docker compose build
docker compose up
```

The frontend will be available at `http://localhost:3000` (served by nginx) and backend at `http://localhost:4000`.

Note: Docker setup uses the same `USE_SQLITE=true` local DB by default. For production, switch to Postgres/Supabase and set the env vars accordingly.

## Quick Local Run (no Docker)

1. Start backend (from project root):

```bash
npm install --prefix backend
npm run --prefix backend build
node backend/dist/index.js
```

2. Start frontend (from project root):

```bash
npm install --prefix frontend
npm start --prefix frontend
```

## Continuous Integration

This repository includes a GitHub Actions workflow at `.github/workflows/ci.yml` that runs on `push` and `pull_request` for the `main` and `dev` branches. The workflow performs the following steps:

- Checks out code
- Sets up Node.js 18
- Builds the backend (`backend/npm run build`)
- Builds the frontend (`frontend/npm run build`)

You can customize the workflow to add tests, linting or deployment steps.

---

Enjoy your animated, modern Herbal Soap Works ecommerce site!
# Deployment fix: API URL updated for production
# Force redeploy Tue Nov 25 21:57:48 EST 2025

# Deployment Guide

This guide explains how to deploy the application to **Fly.io** (Backend) and **Vercel** (Frontend).

## Prerequisites
- [Fly.io CLI](https://fly.io/docs/hands-on/install-flyctl/) installed and logged in (`fly auth login`)
- [Vercel CLI](https://vercel.com/docs/cli) installed (optional, can use web UI)
- GitHub repository with your code

## 1. Backend Deployment (Fly.io)

The backend uses a Dockerfile and `fly.toml` configuration. It will use a PostgreSQL database provided by Fly.io.

1.  **Navigate to backend directory**:
    ```bash
    cd backend
    ```

2.  **Launch the app** (First time only):
    ```bash
    fly launch
    ```
    - **Choose an app name** (e.g., `herbal-soap-works-backend`)
    - **Select a region** (e.g., `iad` or one close to you)
    - **Would you like to set up a Postgresql database now?** -> **YES**
    - **Configuration**: Select "Development" (free tier) or "Production" as needed.
    - **Would you like to deploy now?** -> **YES**

3.  **Verify Deployment**:
    - Fly.io will build the Docker image and deploy it.
    - The URL will be `https://<your-app-name>.fly.dev`.
    - Check logs if needed: `fly logs`

4.  **Environment Variables**:
    - The database connection string (`DATABASE_URL`) is automatically set by Fly.io when you attach the Postgres database.
    - Set other secrets if needed (e.g., `JWT_SECRET`):
      ```bash
      fly secrets set JWT_SECRET=your_secure_random_string
      ```

## 2. Frontend Deployment (Vercel)

The frontend is a React app that connects to the Fly.io backend.

1.  **Push your code to GitHub**.

2.  **Import Project in Vercel**:
    - Go to [Vercel Dashboard](https://vercel.com/dashboard).
    - Click **"Add New..."** -> **"Project"**.
    - Import your GitHub repository.

3.  **Configure Project**:
    - **Framework Preset**: Create React App
    - **Root Directory**: `frontend` (Click "Edit" and select the `frontend` folder)
    - **Build Command**: `npm run build` (Default)
    - **Output Directory**: `build` (Default)

4.  **Environment Variables**:
    - Add the following variable:
      - `REACT_APP_API_BASE_URL`: `https://<your-app-name>.fly.dev/api` (The URL from step 1.3)

5.  **Deploy**:
    - Click **"Deploy"**.

## 3. Local Development (SQLite)

You can still run the app locally with SQLite, completely independent of the production setup.

1.  **Backend**:
    ```bash
    cd backend
    npm run dev
    ```
    Runs on `http://localhost:4000` using `dev.sqlite`.

2.  **Frontend**:
    ```bash
    cd frontend
    npm start
    ```
    Runs on `http://localhost:3000` and connects to localhost backend.

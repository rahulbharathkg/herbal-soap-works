# Herbal Soap Works

E-commerce platform for handcrafted herbal soaps.

## Local Development

### Prerequisites
- Node.js (v18 or higher)
- npm

### Setup and Run

1. **Install Dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend (in another terminal)
   cd frontend
   npm install
   ```

2. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run at `http://localhost:4000`

3. **Start Frontend**
   ```bash
   cd frontend
   npm start
   ```
   Frontend will run at `http://localhost:3000`

4. **Default Admin Login**
   - Email: `lavanya@herbal`
   - Password: `adminpass`

## Tech Stack
- **Frontend**: React, TypeScript, Material-UI
- **Backend**: Node.js, Express, TypeORM
- **Database**: SQLite (local development)

## Deployment

### Free Hosting Options

#### Frontend (Static Site)
- **Vercel** (Recommended): Connect GitHub repo, auto-deploy on push
- **Netlify**: Similar to Vercel
- **GitHub Pages**: For simpler static hosting

#### Backend (Node.js API)
- **Render.com**: Free tier available, supports SQLite
- **Railway.app**: Free tier with credits
- **Fly.io**: Free allowance available

#### Database (If needed)
- **SQLite**: Bundled with backend (simplest option)
- **Supabase**: Free PostgreSQL tier
- **Neon**: Free PostgreSQL tier

### Quick Deploy to Render (Backend)
1. Push code to GitHub
2. Create new Web Service on Render.com
3. Connect your repository
4. Build Command: `cd backend && npm install && npm run build`
5. Start Command: `cd backend && npm start`

### Quick Deploy to Vercel (Frontend)
1. Push code to GitHub
2. Import project on Vercel
3. Root Directory: `frontend`
4. Build Command: `npm run build`
5. Output Directory: `build`

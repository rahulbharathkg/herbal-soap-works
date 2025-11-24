Deployment notes — quick start

1) Build and run with Docker Compose (local dev):

```bash
docker compose build
docker compose up
```

2) Backend will be at `http://localhost:4000` and frontend at `http://localhost:3000` (nginx served).

3) For production, set `USE_SQLITE=false` and provide Postgres env vars in `backend/.env` (or use Supabase).

4) Remember to set `JWT_SECRET` in `backend/.env` for secure tokens.

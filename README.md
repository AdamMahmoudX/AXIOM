# AXIOMX

Company website and admin CMS built with React, TypeScript, and Vite.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run dev:api` | Start Express API on port 3001 |
| `npm run build` | Production build |
| `npm run validate` | Strict typecheck + API typecheck + build |
| `npm run typecheck:strict` | Typecheck core modules with `strict: true` |
| `npm run typecheck:api` | Typecheck Express server |
| `npm run lint:core` | ESLint on stable core modules |
| `npm run lint` | ESLint |

## Environment

Copy `.env.example` to `.env` and configure:

- `VITE_WEBSITE_URL` — canonical site URL for SEO
- `VITE_API_BASE_URL` — backend API base (optional; mock/localStorage used when empty). For local API: set to `/api`, run `pnpm dev:api`, then `pnpm dev`.
- Google OAuth variables — optional for real OAuth
- `PORT`, `JWT_SECRET`, `CORS_ORIGIN` — API server settings (see `.env.example`)

## Backend API

Express server in `server/` with JWT auth:

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Health check |
| `POST /api/auth/login` | Login with `{ identifier, password }` |
| `GET /api/auth/me` | Current user (Bearer token) |

When `VITE_API_BASE_URL` is set, login uses the backend and stores a JWT. Vite proxies `/api` to `http://localhost:3001` in development.

Additional users: `owner` / `Owner123!`

## Default mock credentials (development only)

- Admin: `admin` / `Admin123!`
- Employee: `0501234567` / `Employee123!`

Authentication uses localStorage mock by default. Set `VITE_API_BASE_URL=/api` to use the Express backend.

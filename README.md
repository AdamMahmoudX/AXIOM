# AXIOMX

Company website and admin CMS built with React, TypeScript, and Vite.

## Local development

Install dependencies with `pnpm install`, then start the app:

```sh
pnpm dev
```

Open the local URL printed by Vite (by default, `http://localhost:5173`).
Development mode uses browser storage for local CMS changes and mock authentication.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start the local Vite development server |
| `pnpm build` | Create the production bundle |
| `pnpm validate` | Run the strict typecheck and production build |
| `pnpm typecheck:strict` | Typecheck the strict core modules |
| `pnpm lint:core` | Lint stable core modules |
| `pnpm lint` | Lint the project |

## Environment

Frontend environment variables:

- `VITE_WEBSITE_URL` — canonical site URL for SEO.
- `VITE_API_BASE_URL` — required for production authentication.
- Google OAuth variables — currently not production-ready; the OAuth callback and
  server-side account linking have not been implemented.

## Deployment status

This repository currently has no runnable backend. The CMS and contact requests
use browser storage, which is not shared between visitors or devices. Production
builds therefore disable local mock authentication and do not accept local
sessions. Do not deploy the admin or registration workflows publicly until a
backend provides authentication, persistent CMS storage, contact-request storage,
and server-side authorization.

Public project, article, and service detail pages do not use bundled sample
content. They remain unavailable until real content is connected to a production
data source.

Set a production API URL and verify its authentication and CMS endpoints before
publishing. Never ship development credentials or secrets in frontend variables.
Set `VITE_WEBSITE_URL` to the final public origin when building to generate a
matching sitemap; without it, no sitemap is published.

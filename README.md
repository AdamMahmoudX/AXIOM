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
- `VITE_API_BASE_URL` — optional backend API URL for email/password authentication.
- `VITE_FIREBASE_*` — optional Firebase client configuration overrides; the
  project's public client configuration is provided by default in
  `src/config/firebase.ts`.

## Public-site visual editor

The floating **لوحة تحرير الموقع** editor is available on public pages to the
Firebase account whose UID is allowlisted in both `src/config/siteEditor.ts`
and `firestore.rules`. Sign in with Google, open a public page, and select an
element to edit its text, image, link, style, or section order. Social links
are managed from the editor's social tab and use official brand icons in the
footer.

Public content is read from Firestore's `siteContent` collection and is shared
with site visitors. Configure Google as an enabled Firebase Authentication
provider, add the deployed domain to Firebase's authorized domains, and deploy
the rules with `firebase deploy --only firestore:rules`. When adding an editor,
update the UID allowlist in both locations. The Firestore rules allow public
content reads but restrict writes to the listed UIDs.

## Deployment status

The public-site visual editor uses Firebase Authentication and Firestore for
shared page overrides and social links. Article data is also stored in
Firestore; other CMS data and contact requests may still use browser storage
and are not shared between visitors or devices.
Production builds disable mock authentication. The separate `/admin` CMS and
registration workflows remain unavailable in production until their data and
authorization are connected to a production backend.

## Article CMS

The article editor is available at `/cms/articles` to the Firebase account
whose UID is allowlisted in `src/config/siteEditor.ts` and `firestore.rules`.
Articles are stored in Firestore's `articles` collection. Published articles are
readable by visitors, while drafts and article changes are restricted to the
allowlisted editor. Deploy the Firestore rules before using the CMS in
production:

```sh
firebase deploy --only firestore:rules
```

Video blocks accept canonical YouTube, Facebook, and TikTok video URLs and show
an embedded player in the article. TikTok short links that require redirect
resolution are not supported; use the full video URL.

Public project and service detail pages do not use bundled sample content.
They remain unavailable until real content is connected to a production data
source.

Set a production API URL and verify its authentication and CMS endpoints before
publishing. Never ship development credentials or secrets in frontend variables.
Set `VITE_WEBSITE_URL` to the final public origin when building to generate a
matching sitemap; without it, no sitemap is published.

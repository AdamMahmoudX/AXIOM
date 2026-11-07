export const SITE_URL =
  import.meta.env.VITE_WEBSITE_URL ??
  (import.meta.env.PROD ? window.location.origin : 'http://localhost:5173');

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export const isApiConfigured = (): boolean => Boolean(API_BASE_URL);

export const GOOGLE_OAUTH_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID ?? '';
export const GOOGLE_OAUTH_REDIRECT_URI = import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT_URI ?? '';

export const isGoogleOAuthConfigured = (): boolean =>
  Boolean(GOOGLE_OAUTH_CLIENT_ID && GOOGLE_OAUTH_REDIRECT_URI);

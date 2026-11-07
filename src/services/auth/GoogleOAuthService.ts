import {
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_REDIRECT_URI,
  isGoogleOAuthConfigured as isGoogleOAuthEnvConfigured,
} from '../../config/env';

export const isGoogleOAuthConfigured = isGoogleOAuthEnvConfigured();

export interface GoogleAuthUser {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
}

export const signInWithGoogle = (): Promise<GoogleAuthUser> => {
  if (!isGoogleOAuthEnvConfigured()) {
    return Promise.reject(new Error('Google OAuth is not configured.'));
  }

  const params = new URLSearchParams({
    client_id: GOOGLE_OAUTH_CLIENT_ID,
    redirect_uri: GOOGLE_OAUTH_REDIRECT_URI,
    response_type: 'token',
    scope: 'openid email profile',
    prompt: 'select_account',
    include_granted_scopes: 'true',
  });

  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return new Promise<GoogleAuthUser>(() => {
    // Redirecting to Google OAuth — intentionally never resolves.
  });
};

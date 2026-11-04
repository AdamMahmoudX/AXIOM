import {
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_REDIRECT_URI,
  isGoogleOAuthConfigured as isGoogleOAuthEnvConfigured,
} from '../../config/env';

export interface GoogleAuthUser {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
}

export const isGoogleOAuthConfigured = isGoogleOAuthEnvConfigured();

const createMockUser = (): GoogleAuthUser => ({
  googleId: 'mock-google-user-001',
  email: 'new.employee@axiomx.com',
  name: 'أحمد الفلّان',
  avatar: 'https://ui-avatars.com/api/?name=Ahmed+Al-Fulan&background=0D8ABC&color=fff',
});

export const signInWithGoogle = (): Promise<GoogleAuthUser> => {
  if (isGoogleOAuthEnvConfigured()) {
    const params = new URLSearchParams({
      client_id: GOOGLE_OAUTH_CLIENT_ID,
      redirect_uri: GOOGLE_OAUTH_REDIRECT_URI,
      response_type: 'token',
      scope: 'openid email profile',
      prompt: 'select_account',
      include_granted_scopes: 'true',
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    return new Promise(() => {
      // Redirecting to Google OAuth — intentionally never resolves.
    });
  }

  return new Promise((resolve) => {
    window.setTimeout(() => resolve(createMockUser()), 800);
  });
};

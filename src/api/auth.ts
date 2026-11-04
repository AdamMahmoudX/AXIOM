import { ApiError, apiGet, apiPost } from './client';
import type { AuthLoginRequest, AuthLoginResponse, AuthUserDto } from './types';
import type { AuthStatus, User, UserRole } from '../types/user';
import { DEFAULT_ROLE_PERMISSIONS } from '../types/user';

export const AUTH_TOKEN_KEY = 'axiomx_auth_token';

export const saveAuthToken = (token: string, rememberMe: boolean): void => {
  if (rememberMe) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
  } else {
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

export const loadAuthToken = (): string | null =>
  localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);

export const clearAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
};

const USER_ROLES: UserRole[] = ['owner', 'admin', 'manager', 'employee'];

const isUserRole = (role: string): role is UserRole => USER_ROLES.includes(role as UserRole);

const isAuthStatus = (status: string): status is AuthStatus =>
  ['active', 'suspended', 'rejected', 'pending_review', 'pending_approval', 'pending_registration'].includes(status);

export const mapAuthUserDtoToUser = (dto: AuthUserDto, rememberMe = false): User => {
  const role = isUserRole(dto.role) ? dto.role : 'employee';

  return {
    id: dto.id,
    username: dto.username,
    email: dto.email,
    role,
    fullName: dto.fullName ?? dto.username,
    phone: dto.phone,
    authStatus: dto.authStatus && isAuthStatus(dto.authStatus) ? dto.authStatus : 'active',
    rememberMe,
    permissions: DEFAULT_ROLE_PERMISSIONS[role],
    createdAt: new Date().toISOString(),
  };
};

export const loginWithBackend = async (payload: AuthLoginRequest): Promise<AuthLoginResponse> => {
  const response = await apiPost<AuthLoginResponse>('/auth/login', payload);
  if (!response) {
    throw new ApiError(500, 'Empty login response from backend');
  }
  return response;
};

export const fetchCurrentUser = async (token?: string): Promise<AuthUserDto> => {
  const authToken = token ?? loadAuthToken();
  if (!authToken) {
    throw new ApiError(401, 'No auth token');
  }

  const response = await apiGet<{ user: AuthUserDto }>('/auth/me', { token: authToken });
  if (!response?.user) {
    throw new ApiError(500, 'Empty user response from backend');
  }
  return response.user;
};

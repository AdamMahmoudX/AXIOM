// =====================================================
// AUTH HELPERS - AXIOMX ADMIN SYSTEM
//
// This file contains essential helper functions for managing authentication logic,
// user sessions, and permission checks within the AXIOMX Admin frontend.
// It centralizes authentication-related utilities to ensure consistency and security.
//
// Key Considerations:
// - Mock Implementation: Features like password hashing and user database interactions
//   are mock implementations for frontend development ONLY. In a production environment,
//   these would be handled by a secure backend.
// - Session Management: Includes utilities for saving and loading authentication state
//   from local/session storage, with basic session expiration checks.
// - Permission Integration: Leverages consolidated permission logic from `permissions.ts`
//   to provide effective access control.
// - Security Mock: Includes basic rate limiting for login attempts to simulate security measures.
// =====================================================

import { AuthState, User, DEFAULT_ROLE_PERMISSIONS, LOCAL_STORAGE_KEY, SESSION_STORAGE_KEY, AXIOMX_USERS, type EmployeePermissions } from '../types/user';
import { safeJSONParse } from './storageHelpers';
import { mockHashPassword } from './mockAuth';

export { mockHashPassword, verifyMockPassword } from './mockAuth';

// =====================================================
// USER DATABASE MOCK (localStorage based)
// =====================================================

const USER_DB_KEY = 'axiomx_user_db';
const LOGIN_ATTEMPTS_KEY = 'axiomx_login_attempts';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export interface LoginAttempt {
  count: number;
  lastAttempt: number;
  lockedUntil: number;
}

export const loadUserDatabase = (): User[] => {
  if (import.meta.env.PROD || typeof window === 'undefined') return [];
  const stored = localStorage.getItem(USER_DB_KEY);
  if (!stored) {
    const defaults = AXIOMX_USERS.map(user => ({
      ...user,
      passwordHash: mockHashPassword('Admin123!') // Set a default mock password for all predefined users
    }));
    localStorage.setItem(USER_DB_KEY, JSON.stringify(defaults));
    return defaults;
  }

  const parsed = safeJSONParse<User[]>(stored);
  if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
    const defaults = AXIOMX_USERS.map(user => ({
      ...user,
      passwordHash: mockHashPassword('Admin123!')
    }));
    localStorage.setItem(USER_DB_KEY, JSON.stringify(defaults));
    return defaults;
  }

  // Ensure all users have a passwordHash for mock login if missing
  const usersWithHashes = parsed.map((user) => {
    const stored = user as User & { passwordHash?: string };
    return {
      ...stored,
      passwordHash: stored.passwordHash || mockHashPassword('Admin123!'),
      permissions: stored.permissions
        ? { ...DEFAULT_ROLE_PERMISSIONS.employee, ...stored.permissions }
        : { ...DEFAULT_ROLE_PERMISSIONS.employee },
      authStatus: stored.authStatus || 'active',
    };
  });
  return usersWithHashes;
};

export const saveUserDatabase = (users: User[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_DB_KEY, JSON.stringify(users));
};

export const findUserByIdentifier = (identifier: string, users: User[]): User | undefined => {
  const normalized = identifier.trim().toLowerCase();
  const normalizedPhone = identifier.replace(/\D/g, ''); // Remove non-digits for phone

  return users.find((user) => {
    return (
      (user.username && user.username.toLowerCase() === normalized) ||
      (user.email && user.email.toLowerCase() === normalized) ||
      (user.nationalId && user.nationalId.toLowerCase() === normalized) ||
      (user.phone && user.phone.replace(/\D/g, '') === normalizedPhone)
    );
  });
};

// =====================================================
// AUTH STATE MANAGEMENT
// =====================================================

export const saveAuthStateToStorage = (state: AuthState, rememberMe: boolean) => {
  if (typeof window === 'undefined') return;
  const payload = JSON.stringify(state);

  // Clear both before setting to prevent conflicts
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  sessionStorage.removeItem(SESSION_STORAGE_KEY);

  if (rememberMe) {
    localStorage.setItem(LOCAL_STORAGE_KEY, payload);
  } else {
    sessionStorage.setItem(SESSION_STORAGE_KEY, payload);
  }
};

export const loadAuthStateFromStorage = (): AuthState | null => {
  if (typeof window === 'undefined') return null;

  const localState = localStorage.getItem(LOCAL_STORAGE_KEY);
  const sessionState = sessionStorage.getItem(SESSION_STORAGE_KEY);

  const stored = localState || sessionState; // Prefer local if "remember me" was used

  if (stored) {
    const authState = safeJSONParse<AuthState>(stored);
    if (authState && authState.user && authState.user.sessionId) {
      // Basic session expiration check
      const sessionExpiry = authState.user.lastLogin ? new Date(authState.user.lastLogin).getTime() + LOCKOUT_DURATION_MS * 6 : 0; // 30 minutes for session
      if (sessionExpiry > Date.now()) {
        return authState;
      } else {
        console.warn('Session expired, logging out user.');
        return null;
      }
    }
  }
  return null;
};

export const clearAuthStorage = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
  localStorage.removeItem(LOGIN_ATTEMPTS_KEY); // Also clear login attempts on logout
};

// =====================================================
// LOGIN ATTEMPTS & RATE LIMITING MOCK
// =====================================================

export const getLoginAttempts = (identifier: string): LoginAttempt => {
  if (typeof window === 'undefined') {
    return { count: 0, lastAttempt: 0, lockedUntil: 0 };
  }
  const attempts = safeJSONParse<Record<string, LoginAttempt>>(localStorage.getItem(LOGIN_ATTEMPTS_KEY) || '{}') || {};
  const currentAttempt = attempts[identifier] || { count: 0, lastAttempt: 0, lockedUntil: 0 };

  // If current time is past lockedUntil, reset attempts
  if (Date.now() > currentAttempt.lockedUntil) {
    return { count: 0, lastAttempt: 0, lockedUntil: 0 };
  }
  return currentAttempt;
};

export const recordFailedLoginAttempt = (identifier: string) => {
  if (typeof window === 'undefined') return;
  const attempts = safeJSONParse<Record<string, LoginAttempt>>(localStorage.getItem(LOGIN_ATTEMPTS_KEY) || '{}') || {};
  const previous = attempts[identifier] ?? { count: 0, lastAttempt: 0, lockedUntil: 0 };
  const nextCount = previous.count + 1;

  const currentAttempt: LoginAttempt = {
    count: nextCount,
    lastAttempt: Date.now(),
    lockedUntil: nextCount >= MAX_LOGIN_ATTEMPTS ? Date.now() + LOCKOUT_DURATION_MS : previous.lockedUntil,
  };

  attempts[identifier] = currentAttempt;
  localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(attempts));
};

// =====================================================
// PERMISSION HELPERS
// These use the consolidated permission logic from permissions.ts
// =====================================================

import { getEffectivePermissions, hasPermission as checkPermission, canPerformServiceAction as checkServiceAction, getFilteredMenuItems as getPermittedMenuItems } from '../types/permissions';

export const getUserEffectivePermissions = getEffectivePermissions;
export const canUserPerformPermission = checkPermission;
export const canUserPerformServiceAction = checkServiceAction;
export const getPermittedNavigationItems = getPermittedMenuItems;

export const mergeUserPermissions = (user: User): User => {
  if (!user.role) {
    console.warn(`User ${user.id} has no role, assigning default employee permissions.`);
    user.role = 'employee';
  }

  const effectivePermissions = getUserEffectivePermissions(user.role, user.serviceRole);
  const permissions: EmployeePermissions = { ...DEFAULT_ROLE_PERMISSIONS[user.role] };
  (Object.keys(permissions) as (keyof EmployeePermissions)[]).forEach((permission) => {
    permissions[permission] = effectivePermissions.includes(permission);
  });
  return {
    ...user,
    permissions,
  };
};

export const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Date.now();
};

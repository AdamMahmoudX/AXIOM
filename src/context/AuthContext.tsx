// =====================================================
// AUTH CONTEXT - AXIOMX ADMIN SYSTEM
// Phase 1C: ID/Password Authentication Rebuild
// =====================================================

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { User, AuthState, ServiceRole, EmployeePermissions, DEFAULT_ROLE_PERMISSIONS } from '../types/user';
import { getEffectivePermissions, getFilteredMenuItems, canPerformServiceAction, MenuItem } from '../types/permissions';
import { signInWithGoogle, isGoogleOAuthConfigured } from '../services/auth/GoogleOAuthService';
import { mockHashPassword, verifyMockPassword } from '../utils/mockAuth';
import { ApiError } from '../api/client';
import { isApiConfigured } from '../config/env';
import {
  clearAuthToken,
  fetchCurrentUser,
  loadAuthToken,
  loginWithBackend,
  mapAuthUserDtoToUser,
  saveAuthToken,
} from '../api/auth';

interface RegistrationData {
  fullName: string;
  nationalId: string;
  phone: string;
  country: string;
  password: string;
  googleId?: string;
  rememberMe?: boolean;
  profilePhotoUrl?: string;
  idCardFrontUrl?: string;
  idCardBackUrl?: string;
  personalPhotoUrl?: string;
  termsAccepted: boolean;
  contractRead: boolean;
  signatureDataUrl: string;
}

interface AuthContextType extends AuthState {
  loginWithCredentials: (
    identifier: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<{ success: boolean; error?: string; user?: User }>;
  loginWithGoogle: (rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  registerEmployee: (registration: RegistrationData) => Promise<{ success: boolean; error?: string; user?: User }>;
  setUser: (user: User) => void;
  updateUser: (user: User) => void;
  getAllUsers: () => User[];
  getPendingRegistrations: () => User[];
  linkGoogleAccount: () => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isLoginModalOpen: boolean;
  isGoogleOAuthConfigured: boolean;
  hasServiceRole: boolean;
  serviceRole: ServiceRole | undefined;
  getServiceRoleLabel: (language: 'en' | 'ar') => string;
  canCreateService: boolean;
  canEditService: boolean;
  canDeleteService: boolean;
  canPublishService: boolean;
  canManageServiceSEO: boolean;
  canTranslateService: boolean;
  getMenuItems: () => MenuItem[];
  getEffectivePermissionsList: () => string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const safeJSONParse = <T,>(str: string | null): T | null => {
  if (!str) return null;
  try {
    return JSON.parse(str) as T;
  } catch {
    return null;
  }
};

const normalizeIdentifier = (value: string): string => value.trim().toLowerCase();
const normalizePhone = (value: string): string => value.replace(/\D/g, '');

/** User record persisted in localStorage during mock auth development. */
type StoredUser = User & { passwordHash?: string };

const EMPTY_PERMISSIONS: EmployeePermissions = {
  canAccessAdmin: false,
  projects_view: false,
  projects_create: false,
  projects_edit: false,
  projects_delete: false,
  services_view: false,
  services_manage: false,
  service_create: false,
  service_edit: false,
  service_delete: false,
  service_publish: false,
  service_seo_manage: false,
  service_translate: false,
  articles_view: false,
  articles_create: false,
  articles_edit: false,
  articles_delete: false,
  messages_view: false,
  messages_send: false,
  attachments_view: false,
  attachments_upload: false,
  attachments_delete: false,
  team_view: false,
  team_manage: false,
  settings_view: false,
  settings_edit: false,
  permissions_view: false,
  permissions_manage: false,
};

const AUTH_STORAGE_KEY = 'axiomx_auth_state';
const USER_DB_KEY = 'axiomx_user_db';

const createDefaultUsers = (): StoredUser[] => [
  {
    id: 'admin-0001',
    username: 'admin',
    email: 'admin@axiomx.com',
    role: 'admin',
    fullName: 'AXIOMX Admin',
    phone: '0500000000',
    authStatus: 'active',
    rememberMe: true,
    createdAt: new Date().toISOString(),
    passwordHash: mockHashPassword('Admin123!'),
    permissions: DEFAULT_ROLE_PERMISSIONS.admin,
  },
  {
    id: 'employee-0001',
    username: '0501234567',
    email: 'employee@axiomx.com',
    role: 'employee',
    fullName: 'علي أحمد',
    phone: '0501234567',
    nationalId: '12345678901234',
    authStatus: 'active',
    rememberMe: true,
    createdAt: new Date().toISOString(),
    passwordHash: mockHashPassword('Employee123!'),
    permissions: DEFAULT_ROLE_PERMISSIONS.employee,
  },
];

const loadUserDatabase = (): StoredUser[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(USER_DB_KEY);
  if (!stored) {
    const defaults = createDefaultUsers();
    localStorage.setItem(USER_DB_KEY, JSON.stringify(defaults));
    return defaults;
  }

  const parsed = safeJSONParse<StoredUser[]>(stored);
  if (!parsed || !parsed.length) {
    const defaults = createDefaultUsers();
    localStorage.setItem(USER_DB_KEY, JSON.stringify(defaults));
    return defaults;
  }

  return parsed;
};

const saveUserDatabase = (users: StoredUser[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_DB_KEY, JSON.stringify(users));
};

const findUserByIdentifier = (identifier: string, users: StoredUser[]): StoredUser | undefined => {
  const normalized = normalizeIdentifier(identifier);
  const normalizedPhone = normalizePhone(identifier);

  return users.find((user) => {
    return (
      normalizeIdentifier(user.username || '') === normalized ||
      normalizeIdentifier(user.email || '') === normalized ||
      normalizeIdentifier(user.nationalId || '') === normalized ||
      normalizePhone(user.phone || '') === normalizedPhone
    );
  });
};

const mergeUser = (user: User): User => ({
  ...user,
  permissions: user.permissions ? { ...EMPTY_PERMISSIONS, ...user.permissions } : { ...EMPTY_PERMISSIONS },
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const loadStoredAuth = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? safeJSONParse<AuthState>(stored) : null;
  }, []);

  const saveAuthState = useCallback((state: AuthState) => {
    setAuthState(state);
    if (state.isLoading) return;

    if (!state.isAuthenticated || !state.user) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    }

    const payload = JSON.stringify(state);
    if (state.user.rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEY, payload);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, payload);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const persistUser = useCallback((user: User) => {
    const users = loadUserDatabase();
    const nextUsers = users.filter((stored) => stored.id !== user.id);
    nextUsers.push(user);
    saveUserDatabase(nextUsers);
    return mergeUser(user);
  }, []);

  useEffect(() => {
    const restoreAuth = async () => {
      if (isApiConfigured() && loadAuthToken()) {
        try {
          const dto = await fetchCurrentUser();
          const rememberMe = Boolean(localStorage.getItem(AUTH_STORAGE_KEY));
          const user = mapAuthUserDtoToUser(dto, rememberMe);
          const nextState: AuthState = { user, isAuthenticated: true, isLoading: false };
          saveAuthState(nextState);
          return;
        } catch {
          clearAuthToken();
        }
      }

      const storedAuth = loadStoredAuth();
      if (storedAuth?.user?.id) {
        const users = loadUserDatabase();
        const user = users.find((stored) => stored.id === storedAuth.user?.id);
        if (user) {
          setAuthState({ user: mergeUser(user), isAuthenticated: true, isLoading: false });
          return;
        }
      }

      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    };

    void restoreAuth();
  }, [loadStoredAuth, saveAuthState]);

  const updateUser = useCallback(
    (user: User) => {
      const merged = persistUser(user);
      setAuthState((prev) => ({
        ...prev,
        user: prev.user?.id === merged.id ? merged : prev.user,
        isAuthenticated: prev.user?.id === merged.id ? true : prev.isAuthenticated,
      }));
    },
    [persistUser]
  );

  const loginWithCredentials = useCallback(
    async (
      identifier: string,
      password: string,
      rememberMe = false
    ): Promise<{ success: boolean; error?: string; user?: User }> => {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      if (isApiConfigured()) {
        try {
          const response = await loginWithBackend({ identifier, password });
          const user = mapAuthUserDtoToUser(response.user, rememberMe);
          saveAuthToken(response.token, rememberMe);
          const nextState: AuthState = { user, isAuthenticated: true, isLoading: false };
          saveAuthState(nextState);
          return { success: true, user };
        } catch (error) {
          const message =
            error instanceof ApiError ? error.message : 'خطأ في المعرف أو كلمة المرور.';
          setAuthState({ user: null, isAuthenticated: false, isLoading: false });
          return { success: false, error: message };
        }
      }

      const users = loadUserDatabase();
      const user = findUserByIdentifier(identifier, users);

      if (!user) {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        return { success: false, error: 'لم يتم العثور على المستخدم.' };
      }

      if (!user.passwordHash || !verifyMockPassword(password, user.passwordHash)) {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        return { success: false, error: 'خطأ في المعرف أو كلمة المرور.' };
      }

      if (user.authStatus === 'rejected') {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        return { success: false, error: 'تم رفض حسابك. يرجى التواصل مع الإدارة.' };
      }

      if (user.authStatus === 'suspended') {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        return { success: false, error: 'تم تعليق حسابك. يرجى التواصل مع الإدارة.' };
      }

      const updatedUser = persistUser({ ...user, rememberMe });
      const nextState: AuthState = { user: updatedUser, isAuthenticated: true, isLoading: false };
      saveAuthState(nextState);

      return { success: true, user: updatedUser };
    },
    [persistUser, saveAuthState]
  );

  const registerEmployee = useCallback(
    async (registration: RegistrationData): Promise<{ success: boolean; error?: string; user?: User }> => {
      await Promise.resolve();
      const users = loadUserDatabase();
      const existingUser =
        findUserByIdentifier(registration.nationalId, users) || findUserByIdentifier(registration.phone, users);

      if (existingUser) {
        return { success: false, error: 'المستخدم موجود بالفعل. يرجى تسجيل الدخول أو استخدام بيانات مختلفة.' };
      }

      const newUser: StoredUser = {
        id: `user-${Date.now()}`,
        username: registration.nationalId,
        email: `${registration.nationalId}@axiomx.local`,
        role: 'employee',
        fullName: registration.fullName,
        nationalId: registration.nationalId,
        phone: registration.phone,
        country: registration.country,
        authStatus: 'pending_review',
        rememberMe: registration.rememberMe ?? false,
        createdAt: new Date().toISOString(),
        passwordHash: mockHashPassword(registration.password),
        googleId: registration.googleId,
        oauthProvider: registration.googleId ? 'google' : undefined,
        profilePhotoUrl: registration.personalPhotoUrl,
        idCardFrontUrl: registration.idCardFrontUrl,
        idCardBackUrl: registration.idCardBackUrl,
        signatureDataUrl: registration.signatureDataUrl,
        requestId: `REQ-${Date.now().toString().slice(-6)}`,
        requestSubmittedAt: new Date().toISOString(),
        permissions: { ...EMPTY_PERMISSIONS },
      };

      const nextUsers = [...users, newUser];
      saveUserDatabase(nextUsers);
      const nextState: AuthState = { user: mergeUser(newUser), isAuthenticated: true, isLoading: false };
      saveAuthState(nextState);
      if (!nextState.user) {
        return { success: false, error: 'تعذر إنشاء المستخدم.' };
      }
      return { success: true, user: nextState.user };
    },
    [saveAuthState]
  );

  const linkGoogleAccount = useCallback(async (): Promise<{ success: boolean; error?: string; user?: User }> => {
    if (!authState.user) {
      return { success: false, error: 'يجب تسجيل الدخول أولاً لربط حساب Google.' };
    }

    try {
      const googleUser = await signInWithGoogle();
      const updatedUser = persistUser({
        ...authState.user,
        googleId: googleUser.googleId,
        oauthProvider: 'google',
      });
      const nextState: AuthState = { user: updatedUser, isAuthenticated: true, isLoading: false };
      saveAuthState(nextState);
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Google linking error:', error);
      return { success: false, error: 'تعذر ربط حساب Google.' };
    }
  }, [authState.user, persistUser, saveAuthState]);

  const loginWithGoogle = useCallback(
    async (rememberMe = false): Promise<{ success: boolean; error?: string; user?: User }> => {
      try {
        const googleUser = await signInWithGoogle();
        const users = loadUserDatabase();

        const existingUser =
          users.find((item) => item.googleId === googleUser.googleId) ||
          users.find((item) => item.email?.toLowerCase() === googleUser.email.toLowerCase());

        if (existingUser) {
          const updatedUser = persistUser({
            ...existingUser,
            rememberMe,
            googleId: googleUser.googleId,
            oauthProvider: 'google',
          });
          const nextState: AuthState = { user: updatedUser, isAuthenticated: true, isLoading: false };
          saveAuthState(nextState);
          return { success: true, user: updatedUser };
        }

        const newUser: StoredUser = {
          id: `user-${Date.now()}`,
          username: googleUser.email,
          email: googleUser.email,
          role: 'employee',
          fullName: googleUser.name,
          phone: '',
          authStatus: 'pending_review',
          rememberMe,
          createdAt: new Date().toISOString(),
          passwordHash: '',
          oauthProvider: 'google',
          googleId: googleUser.googleId,
          profilePhotoUrl: googleUser.avatar,
          permissions: { ...EMPTY_PERMISSIONS },
        };

        const nextUsers = [...users, newUser];
        saveUserDatabase(nextUsers);

        const nextState: AuthState = { user: mergeUser(newUser), isAuthenticated: true, isLoading: false };
        saveAuthState(nextState);

        if (!nextState.user) {
          return { success: false, error: 'تعذر إنشاء المستخدم.' };
        }
        return { success: true, user: nextState.user };
      } catch (error) {
        console.error('Google sign-in error:', error);
        return { success: false, error: 'تعذر تسجيل الدخول بواسطة Google.' };
      }
    },
    [persistUser, saveAuthState]
  );

  const openLoginModal = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  const logout = useCallback(() => {
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    clearAuthToken();
  }, []);

  const getAllUsers = useCallback(() => {
    return loadUserDatabase().map(mergeUser);
  }, []);

  const getPendingRegistrations = useCallback(() => {
    return loadUserDatabase().filter((user) =>
      ['pending_registration', 'pending_review', 'pending_approval'].includes(user.authStatus || '')
    );
  }, []);

  const user = authState.user;
  const serviceRole = user?.serviceRole;

  const hasServiceRole = useMemo(() => !!serviceRole, [serviceRole]);

  const getServiceRoleLabel = useCallback(
    (language: 'en' | 'ar'): string => {
      if (!serviceRole) return '';
      const labels: Record<ServiceRole, { en: string; ar: string }> = {
        service_admin: { en: 'Service Admin', ar: 'مدير الخدمات' },
        service_editor: { en: 'Service Editor', ar: 'محرر الخدمات' },
        service_seo_manager: { en: 'SEO Manager', ar: 'مدير SEO' },
        service_translator: { en: 'Service Translator', ar: 'مترجم الخدمات' },
        service_viewer: { en: 'Service Viewer', ar: 'مشاهد الخدمات' },
      };
      return labels[serviceRole]?.[language] || '';
    },
    [serviceRole]
  );

  const canCreateService = useMemo(() => {
    if (!user) return false;
    return canPerformServiceAction(user.role, serviceRole, 'create');
  }, [serviceRole, user]);

  const canEditService = useMemo(() => {
    if (!user) return false;
    return canPerformServiceAction(user.role, serviceRole, 'edit');
  }, [serviceRole, user]);

  const canDeleteService = useMemo(() => {
    if (!user) return false;
    return canPerformServiceAction(user.role, serviceRole, 'delete');
  }, [serviceRole, user]);

  const canPublishService = useMemo(() => {
    if (!user) return false;
    return canPerformServiceAction(user.role, serviceRole, 'publish');
  }, [serviceRole, user]);

  const canManageServiceSEO = useMemo(() => {
    if (!user) return false;
    return canPerformServiceAction(user.role, serviceRole, 'seo');
  }, [serviceRole, user]);

  const canTranslateService = useMemo(() => {
    if (!user) return false;
    return canPerformServiceAction(user.role, serviceRole, 'translate');
  }, [serviceRole, user]);

  const getMenuItems = useCallback(() => {
    if (!user) return [];
    return getFilteredMenuItems(user.role, serviceRole);
  }, [serviceRole, user]);

  const getEffectivePermissionsList = useCallback(() => {
    if (!user) return [];
    return getEffectivePermissions(user.role, serviceRole);
  }, [serviceRole, user]);

  const value: AuthContextType = {
    ...authState,
    loginWithGoogle,
    loginWithCredentials,
    registerEmployee,
    setUser: updateUser,
    updateUser,
    getAllUsers,
    getPendingRegistrations,
    linkGoogleAccount,
    logout,
    openLoginModal,
    closeLoginModal,
    isLoginModalOpen,
    isGoogleOAuthConfigured,
    hasServiceRole,
    serviceRole,
    getServiceRoleLabel,
    canCreateService,
    canEditService,
    canDeleteService,
    canPublishService,
    canManageServiceSEO,
    canTranslateService,
    getMenuItems,
    getEffectivePermissionsList,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

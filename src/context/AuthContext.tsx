import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  DEFAULT_ROLE_PERMISSIONS,
  LOCAL_STORAGE_KEY,
  SERVICE_ROLE_LABELS,
  SESSION_STORAGE_KEY,
  type AuthState,
  type ServiceRole,
  type User,
} from '../types/user';
import { getEffectivePermissions, getFilteredMenuItems, canPerformServiceAction, type MenuItem } from '../types/permissions';
import { signInWithGoogle, isGoogleOAuthConfigured } from '../services/auth/GoogleOAuthService';
import { isApiConfigured } from '../config/env';
import {
  clearAuthToken,
  fetchCurrentUser,
  loadAuthToken,
  loginWithBackend,
  mapAuthUserDtoToUser,
  saveAuthToken,
} from '../api/auth';
import {
  findUserByIdentifier,
  generateSessionId,
  loadAuthStateFromStorage,
  loadUserDatabase,
  recordFailedLoginAttempt,
  saveAuthStateToStorage,
  saveUserDatabase,
  verifyMockPassword,
} from '../utils/authHelpers';
import { mockHashPassword } from '../utils/mockAuth';

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
  loginWithCredentials: (identifier: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string; user?: User }>;
  loginWithGoogle: (rememberMe?: boolean) => Promise<{ success: boolean; error?: string; user?: User }>;
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

type StoredUser = User & { passwordHash?: string };

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const emptyAuthState: AuthState = { user: null, isAuthenticated: false, isLoading: true };

const toPublicUser = (user: StoredUser): User => {
  const publicUser = { ...user };
  delete publicUser.passwordHash;
  return publicUser;
};

const readStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY) || sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return null;
    const value: unknown = JSON.parse(stored);
    if (value && typeof value === 'object' && 'user' in value) {
      const state = value as AuthState;
      return state.user ?? null;
    }
    return value && typeof value === 'object' && 'id' in value ? value as User : null;
  } catch (error) {
    console.error('Unable to restore the saved authentication session:', error);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(emptyAuthState);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const saveSession = useCallback((user: User | null) => {
    const nextState: AuthState = {
      user,
      isAuthenticated: Boolean(user),
      isLoading: false,
    };
    setAuthState(nextState);
    if (user) {
      saveAuthStateToStorage(nextState, Boolean(user.rememberMe));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, []);

  const getAllUsers = useCallback((): User[] =>
    loadUserDatabase().map((user) => toPublicUser(user as StoredUser)), []);

  const storeUser = useCallback((user: User, passwordHash?: string) => {
    const users = loadUserDatabase() as StoredUser[];
    const current = users.find((item) => item.id === user.id);
    const updated: StoredUser = {
      ...current,
      ...user,
      ...(passwordHash ? { passwordHash } : {}),
    };
    saveUserDatabase([...users.filter((item) => item.id !== user.id), updated]);
    return toPublicUser(updated);
  }, []);

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      try {
        if (import.meta.env.PROD && (!isApiConfigured() || !loadAuthToken())) {
          clearAuthToken();
          saveSession(null);
          return;
        }

        if (isApiConfigured() && loadAuthToken()) {
          try {
            const dto = await fetchCurrentUser();
            if (active) {
              const rememberMe = Boolean(localStorage.getItem(LOCAL_STORAGE_KEY));
              saveSession(mapAuthUserDtoToUser(dto, rememberMe));
            }
            return;
          } catch (error) {
            console.error('Unable to restore the API session; clearing the invalid token.', error);
            clearAuthToken();
            if (import.meta.env.PROD) {
              if (active) saveSession(null);
              return;
            }
          }
        }

        const storedAuth = loadAuthStateFromStorage();
        const user = storedAuth?.user ?? readStoredUser();
        if (active) saveSession(user);
      } catch (error) {
        console.error('Unable to restore the authentication session:', error);
        if (active) saveSession(null);
      }
    };

    void restoreSession();
    return () => {
      active = false;
    };
  }, [saveSession]);

  const loginWithCredentials = useCallback(async (
    identifier: string,
    password: string,
    rememberMe = false,
  ): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      if (isApiConfigured()) {
        const response = await loginWithBackend({ identifier, password });
        saveAuthToken(response.token, rememberMe);
        const user = mapAuthUserDtoToUser(response.user, rememberMe);
        saveSession(user);
        setIsLoginModalOpen(false);
        return { success: true, user };
      }

      if (import.meta.env.PROD) {
        return { success: false, error: 'تسجيل الدخول غير متاح قبل إعداد خادم المصادقة.' };
      }

      const storedUser = findUserByIdentifier(identifier, loadUserDatabase()) as StoredUser | undefined;
      if (!storedUser) return { success: false, error: 'لم نعثر على حساب بهذا المعرف.' };
      if (!storedUser.passwordHash || !verifyMockPassword(password, storedUser.passwordHash)) {
        recordFailedLoginAttempt(identifier);
        return { success: false, error: 'كلمة المرور غير صحيحة.' };
      }

      const user = storeUser({
        ...toPublicUser(storedUser),
        lastLogin: new Date().toISOString(),
        sessionId: generateSessionId(),
        rememberMe,
      }, storedUser.passwordHash);
      saveSession(user);
      setIsLoginModalOpen(false);
      return { success: true, user };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'تعذر تسجيل الدخول.' };
    }
  }, [saveSession, storeUser]);

  const loginWithGoogle = useCallback(async (rememberMe = false): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      if (import.meta.env.PROD) {
        return { success: false, error: 'تسجيل Google غير متاح قبل ربطه بخادم المصادقة.' };
      }

      const googleUser = await signInWithGoogle();
      const storedUsers = loadUserDatabase() as StoredUser[];
      const existing = storedUsers.find((candidate) =>
        candidate.googleId === googleUser.googleId ||
        candidate.email.toLowerCase() === googleUser.email.toLowerCase()
      );
      const user = existing
        ? storeUser({ ...toPublicUser(existing), googleId: googleUser.googleId, rememberMe }, existing.passwordHash)
        : storeUser({
            id: `google-${googleUser.googleId}`,
            username: googleUser.email.split('@')[0],
            email: googleUser.email,
            fullName: googleUser.name,
            avatar: googleUser.avatar,
            googleId: googleUser.googleId,
            role: 'employee',
            authStatus: 'pending_approval',
            rememberMe,
            sessionId: generateSessionId(),
            permissions: DEFAULT_ROLE_PERMISSIONS.employee,
          }, mockHashPassword(crypto.randomUUID()));
      saveSession(user);
      return { success: true, user };
    } catch (error) {
      console.error('Google login failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'تعذر تسجيل الدخول بواسطة Google.' };
    }
  }, [saveSession, storeUser]);

  const registerEmployee = useCallback((registration: RegistrationData) => {
    if (!registration.termsAccepted || !registration.contractRead) {
      return Promise.resolve({ success: false, error: 'يجب الموافقة على الشروط وقراءة العقد.' });
    }
    if (import.meta.env.PROD || isApiConfigured()) {
      return Promise.resolve({ success: false, error: 'تسجيل الموظفين غير متاح عبر واجهة API الحالية.' });
    }

    try {
      const existing = findUserByIdentifier(registration.phone, loadUserDatabase());
      if (existing) return Promise.resolve({ success: false, error: 'يوجد حساب مسجل بهذا الرقم بالفعل.' });

      const user = storeUser({
        id: `employee-${crypto.randomUUID()}`,
        username: registration.phone,
        email: `${registration.phone}@employee.axiomx.local`,
        fullName: registration.fullName,
        nationalId: registration.nationalId,
        phone: registration.phone,
        country: registration.country,
        role: 'employee',
        authStatus: 'pending_approval',
        rememberMe: registration.rememberMe ?? false,
        sessionId: generateSessionId(),
        createdAt: new Date().toISOString(),
        googleId: registration.googleId,
        profilePhotoUrl: registration.profilePhotoUrl,
        idCardFrontUrl: registration.idCardFrontUrl,
        idCardBackUrl: registration.idCardBackUrl,
        personalPhotoUrl: registration.personalPhotoUrl,
        signatureDataUrl: registration.signatureDataUrl,
        permissions: DEFAULT_ROLE_PERMISSIONS.employee,
      }, mockHashPassword(registration.password));
      saveSession(user);
      return Promise.resolve({ success: true, user });
    } catch (error) {
      console.error('Employee registration failed:', error);
      return Promise.resolve({ success: false, error: error instanceof Error ? error.message : 'تعذر إنشاء الحساب.' });
    }
  }, [saveSession, storeUser]);

  const setUser = useCallback((user: User) => {
    const savedUser = storeUser(user);
    saveSession(savedUser);
  }, [saveSession, storeUser]);

  const updateUser = useCallback((user: User) => {
    const savedUser = storeUser(user);
    if (authState.user?.id === user.id) saveSession(savedUser);
  }, [authState.user?.id, saveSession, storeUser]);

  const getPendingRegistrations = useCallback(() =>
    getAllUsers().filter((user) => ['pending_review', 'pending_registration', 'pending_approval'].includes(user.authStatus ?? '')),
  [getAllUsers]);

  const linkGoogleAccount = useCallback(async () => {
    if (!authState.user) return { success: false, error: 'يجب تسجيل الدخول أولاً.' };
    if (import.meta.env.PROD) {
      return { success: false, error: 'ربط Google غير متاح قبل تفعيله على خادم المصادقة.' };
    }
    try {
      const googleUser = await signInWithGoogle();
      const user = storeUser({ ...authState.user, googleId: googleUser.googleId });
      saveSession(user);
      return { success: true, user };
    } catch (error) {
      console.error('Google account linking failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'تعذر ربط حساب Google.' };
    }
  }, [authState.user, saveSession, storeUser]);

  const logout = useCallback(() => {
    clearAuthToken();
    saveSession(null);
  }, [saveSession]);

  const openLoginModal = useCallback(() => setIsLoginModalOpen(true), []);
  const closeLoginModal = useCallback(() => setIsLoginModalOpen(false), []);
  const user = authState.user;
  const serviceRole = user?.serviceRole;
  const effectivePermissions = useMemo(
    () => user ? getEffectivePermissions(user.role, serviceRole) : [],
    [serviceRole, user],
  );
  const canServiceAction = useCallback((action: 'create' | 'edit' | 'delete' | 'publish' | 'seo' | 'translate') =>
    user ? canPerformServiceAction(user.role, serviceRole, action) : false,
  [serviceRole, user]);

  const value: AuthContextType = {
    ...authState,
    loginWithCredentials,
    loginWithGoogle,
    registerEmployee,
    setUser,
    updateUser,
    getAllUsers,
    getPendingRegistrations,
    linkGoogleAccount,
    logout,
    openLoginModal,
    closeLoginModal,
    isLoginModalOpen,
    isGoogleOAuthConfigured,
    hasServiceRole: Boolean(serviceRole),
    serviceRole,
    getServiceRoleLabel: (language) => serviceRole ? SERVICE_ROLE_LABELS[serviceRole][language] : '',
    canCreateService: canServiceAction('create'),
    canEditService: canServiceAction('edit'),
    canDeleteService: canServiceAction('delete'),
    canPublishService: canServiceAction('publish'),
    canManageServiceSEO: canServiceAction('seo'),
    canTranslateService: canServiceAction('translate'),
    getMenuItems: () => user ? getFilteredMenuItems(user.role, serviceRole) : [],
    getEffectivePermissionsList: () => effectivePermissions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;

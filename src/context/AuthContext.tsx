import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  User,
  AuthState,
  LoginCredentials,
  AXIOMX_USERS,
  DEFAULT_PASSWORD,
  SESSION_STORAGE_KEY,
} from '../types/user';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isLoginModalOpen: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to safely handle JSON parsing
const safeJSONParse = <T,>(str: string | null): T | null => {
  if (!str) return null;
  try {
    return JSON.parse(str) as T;
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    const user = safeJSONParse<User>(storedSession);

    if (user) {
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      // Find user by email or username
      const user = AXIOMX_USERS.find(
        (u) =>
          (u.email.toLowerCase() === credentials.identifier.toLowerCase()) ||
          (u.username.toLowerCase() === credentials.identifier.toLowerCase())
      );

      if (!user) {
        return { success: false, error: 'Invalid email or username' };
      }

      // Verify password
      if (credentials.password !== DEFAULT_PASSWORD) {
        return { success: false, error: 'Invalid password' };
      }

      // Create session with updated lastLogin
      const sessionUser: User = {
        ...user,
        lastLogin: new Date().toISOString(),
      };

      // Save to localStorage
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));

      // Update state
      setAuthState({
        user: sessionUser,
        isAuthenticated: true,
        isLoading: false,
      });

      // Close modal on successful login
      setIsLoginModalOpen(false);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem(SESSION_STORAGE_KEY);

    // Update state
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  // Modal controls
  const openLoginModal = useCallback(() => {
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    openLoginModal,
    closeLoginModal,
    isLoginModalOpen,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
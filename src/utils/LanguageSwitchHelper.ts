// =====================================================
// LANGUAGE SWITCH HELPER - AXIOMX ADMIN SYSTEM
// Phase 4E: Multilingual Content System
// =====================================================

import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Language Switch Helper Hook
 * Provides functions to switch between languages while maintaining current page context
 */
export const useLanguageSwitch = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Get current language from URL path
   */
  const getCurrentLanguage = (): 'en' | 'ar' => {
    const path = location.pathname;
    if (path.startsWith('/ar') || path === '/ar') {
      return 'ar';
    }
    return 'en';
  };

  /**
   * Check if URL has language prefix
   */
  const hasLanguagePrefix = (): boolean => {
    const path = location.pathname;
    return path.startsWith('/ar') || path === '/ar';
  };

  /**
   * Remove language prefix from path
   */
  const removeLanguagePrefix = (path: string): string => {
    if (path.startsWith('/ar')) {
      return path.replace(/^\/ar/, '') || '/';
    }
    return path;
  };

  /**
   * Add language prefix to path
   */
  const addLanguagePrefix = (path: string, language: 'en' | 'ar'): string => {
    if (language === 'ar') {
      // Remove any existing prefix
      const cleanPath = removeLanguagePrefix(path);
      return cleanPath === '/' ? '/ar' : `/ar${cleanPath}`;
    }
    // For English, just remove the prefix
    return removeLanguagePrefix(path) || '/';
  };

  /**
   * Get the localized version of the current path
   */
  const getLocalizedPath = (targetLanguage: 'en' | 'ar'): string => {
    const currentPath = location.pathname + location.search + location.hash;
    return addLanguagePrefix(currentPath, targetLanguage);
  };

  /**
   * Switch to another language and navigate to the localized path
   */
  const switchLanguage = (targetLanguage: 'en' | 'ar') => {
    const newPath = getLocalizedPath(targetLanguage);
    navigate(newPath);
  };

  /**
   * Get the alternative language path for the current page
   */
  const getAlternativeLanguagePath = (): string => {
    const currentLang = getCurrentLanguage();
    const targetLang = currentLang === 'en' ? 'ar' : 'en';
    return getLocalizedPath(targetLang);
  };

  /**
   * Get the language label for display
   */
  const getLanguageLabel = (lang: 'en' | 'ar'): string => {
    return lang === 'en' ? 'EN' : 'AR';
  };

  /**
   * Check if current content has translation for the given language
   */
  const hasTranslation = (
    content: { en?: unknown; ar?: unknown },
    targetLanguage: 'en' | 'ar'
  ): boolean => {
    if (!content) return false;
    const langContent = content[targetLanguage];
    if (!langContent) return false;
    // Check if content has any meaningful data
    if (typeof langContent === 'object' && langContent !== null) {
      return Object.keys(langContent).length > 0;
    }
    return !!langContent;
  };

  return {
    getCurrentLanguage,
    hasLanguagePrefix,
    removeLanguagePrefix,
    addLanguagePrefix,
    getLocalizedPath,
    switchLanguage,
    getAlternativeLanguagePath,
    getLanguageLabel,
    hasTranslation,
  };
};

/**
 * Standalone utility functions for language switching
 * Can be used outside of React components
 */

// Detect language from URL path
export const detectLanguageFromPath = (pathname: string): 'en' | 'ar' => {
  if (pathname.startsWith('/ar') || pathname === '/ar') {
    return 'ar';
  }
  return 'en';
};

// Remove language prefix from path
export const removeLanguagePrefixFromPath = (pathname: string): string => {
  if (pathname.startsWith('/ar')) {
    return pathname.replace(/^\/ar/, '') || '/';
  }
  return pathname;
};

// Build path with language prefix
export const buildPathWithLanguage = (
  pathname: string,
  language: 'en' | 'ar'
): string => {
  const cleanPath = removeLanguagePrefixFromPath(pathname);
  if (language === 'ar') {
    return cleanPath === '/' ? '/ar' : `/ar${cleanPath}`;
  }
  return cleanPath || '/';
};

// Switch language in URL
export const switchLanguageInUrl = (
  currentPath: string,
  currentLang: 'en' | 'ar',
  targetLang: 'en' | 'ar'
): string => {
  // Remove current language prefix
  const pathWithoutLang = removeLanguagePrefixFromPath(currentPath);
  // Add new language prefix
  return buildPathWithLanguage(pathWithoutLang, targetLang);
};

// Check if content has translation for a specific language
export const checkTranslationAvailability = (
  content: Record<string, unknown> | null | undefined,
  language: 'en' | 'ar'
): boolean => {
  if (!content) return false;
  const langContent = content[language];
  if (!langContent) return false;
  if (typeof langContent === 'object' && langContent !== null) {
    return Object.keys(langContent).length > 0;
  }
  return !!langContent;
};

// Get available language for a piece of content
export const getAvailableLanguage = (
  content: { en?: unknown; ar?: unknown }
): 'en' | 'ar' | null => {
  if (content?.en) return 'en';
  if (content?.ar) return 'ar';
  return null;
};

// Get missing languages count
export const getMissingLanguagesCount = (
  content: { en?: unknown; ar?: unknown }
): number => {
  let count = 0;
  if (!content?.en) count++;
  if (!content?.ar) count++;
  return count;
};

export default useLanguageSwitch;
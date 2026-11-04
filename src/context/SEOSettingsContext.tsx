// =====================================================
// SEO SETTINGS CONTEXT - AXIOMX ADMIN SYSTEM
// Phase 4F-E: Global SEO Settings Storage
// Manages global SEO settings including GA4 and Search Console
// =====================================================

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  GlobalSEOSettings,
  DEFAULT_GLOBAL_SEO_SETTINGS,
} from '../types/project';
import { AnalyticsManager } from '../lib/AnalyticsManager.tsx';
import { SearchConsoleManager } from '../lib/SearchConsoleManager';
import { devError, devLog } from '../utils/devLog';

// Storage key
const SEO_SETTINGS_STORAGE_KEY = 'axiomx_seo_settings';

// Context interface
interface SEOSettingsContextType {
  settings: GlobalSEOSettings;
  updateSettings: (newSettings: Partial<GlobalSEOSettings>) => void;
  resetSettings: () => void;
  saveSettings: () => void;
  loadSettings: () => void;
  isLoaded: boolean;
}

const SEOSettingsContext = createContext<SEOSettingsContextType | null>(null);

// Provider component
interface SEOSettingsProviderProps {
  children: ReactNode;
}

export const SEOSettingsProvider: React.FC<SEOSettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<GlobalSEOSettings>(DEFAULT_GLOBAL_SEO_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage
  const loadSettings = useCallback(() => {
    try {
      const stored = localStorage.getItem(SEO_SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as GlobalSEOSettings;
        setSettings({ ...DEFAULT_GLOBAL_SEO_SETTINGS, ...parsed });
        devLog('[SEOSettings] Settings loaded from localStorage');
      }
    } catch (error) {
      devError('[SEOSettings] Error loading settings:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage
  const saveSettings = useCallback(() => {
    try {
      localStorage.setItem(SEO_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      devLog('[SEOSettings] Settings saved to localStorage');
    } catch (error) {
      devError('[SEOSettings] Error saving settings:', error);
    }
  }, [settings]);

  // Update settings (partial update)
  const updateSettings = useCallback((newSettings: Partial<GlobalSEOSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Reset settings to defaults
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_GLOBAL_SEO_SETTINGS);
    localStorage.removeItem(SEO_SETTINGS_STORAGE_KEY);
    devLog('[SEOSettings] Settings reset to defaults');
  }, []);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Apply GA4 and Search Console when settings change
  useEffect(() => {
    if (!isLoaded) return;

    // Apply GA4 settings
    if (settings.ga4Enabled && settings.ga4MeasurementId) {
      AnalyticsManager.initialize({
        measurementId: settings.ga4MeasurementId,
        enabled: true,
      });
    }

    // Apply Search Console settings
    if (settings.searchConsoleEnabled && settings.searchConsoleCode) {
      SearchConsoleManager.initialize({
        verificationCode: settings.searchConsoleCode,
        verificationMethod: settings.searchConsoleMethod,
        enabled: true,
      });
    }

    // Auto-save on settings change
    saveSettings();
  }, [settings, isLoaded, saveSettings]);

  const value: SEOSettingsContextType = {
    settings,
    updateSettings,
    resetSettings,
    saveSettings,
    loadSettings,
    isLoaded,
  };

  return (
    <SEOSettingsContext.Provider value={value}>
      {children}
    </SEOSettingsContext.Provider>
  );
};

// Hook to use SEO settings context
export const useSEOSettings = (): SEOSettingsContextType => {
  const context = useContext(SEOSettingsContext);
  if (!context) {
    throw new Error('useSEOSettings must be used within an SEOSettingsProvider');
  }
  return context;
};

// Export settings helper for direct access
export const getSEOSettings = (): GlobalSEOSettings => {
  try {
    const stored = localStorage.getItem(SEO_SETTINGS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as GlobalSEOSettings;
    }
  } catch {
    // Ignore parse errors
  }
  return DEFAULT_GLOBAL_SEO_SETTINGS;
};

export default SEOSettingsContext;
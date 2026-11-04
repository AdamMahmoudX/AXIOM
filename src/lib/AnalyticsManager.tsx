// =====================================================
// ANALYTICS MANAGER - AXIOMX ADMIN SYSTEM
// Phase 4F-E: Google Analytics 4 Integration
// Centralized manager for GA4 tracking
// =====================================================

import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { devLog, devWarn } from '../utils/devLog';

// GA4 Configuration interface
export interface GA4Config {
  measurementId: string;
  enabled: boolean;
}

// Global gtag function type
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

// Analytics Manager singleton class
class AnalyticsManagerClass {
  private measurementId: string | null = null;
  private isLoaded: boolean = false;
  private queue: unknown[] = [];

  // Initialize with Measurement ID
  initialize(config: GA4Config): void {
    if (!config.enabled || !config.measurementId) {
      devWarn('[Analytics] GA4 disabled or missing Measurement ID');
      return;
    }

    this.measurementId = config.measurementId;

    // Load GA4 script dynamically
    this.loadGAScript(config.measurementId);
  }

  // Load Google Analytics script
  private loadGAScript(measurementId: string): void {
    if (this.isLoaded || document.querySelector('script[src*="googletagmanager.com/gtag"]')) {
      this.flushQueue();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;

    // Create gtag config script
    const configScript = document.createElement('script');
    configScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}', {
        page_path: window.location.pathname,
        send_page_view: true
      });
    `;

    // Append to head
    document.head.appendChild(script);
    document.head.appendChild(configScript);

    this.isLoaded = true;
    devLog(`[Analytics] GA4 initialized with Measurement ID: ${measurementId}`);

    // Flush any queued events
    this.flushQueue();
  }

  // Queue event for when GA4 is ready
  private queueEvent(event: unknown): void {
    if (!this.isLoaded) {
      this.queue.push(event);
    }
  }

  // Flush queued events
  private flushQueue(): void {
    while (this.queue.length > 0) {
      const event = this.queue.shift();
      if (event && typeof event === 'object' && 'type' in event) {
        this.trackEvent(event as unknown as AnalyticsEvent);
      }
    }
  }

  // Track custom event
  trackEvent(event: AnalyticsEvent): void {
    if (!this.measurementId) {
      this.queueEvent(event);
      return;
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.customParams,
      });
      devLog(`[Analytics] Event tracked: ${event.action}`, event);
    } else {
      this.queueEvent(event);
    }
  }

  // Track page view
  trackPageView(path: string, title?: string): void {
    if (!this.measurementId) {
      this.queueEvent({ type: 'pageview', path, title });
      return;
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title || document.title,
        page_location: window.location.href,
      });
      devLog(`[Analytics] Page view tracked: ${path}`);
    } else {
      this.queueEvent({ type: 'pageview', path, title });
    }
  }

  // Update page path (for SPAs)
  setPagePath(path: string): void {
    if (typeof window.gtag === 'function' && this.measurementId) {
      window.gtag('config', this.measurementId, {
        page_path: path,
        send_page_view: true,
      });
    }
  }

  // Get current Measurement ID
  getMeasurementId(): string | null {
    return this.measurementId;
  }

  // Check if analytics is initialized
  isInitialized(): boolean {
    return this.isLoaded && this.measurementId !== null;
  }

  // Disable analytics (for GDPR compliance)
  disable(): void {
    if (typeof window.gtag === 'function') {
      window.gtag('set', 'allow_google_scripts', 'restricted');
    }
  }

  // Enable analytics
  enable(): void {
    if (typeof window.gtag === 'function') {
      window.gtag('set', 'allow_google_scripts', 'all');
    }
  }
}

// Analytics Event interface
export interface AnalyticsEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  customParams?: Record<string, unknown>;
}

// Singleton instance
export const AnalyticsManager = new AnalyticsManagerClass();

// =====================================================
// REACT HOOKS
// =====================================================

// Hook for automatic page view tracking
export const usePageTracking = (measurementId: string | null, enabled: boolean = true): void => {
  const location = useLocation();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!enabled || !measurementId) return;

    // Initialize analytics on first render
    if (!isInitialized.current) {
      AnalyticsManager.initialize({
        measurementId,
        enabled: true,
      });
      isInitialized.current = true;
    }

    // Track page view on route change
    const currentPath = location.pathname + location.search;
    AnalyticsManager.trackPageView(currentPath);
  }, [location.pathname, location.search, measurementId, enabled]);
};

// Hook for custom event tracking
export const useAnalytics = () => {
  return {
    trackEvent: useCallback((event: AnalyticsEvent) => {
      AnalyticsManager.trackEvent(event);
    }, []),
    trackPageView: useCallback((path: string, title?: string) => {
      AnalyticsManager.trackPageView(path, title);
    }, []),
    isInitialized: AnalyticsManager.isInitialized(),
    getMeasurementId: AnalyticsManager.getMeasurementId(),
  };
};

// =====================================================
// ANALYTICS CONTEXT & PROVIDER
// =====================================================

import { createContext, useContext, ReactNode } from 'react';

// Analytics Context
interface AnalyticsContextType {
  measurementId: string | null;
  enabled: boolean;
  trackEvent: (event: AnalyticsEvent) => void;
  trackPageView: (path: string, title?: string) => void;
  isInitialized: boolean;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

// Analytics Provider Component
interface AnalyticsProviderProps {
  children: ReactNode;
  measurementId: string | null;
  enabled?: boolean;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
  measurementId,
  enabled = true,
}) => {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!enabled || !measurementId) return;

    if (!isInitialized.current) {
      AnalyticsManager.initialize({
        measurementId,
        enabled: true,
      });
      isInitialized.current = true;
    }
  }, [measurementId, enabled]);

  const value: AnalyticsContextType = {
    measurementId,
    enabled,
    trackEvent: (event) => AnalyticsManager.trackEvent(event),
    trackPageView: (path, title) => AnalyticsManager.trackPageView(path, title),
    isInitialized: AnalyticsManager.isInitialized(),
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

// Hook to use analytics context
export const useAnalyticsContext = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
};

// =====================================================
// DEFAULT ANALYTICS CONFIG
// =====================================================

export const DEFAULT_ANALYTICS_CONFIG: GA4Config = {
  measurementId: '',
  enabled: false,
};

export default AnalyticsManager;
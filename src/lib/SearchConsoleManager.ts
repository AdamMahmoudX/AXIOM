// =====================================================
// SEARCH CONSOLE MANAGER - AXIOMX ADMIN SYSTEM
// Phase 4F-E: Search Console Verification
// Handles Google Search Console verification and meta tags
// =====================================================

import { useEffect } from 'react';
import { devLog, devWarn } from '../utils/devLog';

// Verification types
export type VerificationMethod = 'meta-tag' | 'google-verification' | 'html-file' | 'dns-record';

export interface SearchConsoleConfig {
  verificationCode: string;
  verificationMethod: VerificationMethod;
  enabled: boolean;
}

// Meta tag verification interface
export interface MetaTagVerification {
  name: string;
  content: string;
}

// Google Site Verification interface
export interface GoogleSiteVerification {
  method: 'metatag' | 'cname' | 'txt';
  value: string;
}

// Search Console Manager singleton
class SearchConsoleManagerClass {
  private verificationCode: string | null = null;
  private verificationMethod: VerificationMethod = 'meta-tag';
  private isApplied: boolean = false;

  // Initialize with verification code
  initialize(config: SearchConsoleConfig): void {
    if (!config.enabled || !config.verificationCode) {
      devWarn('[SearchConsole] Verification disabled or missing code');
      return;
    }

    this.verificationCode = config.verificationCode;
    this.verificationMethod = config.verificationMethod;

    // Apply verification based on method
    this.applyVerification(config);
  }

  // Apply verification to the document
  private applyVerification(config: SearchConsoleConfig): void {
    // Remove existing verification tags first
    this.removeExistingTags();

    switch (config.verificationMethod) {
      case 'meta-tag':
        this.applyMetaTagVerification(config.verificationCode);
        break;
      case 'google-verification':
        this.applyGoogleVerification(config.verificationCode);
        break;
      case 'html-file':
        // HTML file verification requires server-side handling
        devLog('[SearchConsole] HTML file verification requires placing file on server');
        break;
      case 'dns-record':
        // DNS record verification requires DNS configuration
        devLog('[SearchConsole] DNS verification requires adding TXT record to domain DNS');
        break;
    }

    this.isApplied = true;
    devLog(`[SearchConsole] Verification applied using: ${config.verificationMethod}`);
  }

  // Apply meta tag verification (Google standard)
  private applyMetaTagVerification(code: string): void {
    // Google Search Console meta tag (most common)
    this.addMetaTag('google-site-verification', code);

    // Alternative: Generic site verification
    this.addMetaTag('verify-v1', code);

    // Bing verification (optional)
    this.addMetaTag('msvalidate.01', code);

    // Yandex verification (optional)
    this.addMetaTag('yandex-verification', code);
  }

  // Apply Google Verification Code (alternative format)
  private applyGoogleVerification(code: string): void {
    // Try both formats
    this.addMetaTag('google-site-verification', code);
    this.addMetaTag('google-site-verification', code + '/google{}.html');
  }

  // Add meta tag helper
  private addMetaTag(name: string, content: string): void {
    // Check if tag already exists
    const existing = document.querySelector(`meta[name="${name}"]`);
    if (existing) {
      existing.setAttribute('content', content);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('name', name);
      meta.setAttribute('content', content);
      document.head.appendChild(meta);
    }
  }

  // Remove existing verification tags
  private removeExistingTags(): void {
    const tagsToRemove = [
      'google-site-verification',
      'verify-v1',
      'msvalidate.01',
      'yandex-verification',
    ];

    tagsToRemove.forEach(tagName => {
      const existing = document.querySelector(`meta[name="${tagName}"]`);
      if (existing) {
        existing.remove();
      }
    });
  }

  // Get verification code
  getVerificationCode(): string | null {
    return this.verificationCode;
  }

  // Get verification method
  getVerificationMethod(): VerificationMethod {
    return this.verificationMethod;
  }

  // Check if verification is applied
  isVerified(): boolean {
    return this.isApplied && this.verificationCode !== null;
  }

  // Remove verification (for testing/cleanup)
  removeVerification(): void {
    this.removeExistingTags();
    this.verificationCode = null;
    this.verificationMethod = 'meta-tag';
    this.isApplied = false;
    devLog('[SearchConsole] Verification removed');
  }

  // Get verification status for display
  getVerificationStatus(): {
    isVerified: boolean;
    method: VerificationMethod;
    code: string | null;
    instructions: string;
  } {
    const instructions: Record<VerificationMethod, string> = {
      'meta-tag': 'Meta tag has been automatically added to your site head.',
      'google-verification': 'Google verification code has been added to your site.',
      'html-file': 'Upload the HTML verification file to your site root directory.',
      'dns-record': 'Add a TXT record with the verification code to your domain DNS.',
    };

    return {
      isVerified: this.isVerified(),
      method: this.verificationMethod,
      code: this.verificationCode,
      instructions: instructions[this.verificationMethod],
    };
  }
}

// Singleton instance
export const SearchConsoleManager = new SearchConsoleManagerClass();

// =====================================================
// REACT HOOKS
// =====================================================

// Hook for Search Console verification
export const useSearchConsoleVerification = (
  verificationCode: string | null,
  verificationMethod: VerificationMethod = 'meta-tag',
  enabled: boolean = true
): void => {
  useEffect(() => {
    if (!enabled || !verificationCode) return;

    SearchConsoleManager.initialize({
      verificationCode,
      verificationMethod,
      enabled: true,
    });
  }, [verificationCode, verificationMethod, enabled]);
};

// Hook to get verification status
export const useSearchConsoleStatus = () => {
  return SearchConsoleManager.getVerificationStatus();
};

// =====================================================
// VERIFICATION METHODS HELPERS
// =====================================================

// Generate meta tag HTML for manual verification
export const generateMetaTagHTML = (code: string): string => {
  return `<meta name="google-site-verification" content="${code}" />`;
};

// Generate HTML file content for verification
export const generateHTMLFileContent = (code: string): string => {
  return code;
};

// Get DNS TXT record value
export const getDNSTxtRecord = (code: string): string => {
  return `google-site-verification=${code}`;
};

// =====================================================
// DEFAULT CONFIG
// =====================================================

export const DEFAULT_SEARCH_CONSOLE_CONFIG: SearchConsoleConfig = {
  verificationCode: '',
  verificationMethod: 'meta-tag',
  enabled: false,
};

export default SearchConsoleManager;
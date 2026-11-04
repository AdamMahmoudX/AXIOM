// =====================================================
// SEO ALERTS ENGINE - AXIOMX ADMIN SYSTEM
// Phase 4F-F3: SEO Alerts System
// Functions for creating and managing SEO alerts
// =====================================================

import { SEOContentItem } from './SEOReportsEngine';

// Alert Types
export type AlertType =
  | 'missing_seo_title'
  | 'missing_meta_description'
  | 'missing_focus_keyword'
  | 'low_seo_score'
  | 'missing_open_graph'
  | 'missing_canonical_url';

export type AlertSeverity = 'critical' | 'warning';

// Alert Interface
export interface SEOAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  affectedItems: {
    id: string;
    title: string;
    type: 'project' | 'article';
    slug: string;
  }[];
  count: number;
  createdAt: string;
  resolved: boolean;
  resolvedAt?: string;
}

// Alert Configuration
interface AlertConfig {
  type: AlertType;
  severity: AlertSeverity;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  checkFunction: (item: SEOContentItem) => boolean;
}

// Alert Definitions
const ALERT_CONFIGS: AlertConfig[] = [
  // Critical Alerts
  {
    type: 'missing_seo_title',
    severity: 'critical',
    title: {
      en: 'Missing SEO Title',
      ar: 'العنوان SEO مفقود',
    },
    description: {
      en: 'Content items are missing SEO titles which are critical for search engine visibility.',
      ar: 'عناصر المحتوى مفقودة منها عناوين SEO وهي ضرورية لرؤية محركات البحث.',
    },
    checkFunction: (item) => !item.seo.title || item.seo.title.trim().length === 0,
  },
  {
    type: 'missing_meta_description',
    severity: 'critical',
    title: {
      en: 'Missing Meta Description',
      ar: 'الوصف التعريفي مفقود',
    },
    description: {
      en: 'Content items are missing meta descriptions which are important for search snippets.',
      ar: 'عناصر المحتوى مفقودة منها أوصاف تعريفية وهي مهمة لمقاطع البحث.',
    },
    checkFunction: (item) => !item.seo.description || item.seo.description.trim().length === 0,
  },
  {
    type: 'missing_focus_keyword',
    severity: 'critical',
    title: {
      en: 'Missing Focus Keyword',
      ar: 'كلمة المفتاح الرئيسية مفقودة',
    },
    description: {
      en: 'Content items are missing focus keywords which are essential for SEO targeting.',
      ar: 'عناصر المحتوى مفقودة منها كلمات المفتاح الرئيسية وهي ضرورية لاستهداف SEO.',
    },
    checkFunction: (item) => !item.seo.focusKeyword || item.seo.focusKeyword.trim().length === 0,
  },
  // Warning Alerts
  {
    type: 'low_seo_score',
    severity: 'warning',
    title: {
      en: 'Low SEO Score',
      ar: 'درجة SEO منخفضة',
    },
    description: {
      en: 'Content items have SEO scores below 50, indicating significant optimization opportunities.',
      ar: 'عناصر المحتوى لها درجات SEO أقل من 50، مما يشير إلى فرص تحسين كبيرة.',
    },
    checkFunction: (item) => item.score < 50,
  },
  {
    type: 'missing_open_graph',
    severity: 'warning',
    title: {
      en: 'Missing OpenGraph Data',
      ar: 'بيانات OpenGraph مفقودة',
    },
    description: {
      en: 'Content items are missing OpenGraph tags which affect social media sharing.',
      ar: 'عناصر المحتوى مفقودة منها علامات OpenGraph التي تؤثر على مشاركة وسائل التواصل.',
    },
    checkFunction: (item) =>
      !item.seo.openGraph ||
      !item.seo.openGraph.title ||
      !item.seo.openGraph.description ||
      !item.seo.openGraph.image,
  },
  {
    type: 'missing_canonical_url',
    severity: 'warning',
    title: {
      en: 'Missing Canonical URL',
      ar: 'رابط Canonical مفقود',
    },
    description: {
      en: 'Content items may benefit from canonical URLs to prevent duplicate content issues.',
      ar: 'قد تستفيد عناصر المحتوى من عناوين URL canonical لمنع مشاكل المحتوى المكرر.',
    },
    checkFunction: (item) => !item.slug || item.slug.trim().length === 0,
  },
];

// Storage key for resolved alerts
const RESOLVED_ALERTS_STORAGE_KEY = 'axiomx_seo_resolved_alerts';

// Generate unique alert ID
const generateAlertId = (type: AlertType, itemId: string): string => {
  return `${type}-${itemId}-${Date.now()}`;
};

// Get resolved alerts from localStorage
export const getResolvedAlerts = (): Set<string> => {
  try {
    const stored = localStorage.getItem(RESOLVED_ALERTS_STORAGE_KEY);
    if (stored) {
      return new Set(JSON.parse(stored) as string[]);
    }
  } catch (error) {
    console.error('[SEOAlertsEngine] Error loading resolved alerts:', error);
  }
  return new Set();
};

// Save resolved alerts to localStorage
const saveResolvedAlerts = (resolvedAlerts: Set<string>): void => {
  try {
    localStorage.setItem(
      RESOLVED_ALERTS_STORAGE_KEY,
      JSON.stringify(Array.from(resolvedAlerts))
    );
    console.log('[SEOAlertsEngine] Resolved alerts saved to localStorage');
  } catch (error) {
    console.error('[SEOAlertsEngine] Error saving resolved alerts:', error);
  }
};

// Mark alert as resolved
export const markAlertAsResolved = (alertId: string): void => {
  const resolvedAlerts = getResolvedAlerts();
  resolvedAlerts.add(alertId);
  saveResolvedAlerts(resolvedAlerts);
  console.log('[SEOAlertsEngine] Alert marked as resolved:', alertId);
};

// Unmark alert (mark as unresolved)
export const unmarkAlertAsResolved = (alertId: string): void => {
  const resolvedAlerts = getResolvedAlerts();
  resolvedAlerts.delete(alertId);
  saveResolvedAlerts(resolvedAlerts);
  console.log('[SEOAlertsEngine] Alert unmarked:', alertId);
};

// Check if alert is resolved
export const isAlertResolved = (alertId: string): boolean => {
  const resolvedAlerts = getResolvedAlerts();
  return resolvedAlerts.has(alertId);
};

// Clear all resolved alerts
export const clearAllResolvedAlerts = (): void => {
  localStorage.removeItem(RESOLVED_ALERTS_STORAGE_KEY);
  console.log('[SEOAlertsEngine] All resolved alerts cleared');
};

// Detect all alerts from content items
export const detectAllAlerts = (items: SEOContentItem[]): SEOAlert[] => {
  const alerts: SEOAlert[] = [];
  const resolvedAlerts = getResolvedAlerts();

  ALERT_CONFIGS.forEach((config) => {
    // Find all items that match this alert type
    const affectedItems = items
      .filter((item) => config.checkFunction(item))
      .map((item) => ({
        id: item.id,
        title: item.title,
        type: item.type,
        slug: item.slug,
      }));

    if (affectedItems.length > 0) {
      const alertId = generateAlertId(config.type, 'aggregate');

      // Check if this alert type has any unresolved items
      const hasUnresolvedItems = affectedItems.some(
        (affected) => !resolvedAlerts.has(`${config.type}-${affected.id}`)
      );

      alerts.push({
        id: alertId,
        type: config.type,
        severity: config.severity,
        title: config.title.en,
        titleAr: config.title.ar,
        description: config.description.en,
        descriptionAr: config.description.ar,
        affectedItems,
        count: affectedItems.length,
        createdAt: new Date().toISOString(),
        resolved: !hasUnresolvedItems,
      });
    }
  });

  // Sort by severity (critical first) then by count
  return alerts.sort((a, b) => {
    if (a.severity !== b.severity) {
      return a.severity === 'critical' ? -1 : 1;
    }
    return b.count - a.count;
  });
};

// Get alerts count
export const getAlertsCount = (alerts: SEOAlert[]): {
  total: number;
  critical: number;
  warning: number;
  unresolved: number;
} => {
  const resolvedAlerts = getResolvedAlerts();

  const critical = alerts.filter((a) => a.severity === 'critical').length;
  const warning = alerts.filter((a) => a.severity === 'warning').length;
  const total = critical + warning;

  const unresolved = alerts.filter((alert) => {
    // An alert is unresolved if it has any affected items that aren't resolved
    return alert.affectedItems.some(
      (item) => !resolvedAlerts.has(`${alert.type}-${item.id}`)
    );
  }).length;

  return { total, critical, warning, unresolved };
};

// Get detailed alert with resolution status per item
export const getAlertDetails = (alert: SEOAlert): {
  resolvedItems: { id: string; title: string; type: 'project' | 'article'; slug: string }[];
  unresolvedItems: { id: string; title: string; type: 'project' | 'article'; slug: string }[];
} => {
  const resolvedAlerts = getResolvedAlerts();

  const resolvedItems = alert.affectedItems.filter((item) =>
    resolvedAlerts.has(`${alert.type}-${item.id}`)
  );

  const unresolvedItems = alert.affectedItems.filter(
    (item) => !resolvedAlerts.has(`${alert.type}-${item.id}`)
  );

  return { resolvedItems, unresolvedItems };
};

// Mark specific item in alert as resolved
export const resolveAlertItem = (alertType: AlertType, itemId: string): void => {
  const alertId = `${alertType}-${itemId}`;
  markAlertAsResolved(alertId);
};

// Unresolve specific item in alert
export const unresolveAlertItem = (alertType: AlertType, itemId: string): void => {
  const alertId = `${alertType}-${itemId}`;
  unmarkAlertAsResolved(alertId);
};

// Check if specific alert item is resolved
export const isAlertItemResolved = (alertType: AlertType, itemId: string): boolean => {
  const alertId = `${alertType}-${itemId}`;
  return isAlertResolved(alertId);
};

// Get alert label
export const getAlertTypeLabel = (type: AlertType, language: 'en' | 'ar' = 'en'): string => {
  const config = ALERT_CONFIGS.find((c) => c.type === type);
  if (!config) return type;
  return language === 'ar' ? config.title.ar : config.title.en;
};

// Get alert description
export const getAlertTypeDescription = (type: AlertType, language: 'en' | 'ar' = 'en'): string => {
  const config = ALERT_CONFIGS.find((c) => c.type === type);
  if (!config) return '';
  return language === 'ar' ? config.description.ar : config.description.en;
};

// Get severity color class
export const getSeverityColorClass = (severity: AlertSeverity): string => {
  return severity === 'critical' ? 'text-red-400' : 'text-amber-400';
};

// Get severity background color class
export const getSeverityBgColorClass = (severity: AlertSeverity): string => {
  return severity === 'critical' ? 'bg-red-500/20' : 'bg-amber-500/20';
};

// Get severity border color class
export const getSeverityBorderColorClass = (severity: AlertSeverity): string => {
  return severity === 'critical' ? 'border-red-500/30' : 'border-amber-500/30';
};

// Get severity icon
export const getSeverityIcon = (severity: AlertSeverity): string => {
  return severity === 'critical' ? 'XCircle' : 'AlertTriangle';
};

// Filter alerts by severity
export const filterAlertsBySeverity = (
  alerts: SEOAlert[],
  severity: AlertSeverity
): SEOAlert[] => {
  return alerts.filter((alert) => alert.severity === severity);
};

// Filter alerts by resolution status
export const filterAlertsByResolution = (
  alerts: SEOAlert[],
  resolved: boolean
): SEOAlert[] => {
  const resolvedAlerts = getResolvedAlerts();
  return alerts.filter((alert) => {
    if (resolved) {
      return alert.affectedItems.every((item) =>
        resolvedAlerts.has(`${alert.type}-${item.id}`)
      );
    }
    return alert.affectedItems.some(
      (item) => !resolvedAlerts.has(`${alert.type}-${item.id}`)
    );
  });
};

// Export all alerts as JSON
export const exportAlertsAsJSON = (alerts: SEOAlert[]): string => {
  return JSON.stringify(alerts, null, 2);
};

export default {
  detectAllAlerts,
  getAlertsCount,
  getAlertDetails,
  markAlertAsResolved,
  unmarkAlertAsResolved,
  isAlertResolved,
  clearAllResolvedAlerts,
  resolveAlertItem,
  unresolveAlertItem,
  isAlertItemResolved,
  getAlertTypeLabel,
  getAlertTypeDescription,
  getSeverityColorClass,
  getSeverityBgColorClass,
  getSeverityBorderColorClass,
  getSeverityIcon,
  filterAlertsBySeverity,
  filterAlertsByResolution,
  exportAlertsAsJSON,
};
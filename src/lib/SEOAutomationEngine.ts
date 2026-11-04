// =====================================================
// SEO AUTOMATION ENGINE - AXIOMX ADMIN SYSTEM
// Phase 4F-F6: SEO Automation Rules
// Rule Engine, Trigger System, Action System, History, and LocalStorage
// =====================================================

import { SEOContentItem, calculateSEOConfigScore } from './SEOReportsEngine';

// =====================================================
// TYPES & INTERFACES
// =====================================================

// Rule Types
export type AutomationRuleType =
  | 'missing_seo_title'
  | 'missing_meta_description'
  | 'missing_focus_keyword'
  | 'missing_open_graph'
  | 'low_seo_score';

// Trigger Types
export type TriggerType = 'on_content_save' | 'on_demand' | 'scheduled' | 'manual_only';

// Action Types
export type ActionType = 'auto_fix' | 'notify' | 'log_only';

// Rule Status
export type RuleStatus = 'active' | 'inactive' | 'paused';

// Rule Interface
export interface AutomationRule {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  type: AutomationRuleType;
  trigger: TriggerType;
  action: ActionType;
  enabled: boolean;
  priority: number;
  createdAt: string;
  lastExecution?: string;
  successCount: number;
  failureCount: number;
  config: RuleConfig;
}

// Rule Configuration
export interface RuleConfig {
  autoFixEnabled: boolean;
  notificationEnabled: boolean;
  minScoreThreshold?: number;
  generateDefault?: boolean;
}

// Automation Execution History
export interface AutomationHistoryEntry {
  id: string;
  ruleId: string;
  ruleName: string;
  ruleType: AutomationRuleType;
  contentId: string;
  contentTitle: string;
  contentType: 'project' | 'article';
  status: 'success' | 'failed' | 'skipped';
  action: ActionType;
  details: string;
  executedAt: string;
  duration: number;
}

// Execution Result
export interface ExecutionResult {
  success: boolean;
  itemsFixed: number;
  itemsFailed: number;
  itemsSkipped: number;
  historyEntries: AutomationHistoryEntry[];
  summary: string;
}

// =====================================================
// STORAGE KEYS
// =====================================================

const AUTOMATION_RULES_STORAGE_KEY = 'axiomx_seo_automation_rules';
const AUTOMATION_HISTORY_STORAGE_KEY = 'axiomx_seo_automation_history';
const AUTOMATION_SETTINGS_KEY = 'axiomx_seo_automation_settings';

// =====================================================
// DEFAULT AUTOMATION RULES
// =====================================================

const DEFAULT_AUTOMATION_RULES: AutomationRule[] = [
  {
    id: 'rule-missing-seo-title',
    name: 'Missing SEO Title Auto-Fix',
    nameAr: 'إصلاح تلقائي للعنوان SEO المفقود',
    description: 'Automatically generate SEO titles for content missing titles',
    descriptionAr: 'إنشاء تلقائي لعناوين SEO للمحتوى المفقود منه العنوان',
    type: 'missing_seo_title',
    trigger: 'on_content_save',
    action: 'auto_fix',
    enabled: true,
    priority: 1,
    createdAt: new Date().toISOString(),
    successCount: 0,
    failureCount: 0,
    config: {
      autoFixEnabled: true,
      notificationEnabled: true,
      generateDefault: true,
    },
  },
  {
    id: 'rule-missing-meta-description',
    name: 'Missing Meta Description Auto-Fix',
    nameAr: 'إصلاح تلقائي للوصف التعريفي المفقود',
    description: 'Automatically generate meta descriptions for content missing descriptions',
    descriptionAr: 'إنشاء تلقائي للأوصاف التعريفية للمحتوى المفقود منه الوصف',
    type: 'missing_meta_description',
    trigger: 'on_content_save',
    action: 'auto_fix',
    enabled: true,
    priority: 2,
    createdAt: new Date().toISOString(),
    successCount: 0,
    failureCount: 0,
    config: {
      autoFixEnabled: true,
      notificationEnabled: true,
      generateDefault: true,
    },
  },
  {
    id: 'rule-missing-focus-keyword',
    name: 'Missing Focus Keyword Auto-Fix',
    nameAr: 'إصلاح تلقائي لكلمة المفتاح الرئيسية المفقودة',
    description: 'Automatically set focus keywords based on content analysis',
    descriptionAr: 'تعيين تلقائي لكلمات المفتاح الرئيسية بناءً على تحليل المحتوى',
    type: 'missing_focus_keyword',
    trigger: 'on_content_save',
    action: 'auto_fix',
    enabled: true,
    priority: 3,
    createdAt: new Date().toISOString(),
    successCount: 0,
    failureCount: 0,
    config: {
      autoFixEnabled: true,
      notificationEnabled: true,
      generateDefault: true,
    },
  },
  {
    id: 'rule-missing-open-graph',
    name: 'Missing OpenGraph Data Auto-Fix',
    nameAr: 'إصلاح تلقائي لبيانات OpenGraph المفقودة',
    description: 'Automatically generate OpenGraph tags for social sharing',
    descriptionAr: 'إنشاء تلقائي لعلامات OpenGraph لمشاركة وسائل التواصل',
    type: 'missing_open_graph',
    trigger: 'on_content_save',
    action: 'auto_fix',
    enabled: true,
    priority: 4,
    createdAt: new Date().toISOString(),
    successCount: 0,
    failureCount: 0,
    config: {
      autoFixEnabled: true,
      notificationEnabled: true,
      generateDefault: true,
    },
  },
  {
    id: 'rule-low-seo-score',
    name: 'Low SEO Score Alert',
    nameAr: 'تنبيه انخفاض درجة SEO',
    description: 'Alert when content SEO score drops below threshold',
    descriptionAr: 'تنبيه عندما تنخفض درجة SEO للمحتوى عن الحد الأدنى',
    type: 'low_seo_score',
    trigger: 'on_content_save',
    action: 'notify',
    enabled: true,
    priority: 5,
    createdAt: new Date().toISOString(),
    successCount: 0,
    failureCount: 0,
    config: {
      autoFixEnabled: false,
      notificationEnabled: true,
      minScoreThreshold: 50,
    },
  },
];

// =====================================================
// RULE ENGINE
// =====================================================

// Generate unique rule ID
const generateRuleId = (type: AutomationRuleType): string => {
  return `rule-${type}-${Date.now()}`;
};

// Create new automation rule
export const createAutomationRule = (
  ruleData: Omit<AutomationRule, 'id' | 'createdAt' | 'successCount' | 'failureCount'>
): AutomationRule => {
  return {
    ...ruleData,
    id: generateRuleId(ruleData.type),
    createdAt: new Date().toISOString(),
    successCount: 0,
    failureCount: 0,
  };
};

// Get all automation rules
export const getAutomationRules = (): AutomationRule[] => {
  try {
    const stored = localStorage.getItem(AUTOMATION_RULES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as AutomationRule[];
    }
  } catch (error) {
    console.error('[SEOAutomationEngine] Error loading rules:', error);
  }
  return DEFAULT_AUTOMATION_RULES;
};

// Save automation rules
export const saveAutomationRules = (rules: AutomationRule[]): void => {
  try {
    localStorage.setItem(AUTOMATION_RULES_STORAGE_KEY, JSON.stringify(rules));
    console.log('[SEOAutomationEngine] Rules saved to localStorage');
  } catch (error) {
    console.error('[SEOAutomationEngine] Error saving rules:', error);
  }
};

// Initialize default rules
export const initializeAutomationRules = (): AutomationRule[] => {
  const rules = getAutomationRules();
  if (rules.length === 0) {
    saveAutomationRules(DEFAULT_AUTOMATION_RULES);
    return DEFAULT_AUTOMATION_RULES;
  }
  return rules;
};

// Get rule by ID
export const getRuleById = (ruleId: string): AutomationRule | undefined => {
  const rules = getAutomationRules();
  return rules.find((rule) => rule.id === ruleId);
};

// Update rule
export const updateRule = (ruleId: string, updates: Partial<AutomationRule>): AutomationRule | undefined => {
  const rules = getAutomationRules();
  const index = rules.findIndex((rule) => rule.id === ruleId);
  if (index === -1) return undefined;

  rules[index] = { ...rules[index], ...updates };
  saveAutomationRules(rules);
  return rules[index];
};

// Enable/Disable rule
export const toggleRuleEnabled = (ruleId: string, enabled: boolean): void => {
  updateRule(ruleId, { enabled });
};

// Update rule execution stats
export const updateRuleStats = (ruleId: string, success: boolean): void => {
  const rule = getRuleById(ruleId);
  if (rule) {
    if (success) {
      updateRule(ruleId, {
        successCount: rule.successCount + 1,
        lastExecution: new Date().toISOString(),
      });
    } else {
      updateRule(ruleId, {
        failureCount: rule.failureCount + 1,
        lastExecution: new Date().toISOString(),
      });
    }
  }
};

// =====================================================
// TRIGGER SYSTEM
// =====================================================

// Check if rule should trigger
export const shouldTriggerRule = (rule: AutomationRule, trigger: TriggerType): boolean => {
  if (!rule.enabled) return false;
  if (rule.trigger === 'manual_only') return false;
  if (rule.trigger === trigger) return true;
  if (rule.trigger === 'on_content_save' && (trigger === 'on_content_save' || trigger === 'on_demand')) {
    return true;
  }
  return false;
};

// Get triggered rules for a specific trigger
export const getTriggeredRules = (trigger: TriggerType): AutomationRule[] => {
  const rules = getAutomationRules();
  return rules.filter((rule) => shouldTriggerRule(rule, trigger));
};

// =====================================================
// ACTION SYSTEM
// =====================================================

// Execute auto-fix for missing SEO title
const fixMissingSEOTitle = (item: SEOContentItem): { fixed: boolean; value?: string } => {
  if (item.seo.title && item.seo.title.length > 0) {
    return { fixed: false };
  }
  // Generate default title from content title
  const generatedTitle = item.title.length > 60
    ? item.title.substring(0, 57) + '...'
    : item.title;
  return { fixed: true, value: generatedTitle };
};

// Execute auto-fix for missing meta description
const fixMissingMetaDescription = (item: SEOContentItem): { fixed: boolean; value?: string } => {
  if (item.seo.description && item.seo.description.length > 0) {
    return { fixed: false };
  }
  // Generate description from content excerpt or first part
  const baseDescription = item.slug || item.title;
  const generatedDescription = baseDescription.length > 160
    ? baseDescription.substring(0, 157) + '...'
    : baseDescription;
  return { fixed: true, value: generatedDescription };
};

// Execute auto-fix for missing focus keyword
const fixMissingFocusKeyword = (item: SEOContentItem): { fixed: boolean; value?: string } => {
  if (item.seo.focusKeyword && item.seo.focusKeyword.length > 0) {
    return { fixed: false };
  }
  // Extract focus keyword from title (first 2-3 words)
  const words = item.title.split(' ').filter(w => w.length > 3);
  const focusKeyword = words.slice(0, 2).join(' ');
  return { fixed: true, value: focusKeyword || item.title.split(' ')[0] };
};

// Execute auto-fix for missing OpenGraph data
const fixMissingOpenGraph = (item: SEOContentItem): { fixed: boolean; value?: string } => {
  if (item.seo.openGraph?.title && item.seo.openGraph?.description && item.seo.openGraph?.image) {
    return { fixed: false };
  }
  // Return indicator that OG needs full setup
  return { fixed: true, value: 'auto-generated' };
};

// Check if SEO score is low
const checkLowSEOScore = (item: SEOContentItem, threshold: number = 50): boolean => {
  return item.score < threshold;
};

// Execute rule action
export const executeRuleAction = (
  rule: AutomationRule,
  item: SEOContentItem
): { success: boolean; details: string; value?: string } => {
  const startTime = Date.now();

  try {
    switch (rule.type) {
      case 'missing_seo_title': {
        const result = fixMissingSEOTitle(item);
        return {
          success: result.fixed,
          details: result.fixed
            ? `Generated SEO title: "${result.value}"`
            : 'SEO title already exists',
          value: result.value,
        };
      }
      case 'missing_meta_description': {
        const result = fixMissingMetaDescription(item);
        return {
          success: result.fixed,
          details: result.fixed
            ? `Generated meta description: "${result.value}"`
            : 'Meta description already exists',
          value: result.value,
        };
      }
      case 'missing_focus_keyword': {
        const result = fixMissingFocusKeyword(item);
        return {
          success: result.fixed,
          details: result.fixed
            ? `Set focus keyword: "${result.value}"`
            : 'Focus keyword already exists',
          value: result.value,
        };
      }
      case 'missing_open_graph': {
        const result = fixMissingOpenGraph(item);
        return {
          success: result.fixed,
          details: result.fixed
            ? 'Generated OpenGraph data'
            : 'OpenGraph data already complete',
          value: result.value,
        };
      }
      case 'low_seo_score': {
        const isLow = checkLowSEOScore(item, rule.config.minScoreThreshold);
        return {
          success: true,
          details: isLow
            ? `Low SEO score detected (${item.score}/${rule.config.minScoreThreshold || 50})`
            : 'SEO score is acceptable',
        };
      }
      default:
        return {
          success: false,
          details: `Unknown rule type: ${rule.type}`,
        };
    }
  } catch (error) {
    return {
      success: false,
      details: `Error executing rule: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

// =====================================================
// AUTOMATION HISTORY
// =====================================================

const MAX_HISTORY_ENTRIES = 500;

// Generate unique history entry ID
const generateHistoryId = (): string => {
  return `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get automation history
export const getAutomationHistory = (): AutomationHistoryEntry[] => {
  try {
    const stored = localStorage.getItem(AUTOMATION_HISTORY_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as AutomationHistoryEntry[];
    }
  } catch (error) {
    console.error('[SEOAutomationEngine] Error loading history:', error);
  }
  return [];
};

// Save automation history
export const saveAutomationHistory = (history: AutomationHistoryEntry[]): void => {
  try {
    // Keep only the most recent entries
    const trimmedHistory = history.slice(-MAX_HISTORY_ENTRIES);
    localStorage.setItem(AUTOMATION_HISTORY_STORAGE_KEY, JSON.stringify(trimmedHistory));
    console.log('[SEOAutomationEngine] History saved to localStorage');
  } catch (error) {
    console.error('[SEOAutomationEngine] Error saving history:', error);
  }
};

// Add history entry
export const addHistoryEntry = (entry: Omit<AutomationHistoryEntry, 'id'>): AutomationHistoryEntry => {
  const history = getAutomationHistory();
  const fullEntry: AutomationHistoryEntry = {
    ...entry,
    id: generateHistoryId(),
  };
  history.push(fullEntry);
  saveAutomationHistory(history);
  return fullEntry;
};

// Clear automation history
export const clearAutomationHistory = (): void => {
  localStorage.removeItem(AUTOMATION_HISTORY_STORAGE_KEY);
  console.log('[SEOAutomationEngine] History cleared');
};

// Get history entries for a specific rule
export const getHistoryByRuleId = (ruleId: string): AutomationHistoryEntry[] => {
  const history = getAutomationHistory();
  return history.filter((entry) => entry.ruleId === ruleId);
};

// Get recent history entries
export const getRecentHistory = (limit: number = 50): AutomationHistoryEntry[] => {
  const history = getAutomationHistory();
  return history.slice(-limit).reverse();
};

// =====================================================
// RULE EXECUTION ENGINE
// =====================================================

// Execute all triggered rules on content
export const executeAutomationRules = (
  items: SEOContentItem[],
  trigger: TriggerType = 'on_content_save'
): ExecutionResult => {
  const startTime = Date.now();
  const triggeredRules = getTriggeredRules(trigger);
  const historyEntries: AutomationHistoryEntry[] = [];

  let itemsFixed = 0;
  let itemsFailed = 0;
  let itemsSkipped = 0;

  triggeredRules.forEach((rule) => {
    items.forEach((item) => {
      const executionStart = Date.now();
      const result = executeRuleAction(rule, item);

      const historyEntry: AutomationHistoryEntry = {
        id: generateHistoryId(),
        ruleId: rule.id,
        ruleName: rule.name,
        ruleType: rule.type,
        contentId: item.id,
        contentTitle: item.title,
        contentType: item.type,
        status: result.success ? 'success' : 'failed',
        action: rule.action,
        details: result.details,
        executedAt: new Date().toISOString(),
        duration: Date.now() - executionStart,
      };

      historyEntries.push(historyEntry);

      if (result.success) {
        itemsFixed++;
        updateRuleStats(rule.id, true);
      } else if (result.details.includes('already exists')) {
        itemsSkipped++;
      } else {
        itemsFailed++;
        updateRuleStats(rule.id, false);
      }
    });
  });

  // Save all history entries
  historyEntries.forEach((entry) => {
    addHistoryEntry(entry);
  });

  const totalDuration = Date.now() - startTime;
  const summary = `Executed ${triggeredRules.length} rules on ${items.length} items. Fixed: ${itemsFixed}, Failed: ${itemsFailed}, Skipped: ${itemsSkipped}. Duration: ${totalDuration}ms`;

  console.log(`[SEOAutomationEngine] ${summary}`);

  return {
    success: itemsFailed === 0,
    itemsFixed,
    itemsFailed,
    itemsSkipped,
    historyEntries,
    summary,
  };
};

// Execute a specific rule on content
export const executeSpecificRule = (
  ruleId: string,
  items: SEOContentItem[]
): ExecutionResult => {
  const rule = getRuleById(ruleId);
  if (!rule) {
    return {
      success: false,
      itemsFixed: 0,
      itemsFailed: 0,
      itemsSkipped: 0,
      historyEntries: [],
      summary: `Rule not found: ${ruleId}`,
    };
  }

  const startTime = Date.now();
  const historyEntries: AutomationHistoryEntry[] = [];

  let itemsFixed = 0;
  let itemsFailed = 0;
  let itemsSkipped = 0;

  items.forEach((item) => {
    const executionStart = Date.now();
    const result = executeRuleAction(rule, item);

    const historyEntry: AutomationHistoryEntry = {
      id: generateHistoryId(),
      ruleId: rule.id,
      ruleName: rule.name,
      ruleType: rule.type,
      contentId: item.id,
      contentTitle: item.title,
      contentType: item.type,
      status: result.success ? 'success' : 'failed',
      action: rule.action,
      details: result.details,
      executedAt: new Date().toISOString(),
      duration: Date.now() - executionStart,
    };

    historyEntries.push(historyEntry);

    if (result.success) {
      itemsFixed++;
      updateRuleStats(rule.id, true);
    } else if (result.details.includes('already exists')) {
      itemsSkipped++;
    } else {
      itemsFailed++;
      updateRuleStats(rule.id, false);
    }
  });

  // Save all history entries
  historyEntries.forEach((entry) => {
    addHistoryEntry(entry);
  });

  const totalDuration = Date.now() - startTime;
  const summary = `Executed rule "${rule.name}" on ${items.length} items. Fixed: ${itemsFixed}, Failed: ${itemsFailed}, Skipped: ${itemsSkipped}. Duration: ${totalDuration}ms`;

  console.log(`[SEOAutomationEngine] ${summary}`);

  return {
    success: itemsFailed === 0,
    itemsFixed,
    itemsFailed,
    itemsSkipped,
    historyEntries,
    summary,
  };
};

// =====================================================
// AUTOMATION SETTINGS
// =====================================================

export interface AutomationSettings {
  autoFixEnabled: boolean;
  notificationsEnabled: boolean;
  historyRetention: number;
  lastFullRun?: string;
}

const DEFAULT_AUTOMATION_SETTINGS: AutomationSettings = {
  autoFixEnabled: true,
  notificationsEnabled: true,
  historyRetention: 500,
};

// Get automation settings
export const getAutomationSettings = (): AutomationSettings => {
  try {
    const stored = localStorage.getItem(AUTOMATION_SETTINGS_KEY);
    if (stored) {
      return { ...DEFAULT_AUTOMATION_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('[SEOAutomationEngine] Error loading settings:', error);
  }
  return DEFAULT_AUTOMATION_SETTINGS;
};

// Save automation settings
export const saveAutomationSettings = (settings: Partial<AutomationSettings>): void => {
  try {
    const current = getAutomationSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(AUTOMATION_SETTINGS_KEY, JSON.stringify(updated));
    console.log('[SEOAutomationEngine] Settings saved');
  } catch (error) {
    console.error('[SEOAutomationEngine] Error saving settings:', error);
  }
};

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

// Get rule type label
export const getRuleTypeLabel = (type: AutomationRuleType, language: 'en' | 'ar' = 'en'): string => {
  const labels: Record<AutomationRuleType, { en: string; ar: string }> = {
    missing_seo_title: { en: 'Missing SEO Title', ar: 'العنوان SEO مفقود' },
    missing_meta_description: { en: 'Missing Meta Description', ar: 'الوصف التعريفي مفقود' },
    missing_focus_keyword: { en: 'Missing Focus Keyword', ar: 'كلمة المفتاح الرئيسية مفقودة' },
    missing_open_graph: { en: 'Missing OpenGraph Data', ar: 'بيانات OpenGraph مفقودة' },
    low_seo_score: { en: 'Low SEO Score', ar: 'درجة SEO منخفضة' },
  };
  return labels[type]?.[language] || type;
};

// Get trigger type label
export const getTriggerTypeLabel = (trigger: TriggerType, language: 'en' | 'ar' = 'en'): string => {
  const labels: Record<TriggerType, { en: string; ar: string }> = {
    on_content_save: { en: 'On Content Save', ar: 'عند حفظ المحتوى' },
    on_demand: { en: 'On Demand', ar: 'عند الطلب' },
    scheduled: { en: 'Scheduled', ar: 'مجدول' },
    manual_only: { en: 'Manual Only', ar: 'يدوي فقط' },
  };
  return labels[trigger]?.[language] || trigger;
};

// Get action type label
export const getActionTypeLabel = (action: ActionType, language: 'en' | 'ar' = 'en'): string => {
  const labels: Record<ActionType, { en: string; ar: string }> = {
    auto_fix: { en: 'Auto-Fix', ar: 'إصلاح تلقائي' },
    notify: { en: 'Notify', ar: 'إشعار' },
    log_only: { en: 'Log Only', ar: 'سجل فقط' },
  };
  return labels[action]?.[language] || action;
};

// Get status color class
export const getStatusColorClass = (status: 'success' | 'failed' | 'skipped'): string => {
  switch (status) {
    case 'success': return 'text-green-400';
    case 'failed': return 'text-red-400';
    case 'skipped': return 'text-gray-400';
  }
};

// Get status background color class
export const getStatusBgColorClass = (status: 'success' | 'failed' | 'skipped'): string => {
  switch (status) {
    case 'success': return 'bg-green-500/20';
    case 'failed': return 'bg-red-500/20';
    case 'skipped': return 'bg-gray-500/20';
  }
};

// Get rule enabled status color
export const getRuleEnabledColorClass = (enabled: boolean): string => {
  return enabled ? 'text-green-400' : 'text-gray-400';
};

// =====================================================
// EXPORTS
// =====================================================

export default {
  // Rule Engine
  createAutomationRule,
  getAutomationRules,
  saveAutomationRules,
  initializeAutomationRules,
  getRuleById,
  updateRule,
  toggleRuleEnabled,
  updateRuleStats,

  // Trigger System
  shouldTriggerRule,
  getTriggeredRules,

  // Action System
  executeRuleAction,
  executeAutomationRules,
  executeSpecificRule,

  // History
  getAutomationHistory,
  saveAutomationHistory,
  addHistoryEntry,
  clearAutomationHistory,
  getHistoryByRuleId,
  getRecentHistory,

  // Settings
  getAutomationSettings,
  saveAutomationSettings,

  // Utilities
  getRuleTypeLabel,
  getTriggerTypeLabel,
  getActionTypeLabel,
  getStatusColorClass,
  getStatusBgColorClass,
  getRuleEnabledColorClass,
};
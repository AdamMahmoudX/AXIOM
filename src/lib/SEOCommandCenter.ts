// =====================================================
// SEO COMMAND CENTER - AXIOMX ADMIN SYSTEM
// Phase 4F-F8: Final SEO Command Center
// Central hub for all SEO operations and monitoring
// =====================================================

import { Project } from '../types/project';
import { Article } from '../types/project';

// Import all SEO modules
import {
  generateSEOReport,
  calculateSEOConfigScore,
  getScoreLabel,
  SEOReport,
  SEOContentItem,
  SEOIssue,
} from './SEOReportsEngine';

import {
  detectAllAlerts,
  getAlertsCount,
  SEOAlert,
  markAlertAsResolved,
} from './SEOAlertsEngine';

import {
  getKeywords,
  getKeywordStatistics,
  SEOKeyword,
} from './SEOKeywordsManager';

import {
  analyzeInternalLinks,
  getLastAnalysis,
  InternalLinkAnalysis,
  ContentNode,
} from './InternalLinkAnalyzer';

import {
  SEOTrendsEngine,
  SEOPerformanceSnapshot,
  TrendReport,
} from './SEOTrendsEngine';

import {
  getAutomationRules,
  executeAutomationRules,
  AutomationRule,
  AutomationHistoryEntry,
  getRecentHistory,
} from './SEOAutomationEngine';

import {
  SEOHealthMonitor,
  SEOHealthScanner,
  SEOHealthStatus,
  SEOHealthIssue,
  HealthScanResult,
} from './SEOHealthMonitor';

// =====================================================
// TYPES & INTERFACES
// =====================================================

// Module Status Types
export type ModuleStatus = 'online' | 'warning' | 'error' | 'offline';

// Module Information
export interface SEOModuleInfo {
  id: string;
  name: string;
  nameAr: string;
  status: ModuleStatus;
  lastUpdated: string;
  description: string;
  descriptionAr: string;
  stats: {
    label: string;
    labelAr: string;
    value: number | string;
  }[];
}

// Command Action Types
export type CommandActionType =
  | 'full_scan'
  | 'generate_report'
  | 'health_check'
  | 'execute_automation'
  | 'refresh_trends'
  | 'analyze_links';

// Command Execution Result
export interface CommandResult {
  success: boolean;
  action: CommandActionType;
  message: string;
  messageAr: string;
  data?: any;
  timestamp: string;
  duration: number;
}

// Activity Feed Entry
export interface ActivityFeedEntry {
  id: string;
  type: 'operation' | 'alert' | 'check' | 'report';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  timestamp: string;
  severity?: 'info' | 'warning' | 'critical' | 'success';
  metadata?: Record<string, any>;
}

// SEO System Summary
export interface SEOSystemSummary {
  overallScore: number;
  healthScore: number;
  activeAlerts: number;
  activeAutomationRules: number;
  keywordsTracked: number;
  internalLinksCount: number;
  trendsStatus: 'active' | 'inactive';
  criticalIssues: number;
  warnings: number;
  healthyPages: number;
  topContent: SEOContentItem[];
  worstContent: SEOContentItem[];
}

// Command Center State
export interface CommandCenterState {
  lastFullScan: string | null;
  lastReport: string | null;
  lastHealthCheck: string | null;
  lastAutomationRun: string | null;
  lastTrendsUpdate: string | null;
  lastLinkAnalysis: string | null;
}

// =====================================================
// STORAGE KEYS
// =====================================================

const COMMAND_CENTER_STATE_KEY = 'axiomx_seo_command_center_state';
const ACTIVITY_FEED_KEY = 'axiomx_seo_activity_feed';
const MODULES_STATUS_KEY = 'axiomx_seo_modules_status';

// =====================================================
// CENTRAL SEO DASHBOARD ENGINE
// =====================================================

export class SEODashboardEngine {
  // Get comprehensive dashboard data
  static getDashboardData(
    projects: Project[],
    articles: Article[]
  ): SEOSystemSummary {
    // Generate SEO Report
    const report = generateSEOReport(projects, articles);

    // Get Alerts
    const allItems = [
      ...projects.map((p) => ({
        id: p.id,
        type: 'project' as const,
        title: p.content.en.title,
        slug: p.content.en.slug || p.name,
        seo: p.content.en.seo || {},
        score: calculateSEOConfigScore(p.content.en.seo || {}),
        issues: [],
      })),
      ...articles.map((a) => ({
        id: a.id,
        type: 'article' as const,
        title: a.content.en.title,
        slug: a.content.en.slug || a.title,
        seo: a.content.en.seo || {},
        score: calculateSEOConfigScore(a.content.en.seo || {}),
        issues: [],
      })),
    ];
    const alerts = detectAllAlerts(allItems as SEOContentItem[]);
    const alertsCount = getAlertsCount(alerts);

    // Get Keywords Stats
    const keywordStats = getKeywordStatistics();

    // Get Internal Links
    const linkAnalysis = analyzeInternalLinks(projects, articles);

    // Get Health Status
    const healthResult = SEOHealthScanner.scan(projects, articles);

    // Get Automation Rules
    const automationRules = getAutomationRules();
    const activeRules = automationRules.filter((r) => r.enabled).length;

    // Get Trends Status
    const latestSnapshot = SEOTrendsEngine.getLatestSnapshot();
    const trendsStatus = latestSnapshot ? 'active' : 'inactive';

    return {
      overallScore: report.summary.avgScore,
      healthScore: healthResult.healthStatus.overallScore,
      activeAlerts: alertsCount.unresolved,
      activeAutomationRules: activeRules,
      keywordsTracked: keywordStats.totalKeywords,
      internalLinksCount: linkAnalysis.totalLinks,
      trendsStatus,
      criticalIssues: healthResult.healthStatus.criticalIssuesCount,
      warnings: healthResult.healthStatus.warningsCount,
      healthyPages: healthResult.healthStatus.healthyPagesCount,
      topContent: report.topContent,
      worstContent: report.worstContent,
    };
  }

  // Get score color based on value
  static getScoreColor(score: number): string {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-red-400';
  }

  // Get score background color
  static getScoreBgColor(score: number): string {
    if (score >= 80) return 'bg-green-500/20';
    if (score >= 60) return 'bg-blue-500/20';
    if (score >= 40) return 'bg-amber-500/20';
    return 'bg-red-500/20';
  }

  // Get score progress percentage
  static getScoreProgress(score: number): number {
    return Math.min(100, Math.max(0, score));
  }
}

// =====================================================
// UNIFIED SEO METRICS AGGREGATOR
// =====================================================

export class SEOMetricsAggregator {
  // Aggregate all SEO metrics into a unified format
  static aggregateMetrics(
    projects: Project[],
    articles: Article[]
  ): {
    reports: SEOReport;
    alerts: SEOAlert[];
    alertsCount: ReturnType<typeof getAlertsCount>;
    keywords: ReturnType<typeof getKeywordStatistics>;
    links: InternalLinkAnalysis;
    health: HealthScanResult;
    automation: {
      rules: AutomationRule[];
      activeCount: number;
      recentHistory: AutomationHistoryEntry[];
    };
    trends: {
      latestSnapshot: SEOPerformanceSnapshot | null;
      recentTrends: ReturnType<typeof SEOTrendsEngine.loadTrends>;
    };
  } {
    // Reports
    const reports = generateSEOReport(projects, articles);

    // Alerts
    const allItems = [
      ...projects.map((p) => ({
        id: p.id,
        type: 'project' as const,
        title: p.content.en.title,
        slug: p.content.en.slug || p.name,
        seo: p.content.en.seo || {},
        score: calculateSEOConfigScore(p.content.en.seo || {}),
        issues: [],
      })),
      ...articles.map((a) => ({
        id: a.id,
        type: 'article' as const,
        title: a.content.en.title,
        slug: a.content.en.slug || a.title,
        seo: a.content.en.seo || {},
        score: calculateSEOConfigScore(a.content.en.seo || {}),
        issues: [],
      })),
    ];
    const alerts = detectAllAlerts(allItems as SEOContentItem[]);
    const alertsCount = getAlertsCount(alerts);

    // Keywords
    const keywords = getKeywordStatistics();

    // Links
    const links = analyzeInternalLinks(projects, articles);

    // Health
    const health = SEOHealthScanner.scan(projects, articles);

    // Automation
    const automationRules = getAutomationRules();
    const recentHistory = getRecentHistory(20);

    // Trends
    const latestSnapshot = SEOTrendsEngine.getLatestSnapshot();
    const recentTrends = SEOTrendsEngine.loadTrends().slice(-30);

    return {
      reports,
      alerts,
      alertsCount,
      keywords,
      links,
      health,
      automation: {
        rules: automationRules,
        activeCount: automationRules.filter((r) => r.enabled).length,
        recentHistory,
      },
      trends: {
        latestSnapshot,
        recentTrends,
      },
    };
  }

  // Get metric summary for display
  static getMetricSummary(metrics: ReturnType<typeof this.aggregateMetrics>): {
    label: string;
    labelAr: string;
    value: number | string;
    trend?: 'up' | 'down' | 'stable';
    color?: string;
  }[] {
    const summary = [];

    // Overall SEO Score
    summary.push({
      label: 'Overall SEO Score',
      labelAr: 'درجة SEO الإجمالية',
      value: metrics.reports.summary.avgScore,
      color: SEODashboardEngine.getScoreColor(metrics.reports.summary.avgScore),
    });

    // Health Score
    summary.push({
      label: 'Health Score',
      labelAr: 'درجة الصحة',
      value: metrics.health.healthStatus.overallScore,
      color: SEODashboardEngine.getScoreColor(metrics.health.healthStatus.overallScore),
    });

    // Active Alerts
    summary.push({
      label: 'Active Alerts',
      labelAr: 'التنبيهات النشطة',
      value: metrics.alertsCount.unresolved,
      color: metrics.alertsCount.unresolved > 0 ? 'text-amber-400' : 'text-green-400',
    });

    // Keywords Tracked
    summary.push({
      label: 'Keywords Tracked',
      labelAr: 'كلمات المفتاح المتتبعة',
      value: metrics.keywords.totalKeywords,
    });

    // Internal Links
    summary.push({
      label: 'Internal Links',
      labelAr: 'الروابط الداخلية',
      value: metrics.links.totalLinks,
    });

    // Automation Rules
    summary.push({
      label: 'Active Automation Rules',
      labelAr: 'قواعد الأتمتة النشطة',
      value: metrics.automation.activeCount,
    });

    return summary;
  }
}

// =====================================================
// SEO SYSTEM STATUS MONITOR
// =====================================================

export class SEOSystemStatusMonitor {
  // Check status of all SEO modules
  static checkAllModulesStatus(): SEOModuleInfo[] {
    const modules: SEOModuleInfo[] = [];

    // Reports Engine
    modules.push(this.checkReportsEngine());

    // Alerts Engine
    modules.push(this.checkAlertsEngine());

    // Keywords Manager
    modules.push(this.checkKeywordsManager());

    // Internal Link Analyzer
    modules.push(this.checkInternalLinkAnalyzer());

    // Trends Engine
    modules.push(this.checkTrendsEngine());

    // Automation Engine
    modules.push(this.checkAutomationEngine());

    // Health Monitor
    modules.push(this.checkHealthMonitor());

    return modules;
  }

  private static checkReportsEngine(): SEOModuleInfo {
    try {
      // Try to get reports data
      return {
        id: 'reports',
        name: 'SEO Reports Engine',
        nameAr: 'محرك تقارير SEO',
        status: 'online',
        lastUpdated: new Date().toISOString(),
        description: 'Generates comprehensive SEO reports and analytics',
        descriptionAr: 'ينشئ تقارير وتحليلات SEO شاملة',
        stats: [],
      };
    } catch {
      return {
        id: 'reports',
        name: 'SEO Reports Engine',
        nameAr: 'محرك تقارير SEO',
        status: 'error',
        lastUpdated: new Date().toISOString(),
        description: 'Error loading reports module',
        descriptionAr: 'خطأ في تحميل وحدة التقارير',
        stats: [],
      };
    }
  }

  private static checkAlertsEngine(): SEOModuleInfo {
    try {
      return {
        id: 'alerts',
        name: 'SEO Alerts Engine',
        nameAr: 'محرك تنبيهات SEO',
        status: 'online',
        lastUpdated: new Date().toISOString(),
        description: 'Monitors and generates SEO alerts',
        descriptionAr: 'يراقب وينشئ تنبيهات SEO',
        stats: [],
      };
    } catch {
      return {
        id: 'alerts',
        name: 'SEO Alerts Engine',
        nameAr: 'محرك تنبيهات SEO',
        status: 'error',
        lastUpdated: new Date().toISOString(),
        description: 'Error loading alerts module',
        descriptionAr: 'خطأ في تحميل وحدة التنبيهات',
        stats: [],
      };
    }
  }

  private static checkKeywordsManager(): SEOModuleInfo {
    try {
      const keywords = getKeywords();
      return {
        id: 'keywords',
        name: 'SEO Keywords Manager',
        nameAr: 'مدير كلمات المفتاح SEO',
        status: 'online',
        lastUpdated: new Date().toISOString(),
        description: 'Manages SEO keywords and tracking',
        descriptionAr: 'يدير تتبع كلمات المفتاح لـ SEO',
        stats: [
          {
            label: 'Total Keywords',
            labelAr: 'إجمالي الكلمات',
            value: keywords.length,
          },
        ],
      };
    } catch {
      return {
        id: 'keywords',
        name: 'SEO Keywords Manager',
        nameAr: 'مدير كلمات المفتاح SEO',
        status: 'error',
        lastUpdated: new Date().toISOString(),
        description: 'Error loading keywords module',
        descriptionAr: 'خطأ في تحميل وحدة الكلمات',
        stats: [],
      };
    }
  }

  private static checkInternalLinkAnalyzer(): SEOModuleInfo {
    try {
      const lastAnalysis = getLastAnalysis();
      return {
        id: 'links',
        name: 'Internal Link Analyzer',
        nameAr: 'محلل الروابط الداخلية',
        status: 'online',
        lastUpdated: lastAnalysis?.analyzedAt || new Date().toISOString(),
        description: 'Analyzes internal linking structure',
        descriptionAr: 'يحلل هيكل الروابط الداخلية',
        stats: lastAnalysis
          ? [
              {
                label: 'Total Links',
                labelAr: 'إجمالي الروابط',
                value: lastAnalysis.totalLinks,
              },
              {
                label: 'Orphan Content',
                labelAr: 'محتوى معزول',
                value: lastAnalysis.orphanContent.length,
              },
            ]
          : [],
      };
    } catch {
      return {
        id: 'links',
        name: 'Internal Link Analyzer',
        nameAr: 'محلل الروابط الداخلية',
        status: 'error',
        lastUpdated: new Date().toISOString(),
        description: 'Error loading links module',
        descriptionAr: 'خطأ في تحميل وحدة الروابط',
        stats: [],
      };
    }
  }

  private static checkTrendsEngine(): SEOModuleInfo {
    try {
      const latestSnapshot = SEOTrendsEngine.getLatestSnapshot();
      const trends = SEOTrendsEngine.loadTrends();
      return {
        id: 'trends',
        name: 'SEO Trends Engine',
        nameAr: 'محرك اتجاهات SEO',
        status: trends.length > 0 ? 'online' : 'warning',
        lastUpdated: latestSnapshot?.timestamp || new Date().toISOString(),
        description: 'Tracks SEO performance trends over time',
        descriptionAr: 'يتتبع اتجاهات أداء SEO عبر الوقت',
        stats: [
          {
            label: 'Data Points',
            labelAr: 'نقاط البيانات',
            value: trends.length,
          },
        ],
      };
    } catch {
      return {
        id: 'trends',
        name: 'SEO Trends Engine',
        nameAr: 'محرك اتجاهات SEO',
        status: 'error',
        lastUpdated: new Date().toISOString(),
        description: 'Error loading trends module',
        descriptionAr: 'خطأ في تحميل وحدة الاتجاهات',
        stats: [],
      };
    }
  }

  private static checkAutomationEngine(): SEOModuleInfo {
    try {
      const rules = getAutomationRules();
      const activeCount = rules.filter((r) => r.enabled).length;
      return {
        id: 'automation',
        name: 'SEO Automation Engine',
        nameAr: 'محرك أتمتة SEO',
        status: 'online',
        lastUpdated: new Date().toISOString(),
        description: 'Automates SEO tasks and fixes',
        descriptionAr: 'أتمتة مهام وإصلاحات SEO',
        stats: [
          {
            label: 'Active Rules',
            labelAr: 'القواعد النشطة',
            value: activeCount,
          },
          {
            label: 'Total Rules',
            labelAr: 'إجمالي القواعد',
            value: rules.length,
          },
        ],
      };
    } catch {
      return {
        id: 'automation',
        name: 'SEO Automation Engine',
        nameAr: 'محرك أتمتة SEO',
        status: 'error',
        lastUpdated: new Date().toISOString(),
        description: 'Error loading automation module',
        descriptionAr: 'خطأ في تحميل وحدة الأتمتة',
        stats: [],
      };
    }
  }

  private static checkHealthMonitor(): SEOModuleInfo {
    try {
      const cachedStatus = SEOHealthMonitor.getCachedStatus();
      return {
        id: 'health',
        name: 'SEO Health Monitor',
        nameAr: 'مراقب صحة SEO',
        status: cachedStatus ? 'online' : 'warning',
        lastUpdated: cachedStatus?.lastScanned || new Date().toISOString(),
        description: 'Monitors overall SEO health status',
        descriptionAr: 'يراقب حالة صحة SEO العامة',
        stats: cachedStatus
          ? [
              {
                label: 'Health Score',
                labelAr: 'درجة الصحة',
                value: cachedStatus.overallScore,
              },
              {
                label: 'Critical Issues',
                labelAr: 'مشاكل حرجة',
                value: cachedStatus.criticalIssuesCount,
              },
            ]
          : [],
      };
    } catch {
      return {
        id: 'health',
        name: 'SEO Health Monitor',
        nameAr: 'مراقب صحة SEO',
        status: 'error',
        lastUpdated: new Date().toISOString(),
        description: 'Error loading health module',
        descriptionAr: 'خطأ في تحميل وحدة الصحة',
        stats: [],
      };
    }
  }

  // Get status color
  static getStatusColor(status: ModuleStatus): string {
    switch (status) {
      case 'online':
        return 'text-green-400';
      case 'warning':
        return 'text-amber-400';
      case 'error':
        return 'text-red-400';
      case 'offline':
        return 'text-gray-400';
    }
  }

  // Get status background color
  static getStatusBgColor(status: ModuleStatus): string {
    switch (status) {
      case 'online':
        return 'bg-green-500/20';
      case 'warning':
        return 'bg-amber-500/20';
      case 'error':
        return 'bg-red-500/20';
      case 'offline':
        return 'bg-gray-500/20';
    }
  }

  // Get status icon
  static getStatusIcon(status: ModuleStatus): string {
    switch (status) {
      case 'online':
        return 'check-circle';
      case 'warning':
        return 'exclamation-triangle';
      case 'error':
        return 'x-circle';
      case 'offline':
        return 'minus-circle';
    }
  }
}

// =====================================================
// SEO MODULES REGISTRY
// =====================================================

export class SEOModulesRegistry {
  private static modules: Map<string, SEOModuleInfo> = new Map();

  // Register a module
  static registerModule(module: SEOModuleInfo): void {
    this.modules.set(module.id, module);
    this.saveToStorage();
  }

  // Get all registered modules
  static getAllModules(): SEOModuleInfo[] {
    if (this.modules.size === 0) {
      this.loadFromStorage();
    }
    return Array.from(this.modules.values());
  }

  // Get module by ID
  static getModule(id: string): SEOModuleInfo | undefined {
    return this.modules.get(id);
  }

  // Update module status
  static updateModuleStatus(id: string, status: ModuleStatus): void {
    const module = this.modules.get(id);
    if (module) {
      module.status = status;
      module.lastUpdated = new Date().toISOString();
      this.saveToStorage();
    }
  }

  // Save to localStorage
  private static saveToStorage(): void {
    try {
      const data = Array.from(this.modules.entries());
      localStorage.setItem(MODULES_STATUS_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('[SEOModulesRegistry] Error saving modules:', error);
    }
  }

  // Load from localStorage
  private static loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(MODULES_STATUS_KEY);
      if (stored) {
        const data = JSON.parse(stored) as [string, SEOModuleInfo][];
        this.modules = new Map(data);
      } else {
        // Initialize with current status
        const statuses = SEOSystemStatusMonitor.checkAllModulesStatus();
        statuses.forEach((module) => {
          this.modules.set(module.id, module);
        });
      }
    } catch (error) {
      console.error('[SEOModulesRegistry] Error loading modules:', error);
    }
  }
}

// =====================================================
// SEO COMMAND ACTIONS MANAGER
// =====================================================

export class SEOCommandActionsManager {
  // Execute a command action
  static async executeCommand(
    action: CommandActionType,
    projects: Project[],
    articles: Article[]
  ): Promise<CommandResult> {
    const startTime = Date.now();

    try {
      let result: CommandResult;

      switch (action) {
        case 'full_scan':
          result = await this.runFullSEOScan(projects, articles);
          break;
        case 'generate_report':
          result = await this.generateSEOReport(projects, articles);
          break;
        case 'health_check':
          result = await this.runHealthCheck(projects, articles);
          break;
        case 'execute_automation':
          result = await this.executeAutomation(projects, articles);
          break;
        case 'refresh_trends':
          result = await this.refreshTrendsData(projects, articles);
          break;
        case 'analyze_links':
          result = await this.analyzeInternalLinks(projects, articles);
          break;
        default:
          result = {
            success: false,
            action,
            message: 'Unknown action',
            messageAr: 'إجراء غير معروف',
            timestamp: new Date().toISOString(),
            duration: Date.now() - startTime,
          };
      }

      // Log to activity feed
      this.addToActivityFeed({
        type: 'operation',
        title: result.message,
        titleAr: result.messageAr,
        description: `Executed ${action} in ${result.duration}ms`,
        descriptionAr: `تم تنفيذ ${action} في ${result.duration}ms`,
        timestamp: result.timestamp,
        severity: result.success ? 'success' : 'critical',
        metadata: { action, duration: result.duration },
      });

      // Update command center state
      this.updateCommandCenterState(action);

      return result;
    } catch (error) {
      const errorResult: CommandResult = {
        success: false,
        action,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        messageAr: `خطأ: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime,
      };

      this.addToActivityFeed({
        type: 'operation',
        title: 'Command Failed',
        titleAr: 'فشل الأمر',
        description: errorResult.message,
        descriptionAr: errorResult.messageAr,
        timestamp: errorResult.timestamp,
        severity: 'critical',
        metadata: { action },
      });

      return errorResult;
    }
  }

  // Run Full SEO Scan
  private static async runFullSEOScan(
    projects: Project[],
    articles: Article[]
  ): Promise<CommandResult> {
    const startTime = Date.now();

    // Run all checks
    const report = generateSEOReport(projects, articles);

    const allItems = [
      ...projects.map((p) => ({
        id: p.id,
        type: 'project' as const,
        title: p.content.en.title,
        slug: p.content.en.slug || p.name,
        seo: p.content.en.seo || {},
        score: calculateSEOConfigScore(p.content.en.seo || {}),
        issues: [],
      })),
      ...articles.map((a) => ({
        id: a.id,
        type: 'article' as const,
        title: a.content.en.title,
        slug: a.content.en.slug || a.title,
        seo: a.content.en.seo || {},
        score: calculateSEOConfigScore(a.content.en.seo || {}),
        issues: [],
      })),
    ];

    const alerts = detectAllAlerts(allItems as SEOContentItem[]);
    const healthResult = SEOHealthScanner.scan(projects, articles);
    const linkAnalysis = analyzeInternalLinks(projects, articles);
    SEOTrendsEngine.takePerformanceSnapshot(projects, articles);

    return {
      success: true,
      action: 'full_scan',
      message: `Full SEO scan completed: ${report.summary.totalItems} items analyzed`,
      messageAr: `اكتمل فحص SEO الشامل: تم تحليل ${report.summary.totalItems} عنصر`,
      data: {
        report,
        alertsCount: alerts.length,
        healthScore: healthResult.healthStatus.overallScore,
        internalLinks: linkAnalysis.totalLinks,
      },
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
    };
  }

  // Generate SEO Report
  private static async generateSEOReport(
    projects: Project[],
    articles: Article[]
  ): Promise<CommandResult> {
    const startTime = Date.now();
    const report = generateSEOReport(projects, articles);

    return {
      success: true,
      action: 'generate_report',
      message: `SEO Report generated: Average score ${report.summary.avgScore}%`,
      messageAr: `تم إنشاء تقرير SEO: متوسط الدرجة ${report.summary.avgScore}%`,
      data: report,
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
    };
  }

  // Run Health Check
  private static async runHealthCheck(
    projects: Project[],
    articles: Article[]
  ): Promise<CommandResult> {
    const startTime = Date.now();
    const healthResult = SEOHealthScanner.scan(projects, articles);

    return {
      success: true,
      action: 'health_check',
      message: `Health check completed: Score ${healthResult.healthStatus.overallScore}%`,
      messageAr: `اكتمل فحص الصحة: الدرجة ${healthResult.healthStatus.overallScore}%`,
      data: healthResult,
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
    };
  }

  // Execute Automation Rules
  private static async executeAutomation(
    projects: Project[],
    articles: Article[]
  ): Promise<CommandResult> {
    const startTime = Date.now();

    const allItems = [
      ...projects.map((p) => ({
        id: p.id,
        type: 'project' as const,
        title: p.content.en.title,
        slug: p.content.en.slug || p.name,
        seo: p.content.en.seo || {},
        score: calculateSEOConfigScore(p.content.en.seo || {}),
        issues: [],
      })),
      ...articles.map((a) => ({
        id: a.id,
        type: 'article' as const,
        title: a.content.en.title,
        slug: a.content.en.slug || a.title,
        seo: a.content.en.seo || {},
        score: calculateSEOConfigScore(a.content.en.seo || {}),
        issues: [],
      })),
    ];

    const result = executeAutomationRules(allItems as SEOContentItem[], 'on_demand');

    return {
      success: result.success,
      action: 'execute_automation',
      message: `Automation executed: ${result.itemsFixed} fixed, ${result.itemsFailed} failed`,
      messageAr: `تم تنفيذ الأتمتة: تم إصلاح ${result.itemsFixed}، فشل ${result.itemsFailed}`,
      data: result,
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
    };
  }

  // Refresh Trends Data
  private static async refreshTrendsData(
    projects: Project[],
    articles: Article[]
  ): Promise<CommandResult> {
    const startTime = Date.now();
    const snapshot = SEOTrendsEngine.takePerformanceSnapshot(projects, articles);

    return {
      success: true,
      action: 'refresh_trends',
      message: `Trends updated: New snapshot with score ${snapshot.summary.avgScore}%`,
      messageAr: `تم تحديث الاتجاهات: لقطة جديدة بدرجة ${snapshot.summary.avgScore}%`,
      data: snapshot,
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
    };
  }

  // Analyze Internal Links
  private static async analyzeInternalLinks(
    projects: Project[],
    articles: Article[]
  ): Promise<CommandResult> {
    const startTime = Date.now();
    const analysis = analyzeInternalLinks(projects, articles);

    return {
      success: true,
      action: 'analyze_links',
      message: `Link analysis completed: ${analysis.totalLinks} links found`,
      messageAr: `اكتمل تحليل الروابط: تم العثور على ${analysis.totalLinks} رابط`,
      data: analysis,
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
    };
  }

  // Add entry to activity feed
  private static addToActivityFeed(entry: Omit<ActivityFeedEntry, 'id'>): void {
    try {
      const feed = this.getActivityFeed();
      const fullEntry: ActivityFeedEntry = {
        ...entry,
        id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      feed.unshift(fullEntry);

      // Keep only last 100 entries
      const trimmed = feed.slice(0, 100);
      localStorage.setItem(ACTIVITY_FEED_KEY, JSON.stringify(trimmed));
    } catch (error) {
      console.error('[SEOCommandActionsManager] Error adding to activity feed:', error);
    }
  }

  // Get activity feed
  static getActivityFeed(): ActivityFeedEntry[] {
    try {
      const stored = localStorage.getItem(ACTIVITY_FEED_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Update command center state
  private static updateCommandCenterState(action: CommandActionType): void {
    try {
      const state = this.getCommandCenterState();
      const now = new Date().toISOString();

      switch (action) {
        case 'full_scan':
          state.lastFullScan = now;
          break;
        case 'generate_report':
          state.lastReport = now;
          break;
        case 'health_check':
          state.lastHealthCheck = now;
          break;
        case 'execute_automation':
          state.lastAutomationRun = now;
          break;
        case 'refresh_trends':
          state.lastTrendsUpdate = now;
          break;
        case 'analyze_links':
          state.lastLinkAnalysis = now;
          break;
      }

      localStorage.setItem(COMMAND_CENTER_STATE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('[SEOCommandActionsManager] Error updating state:', error);
    }
  }

  // Get command center state
  static getCommandCenterState(): CommandCenterState {
    try {
      const stored = localStorage.getItem(COMMAND_CENTER_STATE_KEY);
      return stored
        ? JSON.parse(stored)
        : {
            lastFullScan: null,
            lastReport: null,
            lastHealthCheck: null,
            lastAutomationRun: null,
            lastTrendsUpdate: null,
            lastLinkAnalysis: null,
          };
    } catch {
      return {
        lastFullScan: null,
        lastReport: null,
        lastHealthCheck: null,
        lastAutomationRun: null,
        lastTrendsUpdate: null,
        lastLinkAnalysis: null,
      };
    }
  }
}

// =====================================================
// LOCAL STORAGE PERSISTENCE
// =====================================================

export class SEOCommandCenterPersistence {
  // Save command center state
  static saveState(state: CommandCenterState): void {
    try {
      localStorage.setItem(COMMAND_CENTER_STATE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('[SEOCommandCenterPersistence] Error saving state:', error);
    }
  }

  // Load command center state
  static loadState(): CommandCenterState {
    try {
      const stored = localStorage.getItem(COMMAND_CENTER_STATE_KEY);
      return stored ? JSON.parse(stored) : SEOCommandActionsManager.getCommandCenterState();
    } catch {
      return SEOCommandActionsManager.getCommandCenterState();
    }
  }

  // Get activity feed
  static getActivityFeed(): ActivityFeedEntry[] {
    return SEOCommandActionsManager.getActivityFeed();
  }

  // Clear all data
  static clearAll(): void {
    localStorage.removeItem(COMMAND_CENTER_STATE_KEY);
    localStorage.removeItem(ACTIVITY_FEED_KEY);
    localStorage.removeItem(MODULES_STATUS_KEY);
  }
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

// Format timestamp for display
export const formatTimestamp = (timestamp: string, language: 'en' | 'ar' = 'en'): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (language === 'ar') {
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 7) return `منذ ${days} يوم`;
    return date.toLocaleDateString('ar-SA');
  }

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US');
};

// Get activity severity color
export const getActivitySeverityColor = (severity: ActivityFeedEntry['severity']): string => {
  switch (severity) {
    case 'success':
      return 'text-green-400';
    case 'warning':
      return 'text-amber-400';
    case 'critical':
      return 'text-red-400';
    default:
      return 'text-blue-400';
  }
};

// Get activity severity icon
export const getActivitySeverityIcon = (severity: ActivityFeedEntry['severity']): string => {
  switch (severity) {
    case 'success':
      return 'check-circle';
    case 'warning':
      return 'exclamation-triangle';
    case 'critical':
      return 'x-circle';
    default:
      return 'information-circle';
  }
};

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
  // Dashboard
  SEODashboardEngine,

  // Metrics
  SEOMetricsAggregator,

  // Status Monitor
  SEOSystemStatusMonitor,

  // Modules Registry
  SEOModulesRegistry,

  // Command Actions
  SEOCommandActionsManager,

  // Persistence
  SEOCommandCenterPersistence,

  // Utilities
  formatTimestamp,
  getActivitySeverityColor,
  getActivitySeverityIcon,
};
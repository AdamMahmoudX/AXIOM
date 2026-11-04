// =====================================================
// SEO HEALTH MONITOR - AXIOMX ADMIN SYSTEM
// Phase 4F-F7: SEO Health Monitoring
// Provides comprehensive SEO health scanning, scoring, and issue detection
// =====================================================

import { Project } from '../types/project';
import { Article } from '../types/project';

// =====================================================
// TYPES & INTERFACES
// =====================================================

export interface SEOHealthStatus {
  overallScore: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  criticalIssuesCount: number;
  warningsCount: number;
  healthyPagesCount: number;
  totalPagesScanned: number;
  lastScanned: string;
  trend: 'up' | 'down' | 'stable';
}

export interface SEOHealthIssue {
  id: string;
  type: 'missing_title' | 'missing_description' | 'missing_keywords' | 'missing_og' | 'broken_links' | 'low_score';
  severity: 'critical' | 'warning';
  count: number;
  affectedPages: SEOHealthPage[];
}

export interface SEOHealthPage {
  id: string;
  title: string;
  type: 'project' | 'article';
  score: number;
  issues: string[];
  url?: string;
}

export interface HealthScanResult {
  healthStatus: SEOHealthStatus;
  issues: SEOHealthIssue[];
  worstPages: SEOHealthPage[];
  bestPages: SEOHealthPage[];
}

// =====================================================
// STORAGE KEYS
// =====================================================

const HEALTH_STORAGE_KEY = 'axiomx_seo_health';
const HEALTH_HISTORY_KEY = 'axiomx_seo_health_history';

// =====================================================
// HEALTH SCORE CALCULATOR
// =====================================================

export class HealthScoreCalculator {
  // Calculate SEO score for a single page
  static calculatePageScore(
    seo: { title?: string; description?: string; ogTitle?: string; ogDescription?: string; focusKeyword?: string },
    blocks: any[] = []
  ): number {
    let score = 0;

    // Title (30 points)
    if (seo.title && seo.title.length >= 30 && seo.title.length <= 60) {
      score += 30;
    } else if (seo.title && seo.title.length > 0) {
      score += 15;
    }

    // Meta description (30 points)
    if (seo.description && seo.description.length >= 120 && seo.description.length <= 160) {
      score += 30;
    } else if (seo.description && seo.description.length > 0) {
      score += 15;
    }

    // OpenGraph data (15 points)
    if (seo.ogTitle && seo.ogDescription) {
      score += 15;
    } else if (seo.ogTitle || seo.ogDescription) {
      score += 7;
    }

    // Focus keyword (15 points)
    if (seo.focusKeyword && seo.focusKeyword.length > 0) {
      score += 15;
    }

    // Content blocks (10 points bonus)
    if (blocks.length >= 3) {
      score += 10;
    } else if (blocks.length > 0) {
      score += 5;
    }

    return Math.min(score, 100);
  }

  // Calculate overall health score from pages
  static calculateOverallScore(pages: { score: number }[]): number {
    if (pages.length === 0) return 0;
    const totalScore = pages.reduce((sum, page) => sum + page.score, 0);
    return Math.round(totalScore / pages.length);
  }

  // Get health status label
  static getStatus(score: number): SEOHealthStatus['status'] {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
  }

  // Get score color class
  static getScoreColorClass(score: number): string {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-red-400';
  }

  // Get score background color class
  static getScoreBgColorClass(score: number): string {
    if (score >= 80) return 'bg-green-500/20';
    if (score >= 60) return 'bg-blue-500/20';
    if (score >= 40) return 'bg-amber-500/20';
    return 'bg-red-500/20';
  }

  // Get score label
  static getScoreLabel(score: number, language: 'en' | 'ar' = 'en'): string {
    if (score >= 80) return language === 'ar' ? 'ممتاز' : 'Excellent';
    if (score >= 60) return language === 'ar' ? 'جيد' : 'Good';
    if (score >= 40) return language === 'ar' ? 'مقبول' : 'Fair';
    return language === 'ar' ? 'يحتاج تحسين' : 'Needs Improvement';
  }
}

// =====================================================
// SEO HEALTH SCANNER
// =====================================================

export class SEOHealthScanner {
  // Scan all content and generate health report
  static scan(projects: Project[], articles: Article[]): HealthScanResult {
    // Collect all pages
    const allPages: SEOHealthPage[] = [];

    // Process projects
    projects.forEach((project) => {
      const content = project.content.en;
      const score = HealthScoreCalculator.calculatePageScore(
        content.seo,
        content.blocks
      );

      const issues = this.detectPageIssues(content.seo, content.blocks);

      allPages.push({
        id: project.id,
        title: content.title || project.name,
        type: 'project',
        score,
        issues,
        url: `/projects/${content.slug}`,
      });
    });

    // Process articles
    articles.forEach((article) => {
      const content = article.content.en;
      const score = HealthScoreCalculator.calculatePageScore(
        content.seo,
        content.blocks
      );

      const issues = this.detectPageIssues(content.seo, content.blocks);

      allPages.push({
        id: article.id,
        title: content.title || article.title,
        type: 'article',
        score,
        issues,
        url: `/articles/${content.slug}`,
      });
    });

    // Detect issues across all pages
    const issues = this.detectAllIssues(allPages);

    // Sort pages by score
    const sortedPages = [...allPages].sort((a, b) => a.score - b.score);

    // Calculate health status
    const overallScore = HealthScoreCalculator.calculateOverallScore(allPages);
    const status = HealthScoreCalculator.getStatus(overallScore);

    // Count issues
    const criticalIssuesCount = issues
      .filter((i) => i.severity === 'critical')
      .reduce((sum, i) => sum + i.count, 0);

    const warningsCount = issues
      .filter((i) => i.severity === 'warning')
      .reduce((sum, i) => sum + i.count, 0);

    const healthyPagesCount = allPages.filter((p) => p.score >= 60).length;

    // Determine trend by comparing with stored history
    const trend = this.calculateTrend(overallScore);

    const healthStatus: SEOHealthStatus = {
      overallScore,
      status,
      criticalIssuesCount,
      warningsCount,
      healthyPagesCount,
      totalPagesScanned: allPages.length,
      lastScanned: new Date().toISOString(),
      trend,
    };

    return {
      healthStatus,
      issues,
      worstPages: sortedPages.slice(0, 10),
      bestPages: sortedPages.reverse().slice(0, 10),
    };
  }

  // Detect issues for a single page
  private static detectPageIssues(
    seo: { title?: string; description?: string; ogTitle?: string; ogDescription?: string; focusKeyword?: string },
    blocks: any[] = []
  ): string[] {
    const issues: string[] = [];

    if (!seo.title || seo.title.trim() === '') {
      issues.push('missing_title');
    }

    if (!seo.description || seo.description.trim() === '') {
      issues.push('missing_description');
    }

    if (!seo.focusKeyword || seo.focusKeyword.trim() === '') {
      issues.push('missing_keywords');
    }

    if (!seo.ogTitle || !seo.ogDescription) {
      issues.push('missing_og');
    }

    if (blocks.length < 3) {
      issues.push('low_content');
    }

    return issues;
  }

  // Detect all issues across pages
  private static detectAllIssues(pages: SEOHealthPage[]): SEOHealthIssue[] {
    const issues: SEOHealthIssue[] = [];

    // Missing titles
    const missingTitles = pages.filter((p) => p.issues.includes('missing_title'));
    if (missingTitles.length > 0) {
      issues.push({
        id: 'missing_title',
        type: 'missing_title',
        severity: 'critical',
        count: missingTitles.length,
        affectedPages: missingTitles,
      });
    }

    // Missing descriptions
    const missingDescriptions = pages.filter((p) => p.issues.includes('missing_description'));
    if (missingDescriptions.length > 0) {
      issues.push({
        id: 'missing_description',
        type: 'missing_description',
        severity: 'critical',
        count: missingDescriptions.length,
        affectedPages: missingDescriptions,
      });
    }

    // Missing keywords
    const missingKeywords = pages.filter((p) => p.issues.includes('missing_keywords'));
    if (missingKeywords.length > 0) {
      issues.push({
        id: 'missing_keywords',
        type: 'missing_keywords',
        severity: 'warning',
        count: missingKeywords.length,
        affectedPages: missingKeywords,
      });
    }

    // Missing OpenGraph data
    const missingOG = pages.filter((p) => p.issues.includes('missing_og'));
    if (missingOG.length > 0) {
      issues.push({
        id: 'missing_og',
        type: 'missing_og',
        severity: 'warning',
        count: missingOG.length,
        affectedPages: missingOG,
      });
    }

    // Low SEO score content
    const lowScore = pages.filter((p) => p.score < 40);
    if (lowScore.length > 0) {
      issues.push({
        id: 'low_score',
        type: 'low_score',
        severity: 'critical',
        count: lowScore.length,
        affectedPages: lowScore,
      });
    }

    return issues;
  }

  // Calculate trend based on historical data
  private static calculateTrend(currentScore: number): 'up' | 'down' | 'stable' {
    try {
      const history = this.getHistory();
      if (history.length < 2) return 'stable';

      const previousScore = history[history.length - 2]?.score || currentScore;
      const difference = currentScore - previousScore;

      if (difference > 5) return 'up';
      if (difference < -5) return 'down';
      return 'stable';
    } catch {
      return 'stable';
    }
  }

  // Get health history
  private static getHistory(): { score: number; timestamp: string }[] {
    try {
      const stored = localStorage.getItem(HEALTH_HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}

// =====================================================
// CRITICAL ISSUES DETECTOR
// =====================================================

export class CriticalIssuesDetector {
  // Get critical issues for display
  static getCriticalIssues(issues: SEOHealthIssue[]): SEOHealthIssue[] {
    return issues.filter((issue) => issue.severity === 'critical');
  }

  // Get warnings for display
  static getWarnings(issues: SEOHealthIssue[]): SEOHealthIssue[] {
    return issues.filter((issue) => issue.severity === 'warning');
  }

  // Calculate criticality score (0-100)
  static calculateCriticalityScore(issues: SEOHealthIssue[]): number {
    const critical = issues.filter((i) => i.severity === 'critical');
    const warnings = issues.filter((i) => i.severity === 'warning');

    const criticalCount = critical.reduce((sum, i) => sum + i.count, 0);
    const warningCount = warnings.reduce((sum, i) => sum + i.count, 0);

    // Penalize heavily for critical issues
    const criticalPenalty = criticalCount * 10;
    const warningPenalty = warningCount * 3;

    return Math.max(0, 100 - criticalPenalty - warningPenalty);
  }

  // Get issue type label
  static getIssueTypeLabel(type: SEOHealthIssue['type'], language: 'en' | 'ar' = 'en'): string {
    const labels: Record<SEOHealthIssue['type'], { en: string; ar: string }> = {
      missing_title: { en: 'Missing Titles', ar: 'عناوين مفقودة' },
      missing_description: { en: 'Missing Descriptions', ar: 'أوصاف مفقودة' },
      missing_keywords: { en: 'Missing Focus Keywords', ar: 'كلمات مفتاحية رئيسية مفقودة' },
      missing_og: { en: 'Missing OpenGraph Data', ar: 'بيانات OpenGraph مفقودة' },
      broken_links: { en: 'Broken Internal Links', ar: 'روابط داخلية معطلة' },
      low_score: { en: 'Low SEO Score Content', ar: 'محتوى بدرجة SEO منخفضة' },
    };

    return labels[type]?.[language] || type;
  }

  // Get issue icon
  static getIssueIcon(type: SEOHealthIssue['type']): string {
    const icons: Record<SEOHealthIssue['type'], string> = {
      missing_title: 'title',
      missing_description: 'description',
      missing_keywords: 'keyword',
      missing_og: 'og',
      broken_links: 'link',
      low_score: 'score',
    };

    return icons[type] || 'warning';
  }

  // Sort issues by severity and count
  static sortIssuesBySeverity(issues: SEOHealthIssue[]): SEOHealthIssue[] {
    return [...issues].sort((a, b) => {
      // First sort by severity (critical first)
      if (a.severity !== b.severity) {
        return a.severity === 'critical' ? -1 : 1;
      }
      // Then by count (highest first)
      return b.count - a.count;
    });
  }
}

// =====================================================
// WARNING DETECTOR
// =====================================================

export class WarningDetector {
  // Check for potential warning-level issues
  static detectWarnings(pages: SEOHealthPage[]): SEOHealthIssue[] {
    const warnings: SEOHealthIssue[] = [];

    // Check for pages with incomplete OpenGraph
    const incompleteOG = pages.filter(
      (p) => p.issues.includes('missing_og')
    );
    if (incompleteOG.length > 0) {
      warnings.push({
        id: 'warning_og',
        type: 'missing_og',
        severity: 'warning',
        count: incompleteOG.length,
        affectedPages: incompleteOG,
      });
    }

    // Check for pages missing keywords
    const missingKeywords = pages.filter(
      (p) => p.issues.includes('missing_keywords')
    );
    if (missingKeywords.length > 0) {
      warnings.push({
        id: 'warning_keywords',
        type: 'missing_keywords',
        severity: 'warning',
        count: missingKeywords.length,
        affectedPages: missingKeywords,
      });
    }

    // Check for pages with low content
    const lowContent = pages.filter((p) => p.issues.includes('low_content'));
    if (lowContent.length > 0) {
      warnings.push({
        id: 'warning_content',
        type: 'low_score',
        severity: 'warning',
        count: lowContent.length,
        affectedPages: lowContent,
      });
    }

    return warnings;
  }

  // Get warning severity level
  static getWarningSeverity(count: number): 'low' | 'medium' | 'high' {
    if (count <= 2) return 'low';
    if (count <= 5) return 'medium';
    return 'high';
  }

  // Get warning color
  static getWarningColor(severity: 'low' | 'medium' | 'high'): string {
    switch (severity) {
      case 'low':
        return 'text-blue-400';
      case 'medium':
        return 'text-amber-400';
      case 'high':
        return 'text-orange-400';
    }
  }
}

// =====================================================
// LOCAL STORAGE PERSISTENCE
// =====================================================

export class SEOHealthPersistence {
  // Save current health status
  static saveHealthStatus(status: SEOHealthStatus): void {
    try {
      localStorage.setItem(HEALTH_STORAGE_KEY, JSON.stringify(status));
      this.addToHistory(status.overallScore);
    } catch (error) {
      console.error('[SEOHealthMonitor] Error saving health status:', error);
    }
  }

  // Load last saved health status
  static loadHealthStatus(): SEOHealthStatus | null {
    try {
      const stored = localStorage.getItem(HEALTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('[SEOHealthMonitor] Error loading health status:', error);
      return null;
    }
  }

  // Add score to history
  private static addToHistory(score: number): void {
    try {
      const history = this.getHistory();
      history.push({
        score,
        timestamp: new Date().toISOString(),
      });

      // Keep only last 30 entries
      const trimmedHistory = history.slice(-30);
      localStorage.setItem(HEALTH_HISTORY_KEY, JSON.stringify(trimmedHistory));
    } catch (error) {
      console.error('[SEOHealthMonitor] Error adding to history:', error);
    }
  }

  // Get history
  static getHistory(): { score: number; timestamp: string }[] {
    try {
      const stored = localStorage.getItem(HEALTH_HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Clear all health data
  static clearAll(): void {
    localStorage.removeItem(HEALTH_STORAGE_KEY);
    localStorage.removeItem(HEALTH_HISTORY_KEY);
  }

  // Get last scan time
  static getLastScanTime(): string | null {
    const status = this.loadHealthStatus();
    return status?.lastScanned || null;
  }

  // Check if scan is stale (older than 1 hour)
  static isScanStale(): boolean {
    const lastScan = this.getLastScanTime();
    if (!lastScan) return true;

    const lastScanDate = new Date(lastScan);
    const now = new Date();
    const diffHours = (now.getTime() - lastScanDate.getTime()) / (1000 * 60 * 60);

    return diffHours > 1;
  }
}

// =====================================================
// MAIN SEO HEALTH MONITOR CLASS
// =====================================================

export class SEOHealthMonitor {
  // Perform full health scan
  static scan(projects: Project[], articles: Article[]): HealthScanResult {
    const result = SEOHealthScanner.scan(projects, articles);

    // Persist the health status
    SEOHealthPersistence.saveHealthStatus(result.healthStatus);

    return result;
  }

  // Get cached health status (if not stale)
  static getCachedStatus(): SEOHealthStatus | null {
    if (SEOHealthPersistence.isScanStale()) {
      return null;
    }
    return SEOHealthPersistence.loadHealthStatus();
  }

  // Get health history for trend analysis
  static getHealthHistory(): { score: number; timestamp: string }[] {
    return SEOHealthPersistence.getHistory();
  }

  // Get quick health summary
  static getQuickSummary(projects: Project[], articles: Article[]): {
    score: number;
    status: SEOHealthStatus['status'];
    criticalCount: number;
    warningCount: number;
  } {
    const result = this.scan(projects, articles);
    return {
      score: result.healthStatus.overallScore,
      status: result.healthStatus.status,
      criticalCount: result.healthStatus.criticalIssuesCount,
      warningCount: result.healthStatus.warningsCount,
    };
  }
}

// Export types for external use
export type { SEOHealthStatus, SEOHealthIssue, SEOHealthPage, HealthScanResult };
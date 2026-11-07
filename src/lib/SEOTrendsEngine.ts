// =====================================================
// SEO TRENDS ENGINE - AXIOMX ADMIN SYSTEM
// Phase 4F-F5: SEO Performance Trends
// Tracks SEO Score changes over time and generates trend reports
// =====================================================

// Types
import type { Article, Project } from '../types/project';

export interface SEOScoreSnapshot {
  id: string;
  timestamp: string;
  date: string;
  type: 'project' | 'article';
  contentId: string;
  contentTitle: string;
  score: number;
  issues: {
    type: string;
    count: number;
  }[];
  metadata: {
    hasTitle: boolean;
    hasDescription: boolean;
    hasFocusKeyword: boolean;
    hasOpenGraph: boolean;
  };
}

export interface SEOTrendDataPoint {
  date: string;
  timestamp: string;
  avgScore: number;
  totalItems: number;
  configuredItems: number;
  scoreDistribution: {
    excellent: number;
    good: number;
    fair: number;
    poor: number;
  };
  issuesCount: number;
  improvementsCount: number;
  regressionsCount: number;
}

export interface SEOPerformanceSnapshot {
  id: string;
  timestamp: string;
  date: string;
  summary: {
    totalProjects: number;
    totalArticles: number;
    avgScore: number;
    configuredProjects: number;
    configuredArticles: number;
    coverage: number;
  };
  scoreDistribution: {
    excellent: number;
    good: number;
    fair: number;
    poor: number;
  };
  topContent: {
    id: string;
    title: string;
    type: string;
    score: number;
  }[];
  worstContent: {
    id: string;
    title: string;
    type: string;
    score: number;
  }[];
  issuesBreakdown: {
    type: string;
    count: number;
  }[];
  changes: {
    improvements: number;
    regressions: number;
    newContent: number;
    deletedContent: number;
  };
}

export interface TrendReport {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  generatedAt: string;
  period: {
    start: string;
    end: string;
  };
  summary: {
    avgScoreChange: number;
    totalImprovements: number;
    totalRegressions: number;
    newIssues: number;
    resolvedIssues: number;
  };
  trendData: SEOTrendDataPoint[];
  scoreHistory: {
    date: string;
    score: number;
  }[];
  topImprovers: {
    id: string;
    title: string;
    type: string;
    previousScore: number;
    currentScore: number;
    change: number;
  }[];
  topDecliners: {
    id: string;
    title: string;
    type: string;
    previousScore: number;
    currentScore: number;
    change: number;
  }[];
  contentAdded: {
    id: string;
    title: string;
    type: string;
    score: number;
  }[];
  recommendations: string[];
}

// Storage keys
const TRENDS_STORAGE_KEY = 'axiomx_seo_trends';
const SNAPSHOTS_STORAGE_KEY = 'axiomx_seo_snapshots';
const HISTORY_STORAGE_KEY = 'axiomx_seo_score_history';

// Helper functions
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const getScoreCategory = (score: number): 'excellent' | 'good' | 'fair' | 'poor' => {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
};

// Calculate score from SEO metadata
export const calculateSEOScore = (seo: {
  title?: string;
  description?: string;
  focusKeyword?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
  };
}): { score: number; metadata: SEOScoreSnapshot['metadata'] } => {
  let score = 0;
  const metadata: SEOScoreSnapshot['metadata'] = {
    hasTitle: false,
    hasDescription: false,
    hasFocusKeyword: false,
    hasOpenGraph: false,
  };

  if (seo.title && seo.title.length > 0) {
    score += 25;
    metadata.hasTitle = true;
  }

  if (seo.description && seo.description.length > 0) {
    score += 25;
    metadata.hasDescription = true;
  }

  if (seo.focusKeyword && seo.focusKeyword.length > 0) {
    score += 25;
    metadata.hasFocusKeyword = true;
  }

  if (seo.openGraph?.title && seo.openGraph?.description && seo.openGraph?.image) {
    score += 25;
    metadata.hasOpenGraph = true;
  }

  return { score, metadata };
};

// =====================================================
// TRENDS STORAGE
// =====================================================

export const SEOTrendsEngine = {
  // Save trends data to localStorage
  saveTrends: (trends: SEOTrendDataPoint[]): void => {
    try {
      localStorage.setItem(TRENDS_STORAGE_KEY, JSON.stringify(trends));
    } catch (error) {
      console.error('[SEOTredsEngine] Error saving trends:', error);
    }
  },

  // Load trends data from localStorage
  loadTrends: (): SEOTrendDataPoint[] => {
    try {
      const stored = localStorage.getItem(TRENDS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('[SEOTredsEngine] Error loading trends:', error);
    }
    return [];
  },

  // Add a new trend data point
  addTrendDataPoint: (dataPoint: SEOTrendDataPoint): void => {
    const trends = SEOTrendsEngine.loadTrends();
    const existingIndex = trends.findIndex(t => t.date === dataPoint.date);

    if (existingIndex >= 0) {
      trends[existingIndex] = dataPoint;
    } else {
      trends.push(dataPoint);
    }

    // Keep only last 365 days
    const sortedTrends = trends.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const last365 = sortedTrends.slice(-365);

    SEOTrendsEngine.saveTrends(last365);
  },

  // Get trends for a specific period
  getTrendsForPeriod: (days: number): SEOTrendDataPoint[] => {
    const trends = SEOTrendsEngine.loadTrends();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return trends.filter(t => new Date(t.date) >= cutoffDate);
  },

  // =====================================================
  // SNAPSHOTS STORAGE
  // =====================================================

  // Save performance snapshot
  saveSnapshot: (snapshot: SEOPerformanceSnapshot): void => {
    try {
      const snapshots = SEOTrendsEngine.loadSnapshots();
      snapshots.push(snapshot);

      // Keep only last 365 snapshots (about 1 year with daily snapshots)
      const last365 = snapshots.slice(-365);
      localStorage.setItem(SNAPSHOTS_STORAGE_KEY, JSON.stringify(last365));
    } catch (error) {
      console.error('[SEOTredsEngine] Error saving snapshot:', error);
    }
  },

  // Load all snapshots
  loadSnapshots: (): SEOPerformanceSnapshot[] => {
    try {
      const stored = localStorage.getItem(SNAPSHOTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('[SEOTredsEngine] Error loading snapshots:', error);
    }
    return [];
  },

  // Get latest snapshot
  getLatestSnapshot: (): SEOPerformanceSnapshot | null => {
    const snapshots = SEOTrendsEngine.loadSnapshots();
    return snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
  },

  // =====================================================
  // SCORE HISTORY STORAGE
  // =====================================================

  // Save individual score history
  saveScoreHistory: (history: SEOScoreSnapshot[]): void => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('[SEOTredsEngine] Error saving score history:', error);
    }
  },

  // Load score history
  loadScoreHistory: (): SEOScoreSnapshot[] => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('[SEOTredsEngine] Error loading score history:', error);
    }
    return [];
  },

  // Record a score for a specific content item
  recordScore: (
    type: 'project' | 'article',
    contentId: string,
    contentTitle: string,
    seo: {
      title?: string;
      description?: string;
      focusKeyword?: string;
      openGraph?: {
        title?: string;
        description?: string;
        image?: string;
      };
    }
  ): SEOScoreSnapshot => {
    const { score, metadata } = calculateSEOScore(seo);
    const now = new Date();

    const snapshot: SEOScoreSnapshot = {
      id: generateId(),
      timestamp: now.toISOString(),
      date: formatDate(now),
      type,
      contentId,
      contentTitle,
      score,
      issues: [
        { type: 'missing_title', count: metadata.hasTitle ? 0 : 1 },
        { type: 'missing_description', count: metadata.hasDescription ? 0 : 1 },
        { type: 'missing_focus_keyword', count: metadata.hasFocusKeyword ? 0 : 1 },
        { type: 'missing_open_graph', count: metadata.hasOpenGraph ? 0 : 1 },
      ].filter(i => i.count > 0),
      metadata,
    };

    const history = SEOTrendsEngine.loadScoreHistory();
    history.push(snapshot);

    // Keep only last 365 days of history
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 365);
    const filtered = history.filter(h => new Date(h.timestamp) >= cutoffDate);

    SEOTrendsEngine.saveScoreHistory(filtered);

    return snapshot;
  },

  // Get score history for a specific content item
  getScoreHistoryForItem: (contentId: string): SEOScoreSnapshot[] => {
    const history = SEOTrendsEngine.loadScoreHistory();
    return history.filter(h => h.contentId === contentId);
  },

  // =====================================================
  // TAKE PERFORMANCE SNAPSHOT
  // =====================================================

  takePerformanceSnapshot: (
    projects: Project[],
    articles: Article[]
  ): SEOPerformanceSnapshot => {
    const now = new Date();
    const dateStr = formatDate(now);

    // Calculate scores for all content
    const projectScores = projects.map(p => ({
      id: p.id,
      title: p.content.en.title,
      type: 'project',
      ...calculateSEOScore(p.content.en.seo),
    }));

    const articleScores = articles.map(a => ({
      id: a.id,
      title: a.content.en.title,
      type: 'article',
      ...calculateSEOScore(a.content.en.seo),
    }));

    const allScores = [...projectScores, ...articleScores];

    // Calculate summary
    const totalProjects = projects.length;
    const totalArticles = articles.length;
    const scores = allScores.map(s => s.score);
    const avgScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

    const configuredProjects = projectScores.filter(s => s.metadata.hasTitle && s.metadata.hasDescription).length;
    const configuredArticles = articleScores.filter(s => s.metadata.hasTitle && s.metadata.hasDescription).length;

    // Score distribution
    const scoreDistribution = {
      excellent: allScores.filter(s => s.score >= 80).length,
      good: allScores.filter(s => s.score >= 60 && s.score < 80).length,
      fair: allScores.filter(s => s.score >= 40 && s.score < 60).length,
      poor: allScores.filter(s => s.score < 40).length,
    };

    // Top and worst content
    const sortedByScore = [...allScores].sort((a, b) => b.score - a.score);
    const topContent = sortedByScore.slice(0, 10).map(s => ({
      id: s.id,
      title: s.title,
      type: s.type,
      score: s.score,
    }));
    const worstContent = sortedByScore.slice(-10).reverse().map(s => ({
      id: s.id,
      title: s.title,
      type: s.type,
      score: s.score,
    }));

    // Issues breakdown
    const issuesMap: Record<string, number> = {};
    allScores.forEach(s => {
      if (!s.metadata.hasTitle) issuesMap.missing_title = (issuesMap.missing_title || 0) + 1;
      if (!s.metadata.hasDescription) issuesMap.missing_description = (issuesMap.missing_description || 0) + 1;
      if (!s.metadata.hasFocusKeyword) issuesMap.missing_focus_keyword = (issuesMap.missing_focus_keyword || 0) + 1;
      if (!s.metadata.hasOpenGraph) issuesMap.missing_open_graph = (issuesMap.missing_open_graph || 0) + 1;
    });

    const issuesBreakdown = Object.entries(issuesMap).map(([type, count]) => ({
      type,
      count,
    }));

    // Calculate changes from previous snapshot
    const prevSnapshot = SEOTrendsEngine.getLatestSnapshot();
    let changes = {
      improvements: 0,
      regressions: 0,
      newContent: 0,
      deletedContent: 0,
    };

    if (prevSnapshot) {
      // Count improvements and regressions
      const prevContentMap = new Map(
        [...prevSnapshot.topContent, ...prevSnapshot.worstContent].map(c => [c.id, c])
      );

      allScores.forEach(current => {
        const prev = prevContentMap.get(current.id);
        if (prev) {
          if (current.score > prev.score) {
            changes.improvements++;
          } else if (current.score < prev.score) {
            changes.regressions++;
          }
        } else {
          changes.newContent++;
        }
      });

      const currentIds = new Set(allScores.map(s => s.id));
      const prevIds = new Set([...prevSnapshot.topContent, ...prevSnapshot.worstContent].map(c => c.id));
      [...prevIds].forEach(id => {
        if (!currentIds.has(id)) {
          changes.deletedContent++;
        }
      });
    } else {
      // First snapshot
      changes.newContent = allScores.length;
    }

    const snapshot: SEOPerformanceSnapshot = {
      id: generateId(),
      timestamp: now.toISOString(),
      date: dateStr,
      summary: {
        totalProjects,
        totalArticles,
        avgScore,
        configuredProjects,
        configuredArticles,
        coverage: totalProjects + totalArticles > 0
          ? Math.round(((configuredProjects + configuredArticles) / (totalProjects + totalArticles)) * 100)
          : 0,
      },
      scoreDistribution,
      topContent,
      worstContent,
      issuesBreakdown,
      changes,
    };

    // Save snapshot
    SEOTrendsEngine.saveSnapshot(snapshot);

    // Update trend data
    const trendDataPoint: SEOTrendDataPoint = {
      date: dateStr,
      timestamp: now.toISOString(),
      avgScore,
      totalItems: totalProjects + totalArticles,
      configuredItems: configuredProjects + configuredArticles,
      scoreDistribution,
      issuesCount: issuesBreakdown.reduce((sum, i) => sum + i.count, 0),
      improvementsCount: changes.improvements,
      regressionsCount: changes.regressions,
    };

    SEOTrendsEngine.addTrendDataPoint(trendDataPoint);

    return snapshot;
  },

  // =====================================================
  // TREND REPORTS GENERATION
  // =====================================================

  generateTrendReport: (
    type: 'daily' | 'weekly' | 'monthly',
    projects: Project[],
    articles: Article[]
  ): TrendReport => {
    const now = new Date();
    const periodStart = new Date(now);
    const periodEnd = new Date(now);

    switch (type) {
      case 'daily':
        periodStart.setDate(periodStart.getDate() - 1);
        break;
      case 'weekly':
        periodStart.setDate(periodStart.getDate() - 7);
        break;
      case 'monthly':
        periodStart.setDate(periodStart.getDate() - 30);
        break;
    }

    // Get historical data for comparison
    const snapshots = SEOTrendsEngine.loadSnapshots();
    const periodSnapshots = snapshots.filter(
      s => new Date(s.date) >= periodStart && new Date(s.date) <= periodEnd
    );

    // Get trends for the period
    const trends = SEOTrendsEngine.getTrendsForPeriod(
      type === 'daily' ? 1 : type === 'weekly' ? 7 : 30
    );

    // Current scores
    const projectScores = projects.map(p => ({
      id: p.id,
      title: p.content.en.title,
      type: 'project' as const,
      ...calculateSEOScore(p.content.en.seo),
    }));

    const articleScores = articles.map(a => ({
      id: a.id,
      title: a.content.en.title,
      type: 'article' as const,
      ...calculateSEOScore(a.content.en.seo),
    }));

    const allCurrentScores = [...projectScores, ...articleScores];

    // Find previous snapshot
    const prevSnapshot = snapshots.length > 1 ? snapshots[snapshots.length - 2] : null;

    // Calculate changes
    let avgScoreChange = 0;
    const topImprovers: TrendReport['topImprovers'] = [];
    const topDecliners: TrendReport['topDecliners'] = [];
    const contentAdded: TrendReport['contentAdded'] = [];

    if (prevSnapshot) {
      const prevContentMap = new Map(
        [...prevSnapshot.topContent, ...prevSnapshot.worstContent].map(c => [c.id, c])
      );

      avgScoreChange = (allCurrentScores.reduce((sum, s) => sum + s.score, 0) / allCurrentScores.length) -
        prevSnapshot.summary.avgScore;

      allCurrentScores.forEach(current => {
        const prev = prevContentMap.get(current.id);
        if (prev) {
          const change = current.score - prev.score;
          if (change > 0) {
            topImprovers.push({
              id: current.id,
              title: current.title,
              type: current.type,
              previousScore: prev.score,
              currentScore: current.score,
              change,
            });
          } else if (change < 0) {
            topDecliners.push({
              id: current.id,
              title: current.title,
              type: current.type,
              previousScore: prev.score,
              currentScore: current.score,
              change,
            });
          }
        } else {
          contentAdded.push({
            id: current.id,
            title: current.title,
            type: current.type,
            score: current.score,
          });
        }
      });

      // Sort and limit
      topImprovers.sort((a, b) => b.change - a.change);
      topDecliners.sort((a, b) => a.change - b.change);

      topImprovers.splice(5);
      topDecliners.splice(5);
    } else {
      // First report - all content is "new"
      contentAdded.push(
        ...allCurrentScores.slice(0, 10).map(s => ({
          id: s.id,
          title: s.title,
          type: s.type,
          score: s.score,
        }))
      );
    }

    // Calculate summary stats
    const totalImprovements = topImprovers.length;
    const totalRegressions = topDecliners.length;
    const currentIssues = allCurrentScores.filter(s =>
      !s.metadata.hasTitle ||
      !s.metadata.hasDescription ||
      !s.metadata.hasFocusKeyword ||
      !s.metadata.hasOpenGraph
    ).length;
    const prevIssues = prevSnapshot
      ? prevSnapshot.issuesBreakdown.reduce((sum, i) => sum + i.count, 0)
      : currentIssues;

    // Generate recommendations
    const recommendations: string[] = [];

    if (avgScoreChange < 0) {
      recommendations.push('Focus on improving content with declining scores');
    }

    if (currentIssues > prevIssues) {
      recommendations.push('Address new SEO issues that have appeared');
    }

    const missingTitle = allCurrentScores.filter(s => !s.metadata.hasTitle).length;
    const missingDesc = allCurrentScores.filter(s => !s.metadata.hasDescription).length;
    const missingKeyword = allCurrentScores.filter(s => !s.metadata.hasFocusKeyword).length;
    const missingOG = allCurrentScores.filter(s => !s.metadata.hasOpenGraph).length;

    if (missingTitle > 0) {
      recommendations.push(`Add SEO titles to ${missingTitle} items without them`);
    }
    if (missingDesc > 0) {
      recommendations.push(`Add meta descriptions to ${missingDesc} items without them`);
    }
    if (missingKeyword > 0) {
      recommendations.push(`Add focus keywords to ${missingKeyword} items without them`);
    }
    if (missingOG > 0) {
      recommendations.push(`Add Open Graph data to ${missingOG} items without them`);
    }

    if (recommendations.length === 0) {
      recommendations.push('Continue maintaining high SEO standards across all content');
    }

    // Build score history for chart
    const scoreHistory = trends.map(t => ({
      date: t.date,
      score: t.avgScore,
    }));

    // Add current score as the latest point
    const currentAvg = allCurrentScores.length > 0
      ? Math.round(allCurrentScores.reduce((sum, s) => sum + s.score, 0) / allCurrentScores.length)
      : 0;

    if (scoreHistory.length === 0 || scoreHistory[scoreHistory.length - 1].date !== formatDate(now)) {
      scoreHistory.push({
        date: formatDate(now),
        score: currentAvg,
      });
    }

    const report: TrendReport = {
      id: generateId(),
      type,
      generatedAt: now.toISOString(),
      period: {
        start: periodStart.toISOString(),
        end: periodEnd.toISOString(),
      },
      summary: {
        avgScoreChange: Math.round(avgScoreChange),
        totalImprovements,
        totalRegressions,
        newIssues: Math.max(0, currentIssues - prevIssues),
        resolvedIssues: Math.max(0, prevIssues - currentIssues),
      },
      trendData: trends,
      scoreHistory,
      topImprovers,
      topDecliners,
      contentAdded,
      recommendations,
    };

    return report;
  },

  // =====================================================
  // DATA ACCESS HELPERS
  // =====================================================

  // Get score distribution over time
  getScoreDistributionOverTime: (days: number) => {
    const trends = SEOTrendsEngine.getTrendsForPeriod(days);
    return trends.map(t => ({
      date: t.date,
      ...t.scoreDistribution,
    }));
  },

  // Get improvement/regression trend
  getImprovementTrend: (days: number) => {
    const trends = SEOTrendsEngine.getTrendsForPeriod(days);
    return {
      improvements: trends.map(t => ({ date: t.date, count: t.improvementsCount })),
      regressions: trends.map(t => ({ date: t.date, count: t.regressionsCount })),
    };
  },

  // Get issues trend
  getIssuesTrend: (days: number) => {
    const trends = SEOTrendsEngine.getTrendsForPeriod(days);
    return trends.map(t => ({
      date: t.date,
      issuesCount: t.issuesCount,
    }));
  },

  // Clear all trend data
  clearAllData: (): void => {
    localStorage.removeItem(TRENDS_STORAGE_KEY);
    localStorage.removeItem(SNAPSHOTS_STORAGE_KEY);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  },

  // Export trend data as JSON
  exportTrendData: (): string => {
    const data = {
      trends: SEOTrendsEngine.loadTrends(),
      snapshots: SEOTrendsEngine.loadSnapshots(),
      scoreHistory: SEOTrendsEngine.loadScoreHistory(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  },

  // Import trend data from JSON
  importTrendData: (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.trends) {
        localStorage.setItem(TRENDS_STORAGE_KEY, JSON.stringify(data.trends));
      }
      if (data.snapshots) {
        localStorage.setItem(SNAPSHOTS_STORAGE_KEY, JSON.stringify(data.snapshots));
      }
      if (data.scoreHistory) {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(data.scoreHistory));
      }
      return true;
    } catch (error) {
      console.error('[SEOTredsEngine] Error importing trend data:', error);
      return false;
    }
  },
};

export default SEOTrendsEngine;
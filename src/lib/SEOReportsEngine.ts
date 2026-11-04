// =====================================================
// SEO REPORTS ENGINE - AXIOMX ADMIN SYSTEM
// Phase 4F-F2: SEO Reports Engine
// Functions for analyzing SEO performance of projects and articles
// =====================================================

// Types
export interface SEOContentItem {
  id: string;
  type: 'project' | 'article';
  title: string;
  titleAr?: string;
  slug: string;
  seo: {
    title?: string;
    description?: string;
    focusKeyword?: string;
    openGraph?: {
      title?: string;
      description?: string;
      image?: string;
    };
  };
  score: number;
  issues: SEOIssue[];
}

export interface SEOIssue {
  type: 'missing_title' | 'missing_description' | 'missing_focus_keyword' | 'missing_open_graph';
  count: number;
  affectedItems: string[];
}

export interface SEOReportSummary {
  totalItems: number;
  totalProjects: number;
  totalArticles: number;
  configuredItems: number;
  avgScore: number;
  coverage: number;
}

export interface SEOReport {
  generatedAt: string;
  summary: SEOReportSummary;
  topContent: SEOContentItem[];
  worstContent: SEOContentItem[];
  issues: SEOIssue[];
}

// SEO Score calculation
export const calculateSEOConfigScore = (seo: {
  title?: string;
  description?: string;
  focusKeyword?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
  };
}): number => {
  let score = 0;

  // Title (25 points)
  if (seo.title && seo.title.length > 0) {
    score += 25;
  }

  // Description (25 points)
  if (seo.description && seo.description.length > 0) {
    score += 25;
  }

  // Focus Keyword (25 points)
  if (seo.focusKeyword && seo.focusKeyword.length > 0) {
    score += 25;
  }

  // Open Graph (25 points)
  if (seo.openGraph &&
      seo.openGraph.title &&
      seo.openGraph.description &&
      seo.openGraph.image) {
    score += 25;
  }

  return score;
};

// Detect SEO issues for an item
export const detectSEOIssues = (item: SEOContentItem): SEOIssue[] => {
  const issues: SEOIssue[] = [];

  // Missing SEO Title
  if (!item.seo.title || item.seo.title.length === 0) {
    issues.push({
      type: 'missing_title',
      count: 1,
      affectedItems: [item.id],
    });
  }

  // Missing Meta Description
  if (!item.seo.description || item.seo.description.length === 0) {
    issues.push({
      type: 'missing_description',
      count: 1,
      affectedItems: [item.id],
    });
  }

  // Missing Focus Keyword
  if (!item.seo.focusKeyword || item.seo.focusKeyword.length === 0) {
    issues.push({
      type: 'missing_focus_keyword',
      count: 1,
      affectedItems: [item.id],
    });
  }

  // Missing OpenGraph Data
  if (!item.seo.openGraph ||
      !item.seo.openGraph.title ||
      !item.seo.openGraph.description ||
      !item.seo.openGraph.image) {
    issues.push({
      type: 'missing_open_graph',
      count: 1,
      affectedItems: [item.id],
    });
  }

  return issues;
};

// Process projects for SEO report
export const processProjects = (projects: Array<{
  id: string;
  slug: string;
  content: {
    en: {
      title: string;
      titleAr?: string;
      seo: {
        title?: string;
        description?: string;
        focusKeyword?: string;
        openGraph?: {
          title?: string;
          description?: string;
          image?: string;
        };
      };
    };
  };
}>): SEOContentItem[] => {
  return projects.map((project) => {
    const seo = project.content.en.seo || {};
    const score = calculateSEOConfigScore(seo);

    const item: SEOContentItem = {
      id: project.id,
      type: 'project',
      title: project.content.en.title,
      titleAr: project.content.en.titleAr,
      slug: project.slug,
      seo: {
        title: seo.title,
        description: seo.description,
        focusKeyword: seo.focusKeyword,
        openGraph: seo.openGraph,
      },
      score,
      issues: [],
    };

    item.issues = detectSEOIssues(item);
    return item;
  });
};

// Process articles for SEO report
export const processArticles = (articles: Array<{
  id: string;
  slug: string;
  content: {
    en: {
      title: string;
      titleAr?: string;
      seo: {
        title?: string;
        description?: string;
        focusKeyword?: string;
        openGraph?: {
          title?: string;
          description?: string;
          image?: string;
        };
      };
    };
  };
}>): SEOContentItem[] => {
  return articles.map((article) => {
    const seo = article.content.en.seo || {};
    const score = calculateSEOConfigScore(seo);

    const item: SEOContentItem = {
      id: article.id,
      type: 'article',
      title: article.content.en.title,
      titleAr: article.content.en.titleAr,
      slug: article.slug,
      seo: {
        title: seo.title,
        description: seo.description,
        focusKeyword: seo.focusKeyword,
        openGraph: seo.openGraph,
      },
      score,
      issues: [],
    };

    item.issues = detectSEOIssues(item);
    return item;
  });
};

// Aggregate SEO issues from all items
export const aggregateSEOIssues = (items: SEOContentItem[]): SEOIssue[] => {
  const issueMap: Record<string, SEOIssue> = {
    missing_title: { type: 'missing_title', count: 0, affectedItems: [] },
    missing_description: { type: 'missing_description', count: 0, affectedItems: [] },
    missing_focus_keyword: { type: 'missing_focus_keyword', count: 0, affectedItems: [] },
    missing_open_graph: { type: 'missing_open_graph', count: 0, affectedItems: [] },
  };

  items.forEach((item) => {
    item.issues.forEach((issue) => {
      issueMap[issue.type].count += issue.count;
      issueMap[issue.type].affectedItems.push(item.id);
    });
  });

  return Object.values(issueMap).filter(issue => issue.count > 0);
};

// Generate complete SEO report
export const generateSEOReport = (
  projects: Array<{
    id: string;
    slug: string;
    content: {
      en: {
        title: string;
        titleAr?: string;
        seo: {
          title?: string;
          description?: string;
          focusKeyword?: string;
          openGraph?: {
            title?: string;
            description?: string;
            image?: string;
          };
        };
      };
    };
  }>,
  articles: Array<{
    id: string;
    slug: string;
    content: {
      en: {
        title: string;
        titleAr?: string;
        seo: {
          title?: string;
          description?: string;
          focusKeyword?: string;
          openGraph?: {
            title?: string;
            description?: string;
            image?: string;
          };
        };
      };
    };
  }>
): SEOReport => {
  // Process items
  const processedProjects = processProjects(projects);
  const processedArticles = processArticles(articles);
  const allItems = [...processedProjects, ...processedArticles];

  // Calculate summary
  const totalProjects = processedProjects.length;
  const totalArticles = processedArticles.length;
  const totalItems = totalProjects + totalArticles;

  const configuredItems = allItems.filter(item => item.score > 0).length;

  const scores = allItems.map(item => item.score);
  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;

  const coverage = totalItems > 0
    ? Math.round((configuredItems / totalItems) * 100)
    : 0;

  // Get top 10 content (sorted by score descending)
  const topContent = [...allItems]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  // Get worst 10 content (sorted by score ascending, items with issues first)
  const worstContent = [...allItems]
    .sort((a, b) => {
      // First sort by issues count (descending)
      if (b.issues.length !== a.issues.length) {
        return b.issues.length - a.issues.length;
      }
      // Then by score (ascending)
      return a.score - b.score;
    })
    .slice(0, 10);

  // Aggregate issues
  const issues = aggregateSEOIssues(allItems);

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      totalItems,
      totalProjects,
      totalArticles,
      configuredItems,
      avgScore,
      coverage,
    },
    topContent,
    worstContent,
    issues,
  };
};

// Export report as JSON
export const exportReportAsJSON = (report: SEOReport): string => {
  return JSON.stringify(report, null, 2);
};

// Download report as file
export const downloadReport = (report: SEOReport, filename: string = 'seo-report.json'): void => {
  const json = exportReportAsJSON(report);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

// Get issue label
export const getIssueLabel = (type: SEOIssue['type'], language: 'en' | 'ar' = 'en'): string => {
  const labels: Record<SEOIssue['type'], { en: string; ar: string }> = {
    missing_title: { en: 'Missing SEO Title', ar: 'العنوان SEO مفقود' },
    missing_description: { en: 'Missing Meta Description', ar: 'الوصف التعريفي مفقود' },
    missing_focus_keyword: { en: 'Missing Focus Keyword', ar: 'كلمة المفتاح الرئيسية مفقودة' },
    missing_open_graph: { en: 'Missing OpenGraph Data', ar: 'بيانات OpenGraph مفقودة' },
  };

  return labels[type][language];
};

// Get score label
export const getScoreLabel = (score: number, language: 'en' | 'ar' = 'en'): string => {
  if (score >= 80) return language === 'ar' ? 'ممتاز' : 'Excellent';
  if (score >= 60) return language === 'ar' ? 'جيد جداً' : 'Good';
  if (score >= 40) return language === 'ar' ? 'مقبول' : 'Fair';
  return language === 'ar' ? 'يحتاج تحسين' : 'Needs Improvement';
};

// Get score color class
export const getScoreColorClass = (score: number): string => {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-blue-400';
  if (score >= 40) return 'text-amber-400';
  return 'text-red-400';
};

// Get score background color class
export const getScoreBgColorClass = (score: number): string => {
  if (score >= 80) return 'bg-green-500/20';
  if (score >= 60) return 'bg-blue-500/20';
  if (score >= 40) return 'bg-amber-500/20';
  return 'bg-red-500/20';
};

export default {
  calculateSEOConfigScore,
  detectSEOIssues,
  processProjects,
  processArticles,
  aggregateSEOIssues,
  generateSEOReport,
  exportReportAsJSON,
  downloadReport,
  getIssueLabel,
  getScoreLabel,
  getScoreColorClass,
  getScoreBgColorClass,
};
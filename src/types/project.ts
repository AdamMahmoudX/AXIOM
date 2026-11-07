// =====================================================
// PROJECT TYPES - AXIOMX ADMIN SYSTEM
// Phase 4E: Multilingual Content System
//
// This file defines the core types for Projects, Articles, and Services,
// including their multilingual content structure, status types, and related utilities.
// It also includes global SEO settings and helper functions for slug generation.
//
// Key Considerations:
// - Multilingual Support: Content is structured to support English and Arabic.
// - Status Management: Various statuses for projects, articles, and services to track workflow.
// - SEO Integration: Includes types for SEO metadata and global SEO configurations.
// - Modularity: Separates concerns for different content types while maintaining consistency.
// =====================================================

import { Block } from '../components/blocks/blockTypes';
import { SITE_URL } from '../config/env';

export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';

export type ArticleStatus = 'published' | 'draft' | 'archived';

export type TranslationStatus = 'complete' | 'needs_review' | 'missing';

// =====================================================
// MULTILINGUAL CONTENT STRUCTURES
// =====================================================

// SEO fields for each language
export interface SEOContent {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  focusKeyword?: string;
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
}

// Language-specific content for projects and articles
export interface LanguageContent {
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  seo: SEOContent;
  og?: SEOContent;
  blocks: Block[];
}

// Project with full multilingual support
export interface Project {
  id: string;
  name: string;
  shortDescription: string;
  status: ProjectStatus;
  managerId: string;
  managerName: string;
  createdAt: string;
  updatedAt: string;
  category?: string;
  client?: string;
  image: string;

  // Multilingual content
  content: {
    en: LanguageContent;
    ar: LanguageContent;
  };

  // Translation status
  translationStatus: {
    en: TranslationStatus;
    ar: TranslationStatus;
  };
}

// Article with full multilingual support
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  status: ArticleStatus;
  author: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  category: string;
  tags: string[];
  readTime: number;
  image: string;
  featured: boolean;

  // Multilingual content
  content: {
    en: LanguageContent;
    ar: LanguageContent;
  };

  // Translation status
  translationStatus: {
    en: TranslationStatus;
    ar: TranslationStatus;
  };
}

// =====================================================
// REPORT TYPES
// =====================================================

// Report Item Types for Service Analytics Reports
export interface PerformanceReportItem {
  title: string;
  status: ServiceStatus;
  created: string;
  updated: string;
  featured: boolean;
}

export interface SEOReportItem {
  title: string;
  score: number;
  missing: string[];
}

export interface TranslationReportItem {
  title: string;
  enStatus: TranslationStatus;
  arStatus: TranslationStatus;
  overallStatus: 'complete' | 'partial' | 'missing';
}

export interface CategoryReportItem {
  category: string;
  count: number;
}

export interface RelationshipsReportItem {
  title: string;
  count: number;
  related: string[]; // Array of related service titles or IDs
}

// Union type for all possible report data items
export type AnyReportItem = PerformanceReportItem | SEOReportItem | TranslationReportItem | CategoryReportItem | RelationshipsReportItem;

// General structure for report data
export interface ReportData {
  title: string;
  data: AnyReportItem[]; // Use the union type for flexibility
}

// =====================================================
// TRANSLATION HELPERS
// =====================================================

export const calculateTranslationStatus = (content: LanguageContent): TranslationStatus => {
  const fields = [
    content.title,
    content.slug,
    content.excerpt,
    content.description,
    content.seo.title,
    content.seo.description,
    content.seo.ogTitle,
    content.seo.ogDescription,
    ...content.blocks.map(b => JSON.stringify(b))
  ];

  const filledCount = fields.filter(f => f && f.length > 0).length;
  const totalCount = fields.length;

  if (filledCount === totalCount) return 'complete';
  if (filledCount >= totalCount * 0.7) return 'needs_review';
  return 'missing';
};

export const getOverallTranslationStatus = (
  enStatus: TranslationStatus,
  arStatus: TranslationStatus
): 'complete' | 'partial' | 'missing' => {
  if (enStatus === 'complete' && arStatus === 'complete') return 'complete';
  if (enStatus === 'missing' && arStatus === 'missing') return 'missing';
  return 'partial';
};

// =====================================================
// STATUS LABELS & COLORS
// =====================================================

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, { en: string; ar: string }> = {
  planning: { en: 'Planning', ar: 'تخطيط' },
  in_progress: { en: 'In Progress', ar: 'قيد التنفيذ' },
  completed: { en: 'Completed', ar: 'مكتمل' },
  on_hold: { en: 'On Hold', ar: 'معلق' },
  cancelled: { en: 'Cancelled', ar: 'ملغى' },
};

export const PROJECT_CATEGORIES = [
  'Web Development',
  'Mobile App',
  'UI/UX Design',
  'AI/ML',
  'E-commerce',
  'SaaS Platform',
  'Game Development',
  'DevOps',
  'Consulting',
];

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, { bg: string; text: string; dot: string }> = {
  planning: { bg: 'bg-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-400' },
  in_progress: { bg: 'bg-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-400' },
  completed: { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-400' },
  on_hold: { bg: 'bg-orange-500/20', text: 'text-orange-400', dot: 'bg-orange-400' },
  cancelled: { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-400' },
};

// Article Status Labels
export const ARTICLE_STATUS_LABELS: Record<ArticleStatus, { en: string; ar: string }> = {
  published: { en: 'Published', ar: 'منشور' },
  draft: { en: 'Draft', ar: 'مسودة' },
  archived: { en: 'Archived', ar: 'مؤرشف' },
};

// =====================================================
// SERVICE CMS TYPES - Phase 5A
// Phase 6A-4: Service Workflow States
// =====================================================

// Extended service status with workflow states (Phase 6A-4)
export type ServiceStatus = 'draft' | 'review' | 'approved' | 'published' | 'archived';

// Service with full multilingual support
export interface Service {
  id: string;
  title: string;
  shortDescription: string;
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  category: string;
  categoryIds: string[];
  tags: string[];
  image: string;
  gallery: string[];
  featured: boolean;
  order: number;

  // Related Services - Array of service IDs
  relatedServiceIds: string[];

  // Multilingual content
  content: {
    en: LanguageContent;
    ar: LanguageContent;
  };

  // Translation status
  translationStatus: {
    en: TranslationStatus;
    ar: TranslationStatus;
  };
}

// Service Status Labels (Phase 6A-4)
export const SERVICE_STATUS_LABELS: Record<ServiceStatus, { en: string; ar: string }> = {
  draft: { en: 'Draft', ar: 'مسودة' },
  review: { en: 'Under Review', ar: 'قيد المراجعة' },
  approved: { en: 'Approved', ar: 'موافق عليه' },
  published: { en: 'Published', ar: 'منشور' },
  archived: { en: 'Archived', ar: 'مؤرشف' },
};

// Service Status Colors (Phase 6A-4)
export const SERVICE_STATUS_COLORS: Record<ServiceStatus, { bg: string; text: string; dot: string }> = {
  draft: { bg: 'bg-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-400' },
  review: { bg: 'bg-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-400' },
  approved: { bg: 'bg-purple-500/20', text: 'text-purple-400', dot: 'bg-purple-400' },
  published: { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-400' },
  archived: { bg: 'bg-gray-500/20', text: 'text-gray-400', dot: 'bg-gray-400' },
};

// PascalCase aliases for service admin pages
export const ServiceStatusLabels = SERVICE_STATUS_LABELS;
export const ServiceStatusColors = SERVICE_STATUS_COLORS;

// Service Categories
export const SERVICE_CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'AI & Machine Learning',
  'Game Development',
  'DevOps & Cloud',
  'Consulting',
  'E-commerce',
  'SaaS Platform',
  'Other',
];

// =====================================================
// SERVICE CATEGORIES TYPES - Phase 5B
// =====================================================

export type CategoryStatus = 'active' | 'inactive';

export interface ServiceCategory {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  icon: string;
  color: string;
  status: CategoryStatus;
  order: number;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  serviceCount?: number;
}

export const CATEGORY_STATUS_LABELS: Record<CategoryStatus, { en: string; ar: string }> = {
  active: { en: 'Active', ar: 'نشط' },
  inactive: { en: 'Inactive', ar: 'غير نشط' },
};

export const CATEGORY_STATUS_COLORS: Record<CategoryStatus, { bg: string; text: string; dot: string }> = {
  active: { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-400' },
  inactive: { bg: 'bg-gray-500/20', text: 'text-gray-400', dot: 'bg-gray-400' },
};

export const CATEGORY_COLORS = [
  'blue',
  'green',
  'purple',
  'orange',
  'pink',
  'cyan',
  'amber',
  'indigo',
  'red',
  'teal',
];

export const CATEGORY_ICONS = [
  'Code',
  'Smartphone',
  'Palette',
  'Brain',
  'Gamepad2',
  'Cloud',
  'ShoppingCart',
  'BarChart',
  'Shield',
  'Layers',
  'Zap',
  'Globe',
  'Server',
  'Database',
  'Lock',
  'Mail',
  'MessageSquare',
  'Users',
  'FileText',
  'Image',
];

export const createDefaultCategory = (id: string): ServiceCategory => ({
  id,
  name: '',
  nameAr: '',
  slug: '',
  description: '',
  descriptionAr: '',
  icon: 'Code',
  color: 'blue',
  status: 'active',
  order: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  serviceCount: 0,
});

// Default Service Image
export const DEFAULT_SERVICE_IMAGE = 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop';

// Create empty service content structure
export const createEmptyServiceContent = (): LanguageContent => ({
  title: '',
  slug: '',
  excerpt: '',
  description: '',
  seo: {
    title: '',
    description: '',
    ogTitle: '',
    ogDescription: '',
  },
  blocks: [] as Block[],
});

// Create default service
export const createDefaultService = (id: string): Service => ({
  id,
  title: '',
  shortDescription: '',
  status: 'draft' as ServiceStatus,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  publishedAt: undefined,
  category: '',
  categoryIds: [],
  tags: [],
  image: DEFAULT_SERVICE_IMAGE,
  gallery: [],
  featured: false,
  order: 0,
  relatedServiceIds: [],
  content: {
    en: createEmptyServiceContent(),
    ar: createEmptyServiceContent(),
  },
  translationStatus: {
    en: 'missing' as TranslationStatus,
    ar: 'missing' as TranslationStatus,
  },
});

// Article Status Colors
export const ARTICLE_STATUS_COLORS: Record<ArticleStatus, { bg: string; text: string; dot: string }> = {
  published: { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-400' },
  draft: { bg: 'bg-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-400' },
  archived: { bg: 'bg-gray-500/20', text: 'text-gray-400', dot: 'bg-gray-400' },
};

// =====================================================
// TRANSLATION STATUS COLORS
// =====================================================

export const TRANSLATION_STATUS_COLORS: Record<TranslationStatus, { bg: string; text: string; icon: string }> = {
  complete: { bg: 'bg-green-500/20', text: 'text-green-400', icon: 'check' },
  needs_review: { bg: 'bg-amber-500/20', text: 'text-amber-400', icon: 'alert' },
  missing: { bg: 'bg-red-500/20', text: 'text-red-400', icon: 'x' },
};

// =====================================================
// SLUG UTILITIES
// =====================================================

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const generateArSlug = (text: string): string => {
  // For Arabic, convert to transliterated slug
  return text
    .replace(/[^\u0600-\u06FF\s]/g, '')
    .replace(/\s+/g, '-')
    .trim();
};

// =====================================================
// GLOBAL SEO SETTINGS (Phase 4F-E)
// =====================================================

export type VerificationMethod = 'meta-tag' | 'google-verification' | 'html-file' | 'dns-record';

export interface GlobalSEOSettings {
  // Google Analytics 4
  ga4MeasurementId: string;
  ga4Enabled: boolean;

  // Search Console Verification
  searchConsoleCode: string;
  searchConsoleMethod: VerificationMethod;
  searchConsoleEnabled: boolean;

  // Default SEO values
  defaultSiteTitle: string;
  defaultSiteTitleAr: string;
  defaultMetaDescription: string;
  defaultMetaDescriptionAr: string;
  defaultKeywords: string;

  // Site URL
  siteUrl: string;
}

export const DEFAULT_GLOBAL_SEO_SETTINGS: GlobalSEOSettings = {
  ga4MeasurementId: '',
  ga4Enabled: false,
  searchConsoleCode: '',
  searchConsoleMethod: 'meta-tag',
  searchConsoleEnabled: false,
  defaultSiteTitle: 'AXIOMX - Technology Solutions',
  defaultSiteTitleAr: 'AXIOMX - حلول تقنية',
  defaultMetaDescription: 'Professional technology solutions and services.',
  defaultMetaDescriptionAr: 'حلول وخدمات تقنية احترافية.',
  defaultKeywords: 'technology, software, development, AI, web',
  siteUrl: SITE_URL,
};

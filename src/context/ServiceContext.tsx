// =====================================================
// SERVICE CONTEXT - AXIOMX ADMIN SYSTEM
// Phase 5A: Services CMS
// Phase 5B: Integration with Categories
// Phase 5E-2: Service Relationship Validation
// Phase 6A-5: Service Approval System
// Phase 6A-6: Service Audit Log System
// =====================================================

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, ReactNode } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/storageHelpers';
import { useLanguage } from './LanguageContext';
import {
  Service,
  ServiceStatus,
  TranslationStatus,
  calculateTranslationStatus,
  LanguageContent,
  createDefaultService,
  createEmptyServiceContent,
} from '../types/project';
import { Block } from '../components/blocks/blockTypes';

// =====================================================
// RELATIONSHIP VALIDATION TYPES
// =====================================================

export interface RelationshipValidationError {
  type: 'self' | 'duplicate' | 'empty';
  serviceId: string;
  serviceTitle: string;
  message: string;
}

export interface RelationshipValidationResult {
  isValid: boolean;
  errors: RelationshipValidationError[];
  errorCount: number;
}

// =====================================================
// WORKFLOW TYPES (Phase 6A-4)
// =====================================================

// Workflow transition types
export type WorkflowTransitionType =
  | 'submit_for_review'
  | 'approve'
  | 'reject'
  | 'publish'
  | 'unpublish'
  | 'archive'
  | 'restore';

// Service status history entry
export interface ServiceStatusHistoryEntry {
  id: string;
  previousStatus: string;
  newStatus: string;
  changedBy: string;
  changedAt: string;
  reason?: string;
}

// Service workflow state interface
export interface ServiceWorkflowState {
  currentStatus: string;
  history: ServiceStatusHistoryEntry[];
  lastModified: string;
}

// Workflow validation result
export interface WorkflowTransitionResult {
  allowed: boolean;
  reason?: string;
  message?: string;
}

// =====================================================
// APPROVAL TYPES (Phase 6A-5)
// =====================================================

export type ApprovalAction = 'approve' | 'reject' | 'request_changes' | 'escalate';

export interface ApprovalComment {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

export interface ApprovalEntry {
  id: string;
  serviceId: string;
  action: ApprovalAction;
  previousStatus: ServiceStatus;
  newStatus: ServiceStatus;
  approverId: string;
  approverName: string;
  approverRole: string;
  comments: ApprovalComment[];
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalRequest {
  id: string;
  serviceId: string;
  requestedBy: string;
  requestedByName: string;
  requestedAt: string;
  reason?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
}

export interface ApprovalResult {
  success: boolean;
  entry?: ApprovalEntry;
  error?: string;
}

// =====================================================
// AUDIT LOG TYPES (Phase 6A-6)
// =====================================================

export type AuditLogAction =
  | 'create'
  | 'edit'
  | 'delete'
  | 'duplicate'
  | 'status_change'
  | 'approval_action'
  | 'publish'
  | 'unpublish';

export interface AuditLogEntry {
  id: string;
  serviceId: string;
  serviceTitle: string;
  action: AuditLogAction;
  userId: string;
  userName: string;
  userRole: string;
  timestamp: string;
  details?: Record<string, string | number | boolean>;
  description?: string;
}

export interface AuditLogResult {
  success: boolean;
  entry?: AuditLogEntry;
  error?: string;
}

// Audit Log Action Labels (for UI display)
export const AuditLogActionLabels: Record<AuditLogAction, { en: string; ar: string }> = {
  create: { en: 'Service Created', ar: 'تم إنشاء الخدمة' },
  edit: { en: 'Service Edited', ar: 'تم تعديل الخدمة' },
  delete: { en: 'Service Deleted', ar: 'تم حذف الخدمة' },
  duplicate: { en: 'Service Duplicated', ar: 'تم نسخ الخدمة' },
  status_change: { en: 'Status Changed', ar: 'تم تغيير الحالة' },
  approval_action: { en: 'Approval Action', ar: 'إجراء موافقة' },
  publish: { en: 'Service Published', ar: 'تم نشر الخدمة' },
  unpublish: { en: 'Service Unpublished', ar: 'تم إلغاء نشر الخدمة' },
};

// Audit Log Action Icons (for UI display)
export const AuditLogActionIcons: Record<AuditLogAction, { icon: string; color: string; bgColor: string }> = {
  create: { icon: 'Plus', color: 'text-green-400', bgColor: 'bg-green-500/20' },
  edit: { icon: 'Edit2', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  delete: { icon: 'Trash2', color: 'text-red-400', bgColor: 'bg-red-500/20' },
  duplicate: { icon: 'Copy', color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
  status_change: { icon: 'RotateCcw', color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
  approval_action: { icon: 'CheckCircle', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
  publish: { icon: 'Eye', color: 'text-cyan-400', bgColor: 'bg-cyan-500/20' },
  unpublish: { icon: 'XCircle', color: 'text-gray-400', bgColor: 'bg-gray-500/20' },
};

// =====================================================
// SERVICE SETTINGS TYPES (Phase 6A-1 & 6A-2)
// =====================================================

// Service permissions configuration
export interface ServicePermissions {
  allowCreate: boolean;
  allowEdit: boolean;
  allowDelete: boolean;
  allowPublish: boolean;
  defaultStatus: ServiceStatus;
  requireApprovalForPublish: boolean;
}

export const DEFAULT_SERVICE_PERMISSIONS: ServicePermissions = {
  allowCreate: true,
  allowEdit: true,
  allowDelete: true,
  allowPublish: true,
  defaultStatus: 'draft',
  requireApprovalForPublish: false,
};

export interface ServiceSettings {
  enableServicesModule: boolean;
  enableServiceSEO: boolean;
  enableServiceRelationships: boolean;
  enableAnalyticsDashboard: boolean;
  // Service Permissions (Phase 6A-2)
  permissions: ServicePermissions;
}

export const DEFAULT_SERVICE_SETTINGS: ServiceSettings = {
  enableServicesModule: true,
  enableServiceSEO: true,
  enableServiceRelationships: true,
  enableAnalyticsDashboard: true,
  permissions: DEFAULT_SERVICE_PERMISSIONS,
};

const SERVICE_SETTINGS_STORAGE_KEY = 'axiomx_service_settings';

// =====================================================
// CATEGORY CONTEXT INTEGRATION
// =====================================================

// Category service count interface for integration
interface CategoryServiceCount {
  categoryId: string;
  count: number;
}

// Get category IDs from service
export const getServiceCategoryIds = (service: Service): string[] => {
  return service.categoryIds || [];
};

// Update service categories and recalculate counts
export const calculateCategoryCounts = (
  services: Service[],
  categoryIds: string[]
): CategoryServiceCount[] => {
  return categoryIds.map(categoryId => ({
    categoryId,
    count: services.filter(s =>
      s.categoryIds?.includes(categoryId) && s.status === 'published'
    ).length,
  }));
};

// Initial mock services with multilingual support
const INITIAL_SERVICES: Service[] = [
  {
    id: 'svc-001',
    title: 'Web Engineering',
    shortDescription: 'Full-stack web development with modern technologies including React, Node.js, and cloud infrastructure.',
    status: 'published',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-06-01T14:30:00Z',
    publishedAt: '2024-01-20T10:00:00Z',
    category: 'Web Development',
    tags: ['React', 'Node.js', 'TypeScript', 'AWS'],
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
    ],
    featured: true,
    order: 1,
    relatedServiceIds: ['svc-002', 'svc-006'],
    content: {
      en: {
        title: 'Web Engineering',
        slug: 'web-engineering',
        excerpt: 'Full-stack web development with modern technologies.',
        description: 'Our web engineering services provide comprehensive solutions for building scalable, high-performance web applications. We specialize in React, Node.js, TypeScript, and cloud-native architectures.',
        seo: {
          title: 'Web Engineering Services | Full-Stack Development',
          description: 'Professional web development services using React, Node.js, and modern technologies.',
          ogTitle: 'Web Engineering Services',
          ogDescription: 'Build scalable web applications with our expert team.',
        },
        blocks: [
          {
            id: 'block-1',
            type: 'title',
            content: { en: 'Web Engineering Services', ar: 'خدمات هندسة الويب' },
            level: 1,
          },
          {
            id: 'block-2',
            type: 'richText',
            content: {
              en: 'Our web engineering team delivers cutting-edge solutions using the latest technologies and best practices.',
              ar: 'يقدم فريق هندسة الويب لدينا حلولاً متطورة باستخدام أحدث التقنيات وأفضل الممارسات.',
            },
          },
        ],
      },
      ar: {
        title: 'هندسة الويب',
        slug: 'web-engineering-ar',
        excerpt: 'تطوير الويب كامل المكدس مع التقنيات الحديثة.',
        description: 'توفر خدمات هندسة الويب لدينا حلولاً شاملة لبناء تطبيقات ويب قابلة للتطوير وعالية الأداء.',
        seo: {
          title: 'خدمات هندسة الويب | تطوير Full-Stack',
          description: 'خدمات تطوير ويب احترافية باستخدام React و Node.js والتقنيات الحديثة.',
          ogTitle: 'خدمات هندسة الويب',
          ogDescription: 'ابنِ تطبيقات ويب قابلة للتطوير مع فريقنا المتخصص.',
        },
        blocks: [
          {
            id: 'block-1-ar',
            type: 'title',
            content: { en: 'Web Engineering Services', ar: 'خدمات هندسة الويب' },
            level: 1,
          },
          {
            id: 'block-2-ar',
            type: 'richText',
            content: {
              en: 'Our web engineering team...',
              ar: 'يقدم فريق هندسة الويب لدينا حلولاً متطورة باستخدام أحدث التقنيات وأفضل الممارسات.',
            },
          },
        ],
      },
    },
    translationStatus: {
      en: 'complete',
      ar: 'complete',
    },
  },
  {
    id: 'svc-002',
    title: 'Mobile Applications',
    shortDescription: 'Cross-platform mobile development with React Native and Flutter for iOS and Android.',
    status: 'published',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-05-15T16:45:00Z',
    publishedAt: '2024-02-10T09:00:00Z',
    category: 'Mobile Development',
    tags: ['React Native', 'Flutter', 'iOS', 'Android'],
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
    gallery: [],
    featured: true,
    order: 2,
    relatedServiceIds: ['svc-001', 'svc-004'],
    content: {
      en: {
        title: 'Mobile Applications',
        slug: 'mobile-applications',
        excerpt: 'Cross-platform mobile development.',
        description: 'We build native-quality mobile applications for iOS and Android using React Native and Flutter.',
        seo: {
          title: 'Mobile App Development | iOS & Android',
          description: 'Professional mobile app development services.',
          ogTitle: 'Mobile Applications',
          ogDescription: 'Build cross-platform mobile apps.',
        },
        blocks: [],
      },
      ar: {
        title: 'تطبيقات الجوال',
        slug: 'mobile-applications-ar',
        excerpt: 'تطوير تطبيقات جوال عابرة للمنصات.',
        description: 'نبني تطبيقات جوال بجودة أصلية لـ iOS و Android باستخدام React Native و Flutter.',
        seo: {
          title: 'تطوير تطبيقات الجوال | iOS و Android',
          description: 'خدمات تطوير تطبيقات الجوال الاحترافية.',
          ogTitle: 'تطبيقات الجوال',
          ogDescription: 'ابنِ تطبيقات جوال عابرة للمنصات.',
        },
        blocks: [],
      },
    },
    translationStatus: {
      en: 'complete',
      ar: 'complete',
    },
  },
  {
    id: 'svc-003',
    title: 'UI/UX Architecture',
    shortDescription: 'User experience design and interface architecture for digital products.',
    status: 'published',
    createdAt: '2024-02-15T11:00:00Z',
    updatedAt: '2024-05-20T09:15:00Z',
    publishedAt: '2024-02-20T11:00:00Z',
    category: 'UI/UX Design',
    tags: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
    gallery: [],
    featured: false,
    order: 3,
    relatedServiceIds: ['svc-001', 'svc-002'],
    content: {
      en: {
        title: 'UI/UX Architecture',
        slug: 'ui-ux-architecture',
        excerpt: 'User experience design and interface architecture.',
        description: 'We create intuitive and visually appealing user interfaces with focus on user experience.',
        seo: {
          title: 'UI/UX Design Services | User Experience',
          description: 'Professional UI/UX design services.',
          ogTitle: 'UI/UX Architecture',
          ogDescription: 'Design intuitive user interfaces.',
        },
        blocks: [],
      },
      ar: {
        title: '',
        slug: '',
        excerpt: '',
        description: '',
        seo: { title: '', description: '', ogTitle: '', ogDescription: '' },
        blocks: [],
      },
    },
    translationStatus: {
      en: 'complete',
      ar: 'missing',
    },
  },
  {
    id: 'svc-004',
    title: 'AI Systems',
    shortDescription: 'Artificial intelligence and machine learning solutions for business automation.',
    status: 'published',
    createdAt: '2024-03-01T08:30:00Z',
    updatedAt: '2024-06-01T11:20:00Z',
    publishedAt: '2024-03-05T08:30:00Z',
    category: 'AI & Machine Learning',
    tags: ['Machine Learning', 'NLP', 'Computer Vision', 'AI'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
    gallery: [],
    featured: true,
    order: 4,
    relatedServiceIds: ['svc-001', 'svc-006'],
    content: {
      en: {
        title: 'AI Systems',
        slug: 'ai-systems',
        excerpt: 'Artificial intelligence and machine learning solutions.',
        description: 'We develop AI-powered solutions including machine learning models, NLP systems, and computer vision applications.',
        seo: {
          title: 'AI Development Services | Machine Learning',
          description: 'Professional AI and ML development services.',
          ogTitle: 'AI Systems',
          ogDescription: 'Build intelligent AI solutions.',
        },
        blocks: [],
      },
      ar: {
        title: 'أنظمة الذكاء الاصطناعي',
        slug: 'ai-systems-ar',
        excerpt: 'حلول الذكاء الاصطناعي وتعلم الآلة.',
        description: 'نطور حلولاً مدعومة بالذكاء الاصطناعي تشمل نماذج تعلم الآلة وأنظمة معالجة اللغة الطبيعية.',
        seo: {
          title: 'خدمات تطوير الذكاء الاصطناعي | تعلم الآلة',
          description: 'خدمات تطوير الذكاء الاصطناعي وتعلم الآلة الاحترافية.',
          ogTitle: 'أنظمة الذكاء الاصطناعي',
          ogDescription: 'ابنِ حلول ذكاء اصطناعي ذكية.',
        },
        blocks: [],
      },
    },
    translationStatus: {
      en: 'complete',
      ar: 'complete',
    },
  },
  {
    id: 'svc-005',
    title: 'Game Development',
    shortDescription: 'Interactive gaming experiences with Unity and Unreal Engine.',
    status: 'draft',
    createdAt: '2024-03-15T14:00:00Z',
    updatedAt: '2024-06-05T10:30:00Z',
    category: 'Game Development',
    tags: ['Unity', 'Unreal Engine', 'C#', 'Game Design'],
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965c4?w=400&h=300&fit=crop',
    gallery: [],
    featured: false,
    order: 5,
    relatedServiceIds: [],
    content: {
      en: {
        title: 'Game Development',
        slug: 'game-development',
        excerpt: 'Interactive gaming experiences.',
        description: 'We create engaging games using Unity and Unreal Engine for web, mobile, and desktop platforms.',
        seo: {
          title: 'Game Development Services | Unity & Unreal',
          description: 'Professional game development services.',
          ogTitle: 'Game Development',
          ogDescription: 'Build interactive games.',
        },
        blocks: [],
      },
      ar: {
        title: '',
        slug: '',
        excerpt: '',
        description: '',
        seo: { title: '', description: '', ogTitle: '', ogDescription: '' },
        blocks: [],
      },
    },
    translationStatus: {
      en: 'complete',
      ar: 'missing',
    },
  },
  {
    id: 'svc-006',
    title: 'Digital Infrastructure',
    shortDescription: 'Cloud infrastructure, DevOps, and system architecture for scalable applications.',
    status: 'published',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-05-30T15:00:00Z',
    publishedAt: '2024-01-25T10:00:00Z',
    category: 'DevOps & Cloud',
    tags: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
    gallery: [],
    featured: false,
    order: 6,
    relatedServiceIds: ['svc-001', 'svc-004'],
    content: {
      en: {
        title: 'Digital Infrastructure',
        slug: 'digital-infrastructure',
        excerpt: 'Cloud infrastructure and DevOps.',
        description: 'We design and implement scalable cloud infrastructure using AWS, Docker, Kubernetes, and modern DevOps practices.',
        seo: {
          title: 'DevOps & Cloud Infrastructure Services',
          description: 'Professional cloud and DevOps services.',
          ogTitle: 'Digital Infrastructure',
          ogDescription: 'Build scalable cloud infrastructure.',
        },
        blocks: [],
      },
      ar: {
        title: 'البنية التحتية الرقمية',
        slug: 'digital-infrastructure-ar',
        excerpt: 'البنية التحتية السحابية و DevOps.',
        description: 'نصمم وننفذ بنية تحتية سحابية قابلة للتطوير باستخدام AWS و Docker و Kubernetes.',
        seo: {
          title: 'خدمات DevOps والبنية التحتية السحابية',
          description: 'خدمات سحابية و DevOps احترافية.',
          ogTitle: 'البنية التحتية الرقمية',
          ogDescription: 'ابنِ بنية تحتية سحابية قابلة للتطوير.',
        },
        blocks: [],
      },
    },
    translationStatus: {
      en: 'complete',
      ar: 'complete',
    },
  },
  {
    id: 'svc-007',
    title: 'E-commerce Solutions',
    shortDescription: 'Complete e-commerce platforms with inventory management and payment integration.',
    status: 'archived',
    createdAt: '2023-11-01T09:00:00Z',
    updatedAt: '2024-02-15T14:00:00Z',
    publishedAt: '2023-11-15T09:00:00Z',
    category: 'E-commerce',
    tags: ['Shopify', 'WooCommerce', 'Payment Gateway', 'Inventory'],
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    gallery: [],
    featured: false,
    order: 7,
    relatedServiceIds: ['svc-001'],
    content: {
      en: {
        title: 'E-commerce Solutions',
        slug: 'ecommerce-solutions',
        excerpt: 'Complete e-commerce platforms.',
        description: 'We build comprehensive e-commerce solutions with inventory management, payment processing, and analytics.',
        seo: {
          title: 'E-commerce Development Services',
          description: 'Professional e-commerce development.',
          ogTitle: 'E-commerce Solutions',
          ogDescription: 'Build online stores.',
        },
        blocks: [],
      },
      ar: {
        title: '',
        slug: '',
        excerpt: '',
        description: '',
        seo: { title: '', description: '', ogTitle: '', ogDescription: '' },
        blocks: [],
      },
    },
    translationStatus: {
      en: 'complete',
      ar: 'missing',
    },
  },
];

interface ServiceContextType {
  services: Service[];
  addService: (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;
  getService: (id: string) => Service | undefined;
  getServiceBySlug: (slug: string, language: 'en' | 'ar') => Service | undefined;
  getServicesByStatus: (status: ServiceStatus) => Service[];
  getPublishedServices: () => Service[];
  getFeaturedServices: () => Service[];
  getServicesByCategory: (categoryId: string) => Service[];
  duplicateService: (id: string) => string | null;
  updateServiceContent: (
    id: string,
    language: 'en' | 'ar',
    content: Partial<LanguageContent>
  ) => void;
  duplicateServiceContent: (
    id: string,
    fromLang: 'en' | 'ar',
    toLang: 'en' | 'ar'
  ) => void;
  checkSlugUniqueness: (slug: string, excludeId?: string) => boolean;
  isSlugTaken: (slug: string, excludeId?: string) => boolean;
  updateServiceCategories: (id: string, categoryIds: string[]) => void;

  // Related Services Management
  updateServiceRelatedServices: (id: string, relatedServiceIds: string[]) => void;
  getRelatedServices: (id: string) => Service[];
  addRelatedService: (id: string, relatedServiceId: string) => void;
  removeRelatedService: (id: string, relatedServiceId: string) => void;
  getAvailableRelatedServices: (currentServiceId: string) => Service[];

  // Relationship Validation (Phase 5E-2)
  validateRelationships: (
    relatedServiceIds: string[],
    currentServiceId?: string,
    language?: 'en' | 'ar'
  ) => RelationshipValidationResult;
  getRelationshipErrors: (
    relatedServiceIds: string[],
    currentServiceId?: string,
    language?: 'en' | 'ar'
  ) => RelationshipValidationError[];

  // Service Settings (Phase 6A-1)
  settings: ServiceSettings;
  updateSettings: (updates: Partial<ServiceSettings>) => void;
  resetSettings: () => void;
  isSettingsLoaded: boolean;

  // Service Permissions (Phase 6A-2)
  updatePermissions: (updates: Partial<ServicePermissions>) => void;
  resetPermissions: () => void;
  getPermissions: () => ServicePermissions;

  // Workflow Management (Phase 6A-4)
  updateServiceStatus: (id: string, newStatus: ServiceStatus, changedBy?: string, reason?: string) => boolean;
  getServiceStatusHistory: (id: string) => ServiceStatusHistoryEntry[];
  canTransitionTo: (id: string, newStatus: ServiceStatus) => WorkflowTransitionResult;
  getAvailableTransitions: (id: string) => ServiceStatus[];
  validateWorkflowTransition: (currentStatus: ServiceStatus, newStatus: ServiceStatus) => WorkflowTransitionResult;

  // Approval System (Phase 6A-5)
  approvalHistory: Record<string, ApprovalEntry[]>;
  approvalRequests: ApprovalRequest[];
  performApproval: (serviceId: string, action: ApprovalAction, approverInfo: { approverId: string; approverName: string; approverRole: string; comment?: string }) => ApprovalResult;
  getApprovalHistory: (serviceId: string) => ApprovalEntry[];
  getApprovalRequests: (serviceId: string) => ApprovalRequest[];
  createApprovalRequest: (serviceId: string, requestedBy: string, requestedByName: string, reason?: string, priority?: 'low' | 'normal' | 'high' | 'urgent') => ApprovalRequest;
  cancelApprovalRequest: (requestId: string) => boolean;

  // Audit Log System (Phase 6A-6)
  auditLogs: AuditLogEntry[];
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => AuditLogEntry;
  getAuditLogs: (serviceId: string) => AuditLogEntry[];
  clearAuditLogs: (serviceId?: string) => void;
}

const SERVICES_STORAGE_KEY = 'axiomx_services';
const SERVICE_HISTORY_KEY = 'axiomx_service_history';
const APPROVAL_HISTORY_KEY = 'axiomx_approval_history';
const APPROVAL_REQUESTS_KEY = 'axiomx_approval_requests';
const AUDIT_LOG_STORAGE_KEY = 'axiomx_audit_logs';

// =====================================================
// WORKFLOW VALIDATION HELPERS (Phase 6A-4)
// =====================================================

// Define allowed transitions map
const ALLOWED_TRANSITIONS: Record<ServiceStatus, ServiceStatus[]> = {
  draft: ['review', 'archived'],
  review: ['approved', 'draft', 'archived'],
  approved: ['published', 'archived'],
  published: ['draft', 'archived'],
  archived: ['draft'],
};

// Validate if a transition is allowed
const isTransitionAllowed = (
  currentStatus: ServiceStatus,
  newStatus: ServiceStatus
): { allowed: boolean; reason?: string } => {
  const allowedTargets = ALLOWED_TRANSITIONS[currentStatus] || [];

  if (allowedTargets.includes(newStatus)) {
    return { allowed: true };
  }

  const reason = `Transition from "${currentStatus}" to "${newStatus}" is not allowed`;

  return { allowed: false, reason };
};

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [settings, setSettings] = useState<ServiceSettings>(DEFAULT_SERVICE_SETTINGS);
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);
  // Service status history (Phase 6A-4)
  const [statusHistory, setStatusHistory] = useState<Record<string, ServiceStatusHistoryEntry[]>>({});
  // Approval history (Phase 6A-5)
  const [approvalHistory, setApprovalHistory] = useState<Record<string, ApprovalEntry[]>>({});
  // Approval requests (Phase 6A-5)
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([]);
  // Audit logs (Phase 6A-6)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // Language context for translations
  const { language } = useLanguage();

  useEffect(() => {
    const stored = loadFromStorage<Service[]>(SERVICES_STORAGE_KEY);
    if (stored && stored.length > 0) {
      setServices(stored);
    } else {
      setServices(INITIAL_SERVICES);
      saveToStorage(SERVICES_STORAGE_KEY, INITIAL_SERVICES);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded && services.length > 0) {
      saveToStorage(SERVICES_STORAGE_KEY, services);
    }
  }, [services, isLoaded]);

  // Load settings from localStorage (Phase 6A-1)
  useEffect(() => {
    const storedSettings = loadFromStorage<ServiceSettings>(SERVICE_SETTINGS_STORAGE_KEY);
    if (storedSettings) {
      setSettings(storedSettings);
    }
    setIsSettingsLoaded(true);
  }, []);

  // Load service status history from localStorage (Phase 6A-4)
  useEffect(() => {
    const storedHistory = loadFromStorage<Record<string, ServiceStatusHistoryEntry[]>>(SERVICE_HISTORY_KEY);
    if (storedHistory) {
      setStatusHistory(storedHistory);
    }
  }, []);

  // Save settings to localStorage when changed (Phase 6A-1)
  useEffect(() => {
    if (isSettingsLoaded) {
      saveToStorage(SERVICE_SETTINGS_STORAGE_KEY, settings);
    }
  }, [settings, isSettingsLoaded]);

  // Save status history to localStorage when changed (Phase 6A-4)
  useEffect(() => {
    if (Object.keys(statusHistory).length > 0) {
      saveToStorage(SERVICE_HISTORY_KEY, statusHistory);
    }
  }, [statusHistory]);

  // Load approval history from localStorage (Phase 6A-5)
  useEffect(() => {
    const storedHistory = loadFromStorage<Record<string, ApprovalEntry[]>>(APPROVAL_HISTORY_KEY);
    if (storedHistory) {
      setApprovalHistory(storedHistory);
    }
  }, []);

  // Load approval requests from localStorage (Phase 6A-5)
  useEffect(() => {
    const storedRequests = loadFromStorage<ApprovalRequest[]>(APPROVAL_REQUESTS_KEY);
    if (storedRequests) {
      setApprovalRequests(storedRequests);
    }
  }, []);

  // Save approval history to localStorage when changed (Phase 6A-5)
  useEffect(() => {
    if (Object.keys(approvalHistory).length > 0) {
      saveToStorage(APPROVAL_HISTORY_KEY, approvalHistory);
    }
  }, [approvalHistory]);

  // Save approval requests to localStorage when changed (Phase 6A-5)
  useEffect(() => {
    if (approvalRequests.length > 0) {
      saveToStorage(APPROVAL_REQUESTS_KEY, approvalRequests);
    }
  }, [approvalRequests]);

  // Load audit logs from localStorage (Phase 6A-6)
  useEffect(() => {
    const storedLogs = loadFromStorage<AuditLogEntry[]>(AUDIT_LOG_STORAGE_KEY);
    if (storedLogs && storedLogs.length > 0) {
      setAuditLogs(storedLogs);
    }
  }, []);

  // Save audit logs to localStorage when changed (Phase 6A-6)
  useEffect(() => {
    if (auditLogs.length > 0) {
      saveToStorage(AUDIT_LOG_STORAGE_KEY, auditLogs);
    }
  }, [auditLogs]);

  // Settings update function (Phase 6A-1)
  const updateSettings = useCallback((updates: Partial<ServiceSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  // Reset settings to defaults (Phase 6A-1)
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SERVICE_SETTINGS);
  }, []);

  // Service Permissions methods (Phase 6A-2)
  const updatePermissions = useCallback((updates: Partial<ServicePermissions>) => {
    setSettings((prev) => ({
      ...prev,
      permissions: { ...prev.permissions, ...updates },
    }));
  }, []);

  const resetPermissions = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      permissions: DEFAULT_SERVICE_PERMISSIONS,
    }));
  }, []);

  const getPermissions = useCallback(() => {
    return settings.permissions;
  }, [settings.permissions]);

  // =====================================================
  // WORKFLOW MANAGEMENT METHODS (Phase 6A-4)
  // =====================================================

  // Validate workflow transition
  const validateWorkflowTransition = useCallback((
    currentStatus: ServiceStatus,
    newStatus: ServiceStatus
  ): WorkflowTransitionResult => {
    const validation = isTransitionAllowed(currentStatus, newStatus);
    return {
      allowed: validation.allowed,
      reason: validation.reason,
      message: validation.allowed
        ? (language === 'ar'
            ? `يمكن الانتقال من "${currentStatus}" إلى "${newStatus}"`
            : `Can transition from "${currentStatus}" to "${newStatus}"`)
        : (language === 'ar'
            ? `لا يمكن الانتقال من "${currentStatus}" إلى "${newStatus}"`
            : `Cannot transition from "${currentStatus}" to "${newStatus}"`),
    };
  }, [language]);

  // Check if a service can transition to a new status
  const canTransitionTo = useCallback((
    id: string,
    newStatus: ServiceStatus
  ): WorkflowTransitionResult => {
    const service = services.find(s => s.id === id);
    if (!service) {
      return {
        allowed: false,
        reason: 'service_not_found',
        message: language === 'ar' ? 'الخدمة غير موجودة' : 'Service not found',
      };
    }
    return validateWorkflowTransition(service.status, newStatus);
  }, [services, validateWorkflowTransition, language]);

  // Get available transitions for a service
  const getAvailableTransitions = useCallback((
    id: string
  ): ServiceStatus[] => {
    const service = services.find(s => s.id === id);
    if (!service) return [];
    return ALLOWED_TRANSITIONS[service.status] || [];
  }, [services]);

  // Get service status history
  const getServiceStatusHistory = useCallback((
    id: string
  ): ServiceStatusHistoryEntry[] => {
    return statusHistory[id] || [];
  }, [statusHistory]);

  // Update service status with history tracking
  const updateServiceStatus = useCallback((
    id: string,
    newStatus: ServiceStatus,
    changedBy?: string,
    reason?: string
  ): boolean => {
    const service = services.find(s => s.id === id);
    if (!service) return false;

    // Validate transition
    const validation = isTransitionAllowed(service.status, newStatus);
    if (!validation.allowed) return false;

    // Create history entry
    const historyEntry: ServiceStatusHistoryEntry = {
      id: `history-${Date.now()}`,
      previousStatus: service.status,
      newStatus,
      changedBy: changedBy || 'system',
      changedAt: new Date().toISOString(),
      reason,
    };

    // Update service status
    setServices(prev => prev.map(s => {
      if (s.id !== id) return s;

      const updatedService = {
        ...s,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };

      // Set publishedAt when publishing
      if (newStatus === 'published' && !s.publishedAt) {
        updatedService.publishedAt = new Date().toISOString();
      }

      return updatedService;
    }));

    // Update history
    setStatusHistory(prev => ({
      ...prev,
      [id]: [...(prev[id] || []), historyEntry],
    }));

    return true;
  }, [services]);

  // =====================================================
  // APPROVAL SYSTEM METHODS (Phase 6A-5)
  // =====================================================

  // Get approval history for a service
  const getApprovalHistory = useCallback((serviceId: string): ApprovalEntry[] => {
    return approvalHistory[serviceId] || [];
  }, [approvalHistory]);

  // Get approval requests for a service
  const getApprovalRequests = useCallback((serviceId: string): ApprovalRequest[] => {
    return approvalRequests.filter(r => r.serviceId === serviceId);
  }, [approvalRequests]);

  // Create a new approval request
  const createApprovalRequest = useCallback((
    serviceId: string,
    requestedBy: string,
    requestedByName: string,
    reason?: string,
    priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'
  ): ApprovalRequest => {
    const newRequest: ApprovalRequest = {
      id: `apr-${Date.now()}`,
      serviceId,
      requestedBy,
      requestedByName,
      requestedAt: new Date().toISOString(),
      reason,
      priority,
      status: 'pending',
    };

    setApprovalRequests(prev => [...prev, newRequest]);
    return newRequest;
  }, []);

  // Cancel an approval request
  const cancelApprovalRequest = useCallback((requestId: string): boolean => {
    const requestIndex = approvalRequests.findIndex(r => r.id === requestId);
    if (requestIndex === -1) return false;

    setApprovalRequests(prev =>
      prev.map(r =>
        r.id === requestId ? { ...r, status: 'cancelled' as const } : r
      )
    );
    return true;
  }, [approvalRequests]);

  // Perform an approval action
  const performApproval = useCallback((
    serviceId: string,
    action: ApprovalAction,
    approverInfo: { approverId: string; approverName: string; approverRole: string; comment?: string }
  ): ApprovalResult => {
    const service = services.find(s => s.id === serviceId);
    if (!service) {
      return { success: false, error: 'Service not found' };
    }

    // Determine target status based on action
    const actionTargetMap: Record<ApprovalAction, ServiceStatus> = {
      approve: 'approved',
      reject: 'draft',
      request_changes: 'draft',
      escalate: 'review',
    };

    const targetStatus = actionTargetMap[action];
    const previousStatus = service.status;

    // Create approval entry
    const approvalEntry: ApprovalEntry = {
      id: `approval-${Date.now()}`,
      serviceId,
      action,
      previousStatus,
      newStatus: targetStatus,
      approverId: approverInfo.approverId,
      approverName: approverInfo.approverName,
      approverRole: approverInfo.approverRole,
      comments: approverInfo.comment ? [{
        id: `comment-${Date.now()}`,
        content: approverInfo.comment,
        createdBy: approverInfo.approverName,
        createdAt: new Date().toISOString(),
      }] : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update approval history
    setApprovalHistory(prev => ({
      ...prev,
      [serviceId]: [...(prev[serviceId] || []), approvalEntry],
    }));

    // Update service status
    setServices(prev => prev.map(s => {
      if (s.id !== serviceId) return s;
      return {
        ...s,
        status: targetStatus,
        updatedAt: new Date().toISOString(),
      };
    }));

    // Update any pending approval requests for this service
    setApprovalRequests(prev =>
      prev.map(r =>
        r.serviceId === serviceId && r.status === 'pending'
          ? { ...r, status: action === 'approve' ? 'approved' as const : 'rejected' as const }
          : r
      )
    );

    return { success: true, entry: approvalEntry };
  }, [services, approvalRequests]);

  // =====================================================
  // AUDIT LOG SYSTEM METHODS (Phase 6A-6)
  // =====================================================

  // Add a new audit log entry
  const addAuditLog = useCallback((
    entry: Omit<AuditLogEntry, 'id' | 'timestamp'>
  ): AuditLogEntry => {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    setAuditLogs((prev) => [newEntry, ...prev]);
    return newEntry;
  }, []);

  // Get audit logs for a specific service
  const getAuditLogs = useCallback((serviceId: string): AuditLogEntry[] => {
    return auditLogs.filter((log) => log.serviceId === serviceId);
  }, [auditLogs]);

  // Clear audit logs (for a specific service or all)
  const clearAuditLogs = useCallback((serviceId?: string) => {
    if (serviceId) {
      setAuditLogs((prev) => prev.filter((log) => log.serviceId !== serviceId));
    } else {
      setAuditLogs([]);
    }
  }, []);

  const addService = useCallback(
    (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>, userInfo?: { userId: string; userName: string; userRole: string }) => {
      const id = `svc-${Date.now()}`;
      const now = new Date().toISOString();

      const newService: Service = {
        ...serviceData,
        id,
        createdAt: now,
        updatedAt: now,
      };

      setServices((prev) => [newService, ...prev]);

      // Add audit log for service creation (Phase 6A-6)
      if (userInfo) {
        addAuditLog({
          serviceId: id,
          serviceTitle: serviceData.title,
          action: 'create',
          userId: userInfo.userId,
          userName: userInfo.userName,
          userRole: userInfo.userRole,
          details: {
            category: serviceData.category || '',
            status: serviceData.status,
            featured: serviceData.featured,
          },
          description: `Service "${serviceData.title}" was created`,
        });
      }

      return id;
    },
    [addAuditLog]
  );

  const updateService = useCallback((id: string, updates: Partial<Service>, userInfo?: { userId: string; userName: string; userRole: string }) => {
    const service = services.find((s) => s.id === id);

    setServices((prev) =>
      prev.map((service) => {
        if (service.id !== id) return service;

        const updatedService = {
          ...service,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        // Recalculate translation status if content was updated
        if (updates.content) {
          updatedService.translationStatus = {
            en: calculateTranslationStatus(updates.content.en || service.content.en),
            ar: calculateTranslationStatus(updates.content.ar || service.content.ar),
          };
        }

        // Set publishedAt when status changes to published
        if (updates.status === 'published' && service.status !== 'published') {
          updatedService.publishedAt = new Date().toISOString();
        }

        return updatedService;
      })
    );

    // Add audit log for service edit (Phase 6A-6)
    if (userInfo && service) {
      const changedFields = Object.keys(updates);
      let action: AuditLogAction = 'edit';
      let description = `Service "${service.title}" was edited`;

      // Check for status changes
      if (updates.status && updates.status !== service.status) {
        if (updates.status === 'published') {
          action = 'publish';
          description = `Service "${service.title}" was published`;
        } else if (service.status === 'published') {
          action = 'unpublish';
          description = `Service "${service.title}" was unpublished`;
        } else {
          action = 'status_change';
          description = `Service "${service.title}" status changed from ${service.status} to ${updates.status}`;
        }
      }

      addAuditLog({
        serviceId: id,
        serviceTitle: service.title,
        action,
        userId: userInfo.userId,
        userName: userInfo.userName,
        userRole: userInfo.userRole,
        details: {
          changedFields: changedFields.join(', '),
          previousStatus: service.status,
          newStatus: updates.status || service.status,
        },
        description,
      });
    }
  }, [services, addAuditLog]);

  const deleteService = useCallback((id: string, userInfo?: { userId: string; userName: string; userRole: string }) => {
    const service = services.find((s) => s.id === id);

    setServices((prev) => prev.filter((service) => service.id !== id));

    // Add audit log for service deletion (Phase 6A-6)
    if (userInfo && service) {
      addAuditLog({
        serviceId: id,
        serviceTitle: service.title,
        action: 'delete',
        userId: userInfo.userId,
        userName: userInfo.userName,
        userRole: userInfo.userRole,
        details: {
          previousStatus: service.status,
          category: service.category || '',
        },
        description: `Service "${service.title}" was deleted`,
      });
    }
  }, [services, addAuditLog]);

  const getService = useCallback(
    (id: string) => {
      return services.find((service) => service.id === id);
    },
    [services]
  );

  const getServiceBySlug = useCallback(
    (slug: string, language: 'en' | 'ar') => {
      return services.find((service) => service.content[language].slug === slug);
    },
    [services]
  );

  const getServicesByStatus = useCallback(
    (status: ServiceStatus) => {
      return services.filter((service) => service.status === status);
    },
    [services]
  );

  const getPublishedServices = useCallback(() => {
    return services
      .filter((service) => service.status === 'published')
      .sort((a, b) => a.order - b.order);
  }, [services]);

  const getFeaturedServices = useCallback(() => {
    return services
      .filter((service) => service.featured && service.status === 'published')
      .sort((a, b) => a.order - b.order);
  }, [services]);

  const getServicesByCategory = useCallback(
    (categoryId: string) => {
      return services.filter((service) => service.categoryIds?.includes(categoryId));
    },
    [services]
  );

  const updateServiceCategories = useCallback((id: string, categoryIds: string[]) => {
    setServices((prev) =>
      prev.map((service) => {
        if (service.id !== id) return service;
        return {
          ...service,
          categoryIds,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  // Related Services Management
  const updateServiceRelatedServices = useCallback((id: string, relatedServiceIds: string[]) => {
    setServices((prev) =>
      prev.map((service) => {
        if (service.id !== id) return service;
        return {
          ...service,
          relatedServiceIds,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const getRelatedServices = useCallback((id: string): Service[] => {
    const service = services.find((s) => s.id === id);
    if (!service || !service.relatedServiceIds || service.relatedServiceIds.length === 0) {
      return [];
    }
    return services.filter((s) => service.relatedServiceIds.includes(s.id));
  }, [services]);

  const addRelatedService = useCallback((id: string, relatedServiceId: string) => {
    setServices((prev) =>
      prev.map((service) => {
        if (service.id !== id) return service;
        // Prevent duplicate and self-reference
        if (
          service.relatedServiceIds?.includes(relatedServiceId) ||
          relatedServiceId === id
        ) {
          return service;
        }
        return {
          ...service,
          relatedServiceIds: [...(service.relatedServiceIds || []), relatedServiceId],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const removeRelatedService = useCallback((id: string, relatedServiceId: string) => {
    setServices((prev) =>
      prev.map((service) => {
        if (service.id !== id) return service;
        return {
          ...service,
          relatedServiceIds: (service.relatedServiceIds || []).filter(
            (relId) => relId !== relatedServiceId
          ),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const getAvailableRelatedServices = useCallback((currentServiceId: string): Service[] => {
    return services.filter((service) => service.id !== currentServiceId);
  }, [services]);

  // =====================================================
  // RELATIONSHIP VALIDATION FUNCTIONS (Phase 5E-2)
  // =====================================================

  const validateRelationships = useCallback(
    (
      relatedServiceIds: string[],
      currentServiceId?: string,
      language: 'en' | 'ar' = 'en'
    ): RelationshipValidationResult => {
      const errors: RelationshipValidationError[] = [];

      // Check for empty entries
      const emptyEntries = relatedServiceIds.filter((id) => !id || id.trim() === '');
      if (emptyEntries.length > 0) {
        errors.push({
          type: 'empty',
          serviceId: '',
          serviceTitle: '',
          message: language === 'ar'
            ? 'لا يمكن إضافة علاقة فارغة'
            : 'Cannot add empty relationship',
        });
      }

      // Check for self-reference
      if (currentServiceId && relatedServiceIds.includes(currentServiceId)) {
        const currentService = services.find((s) => s.id === currentServiceId);
        errors.push({
          type: 'self',
          serviceId: currentServiceId,
          serviceTitle: currentService?.title || currentServiceId,
          message: language === 'ar'
            ? `لا يمكن ربط الخدمة بنفسها: "${currentService?.title || currentServiceId}"`
            : `Cannot link service to itself: "${currentService?.title || currentServiceId}"`,
        });
      }

      // Check for duplicates (entries appearing more than once)
      const seen = new Set<string>();
      const duplicates: string[] = [];
      relatedServiceIds.forEach((id) => {
        if (id && seen.has(id)) {
          if (!duplicates.includes(id)) {
            duplicates.push(id);
          }
        }
        if (id) {
          seen.add(id);
        }
      });

      duplicates.forEach((id) => {
        const service = services.find((s) => s.id === id);
        errors.push({
          type: 'duplicate',
          serviceId: id,
          serviceTitle: service?.title || id,
          message: language === 'ar'
            ? `علاقة مكررة: "${service?.title || id}"`
            : `Duplicate relationship: "${service?.title || id}"`,
        });
      });

      return {
        isValid: errors.length === 0,
        errors,
        errorCount: errors.length,
      };
    },
    [services]
  );

  const getRelationshipErrors = useCallback(
    (
      relatedServiceIds: string[],
      currentServiceId?: string,
      language: 'en' | 'ar' = 'en'
    ): RelationshipValidationError[] => {
      return validateRelationships(relatedServiceIds, currentServiceId, language).errors;
    },
    [validateRelationships]
  );

  const duplicateService = useCallback((id: string, userInfo?: { userId: string; userName: string; userRole: string }) => {
    const originalService = services.find((s) => s.id === id);
    if (!originalService) return null;

    const newId = `svc-${Date.now()}`;
    const now = new Date().toISOString();

    const duplicatedService: Service = {
      ...originalService,
      id: newId,
      title: `${originalService.title} (Copy)`,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      publishedAt: undefined,
      order: services.length + 1,
      content: {
        en: {
          ...originalService.content.en,
          slug: `${originalService.content.en.slug}-copy`,
          blocks: originalService.content.en.blocks.map((block) => ({
            ...block,
            id: `${block.id}-dup-${Date.now()}`,
          })),
        },
        ar: {
          ...originalService.content.ar,
          slug: originalService.content.ar.slug ? `${originalService.content.ar.slug}-copy` : '',
          blocks: originalService.content.ar.blocks.map((block) => ({
            ...block,
            id: `${block.id}-dup-${Date.now()}`,
          })),
        },
      },
      translationStatus: {
        en: 'missing',
        ar: 'missing',
      },
    };

    setServices((prev) => [duplicatedService, ...prev]);

    // Add audit log for service duplication (Phase 6A-6)
    if (userInfo) {
      addAuditLog({
        serviceId: newId,
        serviceTitle: duplicatedService.title,
        action: 'duplicate',
        userId: userInfo.userId,
        userName: userInfo.userName,
        userRole: userInfo.userRole,
        details: {
          originalServiceId: id,
          originalServiceTitle: originalService.title,
          newServiceTitle: duplicatedService.title,
        },
        description: `Service "${originalService.title}" was duplicated as "${duplicatedService.title}"`,
      });
    }

    return newId;
  }, [services, addAuditLog]);

  const updateServiceContent = useCallback(
    (id: string, language: 'en' | 'ar', contentUpdates: Partial<LanguageContent>) => {
      setServices((prev) =>
        prev.map((service) => {
          if (service.id !== id) return service;

          const updatedContent = {
            ...service.content[language],
            ...contentUpdates,
          };

          return {
            ...service,
            content: {
              ...service.content,
              [language]: updatedContent,
            },
            updatedAt: new Date().toISOString(),
            translationStatus: {
              ...service.translationStatus,
              [language]: calculateTranslationStatus(updatedContent),
            },
          };
        })
      );
    },
    []
  );

  const duplicateServiceContent = useCallback(
    (id: string, fromLang: 'en' | 'ar', toLang: 'en' | 'ar') => {
      setServices((prev) =>
        prev.map((service) => {
          if (service.id !== id) return service;

          const sourceContent = service.content[fromLang];
          const duplicatedContent: LanguageContent = {
            ...sourceContent,
            blocks: sourceContent.blocks.map((block) => ({
              ...block,
              id: `${block.id}-dup-${Date.now()}`,
            })),
          };

          return {
            ...service,
            content: {
              ...service.content,
              [toLang]: duplicatedContent,
            },
            updatedAt: new Date().toISOString(),
            translationStatus: {
              ...service.translationStatus,
              [toLang]: calculateTranslationStatus(duplicatedContent),
            },
          };
        })
      );
    },
    []
  );

  const checkSlugUniqueness = useCallback(
    (slug: string, excludeId?: string) => {
      const normalizedSlug = slug.toLowerCase().trim();
      return !services.some(
        (service) =>
          service.id !== excludeId &&
          (service.content.en.slug.toLowerCase() === normalizedSlug ||
            service.content.ar.slug.toLowerCase() === normalizedSlug)
      );
    },
    [services]
  );

  const isSlugTaken = useCallback(
    (slug: string, excludeId?: string) => {
      return !checkSlugUniqueness(slug, excludeId);
    },
    [checkSlugUniqueness]
  );

  const value = useMemo(
    () => ({
      services,
      addService,
      updateService,
      deleteService,
      getService,
      getServiceBySlug,
      getServicesByStatus,
      getPublishedServices,
      getFeaturedServices,
      getServicesByCategory,
      duplicateService,
      updateServiceContent,
      duplicateServiceContent,
      checkSlugUniqueness,
      isSlugTaken,
      updateServiceCategories,
      updateServiceRelatedServices,
      getRelatedServices,
      addRelatedService,
      removeRelatedService,
      getAvailableRelatedServices,
      validateRelationships,
      getRelationshipErrors,
      settings,
      updateSettings,
      resetSettings,
      isSettingsLoaded,
      updatePermissions,
      resetPermissions,
      getPermissions,
      // Workflow Management (Phase 6A-4)
      updateServiceStatus,
      getServiceStatusHistory,
      canTransitionTo,
      getAvailableTransitions,
      validateWorkflowTransition,
      // Approval System (Phase 6A-5)
      approvalHistory,
      approvalRequests,
      performApproval,
      getApprovalHistory,
      getApprovalRequests,
      createApprovalRequest,
      cancelApprovalRequest,
      // Audit Log System (Phase 6A-6)
      auditLogs,
      addAuditLog,
      getAuditLogs,
      clearAuditLogs,
    }),
    [
      services,
      addService,
      updateService,
      deleteService,
      getService,
      getServiceBySlug,
      getServicesByStatus,
      getPublishedServices,
      getFeaturedServices,
      getServicesByCategory,
      duplicateService,
      updateServiceContent,
      duplicateServiceContent,
      checkSlugUniqueness,
      isSlugTaken,
      updateServiceCategories,
      updateServiceRelatedServices,
      getRelatedServices,
      addRelatedService,
      removeRelatedService,
      getAvailableRelatedServices,
      validateRelationships,
      getRelationshipErrors,
      settings,
      updateSettings,
      resetSettings,
      isSettingsLoaded,
      updatePermissions,
      resetPermissions,
      getPermissions,
      // Workflow Management (Phase 6A-4)
      updateServiceStatus,
      getServiceStatusHistory,
      canTransitionTo,
      getAvailableTransitions,
      validateWorkflowTransition,
      // Approval System (Phase 6A-5)
      approvalHistory,
      approvalRequests,
      performApproval,
      getApprovalHistory,
      getApprovalRequests,
      createApprovalRequest,
      cancelApprovalRequest,
      // Audit Log System (Phase 6A-6)
      auditLogs,
      addAuditLog,
      getAuditLogs,
      clearAuditLogs,
    ]
  );

  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useServices = (): ServiceContextType => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
};
// =====================================================
// USER TYPES - AXIOMX ADMIN SYSTEM
// Phase 3: Enhanced Employee Management System
// Phase 6A-3: Service CMS Roles
//
// This file defines the core types related to users, roles, and permissions
// within the AXIOMX Admin system. It's critical for maintaining data consistency
// and security across the application.
//
// Key Considerations:
// - Security: Sensitive data like password hashes are explicitly excluded from frontend User objects.
// - Scalability: Role-based and service-specific permissions are structured for future expansion.
// - Maintainability: Centralized type definitions reduce redundancy and potential errors.
// =====================================================

// Main User Roles (System-level)
export type UserRole = 'owner' | 'admin' | 'manager' | 'employee';

// =====================================================
// SERVICE CMS ROLES (Phase 6A-3)
// =====================================================

export type ServiceRole =
  | 'service_admin'      // Service Administrator - Full service management
  | 'service_editor'     // Service Editor - Create and edit services
  | 'service_seo_manager' // SEO Manager - Manage SEO settings for services
  | 'service_translator'  // Translator - Translate service content
  | 'service_viewer';     // Viewer - View services only

// Service role labels with bilingual support
export const SERVICE_ROLE_LABELS: Record<ServiceRole, { en: string; ar: string; description: { en: string; ar: string } }> = {
  service_admin: {
    en: 'Service Admin',
    ar: 'مدير الخدمات',
    description: {
      en: 'Full access to manage all services including create, edit, delete, and publish',
      ar: 'صلاحيات كاملة لإدارة جميع الخدمات بما في ذلك الإنشاء والتعديل والحذف والنشر',
    },
  },
  service_editor: {
    en: 'Service Editor',
    ar: 'محرر الخدمات',
    description: {
      en: 'Can create new services and edit existing service content',
      ar: 'يمكن إنشاء خدمات جديدة وتعديل محتوى الخدمات الموجودة',
    },
  },
  service_seo_manager: {
    en: 'SEO Manager',
    ar: 'مدير SEO',
    description: {
      en: 'Can manage SEO settings and metadata for all services',
      ar: 'يمكن إدارة إعدادات تحسين محركات البحث والبيانات الوصفية لجميع الخدمات',
    },
  },
  service_translator: {
    en: 'Service Translator',
    ar: 'مترجم الخدمات',
    description: {
      en: 'Can translate service content between languages',
      ar: 'يمكن ترجمة محتوى الخدمات بين اللغات',
    },
  },
  service_viewer: {
    en: 'Service Viewer',
    ar: 'مشاهد الخدمات',
    description: {
      en: 'Can view services but cannot make any changes',
      ar: 'يمكن عرض الخدمات فقط دون إجراء أي تغييرات',
    },
  },
};

// Combined role type (System role + Service role)
export type CombinedRole = {
  systemRole: UserRole;
  serviceRole: ServiceRole | null;
};

// =====================================================
// EMPLOYEE PERMISSIONS STRUCTURE
// =====================================================

export type EmployeeStatus = 'active' | 'inactive' | 'suspended';

export interface EmployeePermissions {
  canAccessAdmin: boolean; // Added for basic admin access check
  // Projects
  projects_view: boolean;
  projects_create: boolean;
  projects_edit: boolean;
  projects_delete: boolean;
  // Services
  services_view: boolean;
  services_manage: boolean;
  // Service-specific permissions (Phase 6A-3)
  service_create: boolean;
  service_edit: boolean;
  service_delete: boolean;
  service_publish: boolean;
  service_seo_manage: boolean;
  service_translate: boolean;
  // Articles
  articles_view: boolean;
  articles_create: boolean;
  articles_edit: boolean;
  articles_delete: boolean;
  // Messages
  messages_view: boolean;
  messages_send: boolean;
  // Attachments
  attachments_view: boolean;
  attachments_upload: boolean;
  attachments_delete: boolean;
  // Team
  team_view: boolean;
  team_manage: boolean;
  // Settings
  settings_view: boolean;
  settings_edit: boolean;
  // Permissions
  permissions_view: boolean;
  permissions_manage: boolean;
}

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  idCardImage?: string;
  jobTitle: string;
  role: UserRole;
  serviceRole?: ServiceRole; // Phase 6A-3
  status: EmployeeStatus;
  permissions: EmployeePermissions;
  createdAt: string;
  lastLogin?: string;
  department?: string;
  notes?: string;
}

export type AuthStatus =
  | 'pending_registration'
  | 'pending_review'
  | 'pending_approval'
  | 'active'
  | 'suspended'
  | 'rejected';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  serviceRole?: ServiceRole; // Phase 6A-3
  fullName?: string;
  phone?: string;
  nationalId?: string;
  country?: string;
  avatar?: string;
  profilePhotoUrl?: string;
  idCardFrontUrl?: string;
  idCardBackUrl?: string;
  personalPhotoUrl?: string;
  signatureDataUrl?: string;
  permissions?: EmployeePermissions;
  // passwordHash?: string; // Removed - sensitive data should not be in frontend user object
  createdAt?: string;
  lastLogin?: string;
  oauthProvider?: 'google';
  googleId?: string;
  authStatus?: AuthStatus;
  rememberMe?: boolean;
  requestId?: string;
  requestSubmittedAt?: string;
  sessionId?: string; // Added for session management
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  identifier: string; // Email or Username
  password: string;
}

// =====================================================
// DEFAULT PERMISSIONS BY SYSTEM ROLE
// =====================================================

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, EmployeePermissions> = {
  owner: {
    canAccessAdmin: true, // Owner has admin access
    projects_view: true, projects_create: true, projects_edit: true, projects_delete: true,
    services_view: true, services_manage: true,
    // Service-specific (Phase 6A-3)
    service_create: true, service_edit: true, service_delete: true, service_publish: true,
    service_seo_manage: true, service_translate: true,
    articles_view: true, articles_create: true, articles_edit: true, articles_delete: true,
    messages_view: true, messages_send: true,
    attachments_view: true, attachments_upload: true, attachments_delete: true,
    team_view: true, team_manage: true,
    settings_view: true, settings_edit: true,
    permissions_view: true, permissions_manage: true,
  },
  admin: {
    canAccessAdmin: true, // Admin has admin access
    projects_view: true, projects_create: true, projects_edit: true, projects_delete: true,
    services_view: true, services_manage: true,
    // Service-specific (Phase 6A-3)
    service_create: true, service_edit: true, service_delete: true, service_publish: true,
    service_seo_manage: true, service_translate: true,
    articles_view: true, articles_create: true, articles_edit: true, articles_delete: true,
    messages_view: true, messages_send: true,
    attachments_view: true, attachments_upload: true, attachments_delete: true,
    team_view: true, team_manage: true,
    settings_view: true, settings_edit: true,
    permissions_view: true, permissions_manage: false,
  },
  manager: {
    canAccessAdmin: true, // Manager has admin access
    projects_view: true, projects_create: true, projects_edit: true, projects_delete: false,
    services_view: true, services_manage: true,
    // Service-specific (Phase 6A-3)
    service_create: true, service_edit: true, service_delete: false, service_publish: true,
    service_seo_manage: true, service_translate: true,
    articles_view: true, articles_create: true, articles_edit: true, articles_delete: false,
    messages_view: true, messages_send: true,
    attachments_view: true, attachments_upload: true, attachments_delete: false,
    team_view: true, team_manage: false,
    settings_view: true, settings_edit: false,
    permissions_view: true, permissions_manage: false,
  },
  employee: {
    canAccessAdmin: true, // Employee might have access to a dashboard, but restricted
    projects_view: true, projects_create: false, projects_edit: false, projects_delete: false,
    services_view: true, services_manage: false,
    // Service-specific (Phase 6A-3)
    service_create: false, service_edit: false, service_delete: false, service_publish: false,
    service_seo_manage: false, service_translate: false,
    articles_view: true, articles_create: false, articles_edit: false, articles_delete: false,
    messages_view: true, messages_send: true,
    attachments_view: true, attachments_upload: false, attachments_delete: false,
    team_view: true, team_manage: false,
    settings_view: true, settings_edit: false,
    permissions_view: false, permissions_manage: false,
  },
};

// =====================================================
// SERVICE ROLE PERMISSIONS (Phase 6A-3)
// =====================================================

export const SERVICE_ROLE_PERMISSIONS: Record<ServiceRole, EmployeePermissions> = {
  service_admin: {
    canAccessAdmin: true, // Service Admin has admin access
    // No project permissions
    projects_view: false, projects_create: false, projects_edit: false, projects_delete: false,
    // Full service access
    services_view: true, services_manage: true,
    service_create: true, service_edit: true, service_delete: true, service_publish: true,
    service_seo_manage: true, service_translate: true,
    // No other permissions
    articles_view: false, articles_create: false, articles_edit: false, articles_delete: false,
    messages_view: false, messages_send: false,
    attachments_view: false, attachments_upload: false, attachments_delete: false,
    team_view: false, team_manage: false,
    settings_view: false, settings_edit: false,
    permissions_view: false, permissions_manage: false,
  },
  service_editor: {
    canAccessAdmin: true, // Service Editor has admin access
    // No project permissions
    projects_view: false, projects_create: false, projects_edit: false, projects_delete: false,
    // Service view and edit
    services_view: true, services_manage: false,
    service_create: true, service_edit: true, service_delete: false, service_publish: false,
    service_seo_manage: false, service_translate: false,
    // No other permissions
    articles_view: false, articles_create: false, articles_edit: false, articles_delete: false,
    messages_view: false, messages_send: false,
    attachments_view: false, attachments_upload: false, attachments_delete: false,
    team_view: false, team_manage: false,
    settings_view: false, settings_edit: false,
    permissions_view: false, permissions_manage: false,
  },
  service_seo_manager: {
    canAccessAdmin: true, // SEO Manager has admin access
    // No project permissions
    projects_view: false, projects_create: false, projects_edit: false, projects_delete: false,
    // Service view and SEO
    services_view: true, services_manage: false,
    service_create: false, service_edit: true, service_delete: false, service_publish: false,
    service_seo_manage: true, service_translate: false,
    // No other permissions
    articles_view: false, articles_create: false, articles_edit: false, articles_delete: false,
    messages_view: false, messages_send: false,
    attachments_view: false, attachments_upload: false, attachments_delete: false,
    team_view: false, team_manage: false,
    settings_view: false, settings_edit: false,
    permissions_view: false, permissions_manage: false,
  },
  service_translator: {
    canAccessAdmin: true, // Service Translator has admin access
    // No project permissions
    projects_view: false, projects_create: false, projects_edit: false, projects_delete: false,
    // Service view and translate
    services_view: true, services_manage: false,
    service_create: false, service_edit: true, service_delete: false, service_publish: false,
    service_seo_manage: false, service_translate: true,
    // No other permissions
    articles_view: false, articles_create: false, articles_edit: false, articles_delete: false,
    messages_view: false, messages_send: false,
    attachments_view: false, attachments_upload: false, attachments_delete: false,
    team_view: false, team_manage: false,
    settings_view: false, settings_edit: false,
    permissions_view: false, permissions_manage: false,
  },
  service_viewer: {
    canAccessAdmin: true, // Service Viewer has admin access
    // No project permissions
    projects_view: false, projects_create: false, projects_edit: false, projects_delete: false,
    // Service view only
    services_view: true, services_manage: false,
    service_create: false, service_edit: false, service_delete: false, service_publish: false,
    service_seo_manage: false, service_translate: false,
    // No other permissions
    articles_view: false, articles_create: false, articles_edit: false, articles_delete: false,
    messages_view: false, messages_send: false,
    attachments_view: false, attachments_upload: false, attachments_delete: false,
    team_view: false, team_manage: false,
    settings_view: false, settings_edit: false,
    permissions_view: false, permissions_manage: false,
  },
};

// Predefined user accounts for AXIOMX
// NOTE: In a real application, these users would be managed by a backend
//       and passwords would be securely hashed and never stored client-side.
//       This mock data is for frontend development only.
export const AXIOMX_USERS: User[] = [
  {
    id: '1',
    username: 'owner',
    email: 'owner@axiomx.com',
    role: 'owner',
    fullName: 'System Owner',
    authStatus: 'active',
    permissions: DEFAULT_ROLE_PERMISSIONS.owner,
  },
  {
    id: '2',
    username: 'admin',
    email: 'admin@axiomx.com',
    role: 'admin',
    fullName: 'System Admin',
    authStatus: 'active',
    permissions: DEFAULT_ROLE_PERMISSIONS.admin,
  },
  {
    id: '3',
    username: 'manager',
    email: 'manager@axiomx.com',
    role: 'manager',
    fullName: 'Account Manager',
    authStatus: 'active',
    permissions: DEFAULT_ROLE_PERMISSIONS.manager,
  },
  {
    id: '4',
    username: 'employee',
    email: 'employee@axiomx.com',
    role: 'employee',
    fullName: 'Staff Member',
    authStatus: 'active',
    permissions: DEFAULT_ROLE_PERMISSIONS.employee,
  },
  // Service CMS Roles (Phase 6A-3)
  {
    id: '5',
    username: 'service_admin',
    email: 'service.admin@axiomx.com',
    role: 'employee',
    serviceRole: 'service_admin',
    fullName: 'Service Administrator',
    authStatus: 'active',
    permissions: SERVICE_ROLE_PERMISSIONS.service_admin,
  },
  {
    id: '6',
    username: 'service_editor',
    email: 'service.editor@axiomx.com',
    role: 'employee',
    serviceRole: 'service_editor',
    fullName: 'Service Editor',
    authStatus: 'active',
    permissions: SERVICE_ROLE_PERMISSIONS.service_editor,
  },
  {
    id: '7',
    username: 'service_seo',
    email: 'service.seo@axiomx.com',
    role: 'employee',
    serviceRole: 'service_seo_manager',
    fullName: 'SEO Manager',
    authStatus: 'active',
    permissions: SERVICE_ROLE_PERMISSIONS.service_seo_manager,
  },
  {
    id: '8',
    username: 'service_translator',
    email: 'service.translator@axiomx.com',
    role: 'employee',
    serviceRole: 'service_translator',
    fullName: 'Service Translator',
    authStatus: 'active',
    permissions: SERVICE_ROLE_PERMISSIONS.service_translator,
  },
  {
    id: '9',
    username: 'service_viewer',
    email: 'service.viewer@axiomx.com',
    role: 'employee',
    serviceRole: 'service_viewer',
    fullName: 'Service Viewer',
    authStatus: 'active',
    permissions: SERVICE_ROLE_PERMISSIONS.service_viewer,
  },
];


// Session storage key
export const SESSION_STORAGE_KEY = 'axiomx_session';

// Local storage key for "remember me" functionality
export const LOCAL_STORAGE_KEY = 'axiomx_remember_me_session';

// Role labels
export const ROLE_LABELS: Record<UserRole, { en: string; ar: string }> = {
  owner: { en: 'Owner', ar: 'المالك' },
  admin: { en: 'Admin', ar: 'مدير النظام' },
  manager: { en: 'Manager', ar: 'مدير' },
  employee: { en: 'Employee', ar: 'موظف' },
};

// Status labels
export const STATUS_LABELS: Record<EmployeeStatus, { en: string; ar: string }> = {
  active: { en: 'Active', ar: 'نشط' },
  inactive: { en: 'Inactive', ar: 'غير نشط' },
  suspended: { en: 'Suspended', ar: 'معلق' },
};

// Job titles
export const JOB_TITLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'UI/UX Designer',
  'Project Manager',
  'DevOps Engineer',
  'QA Engineer',
  'Mobile Developer',
  'Data Scientist',
  'Security Engineer',
  'Marketing Manager',
  'HR Manager',
  'Sales Representative',
  'Customer Support',
  'System Administrator',
  'Database Administrator',
  // Service-specific roles (Phase 6A-3)
  'Service Admin',
  'SEO Manager',
  'Content Translator',
  'Service Coordinator',
];

// Departments
export const DEPARTMENTS = [
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
  'Support',
  // Service-specific (Phase 6A-3)
  'Content Management',
  'SEO',
];
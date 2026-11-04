// =====================================================
// PERMISSIONS SYSTEM - AXIOMX ADMIN SYSTEM
// Phase 2: Role-based permission foundation
// Phase 6A-3: Service CMS Roles
//
// This file defines the various permission types, menu item structures,
// and helper functions for managing user access within the AXIOMX Admin system.
// It integrates with User and ServiceRole definitions to provide granular
// access control.
//
// Key Considerations:
// - Role-Based Access Control (RBAC): Permissions are tied to UserRoles and ServiceRoles.
// - Modularity: Separation of concerns between permission definitions and menu structures.
// - Extensibility: Designed to easily add new permissions and roles in the future.
// =====================================================

import { UserRole, ServiceRole, SERVICE_ROLE_PERMISSIONS, DEFAULT_ROLE_PERMISSIONS } from './user';

// Permission types
export type Permission =
  | 'dashboard.view'
  | 'projects.view'
  | 'projects.create'
  | 'projects.edit'
  | 'projects.delete'
  | 'services.view'
  | 'services.create'
  | 'services.edit'
  | 'services.delete'
  | 'services.publish'
  | 'services.manage'
  // Service-specific permissions (Phase 6A-3)
  | 'service.view'
  | 'service.create'
  | 'service.edit'
  | 'service.delete'
  | 'service.publish'
  | 'service.seo.manage'
  | 'service.translate'
  | 'categories.view'
  | 'categories.manage'
  | 'articles.view'
  | 'articles.manage'
  | 'team.view'
  | 'team.manage'
  | 'messages.view'
  | 'messages.send'
  | 'chat.view'
  | 'chat.use'
  | 'attachments.view'
  | 'attachments.upload'
  | 'attachments.delete'
  | 'settings.view'
  | 'settings.edit'
  | 'permissions.view'
  | 'permissions.manage'
  | 'activity.view'
  | 'activity.export'
  | 'seo.view';

// Menu item permissions
export interface MenuItemPermission {
  view: Permission;
  create?: Permission;
  edit?: Permission;
  delete?: Permission;
  send?: Permission;
  use?: Permission;
  upload?: Permission;
  manage?: Permission;
  export?: Permission;
}

// Menu configuration with permissions
export interface MenuItem {
  id: string;
  label: string;
  labelAr: string;
  icon: string;
  route: string;
  permissions: MenuItemPermission;
  badge?: string;
}

// =====================================================
// HELPER FUNCTIONS FOR SERVICE ROLES (Phase 6A-3)
// =====================================================

/**
 * Get effective permissions for a user based on their system role and service role
 * Service roles take precedence for service-specific permissions
 */
export const getEffectivePermissions = (
  systemRole: UserRole,
  serviceRole: ServiceRole | undefined
): string[] => {
  const systemPermissions = DEFAULT_ROLE_PERMISSIONS[systemRole];

  // If user has a service role, use service role permissions for service-related items
  if (serviceRole) {
    const servicePermissions = SERVICE_ROLE_PERMISSIONS[serviceRole];

    // Merge: system permissions for non-service items, service permissions for service items
    const mergedPermissions: Record<string, boolean> = { ...systemPermissions };

    // Override service-related permissions with service role permissions
    mergedPermissions.services_view = servicePermissions.services_view;
    mergedPermissions.services_manage = servicePermissions.services_manage;
    mergedPermissions.service_create = servicePermissions.service_create;
    mergedPermissions.service_edit = servicePermissions.service_edit;
    mergedPermissions.service_delete = servicePermissions.service_delete;
    mergedPermissions.service_publish = servicePermissions.service_publish;
    mergedPermissions.service_seo_manage = servicePermissions.service_seo_manage;
    mergedPermissions.service_translate = servicePermissions.service_translate;

    return Object.entries(mergedPermissions)
      .filter(([, value]) => value === true)
      .map(([key]) => key);
  }

  // No service role, return system permissions
  return Object.entries(systemPermissions)
    .filter(([, value]) => value === true)
    .map(([key]) => key);
};

/**
 * Check if user has a specific service permission
 */
export const hasServicePermission = (
  systemRole: UserRole,
  serviceRole: ServiceRole | undefined,
  permission: string
): boolean => {
  const effectivePermissions = getEffectivePermissions(systemRole, serviceRole);

  // Map permission strings to permission keys
  const permissionMap: Record<string, string[]> = {
    'services.view': ['services_view', 'services_view'],
    'services.create': ['services_view', 'service_create'],
    'services.edit': ['services_view', 'service_edit'],
    'services.delete': ['services_view', 'service_delete'],
    'services.publish': ['services_view', 'service_publish'],
    'services.manage': ['services_view', 'services_manage'],
    'service.view': ['services_view'],
    'service.create': ['service_create'],
    'service.edit': ['service_edit'],
    'service.delete': ['service_delete'],
    'service.publish': ['service_publish'],
    'service.seo.manage': ['service_seo_manage'],
    'service.translate': ['service_translate'],
  };

  const requiredKeys = permissionMap[permission] || [permission];
  return requiredKeys.some(key => effectivePermissions.includes(key));
};

// =====================================================
// ROLE-BASED PERMISSIONS CONFIGURATION
// =====================================================

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  owner: [
    // Dashboard
    'dashboard.view',
    // Projects - Full access
    'projects.view', 'projects.create', 'projects.edit', 'projects.delete',
    // Services - Full access (Phase 6A-2)
    'services.view', 'services.create', 'services.edit', 'services.delete', 'services.publish', 'services.manage',
    // Service-specific - Full access (Phase 6A-3)
    'service.view', 'service.create', 'service.edit', 'service.delete', 'service.publish', 'service.seo.manage', 'service.translate',
    // Categories - Full access
    'categories.view', 'categories.manage',
    // Articles - Full access
    'articles.view', 'articles.manage',
    // Team - Full access
    'team.view', 'team.manage',
    // Messages - Full access
    'messages.view', 'messages.send',
    // Chat - Full access
    'chat.view', 'chat.use',
    // Attachments - Full access
    'attachments.view', 'attachments.upload', 'attachments.delete',
    // Settings - Full access
    'settings.view', 'settings.edit',
    // Permissions - Full access
    'permissions.view', 'permissions.manage',
    // Activity - Full access
    'activity.view', 'activity.export',
    // SEO Dashboard
    'seo.view',
  ],
  admin: [
    // Dashboard
    'dashboard.view',
    // Projects - Full access
    'projects.view', 'projects.create', 'projects.edit', 'projects.delete',
    // Services - Full access (Phase 6A-2)
    'services.view', 'services.create', 'services.edit', 'services.delete', 'services.publish', 'services.manage',
    // Service-specific - Full access (Phase 6A-3)
    'service.view', 'service.create', 'service.edit', 'service.delete', 'service.publish', 'service.seo.manage', 'service.translate',
    // Categories - Full access
    'categories.view', 'categories.manage',
    // Articles - Full access
    'articles.view', 'articles.manage',
    // Team - Full access (can manage employees)
    'team.view', 'team.manage',
    // Messages - Full access
    'messages.view', 'messages.send',
    // Chat - Full access
    'chat.view', 'chat.use',
    // Attachments - Full access
    'attachments.view', 'attachments.upload', 'attachments.delete',
    // Settings - Full access
    'settings.view', 'settings.edit',
    // Permissions - View only (cannot manage permissions)
    'permissions.view',
    // Activity - Full access
    'activity.view', 'activity.export',
    // SEO Dashboard
    'seo.view',
  ],
  manager: [
    // Dashboard
    'dashboard.view',
    // Projects - View, Create, Edit (no delete)
    'projects.view', 'projects.create', 'projects.edit',
    // Services - View, Create, Edit, Publish (no delete) (Phase 6A-2)
    'services.view', 'services.create', 'services.edit', 'services.publish',
    // Service-specific (Phase 6A-3)
    'service.view', 'service.create', 'service.edit', 'service.publish', 'service.seo.manage', 'service.translate',
    // Categories - View, Manage
    'categories.view', 'categories.manage',
    // Articles - View, Manage
    'articles.view', 'articles.manage',
    // Team - View only
    'team.view',
    // Messages - View, Send
    'messages.view', 'messages.send',
    // Chat - View, Use
    'chat.view', 'chat.use',
    // Attachments - View, Upload
    'attachments.view', 'attachments.upload',
    // Settings - View only
    'settings.view',
    // Permissions - View only
    'permissions.view',
    // Activity - View only
    'activity.view',
    // SEO Dashboard
    'seo.view',
  ],
  employee: [
    // Dashboard - View only
    'dashboard.view',
    // Projects - View only
    'projects.view',
    // Services - View only (Phase 6A-2)
    'services.view',
    // Service-specific - None by default (Phase 6A-3)
    // Note: Service-specific roles override these in getEffectivePermissions
    // Categories - View only
    'categories.view',
    // Articles - View only
    'articles.view',
    // Team - View only
    'team.view',
    // Messages - View, Send
    'messages.view', 'messages.send',
    // Chat - View, Use
    'chat.view', 'chat.use',
    // Attachments - View only
    'attachments.view',
    // Settings - View only
    'settings.view',
    // Activity - View only
    'activity.view',
  ],
};

// =====================================================
// SERVICE ROLE PERMISSIONS (Phase 6A-3)
// =====================================================

export const SERVICE_ROLE_PERMISSIONS_MAP: Record<ServiceRole, Permission[]> = {
  service_admin: [
    // Dashboard
    'dashboard.view',
    // Services - Full access
    'services.view', 'services.create', 'services.edit', 'services.delete', 'services.publish', 'services.manage',
    // Service-specific - Full access
    'service.view', 'service.create', 'service.edit', 'service.delete', 'service.publish', 'service.seo.manage', 'service.translate',
    // Categories - View only
    'categories.view',
    // Messages - View only
    'messages.view',
  ],
  service_editor: [
    // Dashboard
    'dashboard.view',
    // Services - View and edit
    'services.view', 'services.create', 'services.edit',
    // Service-specific - Create and edit
    'service.view', 'service.create', 'service.edit',
    // Categories - View only
    'categories.view',
    // Messages - View only
    'messages.view',
  ],
  service_seo_manager: [
    // Dashboard
    'dashboard.view',
    // Services - View only
    'services.view',
    // Service-specific - Edit and SEO
    'service.view', 'service.edit', 'service.seo.manage',
    // Categories - View only
    'categories.view',
    // SEO Dashboard
    'seo.view',
  ],
  service_translator: [
    // Dashboard
    'dashboard.view',
    // Services - View only
    'services.view',
    // Service-specific - Edit and translate
    'service.view', 'service.edit', 'service.translate',
    // Categories - View only
    'categories.view',
  ],
  service_viewer: [
    // Dashboard
    'dashboard.view',
    // Services - View only
    'services.view',
    // Service-specific - View only
    'service.view',
    // Categories - View only
    'categories.view',
  ],
};

// Helper function to check if a role has a specific permission
export const hasPermission = (role: UserRole, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
};

// Helper function to check if a role has any of the given permissions
export const hasAnyPermission = (role: UserRole, permissions: Permission[]): boolean => {
  return permissions.some(permission => hasPermission(role, permission));
};

// Helper function to check if a role has all of the given permissions
export const hasAllPermissions = (role: UserRole, permissions: Permission[]): boolean => {
  return permissions.every(permission => hasPermission(role, permission));
};

// Menu items configuration
export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    labelAr: 'لوحة التحكم',
    icon: 'LayoutDashboard',
    route: '/admin',
    permissions: { view: 'dashboard.view' },
  },
  {
    id: 'employees',
    label: 'Employees',
    labelAr: 'الموظفين',
    icon: 'Users',
    route: '/admin/employees',
    permissions: { view: 'team.view', manage: 'team.manage' },
    badge: '12',
  },
  {
    id: 'projects',
    label: 'Projects',
    labelAr: 'المشاريع',
    icon: 'FolderKanban',
    route: '/admin/projects',
    permissions: { view: 'projects.view', create: 'projects.create', edit: 'projects.edit', delete: 'projects.delete' },
    badge: 'new',
  },
  {
    id: 'services',
    label: 'Services',
    labelAr: 'الخدمات',
    icon: 'Boxes',
    route: '/admin/services',
    permissions: { view: 'services.view' },
  },
  {
    id: 'categories',
    label: 'Categories',
    labelAr: 'فئات الخدمات',
    icon: 'Tag',
    route: '/admin/categories',
    permissions: { view: 'categories.view', manage: 'categories.manage' },
  },
  {
    id: 'articles',
    label: 'Articles',
    labelAr: 'المقالات',
    icon: 'FileText',
    route: '/admin/articles',
    permissions: { view: 'articles.view' },
  },
  {
    id: 'seo-dashboard',
    label: 'SEO Dashboard',
    labelAr: 'لوحة SEO',
    icon: 'Search',
    route: '/admin/seo-dashboard',
    permissions: { view: 'seo.view' },
  },
  {
    id: 'messages',
    label: 'Messages',
    labelAr: 'الرسائل',
    icon: 'Mail',
    route: '/admin/messages',
    permissions: { view: 'messages.view', send: 'messages.send' },
    badge: '3',
  },
  {
    id: 'attachments',
    label: 'Attachments',
    labelAr: 'المرفقات',
    icon: 'Paperclip',
    route: '/admin/attachments',
    permissions: { view: 'attachments.view', upload: 'attachments.upload' },
  },
  {
    id: 'settings',
    label: 'Settings',
    labelAr: 'الإعدادات',
    icon: 'Settings',
    route: '/admin/settings',
    permissions: { view: 'settings.view', edit: 'settings.edit' },
  },
  {
    id: 'permissions',
    label: 'Permissions',
    labelAr: 'الصلاحيات',
    icon: 'Shield',
    route: '/admin/permissions',
    permissions: { view: 'permissions.view', manage: 'permissions.manage' },
  },
  {
    id: 'activity',
    label: 'Activity Logs',
    labelAr: 'سجل النشاط',
    icon: 'Activity',
    route: '/admin/activity',
    permissions: { view: 'activity.view', export: 'activity.export' },
  },
];

// Get filtered menu items based on user role
export const getFilteredMenuItems = (userRole: UserRole, serviceRole?: ServiceRole): MenuItem[] => {
  // If user has a service role, use service role permissions for menu filtering
  if (serviceRole) {
    const servicePermissions = SERVICE_ROLE_PERMISSIONS_MAP[serviceRole];
    return MENU_ITEMS.filter(item => {
      // Always show dashboard for service roles
      if (item.id === 'dashboard') return true;
      // Check if user has the view permission for this menu item
      return servicePermissions?.includes(item.permissions.view) ?? false;
    });
  }

  // No service role, use system role permissions
  return MENU_ITEMS.filter(item => hasPermission(userRole, item.permissions.view));
};

// =====================================================
// SERVICE PERMISSION HELPERS (Phase 6A-3)
// =====================================================

/**
 * Get all service roles as an array for UI selection
 */
export const getServiceRolesArray = (): { role: ServiceRole; label: string; labelAr: string; description: string; descriptionAr: string }[] => {
  return [
    {
      role: 'service_admin',
      label: 'Service Admin',
      labelAr: 'مدير الخدمات',
      description: 'Full access to manage all services including create, edit, delete, and publish',
      descriptionAr: 'صلاحيات كاملة لإدارة جميع الخدمات بما في ذلك الإنشاء والتعديل والحذف والنشر',
    },
    {
      role: 'service_editor',
      label: 'Service Editor',
      labelAr: 'محرر الخدمات',
      description: 'Can create new services and edit existing service content',
      descriptionAr: 'يمكن إنشاء خدمات جديدة وتعديل محتوى الخدمات الموجودة',
    },
    {
      role: 'service_seo_manager',
      label: 'SEO Manager',
      labelAr: 'مدير SEO',
      description: 'Can manage SEO settings and metadata for all services',
      descriptionAr: 'يمكن إدارة إعدادات تحسين محركات البحث والبيانات الوصفية لجميع الخدمات',
    },
    {
      role: 'service_translator',
      label: 'Service Translator',
      labelAr: 'مترجم الخدمات',
      description: 'Can translate service content between languages',
      descriptionAr: 'يمكن ترجمة محتوى الخدمات بين اللغات',
    },
    {
      role: 'service_viewer',
      label: 'Service Viewer',
      labelAr: 'مشاهد الخدمات',
      description: 'Can view services but cannot make any changes',
      descriptionAr: 'يمكن عرض الخدمات فقط دون إجراء أي تغييرات',
    },
  ];
};

/**
 * Check if a user can perform a specific action on services
 */
export const canPerformServiceAction = (
  systemRole: UserRole,
  serviceRole: ServiceRole | undefined,
  action: 'view' | 'create' | 'edit' | 'delete' | 'publish' | 'seo' | 'translate'
): boolean => {
  const effectivePermissions = getEffectivePermissions(systemRole, serviceRole);

  switch (action) {
    case 'view':
      return effectivePermissions.includes('services_view');
    case 'create':
      return effectivePermissions.includes('service_create');
    case 'edit':
      return effectivePermissions.includes('service_edit');
    case 'delete':
      return effectivePermissions.includes('service_delete');
    case 'publish':
      return effectivePermissions.includes('service_publish');
    case 'seo':
      return effectivePermissions.includes('service_seo_manage');
    case 'translate':
      return effectivePermissions.includes('service_translate');
    default:
      return false;
  }
};
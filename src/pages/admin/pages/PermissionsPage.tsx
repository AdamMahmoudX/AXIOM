// =====================================================
// PERMISSIONS PAGE - AXIOMX ADMIN SYSTEM
// Phase 5C: Role & Permissions Management
// Phase 5C-2: Permissions Matrix
// Phase 5C-3: Employee Permission Assignment
// =====================================================

import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { useEmployees } from '../../../context/EmployeeContext';
import { UserRole, ROLE_LABELS, Employee, EmployeePermissions } from '../../../types/user';
import { ROLE_PERMISSIONS, Permission } from '../../../types/permissions';
import {
  Shield,
  Users,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  Crown,
  UserCog,
  Briefcase,
  User,
  Eye,
  Edit,
  Trash2,
  Plus,
  Settings,
  Mail,
  MessageSquare,
  Paperclip,
  FolderKanban,
  Boxes,
  Tag,
  FileText,
  Activity,
  Lock,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  UserCircle,
  ChevronLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  Clock,
  UsersRound,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react';

// Permission categories
interface PermissionCategory {
  id: string;
  label: string;
  labelAr: string;
  icon: React.FC<{ className?: string }>;
  permissions: {
    key: keyof EmployeePermissions;
    label: string;
    labelAr: string;
    description: string;
    descriptionAr: string;
  }[];
}

const PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    id: 'projects',
    label: 'Projects',
    labelAr: 'المشاريع',
    icon: FolderKanban,
    permissions: [
      { key: 'projects_view', label: 'View Projects', labelAr: 'عرض المشاريع', description: 'View project list and details', descriptionAr: 'عرض قائمة المشروع وتفاصيله' },
      { key: 'projects_create', label: 'Create Projects', labelAr: 'إنشاء المشاريع', description: 'Create new projects', descriptionAr: 'إنشاء مشاريع جديدة' },
      { key: 'projects_edit', label: 'Edit Projects', labelAr: 'تعديل المشاريع', description: 'Edit existing projects', descriptionAr: 'تعديل المشاريع الموجودة' },
      { key: 'projects_delete', label: 'Delete Projects', labelAr: 'حذف المشاريع', description: 'Delete projects permanently', descriptionAr: 'حذف المشاريع نهائياً' },
    ],
  },
  {
    id: 'services',
    label: 'Services',
    labelAr: 'الخدمات',
    icon: Boxes,
    permissions: [
      { key: 'services_view', label: 'View Services', labelAr: 'عرض الخدمات', description: 'View services list', descriptionAr: 'عرض قائمة الخدمات' },
      { key: 'services_manage', label: 'Manage Services', labelAr: 'إدارة الخدمات', description: 'Create, edit, and delete services', descriptionAr: 'إنشاء وتعديل وحذف الخدمات' },
    ],
  },
  {
    id: 'articles',
    label: 'Articles',
    labelAr: 'المقالات',
    icon: FileText,
    permissions: [
      { key: 'articles_view', label: 'View Articles', labelAr: 'عرض المقالات', description: 'View articles list', descriptionAr: 'عرض قائمة المقالات' },
      { key: 'articles_create', label: 'Create Articles', labelAr: 'إنشاء المقالات', description: 'Create new articles', descriptionAr: 'إنشاء مقالات جديدة' },
      { key: 'articles_edit', label: 'Edit Articles', labelAr: 'تعديل المقالات', description: 'Edit existing articles', descriptionAr: 'تعديل المقالات الموجودة' },
      { key: 'articles_delete', label: 'Delete Articles', labelAr: 'حذف المقالات', description: 'Delete articles permanently', descriptionAr: 'حذف المقالات نهائياً' },
    ],
  },
  {
    id: 'team',
    label: 'Team Management',
    labelAr: 'إدارة الفريق',
    icon: Users,
    permissions: [
      { key: 'team_view', label: 'View Team', labelAr: 'عرض الفريق', description: 'View team members', descriptionAr: 'عرض أعضاء الفريق' },
      { key: 'team_manage', label: 'Manage Team', labelAr: 'إدارة الفريق', description: 'Add, edit, and remove team members', descriptionAr: 'إضافة وتعديل وإزالة أعضاء الفريق' },
    ],
  },
  {
    id: 'messages',
    label: 'Messages',
    labelAr: 'الرسائل',
    icon: Mail,
    permissions: [
      { key: 'messages_view', label: 'View Messages', labelAr: 'عرض الرسائل', description: 'View received messages', descriptionAr: 'عرض الرسائل المستلمة' },
      { key: 'messages_send', label: 'Send Messages', labelAr: 'إرسال الرسائل', description: 'Send messages to users', descriptionAr: 'إرسال الرسائل للمستخدمين' },
    ],
  },
  // Chat permissions removed - not defined in EmployeePermissions type
  {
    id: 'attachments',
    label: 'Attachments',
    labelAr: 'المرفقات',
    icon: Paperclip,
    permissions: [
      { key: 'attachments_view', label: 'View Attachments', labelAr: 'عرض المرفقات', description: 'View uploaded files', descriptionAr: 'عرض الملفات المرفوعة' },
      { key: 'attachments_upload', label: 'Upload Attachments', labelAr: 'رفع المرفقات', description: 'Upload new files', descriptionAr: 'رفع ملفات جديدة' },
      { key: 'attachments_delete', label: 'Delete Attachments', labelAr: 'حذف المرفقات', description: 'Delete uploaded files', descriptionAr: 'حذف الملفات المرفوعة' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    labelAr: 'الإعدادات',
    icon: Settings,
    permissions: [
      { key: 'settings_view', label: 'View Settings', labelAr: 'عرض الإعدادات', description: 'View system settings', descriptionAr: 'عرض إعدادات النظام' },
      { key: 'settings_edit', label: 'Edit Settings', labelAr: 'تعديل الإعدادات', description: 'Modify system settings', descriptionAr: 'تعديل إعدادات النظام' },
    ],
  },
  {
    id: 'permissions',
    label: 'Permissions',
    labelAr: 'الصلاحيات',
    icon: Shield,
    permissions: [
      { key: 'permissions_view', label: 'View Permissions', labelAr: 'عرض الصلاحيات', description: 'View role permissions', descriptionAr: 'عرض صلاحيات الأدوار' },
      { key: 'permissions_manage', label: 'Manage Permissions', labelAr: 'إدارة الصلاحيات', description: 'Modify role permissions', descriptionAr: 'تعديل صلاحيات الأدوار' },
    ],
  },
];

// Default permissions for each role
const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, EmployeePermissions> = {
  owner: {
    projects_view: true, projects_create: true, projects_edit: true, projects_delete: true,
    services_view: true, services_manage: true,
    articles_view: true, articles_create: true, articles_edit: true, articles_delete: true,
    messages_view: true, messages_send: true,
    attachments_view: true, attachments_upload: true, attachments_delete: true,
    team_view: true, team_manage: true,
    settings_view: true, settings_edit: true,
    permissions_view: true, permissions_manage: true,
  },
  admin: {
    projects_view: true, projects_create: true, projects_edit: true, projects_delete: true,
    services_view: true, services_manage: true,
    articles_view: true, articles_create: true, articles_edit: true, articles_delete: true,
    messages_view: true, messages_send: true,
    attachments_view: true, attachments_upload: true, attachments_delete: true,
    team_view: true, team_manage: true,
    settings_view: true, settings_edit: true,
    permissions_view: true, permissions_manage: false,
  },
  manager: {
    projects_view: true, projects_create: true, projects_edit: true, projects_delete: false,
    services_view: true, services_manage: true,
    articles_view: true, articles_create: true, articles_edit: true, articles_delete: false,
    messages_view: true, messages_send: true,
    attachments_view: true, attachments_upload: true, attachments_delete: false,
    team_view: true, team_manage: false,
    settings_view: true, settings_edit: false,
    permissions_view: true, permissions_manage: false,
  },
  employee: {
    projects_view: true, projects_create: false, projects_edit: false, projects_delete: false,
    services_view: true, services_manage: false,
    articles_view: true, articles_create: false, articles_edit: false, articles_delete: false,
    messages_view: true, messages_send: true,
    attachments_view: true, attachments_upload: false, attachments_delete: false,
    team_view: true, team_manage: false,
    settings_view: true, settings_edit: false,
    permissions_view: false, permissions_manage: false,
  },
};

// Role configuration
const ROLE_CONFIG: Record<UserRole, { icon: React.FC<{ className?: string }>; color: string; bgColor: string; borderColor: string }> = {
  owner: { icon: Crown, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30' },
  admin: { icon: UserCog, color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30' },
  manager: { icon: Briefcase, color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/30' },
  employee: { icon: User, color: 'text-gray-400', bgColor: 'bg-gray-500/10', borderColor: 'border-gray-500/30' },
};

// =====================================================
// EMPLOYEE PERMISSION ASSIGNMENT COMPONENT
// Phase 5C-3: Employee Role Management
// =====================================================

interface SuccessMessage {
  id: string;
  employeeName: string;
  oldRole: UserRole;
  newRole: UserRole;
  timestamp: number;
}

// Employee Row Component for Role Assignment
const EmployeeRoleRow: React.FC<{
  employee: Employee;
  canEdit: boolean;
  onRoleChange: (employeeId: string, newRole: UserRole) => void;
}> = ({ employee, canEdit, onRoleChange }) => {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(employee.role);
  const config = ROLE_CONFIG[employee.role];
  const Icon = config.icon;

  const handleRoleSelect = (newRole: UserRole) => {
    setSelectedRole(newRole);
    if (newRole !== employee.role) {
      onRoleChange(employee.id, newRole);
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden mb-3">
      {/* Employee Header */}
      <div className="px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-3 flex-1">
          {/* Avatar */}
          {employee.avatar ? (
            <img
              src={employee.avatar}
              alt={employee.fullName}
              className="w-10 h-10 rounded-full object-cover border border-white/10"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-white/10">
              <User className="w-5 h-5 text-blue-400" />
            </div>
          )}

          {/* Employee Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-medium text-sm truncate">
              {employee.fullName}
            </h4>
            <p className="text-xs text-gray-500 truncate">
              {employee.email}
            </p>
          </div>
        </div>

        {/* Current Role Badge */}
        <div className={`px-3 py-1.5 rounded-lg ${config.bgColor} border ${config.borderColor} flex items-center gap-2`}>
          {React.createElement(Icon, {
            className: `w-3.5 h-3.5 ${config.color}`
          })}
          <span className={`text-xs font-medium ${config.color}`}>
            {language === 'ar' ? ROLE_LABELS[employee.role].ar : ROLE_LABELS[employee.role].en}
          </span>
        </div>

        {/* Expand/Collapse Button */}
        {canEdit && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-3 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
        )}
      </div>

      {/* Role Selector Panel */}
      {isExpanded && canEdit && (
        <div className="px-4 py-4 bg-[#050505] border-t border-white/5">
          <h5 className="text-xs text-gray-500 uppercase tracking-wider mb-3">
            {language === 'ar' ? 'تغيير الدور' : 'Change Role'}
          </h5>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {(Object.keys(ROLE_LABELS) as UserRole[]).map(role => {
              const roleConfig = ROLE_CONFIG[role];
              const RoleIcon = roleConfig.icon;
              const isSelected = selectedRole === role;
              const isCurrentRole = employee.role === role;

              return (
                <button
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                  disabled={isCurrentRole}
                  className={`p-3 rounded-xl border transition-all duration-200 text-center ${
                    isCurrentRole
                      ? `${roleConfig.bgColor} ${roleConfig.borderColor} cursor-default`
                      : isSelected
                        ? `${roleConfig.bgColor} ${roleConfig.borderColor} ring-2 ring-offset-2 ring-offset-[#050505] ${roleConfig.borderColor.replace('/30', '/50')}`
                        : 'bg-[#0a0a0a] border-white/5 hover:border-white/10 hover:bg-white/5'
                  } ${!canEdit ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center ${
                    isCurrentRole ? roleConfig.bgColor : 'bg-white/5'
                  }`}>
                    {React.createElement(RoleIcon, {
                      className: `w-4 h-4 ${roleConfig.color}`
                    })}
                  </div>
                  <span className={`text-xs font-medium ${
                    isCurrentRole ? roleConfig.color : 'text-gray-300'
                  }`}>
                    {language === 'ar' ? ROLE_LABELS[role].ar : ROLE_LABELS[role].en}
                  </span>
                  {isCurrentRole && (
                    <div className="mt-1">
                      <Check className={`w-3.5 h-3.5 ${roleConfig.color} mx-auto`} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {selectedRole !== employee.role && (
            <div className="mt-4 flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <p className="text-xs text-amber-400">
                {language === 'ar'
                  ? `سيتم تغيير دور ${employee.fullName} من "${ROLE_LABELS[employee.role].ar}" إلى "${ROLE_LABELS[selectedRole].ar}"`
                  : `${employee.fullName}'s role will be changed from "${ROLE_LABELS[employee.role].en}" to "${ROLE_LABELS[selectedRole].en}"`}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Success Notification Component
const SuccessNotification: React.FC<{
  message: SuccessMessage;
  onDismiss: () => void;
}> = ({ message, onDismiss }) => {
  const { language } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="bg-[#0a0a0a] border border-green-500/30 rounded-xl p-4 shadow-2xl shadow-green-500/10 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-medium text-sm">
              {language === 'ar' ? 'تم تحديث الدور بنجاح' : 'Role Updated Successfully'}
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">
              {language === 'ar'
                ? `${message.employeeName} أصبح الآن ${ROLE_LABELS[message.newRole].ar}`
                : `${message.employeeName} is now ${ROLE_LABELS[message.newRole].en}`}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'ar'
                ? `من "${ROLE_LABELS[message.oldRole].ar}" إلى "${ROLE_LABELS[message.newRole].ar}"`
                : `From "${ROLE_LABELS[message.oldRole].en}" to "${ROLE_LABELS[message.newRole].en}"`}
            </p>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Employee Permission Assignment Component
const EmployeePermissionAssignment: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { employees, updateEmployeeRole } = useEmployees();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [successMessages, setSuccessMessages] = useState<SuccessMessage[]>([]);

  // Check if current user can manage permissions
  const canManagePermissions = user?.role === 'owner';

  // Filter employees based on search and role filter
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          emp.fullName.toLowerCase().includes(query) ||
          emp.email.toLowerCase().includes(query) ||
          emp.jobTitle.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Role filter
      if (filterRole !== 'all' && emp.role !== filterRole) {
        return false;
      }

      return true;
    });
  }, [employees, searchQuery, filterRole]);

  // Handle role change
  const handleRoleChange = (employeeId: string, newRole: UserRole) => {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return;

    const oldRole = employee.role;

    // Update role using EmployeeContext
    updateEmployeeRole(employeeId, newRole);

    // Add success message
    const message: SuccessMessage = {
      id: `msg_${Date.now()}`,
      employeeName: employee.fullName,
      oldRole,
      newRole,
      timestamp: Date.now(),
    };
    setSuccessMessages(prev => [...prev, message]);
  };

  // Dismiss success message
  const dismissSuccessMessage = (messageId: string) => {
    setSuccessMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  // Employee count by role
  const employeeCountByRole = useMemo(() => {
    const counts: Record<UserRole, number> = {
      owner: 0,
      admin: 0,
      manager: 0,
      employee: 0,
    };
    employees.forEach(emp => {
      if (counts[emp.role] !== undefined) {
        counts[emp.role]++;
      }
    });
    return counts;
  }, [employees]);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-green-400" />
            </div>
            {language === 'ar' ? 'تعيين صلاحيات الموظفين' : 'Employee Permission Assignment'}
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {language === 'ar'
              ? 'إدارة أدوار الموظفين وتحديث صلاحياتهم'
              : 'Manage employee roles and update their permissions'}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          {(Object.keys(ROLE_LABELS) as UserRole[]).map(role => {
            const config = ROLE_CONFIG[role];
            return (
              <div
                key={role}
                className={`px-3 py-1.5 rounded-lg ${config.bgColor} border ${config.borderColor}`}
              >
                <span className="text-xs font-medium text-gray-400">
                  {employeeCountByRole[role]} {language === 'ar' ? ROLE_LABELS[role].ar : ROLE_LABELS[role].en}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'البحث عن موظف...' : 'Search employees...'}
            className="w-full pr-10 pl-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
          />
        </div>

        {/* Role Filter */}
        <div className="relative">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as UserRole | 'all')}
            className="appearance-none px-4 py-2.5 pr-10 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-green-500/50 transition-colors cursor-pointer"
          >
            <option value="all">{language === 'ar' ? 'جميع الأدوار' : 'All Roles'}</option>
            {(Object.keys(ROLE_LABELS) as UserRole[]).map(role => (
              <option key={role} value={role}>
                {language === 'ar' ? ROLE_LABELS[role].ar : ROLE_LABELS[role].en}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Permission Notice */}
      {!canManagePermissions && (
        <div className="px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3">
          <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <p className="text-sm text-amber-400">
            {language === 'ar'
              ? 'لا يمكنك تعديل صلاحيات الموظفين. فقط المالك يمكنه ذلك.'
              : 'You cannot modify employee permissions. Only the Owner can do this.'}
          </p>
        </div>
      )}

      {/* Employee List */}
      <div className="space-y-3">
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-12 bg-[#0a0a0a] border border-white/5 rounded-xl">
            <UserCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">
              {language === 'ar' ? 'لم يتم العثور على موظفين' : 'No employees found'}
            </p>
          </div>
        ) : (
          filteredEmployees.map(employee => (
            <EmployeeRoleRow
              key={employee.id}
              employee={employee}
              canEdit={canManagePermissions}
              onRoleChange={handleRoleChange}
            />
          ))
        )}
      </div>

      {/* Success Messages */}
      {successMessages.map(message => (
        <SuccessNotification
          key={message.id}
          message={message}
          onDismiss={() => dismissSuccessMessage(message.id)}
        />
      ))}
    </div>
  );
};

// Role Card Component
const RoleCard: React.FC<{
  role: UserRole;
  employeeCount: number;
  isSelected: boolean;
  onClick: () => void;
}> = ({ role, employeeCount, isSelected, onClick }) => {
  const { language } = useLanguage();
  const config = ROLE_CONFIG[role];
  const Icon = config.icon;
  const roleLabels = ROLE_LABELS[role];

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-xl border transition-all duration-200 text-left ${
        isSelected
          ? `${config.bgColor} ${config.borderColor} ring-2 ring-offset-2 ring-offset-[#0a0a0a] ${config.borderColor.replace('/30', '/50')}`
          : 'bg-[#0a0a0a] border-white/5 hover:border-white/10 hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${config.bgColor} border ${config.borderColor} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>
        <div>
          <h3 className="text-white font-semibold">
            {language === 'ar' ? roleLabels.ar : roleLabels.en}
          </h3>
          <p className="text-xs text-gray-500">
            {language === 'ar' ? 'الدور' : 'Role'}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">
          {employeeCount} {language === 'ar' ? 'موظف' : 'employees'}
        </span>
        {isSelected && (
          <div className={`w-2 h-2 rounded-full ${config.color.replace('text-', 'bg-')}`} />
        )}
      </div>
    </button>
  );
};

// Permission Toggle Component
const PermissionToggle: React.FC<{
  hasPermission: boolean;
  canEdit: boolean;
}> = ({ hasPermission, canEdit }) => {
  if (!canEdit) {
    return (
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
        hasPermission ? 'bg-green-500/20' : 'bg-gray-500/10'
      }`}>
        {hasPermission ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <X className="w-4 h-4 text-gray-500" />
        )}
      </div>
    );
  }

  return (
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-not-allowed ${
      hasPermission ? 'bg-green-500/20' : 'bg-gray-500/10'
    }`}>
      {hasPermission ? (
        <Check className="w-4 h-4 text-green-400" />
      ) : (
        <X className="w-4 h-4 text-gray-500" />
      )}
    </div>
  );
};

// Category Expand/Collapse Component
const CategoryRow: React.FC<{
  category: PermissionCategory;
  isExpanded: boolean;
  onToggle: () => void;
  selectedRole: UserRole;
  canEditPermissions: boolean;
}> = ({ category, isExpanded, onToggle, selectedRole, canEditPermissions }) => {
  const { language } = useLanguage();
  const permissions = DEFAULT_ROLE_PERMISSIONS[selectedRole];
  const Icon = category.icon;

  // Count enabled permissions
  const enabledCount = category.permissions.filter(p => permissions[p.key]).length;
  const totalCount = category.permissions.length;

  return (
    <>
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between bg-[#0a0a0a] hover:bg-white/5 transition-colors border-b border-white/5"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4 text-gray-400" />
          <span className="text-white font-medium">
            {language === 'ar' ? category.labelAr : category.label}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {enabledCount}/{totalCount}
          </span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="bg-[#050505]">
          {category.permissions.map((perm, index) => {
            const isEnabled = permissions[perm.key];
            return (
              <div
                key={perm.key}
                className={`px-6 py-4 flex items-center justify-between ${
                  index < category.permissions.length - 1 ? 'border-b border-white/5' : ''
                }`}
              >
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white">
                    {language === 'ar' ? perm.labelAr : perm.label}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {language === 'ar' ? perm.descriptionAr : perm.description}
                  </p>
                </div>
                <PermissionToggle
                  hasPermission={isEnabled}
                  canEdit={canEditPermissions}
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

// =====================================================
// PERMISSIONS MATRIX COMPONENT - Phase 5C-2
// =====================================================

interface MatrixPermission {
  key: Permission;
  label: string;
  labelAr: string;
  category: string;
  categoryAr: string;
}

// All permissions from permissions.ts mapped for display
const MATRIX_PERMISSIONS: MatrixPermission[] = [
  // Dashboard
  { key: 'dashboard.view', label: 'View Dashboard', labelAr: 'عرض لوحة التحكم', category: 'Dashboard', categoryAr: 'لوحة التحكم' },
  // Projects
  { key: 'projects.view', label: 'View Projects', labelAr: 'عرض المشاريع', category: 'Projects', categoryAr: 'المشاريع' },
  { key: 'projects.create', label: 'Create Projects', labelAr: 'إنشاء المشاريع', category: 'Projects', categoryAr: 'المشاريع' },
  { key: 'projects.edit', label: 'Edit Projects', labelAr: 'تعديل المشاريع', category: 'Projects', categoryAr: 'المشاريع' },
  { key: 'projects.delete', label: 'Delete Projects', labelAr: 'حذف المشاريع', category: 'Projects', categoryAr: 'المشاريع' },
  // Services
  { key: 'services.view', label: 'View Services', labelAr: 'عرض الخدمات', category: 'Services', categoryAr: 'الخدمات' },
  { key: 'services.manage', label: 'Manage Services', labelAr: 'إدارة الخدمات', category: 'Services', categoryAr: 'الخدمات' },
  // Categories
  { key: 'categories.view', label: 'View Categories', labelAr: 'عرض الفئات', category: 'Categories', categoryAr: 'الفئات' },
  { key: 'categories.manage', label: 'Manage Categories', labelAr: 'إدارة الفئات', category: 'Categories', categoryAr: 'الفئات' },
  // Articles
  { key: 'articles.view', label: 'View Articles', labelAr: 'عرض المقالات', category: 'Articles', categoryAr: 'المقالات' },
  { key: 'articles.manage', label: 'Manage Articles', labelAr: 'إدارة المقالات', category: 'Articles', categoryAr: 'المقالات' },
  // Team
  { key: 'team.view', label: 'View Team', labelAr: 'عرض الفريق', category: 'Team', categoryAr: 'الفريق' },
  { key: 'team.manage', label: 'Manage Team', labelAr: 'إدارة الفريق', category: 'Team', categoryAr: 'الفريق' },
  // Messages
  { key: 'messages.view', label: 'View Messages', labelAr: 'عرض الرسائل', category: 'Messages', categoryAr: 'الرسائل' },
  { key: 'messages.send', label: 'Send Messages', labelAr: 'إرسال الرسائل', category: 'Messages', categoryAr: 'الرسائل' },
  // Chat
  { key: 'chat.view', label: 'View Chat', labelAr: 'عرض الدردشة', category: 'Chat', categoryAr: 'الدردشة' },
  { key: 'chat.use', label: 'Use Chat', labelAr: 'استخدام الدردشة', category: 'Chat', categoryAr: 'الدردشة' },
  // Attachments
  { key: 'attachments.view', label: 'View Attachments', labelAr: 'عرض المرفقات', category: 'Attachments', categoryAr: 'المرفقات' },
  { key: 'attachments.upload', label: 'Upload Attachments', labelAr: 'رفع المرفقات', category: 'Attachments', categoryAr: 'المرفقات' },
  { key: 'attachments.delete', label: 'Delete Attachments', labelAr: 'حذف المرفقات', category: 'Attachments', categoryAr: 'المرفقات' },
  // Settings
  { key: 'settings.view', label: 'View Settings', labelAr: 'عرض الإعدادات', category: 'Settings', categoryAr: 'الإعدادات' },
  { key: 'settings.edit', label: 'Edit Settings', labelAr: 'تعديل الإعدادات', category: 'Settings', categoryAr: 'الإعدادات' },
  // Permissions
  { key: 'permissions.view', label: 'View Permissions', labelAr: 'عرض الصلاحيات', category: 'Permissions', categoryAr: 'الصلاحيات' },
  { key: 'permissions.manage', label: 'Manage Permissions', labelAr: 'إدارة الصلاحيات', category: 'Permissions', categoryAr: 'الصلاحيات' },
  // Activity
  { key: 'activity.view', label: 'View Activity', labelAr: 'عرض النشاط', category: 'Activity', categoryAr: 'النشاط' },
  { key: 'activity.export', label: 'Export Activity', labelAr: 'تصدير النشاط', category: 'Activity', categoryAr: 'النشاط' },
  // SEO
  { key: 'seo.view', label: 'View SEO Dashboard', labelAr: 'عرض لوحة SEO', category: 'SEO', categoryAr: 'SEO' },
];

// Roles to display in matrix
const MATRIX_ROLES: UserRole[] = ['owner', 'admin', 'manager', 'employee'];

// Role column configuration
const ROLE_COLUMNS: Record<UserRole, { color: string; bgColor: string; borderColor: string }> = {
  owner: { color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/50' },
  admin: { color: 'text-blue-400', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/50' },
  manager: { color: 'text-amber-400', bgColor: 'bg-amber-500/20', borderColor: 'border-amber-500/50' },
  employee: { color: 'text-gray-400', bgColor: 'bg-gray-500/20', borderColor: 'border-gray-500/50' },
};

// Permissions Matrix Component
const PermissionsMatrix: React.FC = () => {
  const { language } = useLanguage();

  // Group permissions by category
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, MatrixPermission[]> = {};
    MATRIX_PERMISSIONS.forEach(perm => {
      const catKey = language === 'ar' ? perm.categoryAr : perm.category;
      if (!groups[catKey]) {
        groups[catKey] = [];
      }
      groups[catKey].push(perm);
    });
    return groups;
  }, [language]);

  // Check if permission is allowed for role
  const isAllowed = (role: UserRole, permission: Permission): boolean => {
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
  };

  // Get category groups in order
  const categoryOrder = language === 'ar'
    ? ['لوحة التحكم', 'المشاريع', 'الخدمات', 'الفئات', 'المقالات', 'الفريق', 'الرسائل', 'الدردشة', 'المرفقات', 'الإعدادات', 'الصلاحيات', 'النشاط', 'SEO']
    : ['Dashboard', 'Projects', 'Services', 'Categories', 'Articles', 'Team', 'Messages', 'Chat', 'Attachments', 'Settings', 'Permissions', 'Activity', 'SEO'];

  const orderedCategories = categoryOrder.filter(cat => groupedPermissions[cat]);

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
      {/* Matrix Header */}
      <div className="px-4 py-3 border-b border-white/5 bg-[#050505]">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-400" />
          {language === 'ar' ? 'جدول الصلاحيات' : 'Permissions Matrix'}
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          {language === 'ar'
            ? 'جميع الصلاحيات مقسمة حسب الأدوار - الصفوف = الصلاحيات، الأعمدة = الأدوار'
            : 'All permissions by role - Rows = Permissions, Columns = Roles'}
        </p>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          {/* Table Header - Roles */}
          <thead>
            <tr className="border-b border-white/10">
              {/* Permission Column Header */}
              <th className="px-4 py-3 text-left sticky left-0 bg-[#0a0a0a] z-10 w-[280px]">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {language === 'ar' ? 'الصلاحية' : 'Permission'}
                </span>
              </th>
              {/* Role Headers */}
              {MATRIX_ROLES.map(role => {
                const config = ROLE_COLUMNS[role];
                return (
                  <th
                    key={role}
                    className={`px-4 py-3 text-center min-w-[100px]`}
                  >
                    <div className={`inline-flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
                      {React.createElement(ROLE_CONFIG[role].icon, {
                        className: `w-4 h-4 ${config.color}`
                      })}
                      <span className={`text-xs font-semibold ${config.color}`}>
                        {language === 'ar' ? ROLE_LABELS[role].ar : ROLE_LABELS[role].en}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Body - Permissions by Category */}
          <tbody>
            {orderedCategories.map((category, catIndex) => (
              <React.Fragment key={category}>
                {/* Category Row */}
                <tr className="bg-[#050505] border-y border-white/5">
                  <td colSpan={5} className="px-4 py-2">
                    <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      {category}
                    </span>
                  </td>
                </tr>
                {/* Permission Rows */}
                {groupedPermissions[category].map((perm, permIndex) => (
                  <tr
                    key={perm.key}
                    className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${
                      permIndex === groupedPermissions[category].length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    {/* Permission Name */}
                    <td className="px-4 py-3 sticky left-0 bg-[#0a0a0a] z-10">
                      <div className="flex flex-col">
                        <span className="text-sm text-white font-medium">
                          {language === 'ar' ? perm.labelAr : perm.label}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">
                          {perm.key}
                        </span>
                      </div>
                    </td>
                    {/* Role Status */}
                    {MATRIX_ROLES.map(role => {
                      const allowed = isAllowed(role, perm.key);
                      const config = ROLE_COLUMNS[role];
                      return (
                        <td key={role} className="px-4 py-3 text-center">
                          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${
                            allowed
                              ? 'bg-green-500/20 border border-green-500/30'
                              : 'bg-gray-500/10 border border-gray-500/20'
                          }`}>
                            {allowed ? (
                              <Check className="w-5 h-5 text-green-400" />
                            ) : (
                              <X className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {/* Category Footer Spacer */}
                {catIndex < orderedCategories.length - 1 && (
                  <tr>
                    <td colSpan={5} className="h-2 bg-transparent" />
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Matrix Legend */}
      <div className="px-4 py-3 border-t border-white/5 bg-[#050505] flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-green-500/20 border border-green-500/30 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-green-400" />
          </div>
          <span className="text-xs text-gray-400">
            {language === 'ar' ? 'مسموح (Allowed)' : 'Allowed'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gray-500/10 border border-gray-500/20 flex items-center justify-center">
            <X className="w-3.5 h-3.5 text-gray-500" />
          </div>
          <span className="text-xs text-gray-400">
            {language === 'ar' ? 'مرفوض (Denied)' : 'Denied'}
          </span>
        </div>
      </div>
    </div>
  );
};

// Main Permissions Page Component
const PermissionsPage: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { employees } = useEmployees();

  const [selectedRole, setSelectedRole] = useState<UserRole>('owner');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['projects']));
  const [searchQuery, setSearchQuery] = useState('');

  // Check if current user can manage permissions
  const canManagePermissions = user?.role === 'owner';

  // Count employees by role
  const employeeCountByRole = useMemo(() => {
    const counts: Record<UserRole, number> = {
      owner: 0,
      admin: 0,
      manager: 0,
      employee: 0,
    };
    employees.forEach(emp => {
      if (counts[emp.role] !== undefined) {
        counts[emp.role]++;
      }
    });
    return counts;
  }, [employees]);

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  // Expand/collapse all categories
  const expandAll = () => {
    setExpandedCategories(new Set(PERMISSION_CATEGORIES.map(c => c.id)));
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  // Get total permissions count for selected role
  const getTotalPermissions = (role: UserRole) => {
    const perms = DEFAULT_ROLE_PERMISSIONS[role];
    return Object.values(perms).filter(v => v).length;
  };

  const totalPermissions = getTotalPermissions(selectedRole);
  const maxPermissions = Object.keys(DEFAULT_ROLE_PERMISSIONS.owner).length;
  const permissionPercentage = Math.round((totalPermissions / maxPermissions) * 100);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            {language === 'ar' ? 'إدارة الأدوار والصلاحيات' : 'Role & Permissions Management'}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {language === 'ar'
              ? 'إدارة صلاحيات الوصول للمستخدمين حسب أدوارهم'
              : 'Manage access permissions for users based on their roles'}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'البحث...' : 'Search...'}
            className="w-full pr-10 pl-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
      </div>

      {/* =====================================================
          ROLE ANALYTICS SECTION
          Phase 5C-4: Role Analytics Dashboard
          ===================================================== */}

      {/* Role Analytics Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-purple-400" />
          </div>
          {language === 'ar' ? 'تحليلات الأدوار' : 'Role Analytics'}
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          {language === 'ar'
            ? 'إحصائيات وتوزيع الأدوار في النظام'
            : 'Role statistics and distribution in the system'}
        </p>
      </div>

      {/* Role Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {/* Total Employees Card */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <UsersRound className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xs text-gray-500">
              {language === 'ar' ? 'الإجمالي' : 'Total'}
            </span>
          </div>
          <div className="text-2xl font-bold text-white">{employees.length}</div>
          <div className="text-xs text-gray-500 mt-1">
            {language === 'ar' ? 'موظف' : 'employees'}
          </div>
        </div>

        {/* Owner Card */}
        <div className="bg-[#0a0a0a] border border-yellow-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Crown className="w-5 h-5 text-yellow-400" />
            </div>
            <span className="text-xs text-yellow-400/70">
              {language === 'ar' ? 'المالك' : 'Owner'}
            </span>
          </div>
          <div className="text-2xl font-bold text-yellow-400">{employeeCountByRole.owner}</div>
          <div className="text-xs text-gray-500 mt-1">
            {employees.length > 0 ? `${Math.round((employeeCountByRole.owner / employees.length) * 100)}%` : '0%'}
          </div>
        </div>

        {/* Admin Card */}
        <div className="bg-[#0a0a0a] border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <UserCog className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xs text-blue-400/70">
              {language === 'ar' ? 'مدير' : 'Admin'}
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{employeeCountByRole.admin}</div>
          <div className="text-xs text-gray-500 mt-1">
            {employees.length > 0 ? `${Math.round((employeeCountByRole.admin / employees.length) * 100)}%` : '0%'}
          </div>
        </div>

        {/* Manager Card */}
        <div className="bg-[#0a0a0a] border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-xs text-amber-400/70">
              {language === 'ar' ? 'مدير' : 'Manager'}
            </span>
          </div>
          <div className="text-2xl font-bold text-amber-400">{employeeCountByRole.manager}</div>
          <div className="text-xs text-gray-500 mt-1">
            {employees.length > 0 ? `${Math.round((employeeCountByRole.manager / employees.length) * 100)}%` : '0%'}
          </div>
        </div>

        {/* Employee Card */}
        <div className="bg-[#0a0a0a] border border-gray-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-gray-500/20 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <span className="text-xs text-gray-400/70">
              {language === 'ar' ? 'موظف' : 'Employee'}
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-400">{employeeCountByRole.employee}</div>
          <div className="text-xs text-gray-500 mt-1">
            {employees.length > 0 ? `${Math.round((employeeCountByRole.employee / employees.length) * 100)}%` : '0%'}
          </div>
        </div>
      </div>

      {/* Role Distribution & Summary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Role Distribution Chart */}
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-400" />
              {language === 'ar' ? 'توزيع الأدوار' : 'Role Distribution'}
            </h3>
            <span className="text-xs text-gray-500">
              {language === 'ar' ? 'النسبة من الإجمالي' : '% of Total'}
            </span>
          </div>

          {/* Simple Bar Chart */}
          <div className="space-y-3">
            {(Object.keys(ROLE_LABELS) as UserRole[]).map(role => {
              const count = employeeCountByRole[role];
              const percentage = employees.length > 0 ? (count / employees.length) * 100 : 0;
              const config = ROLE_CONFIG[role];

              return (
                <div key={role} className="flex items-center gap-4">
                  <div className="w-24 flex items-center gap-2">
                    {React.createElement(config.icon, {
                      className: `w-4 h-4 ${config.color}`
                    })}
                    <span className="text-sm text-gray-400">
                      {language === 'ar' ? ROLE_LABELS[role].ar : ROLE_LABELS[role].en}
                    </span>
                  </div>
                  <div className="flex-1 h-8 bg-white/5 rounded-lg overflow-hidden relative">
                    <div
                      className={`h-full rounded-lg transition-all duration-500 ${config.bgColor.replace('/20', '/30')}`}
                      style={{ width: `${Math.max(percentage, 2)}%` }}
                    />
                    <div className="absolute inset-0 flex items-center px-3">
                      <span className="text-xs text-white/80 font-medium">
                        {count} {language === 'ar' ? 'موظف' : 'employees'}
                      </span>
                    </div>
                  </div>
                  <div className="w-16 text-right">
                    <span className={`text-sm font-semibold ${config.color}`}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Role Summary Panel */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4">
          <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-green-400" />
            {language === 'ar' ? 'ملخص الأدوار' : 'Role Summary'}
          </h3>

          <div className="space-y-4">
            {/* Most Used Role */}
            {(() => {
              const mostUsedRole = (Object.keys(employeeCountByRole) as UserRole[]).reduce(
                (a, b) => employeeCountByRole[a] > employeeCountByRole[b] ? a : b
              );
              const config = ROLE_CONFIG[mostUsedRole];
              return (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">
                      {language === 'ar' ? 'أكثر دور مستخدم' : 'Most Used Role'}
                    </span>
                    <ArrowUp className="w-3 h-3 text-green-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    {React.createElement(config.icon, {
                      className: `w-4 h-4 ${config.color}`
                    })}
                    <span className={`text-sm font-semibold ${config.color}`}>
                      {language === 'ar' ? ROLE_LABELS[mostUsedRole].ar : ROLE_LABELS[mostUsedRole].en}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-white mt-1">
                    {employeeCountByRole[mostUsedRole]} {language === 'ar' ? 'موظف' : 'employees'}
                  </div>
                </div>
              );
            })()}

            {/* Least Used Role */}
            {(() => {
              const leastUsedRole = (Object.keys(employeeCountByRole) as UserRole[]).reduce(
                (a, b) => employeeCountByRole[a] < employeeCountByRole[b] ? a : b
              );
              const config = ROLE_CONFIG[leastUsedRole];
              return (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">
                      {language === 'ar' ? 'أقل دور مستخدم' : 'Least Used Role'}
                    </span>
                    <ArrowDown className="w-3 h-3 text-red-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    {React.createElement(config.icon, {
                      className: `w-4 h-4 ${config.color}`
                    })}
                    <span className={`text-sm font-semibold ${config.color}`}>
                      {language === 'ar' ? ROLE_LABELS[leastUsedRole].ar : ROLE_LABELS[leastUsedRole].en}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-white mt-1">
                    {employeeCountByRole[leastUsedRole]} {language === 'ar' ? 'موظف' : 'employees'}
                  </div>
                </div>
              );
            })()}

            {/* Active Roles Count */}
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">
                  {language === 'ar' ? 'عدد الأدوار النشطة' : 'Active Roles'}
                </span>
                <Minus className="w-3 h-3 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-blue-400">
                {Object.values(employeeCountByRole).filter(count => count > 0).length}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {language === 'ar' ? 'دور مستخدم' : 'roles in use'}
              </div>
            </div>

            {/* Last Permission Update (UI Only) */}
            <div className="p-3 bg-gray-500/10 border border-gray-500/20 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">
                  {language === 'ar' ? 'آخر تحديث للصلاحيات' : 'Last Update'}
                </span>
                <Clock className="w-3 h-3 text-gray-400" />
              </div>
              <div className="text-sm font-medium text-white">
                {new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {language === 'ar' ? 'واجهة فقط' : 'Interface only'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {(Object.keys(ROLE_LABELS) as UserRole[]).map(role => (
          <RoleCard
            key={role}
            role={role}
            employeeCount={employeeCountByRole[role]}
            isSelected={selectedRole === role}
            onClick={() => setSelectedRole(role)}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Permissions Matrix - Full Width */}
        <PermissionsMatrix />

        {/* Role Cards & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Permissions Categories - Left (2/3) */}
          <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
            {/* Matrix Header */}
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-white font-semibold">
                  {language === 'ar' ? 'صلاحيات الدور' : 'Role Permissions'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {language === 'ar'
                    ? `${ROLE_LABELS[selectedRole].ar} - ${totalPermissions} من ${maxPermissions} صلاحية مفعلة`
                    : `${ROLE_LABELS[selectedRole].en} - ${totalPermissions} of ${maxPermissions} permissions enabled`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={expandAll}
                  className="px-3 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  {language === 'ar' ? 'توسيع الكل' : 'Expand All'}
                </button>
                <button
                  onClick={collapseAll}
                  className="px-3 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  {language === 'ar' ? 'طي الكل' : 'Collapse All'}
                </button>
              </div>
            </div>

            {/* Permission Percentage Bar */}
            <div className="px-4 py-3 bg-[#050505] border-b border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">
                  {language === 'ar' ? 'نسبة الصلاحيات المفعلة' : 'Permission Coverage'}
                </span>
                <span className="text-xs text-white font-medium">{permissionPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    permissionPercentage === 100 ? 'bg-green-500' :
                    permissionPercentage >= 75 ? 'bg-blue-500' :
                    permissionPercentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${permissionPercentage}%` }}
                />
              </div>
            </div>

            {/* Categories List */}
            <div className="max-h-[calc(100vh-480px)] overflow-y-auto">
              {PERMISSION_CATEGORIES.filter(cat => {
                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase();
                return (
                  cat.label.toLowerCase().includes(query) ||
                  cat.labelAr.includes(query) ||
                  cat.permissions.some(p =>
                    p.label.toLowerCase().includes(query) ||
                    p.labelAr.includes(query)
                  )
                );
              }).map(category => (
                <CategoryRow
                  key={category.id}
                  category={category}
                  isExpanded={expandedCategories.has(category.id)}
                  onToggle={() => toggleCategory(category.id)}
                  selectedRole={selectedRole}
                  canEditPermissions={canManagePermissions}
                />
              ))}
            </div>

            {/* Lock Notice */}
            {!canManagePermissions && (
              <div className="px-4 py-3 bg-amber-500/10 border-t border-amber-500/20 flex items-center gap-3">
                <Lock className="w-4 h-4 text-amber-400" />
                <p className="text-xs text-amber-400">
                  {language === 'ar'
                    ? 'لا يمكنك تعديل الصلاحيات. فقط المالك يمكنه ذلك.'
                    : 'You cannot modify permissions. Only the Owner can do this.'}
                </p>
              </div>
            )}
          </div>

          {/* Role Details - Right (1/3) */}
          <div className="space-y-6">
            {/* Selected Role Info */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-4">
                {language === 'ar' ? 'تفاصيل الدور' : 'Role Details'}
              </h3>

              <div className="space-y-4">
                {/* Role Icon & Name */}
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${ROLE_CONFIG[selectedRole].bgColor} border ${ROLE_CONFIG[selectedRole].borderColor} flex items-center justify-center`}>
                    {React.createElement(ROLE_CONFIG[selectedRole].icon, {
                      className: `w-6 h-6 ${ROLE_CONFIG[selectedRole].color}`
                    })}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">
                      {language === 'ar' ? ROLE_LABELS[selectedRole].ar : ROLE_LABELS[selectedRole].en}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {employeeCountByRole[selectedRole]} {language === 'ar' ? 'موظف' : 'employees'}
                    </p>
                  </div>
                </div>

                {/* Permission Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="text-2xl font-bold text-green-400">{totalPermissions}</div>
                    <div className="text-xs text-gray-400">
                      {language === 'ar' ? 'صلاحية مفعلة' : 'Enabled'}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-500/10 rounded-lg border border-gray-500/20">
                    <div className="text-2xl font-bold text-gray-400">{maxPermissions - totalPermissions}</div>
                    <div className="text-xs text-gray-400">
                      {language === 'ar' ? 'صلاحية معطلة' : 'Disabled'}
                    </div>
                  </div>
                </div>

                {/* Quick Permission Summary */}
                <div className="pt-4 border-t border-white/5">
                  <h5 className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                    {language === 'ar' ? 'ملخص الصلاحيات' : 'Permission Summary'}
                  </h5>
                  <div className="space-y-2">
                    {[
                      { key: 'projects', label: language === 'ar' ? 'المشاريع' : 'Projects', icon: FolderKanban },
                      { key: 'services', label: language === 'ar' ? 'الخدمات' : 'Services', icon: Boxes },
                      { key: 'articles', label: language === 'ar' ? 'المقالات' : 'Articles', icon: FileText },
                      { key: 'team', label: language === 'ar' ? 'الفريق' : 'Team', icon: Users },
                      { key: 'messages', label: language === 'ar' ? 'الرسائل' : 'Messages', icon: Mail },
                      { key: 'settings', label: language === 'ar' ? 'الإعدادات' : 'Settings', icon: Settings },
                    ].map(item => {
                      const category = PERMISSION_CATEGORIES.find(c => c.id === item.key);
                      if (!category) return null;
                      const perms = DEFAULT_ROLE_PERMISSIONS[selectedRole];
                      const enabled = category.permissions.filter(p => perms[p.key]).length;
                      const total = category.permissions.length;
                      const Icon = item.icon;

                      return (
                        <div key={item.key} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-sm text-gray-400">{item.label}</span>
                          </div>
                          <span className={`text-xs font-medium ${
                            enabled === total ? 'text-green-400' :
                            enabled > 0 ? 'text-amber-400' : 'text-gray-500'
                          }`}>
                            {enabled}/{total}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Role Comparison */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-4">
                {language === 'ar' ? 'مقارنة الأدوار' : 'Role Comparison'}
              </h3>

              <div className="space-y-3">
                {(Object.keys(ROLE_LABELS) as UserRole[]).map(role => {
                  const rolePerms = getTotalPermissions(role);
                  const isSelected = selectedRole === role;
                  const config = ROLE_CONFIG[role];

                  return (
                    <div
                      key={role}
                      className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                        isSelected
                          ? `${config.bgColor} ${config.borderColor}`
                          : 'border-white/5 hover:border-white/10'
                      }`}
                      onClick={() => setSelectedRole(role)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {React.createElement(config.icon, {
                            className: `w-4 h-4 ${config.color}`
                          })}
                          <span className="text-sm text-white font-medium">
                            {language === 'ar' ? ROLE_LABELS[role].ar : ROLE_LABELS[role].en}
                          </span>
                        </div>
                        <span className={`text-xs font-medium ${
                          rolePerms === maxPermissions ? 'text-green-400' :
                          rolePerms >= maxPermissions * 0.75 ? 'text-blue-400' :
                          rolePerms >= maxPermissions * 0.5 ? 'text-amber-400' : 'text-gray-400'
                        }`}>
                          {rolePerms}/{maxPermissions}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            rolePerms === maxPermissions ? 'bg-green-500' :
                            rolePerms >= maxPermissions * 0.75 ? 'bg-blue-500' :
                            rolePerms >= maxPermissions * 0.5 ? 'bg-amber-500' : 'bg-gray-500'
                          }`}
                          style={{ width: `${(rolePerms / maxPermissions) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3">
                {language === 'ar' ? 'دليل الرموز' : 'Legend'}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-green-400" />
                  </div>
                  <span className="text-sm text-gray-400">
                    {language === 'ar' ? 'صلاحية مفعلة' : 'Permission enabled'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-gray-500/10 flex items-center justify-center">
                    <X className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  <span className="text-sm text-gray-400">
                    {language === 'ar' ? 'صلاحية معطلة' : 'Permission disabled'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-amber-500/20 flex items-center justify-center">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <span className="text-sm text-gray-400">
                    {language === 'ar' ? 'للقراءة فقط' : 'View only'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Permission Assignment Section */}
        <EmployeePermissionAssignment />
      </div>
    </div>
  );
};

export default PermissionsPage;
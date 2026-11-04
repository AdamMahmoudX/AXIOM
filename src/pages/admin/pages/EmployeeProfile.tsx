// =====================================================
// EMPLOYEE PROFILE PAGE - AXIOMX ADMIN SYSTEM
// Phase 3: Employee Management System
// =====================================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmployees } from '../../../context/EmployeeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { EmployeePermissions, DEFAULT_ROLE_PERMISSIONS, UserRole } from '../../../types/user';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  Calendar,
  Clock,
  Shield,
  Edit2,
  Check,
  X,
  Save,
  UserX,
  UserCheck,
  FileText,
  Briefcase,
} from 'lucide-react';

// Permission category
interface PermissionCategory {
  title: string;
  titleAr: string;
  icon: string;
  permissions: { key: keyof EmployeePermissions; label: string; labelAr: string }[];
}

// Permission categories
const PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    title: 'Projects',
    titleAr: 'المشاريع',
    icon: 'FolderKanban',
    permissions: [
      { key: 'projects_view', label: 'View', labelAr: 'عرض' },
      { key: 'projects_create', label: 'Create', labelAr: 'إنشاء' },
      { key: 'projects_edit', label: 'Edit', labelAr: 'تعديل' },
      { key: 'projects_delete', label: 'Delete', labelAr: 'حذف' },
    ],
  },
  {
    title: 'Services',
    titleAr: 'الخدمات',
    icon: 'Boxes',
    permissions: [
      { key: 'services_view', label: 'View', labelAr: 'عرض' },
      { key: 'services_manage', label: 'Manage', labelAr: 'إدارة' },
    ],
  },
  {
    title: 'Articles',
    titleAr: 'المقالات',
    icon: 'FileText',
    permissions: [
      { key: 'articles_view', label: 'View', labelAr: 'عرض' },
      { key: 'articles_create', label: 'Create', labelAr: 'إنشاء' },
      { key: 'articles_edit', label: 'Edit', labelAr: 'تعديل' },
      { key: 'articles_delete', label: 'Delete', labelAr: 'حذف' },
    ],
  },
  {
    title: 'Messages',
    titleAr: 'الرسائل',
    icon: 'Mail',
    permissions: [
      { key: 'messages_view', label: 'View', labelAr: 'عرض' },
      { key: 'messages_send', label: 'Send', labelAr: 'إرسال' },
    ],
  },
  {
    title: 'Attachments',
    titleAr: 'المرفقات',
    icon: 'Paperclip',
    permissions: [
      { key: 'attachments_view', label: 'View', labelAr: 'عرض' },
      { key: 'attachments_upload', label: 'Upload', labelAr: 'رفع' },
      { key: 'attachments_delete', label: 'Delete', labelAr: 'حذف' },
    ],
  },
  {
    title: 'Team',
    titleAr: 'الفريق',
    icon: 'Users',
    permissions: [
      { key: 'team_view', label: 'View', labelAr: 'عرض' },
      { key: 'team_manage', label: 'Manage', labelAr: 'إدارة' },
    ],
  },
  {
    title: 'Settings',
    titleAr: 'الإعدادات',
    icon: 'Settings',
    permissions: [
      { key: 'settings_view', label: 'View', labelAr: 'عرض' },
      { key: 'settings_edit', label: 'Edit', labelAr: 'تعديل' },
    ],
  },
  {
    title: 'Permissions',
    titleAr: 'الصلاحيات',
    icon: 'Shield',
    permissions: [
      { key: 'permissions_view', label: 'View', labelAr: 'عرض' },
      { key: 'permissions_manage', label: 'Manage', labelAr: 'إدارة' },
    ],
  },
];

// Role badge component
const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
  const { language } = useLanguage();
  const roleConfig = {
    owner: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
    admin: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
    manager: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
    employee: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' },
  };
  const config = roleConfig[role];
  const labels: Record<UserRole, { en: string; ar: string }> = {
    owner: { en: 'Owner', ar: 'المالك' },
    admin: { en: 'Admin', ar: 'مدير النظام' },
    manager: { en: 'Manager', ar: 'مدير' },
    employee: { en: 'Employee', ar: 'موظف' },
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}>
      <Shield className="w-4 h-4" />
      {labels[role][language === 'ar' ? 'ar' : 'en']}
    </span>
  );
};

// Status badge component
const StatusBadge: React.FC<{ status: 'active' | 'inactive' | 'suspended' }> = ({ status }) => {
  const { language } = useLanguage();
  const statusConfig = {
    active: { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-400' },
    inactive: { bg: 'bg-gray-500/20', text: 'text-gray-400', dot: 'bg-gray-400' },
    suspended: { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-400' },
  };
  const config = statusConfig[status];
  const labels: Record<string, { en: string; ar: string }> = {
    active: { en: 'Active', ar: 'نشط' },
    inactive: { en: 'Inactive', ar: 'غير نشط' },
    suspended: { en: 'Suspended', ar: 'معلق' },
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {labels[status][language === 'ar' ? 'ar' : 'en']}
    </span>
  );
};

// Permission toggle component
const PermissionToggle: React.FC<{
  permission: keyof EmployeePermissions;
  value: boolean;
  onChange: (key: keyof EmployeePermissions, value: boolean) => void;
  disabled: boolean;
}> = ({ permission, value, onChange, disabled }) => {
  return (
    <button
      onClick={() => !disabled && onChange(permission, !value)}
      disabled={disabled}
      className={`w-12 h-8 rounded-full transition-colors relative ${
        value ? 'bg-blue-600' : 'bg-white/10'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
          value ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

// Main Employee Profile Page
const EmployeeProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const { getEmployee, updateEmployee, updateEmployeeRole, updateEmployeePermissions, updateEmployeeStatus } = useEmployees();

  const [isEditingPermissions, setIsEditingPermissions] = useState(false);
  const [tempPermissions, setTempPermissions] = useState<EmployeePermissions | null>(null);

  const employee = getEmployee(id || '');

  // Check permissions
  const canManageEmployees = user?.role === 'owner' || user?.role === 'admin';
  const isOwnProfile = user?.id === employee?.id;

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Handle role change
  const handleRoleChange = (newRole: UserRole) => {
    if (employee && canManageEmployees) {
      updateEmployeeRole(employee.id, newRole);
    }
  };

  // Handle status change
  const handleStatusChange = (newStatus: 'active' | 'inactive' | 'suspended') => {
    if (employee && canManageEmployees) {
      updateEmployeeStatus(employee.id, newStatus);
    }
  };

  // Start editing permissions
  const startEditingPermissions = () => {
    if (employee) {
      setTempPermissions({ ...employee.permissions });
      setIsEditingPermissions(true);
    }
  };

  // Handle permission toggle
  const handlePermissionChange = (key: keyof EmployeePermissions, value: boolean) => {
    if (tempPermissions) {
      setTempPermissions({ ...tempPermissions, [key]: value });
    }
  };

  // Save permissions
  const savePermissions = () => {
    if (employee && tempPermissions) {
      updateEmployeePermissions(employee.id, tempPermissions);
      setIsEditingPermissions(false);
      setTempPermissions(null);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditingPermissions(false);
    setTempPermissions(null);
  };

  // Apply role template
  const applyRoleTemplate = (role: UserRole) => {
    if (tempPermissions) {
      setTempPermissions({ ...DEFAULT_ROLE_PERMISSIONS[role] });
    }
  };

  if (!employee) {
    return (
      <div className="p-6">
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-12 text-center">
          <UserX className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">
            {language === 'ar' ? 'الموظف غير موجود' : 'Employee Not Found'}
          </h2>
          <p className="text-gray-400 mb-6">
            {language === 'ar' ? 'لم يتم العثور على الموظف المطلوب' : 'The requested employee was not found'}
          </p>
          <button
            onClick={() => navigate('/admin/employees')}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-colors"
          >
            {language === 'ar' ? 'العودة لإدارة الموظفين' : 'Back to Employees'}
          </button>
        </div>
      </div>
    );
  }

  const displayPermissions = isEditingPermissions && tempPermissions ? tempPermissions : employee.permissions;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/employees')}
          className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {language === 'ar' ? 'الملف الشخصي' : 'Employee Profile'}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
            {/* Avatar */}
            <div className="relative h-48 bg-gradient-to-br from-blue-600/20 to-purple-600/20">
              {employee.avatar ? (
                <img
                  src={employee.avatar}
                  alt={employee.fullName}
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30" />
              )}
              <div className="absolute -bottom-16 left-6">
                <div className="relative">
                  {employee.avatar ? (
                    <img
                      src={employee.avatar}
                      alt={employee.fullName}
                      className="w-32 h-32 rounded-2xl object-cover border-4 border-[#0a0a0a] shadow-xl"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border-4 border-[#0a0a0a] shadow-xl">
                      <span className="text-4xl font-bold text-white">
                        {employee.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-[#0a0a0a] ${
                    employee.status === 'active' ? 'bg-green-400' :
                    employee.status === 'inactive' ? 'bg-gray-400' : 'bg-red-400'
                  }`} />
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="pt-20 px-6 pb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{employee.fullName}</h2>
                  <p className="text-gray-400">{employee.jobTitle}</p>
                </div>
                <RoleBadge role={employee.role} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{employee.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm direction-ltr">{employee.phone}</span>
                </div>
                {employee.department && (
                  <div className="flex items-center gap-3 text-gray-400">
                    <Building className="w-4 h-4" />
                    <span className="text-sm">{employee.department}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {language === 'ar' ? 'تاريخ الانضمام:' : 'Joined:'} {formatDate(employee.createdAt)}
                  </span>
                </div>
                {employee.lastLogin && (
                  <div className="flex items-center gap-3 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {language === 'ar' ? 'آخر تسجيل دخول:' : 'Last login:'} {formatDate(employee.lastLogin)}
                    </span>
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="mt-6 pt-6 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    {language === 'ar' ? 'الحالة' : 'Status'}
                  </span>
                  <StatusBadge status={employee.status} />
                </div>
              </div>

              {/* Quick Actions for Admins */}
              {canManageEmployees && !isOwnProfile && (
                <div className="mt-4 flex gap-2">
                  {employee.status === 'active' ? (
                    <button
                      onClick={() => handleStatusChange('inactive')}
                      className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <UserX className="w-4 h-4" />
                      {language === 'ar' ? 'تعطيل' : 'Deactivate'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange('active')}
                      className="flex-1 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/20 rounded-lg text-green-400 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <UserCheck className="w-4 h-4" />
                      {language === 'ar' ? 'تفعيل' : 'Activate'}
                    </button>
                  )}
                </div>
              )}

              {/* Notes */}
              {employee.notes && (
                <div className="mt-6 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-400">
                      {language === 'ar' ? 'ملاحظات' : 'Notes'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{employee.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* ID Card Image */}
          {employee.idCardImage && (
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5">
                <h3 className="text-sm font-medium text-white">
                  {language === 'ar' ? 'صورة البطاقة الشخصية' : 'ID Card Image'}
                </h3>
              </div>
              <div className="p-4">
                <img
                  src={employee.idCardImage}
                  alt="ID Card"
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Permissions */}
        <div className="lg:col-span-2">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {language === 'ar' ? 'الصلاحيات' : 'Permissions'}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {language === 'ar'
                      ? 'إدارة صلاحيات الموظف'
                      : 'Manage employee permissions'
                    }
                  </p>
                </div>
              </div>

              {canManageEmployees && !isEditingPermissions && (
                <button
                  onClick={startEditingPermissions}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  {language === 'ar' ? 'تعديل الصلاحيات' : 'Edit Permissions'}
                </button>
              )}

              {isEditingPermissions && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={cancelEditing}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    onClick={savePermissions}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {language === 'ar' ? 'حفظ' : 'Save'}
                  </button>
                </div>
              )}
            </div>

            {/* Role Template Selector */}
            {isEditingPermissions && (
              <div className="px-6 py-4 border-b border-white/5 bg-blue-500/5">
                <p className="text-sm text-gray-400 mb-3">
                  {language === 'ar' ? 'اختر قالب للدور:' : 'Select role template:'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(['owner', 'admin', 'manager', 'employee'] as UserRole[]).map(role => (
                    <button
                      key={role}
                      onClick={() => applyRoleTemplate(role)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        employee.role === role
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                      }`}
                    >
                      {role === 'owner' ? (language === 'ar' ? 'المالك' : 'Owner') :
                       role === 'admin' ? (language === 'ar' ? 'مدير النظام' : 'Admin') :
                       role === 'manager' ? (language === 'ar' ? 'مدير' : 'Manager') :
                       (language === 'ar' ? 'موظف' : 'Employee')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Permissions Grid */}
            <div className="p-6">
              <div className="space-y-6">
                {PERMISSION_CATEGORIES.map(category => (
                  <div key={category.title} className="border border-white/5 rounded-xl overflow-hidden">
                    {/* Category Header */}
                    <div className="px-4 py-3 bg-white/5 border-b border-white/5 flex items-center gap-3">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-white">
                        {language === 'ar' ? category.titleAr : category.title}
                      </span>
                    </div>

                    {/* Permissions */}
                    <div className="divide-y divide-white/5">
                      {category.permissions.map(perm => (
                        <div
                          key={perm.key}
                          className="px-4 py-3 flex items-center justify-between"
                        >
                          <span className="text-sm text-gray-400">
                            {language === 'ar' ? perm.labelAr : perm.label}
                          </span>
                          <PermissionToggle
                            permission={perm.key}
                            value={displayPermissions[perm.key]}
                            onChange={handlePermissionChange}
                            disabled={!isEditingPermissions}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Role Management */}
          {canManageEmployees && (
            <div className="mt-6 bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5">
                <h3 className="text-lg font-bold text-white">
                  {language === 'ar' ? 'تغيير الدور' : 'Change Role'}
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['owner', 'admin', 'manager', 'employee'] as UserRole[]).map(role => (
                    <button
                      key={role}
                      onClick={() => handleRoleChange(role)}
                      disabled={role === employee.role}
                      className={`px-4 py-3 rounded-xl border transition-colors ${
                        employee.role === role
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <span className="block text-sm font-medium">
                        {role === 'owner' ? (language === 'ar' ? 'المالك' : 'Owner') :
                         role === 'admin' ? (language === 'ar' ? 'مدير النظام' : 'Admin') :
                         role === 'manager' ? (language === 'ar' ? 'مدير' : 'Manager') :
                         (language === 'ar' ? 'موظف' : 'Employee')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
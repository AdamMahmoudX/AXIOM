// =====================================================
// EMPLOYEES PAGE - AXIOMX ADMIN SYSTEM
// Phase 3: Employee Management System
// =====================================================

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '../../../context/EmployeeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { Employee, UserRole, EmployeeStatus, ROLE_LABELS, STATUS_LABELS } from '../../../types/user';
import Portal from '../../../components/Portal';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  ChevronDown,
  Users,
  UserCheck,
  UserX,
  Shield,
  X,
  Check,
} from 'lucide-react';

// Status badge component
const StatusBadge: React.FC<{ status: EmployeeStatus }> = ({ status }) => {
  const { language } = useLanguage();
  const statusConfig = {
    active: { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-400' },
    inactive: { bg: 'bg-gray-500/20', text: 'text-gray-400', dot: 'bg-gray-400' },
    suspended: { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-400' },
  };
  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {STATUS_LABELS[status][language === 'ar' ? 'ar' : 'en']}
    </span>
  );
};

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

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      {ROLE_LABELS[role][language === 'ar' ? 'ar' : 'en']}
    </span>
  );
};

// Stats cards
const StatsCards: React.FC<{ employees: Employee[] }> = ({ employees }) => {
  const { language } = useLanguage();
  const stats = useMemo(() => ({
    total: employees.length,
    active: employees.filter(e => e.status === 'active').length,
    inactive: employees.filter(e => e.status === 'inactive').length,
    byRole: {
      owner: employees.filter(e => e.role === 'owner').length,
      admin: employees.filter(e => e.role === 'admin').length,
      manager: employees.filter(e => e.role === 'manager').length,
      employee: employees.filter(e => e.role === 'employee').length,
    },
  }), [employees]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* Total Employees */}
      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-gray-400">{language === 'ar' ? 'إجمالي الموظفين' : 'Total Employees'}</p>
          </div>
        </div>
      </div>

      {/* Active */}
      <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.active}</p>
            <p className="text-xs text-gray-400">{language === 'ar' ? 'نشط' : 'Active'}</p>
          </div>
        </div>
      </div>

      {/* Inactive */}
      <div className="bg-gradient-to-br from-gray-500/10 to-gray-600/5 border border-gray-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-500/20 flex items-center justify-center">
            <UserX className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.inactive}</p>
            <p className="text-xs text-gray-400">{language === 'ar' ? 'غير نشط' : 'Inactive'}</p>
          </div>
        </div>
      </div>

      {/* Admins */}
      <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.byRole.admin + stats.byRole.owner}</p>
            <p className="text-xs text-gray-400">{language === 'ar' ? 'مدراء' : 'Admins'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Action Menu Component with Portal
interface ActionMenuProps {
  employee: Employee;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: EmployeeStatus) => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  employee,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  buttonRef,
  onClose
}) => {
  const { language } = useLanguage();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right + window.scrollX - 192, // 192 = menu width (w-48 = 12rem = 192px)
      });
    }
  }, [buttonRef]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [buttonRef, onClose]);

  return (
    <Portal>
      <div
        ref={menuRef}
        className="fixed bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-[9999] py-1 min-w-[192px]"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        <button
          onClick={() => { onView(employee.id); onClose(); }}
          className="w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 flex items-center gap-2 transition-colors"
        >
          <Eye className="w-4 h-4" />
          {language === 'ar' ? 'عرض الملف الشخصي' : 'View Profile'}
        </button>
        <button
          onClick={() => { onEdit(employee.id); onClose(); }}
          className="w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 flex items-center gap-2 transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          {language === 'ar' ? 'تعديل' : 'Edit'}
        </button>
        <div className="border-t border-white/5 my-1" />
        <button
          onClick={() => {
            const newStatus = employee.status === 'active' ? 'inactive' : 'active';
            onStatusChange(employee.id, newStatus);
            onClose();
          }}
          className="w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 flex items-center gap-2 transition-colors"
        >
          {employee.status === 'active' ? (
            <>
              <UserX className="w-4 h-4" />
              {language === 'ar' ? 'تعطيل' : 'Deactivate'}
            </>
          ) : (
            <>
              <UserCheck className="w-4 h-4" />
              {language === 'ar' ? 'تفعيل' : 'Activate'}
            </>
          )}
        </button>
        <button
          onClick={() => { onDelete(employee.id); onClose(); }}
          className="w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          {language === 'ar' ? 'حذف' : 'Delete'}
        </button>
      </div>
    </Portal>
  );
};

// Employee table row
const EmployeeRow: React.FC<{
  employee: Employee;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: EmployeeStatus) => void;
}> = ({ employee, onView, onEdit, onDelete, onStatusChange }) => {
  const [showMenu, setShowMenu] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { language } = useLanguage();

  return (
    <>
      <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
        {/* Avatar & Name */}
        <td className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              {employee.avatar ? (
                <img
                  src={employee.avatar}
                  alt={employee.fullName}
                  className="w-10 h-10 rounded-xl object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {employee.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0a0a0a] ${
                employee.status === 'active' ? 'bg-green-400' :
                employee.status === 'inactive' ? 'bg-gray-400' : 'bg-red-400'
              }`} />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{employee.fullName}</p>
              <p className="text-xs text-gray-500">{employee.jobTitle}</p>
            </div>
          </div>
        </td>

        {/* Email */}
        <td className="px-4 py-4">
          <p className="text-sm text-gray-400">{employee.email}</p>
        </td>

        {/* Phone */}
        <td className="px-4 py-4">
          <p className="text-sm text-gray-400 direction-ltr">{employee.phone}</p>
        </td>

        {/* Department */}
        <td className="px-4 py-4">
          <p className="text-sm text-gray-400">{employee.department || '-'}</p>
        </td>

        {/* Role */}
        <td className="px-4 py-4">
          <RoleBadge role={employee.role} />
        </td>

        {/* Status */}
        <td className="px-4 py-4">
          <StatusBadge status={employee.status} />
        </td>

        {/* Actions */}
        <td className="px-4 py-4">
          <button
            ref={buttonRef}
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </td>
      </tr>
      {showMenu && (
        <ActionMenu
          employee={employee}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          buttonRef={buttonRef}
          onClose={() => setShowMenu(false)}
        />
      )}
    </>
  );
};

// Add/Edit Employee Modal
const EmployeeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  employee?: Employee;
  mode: 'add' | 'edit';
}> = ({ isOpen, onClose, employee, mode }) => {
  const { language } = useLanguage();
  const { addEmployee, updateEmployee } = useEmployees();
  const [formData, setFormData] = useState({
    fullName: employee?.fullName || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    jobTitle: employee?.jobTitle || '',
    role: employee?.role || 'employee',
    status: employee?.status || 'active',
    department: employee?.department || '',
    notes: employee?.notes || '',
    avatar: employee?.avatar || '',
    idCardImage: employee?.idCardImage || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Get default permissions based on role
    const getDefaultPermissions = (role: UserRole) => {
      switch (role) {
        case 'owner':
          return {
            projects_view: true, projects_create: true, projects_edit: true, projects_delete: true,
            services_view: true, services_manage: true,
            articles_view: true, articles_create: true, articles_edit: true, articles_delete: true,
            messages_view: true, messages_send: true,
            attachments_view: true, attachments_upload: true, attachments_delete: true,
            team_view: true, team_manage: true,
            settings_view: true, settings_edit: true,
            permissions_view: true, permissions_manage: true,
          };
        case 'admin':
          return {
            projects_view: true, projects_create: true, projects_edit: true, projects_delete: true,
            services_view: true, services_manage: true,
            articles_view: true, articles_create: true, articles_edit: true, articles_delete: true,
            messages_view: true, messages_send: true,
            attachments_view: true, attachments_upload: true, attachments_delete: true,
            team_view: true, team_manage: true,
            settings_view: true, settings_edit: true,
            permissions_view: true, permissions_manage: false,
          };
        case 'manager':
          return {
            projects_view: true, projects_create: true, projects_edit: true, projects_delete: false,
            services_view: true, services_manage: true,
            articles_view: true, articles_create: true, articles_edit: true, articles_delete: false,
            messages_view: true, messages_send: true,
            attachments_view: true, attachments_upload: true, attachments_delete: false,
            team_view: true, team_manage: false,
            settings_view: true, settings_edit: false,
            permissions_view: true, permissions_manage: false,
          };
        default:
          return {
            projects_view: true, projects_create: false, projects_edit: false, projects_delete: false,
            services_view: true, services_manage: false,
            articles_view: true, articles_create: false, articles_edit: false, articles_delete: false,
            messages_view: true, messages_send: true,
            attachments_view: true, attachments_upload: false, attachments_delete: false,
            team_view: true, team_manage: false,
            settings_view: true, settings_edit: false,
            permissions_view: false, permissions_manage: false,
          };
      }
    };

    const employeeData = {
      ...formData,
      permissions: employee?.permissions || getDefaultPermissions(formData.role as UserRole),
    };

    if (mode === 'add') {
      addEmployee(employeeData);
    } else if (employee) {
      updateEmployee(employee.id, employeeData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1a1a] border-b border-white/5 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-white">
            {mode === 'add'
              ? (language === 'ar' ? 'إضافة موظف جديد' : 'Add New Employee')
              : (language === 'ar' ? 'تعديل بيانات الموظف' : 'Edit Employee')
            }
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Avatar URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {language === 'ar' ? 'رابط الصورة الشخصية' : 'Profile Image URL'}
            </label>
            <input
              type="url"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
              placeholder="https://..."
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {language === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
              placeholder={language === 'ar' ? 'أدخل الاسم الكامل' : 'Enter full name'}
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {language === 'ar' ? 'البريد الإلكتروني *' : 'Email *'}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {language === 'ar' ? 'رقم الهاتف *' : 'Phone *'}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                placeholder="+966 50 000 0000"
              />
            </div>
          </div>

          {/* Job Title & Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {language === 'ar' ? 'المسمى الوظيفي *' : 'Job Title *'}
              </label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                placeholder={language === 'ar' ? 'المسمى الوظيفي' : 'Job title'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {language === 'ar' ? 'القسم' : 'Department'}
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                placeholder={language === 'ar' ? 'القسم' : 'Department'}
              />
            </div>
          </div>

          {/* Role & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {language === 'ar' ? 'الدور *' : 'Role *'}
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-colors"
              >
                <option value="owner">{language === 'ar' ? 'المالك' : 'Owner'}</option>
                <option value="admin">{language === 'ar' ? 'مدير النظام' : 'Admin'}</option>
                <option value="manager">{language === 'ar' ? 'مدير' : 'Manager'}</option>
                <option value="employee">{language === 'ar' ? 'موظف' : 'Employee'}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {language === 'ar' ? 'الحالة *' : 'Status *'}
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as EmployeeStatus })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-colors"
              >
                <option value="active">{language === 'ar' ? 'نشط' : 'Active'}</option>
                <option value="inactive">{language === 'ar' ? 'غير نشط' : 'Inactive'}</option>
                <option value="suspended">{language === 'ar' ? 'معلق' : 'Suspended'}</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {language === 'ar' ? 'ملاحظات' : 'Notes'}
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
              placeholder={language === 'ar' ? 'ملاحظات إضافية...' : 'Additional notes...'}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 font-medium transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              {mode === 'add'
                ? (language === 'ar' ? 'إضافة الموظف' : 'Add Employee')
                : (language === 'ar' ? 'حفظ التغييرات' : 'Save Changes')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete confirmation modal
const DeleteModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  employeeName: string;
}> = ({ isOpen, onClose, onConfirm, employeeName }) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            {language === 'ar' ? 'حذف الموظف' : 'Delete Employee'}
          </h3>
          <p className="text-gray-400 mb-6">
            {language === 'ar'
              ? `هل أنت متأكد من حذف "${employeeName}"؟ لا يمكن التراجع عن هذا الإجراء.`
              : `Are you sure you want to delete "${employeeName}"? This action cannot be undone.`
            }
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 font-medium transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 rounded-xl text-white font-medium transition-colors"
            >
              {language === 'ar' ? 'حذف' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Employees Page Component
const EmployeesPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const { employees, deleteEmployee, updateEmployeeStatus } = useEmployees();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | 'all'>('all');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Check permissions
  const canManageEmployees = user?.role === 'owner' || user?.role === 'admin';

  // Filter employees - display all without pagination
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.phone.includes(searchQuery) ||
        emp.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;

      // Role filter
      const matchesRole = roleFilter === 'all' || emp.role === roleFilter;

      // Department filter
      const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesRole && matchesDepartment;
    });
  }, [employees, searchQuery, statusFilter, roleFilter, departmentFilter]);

  // Get unique departments
  const departments = useMemo(() => {
    const deps = new Set(employees.map(e => e.department).filter(Boolean));
    return Array.from(deps) as string[];
  }, [employees]);

  // Handlers
  const handleViewEmployee = (id: string) => {
    navigate(`/admin/employees/${id}`);
  };

  const handleEditEmployee = (id: string) => {
    const emp = employees.find(e => e.id === id);
    if (emp) setEditEmployee(emp);
  };

  const handleDeleteEmployee = (id: string) => {
    setDeleteEmployeeId(id);
  };

  const confirmDelete = () => {
    if (deleteEmployeeId) {
      deleteEmployee(deleteEmployeeId);
      setDeleteEmployeeId(null);
    }
  };

  const handleStatusChange = (id: string, status: EmployeeStatus) => {
    updateEmployeeStatus(id, status);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {language === 'ar' ? 'إدارة الموظفين' : 'Employee Management'}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {language === 'ar'
              ? `إجمالي ${filteredEmployees.length} موظف`
              : `${filteredEmployees.length} employees total`
            }
          </p>
        </div>

        {canManageEmployees && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {language === 'ar' ? 'إضافة موظف' : 'Add Employee'}
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <StatsCards employees={employees} />

      {/* Search & Filters */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ar' ? 'البحث عن موظف...' : 'Search employees...'}
              className="w-full pr-10 pl-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 font-medium transition-colors flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            {language === 'ar' ? 'تصفية' : 'Filters'}
            {(statusFilter !== 'all' || roleFilter !== 'all' || departmentFilter !== 'all') && (
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                {language === 'ar' ? 'الحالة' : 'Status'}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as EmployeeStatus | 'all')}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
              >
                <option value="all">{language === 'ar' ? 'الكل' : 'All'}</option>
                <option value="active">{language === 'ar' ? 'نشط' : 'Active'}</option>
                <option value="inactive">{language === 'ar' ? 'غير نشط' : 'Inactive'}</option>
                <option value="suspended">{language === 'ar' ? 'معلق' : 'Suspended'}</option>
              </select>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                {language === 'ar' ? 'الدور' : 'Role'}
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
              >
                <option value="all">{language === 'ar' ? 'الكل' : 'All'}</option>
                <option value="owner">{language === 'ar' ? 'المالك' : 'Owner'}</option>
                <option value="admin">{language === 'ar' ? 'مدير النظام' : 'Admin'}</option>
                <option value="manager">{language === 'ar' ? 'مدير' : 'Manager'}</option>
                <option value="employee">{language === 'ar' ? 'موظف' : 'Employee'}</option>
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                {language === 'ar' ? 'القسم' : 'Department'}
              </label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
              >
                <option value="all">{language === 'ar' ? 'الكل' : 'All'}</option>
                {departments.map(dep => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Table with vertical scroll */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 420px)' }}>
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-[#0a0a0a]">
              <tr className="border-b border-white/5">
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {language === 'ar' ? 'الموظف' : 'Employee'}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {language === 'ar' ? 'الهاتف' : 'Phone'}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {language === 'ar' ? 'القسم' : 'Department'}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {language === 'ar' ? 'الدور' : 'Role'}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {language === 'ar' ? 'إجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map(employee => (
                  <EmployeeRow
                    key={employee.id}
                    employee={employee}
                    onView={handleViewEmployee}
                    onEdit={handleEditEmployee}
                    onDelete={handleDeleteEmployee}
                    onStatusChange={handleStatusChange}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Users className="w-12 h-12 text-gray-600 mb-3" />
                      <p className="text-gray-400">
                        {language === 'ar' ? 'لا توجد نتائج' : 'No employees found'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <EmployeeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        mode="add"
      />
      <EmployeeModal
        isOpen={!!editEmployee}
        onClose={() => setEditEmployee(null)}
        employee={editEmployee || undefined}
        mode="edit"
      />
      <DeleteModal
        isOpen={!!deleteEmployeeId}
        onClose={() => setDeleteEmployeeId(null)}
        onConfirm={confirmDelete}
        employeeName={employees.find(e => e.id === deleteEmployeeId)?.fullName || ''}
      />
    </div>
  );
};

export default EmployeesPage;
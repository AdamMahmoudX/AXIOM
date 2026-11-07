// =====================================================
// SERVICES LIST PAGE - AXIOMX ADMIN SYSTEM
// Phase 5A: Services CMS - Services List
// Phase 5E-3: Service Relationship Analytics
// Phase 5F-3: Service Analytics Reports
// Phase 5F-4: Service Analytics Export
// Phase 6A-1: Services CMS Settings Integration
// =====================================================

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServices } from '../../../context/ServiceContext';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import {
  Service,
  ServiceStatus,
  SERVICE_STATUS_LABELS,
  SERVICE_STATUS_COLORS,
} from '../../../types/project';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Copy,
  Calendar,
  Tag,
  Star,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Boxes,
  Network,
  Activity,
  EyeOff,
  Workflow,
  Send,
  CheckCircle,
  Archive,
} from 'lucide-react';
import Portal from '../../../components/Portal';
import ServiceRelationshipAnalytics from '../../../components/ServiceRelationshipAnalytics';
import ServiceRelationshipNetwork from '../../../components/ServiceRelationshipNetwork';
import ServiceRelationshipInsights from '../../../components/ServiceRelationshipInsights';
import ServiceAnalyticsFoundation from '../../../components/ServiceAnalyticsFoundation';
import ServiceAnalyticsReports from '../../../components/ServiceAnalyticsReports';
import ServiceAnalyticsExport from '../../../components/ServiceAnalyticsExport';
import ServiceAnalyticsWidgets from '../../../components/ServiceAnalyticsWidgets';
import ServiceAnalyticsOverview from '../../../components/ServiceAnalyticsOverview';
import ServiceWorkflowControls, { WorkflowStatusBadge } from '../../../components/ServiceWorkflowControls';

// Status Badge Component
const StatusBadge: React.FC<{ status: ServiceStatus }> = ({ status }) => {
  const { language } = useLanguage();
  const config = SERVICE_STATUS_COLORS[status];
  const labels = SERVICE_STATUS_LABELS[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {labels[language === 'ar' ? 'ar' : 'en']}
    </span>
  );
};

// Stats Cards
const StatsCards: React.FC<{ services: Service[] }> = ({ services }) => {
  const { language } = useLanguage();
  const stats = useMemo(() => ({
    total: services.length,
    published: services.filter(s => s.status === 'published').length,
    draft: services.filter(s => s.status === 'draft').length,
    review: services.filter(s => s.status === 'review').length,
    approved: services.filter(s => s.status === 'approved').length,
    archived: services.filter(s => s.status === 'archived').length,
    featured: services.filter(s => s.featured).length,
  }), [services]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-6">
      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Boxes className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-gray-400">{language === 'ar' ? 'إجمالي الخدمات' : 'Total Services'}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Edit2 className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.draft}</p>
            <p className="text-xs text-gray-400">{language === 'ar' ? 'مسودة' : 'Draft'}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Eye className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.review}</p>
            <p className="text-xs text-gray-400">{language === 'ar' ? 'مراجعة' : 'Review'}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.approved}</p>
            <p className="text-xs text-gray-400">{language === 'ar' ? 'موافق' : 'Approved'}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
            <Eye className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.published}</p>
            <p className="text-xs text-gray-400">{language === 'ar' ? 'منشور' : 'Published'}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-500/10 to-gray-600/5 border border-gray-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-500/20 flex items-center justify-center">
            <Archive className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.archived}</p>
            <p className="text-xs text-gray-400">{language === 'ar' ? 'مؤرشف' : 'Archived'}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Star className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.featured}</p>
            <p className="text-xs text-gray-400">{language === 'ar' ? 'مميز' : 'Featured'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Action Menu Component with Portal
interface ActionMenuProps {
  service: Service;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  allowEdit: boolean;
  allowDelete: boolean;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ service, onView, onEdit, onDuplicate, onDelete, buttonRef, onClose, allowEdit, allowDelete }) => {
  const { language } = useLanguage();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right + window.scrollX - 192,
      });
    }
  }, [buttonRef]);

  React.useEffect(() => {
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
        style={{ top: `${position.top}px`, left: `${position.left}px` }}
      >
        <button
          onClick={() => { onView(service.id); onClose(); }}
          className="w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 flex items-center gap-2 transition-colors"
        >
          <Eye className="w-4 h-4" />
          {language === 'ar' ? 'عرض' : 'View'}
        </button>
        {allowEdit && (
          <>
            <button
              onClick={() => { onEdit(service.id); onClose(); }}
              className="w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 flex items-center gap-2 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              {language === 'ar' ? 'تعديل' : 'Edit'}
            </button>
            <button
              onClick={() => { onDuplicate(service.id); onClose(); }}
              className="w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 flex items-center gap-2 transition-colors"
            >
              <Copy className="w-4 h-4" />
              {language === 'ar' ? 'نسخ' : 'Duplicate'}
            </button>
          </>
        )}
        {allowDelete && (
          <>
            <div className="border-t border-white/5 my-1" />
            <button
              onClick={() => { onDelete(service.id); onClose(); }}
              className="w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {language === 'ar' ? 'حذف' : 'Delete'}
            </button>
          </>
        )}
      </div>
    </Portal>
  );
};

// Service Card Component with Workflow Controls (Phase 6A-4)
const ServiceCard: React.FC<{
  service: Service;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: ServiceStatus) => void;
  allowEdit: boolean;
  allowDelete: boolean;
  canPublish: boolean;
}> = ({ service, onView, onEdit, onDuplicate, onDelete, onStatusChange, allowEdit, allowDelete, canPublish }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const { language } = useLanguage();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all duration-200 group">
        {/* Service Image */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
          <div className="absolute top-3 left-3">
            <WorkflowStatusBadge status={service.status} size="sm" />
          </div>
          {service.featured && (
            <div className="absolute top-3 right-12">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
          )}
        </div>

        {/* Service Content */}
        <div className="p-4">
          <h3 className="text-white font-semibold mb-2 line-clamp-1">{service.title}</h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{service.shortDescription}</p>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              <span>{service.category || '-'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(service.createdAt)}</span>
            </div>
          </div>

          {/* Tags */}
          {service.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {service.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-white/5 rounded text-xs text-gray-400">
                  {tag}
                </span>
              ))}
              {service.tags.length > 3 && (
                <span className="px-2 py-0.5 text-xs text-gray-500">
                  +{service.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Workflow Quick Actions (Phase 6A-4) */}
          {allowEdit && (
            <div className="mb-4 p-2 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Workflow className="w-3 h-3" />
                  {language === 'ar' ? 'تغيير الحالة' : 'Change Status'}
                </span>
                <button
                  onClick={() => setShowWorkflow(!showWorkflow)}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  {showWorkflow
                    ? (language === 'ar' ? 'إخفاء' : 'Hide')
                    : (language === 'ar' ? 'إظهار' : 'Show')
                  }
                </button>
              </div>

              {showWorkflow && (
                <div className="flex flex-wrap gap-1">
                  {service.status === 'draft' && canPublish && (
                    <button
                      onClick={() => onStatusChange(service.id, 'review')}
                      className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded text-xs text-blue-400 flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      {language === 'ar' ? 'مراجعة' : 'Review'}
                    </button>
                  )}
                  {service.status === 'review' && canPublish && (
                    <>
                      <button
                        onClick={() => onStatusChange(service.id, 'approved')}
                        className="px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 rounded text-xs text-purple-400 flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        {language === 'ar' ? 'موافقة' : 'Approve'}
                      </button>
                      <button
                        onClick={() => onStatusChange(service.id, 'draft')}
                        className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 rounded text-xs text-amber-400"
                      >
                        {language === 'ar' ? 'رفض' : 'Reject'}
                      </button>
                    </>
                  )}
                  {service.status === 'approved' && canPublish && (
                    <button
                      onClick={() => onStatusChange(service.id, 'published')}
                      className="px-2 py-1 bg-green-500/20 hover:bg-green-500/30 rounded text-xs text-green-400 flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      {language === 'ar' ? 'نشر' : 'Publish'}
                    </button>
                  )}
                  {(service.status === 'published' || service.status === 'approved') && (
                    <button
                      onClick={() => onStatusChange(service.id, 'archived')}
                      className="px-2 py-1 bg-gray-500/20 hover:bg-gray-500/30 rounded text-xs text-gray-400 flex items-center gap-1"
                    >
                      <Archive className="w-3 h-3" />
                      {language === 'ar' ? 'أرشفة' : 'Archive'}
                    </button>
                  )}
                  {service.status === 'archived' && (
                    <button
                      onClick={() => onStatusChange(service.id, 'draft')}
                      className="px-2 py-1 bg-green-500/20 hover:bg-green-500/30 rounded text-xs text-green-400 flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      {language === 'ar' ? 'استعادة' : 'Restore'}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onView(service.id)}
              className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {language === 'ar' ? 'عرض' : 'View'}
            </button>
            {(allowEdit || allowDelete) && (
              <button
                ref={buttonRef}
                onClick={() => setShowMenu(!showMenu)}
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {showMenu && (
        <ActionMenu
          service={service}
          onView={onView}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          buttonRef={buttonRef}
          onClose={() => setShowMenu(false)}
          allowEdit={allowEdit}
          allowDelete={allowDelete}
        />
      )}
    </>
  );
};

// Delete Confirmation Modal
const DeleteModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  serviceTitle: string;
}> = ({ isOpen, onClose, onConfirm, serviceTitle }) => {
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
            {language === 'ar' ? 'حذف الخدمة' : 'Delete Service'}
          </h3>
          <p className="text-gray-400 mb-6">
            {language === 'ar'
              ? `هل أنت متأكد من حذف "${serviceTitle}"؟ لا يمكن التراجع عن هذا الإجراء.`
              : `Are you sure you want to delete "${serviceTitle}"? This action cannot be undone.`
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

// Pagination Component
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  const { language } = useLanguage();

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;
    const half = Math.floor(showPages / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
      >
        <ChevronLeft className="w-4 h-4 text-gray-400" />
      </button>

      {getPageNumbers().map((page, index) => (
        typeof page === 'number' ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-xl font-medium transition-colors ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300'
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="px-2 text-gray-500">...</span>
        )
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
      >
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
};

// Main Services Page Component
const ServicesListPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const { services, deleteService, duplicateService, updateServiceStatus, settings: serviceSettings, getPermissions } = useServices();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'title'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showNetwork, setShowNetwork] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  const itemsPerPage = 12;
  const canManageServices = user?.role === 'owner' || user?.role === 'admin';
  const permissions = getPermissions();

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(services.map(s => s.category).filter(Boolean))];
    return cats.sort();
  }, [services]);

  // Filter and sort services
  const filteredServices = useMemo(() => {
    let filtered = services.filter(service => {
      const matchesSearch = searchQuery === '' ||
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'updatedAt') {
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [services, searchQuery, statusFilter, categoryFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredServices.slice(start, start + itemsPerPage);
  }, [filteredServices, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, categoryFilter, sortBy, sortOrder]);

  const handleViewService = (id: string) => {
    navigate(`/admin/services/view/${id}`);
  };

  const handleEditService = (id: string) => {
    navigate(`/admin/services/edit/${id}`);
  };

  const handleDuplicateService = (id: string) => {
    const newId = duplicateService(id);
    if (newId) {
      navigate(`/admin/services/edit/${newId}`);
    }
  };

  const handleDeleteService = (id: string) => {
    setDeleteServiceId(id);
  };

  const confirmDelete = () => {
    if (deleteServiceId) {
      deleteService(deleteServiceId);
      setDeleteServiceId(null);
    }
  };

  // Handle workflow status change (Phase 6A-4)
  const handleStatusChange = (id: string, newStatus: ServiceStatus) => {
    if (user) {
      updateServiceStatus(
        id,
        newStatus,
        user.fullName || user.username,
        `Status changed to ${newStatus}`
      );
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {language === 'ar' ? 'إدارة الخدمات' : 'Service Management'}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {language === 'ar'
              ? `إجمالي ${filteredServices.length} خدمة`
              : `${filteredServices.length} services total`
            }
          </p>
        </div>

        {canManageServices && permissions.allowCreate && (
          <button
            onClick={() => navigate('/admin/services/create')}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {language === 'ar' ? 'إضافة خدمة جديدة' : 'Add New Service'}
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <StatsCards services={services} />

      {/* Service Analytics Overview Dashboard (Phase 5F-6) */}
      <ServiceAnalyticsOverview />

      {/* Service Analytics Foundation */}
      <ServiceAnalyticsFoundation />

      {/* Service Analytics Widgets (Phase 5F-5) */}
      <ServiceAnalyticsWidgets />

      {/* Service Relationship Analytics Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-blue-400" />
          <span className="text-white font-medium">
            {language === 'ar' ? 'تحليلات علاقات الخدمات' : 'Service Relationship Analytics'}
          </span>
        </div>
        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className={`px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 ${
            showAnalytics
              ? 'bg-blue-600 text-white'
              : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
          }`}
        >
          <Network className="w-4 h-4" />
          {showAnalytics
            ? (language === 'ar' ? 'إخفاء التحليلات' : 'Hide Analytics')
            : (language === 'ar' ? 'عرض التحليلات' : 'Show Analytics')
          }
        </button>
      </div>

      {/* Service Relationship Analytics Section */}
      {showAnalytics && <ServiceRelationshipAnalytics />}

      {/* Service Relationship Network Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-purple-400" />
          <span className="text-white font-medium">
            {language === 'ar' ? 'شبكة علاقات الخدمات' : 'Service Relationship Network'}
          </span>
        </div>
        <button
          onClick={() => setShowNetwork(!showNetwork)}
          className={`px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 ${
            showNetwork
              ? 'bg-purple-600 text-white'
              : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
          }`}
        >
          <Network className="w-4 h-4" />
          {showNetwork
            ? (language === 'ar' ? 'إخفاء الشبكة' : 'Hide Network')
            : (language === 'ar' ? 'عرض الشبكة' : 'Show Network')
          }
        </button>
      </div>

      {/* Service Relationship Network Section */}
      {showNetwork && <ServiceRelationshipNetwork />}

      {/* Service Relationship Insights Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <span className="text-white font-medium">
            {language === 'ar' ? 'رؤى علاقات الخدمات' : 'Service Relationship Insights'}
          </span>
        </div>
        <button
          onClick={() => setShowInsights(!showInsights)}
          className={`px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 ${
            showInsights
              ? 'bg-cyan-600 text-white'
              : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
          }`}
        >
          <Activity className="w-4 h-4" />
          {showInsights
            ? (language === 'ar' ? 'إخفاء الرؤى' : 'Hide Insights')
            : (language === 'ar' ? 'عرض الرؤى' : 'Show Insights')
          }
        </button>
      </div>

      {/* Service Relationship Insights Section */}
      {showInsights && <ServiceRelationshipInsights />}

      {/* Service Analytics Reports Section (Phase 5F-3) */}
      <ServiceAnalyticsReports />

      {/* Service Analytics Export Section (Phase 5F-4) */}
      <ServiceAnalyticsExport />

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
              placeholder={language === 'ar' ? 'البحث عن خدمة...' : 'Search services...'}
              className="w-full pr-10 pl-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ServiceStatus | 'all')}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-colors min-w-[160px]"
          >
            <option value="all">{language === 'ar' ? 'الكل' : 'All'}</option>
            <option value="draft">{language === 'ar' ? 'مسودة' : 'Draft'}</option>
            <option value="review">{language === 'ar' ? 'مراجعة' : 'Review'}</option>
            <option value="approved">{language === 'ar' ? 'موافق' : 'Approved'}</option>
            <option value="published">{language === 'ar' ? 'منشور' : 'Published'}</option>
            <option value="archived">{language === 'ar' ? 'مؤرشف' : 'Archived'}</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-colors min-w-[160px]"
          >
            <option value="all">{language === 'ar' ? 'جميع التصنيفات' : 'All Categories'}</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-colors min-w-[140px]"
          >
            <option value="createdAt">{language === 'ar' ? 'تاريخ الإنشاء' : 'Created'}</option>
            <option value="updatedAt">{language === 'ar' ? 'تاريخ التحديث' : 'Updated'}</option>
            <option value="title">{language === 'ar' ? 'العنوان' : 'Title'}</option>
          </select>

          <button
            onClick={toggleSortOrder}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          >
            <ArrowUpDown className={`w-4 h-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Services Grid */}
      {paginatedServices.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedServices.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onView={handleViewService}
                onEdit={handleEditService}
                onDuplicate={handleDuplicateService}
                onDelete={handleDeleteService}
                onStatusChange={handleStatusChange}
                allowEdit={permissions.allowEdit}
                allowDelete={permissions.allowDelete}
                canPublish={permissions.allowPublish}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-12 text-center">
          <Boxes className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">
            {language === 'ar' ? 'لا توجد خدمات' : 'No services found'}
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deleteServiceId}
        onClose={() => setDeleteServiceId(null)}
        onConfirm={confirmDelete}
        serviceTitle={services.find(s => s.id === deleteServiceId)?.title || ''}
      />
    </div>
  );
};

export default ServicesListPage;
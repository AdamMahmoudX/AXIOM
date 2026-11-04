// =====================================================
// PROJECTS LIST PAGE - AXIOMX ADMIN SYSTEM
// Phase 4: Project CMS - Projects List
// =====================================================

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../../../context/ProjectContext';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { Project, ProjectStatus, PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '../../../types/project';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  User,
  FolderKanban,
  FolderOpen,
} from 'lucide-react';
import Portal from '../../../components/Portal';

// Status Badge Component
const StatusBadge: React.FC<{ status: ProjectStatus }> = ({ status }) => {
  const { language } = useLanguage();
  const config = PROJECT_STATUS_COLORS[status];
  const labels = PROJECT_STATUS_LABELS[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {labels[language === 'ar' ? 'ar' : 'en']}
    </span>
  );
};

// Stats Cards
const StatsCards: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const { language } = useLanguage();
  const stats = useMemo(() => ({
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'in_progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    onHold: projects.filter(p => p.status === 'on_hold').length,
  }), [projects]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <FolderKanban className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-gray-400">{language === 'ar' ? 'إجمالي المشاريع' : 'Total Projects'}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.inProgress}</p>
            <p className="text-xs text-gray-400">{language === 'ar' ? 'قيد التنفيذ' : 'In Progress'}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
            <FolderKanban className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.completed}</p>
            <p className="text-xs text-gray-400">{language === 'ar' ? 'مكتمل' : 'Completed'}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <FolderKanban className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.onHold}</p>
            <p className="text-xs text-gray-400">{language === 'ar' ? 'معلق' : 'On Hold'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Action Menu Component with Portal
interface ActionMenuProps {
  project: Project;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ project, onView, onEdit, onDelete, buttonRef, onClose }) => {
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
          onClick={() => { onView(project.id); onClose(); }}
          className="w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 flex items-center gap-2 transition-colors"
        >
          <Eye className="w-4 h-4" />
          {language === 'ar' ? 'عرض المشروع' : 'View Project'}
        </button>
        <button
          onClick={() => { onEdit(project.id); onClose(); }}
          className="w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 flex items-center gap-2 transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          {language === 'ar' ? 'تعديل' : 'Edit'}
        </button>
        <div className="border-t border-white/5 my-1" />
        <button
          onClick={() => { onDelete(project.id); onClose(); }}
          className="w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          {language === 'ar' ? 'حذف' : 'Delete'}
        </button>
      </div>
    </Portal>
  );
};

// Project Card Component
const ProjectCard: React.FC<{
  project: Project;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ project, onView, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
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
        {/* Project Image */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
          <div className="absolute top-3 right-3">
            <StatusBadge status={project.status} />
          </div>
        </div>

        {/* Project Content */}
        <div className="p-4">
          <h3 className="text-white font-semibold mb-2 line-clamp-1">{project.name}</h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.shortDescription}</p>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>{project.managerName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(project.createdAt)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onView(project.id)}
              className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {language === 'ar' ? 'عرض' : 'View'}
            </button>
            <button
              ref={buttonRef}
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {showMenu && (
        <ActionMenu
          project={project}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          buttonRef={buttonRef}
          onClose={() => setShowMenu(false)}
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
  projectName: string;
}> = ({ isOpen, onClose, onConfirm, projectName }) => {
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
            {language === 'ar' ? 'حذف المشروع' : 'Delete Project'}
          </h3>
          <p className="text-gray-400 mb-6">
            {language === 'ar'
              ? `هل أنت متأكد من حذف "${projectName}"؟ لا يمكن التراجع عن هذا الإجراء.`
              : `Are you sure you want to delete "${projectName}"? This action cannot be undone.`
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

// Main Projects Page Component
const ProjectsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const { projects, deleteProject } = useProjects();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  const canManageProjects = user?.role === 'owner' || user?.role === 'admin';

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = searchQuery === '' ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.managerName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  const handleViewProject = (id: string) => {
    navigate(`/admin/projects/view/${id}`);
  };

  const handleEditProject = (id: string) => {
    navigate(`/admin/projects/edit/${id}`);
  };

  const handleDeleteProject = (id: string) => {
    setDeleteProjectId(id);
  };

  const confirmDelete = () => {
    if (deleteProjectId) {
      deleteProject(deleteProjectId);
      setDeleteProjectId(null);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {language === 'ar' ? 'إدارة المشاريع' : 'Project Management'}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {language === 'ar'
              ? `إجمالي ${filteredProjects.length} مشروع`
              : `${filteredProjects.length} projects total`
            }
          </p>
        </div>

        {canManageProjects && (
          <button
            onClick={() => navigate('/admin/projects/create')}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {language === 'ar' ? 'إضافة مشروع جديد' : 'Add New Project'}
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <StatsCards projects={projects} />

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
              placeholder={language === 'ar' ? 'البحث عن مشروع...' : 'Search projects...'}
              className="w-full pr-10 pl-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-colors min-w-[160px]"
          >
            <option value="all">{language === 'ar' ? 'الكل' : 'All'}</option>
            <option value="planning">{language === 'ar' ? 'تخطيط' : 'Planning'}</option>
            <option value="in_progress">{language === 'ar' ? 'قيد التنفيذ' : 'In Progress'}</option>
            <option value="completed">{language === 'ar' ? 'مكتمل' : 'Completed'}</option>
            <option value="on_hold">{language === 'ar' ? 'معلق' : 'On Hold'}</option>
            <option value="cancelled">{language === 'ar' ? 'ملغى' : 'Cancelled'}</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onView={handleViewProject}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-12 text-center">
          <FolderKanban className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">
            {language === 'ar' ? 'لا توجد مشاريع' : 'No projects found'}
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deleteProjectId}
        onClose={() => setDeleteProjectId(null)}
        onConfirm={confirmDelete}
        projectName={projects.find(p => p.id === deleteProjectId)?.name || ''}
      />
    </div>
  );
};

export default ProjectsListPage;
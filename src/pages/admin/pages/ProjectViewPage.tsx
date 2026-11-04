// =====================================================
// PROJECT VIEW PAGE - AXIOMX ADMIN SYSTEM
// Phase 4B: Blocks Editor Integration
// =====================================================

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjects } from '../../../context/ProjectContext';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS } from '../../../types/project';
import { Block } from '../../../components/blocks/blockTypes';
import { BlockEditor } from '../../../components/blocks';
import { getProjectContent } from '../../../data/projectContent';
import {
  ArrowRight,
  Edit2,
  Calendar,
  User,
  Tag,
  Clock,
  Building,
  Layers,
  FileText,
  Eye,
} from 'lucide-react';

const ProjectViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const { user } = useAuth();
  const { getProject } = useProjects();

  const [isLoading, setIsLoading] = useState(true);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'content'>('details');

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const project = id ? getProject(id) : undefined;

  // Load project content
  useEffect(() => {
    if (project) {
      const content = getProjectContent(project.id);
      setBlocks(content);
    }
  }, [project]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canManageProjects = user?.role === 'owner' || user?.role === 'admin';

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="absolute -inset-10 rounded-full bg-blue-500/20 animate-ping" />
          <div className="relative w-16 h-16 border-2 border-blue-500/50 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6">
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-12 text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            {language === 'ar' ? 'المشروع غير موجود' : 'Project Not Found'}
          </h2>
          <p className="text-gray-400 mb-6">
            {language === 'ar'
              ? 'عذراً، لم يتم العثور على المشروع المطلوب.'
              : 'Sorry, the requested project was not found.'}
          </p>
          <button
            onClick={() => navigate('/admin/projects')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-colors"
          >
            {language === 'ar' ? 'العودة للمشاريع' : 'Back to Projects'}
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = PROJECT_STATUS_COLORS[project.status];
  const statusLabels = PROJECT_STATUS_LABELS[project.status];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/projects')}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <ArrowRight className={`w-5 h-5 text-gray-400 ${language === 'ar' ? 'rotate-180' : ''}`} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{project.name}</h1>
            <p className="text-sm text-gray-400 mt-1">
              {language === 'ar' ? 'تفاصيل المشروع' : 'Project Details'}
            </p>
          </div>
        </div>

        {canManageProjects && (
          <button
            onClick={() => navigate(`/admin/projects/edit/${project.id}`)}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-colors flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            {language === 'ar' ? 'تعديل المشروع' : 'Edit Project'}
          </button>
        )}
      </div>

      {/* Project Image */}
      <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-6">
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Project+Image';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}>
            <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
            {statusLabels[language === 'ar' ? 'ar' : 'en']}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-white/10">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'details'
              ? 'text-blue-400 border-blue-400'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {language === 'ar' ? 'التفاصيل' : 'Details'}
          </div>
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'content'
              ? 'text-blue-400 border-blue-400'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            {language === 'ar' ? 'المحتوى' : 'Content'}
          </div>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                {language === 'ar' ? 'الوصف' : 'Description'}
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {project.shortDescription}
              </p>
            </div>

            {/* Details Grid */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                {language === 'ar' ? 'تفاصيل المشروع' : 'Project Details'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Tag className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{language === 'ar' ? 'الفئة' : 'Category'}</p>
                    <p className="text-sm font-medium text-white">
                      {project.category || (language === 'ar' ? 'غير محدد' : 'Not specified')}
                    </p>
                  </div>
                </div>

                {project.client && (
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Building className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{language === 'ar' ? 'العميل' : 'Client'}</p>
                      <p className="text-sm font-medium text-white">{project.client}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Manager Info */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                {language === 'ar' ? 'المسؤول' : 'Manager'}
              </h2>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {project.managerName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{project.managerName}</p>
                  <p className="text-xs text-gray-500">
                    {language === 'ar' ? 'مدير المشروع' : 'Project Manager'}
                  </p>
                </div>
              </div>
            </div>

            {/* Dates Info */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                {language === 'ar' ? 'التواريخ' : 'Dates'}
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{language === 'ar' ? 'تاريخ الإنشاء' : 'Created'}</p>
                    <p className="text-sm font-medium text-white">{formatDate(project.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{language === 'ar' ? 'آخر تعديل' : 'Last Updated'}</p>
                    <p className="text-sm font-medium text-white">{formatDate(project.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Project ID */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                {language === 'ar' ? 'معلومات المشروع' : 'Project Info'}
              </h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{language === 'ar' ? 'المعرف' : 'ID'}</span>
                  <span className="text-sm font-mono text-gray-300">{project.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Content Tab with Block Editor
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
          <BlockEditor blocks={blocks} onChange={setBlocks} />
        </div>
      )}
    </div>
  );
};

export default ProjectViewPage;
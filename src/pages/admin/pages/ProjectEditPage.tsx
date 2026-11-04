// =====================================================
// PROJECT EDIT PAGE - AXIOMX ADMIN SYSTEM
// Phase 4E: Multilingual Content System
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjects } from '../../../context/ProjectContext';
import { useLanguage } from '../../../context/LanguageContext';
import { useEmployees } from '../../../context/EmployeeContext';
import { ProjectStatus, TranslationStatus, PROJECT_STATUS_LABELS, LanguageContent } from '../../../types/project';
import LanguageTabs from '../../../components/LanguageTabs';
import { SEOSettings } from '../../../components/seo';
import {
  ArrowRight,
  Check,
  Image,
  User,
  FileText,
  AlertCircle,
  Globe,
  Search,
  Link,
} from 'lucide-react';

type ContentLanguage = 'en' | 'ar';

const ProjectEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const { getProject, updateProject } = useProjects();
  const { employees } = useEmployees();

  // Active content language for editing
  const [activeContentLang, setActiveContentLang] = useState<ContentLanguage>('en');

  // Multilingual content state
  const [content, setContent] = useState<{ en: LanguageContent; ar: LanguageContent }>({
    en: {
      title: '',
      slug: '',
      excerpt: '',
      description: '',
      seo: { title: '', description: '', keywords: '', canonicalUrl: '', focusKeyword: '', ogTitle: '', ogDescription: '', ogImage: '' },
      blocks: [],
    },
    ar: {
      title: '',
      slug: '',
      excerpt: '',
      description: '',
      seo: { title: '', description: '', keywords: '', canonicalUrl: '', focusKeyword: '', ogTitle: '', ogDescription: '', ogImage: '' },
      blocks: [],
    },
  });

  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    image: '',
    status: 'planning' as ProjectStatus,
    managerId: '',
    managerName: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load project data
  useEffect(() => {
    if (id) {
      const project = getProject(id);
      if (project) {
        // Set form data
        setFormData({
          name: project.name,
          shortDescription: project.shortDescription,
          image: project.image,
          status: project.status,
          managerId: project.managerId,
          managerName: project.managerName,
        });

        // Set multilingual content if exists
        if (project.content) {
          setContent(project.content);
        }
      }
      setIsLoading(false);
    }
  }, [id, getProject]);

  // Calculate translation status
  const getTranslationStatus = (): { en: TranslationStatus; ar: TranslationStatus } => {
    const enComplete = content.en.title.trim() !== '' && content.en.excerpt.trim() !== '';
    const arComplete = content.ar.title.trim() !== '' && content.ar.excerpt.trim() !== '';

    return {
      en: (enComplete && arComplete ? 'complete' : enComplete ? 'needs_review' : 'missing') as TranslationStatus,
      ar: (arComplete && enComplete ? 'complete' : arComplete ? 'needs_review' : 'missing') as TranslationStatus,
    };
  };

  // Handle content change for active language
  const handleContentChange = (field: keyof LanguageContent, value: string) => {
    setContent(prev => ({
      ...prev,
      [activeContentLang]: {
        ...prev[activeContentLang],
        [field]: value,
      },
    }));
    // Auto-generate slug from title
    if (field === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setContent(prev => ({
        ...prev,
        [activeContentLang]: {
          ...prev[activeContentLang],
          title: value,
          slug: slug,
        },
      }));
    }
  };

  // Handle SEO change
  const handleSeoChange = (field: keyof LanguageContent['seo'], value: string) => {
    setContent(prev => ({
      ...prev,
      [activeContentLang]: {
        ...prev[activeContentLang],
        seo: {
          ...prev[activeContentLang].seo,
          [field]: value,
        },
      },
    }));
  };

  // Handle SEO from SEOSettings component (handles all SEO fields including OpenGraph)
  const handleSeoFieldChange = (field: keyof LanguageContent['seo'], value: string) => {
    handleSeoChange(field, value);
  };

  // Duplicate content from one language to another
  const handleDuplicateContent = (from: ContentLanguage, to: ContentLanguage) => {
    setContent(prev => ({
      ...prev,
      [to]: {
        ...prev[from],
      },
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate at least one language has required content
    const hasEnContent = content.en.title.trim() !== '' && content.en.excerpt.trim() !== '';
    const hasArContent = content.ar.title.trim() !== '' && content.ar.excerpt.trim() !== '';

    if (!hasEnContent && !hasArContent) {
      newErrors.title = language === 'ar'
        ? 'يجب إدخال المحتوى باللغة الإنجليزية أو العربية'
        : 'Content in English or Arabic is required';
    }

    if (!formData.image.trim()) {
      newErrors.image = language === 'ar' ? 'صورة المشروع مطلوبة' : 'Project image is required';
    } else if (!formData.image.startsWith('http')) {
      newErrors.image = language === 'ar' ? 'يجب أن يكون الرابط صورة صحيحة' : 'Must be a valid image URL';
    }

    if (!formData.managerId) {
      newErrors.managerId = language === 'ar' ? 'يجب اختيار المسؤول' : 'Manager is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !id) return;

    setIsSubmitting(true);

    try {
      // Determine the display name based on current language
      const displayName = language === 'ar'
        ? (content.ar.title || content.en.title)
        : (content.en.title || content.ar.title);

      const displayShortDescription = language === 'ar'
        ? (content.ar.excerpt || content.en.excerpt)
        : (content.en.excerpt || content.ar.excerpt);

      updateProject(id, {
        name: displayName,
        shortDescription: displayShortDescription,
        image: formData.image,
        status: formData.status,
        managerId: formData.managerId,
        managerName: formData.managerName,
        content: content,
        translationStatus: getTranslationStatus(),
      });

      setTimeout(() => {
        navigate('/admin/projects');
      }, 500);
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManagerChange = (managerId: string) => {
    const manager = employees.find(e => e.id === managerId);
    setFormData(prev => ({
      ...prev,
      managerId,
      managerName: manager?.fullName || '',
    }));
  };

  // Sample project images
  const sampleImages = [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
  ];

  const currentContent = content[activeContentLang];
  const translationStatus = getTranslationStatus();

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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/projects')}
          className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <ArrowRight className={`w-5 h-5 text-gray-400 ${language === 'ar' ? 'rotate-180' : ''}`} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {language === 'ar' ? 'تعديل المشروع' : 'Edit Project'}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {language === 'ar' ? 'تعديل تفاصيل المشروع' : 'Update project details'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Language Tabs */}
          <LanguageTabs
            activeLanguage={activeContentLang}
            onLanguageChange={setActiveContentLang}
            translationStatus={translationStatus}
            onDuplicate={handleDuplicateContent}
            showDuplicateButtons={true}
          />

          {/* Content Section */}
          <div className="bg-[#0a0a0a] rounded-xl border border-white/10 p-6 space-y-5">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">
                {language === 'ar' ? 'المحتوى' : 'Content'}
              </h3>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                activeContentLang === 'en'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-green-500/20 text-green-400'
              }`}>
                {activeContentLang === 'en' ? 'English' : 'العربية'}
              </span>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {language === 'ar' ? 'عنوان المشروع *' : 'Project Title *'}
              </label>
              <div className="relative">
                <FileText className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={currentContent.title}
                  onChange={(e) => handleContentChange('title', e.target.value)}
                  className={`w-full pr-10 pl-4 py-3 bg-white/5 border ${
                    errors.title ? 'border-red-500' : 'border-white/10'
                  } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors`}
                  placeholder={activeContentLang === 'en' ? 'Enter project title' : 'أدخل عنوان المشروع'}
                  dir={activeContentLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {language === 'ar' ? 'الرابط (Slug)' : 'URL Slug'}
              </label>
              <div className="relative">
                <Link className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={currentContent.slug}
                  onChange={(e) => handleContentChange('slug', e.target.value)}
                  className="w-full pr-10 pl-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                  placeholder={activeContentLang === 'en' ? 'project-slug' : 'رابط-المشروع'}
                  dir="ltr"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {language === 'ar' ? 'الرابط سيظهر هكذا:' : 'URL will be: /projects/'}{currentContent.slug || '...'}
              </p>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {language === 'ar' ? 'الوصف المختصر *' : 'Short Description *'}
              </label>
              <textarea
                value={currentContent.excerpt}
                onChange={(e) => handleContentChange('excerpt', e.target.value)}
                rows={2}
                className={`w-full px-4 py-3 bg-white/5 border ${
                  errors.title ? 'border-red-500' : 'border-white/10'
                } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors resize-none`}
                placeholder={activeContentLang === 'en'
                  ? 'Enter a brief description of the project...'
                  : 'أدخل وصف مختصر للمشروع...'}
                dir={activeContentLang === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {language === 'ar' ? 'الوصف الكامل' : 'Full Description'}
              </label>
              <textarea
                value={currentContent.description}
                onChange={(e) => handleContentChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                placeholder={activeContentLang === 'en'
                  ? 'Enter full project description...'
                  : 'أدخل الوصف الكامل للمشروع...'}
                dir={activeContentLang === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          </div>

          {/* SEO Section - Professional SEO Settings */}
          <div className="bg-[#0a0a0a] rounded-xl border border-white/10 p-6">
            <SEOSettings
              seo={currentContent.seo}
              title={currentContent.title}
              description={currentContent.description}
              excerpt={currentContent.excerpt}
              onSeoChange={handleSeoFieldChange}
              language={activeContentLang}
            />
          </div>

          
          {/* Project Image */}
          <div className="bg-[#0a0a0a] rounded-xl border border-white/10 p-6">
            <label className="block text-sm font-medium text-gray-300 mb-4">
              {language === 'ar' ? 'صورة المشروع *' : 'Project Image *'}
            </label>
            <div className="relative">
              <Image className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className={`w-full pr-10 pl-4 py-3 bg-white/5 border ${
                  errors.image ? 'border-red-500' : 'border-white/10'
                } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors`}
                placeholder="https://..."
                dir="ltr"
              />
            </div>
            {errors.image && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.image}
              </p>
            )}

            {/* Sample Images */}
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">
                {language === 'ar' ? 'أو اختر من الصور الجاهزة:' : 'Or choose from ready images:'}
              </p>
              <div className="flex gap-2 flex-wrap">
                {sampleImages.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFormData({ ...formData, image: img })}
                    className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                      formData.image === img ? 'border-blue-500' : 'border-transparent hover:border-white/20'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Image Preview */}
            {formData.image && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">
                  {language === 'ar' ? 'معاينة الصورة:' : 'Image Preview:'}
                </p>
                <div className="w-full h-40 rounded-xl overflow-hidden bg-white/5">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image';
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Status & Manager */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status */}
            <div className="bg-[#0a0a0a] rounded-xl border border-white/10 p-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {language === 'ar' ? 'حالة المشروع *' : 'Project Status *'}
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-colors"
              >
                <option value="planning">{language === 'ar' ? 'تخطيط' : 'Planning'}</option>
                <option value="in_progress">{language === 'ar' ? 'قيد التنفيذ' : 'In Progress'}</option>
                <option value="completed">{language === 'ar' ? 'مكتمل' : 'Completed'}</option>
                <option value="on_hold">{language === 'ar' ? 'معلق' : 'On Hold'}</option>
                <option value="cancelled">{language === 'ar' ? 'ملغى' : 'Cancelled'}</option>
              </select>
            </div>

            {/* Manager */}
            <div className="bg-[#0a0a0a] rounded-xl border border-white/10 p-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {language === 'ar' ? 'المسؤول *' : 'Project Manager *'}
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <select
                  value={formData.managerId}
                  onChange={(e) => handleManagerChange(e.target.value)}
                  className={`w-full pr-10 pl-4 py-3 bg-white/5 border ${
                    errors.managerId ? 'border-red-500' : 'border-white/10'
                  } rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-colors`}
                >
                  <option value="">
                    {language === 'ar' ? 'اختر المسؤول' : 'Select Manager'}
                  </option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} - {emp.jobTitle}
                    </option>
                  ))}
                </select>
              </div>
              {errors.managerId && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.managerId}
                </p>
              )}
            </div>
          </div>

          {/* Translation Status Summary */}
          <div className="bg-[#0a0a0a] rounded-xl border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                {language === 'ar' ? 'حالة الترجمة:' : 'Translation Status:'}
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">EN:</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    translationStatus.en === 'complete'
                      ? 'bg-green-500/20 text-green-400'
                      : translationStatus.en === 'needs_review'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {translationStatus.en === 'complete'
                      ? (language === 'ar' ? 'مكتمل' : 'Complete')
                      : translationStatus.en === 'needs_review'
                      ? (language === 'ar' ? 'يحتاج مراجعة' : 'Needs Review')
                      : (language === 'ar' ? 'مفقود' : 'Missing')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">AR:</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    translationStatus.ar === 'complete'
                      ? 'bg-green-500/20 text-green-400'
                      : translationStatus.ar === 'needs_review'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {translationStatus.ar === 'complete'
                      ? (language === 'ar' ? 'مكتمل' : 'Complete')
                      : translationStatus.ar === 'needs_review'
                      ? (language === 'ar' ? 'يحتاج مراجعة' : 'Needs Review')
                      : (language === 'ar' ? 'مفقود' : 'Missing')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => navigate('/admin/projects')}
              className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 font-medium transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-500/50 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectEditPage;
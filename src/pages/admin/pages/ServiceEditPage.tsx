// =====================================================
// SERVICE EDIT PAGE - AXIOMX ADMIN SYSTEM
// Phase 5A: Services CMS - Edit Service
// Phase 5B: Category Integration
// Phase 5E-2: Service Relationship Validation
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useServices, RelationshipValidationError } from '../../../context/ServiceContext';
import { useCategories } from '../../../context/CategoryContext';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import {
  Service,
  ServiceStatus,
  ServiceStatusLabels,
  ServiceStatusColors,
  SERVICE_CATEGORIES,
  DEFAULT_SERVICE_IMAGE,
} from '../../../types/project';
import { generateSlug } from '../../../types/project';
import {
  ArrowLeft,
  Save,
  X,
  Image as ImageIcon,
  Tag,
  Folder,
  Star,
  Copy,
  Languages,
  Eye,
  Tag as TagIcon,
  Link2,
  AlertTriangle,
  CheckCircle,
  Workflow,
} from 'lucide-react';
import LanguageTabs from '../../../components/LanguageTabs';
import BlockEditor from '../../../components/blocks/BlockEditor';
import ServiceRelationshipSelector from '../../../components/ServiceRelationshipSelector';
import ServiceWorkflowControls, { WorkflowStatusBadge, WorkflowTimeline } from '../../../components/ServiceWorkflowControls';
import { Block } from '../../../components/blocks/blockTypes';

interface ServiceFormData {
  title: string;
  shortDescription: string;
  category: string;
  categoryIds: string[];
  tags: string[];
  image: string;
  gallery: string[];
  featured: boolean;
  status: ServiceStatus;
  relatedServiceIds: string[];
  content: {
    en: {
      slug: string;
      excerpt: string;
      description: string;
      seo: {
        title: string;
        description: string;
        focusKeyword: string;
        ogTitle: string;
        ogDescription: string;
      };
    };
    ar: {
      slug: string;
      excerpt: string;
      description: string;
      seo: {
        title: string;
        description: string;
        focusKeyword: string;
        ogTitle: string;
        ogDescription: string;
      };
    };
  };
}

const ServiceEditPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const { getService, updateService, updateServiceStatus, checkSlugUniqueness, isSlugTaken, duplicateService, getRelationshipErrors, settings: serviceSettings, getPermissions } = useServices();
  const { getActiveCategories } = useCategories();
  const activeCategories = getActiveCategories();

  const [activeLang, setActiveLang] = useState<'en' | 'ar'>('en');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [relationshipErrors, setRelationshipErrors] = useState<RelationshipValidationError[]>([]);
  const [isRelationshipValid, setIsRelationshipValid] = useState(true);

  const service = serviceId ? getService(serviceId) : undefined;
  const permissions = getPermissions();

  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    shortDescription: '',
    category: '',
    categoryIds: [],
    tags: [],
    image: DEFAULT_SERVICE_IMAGE,
    gallery: [],
    featured: false,
    status: 'draft',
    relatedServiceIds: [],
    content: {
      en: {
        slug: '',
        excerpt: '',
        description: '',
        seo: {
          title: '',
          description: '',
          focusKeyword: '',
          ogTitle: '',
          ogDescription: '',
        },
      },
      ar: {
        slug: '',
        excerpt: '',
        description: '',
        seo: {
          title: '',
          description: '',
          focusKeyword: '',
          ogTitle: '',
          ogDescription: '',
        },
      },
    },
  });

  const [blocks, setBlocks] = useState<Record<'en' | 'ar', Block[]>>({
    en: [],
    ar: [],
  });

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title,
        shortDescription: service.shortDescription,
        category: service.category,
        categoryIds: service.categoryIds || [],
        tags: service.tags,
        image: service.image,
        gallery: service.gallery,
        featured: service.featured,
        status: service.status,
        relatedServiceIds: service.relatedServiceIds || [],
        content: {
          en: {
            slug: service.content.en.slug,
            excerpt: service.content.en.excerpt,
            description: service.content.en.description,
            seo: {
              title: service.content.en.seo?.title || '',
              description: service.content.en.seo?.description || '',
              focusKeyword: service.content.en.seo?.focusKeyword || '',
              ogTitle: service.content.en.seo?.ogTitle || '',
              ogDescription: service.content.en.seo?.ogDescription || '',
            },
          },
          ar: {
            slug: service.content.ar.slug,
            excerpt: service.content.ar.excerpt,
            description: service.content.ar.description,
            seo: {
              title: service.content.ar.seo?.title || '',
              description: service.content.ar.seo?.description || '',
              focusKeyword: service.content.ar.seo?.focusKeyword || '',
              ogTitle: service.content.ar.seo?.ogTitle || '',
              ogDescription: service.content.ar.seo?.ogDescription || '',
            },
          },
        },
      });
      setBlocks({
        en: service.content.en.blocks,
        ar: service.content.ar.blocks,
      });
    }
  }, [service]);

  const canManageServices = user?.role === 'owner' || user?.role === 'admin';

  useEffect(() => {
    if (!canManageServices) {
      navigate('/admin/services');
    }
    if (!service && serviceId) {
      navigate('/admin/services');
    }
  }, [canManageServices, navigate, service, serviceId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.title.trim()) {
      newErrors.title = language === 'ar' ? 'العنوان مطلوب' : 'Title is required';
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = language === 'ar' ? 'الوصف المختصر مطلوب' : 'Short description is required';
    }

    if (!formData.category) {
      newErrors.category = language === 'ar' ? 'التصنيف مطلوب' : 'Category is required';
    }

    // Slug validation
    const currentSlug = formData.content[activeLang].slug;
    if (currentSlug && isSlugTaken(currentSlug, serviceId)) {
      newErrors.slug = language === 'ar' ? 'هذا الرابط مستخدم مسبقاً' : 'This slug is already taken';
    }

    // Relationship validation
    if (!isRelationshipValid) {
      newErrors.relationships = language === 'ar'
        ? 'يوجد أخطاء في العلاقات. يرجى تصحيحها.'
        : 'There are relationship errors. Please fix them.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: string,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate slug from title for English
    if (field === 'title' && activeLang === 'en' && !formData.content.en.slug) {
      const slug = generateSlug(value as string);
      setFormData((prev) => ({
        ...prev,
        content: {
          ...prev.content,
          en: { ...prev.content.en, slug },
        },
      }));
    }

    // Clear error when field changes
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleContentChange = (
    lang: 'en' | 'ar',
    field: string,
    value: string
  ) => {
    // Handle SEO fields
    if (field.startsWith('seo.')) {
      const seoField = field.replace('seo.', '');
      setFormData((prev) => {
        const currentLangContent = prev.content[lang];
        return {
          ...prev,
          content: {
            ...prev.content,
            [lang]: {
              ...currentLangContent,
              seo: {
                ...currentLangContent.seo,
                [seoField]: value,
              },
            },
          },
        };
      });
      return;
    }

    setFormData((prev) => {
      const currentLangContent = prev.content[lang];
      return {
        ...prev,
        content: {
          ...prev.content,
          [lang]: {
            ...currentLangContent,
            [field]: value,
          },
        },
      };
    });

    // Clear slug error
    if (field === 'slug' && errors.slug) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.slug;
        return newErrors;
      });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleBlocksChange = (lang: 'en' | 'ar', newBlocks: Block[]) => {
    setBlocks((prev) => ({
      ...prev,
      [lang]: newBlocks,
    }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  const handleRelatedServicesChange = (selectedIds: string[]) => {
    setFormData((prev) => ({
      ...prev,
      relatedServiceIds: selectedIds,
    }));
  };

  const handleValidationChange = (
    isValid: boolean,
    errorCount: number,
    errors: RelationshipValidationError[]
  ) => {
    setIsRelationshipValid(isValid);
    setRelationshipErrors(errors);

    // Clear relationship error when relationships become valid
    if (isValid && errors.relationships) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.relationships;
        return newErrors;
      });
    }
  };

  // Handle workflow status change (Phase 6A-4)
  const handleStatusChange = (newStatus: ServiceStatus) => {
    if (serviceId && user) {
      const success = updateServiceStatus(
        serviceId,
        newStatus,
        user.fullName || user.username,
        `Status changed from ${formData.status} to ${newStatus}`
      );

      if (success) {
        setFormData(prev => ({
          ...prev,
          status: newStatus,
        }));
      }
    }
  };

  const handleDuplicate = () => {
    if (serviceId) {
      const newId = duplicateService(serviceId);
      if (newId) {
        navigate(`/admin/services/edit/${newId}`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !serviceId) return;

    setIsSubmitting(true);

    try {
      const slug = formData.content.en.slug || generateSlug(formData.title);
      const slugAr = formData.content.ar.slug || generateSlug(formData.title);

      const updatedService = {
        title: formData.title,
        shortDescription: formData.shortDescription,
        status: formData.status,
        category: formData.category,
        categoryIds: formData.categoryIds,
        tags: formData.tags,
        image: formData.image,
        gallery: formData.gallery,
        featured: formData.featured,
        relatedServiceIds: formData.relatedServiceIds,
        content: {
          en: {
            title: formData.title,
            slug: slug,
            excerpt: formData.content.en.excerpt,
            description: formData.content.en.description,
            seo: {
              title: formData.content.en.seo.title || formData.content.en.excerpt || formData.title,
              description: formData.content.en.seo.description || formData.content.en.description || formData.shortDescription,
              focusKeyword: formData.content.en.seo.focusKeyword || '',
              ogTitle: formData.title,
              ogDescription: formData.shortDescription,
            },
            blocks: blocks.en,
          },
          ar: {
            title: formData.title,
            slug: slugAr,
            excerpt: formData.content.ar.excerpt,
            description: formData.content.ar.description,
            seo: {
              title: formData.content.ar.seo.title || formData.content.ar.excerpt || formData.title,
              description: formData.content.ar.seo.description || formData.content.ar.description || formData.shortDescription,
              focusKeyword: formData.content.ar.seo.focusKeyword || '',
              ogTitle: formData.title,
              ogDescription: formData.shortDescription,
            },
            blocks: blocks.ar,
          },
        },
      };

      updateService(serviceId, updatedService);
      navigate('/admin/services');
    } catch (error) {
      console.error('Error updating service:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!service) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
            <Eye className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            {language === 'ar' ? 'الخدمة غير موجودة' : 'Service Not Found'}
          </h2>
          <p className="text-gray-400 mb-4">
            {language === 'ar'
              ? 'الخدمة التي تبحث عنها غير موجودة'
              : 'The service you are looking for does not exist'}
          </p>
          <button
            onClick={() => navigate('/admin/services')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-colors"
          >
            {language === 'ar' ? 'العودة للخدمات' : 'Back to Services'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/services')}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {language === 'ar' ? 'تعديل الخدمة' : 'Edit Service'}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {service.title || language === 'ar' ? 'تعديل خدمة' : 'Edit service'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {permissions.allowEdit && (
            <button
              onClick={handleDuplicate}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 font-medium transition-colors flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              {language === 'ar' ? 'نسخ' : 'Duplicate'}
            </button>
          )}
          {formData.status === 'published' && (
            <a
              href={`/services/${service.content.en.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-xl text-green-400 font-medium transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {language === 'ar' ? 'معاينة' : 'Preview'}
            </a>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
              </h2>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {language === 'ar' ? 'العنوان *' : 'Title *'}
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder={language === 'ar' ? 'أدخل عنوان الخدمة' : 'Enter service title'}
                    className={`w-full px-4 py-3 bg-white/5 border ${
                      errors.title ? 'border-red-500' : 'border-white/10'
                    } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors`}
                  />
                  {errors.title && (
                    <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {language === 'ar' ? 'الوصف المختصر *' : 'Short Description *'}
                  </label>
                  <textarea
                    value={formData.shortDescription}
                    onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                    placeholder={language === 'ar' ? 'أدخل وصف مختصر للخدمة' : 'Enter a brief description'}
                    rows={3}
                    className={`w-full px-4 py-3 bg-white/5 border ${
                      errors.shortDescription ? 'border-red-500' : 'border-white/10'
                    } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors resize-none`}
                  />
                  {errors.shortDescription && (
                    <p className="text-red-400 text-sm mt-1">{errors.shortDescription}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {language === 'ar' ? 'التصنيف *' : 'Category *'}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/5 border ${
                      errors.category ? 'border-red-500' : 'border-white/10'
                    } rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-colors`}
                  >
                    <option value="">
                      {language === 'ar' ? 'اختر التصنيف' : 'Select Category'}
                    </option>
                    {SERVICE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-400 text-sm mt-1">{errors.category}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Content Card */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                {language === 'ar' ? 'المحتوى' : 'Content'}
              </h2>

              <LanguageTabs activeLang={activeLang} onLangChange={setActiveLang} />

              <div className="mt-4 space-y-4">
                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {language === 'ar' ? 'الرابط (Slug)' : 'Slug'}
                  </label>
                  <input
                    type="text"
                    value={formData.content[activeLang].slug}
                    onChange={(e) => handleContentChange(activeLang, 'slug', e.target.value)}
                    placeholder={language === 'ar' ? 'رابط الخدمة' : 'service-url'}
                    className={`w-full px-4 py-3 bg-white/5 border ${
                      errors.slug ? 'border-red-500' : 'border-white/10'
                    } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors`}
                  />
                  {errors.slug && (
                    <p className="text-red-400 text-sm mt-1">{errors.slug}</p>
                  )}
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {language === 'ar' ? 'مقتطف' : 'Excerpt'}
                  </label>
                  <textarea
                    value={formData.content[activeLang].excerpt}
                    onChange={(e) => handleContentChange(activeLang, 'excerpt', e.target.value)}
                    placeholder={language === 'ar' ? 'أدخل مقتطفاً' : 'Enter excerpt'}
                    rows={2}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {language === 'ar' ? 'الوصف الكامل' : 'Full Description'}
                  </label>
                  <textarea
                    value={formData.content[activeLang].description}
                    onChange={(e) => handleContentChange(activeLang, 'description', e.target.value)}
                    placeholder={language === 'ar' ? 'أدخل الوصف الكامل' : 'Enter full description'}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                  />
                </div>

                {/* Block Editor */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {language === 'ar' ? 'الكتلة' : 'Blocks'}
                  </label>
                  <BlockEditor
                    blocks={blocks[activeLang]}
                    onChange={(newBlocks) => handleBlocksChange(activeLang, newBlocks)}
                    language={activeLang}
                  />
                </div>
              </div>
            </div>

            {/* SEO Card */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {language === 'ar' ? 'إعدادات SEO' : 'SEO Settings'}
              </h2>

              <div className="space-y-4">
                {/* Meta Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {language === 'ar' ? 'Meta Title' : 'Meta Title'}
                    <span className="text-gray-500 ml-1">({language === 'ar' ? 'العنوان' : 'Title'})</span>
                  </label>
                  <input
                    type="text"
                    value={formData.content[activeLang].seo.title}
                    onChange={(e) => handleContentChange(activeLang, 'seo.title', e.target.value)}
                    placeholder={language === 'ar' ? 'عنوان مخصص لمحركات البحث' : 'Custom title for search engines'}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    {language === 'ar'
                      ? `الأحرف المستخدمة: ${formData.content[activeLang].seo.title.length}/60`
                      : `Characters: ${formData.content[activeLang].seo.title.length}/60`}
                  </p>
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {language === 'ar' ? 'Meta Description' : 'Meta Description'}
                    <span className="text-gray-500 ml-1">({language === 'ar' ? 'الوصف' : 'Description'})</span>
                  </label>
                  <textarea
                    value={formData.content[activeLang].seo.description}
                    onChange={(e) => handleContentChange(activeLang, 'seo.description', e.target.value)}
                    placeholder={language === 'ar' ? 'وصف مخصص لمحركات البحث' : 'Custom description for search engines'}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    {language === 'ar'
                      ? `الأحرف المستخدمة: ${formData.content[activeLang].seo.description.length}/160`
                      : `Characters: ${formData.content[activeLang].seo.description.length}/160`}
                  </p>
                </div>

                {/* Focus Keyword */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {language === 'ar' ? 'Focus Keyword' : 'Focus Keyword'}
                    <span className="text-gray-500 ml-1">({language === 'ar' ? 'الكلمة المفتاحية' : 'Keyword'})</span>
                  </label>
                  <input
                    type="text"
                    value={formData.content[activeLang].seo.focusKeyword}
                    onChange={(e) => handleContentChange(activeLang, 'seo.focusKeyword', e.target.value)}
                    placeholder={language === 'ar' ? 'الكلمة المفتاحية الرئيسية' : 'Primary keyword for SEO'}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    {language === 'ar'
                      ? 'استخدم كلمة مفتاحية واحدة أو عبارة قصيرة'
                      : 'Use one primary keyword or short phrase'}
                  </p>
                </div>

                {/* SEO Preview */}
                <div className="pt-4 border-t border-white/10">
                  <label className="block text-sm font-medium text-gray-400 mb-3">
                    {language === 'ar' ? 'معاينة Google' : 'Google Preview'}
                  </label>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-blue-600 text-lg font-medium truncate">
                      {formData.content[activeLang].seo.title || formData.title || 'عنوان الصفحة'}
                    </p>
                    <p className="text-green-700 text-sm truncate">
                      https://axiomx.pro/services/{formData.content[activeLang].slug || 'service-url'}
                    </p>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {formData.content[activeLang].seo.description || formData.shortDescription || 'وصف الصفحة يظهر هنا في نتائج البحث...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card with Workflow Controls (Phase 6A-4) */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-blue-400" />
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </h3>
                <WorkflowStatusBadge status={formData.status} size="md" />
              </div>

              {/* Workflow Controls */}
              {serviceId && (
                <ServiceWorkflowControls
                  serviceId={serviceId}
                  currentStatus={formData.status}
                  onStatusChange={handleStatusChange}
                />
              )}

              {/* Quick Status Selection (Legacy) */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-gray-500 mb-2">
                  {language === 'ar' ? 'أو اختر مباشرة:' : 'Or select directly:'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(['draft', 'review', 'approved', 'published', 'archived'] as ServiceStatus[]).map((status) => {
                    const isDisabled = status === 'published' && !permissions.allowPublish;
                    return (
                      <button
                        key={status}
                        onClick={() => !isDisabled && handleStatusChange(status)}
                        disabled={isDisabled}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          formData.status === status
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : isDisabled
                            ? 'bg-white/5 text-gray-500 border border-white/10 opacity-50 cursor-not-allowed'
                            : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {language === 'ar' ? ServiceStatusLabels[status].ar : ServiceStatusLabels[status].en}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Workflow Timeline (Phase 6A-4) */}
            <WorkflowTimeline
              currentStatus={formData.status}
              createdAt={service?.createdAt}
              publishedAt={service?.publishedAt}
              updatedAt={service?.updatedAt}
            />

            {/* Image Card */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4">
                {language === 'ar' ? 'صورة الخدمة' : 'Service Image'}
              </h3>

              <div className="space-y-4">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5">
                  <img
                    src={formData.image || DEFAULT_SERVICE_IMAGE}
                    alt="Service"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer px-4 py-2 bg-white/10 rounded-lg text-white text-sm hover:bg-white/20 transition-colors">
                      {language === 'ar' ? 'تغيير' : 'Change'}
                    </label>
                  </div>
                </div>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder={language === 'ar' ? 'رابط الصورة' : 'Image URL'}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
            </div>

            {/* Tags Card */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                {language === 'ar' ? 'الوسوم' : 'Tags'}
              </h3>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder={language === 'ar' ? 'أضف وسم' : 'Add tag'}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-white/5 rounded-lg text-gray-300 text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-500 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Related Services Card */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
              <ServiceRelationshipSelector
                selectedServiceIds={formData.relatedServiceIds}
                onChange={handleRelatedServicesChange}
                currentServiceId={serviceId}
                onValidationChange={handleValidationChange}
              />
            </div>

            {/* Featured Card */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                  className="w-5 h-5 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500"
                />
                <div>
                  <span className="text-white text-sm font-medium flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    {language === 'ar' ? 'خدمة مميزة' : 'Featured Service'}
                  </span>
                  <p className="text-gray-500 text-xs mt-1">
                    {language === 'ar'
                      ? 'ستظهر في قسم الخدمات المميزة'
                      : 'Will appear in featured services section'}
                  </p>
                </div>
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
              {/* Validation Error Banner */}
              {!isRelationshipValid && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <div>
                    <p className="text-red-400 text-sm font-medium">
                      {language === 'ar'
                        ? 'لا يمكن حفظ الخدمة'
                        : 'Cannot save service'}
                    </p>
                    <p className="text-red-400/70 text-xs">
                      {language === 'ar'
                        ? 'يوجد أخطاء في العلاقات. يرجى تصحيحها.'
                        : 'There are relationship errors. Please fix them before saving.'}
                    </p>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting || !isRelationshipValid}
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {!isRelationshipValid ? (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      {language === 'ar' ? 'تصحيح الأخطاء أولاً' : 'Fix errors first'}
                    </>
                  ) : isSubmitting ? (
                    <>
                      <Save className="w-4 h-4" />
                      {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/services')}
                  className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 font-medium transition-colors"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ServiceEditPage;
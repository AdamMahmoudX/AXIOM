// =====================================================
// SERVICE CREATE PAGE - AXIOMX ADMIN SYSTEM
// Phase 5A: Services CMS - Create Service
// Phase 5B: Category Integration
// Phase 5E-2: Service Relationship Validation
// =====================================================

import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServices, RelationshipValidationError } from '../../../context/ServiceContext';
import { useCategories } from '../../../context/CategoryContext';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { SITE_URL } from '../../../config/env';
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
  Upload,
  Image as ImageIcon,
  Tag,
  Folder,
  Star,
  Languages,
  Tag as TagIcon,
  Link2,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import LanguageTabs from '../../../components/LanguageTabs';
import BlockEditor from '../../../components/blocks/BlockEditor';
import ServiceRelationshipSelector from '../../../components/ServiceRelationshipSelector';
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

const ServiceCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const { addService, checkSlugUniqueness, isSlugTaken, getRelationshipErrors } = useServices();
  const { getActiveCategories } = useCategories();
  const activeCategories = getActiveCategories();

  const [activeLang, setActiveLang] = useState<'en' | 'ar'>('en');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');
  const [relationshipErrors, setRelationshipErrors] = useState<RelationshipValidationError[]>([]);
  const [isRelationshipValid, setIsRelationshipValid] = useState(true);

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

  const canManageServices = user?.role === 'owner' || user?.role === 'admin';

  useEffect(() => {
    if (!canManageServices) {
      navigate('/admin/services');
    }
  }, [canManageServices, navigate]);

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
    const currentSlug = formData.content[activeLang].slug || generateSlug(formData.title);
    if (currentSlug && isSlugTaken(currentSlug)) {
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

    // Auto-generate slug from title
    if (field === 'title' && activeLang === 'en') {
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

    // Auto-generate slug from title for English
    if (field === 'description' && lang === 'en' && !formData.content.en.slug) {
      const slug = generateSlug(formData.title);
      setFormData((prev) => ({
        ...prev,
        content: {
          ...prev.content,
          en: { ...prev.content.en, slug },
        },
      }));
    }

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

  const handleValidationChange = useCallback((
    isValid: boolean,
    _errorCount: number,
    errors: RelationshipValidationError[]
  ) => {
    setIsRelationshipValid(isValid);
    setRelationshipErrors(errors);

    // Clear relationship error when relationships become valid
    if (isValid) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.relationships;
        return newErrors;
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const slug = formData.content.en.slug || generateSlug(formData.title);
      const slugAr = formData.content.ar.slug || generateSlug(formData.title);

      const newService: Omit<Service, 'id' | 'createdAt' | 'updatedAt'> = {
        title: formData.title,
        shortDescription: formData.shortDescription,
        status: formData.status,
        category: formData.category,
        categoryIds: formData.categoryIds,
        tags: formData.tags,
        image: formData.image,
        gallery: formData.gallery,
        featured: formData.featured,
        order: 0,
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
            title: formData.content.ar.excerpt ? formData.title : '',
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
        translationStatus: {
          en: 'complete',
          ar: formData.content.ar.excerpt ? 'complete' : 'missing',
        },
      };

      addService(newService);
      navigate('/admin/services');
    } catch (error) {
      console.error('Error creating service:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              {language === 'ar' ? 'إنشاء خدمة جديدة' : 'Create New Service'}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {language === 'ar' ? 'أضف خدمة جديدة إلى موقعك' : 'Add a new service to your website'}
            </p>
          </div>
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

                {/* Category IDs (Multi-select) */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    <TagIcon className="w-4 h-4 inline-block ml-1" />
                    {language === 'ar' ? 'فئات الخدمات' : 'Service Categories'}
                  </label>
                  <p className="text-gray-500 text-xs mb-3">
                    {language === 'ar'
                      ? 'اختر فئات متعددة للخدمة (اختياري)'
                      : 'Select multiple categories for the service (optional)'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategoryToggle(cat.id)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.categoryIds.includes(cat.id)
                            ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400'
                            : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        {language === 'ar' ? cat.nameAr : cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Card */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                {language === 'ar' ? 'المحتوى' : 'Content'}
              </h2>

              <LanguageTabs activeLanguage={activeLang} onLanguageChange={setActiveLang} />

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
                  <p className="text-gray-500 text-xs mt-1">
                    {language === 'ar'
                      ? 'سيتم استخدام هذا كجزء من رابط الخدمة'
                      : 'This will be used as part of the service URL'}
                  </p>
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
                    activeLanguage={activeLang}
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
                      {SITE_URL}/services/{formData.content[activeLang].slug || 'service-url'}
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
            {/* Status Card */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4">
                {language === 'ar' ? 'الحالة' : 'Status'}
              </h3>

              <div className="space-y-3">
                {(['draft', 'published', 'archived'] as ServiceStatus[]).map((status) => (
                  <label
                    key={status}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                      formData.status === status
                        ? 'bg-blue-500/10 border border-blue-500/30'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={formData.status === status}
                      onChange={() => handleInputChange('status', status)}
                      className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                    />
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${ServiceStatusColors[status].dot}`} />
                      <span className="text-white text-sm">
                        {language === 'ar' ? ServiceStatusLabels[status].ar : ServiceStatusLabels[status].en}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

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
                currentServiceId={undefined}
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
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting || !isRelationshipValid}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
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
                      {language === 'ar' ? 'حفظ الخدمة' : 'Save Service'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/services')}
                  className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 font-medium transition-colors"
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

export default ServiceCreatePage;
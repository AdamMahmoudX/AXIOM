// =====================================================
// CATEGORY EDIT PAGE - AXIOMX ADMIN SYSTEM
// Phase 5B: Service Categories Management
// =====================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import { useCategories } from '../../../context/CategoryContext';
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CategoryStatus,
  CATEGORY_STATUS_LABELS,
} from '../../../types/project';
import {
  ArrowLeft,
  Save,
  Code,
  Smartphone,
  Palette,
  Brain,
  Gamepad2,
  Cloud,
  ShoppingCart,
  BarChart,
  Shield,
  Layers,
  Zap,
  Globe,
  Server,
  Database,
  Lock,
  Mail,
  MessageSquare,
  Users,
  FileText,
  Image,
  AlertCircle,
} from 'lucide-react';

const iconComponents: Record<string, React.FC<{ className?: string }>> = {
  Code,
  Smartphone,
  Palette,
  Brain,
  Gamepad2,
  Cloud,
  ShoppingCart,
  BarChart,
  Shield,
  Layers,
  Zap,
  Globe,
  Server,
  Database,
  Lock,
  Mail,
  MessageSquare,
  Users,
  FileText,
  Image,
};

const CategoryEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const { getCategory, updateCategory, isSlugTaken } = useCategories();
  const isRTL = language === 'ar';

  const category = id ? getCategory(id) : undefined;

  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    slug: '',
    description: '',
    descriptionAr: '',
    icon: 'Code',
    color: 'blue',
    status: 'active' as CategoryStatus,
    order: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        nameAr: category.nameAr,
        slug: category.slug,
        description: category.description,
        descriptionAr: category.descriptionAr,
        icon: category.icon,
        color: category.color,
        status: category.status,
        order: category.order,
      });
    }
  }, [category]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: slugManuallyEdited ? prev.slug : generateSlug(value),
    }));
  };

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true);
    setFormData((prev) => ({ ...prev, slug: generateSlug(value) }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = language === 'ar' ? 'الاسم مطلوب' : 'Name is required';
    }

    if (!formData.nameAr.trim()) {
      newErrors.nameAr = language === 'ar' ? 'الاسم بالعربية مطلوب' : 'Arabic name is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = language === 'ar' ? 'الرابط المختصر مطلوب' : 'Slug is required';
    } else if (isSlugTaken(formData.slug, id)) {
      newErrors.slug = language === 'ar' ? 'هذا الرابط مستخدم بالفعل' : 'This slug is already taken';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !id) return;

    setIsSubmitting(true);

    try {
      updateCategory(id, formData);
      navigate('/admin/categories');
    } catch (error) {
      console.error('Error updating category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      green: 'bg-green-500/20 text-green-400 border-green-500/30',
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      pink: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      indigo: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      red: 'bg-red-500/20 text-red-400 border-red-500/30',
      teal: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    };
    return colorMap[color] || colorMap.blue;
  };

  if (!category) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              {language === 'ar' ? 'الفئة غير موجودة' : 'Category Not Found'}
            </h2>
            <button
              onClick={() => navigate('/admin/categories')}
              className="text-blue-400 hover:text-blue-300"
            >
              {language === 'ar' ? 'العودة للفئات' : 'Back to Categories'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/categories')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          {language === 'ar' ? 'العودة للفئات' : 'Back to Categories'}
        </button>
        <h1 className="text-3xl font-bold text-white">
          {language === 'ar' ? 'تعديل الفئة' : 'Edit Category'}
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">
              {language === 'ar' ? 'المعلومات الأساسية' : 'Basic Information'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  {language === 'ar' ? 'الاسم (English)' : 'Name (English)'} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={`w-full px-4 py-2.5 bg-white/5 border ${
                    errors.name ? 'border-red-500' : 'border-white/10'
                  } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}
                  placeholder={language === 'ar' ? 'مثال: تطوير الويب' : 'e.g., Web Development'}
                />
                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  {language === 'ar' ? 'الاسم (العربية)' : 'Name (Arabic)'} *
                </label>
                <input
                  type="text"
                  value={formData.nameAr}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nameAr: e.target.value }))}
                  className={`w-full px-4 py-2.5 bg-white/5 border ${
                    errors.nameAr ? 'border-red-500' : 'border-white/10'
                  } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}
                  placeholder={language === 'ar' ? 'مثال: تطوير الويب' : 'مثال: تطوير الويب'}
                />
                {errors.nameAr && <p className="mt-1 text-sm text-red-400">{errors.nameAr}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {language === 'ar' ? 'الرابط المختصر (Slug)' : 'Slug'} *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className={`w-full px-4 py-2.5 bg-white/5 border ${
                  errors.slug ? 'border-red-500' : 'border-white/10'
                } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
                placeholder={language === 'ar' ? 'مثال: web-development' : 'e.g., web-development'}
              />
              {errors.slug && <p className="mt-1 text-sm text-red-400">{errors.slug}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">
              {language === 'ar' ? 'الوصف' : 'Description'}
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {language === 'ar' ? 'الوصف (English)' : 'Description (English)'}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
                className={`w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
                placeholder={language === 'ar' ? 'وصف الفئة...' : 'Category description...'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {language === 'ar' ? 'الوصف (العربية)' : 'Description (Arabic)'}
              </label>
              <textarea
                value={formData.descriptionAr}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, descriptionAr: e.target.value }))
                }
                rows={3}
                className={`w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
                placeholder={language === 'ar' ? 'وصف الفئة...' : 'وصف الفئة...'}
              />
            </div>
          </div>

          {/* Icon & Color */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">
              {language === 'ar' ? 'الشكل والمظهر' : 'Appearance'}
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">
                {language === 'ar' ? 'الأيقونة' : 'Icon'}
              </label>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {CATEGORY_ICONS.map((iconName) => {
                  const IconComponent = iconComponents[iconName] || Code;
                  const isSelected = formData.icon === iconName;
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, icon: iconName }))}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                      title={iconName}
                    >
                      <IconComponent className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">
                {language === 'ar' ? 'اللون' : 'Color'}
              </label>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {CATEGORY_COLORS.map((color) => {
                  const isSelected = formData.color === color;
                  const colorMap: Record<string, string> = {
                    blue: 'bg-blue-500',
                    green: 'bg-green-500',
                    purple: 'bg-purple-500',
                    orange: 'bg-orange-500',
                    pink: 'bg-pink-500',
                    cyan: 'bg-cyan-500',
                    amber: 'bg-amber-500',
                    indigo: 'bg-indigo-500',
                    red: 'bg-red-500',
                    teal: 'bg-teal-500',
                  };
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, color }))}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        colorMap[color]
                      } ${
                        isSelected
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0a]'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                      title={color}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Status & Order */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">
              {language === 'ar' ? 'الإعدادات' : 'Settings'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, status: e.target.value as CategoryStatus }))
                  }
                  className={`w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}
                >
                  <option value="active">{CATEGORY_STATUS_LABELS.active[language]}</option>
                  <option value="inactive">{CATEGORY_STATUS_LABELS.inactive[language]}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  {language === 'ar' ? 'الترتيب' : 'Order'}
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))
                  }
                  className={`w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}
                  min={0}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            {language === 'ar' ? 'معاينة' : 'Preview'}
          </h2>
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClass(
                formData.color
              )} border`}
            >
              {React.createElement(iconComponents[formData.icon] || Code, { className: 'w-6 h-6' })}
            </div>
            <div>
              <p className="text-white font-medium">
                {formData.nameAr || formData.name || (language === 'ar' ? 'اسم الفئة' : 'Category Name')}
              </p>
              <p className="text-sm text-gray-500">{formData.slug || 'slug'}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/categories')}
            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors"
          >
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {isSubmitting
              ? language === 'ar'
                ? 'جاري الحفظ...'
                : 'Saving...'
              : language === 'ar'
              ? 'حفظ التغييرات'
              : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryEditPage;
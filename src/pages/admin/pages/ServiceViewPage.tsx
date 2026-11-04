// =====================================================
// SERVICE VIEW PAGE - AXIOMX ADMIN SYSTEM
// Phase 5A: Services CMS - View Service
// Phase 6A-6: Service Audit Log System
// =====================================================

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useServices } from '../../../context/ServiceContext';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import {
  ServiceStatusLabels,
  ServiceStatusColors,
  TRANSLATION_STATUS_COLORS,
} from '../../../types/project';
import { ServiceAuditHistory } from '../../../components/ServiceAuditLog';
import {
  ArrowLeft,
  Edit2,
  Copy,
  Calendar,
  Tag,
  Star,
  Eye,
  Globe,
  Check,
  AlertCircle,
  X,
  Link2,
  ExternalLink,
  History,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

const ServiceViewPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const { getService, duplicateService, getRelatedServices, getAuditLogs } = useServices();
  const [showAuditHistory, setShowAuditHistory] = React.useState(false);

  const service = serviceId ? getService(serviceId) : undefined;
  const relatedServices = serviceId ? getRelatedServices(serviceId) : [];
  const auditLogs = serviceId ? getAuditLogs(serviceId) : [];
  const canManageServices = user?.role === 'owner' || user?.role === 'admin';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDuplicate = () => {
    if (serviceId) {
      const newId = duplicateService(serviceId);
      if (newId) {
        navigate(`/admin/services/edit/${newId}`);
      }
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

  const statusLabels = ServiceStatusLabels[service.status];
  const statusColors = ServiceStatusColors[service.status];

  return (
    <div className="p-6 max-w-5xl mx-auto">
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
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{service.title}</h1>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusColors.dot}`} />
                {language === 'ar' ? statusLabels.ar : statusLabels.en}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {language === 'ar' ? 'تفاصيل الخدمة' : 'Service Details'}
            </p>
          </div>
        </div>

        {canManageServices && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleDuplicate}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 font-medium transition-colors flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              {language === 'ar' ? 'نسخ' : 'Duplicate'}
            </button>
            <button
              onClick={() => navigate(`/admin/services/edit/${serviceId}`)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-colors flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              {language === 'ar' ? 'تعديل' : 'Edit'}
            </button>
            {service.status === 'published' && (
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
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Image */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-64 object-cover"
            />
          </div>

          {/* Description */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              {language === 'ar' ? 'الوصف' : 'Description'}
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {service.shortDescription}
            </p>
            {service.content.en.description && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <h3 className="text-sm font-medium text-gray-400 mb-2">
                  {language === 'ar' ? 'الوصف الكامل (EN)' : 'Full Description (EN)'}
                </h3>
                <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
                  {service.content.en.description}
                </p>
              </div>
            )}
            {service.content.ar.description && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <h3 className="text-sm font-medium text-gray-400 mb-2">
                  {language === 'ar' ? 'الوصف الكامل (AR)' : 'Full Description (AR)'}
                </h3>
                <p className="text-gray-400 leading-relaxed whitespace-pre-wrap" dir="rtl">
                  {service.content.ar.description}
                </p>
              </div>
            )}
          </div>

          {/* Content Blocks */}
          {service.content.en.blocks.length > 0 && (
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                {language === 'ar' ? 'الكتلة' : 'Content Blocks'}
              </h2>
              <div className="space-y-4">
                {service.content.en.blocks.map((block, index) => (
                  <div
                    key={block.id}
                    className="p-4 bg-white/5 rounded-xl border border-white/10"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                        {block.type}
                      </span>
                      <span className="text-gray-500 text-xs">#{index + 1}</span>
                    </div>
                    {block.type === 'title' && (
                      <h3 className="text-white font-semibold">
                        {block.content?.en || block.content?.ar || ''}
                      </h3>
                    )}
                    {block.type === 'richText' && (
                      <p className="text-gray-300">
                        {block.content?.en || block.content?.ar || ''}
                      </p>
                    )}
                    {block.type === 'image' && block.url && (
                      <img
                        src={block.url}
                        alt={block.alt?.en || block.alt?.ar || ''}
                        className="rounded-lg max-h-48"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Meta Info */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4">
              {language === 'ar' ? 'معلومات الخدمة' : 'Service Information'}
            </h3>

            <div className="space-y-4">
              {/* Category */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Tag className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    {language === 'ar' ? 'التصنيف' : 'Category'}
                  </p>
                  <p className="text-white text-sm">{service.category || '-'}</p>
                </div>
              </div>

              {/* Featured */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Star className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    {language === 'ar' ? 'تمييز' : 'Featured'}
                  </p>
                  <p className="text-white text-sm">
                    {service.featured
                      ? language === 'ar'
                        ? 'نعم'
                        : 'Yes'
                      : language === 'ar'
                      ? 'لا'
                      : 'No'}
                  </p>
                </div>
              </div>

              {/* Created */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    {language === 'ar' ? 'تاريخ الإنشاء' : 'Created'}
                  </p>
                  <p className="text-white text-sm">{formatDate(service.createdAt)}</p>
                </div>
              </div>

              {/* Updated */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    {language === 'ar' ? 'آخر تحديث' : 'Last Updated'}
                  </p>
                  <p className="text-white text-sm">{formatDate(service.updatedAt)}</p>
                </div>
              </div>

              {/* Published */}
              {service.publishedAt && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      {language === 'ar' ? 'تاريخ النشر' : 'Published'}
                    </p>
                    <p className="text-white text-sm">{formatDate(service.publishedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              {language === 'ar' ? 'الوسوم' : 'Tags'}
            </h3>

            {service.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-white/5 rounded-lg text-gray-300 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                {language === 'ar' ? 'لا توجد وسوم' : 'No tags'}
              </p>
            )}
          </div>

          {/* Translation Status */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {language === 'ar' ? 'حالة الترجمة' : 'Translation Status'}
            </h3>

            <div className="space-y-3">
              {/* English */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇺🇸</span>
                  <span className="text-white text-sm">English</span>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${TRANSLATION_STATUS_COLORS[service.translationStatus.en].bg} ${TRANSLATION_STATUS_COLORS[service.translationStatus.en].text}`}>
                  {service.translationStatus.en === 'complete' && <Check className="w-3 h-3" />}
                  {service.translationStatus.en === 'needs_review' && <AlertCircle className="w-3 h-3" />}
                  {service.translationStatus.en === 'missing' && <X className="w-3 h-3" />}
                  {language === 'ar'
                    ? service.translationStatus.en === 'complete'
                      ? 'مكتمل'
                      : service.translationStatus.en === 'needs_review'
                      ? 'يحتاج مراجعة'
                      : 'ناقص'
                    : service.translationStatus.en === 'complete'
                    ? 'Complete'
                    : service.translationStatus.en === 'needs_review'
                    ? 'Needs Review'
                    : 'Missing'}
                </span>
              </div>

              {/* Arabic */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇸🇦</span>
                  <span className="text-white text-sm">العربية</span>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${TRANSLATION_STATUS_COLORS[service.translationStatus.ar].bg} ${TRANSLATION_STATUS_COLORS[service.translationStatus.ar].text}`}>
                  {service.translationStatus.ar === 'complete' && <Check className="w-3 h-3" />}
                  {service.translationStatus.ar === 'needs_review' && <AlertCircle className="w-3 h-3" />}
                  {service.translationStatus.ar === 'needs_review' && <AlertCircle className="w-3 h-3" />}
                  {service.translationStatus.ar === 'missing' && <X className="w-3 h-3" />}
                  {language === 'ar'
                    ? service.translationStatus.ar === 'complete'
                      ? 'مكتمل'
                      : service.translationStatus.ar === 'needs_review'
                      ? 'يحتاج مراجعة'
                      : 'ناقص'
                    : service.translationStatus.ar === 'complete'
                    ? 'Complete'
                    : service.translationStatus.ar === 'needs_review'
                    ? 'Needs Review'
                    : 'Missing'}
                </span>
              </div>
            </div>
          </div>

          {/* Related Services */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-blue-400" />
              {language === 'ar' ? 'الخدمات المرتبطة' : 'Related Services'}
              {relatedServices.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                  {relatedServices.length}
                </span>
              )}
            </h3>

            {relatedServices.length > 0 ? (
              <div className="space-y-2">
                {relatedServices.map((relatedService) => (
                  <div
                    key={relatedService.id}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                      {relatedService.image ? (
                        <img
                          src={relatedService.image}
                          alt={relatedService.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Link2 className="w-4 h-4 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {relatedService.title}
                      </p>
                      <p className="text-gray-500 text-xs truncate">
                        {relatedService.category}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/admin/services/view/${relatedService.id}`)}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-blue-500/20 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                      title={language === 'ar' ? 'عرض' : 'View'}
                    >
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">
                {language === 'ar'
                  ? 'لا توجد خدمات مرتبطة'
                  : 'No related services'}
              </p>
            )}

            <p className="text-xs text-gray-500 mt-3 text-center">
              {language === 'ar'
                ? `${relatedServices.length} خدمة مربوطة`
                : `${relatedServices.length} services linked`}
            </p>
          </div>

          {/* SEO Info */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {language === 'ar' ? 'معلومات SEO' : 'SEO Information'}
            </h3>

            <div className="space-y-4">
              {/* Slug */}
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  {language === 'ar' ? 'الرابط (EN)' : 'URL Slug (EN)'}
                </p>
                <p className="text-blue-400 text-sm font-mono">
                  /services/{service.content.en.slug || '-'}
                </p>
              </div>
              {service.content.ar.slug && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    {language === 'ar' ? 'الرابط (AR)' : 'URL Slug (AR)'}
                  </p>
                  <p className="text-blue-400 text-sm font-mono" dir="rtl">
                    /services/{service.content.ar.slug}
                  </p>
                </div>
              )}

              {/* Meta Title */}
              <div className="pt-3 border-t border-white/10">
                <p className="text-xs text-gray-500 mb-1">
                  {language === 'ar' ? 'Meta Title (EN)' : 'Meta Title (EN)'}
                </p>
                <p className="text-gray-300 text-sm">
                  {service.content.en.seo?.title || '-'}
                </p>
                {service.content.en.seo?.title && (
                  <p className="text-gray-500 text-xs mt-1">
                    {language === 'ar'
                      ? `${service.content.en.seo.title.length}/60 حرف`
                      : `${service.content.en.seo.title.length}/60 characters`}
                  </p>
                )}
              </div>

              {/* Arabic Meta Title */}
              {service.content.ar.seo?.title && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    {language === 'ar' ? 'Meta Title (AR)' : 'Meta Title (AR)'}
                  </p>
                  <p className="text-gray-300 text-sm" dir="rtl">
                    {service.content.ar.seo.title}
                  </p>
                </div>
              )}

              {/* Meta Description */}
              <div className="pt-3 border-t border-white/10">
                <p className="text-xs text-gray-500 mb-1">
                  {language === 'ar' ? 'Meta Description (EN)' : 'Meta Description (EN)'}
                </p>
                <p className="text-gray-300 text-sm line-clamp-2">
                  {service.content.en.seo?.description || '-'}
                </p>
                {service.content.en.seo?.description && (
                  <p className="text-gray-500 text-xs mt-1">
                    {language === 'ar'
                      ? `${service.content.en.seo.description.length}/160 حرف`
                      : `${service.content.en.seo.description.length}/160 characters`}
                  </p>
                )}
              </div>

              {/* Arabic Meta Description */}
              {service.content.ar.seo?.description && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    {language === 'ar' ? 'Meta Description (AR)' : 'Meta Description (AR)'}
                  </p>
                  <p className="text-gray-300 text-sm line-clamp-2" dir="rtl">
                    {service.content.ar.seo.description}
                  </p>
                </div>
              )}

              {/* Focus Keyword */}
              <div className="pt-3 border-t border-white/10">
                <p className="text-xs text-gray-500 mb-1">
                  {language === 'ar' ? 'الكلمة المفتاحية (EN)' : 'Focus Keyword (EN)'}
                </p>
                <div className="flex items-center gap-2">
                  {service.content.en.seo?.focusKeyword ? (
                    <>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-lg">
                        {service.content.en.seo.focusKeyword}
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-500 text-sm">
                      {language === 'ar' ? 'لم يتم تحديد كلمة مفتاحية' : 'No keyword set'}
                    </span>
                  )}
                </div>
              </div>

              {/* Arabic Focus Keyword */}
              {service.content.ar.seo?.focusKeyword && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    {language === 'ar' ? 'الكلمة المفتاحية (AR)' : 'Focus Keyword (AR)'}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-lg" dir="rtl">
                      {service.content.ar.seo.focusKeyword}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Audit History Section (Phase 6A-6) */}
          <div className="mt-6">
            <button
              onClick={() => setShowAuditHistory(!showAuditHistory)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <History className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold">
                    {language === 'ar' ? 'سجل التدقيق' : 'Audit Log'}
                  </h3>
                  <p className="text-gray-500 text-xs">
                    {language === 'ar'
                      ? `${auditLogs.length} سجل`
                      : `${auditLogs.length} entries`}
                  </p>
                </div>
              </div>
              {showAuditHistory ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {showAuditHistory && (
              <div className="mt-4">
                <ServiceAuditHistory
                  entries={auditLogs}
                  serviceId={serviceId || ''}
                  serviceTitle={service?.title}
                  showStats={true}
                  showFilters={true}
                  maxHeight="400px"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceViewPage;
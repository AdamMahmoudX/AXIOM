// =====================================================
// SERVICE ANALYTICS WIDGETS - AXIOMX ADMIN SYSTEM
// Phase 5F-5: Service Analytics Dashboard Widgets
// =====================================================

import React, { useMemo } from 'react';
import { useServices } from '../context/ServiceContext';
import { useLanguage } from '../context/LanguageContext';
import { Service } from '../types/project';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Globe,
  ChevronRight,
  Eye,
  Star,
  Tag,
} from 'lucide-react';

// =====================================================
// HELPER TYPES
// =====================================================

interface WidgetCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  iconColor: string;
  children?: React.ReactNode;
}

interface ServiceItemProps {
  service: Service;
  rank?: number;
  secondaryText?: string;
  onClick?: () => void;
}

// =====================================================
// TOP PERFORMING SERVICES WIDGET
// =====================================================

const TopPerformingServicesWidget: React.FC = () => {
  const { language } = useLanguage();
  const { services } = useServices();

  const topServices = useMemo(() => {
    return services
      .filter(s => s.status === 'published')
      .sort((a, b) => {
        // Score based on: featured status + related services count + translation completeness
        const scoreA = (a.featured ? 20 : 0) + (a.relatedServiceIds?.length || 0) * 5 +
          (a.translationStatus.en === 'complete' ? 10 : 0) +
          (a.translationStatus.ar === 'complete' ? 10 : 0) +
          (a.gallery?.length || 0) * 3 +
          (a.content.en.blocks?.length || 0) * 2;
        const scoreB = (b.featured ? 20 : 0) + (b.relatedServiceIds?.length || 0) * 5 +
          (b.translationStatus.en === 'complete' ? 10 : 0) +
          (b.translationStatus.ar === 'complete' ? 10 : 0) +
          (b.gallery?.length || 0) * 3 +
          (b.content.en.blocks?.length || 0) * 2;
        return scoreB - scoreA;
      })
      .slice(0, 5);
  }, [services]);

  const labels = {
    title: language === 'ar' ? 'أفضل الخدمات أداءً' : 'Top Performing Services',
    viewAll: language === 'ar' ? 'عرض الكل' : 'View All',
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">{labels.title}</h3>
              <p className="text-xs text-gray-500">{topServices.length} {language === 'ar' ? 'خدمات' : 'services'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-2">
        {topServices.length > 0 ? (
          topServices.map((service, index) => (
            <div
              key={service.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <span className="text-green-400 font-bold text-sm">#{index + 1}</span>
              </div>
              <img
                src={service.image}
                alt={service.title}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-white text-sm font-medium truncate">{service.title}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Tag className="w-3 h-3" />
                  <span className="truncate">{service.category || '-'}</span>
                  {service.featured && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>{(service.relatedServiceIds?.length || 0)}</span>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">
              {language === 'ar' ? 'لا توجد خدمات منشورة' : 'No published services'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// =====================================================
// LOWEST PERFORMING SERVICES WIDGET
// =====================================================

const LowestPerformingServicesWidget: React.FC = () => {
  const { language } = useLanguage();
  const { services } = useServices();

  const lowestServices = useMemo(() => {
    return services
      .filter(s => s.status === 'published' || s.status === 'draft')
      .sort((a, b) => {
        // Score based on: featured status + related services count + translation completeness
        const scoreA = (a.featured ? 20 : 0) + (a.relatedServiceIds?.length || 0) * 5 +
          (a.translationStatus.en === 'complete' ? 10 : 0) +
          (a.translationStatus.ar === 'complete' ? 10 : 0) +
          (a.gallery?.length || 0) * 3 +
          (a.content.en.blocks?.length || 0) * 2;
        const scoreB = (b.featured ? 20 : 0) + (b.relatedServiceIds?.length || 0) * 5 +
          (b.translationStatus.en === 'complete' ? 10 : 0) +
          (b.translationStatus.ar === 'complete' ? 10 : 0) +
          (b.gallery?.length || 0) * 3 +
          (b.content.en.blocks?.length || 0) * 2;
        return scoreA - scoreB;
      })
      .slice(0, 5);
  }, [services]);

  const labels = {
    title: language === 'ar' ? 'الخدمات الأقل أداءً' : 'Lowest Performing Services',
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">{labels.title}</h3>
            <p className="text-xs text-gray-500">{lowestServices.length} {language === 'ar' ? 'خدمات' : 'services'}</p>
          </div>
        </div>
      </div>

      <div className="p-2">
        {lowestServices.length > 0 ? (
          lowestServices.map((service, index) => (
            <div
              key={service.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <span className="text-amber-400 font-bold text-sm">#{index + 1}</span>
              </div>
              <img
                src={service.image}
                alt={service.title}
                className="w-10 h-10 rounded-lg object-cover opacity-60"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-white text-sm font-medium truncate">{service.title}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className={`px-1.5 py-0.5 rounded ${
                    service.status === 'draft' ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {service.status === 'draft'
                      ? (language === 'ar' ? 'مسودة' : 'Draft')
                      : (language === 'ar' ? 'منشور' : 'Published')
                    }
                  </span>
                  {service.translationStatus.ar === 'missing' && (
                    <span className="text-red-400">
                      {language === 'ar' ? 'ينتظر الترجمة' : 'Needs translation'}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
            </div>
          ))
        ) : (
          <div className="p-6 text-center">
            <TrendingDown className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">
              {language === 'ar' ? 'لا توجد خدمات' : 'No services'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// =====================================================
// SERVICES MISSING SEO WIDGET
// =====================================================

const ServicesMissingSEOWidget: React.FC = () => {
  const { language } = useLanguage();
  const { services } = useServices();

  const missingSEO = useMemo(() => {
    return services.filter(service => {
      const en = service.content.en;
      const ar = service.content.ar;
      return (
        !en.seo?.title || en.seo.title.trim() === '' ||
        !en.seo?.description || en.seo.description.trim() === '' ||
        !ar.seo?.title || ar.seo.title.trim() === '' ||
        !ar.seo?.description || ar.seo.description.trim() === '' ||
        !en.slug || en.slug.trim() === ''
      );
    });
  }, [services]);

  const labels = {
    title: language === 'ar' ? 'خدمات بدون SEO' : 'Services Missing SEO',
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">{labels.title}</h3>
            <p className="text-xs text-gray-500">
              {missingSEO.length} {language === 'ar' ? 'خدمات تحتاج تحسين' : 'services need improvement'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-2 max-h-[300px] overflow-y-auto">
        {missingSEO.length > 0 ? (
          missingSEO.map((service) => {
            const en = service.content.en;
            const ar = service.content.ar;
            const missingItems: string[] = [];

            if (!en.seo?.title || en.seo.title.trim() === '') {
              missingItems.push(language === 'ar' ? 'EN العنوان' : 'EN Title');
            }
            if (!en.seo?.description || en.seo.description.trim() === '') {
              missingItems.push(language === 'ar' ? 'EN الوصف' : 'EN Description');
            }
            if (!ar.seo?.title || ar.seo.title.trim() === '') {
              missingItems.push(language === 'ar' ? 'AR العنوان' : 'AR Title');
            }
            if (!ar.seo?.description || ar.seo.description.trim() === '') {
              missingItems.push(language === 'ar' ? 'AR الوصف' : 'AR Description');
            }
            if (!en.slug || en.slug.trim() === '') {
              missingItems.push(language === 'ar' ? 'الرابط الثابت' : 'Slug');
            }

            return (
              <div
                key={service.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-medium truncate">{service.title}</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {missingItems.map((item, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-red-500/10 text-red-400 text-xs rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0 mt-2" />
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-green-400 text-sm">
              {language === 'ar' ? 'جميع الخدمات تحتوي على SEO!' : 'All services have SEO!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// =====================================================
// SERVICES MISSING TRANSLATION WIDGET
// =====================================================

const ServicesMissingTranslationWidget: React.FC = () => {
  const { language } = useLanguage();
  const { services } = useServices();

  const missingTranslation = useMemo(() => {
    return services.filter(service =>
      service.translationStatus.ar === 'missing' ||
      service.translationStatus.en === 'missing'
    );
  }, [services]);

  const labels = {
    title: language === 'ar' ? 'خدمات بدون ترجمة' : 'Services Missing Translation',
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Globe className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">{labels.title}</h3>
            <p className="text-xs text-gray-500">
              {missingTranslation.length} {language === 'ar' ? 'خدمات تحتاج ترجمة' : 'services need translation'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-2 max-h-[300px] overflow-y-auto">
        {missingTranslation.length > 0 ? (
          missingTranslation.map((service) => {
            const missingLangs: string[] = [];
            if (service.translationStatus.en === 'missing') {
              missingLangs.push(language === 'ar' ? 'الإنجليزية' : 'English');
            }
            if (service.translationStatus.ar === 'missing') {
              missingLangs.push(language === 'ar' ? 'العربية' : 'Arabic');
            }

            return (
              <div
                key={service.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-medium truncate">{service.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {missingLangs.map((lang, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-purple-500/10 text-purple-400 text-xs rounded flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0 mt-2" />
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center">
            <Globe className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-green-400 text-sm">
              {language === 'ar' ? 'جميع الخدمات مترجمة!' : 'All services are translated!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// =====================================================
// MAIN ANALYTICS WIDGETS CONTAINER
// =====================================================

const ServiceAnalyticsWidgets: React.FC = () => {
  const { language } = useLanguage();
  const { services } = useServices();

  // Quick stats for summary
  const stats = useMemo(() => ({
    total: services.length,
    published: services.filter(s => s.status === 'published').length,
    missingSEO: services.filter(s => {
      const en = s.content.en;
      const ar = s.content.ar;
      return (
        !en.seo?.title || en.seo.title.trim() === '' ||
        !en.seo?.description || en.seo.description.trim() === ''
      );
    }).length,
    missingTranslation: services.filter(s =>
      s.translationStatus.ar === 'missing'
    ).length,
  }), [services]);

  const labels = {
    sectionTitle: language === 'ar' ? 'أدوات تحليل الخدمات' : 'Service Analytics Widgets',
    summary: language === 'ar'
      ? `${stats.total} خدمة | ${stats.published} منشورة | ${stats.missingSEO} بدون SEO | ${stats.missingTranslation} تنتظر ترجمة`
      : `${stats.total} services | ${stats.published} published | ${stats.missingSEO} missing SEO | ${stats.missingTranslation} need translation`,
  };

  return (
    <div className="mb-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            {labels.sectionTitle}
          </h2>
          <p className="text-xs text-gray-500 mt-1">{labels.summary}</p>
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <TopPerformingServicesWidget />
        <LowestPerformingServicesWidget />
        <ServicesMissingSEOWidget />
        <ServicesMissingTranslationWidget />
      </div>
    </div>
  );
};

export default ServiceAnalyticsWidgets;
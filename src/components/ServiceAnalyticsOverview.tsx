// =====================================================
// SERVICE ANALYTICS OVERVIEW DASHBOARD - AXIOMX ADMIN SYSTEM
// Phase 5F-6: Service Analytics Overview Dashboard
// =====================================================

import React, { useMemo } from 'react';
import { useServices } from '../context/ServiceContext';
import { useLanguage } from '../context/LanguageContext';
import { Service, LanguageContent, SEOContent, TranslationStatus } from '../types/project';
import {
  Boxes,
  Eye,
  FileText,
  AlertTriangle,
  Globe,
  Link2,
  UserX,
} from 'lucide-react';

// =====================================================
// HELPER FUNCTIONS
// =====================================================

// Check if service has SEO issues
const hasSEOIssues = (service: Service): boolean => {
  const en = service.content?.en;
  const ar = service.content?.ar;

  // Missing essential SEO fields in English
  if (!en?.seo?.title || en.seo.title.trim() === '') return true;
  if (!en?.seo?.description || en.seo.description.trim() === '') return true;
  if (!en?.title || en.title.trim() === '') return true;

  // Check for incomplete translation
  if (service.translationStatus?.ar === 'missing') return true;

  // Check for short description
  if (!service.shortDescription || service.shortDescription.length < 20) return true;

  return false;
};

// Check if service has relationships
const hasRelationships = (service: Service): boolean => {
  return service.relatedServiceIds && service.relatedServiceIds.length > 0;
};

// =====================================================
// SUMMARY CARD COMPONENT
// =====================================================

interface SummaryCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  iconBgColor: string;
  iconColor: string;
  description?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon,
  bgColor,
  borderColor,
  iconBgColor,
  iconColor,
  description,
}) => {
  return (
    <div className={`${bgColor} ${borderColor} rounded-xl p-4 transition-all duration-200 hover:scale-[1.02]`}>
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl ${iconBgColor} flex items-center justify-center`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-sm text-gray-400 truncate">{title}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// =====================================================
// SERVICE ANALYTICS OVERVIEW DASHBOARD
// =====================================================

const ServiceAnalyticsOverview: React.FC = () => {
  const { language } = useLanguage();
  const { services } = useServices();

  // Calculate all metrics from ServiceContext
  const metrics = useMemo(() => {
    const totalServices = services.length;
    const publishedServices = services.filter(s => s.status === 'published').length;
    const draftServices = services.filter(s => s.status === 'draft').length;
    const servicesMissingSEO = services.filter(s => hasSEOIssues(s)).length;
    const servicesMissingTranslation = services.filter(s =>
      s.translationStatus?.ar === 'missing' || s.translationStatus?.en === 'missing'
    ).length;
    const servicesWithRelationships = services.filter(s => hasRelationships(s)).length;

    // Orphan Services: services that have no relationships AND are not referenced by other services
    const allRelatedIds = new Set<string>();
    services.forEach(service => {
      service.relatedServiceIds?.forEach((id: string) => {
        allRelatedIds.add(id);
      });
    });

    const orphanServices = services.filter(s =>
      !hasRelationships(s) && !allRelatedIds.has(s.id)
    ).length;

    return {
      totalServices,
      publishedServices,
      draftServices,
      servicesMissingSEO,
      servicesMissingTranslation,
      servicesWithRelationships,
      orphanServices,
    };
  }, [services]);

  // Labels based on language
  const labels = {
    title: language === 'ar' ? 'نظرة عامة على الخدمات' : 'Services Overview',
    totalServices: language === 'ar' ? 'إجمالي الخدمات' : 'Total Services',
    publishedServices: language === 'ar' ? 'خدمات منشورة' : 'Published Services',
    draftServices: language === 'ar' ? 'خدمات مسودة' : 'Draft Services',
    servicesMissingSEO: language === 'ar' ? 'خدمات بدون SEO' : 'Services Missing SEO',
    servicesMissingTranslation: language === 'ar' ? 'خدمات بدون ترجمة' : 'Missing Translation',
    servicesWithRelationships: language === 'ar' ? 'خدمات ذات علاقات' : 'With Relationships',
    orphanServices: language === 'ar' ? 'خدمات يتيمة' : 'Orphan Services',
  };

  // Calculate percentages for descriptions
  const getPercentage = (value: number, total: number) => {
    if (total === 0) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  };

  return (
    <div className="mb-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
            <Boxes className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{labels.title}</h2>
            <p className="text-xs text-gray-500">
              {language === 'ar' ? 'إحصائيات الخدمات من ServiceContext' : 'Service statistics from ServiceContext'}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {/* Total Services */}
        <SummaryCard
          title={labels.totalServices}
          value={metrics.totalServices}
          icon={<Boxes className="w-6 h-6 text-blue-400" />}
          bgColor="bg-gradient-to-br from-blue-500/10 to-blue-600/5"
          borderColor="border border-blue-500/20"
          iconBgColor="bg-blue-500/20"
          iconColor="text-blue-400"
          description={language === 'ar' ? 'جميع الخدمات' : 'All services'}
        />

        {/* Published Services */}
        <SummaryCard
          title={labels.publishedServices}
          value={metrics.publishedServices}
          icon={<Eye className="w-6 h-6 text-green-400" />}
          bgColor="bg-gradient-to-br from-green-500/10 to-green-600/5"
          borderColor="border border-green-500/20"
          iconBgColor="bg-green-500/20"
          iconColor="text-green-400"
          description={getPercentage(metrics.publishedServices, metrics.totalServices)}
        />

        {/* Draft Services */}
        <SummaryCard
          title={labels.draftServices}
          value={metrics.draftServices}
          icon={<FileText className="w-6 h-6 text-amber-400" />}
          bgColor="bg-gradient-to-br from-amber-500/10 to-amber-600/5"
          borderColor="border border-amber-500/20"
          iconBgColor="bg-amber-500/20"
          iconColor="text-amber-400"
          description={getPercentage(metrics.draftServices, metrics.totalServices)}
        />

        {/* Services Missing SEO */}
        <SummaryCard
          title={labels.servicesMissingSEO}
          value={metrics.servicesMissingSEO}
          icon={<AlertTriangle className="w-6 h-6 text-red-400" />}
          bgColor="bg-gradient-to-br from-red-500/10 to-red-600/5"
          borderColor="border border-red-500/20"
          iconBgColor="bg-red-500/20"
          iconColor="text-red-400"
          description={language === 'ar' ? 'تحتاج تحسين' : 'Need improvement'}
        />

        {/* Services Missing Translation */}
        <SummaryCard
          title={labels.servicesMissingTranslation}
          value={metrics.servicesMissingTranslation}
          icon={<Globe className="w-6 h-6 text-purple-400" />}
          bgColor="bg-gradient-to-br from-purple-500/10 to-purple-600/5"
          borderColor="border border-purple-500/20"
          iconBgColor="bg-purple-500/20"
          iconColor="text-purple-400"
          description={language === 'ar' ? 'ينتظر الترجمة' : 'Awaiting translation'}
        />

        {/* Services With Relationships */}
        <SummaryCard
          title={labels.servicesWithRelationships}
          value={metrics.servicesWithRelationships}
          icon={<Link2 className="w-6 h-6 text-cyan-400" />}
          bgColor="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5"
          borderColor="border border-cyan-500/20"
          iconBgColor="bg-cyan-500/20"
          iconColor="text-cyan-400"
          description={getPercentage(metrics.servicesWithRelationships, metrics.totalServices)}
        />

        {/* Orphan Services */}
        <SummaryCard
          title={labels.orphanServices}
          value={metrics.orphanServices}
          icon={<UserX className="w-6 h-6 text-gray-400" />}
          bgColor="bg-gradient-to-br from-gray-500/10 to-gray-600/5"
          borderColor="border border-gray-500/20"
          iconBgColor="bg-gray-500/20"
          iconColor="text-gray-400"
          description={language === 'ar' ? 'بدون اتصالات' : 'No connections'}
        />
      </div>
    </div>
  );
};

export default ServiceAnalyticsOverview;
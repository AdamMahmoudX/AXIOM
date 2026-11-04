// =====================================================
// SERVICE ANALYTICS FOUNDATION - AXIOMX ADMIN SYSTEM
// Phase 5F-1: Service Analytics Foundation
// Phase 5F-2: Service Analytics Filters (Integrated)
// =====================================================

import React, { useMemo } from 'react';
import { useServices } from '../context/ServiceContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Service,
  ServiceStatus,
  SEOContent,
} from '../types/project';
import {
  Boxes,
  Eye,
  EyeOff,
  TrendingUp,
  Award,
  AlertTriangle,
  Link2,
  Zap,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

// Import the filters component
import ServiceAnalyticsFilters, {
  calculateServiceSEOScore,
  getConnectionCount,
} from './ServiceAnalyticsFilters';

// =====================================================
// HELPER FUNCTIONS (Preserved for internal use)
// =====================================================

// Check if service has SEO issues
const hasSEOIssues = (service: Service): boolean => {
  const enContent = service.content?.en;
  const arContent = service.content?.ar;

  // Missing essential SEO fields
  if (!enContent?.seo?.title || enContent.seo.title.length === 0) return true;
  if (!enContent?.seo?.description || enContent.seo.description.length === 0) return true;
  if (!enContent?.title || enContent.title.length === 0) return true;

  // Check for incomplete translation
  if (service.translationStatus?.ar === 'missing') return true;

  // Check for short description
  if (!service.shortDescription || service.shortDescription.length < 20) return true;

  return false;
};

// Check if service is fully optimized
const isFullyOptimized = (service: Service): boolean => {
  const enContent = service.content?.en;
  const arContent = service.content?.ar;

  // Must have complete content in both languages
  if (service.translationStatus?.en !== 'complete') return false;
  if (service.translationStatus?.ar !== 'complete') return false;

  // Must have SEO data
  if (!enContent?.seo?.title || enContent.seo.title.length === 0) return false;
  if (!enContent?.seo?.description || enContent.seo.description.length === 0) return false;
  if (!arContent?.seo?.title || arContent.seo.title.length === 0) return false;
  if (!arContent?.seo?.description || arContent.seo.description.length === 0) return false;

  // Must have OG tags
  if (!enContent?.seo?.ogTitle || enContent.seo.ogTitle.length === 0) return false;
  if (!enContent?.seo?.ogDescription || enContent.seo.ogDescription.length === 0) return false;

  // Must have sufficient description
  if (!enContent?.description || enContent.description.length < 100) return false;
  if (!arContent?.description || arContent.description.length < 100) return false;

  return true;
};

// =====================================================
// SERVICE ANALYTICS OVERVIEW COMPONENT
// =====================================================

interface ServiceAnalyticsOverviewProps {
  services: Service[];
}

const ServiceAnalyticsOverview: React.FC<ServiceAnalyticsOverviewProps> = ({ services }) => {
  const { language } = useLanguage();

  const stats = useMemo(() => {
    const totalServices = services.length;
    const activeServices = services.filter(s => s.status === 'published').length;
    const inactiveServices = services.filter(s => s.status !== 'published').length;

    // Calculate average SEO score
    const seoScores = services.map(s => calculateServiceSEOScore(s));
    const averageSEOScore = seoScores.length > 0
      ? Math.round(seoScores.reduce((a, b) => a + b, 0) / seoScores.length)
      : 0;

    return {
      totalServices,
      activeServices,
      inactiveServices,
      averageSEOScore,
    };
  }, [services]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* Total Services */}
      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Boxes className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.totalServices}</p>
            <p className="text-xs text-gray-400">
              {language === 'ar' ? 'إجمالي الخدمات' : 'Total Services'}
            </p>
          </div>
        </div>
      </div>

      {/* Active Services */}
      <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
            <Eye className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.activeServices}</p>
            <p className="text-xs text-gray-400">
              {language === 'ar' ? 'خدمات نشطة' : 'Active Services'}
            </p>
          </div>
        </div>
      </div>

      {/* Inactive Services */}
      <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
            <EyeOff className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.inactiveServices}</p>
            <p className="text-xs text-gray-400">
              {language === 'ar' ? 'خدمات غير نشطة' : 'Inactive Services'}
            </p>
          </div>
        </div>
      </div>

      {/* Average SEO Score */}
      <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.averageSEOScore}%</p>
            <p className="text-xs text-gray-400">
              {language === 'ar' ? 'متوسط نقاط SEO' : 'Average SEO Score'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// SERVICE PERFORMANCE SUMMARY COMPONENT
// =====================================================

interface ServicePerformanceSummaryProps {
  services: Service[];
}

const ServicePerformanceSummary: React.FC<ServicePerformanceSummaryProps> = ({ services }) => {
  const { language } = useLanguage();

  const performanceData = useMemo(() => {
    if (services.length === 0) {
      return {
        bestSEO: null,
        worstSEO: null,
        mostConnected: null,
        leastConnected: null,
      };
    }

    // Calculate SEO scores for all services
    const servicesWithScores = services.map(service => ({
      service,
      seoScore: calculateServiceSEOScore(service),
      connections: getConnectionCount(service, services),
    }));

    // Best SEO (highest score)
    const bestSEO = servicesWithScores.reduce((best, current) =>
      current.seoScore > best.seoScore ? current : best
    );

    // Worst SEO (lowest score)
    const worstSEO = servicesWithScores.reduce((worst, current) =>
      current.seoScore < worst.seoScore ? current : worst
    );

    // Most Connected (most relationships)
    const mostConnected = servicesWithScores.reduce((max, current) =>
      current.connections > max.connections ? current : max
    );

    // Least Connected (fewest relationships, only from services with connections)
    const connectedServices = servicesWithScores.filter(s => s.connections > 0);
    const leastConnected = connectedServices.length > 0
      ? connectedServices.reduce((min, current) =>
          current.connections < min.connections ? current : min
        )
      : servicesWithScores[0]; // Fallback to first service if no connections exist

    return {
      bestSEO,
      worstSEO,
      mostConnected,
      leastConnected,
    };
  }, [services]);

  const cardClass = (color: string) =>
    `bg-[#0a0a0a] border border-white/5 rounded-xl p-4`;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-amber-400" />
        {language === 'ar' ? 'ملخص أداء الخدمات' : 'Service Performance Summary'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Best SEO Service */}
        <div className={cardClass('green')}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
              <ArrowUp className="w-4 h-4 text-green-400" />
            </div>
            <span className="text-sm text-gray-400">
              {language === 'ar' ? 'أفضل خدمة SEO' : 'Best SEO Service'}
            </span>
          </div>
          <p className="text-white font-medium text-sm line-clamp-1">
            {performanceData.bestSEO?.service.title || '-'}
          </p>
          <p className="text-xs text-green-400 mt-1">
            {performanceData.bestSEO?.seoScore || 0}%
          </p>
        </div>

        {/* Worst SEO Service */}
        <div className={cardClass('red')}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
              <ArrowDown className="w-4 h-4 text-red-400" />
            </div>
            <span className="text-sm text-gray-400">
              {language === 'ar' ? 'أسوأ خدمة SEO' : 'Worst SEO Service'}
            </span>
          </div>
          <p className="text-white font-medium text-sm line-clamp-1">
            {performanceData.worstSEO?.service.title || '-'}
          </p>
          <p className="text-xs text-red-400 mt-1">
            {performanceData.worstSEO?.seoScore || 0}%
          </p>
        </div>

        {/* Most Connected Service */}
        <div className={cardClass('blue')}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Link2 className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-sm text-gray-400">
              {language === 'ar' ? 'الأكثر اتصالاً' : 'Most Connected'}
            </span>
          </div>
          <p className="text-white font-medium text-sm line-clamp-1">
            {performanceData.mostConnected?.service.title || '-'}
          </p>
          <p className="text-xs text-blue-400 mt-1">
            {performanceData.mostConnected?.connections || 0}{' '}
            {language === 'ar' ? 'اتصالات' : 'connections'}
          </p>
        </div>

        {/* Least Connected Service */}
        <div className={cardClass('gray')}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gray-500/20 flex items-center justify-center">
              <Link2 className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-sm text-gray-400">
              {language === 'ar' ? 'الأقل اتصالاً' : 'Least Connected'}
            </span>
          </div>
          <p className="text-white font-medium text-sm line-clamp-1">
            {performanceData.leastConnected?.service.title || '-'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {performanceData.leastConnected?.connections || 0}{' '}
            {language === 'ar' ? 'اتصالات' : 'connections'}
          </p>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// SERVICE STATUS DISTRIBUTION COMPONENT (Progress Bars Only)
// =====================================================

interface ServiceStatusDistributionProps {
  services: Service[];
}

const ServiceStatusDistribution: React.FC<ServiceStatusDistributionProps> = ({ services }) => {
  const { language } = useLanguage();

  const distribution = useMemo(() => {
    const total = services.length;
    const active = services.filter(s => s.status === 'published').length;
    const draft = services.filter(s => s.status === 'draft').length;
    const archived = services.filter(s => s.status === 'archived').length;

    return {
      total,
      active,
      draft,
      archived,
      activePercent: total > 0 ? Math.round((active / total) * 100) : 0,
      draftPercent: total > 0 ? Math.round((draft / total) * 100) : 0,
      archivedPercent: total > 0 ? Math.round((archived / total) * 100) : 0,
    };
  }, [services]);

  const statusConfig = {
    active: {
      label: language === 'ar' ? 'نشط' : 'Active',
      color: 'bg-green-500',
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-400',
    },
    draft: {
      label: language === 'ar' ? 'مسودة' : 'Draft',
      color: 'bg-amber-500',
      bgColor: 'bg-amber-500/20',
      textColor: 'text-amber-400',
    },
    archived: {
      label: language === 'ar' ? 'مؤرشف' : 'Archived',
      color: 'bg-gray-500',
      bgColor: 'bg-gray-500/20',
      textColor: 'text-gray-400',
    },
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Boxes className="w-5 h-5 text-blue-400" />
        {language === 'ar' ? 'توزيع حالة الخدمات' : 'Service Status Distribution'}
      </h3>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4">
        {/* Active Status */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${statusConfig.active.color}`} />
              <span className="text-sm text-gray-300">{statusConfig.active.label}</span>
            </div>
            <span className={`text-sm font-medium ${statusConfig.active.textColor}`}>
              {distribution.active} ({distribution.activePercent}%)
            </span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full ${statusConfig.active.color} transition-all duration-500`}
              style={{ width: `${distribution.activePercent}%` }}
            />
          </div>
        </div>

        {/* Draft Status */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${statusConfig.draft.color}`} />
              <span className="text-sm text-gray-300">{statusConfig.draft.label}</span>
            </div>
            <span className={`text-sm font-medium ${statusConfig.draft.textColor}`}>
              {distribution.draft} ({distribution.draftPercent}%)
            </span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full ${statusConfig.draft.color} transition-all duration-500`}
              style={{ width: `${distribution.draftPercent}%` }}
            />
          </div>
        </div>

        {/* Archived Status */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${statusConfig.archived.color}`} />
              <span className="text-sm text-gray-300">{statusConfig.archived.label}</span>
            </div>
            <span className={`text-sm font-medium ${statusConfig.archived.textColor}`}>
              {distribution.archived} ({distribution.archivedPercent}%)
            </span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full ${statusConfig.archived.color} transition-all duration-500`}
              style={{ width: `${distribution.archivedPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// ANALYTICS SNAPSHOT COMPONENT
// =====================================================

interface AnalyticsSnapshotProps {
  services: Service[];
}

const AnalyticsSnapshot: React.FC<AnalyticsSnapshotProps> = ({ services }) => {
  const { language } = useLanguage();

  const snapshot = useMemo(() => {
    // Total relationships (count all unique relationships)
    const allRelationships = new Set<string>();
    services.forEach(service => {
      service.relatedServiceIds?.forEach(relId => {
        // Add both directions for bidirectional count
        allRelationships.add(`${service.id}-${relId}`);
        allRelationships.add(`${relId}-${service.id}`);
      });
    });
    const totalRelationships = Math.floor(allRelationships.size / 2); // Divide by 2 since we counted both directions

    // Average relationships per service
    const averageRelationships = services.length > 0
      ? (totalRelationships / services.length).toFixed(1)
      : '0';

    // Services with SEO issues
    const servicesWithSEOIssues = services.filter(s => hasSEOIssues(s)).length;

    // Services fully optimized
    const servicesFullyOptimized = services.filter(s => isFullyOptimized(s)).length;

    return {
      totalRelationships,
      averageRelationships,
      servicesWithSEOIssues,
      servicesFullyOptimized,
    };
  }, [services]);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow-400" />
        {language === 'ar' ? 'لقطة التحليلات' : 'Analytics Snapshot'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Relationships */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Link2 className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">
              {language === 'ar' ? 'إجمالي العلاقات' : 'Total Relationships'}
            </span>
          </div>
          <p className="text-2xl font-bold text-white">{snapshot.totalRelationships}</p>
        </div>

        {/* Average Relationships Per Service */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Link2 className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">
              {language === 'ar' ? 'متوسط العلاقات للخدمة' : 'Avg Relationships/Service'}
            </span>
          </div>
          <p className="text-2xl font-bold text-white">{snapshot.averageRelationships}</p>
        </div>

        {/* Services With SEO Issues */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-400">
              {language === 'ar' ? 'خدمات بمشاكل SEO' : 'Services With SEO Issues'}
            </span>
          </div>
          <p className="text-2xl font-bold text-red-400">{snapshot.servicesWithSEOIssues}</p>
        </div>

        {/* Services Fully Optimized */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">
              {language === 'ar' ? 'خدمات محسنة بالكامل' : 'Services Fully Optimized'}
            </span>
          </div>
          <p className="text-2xl font-bold text-green-400">{snapshot.servicesFullyOptimized}</p>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// MAIN SERVICE ANALYTICS FOUNDATION COMPONENT
// =====================================================

const ServiceAnalyticsFoundation: React.FC = () => {
  return (
    <div className="mb-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">
            Service Analytics Foundation
          </h2>
          <p className="text-sm text-gray-400">
            {language === 'ar' ? 'أساسيات تحليلات الخدمات' : 'Service Analytics Foundation'}
          </p>
        </div>
      </div>

      {/* Filters Component - Wraps all analytics components */}
      <ServiceAnalyticsFilters>
        {(filteredServices) => (
          <>
            {/* 1. Service Analytics Overview */}
            <ServiceAnalyticsOverview services={filteredServices} />

            {/* 2. Service Performance Summary */}
            <ServicePerformanceSummary services={filteredServices} />

            {/* 3. Service Status Distribution (Progress Bars Only) */}
            <ServiceStatusDistribution services={filteredServices} />

            {/* 4. Analytics Snapshot */}
            <AnalyticsSnapshot services={filteredServices} />
          </>
        )}
      </ServiceAnalyticsFilters>
    </div>
  );
};

export default ServiceAnalyticsFoundation;
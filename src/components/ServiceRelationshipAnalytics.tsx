// =====================================================
// SERVICE RELATIONSHIP ANALYTICS - AXIOMX ADMIN SYSTEM
// Phase 5E-3: Service Relationship Analytics
// =====================================================

import React, { useMemo } from 'react';
import { useServices } from '../context/ServiceContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Link2,
  Link2Off,
  Network,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

// =====================================================
// TYPES
// =====================================================

interface ServiceRelationshipStats {
  totalRelationships: number;
  servicesWithRelationships: number;
  servicesWithoutRelationships: number;
  averageRelationshipsPerService: number;
}

interface TopConnectedService {
  id: string;
  title: string;
  relationshipCount: number;
}

interface RelationshipDistribution {
  zeroRelations: number;
  oneToThreeRelations: number;
  fourPlusRelations: number;
}

// =====================================================
// RELATIONSHIP OVERVIEW CARDS
// =====================================================

interface RelationshipOverviewCardsProps {
  stats: ServiceRelationshipStats;
}

const RelationshipOverviewCards: React.FC<RelationshipOverviewCardsProps> = ({ stats }) => {
  const { language } = useLanguage();

  const cards = [
    {
      label: language === 'ar' ? 'إجمالي العلاقات' : 'Total Relationships',
      value: stats.totalRelationships,
      icon: <Link2 className="w-5 h-5" />,
      color: 'blue',
    },
    {
      label: language === 'ar' ? 'خدمات متصلة' : 'Services With Relations',
      value: stats.servicesWithRelationships,
      icon: <Network className="w-5 h-5" />,
      color: 'green',
    },
    {
      label: language === 'ar' ? 'خدمات غير متصلة' : 'Services Without Relations',
      value: stats.servicesWithoutRelationships,
      icon: <Link2Off className="w-5 h-5" />,
      color: 'amber',
    },
    {
      label: language === 'ar' ? 'متوسط العلاقات لكل خدمة' : 'Avg Relations Per Service',
      value: stats.averageRelationshipsPerService.toFixed(1),
      icon: <ArrowUp className="w-5 h-5" />,
      color: 'purple',
    },
  ];

  const colorStyles: Record<string, { bg: string; border: string; icon: string; text: string }> = {
    blue: {
      bg: 'from-blue-500/10 to-blue-600/5',
      border: 'border-blue-500/20',
      icon: 'text-blue-400',
      text: 'text-blue-400',
    },
    green: {
      bg: 'from-green-500/10 to-green-600/5',
      border: 'border-green-500/20',
      icon: 'text-green-400',
      text: 'text-green-400',
    },
    amber: {
      bg: 'from-amber-500/10 to-amber-600/5',
      border: 'border-amber-500/20',
      icon: 'text-amber-400',
      text: 'text-amber-400',
    },
    purple: {
      bg: 'from-purple-500/10 to-purple-600/5',
      border: 'border-purple-500/20',
      icon: 'text-purple-400',
      text: 'text-purple-400',
    },
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => {
        const styles = colorStyles[card.color];
        return (
          <div
            key={index}
            className={`bg-gradient-to-br ${styles.bg} border ${styles.border} rounded-xl p-4`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${styles.bg} flex items-center justify-center ${styles.icon}`}>
                {card.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{card.value}</p>
                <p className="text-xs text-gray-400">{card.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// =====================================================
// TOP CONNECTED SERVICES TABLE
// =====================================================

interface TopConnectedServicesTableProps {
  services: TopConnectedService[];
}

const TopConnectedServicesTable: React.FC<TopConnectedServicesTableProps> = ({ services }) => {
  const { language } = useLanguage();

  if (services.length === 0) {
    return (
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">
          {language === 'ar' ? 'أكثر الخدمات اتصالاً' : 'Top Connected Services'}
        </h3>
        <p className="text-gray-400 text-sm">
          {language === 'ar' ? 'لا توجد علاقات بعد' : 'No relationships yet'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <h3 className="text-white font-semibold">
          {language === 'ar' ? 'أكثر الخدمات اتصالاً' : 'Top Connected Services'}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                {language === 'ar' ? 'اسم الخدمة' : 'Service Name'}
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                {language === 'ar' ? 'عدد العلاقات' : 'Relationship Count'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {services.map((service, index) => (
              <tr key={service.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400 font-medium">
                      {index + 1}
                    </span>
                    <span className="text-white font-medium">{service.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                    <Network className="w-3.5 h-3.5" />
                    {service.relationshipCount}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// =====================================================
// ORPHAN SERVICES LIST
// =====================================================

interface OrphanServicesListProps {
  services: { id: string; title: string; status: string }[];
}

const OrphanServicesList: React.FC<OrphanServicesListProps> = ({ services }) => {
  const { language } = useLanguage();

  if (services.length === 0) {
    return (
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">
          {language === 'ar' ? 'الخدمات غير المتصلة' : 'Orphan Services'}
        </h3>
        <div className="flex items-center gap-2 text-green-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm">
            {language === 'ar' ? 'جميع الخدمات لديها علاقات!' : 'All services have relationships!'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-white font-semibold">
          {language === 'ar' ? 'الخدمات غير المتصلة' : 'Orphan Services'}
        </h3>
        <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-medium">
          {services.length}
        </span>
      </div>
      <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{service.title}</p>
              <p className="text-gray-500 text-xs">{service.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =====================================================
// RELATIONSHIP DISTRIBUTION
// =====================================================

interface RelationshipDistributionChartProps {
  distribution: RelationshipDistribution;
}

const RelationshipDistributionChart: React.FC<RelationshipDistributionChartProps> = ({ distribution }) => {
  const { language } = useLanguage();

  const total = distribution.zeroRelations + distribution.oneToThreeRelations + distribution.fourPlusRelations;

  const categories = [
    {
      label: language === 'ar' ? '0 علاقة' : '0 Relations',
      count: distribution.zeroRelations,
      color: 'gray',
      bg: 'from-gray-500/20 to-gray-600/10',
      border: 'border-gray-500/20',
      text: 'text-gray-400',
      icon: <Link2Off className="w-4 h-4" />,
    },
    {
      label: language === 'ar' ? '1-3 علاقات' : '1-3 Relations',
      count: distribution.oneToThreeRelations,
      color: 'blue',
      bg: 'from-blue-500/20 to-blue-600/10',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      icon: <Network className="w-4 h-4" />,
    },
    {
      label: language === 'ar' ? '4+ علاقات' : '4+ Relations',
      count: distribution.fourPlusRelations,
      color: 'green',
      bg: 'from-green-500/20 to-green-600/10',
      border: 'border-green-500/20',
      text: 'text-green-400',
      icon: <Link2 className="w-4 h-4" />,
    },
  ];

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <h3 className="text-white font-semibold">
          {language === 'ar' ? 'توزيع العلاقات' : 'Relationship Distribution'}
        </h3>
      </div>
      <div className="p-4">
        <div className="space-y-3">
          {categories.map((category, index) => {
            const percentage = total > 0 ? Math.round((category.count / total) * 100) : 0;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`${category.bg} p-1.5 rounded-lg border ${category.border}`}>
                      <span className={category.text}>{category.icon}</span>
                    </span>
                    <span className="text-gray-300 text-sm">{category.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`${category.text} font-medium`}>{category.count}</span>
                    <span className="text-gray-500 text-xs">({percentage}%)</span>
                  </div>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${category.bg} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual representation */}
        <div className="mt-6 flex items-end justify-center gap-2 h-24">
          {categories.map((category, index) => {
            const maxCount = Math.max(distribution.zeroRelations, distribution.oneToThreeRelations, distribution.fourPlusRelations, 1);
            const height = maxCount > 0 ? (category.count / maxCount) * 100 : 0;
            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className={`w-16 rounded-t-lg ${category.bg} border-t-2 ${category.border.replace('/20', '/40')}`}
                  style={{ height: `${Math.max(height, 5)}%` }}
                />
                <span className="text-gray-400 text-xs">{category.count}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-6 mt-2">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded ${category.bg}`} />
              <span className="text-gray-500 text-xs">{category.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// =====================================================
// MAIN COMPONENT
// =====================================================

const ServiceRelationshipAnalytics: React.FC = () => {
  const { services } = useServices();

  // Calculate relationship statistics
  const stats = useMemo((): ServiceRelationshipStats => {
    let totalRelationships = 0;
    let servicesWithRelationships = 0;
    let servicesWithoutRelationships = 0;

    services.forEach((service) => {
      const relationshipCount = service.relatedServiceIds?.length || 0;
      totalRelationships += relationshipCount;

      if (relationshipCount > 0) {
        servicesWithRelationships++;
      } else {
        servicesWithoutRelationships++;
      }
    });

    const averageRelationshipsPerService = services.length > 0
      ? totalRelationships / services.length
      : 0;

    return {
      totalRelationships,
      servicesWithRelationships,
      servicesWithoutRelationships,
      averageRelationshipsPerService,
    };
  }, [services]);

  // Calculate top connected services
  const topConnectedServices = useMemo((): TopConnectedService[] => {
    return services
      .map((service) => ({
        id: service.id,
        title: service.title,
        relationshipCount: service.relatedServiceIds?.length || 0,
      }))
      .filter((service) => service.relationshipCount > 0)
      .sort((a, b) => b.relationshipCount - a.relationshipCount)
      .slice(0, 10); // Top 10
  }, [services]);

  // Calculate orphan services
  const orphanServices = useMemo(() => {
    return services
      .filter((service) => !service.relatedServiceIds || service.relatedServiceIds.length === 0)
      .map((service) => ({
        id: service.id,
        title: service.title,
        status: service.status,
      }));
  }, [services]);

  // Calculate relationship distribution
  const distribution = useMemo((): RelationshipDistribution => {
    let zeroRelations = 0;
    let oneToThreeRelations = 0;
    let fourPlusRelations = 0;

    services.forEach((service) => {
      const count = service.relatedServiceIds?.length || 0;

      if (count === 0) {
        zeroRelations++;
      } else if (count >= 1 && count <= 3) {
        oneToThreeRelations++;
      } else {
        fourPlusRelations++;
      }
    });

    return {
      zeroRelations,
      oneToThreeRelations,
      fourPlusRelations,
    };
  }, [services]);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <Network className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">
            {services[0]?.content?.en?.title ? 'Service Relationship Analytics' : 'تحليلات علاقات الخدمات'}
          </h2>
          <p className="text-sm text-gray-400">
            {services.length > 0
              ? `${services.length} services analyzed`
              : 'تحليل العلاقات بين الخدمات'}
          </p>
        </div>
      </div>

      {/* Relationship Overview Cards */}
      <RelationshipOverviewCards stats={stats} />

      {/* Two Column Layout for Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Connected Services Table */}
        <TopConnectedServicesTable services={topConnectedServices} />

        {/* Relationship Distribution Chart */}
        <RelationshipDistributionChart distribution={distribution} />
      </div>

      {/* Orphan Services List - Full Width */}
      <OrphanServicesList services={orphanServices} />
    </div>
  );
};

export default ServiceRelationshipAnalytics;
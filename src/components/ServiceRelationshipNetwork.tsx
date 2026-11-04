// =====================================================
// SERVICE RELATIONSHIP NETWORK - AXIOMX ADMIN SYSTEM
// Phase 5E-4: Service Relationship Network View
// =====================================================

import React, { useMemo } from 'react';
import { useServices } from '../context/ServiceContext';
import { useLanguage } from '../context/LanguageContext';
import { Link2, Link2Off, Zap, Wifi, WifiOff, ArrowRight } from 'lucide-react';

interface ServiceNetworkStats {
  totalServices: number;
  totalRelationships: number;
  connectedServices: number;
  orphanServices: number;
}

interface ServiceRelationshipCard {
  serviceId: string;
  serviceName: string;
  relationshipCount: number;
  relatedServices: Array<{ id: string; name: string }>;
  strength: 'weak' | 'medium' | 'strong';
}

const ServiceRelationshipNetwork: React.FC = () => {
  const { services, getRelatedServices } = useServices();
  const { language } = useLanguage();

  // Calculate network statistics
  const networkStats = useMemo((): ServiceNetworkStats => {
    const totalServices = services.length;
    let totalRelationships = 0;
    let connectedServices = 0;
    let orphanServices = 0;

    services.forEach(service => {
      const relationships = service.relatedServiceIds || [];
      totalRelationships += relationships.length;
      if (relationships.length > 0) {
        connectedServices++;
      } else {
        orphanServices++;
      }
    });

    return {
      totalServices,
      totalRelationships,
      connectedServices,
      orphanServices,
    };
  }, [services]);

  // Build relationship cards for all services
  const relationshipCards = useMemo((): ServiceRelationshipCard[] => {
    return services.map(service => {
      const relatedServices = getRelatedServices(service.id);
      const relationshipCount = service.relatedServiceIds?.length || 0;

      let strength: 'weak' | 'medium' | 'strong' = 'weak';
      if (relationshipCount >= 4) {
        strength = 'strong';
      } else if (relationshipCount >= 2) {
        strength = 'medium';
      }

      return {
        serviceId: service.id,
        serviceName: service.title,
        relationshipCount,
        relatedServices: relatedServices.map(s => ({ id: s.id, name: s.title })),
        strength,
      };
    }).sort((a, b) => b.relationshipCount - a.relationshipCount);
  }, [services, getRelatedServices]);

  // Get orphan services (services with no relationships)
  const orphanServicesList = useMemo(() => {
    return services.filter(service =>
      !service.relatedServiceIds || service.relatedServiceIds.length === 0
    );
  }, [services]);

  // Strength badge styles
  const getStrengthStyles = (strength: 'weak' | 'medium' | 'strong') => {
    switch (strength) {
      case 'strong':
        return {
          bg: 'bg-emerald-500/20',
          text: 'text-emerald-400',
          border: 'border-emerald-500/30',
          label: language === 'ar' ? 'قوية' : 'Strong',
        };
      case 'medium':
        return {
          bg: 'bg-amber-500/20',
          text: 'text-amber-400',
          border: 'border-amber-500/30',
          label: language === 'ar' ? 'متوسطة' : 'Medium',
        };
      case 'weak':
        return {
          bg: 'bg-gray-500/20',
          text: 'text-gray-400',
          border: 'border-gray-500/30',
          label: language === 'ar' ? 'ضعيفة' : 'Weak',
        };
    }
  };

  // Translation helpers
  const t = {
    networkOverview: language === 'ar' ? 'نظرة عامة على الشبكة' : 'Network Overview',
    totalServices: language === 'ar' ? 'إجمالي الخدمات' : 'Total Services',
    totalRelationships: language === 'ar' ? 'إجمالي العلاقات' : 'Total Relationships',
    connectedServices: language === 'ar' ? 'الخدمات المتصلة' : 'Connected Services',
    orphanServices: language === 'ar' ? 'الخدمات غير المتصلة' : 'Orphan Services',
    relationshipNetwork: language === 'ar' ? 'شبكة العلاقات' : 'Relationship Network',
    relationships: language === 'ar' ? 'علاقات' : 'Relationships',
    relationship: language === 'ar' ? 'علاقة' : 'Relationship',
    relatedServices: language === 'ar' ? 'الخدمات ذات الصلة' : 'Related Services',
    noRelatedServices: language === 'ar' ? 'لا توجد خدمات ذات صلة' : 'No related services',
    orphanServicesSection: language === 'ar' ? 'الخدمات غير المتصلة' : 'Orphan Services',
    noOrphanServices: language === 'ar' ? 'لا توجد خدمات غير متصلة' : 'No orphan services',
    connectionStrength: language === 'ar' ? 'قوة الاتصال' : 'Connection Strength',
  };

  return (
    <div className="space-y-6">
      {/* Network Overview Section */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">{t.networkOverview}</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Services */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Link2 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{networkStats.totalServices}</p>
                <p className="text-xs text-gray-400">{t.totalServices}</p>
              </div>
            </div>
          </div>

          {/* Total Relationships */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{networkStats.totalRelationships}</p>
                <p className="text-xs text-gray-400">{t.totalRelationships}</p>
              </div>
            </div>
          </div>

          {/* Connected Services */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Wifi className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{networkStats.connectedServices}</p>
                <p className="text-xs text-gray-400">{t.connectedServices}</p>
              </div>
            </div>
          </div>

          {/* Orphan Services */}
          <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <WifiOff className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{networkStats.orphanServices}</p>
                <p className="text-xs text-gray-400">{t.orphanServices}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Strength Legend */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">{t.connectionStrength}</span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-gray-500/20 border border-gray-500/30 rounded-full text-xs text-gray-400">
              {language === 'ar' ? 'ضعيفة (1)' : 'Weak (1)'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-xs text-amber-400">
              {language === 'ar' ? 'متوسطة (2-3)' : 'Medium (2-3)'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs text-emerald-400">
              {language === 'ar' ? 'قوية (4+)' : 'Strong (4+)'}
            </span>
          </div>
        </div>
      </div>

      {/* Relationship Network Grid */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Link2 className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">{t.relationshipNetwork}</h2>
        </div>

        {relationshipCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {relationshipCards.map(card => {
              const strengthStyles = getStrengthStyles(card.strength);

              return (
                <div
                  key={card.serviceId}
                  className={`bg-[#1a1a1a] border ${strengthStyles.border} rounded-xl p-4 hover:border-white/20 transition-colors`}
                >
                  {/* Service Name & Relationship Count */}
                  <div className="mb-3">
                    <h3 className="text-white font-medium text-sm mb-1 line-clamp-1">
                      {card.serviceName}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">
                        {card.relationshipCount} {card.relationshipCount === 1 ? t.relationship : t.relationships}
                      </span>
                      <span className={`px-2 py-0.5 ${strengthStyles.bg} ${strengthStyles.text} rounded-full text-xs`}>
                        {strengthStyles.label}
                      </span>
                    </div>
                  </div>

                  {/* Related Services List */}
                  {card.relatedServices.length > 0 ? (
                    <div className="space-y-1.5">
                      <p className="text-xs text-gray-500 mb-1">{t.relatedServices}</p>
                      {card.relatedServices.map(related => (
                        <div
                          key={related.id}
                          className="flex items-center gap-1.5 text-xs text-gray-300 bg-white/5 rounded-lg px-2 py-1.5"
                        >
                          <ArrowRight className="w-3 h-3 text-blue-400 flex-shrink-0" />
                          <span className="line-clamp-1">{related.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-gray-500 py-2">
                      <Link2Off className="w-3.5 h-3.5" />
                      <span>{t.noRelatedServices}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Link2 className="w-8 h-8 mx-auto mb-2 text-gray-600" />
            <p>{language === 'ar' ? 'لا توجد علاقات' : 'No relationships found'}</p>
          </div>
        )}
      </div>

      {/* Orphan Services Section */}
      {orphanServicesList.length > 0 && (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <WifiOff className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-semibold text-white">{t.orphanServicesSection}</h2>
            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full text-xs">
              {orphanServicesList.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {orphanServicesList.map(service => (
              <div
                key={service.id}
                className="bg-[#1a1a1a] border border-white/5 rounded-xl p-3 flex items-center gap-3 hover:border-red-500/20 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <WifiOff className="w-4 h-4 text-red-400" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-white text-sm font-medium line-clamp-1">
                    {service.title}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {language === 'ar' ? 'بدون علاقات' : 'No relationships'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Orphan Services Message */}
      {orphanServicesList.length === 0 && networkStats.totalServices > 0 && (
        <div className="bg-[#0a0a0a] border border-green-500/20 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Wifi className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-white font-medium">
                {language === 'ar' ? 'جميع الخدمات متصلة!' : 'All Services Connected!'}
              </p>
              <p className="text-sm text-gray-400">
                {language === 'ar'
                  ? 'لا توجد خدمات غير متصلة في الشبكة'
                  : 'No orphan services in the network'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRelationshipNetwork;
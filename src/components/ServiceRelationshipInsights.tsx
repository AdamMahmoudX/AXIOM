// =====================================================
// SERVICE RELATIONSHIP INSIGHTS - AXIOMX ADMIN SYSTEM
// Phase 5E-5: Service Relationship Insights
// =====================================================

import React, { useMemo } from 'react';
import { useServices } from '../context/ServiceContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Activity,
  Heart,
  AlertTriangle,
  TrendingUp,
  Link2,
  Link2Off,
  CheckCircle2,
  Lightbulb,
  ChevronRight,
  Zap,
  Network,
  Target,
  AlertCircle,
  Shield,
  ArrowRight,
} from 'lucide-react';

// =====================================================
// TYPES
// =====================================================

type HealthStatus = 'excellent' | 'good' | 'fair' | 'poor';

interface HealthScoreResult {
  score: number;
  status: HealthStatus;
  percentageConnected: number;
  orphanCount: number;
  averageRelations: number;
  isolatedCount: number;
}

interface InsightCard {
  id: string;
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  borderColor: string;
  iconBg: string;
}

interface WarningItem {
  id: string;
  type: 'high_orphan' | 'low_relationships' | 'too_isolated';
  message: string;
  severity: 'high' | 'medium' | 'low';
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionLabel: string;
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

const getHealthStatus = (score: number): HealthStatus => {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
};

const getStatusConfig = (status: HealthStatus, language: 'en' | 'ar') => {
  const configs = {
    excellent: {
      label: language === 'ar' ? 'ممتاز' : 'Excellent',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/30',
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    good: {
      label: language === 'ar' ? 'جيد' : 'Good',
      color: 'text-blue-400',
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/30',
      icon: <TrendingUp className="w-5 h-5" />,
    },
    fair: {
      label: language === 'ar' ? 'مقبول' : 'Fair',
      color: 'text-amber-400',
      bg: 'bg-amber-500/20',
      border: 'border-amber-500/30',
      icon: <AlertTriangle className="w-5 h-5" />,
    },
    poor: {
      label: language === 'ar' ? 'ضعيف' : 'Poor',
      color: 'text-red-400',
      bg: 'bg-red-500/20',
      border: 'border-red-500/30',
      icon: <AlertCircle className="w-5 h-5" />,
    },
  };
  return configs[status];
};

// =====================================================
// RELATIONSHIP HEALTH SCORE COMPONENT
// =====================================================

interface RelationshipHealthScoreProps {
  health: HealthScoreResult;
}

const RelationshipHealthScore: React.FC<RelationshipHealthScoreProps> = ({ health }) => {
  const { language } = useLanguage();
  const statusConfig = getStatusConfig(health.status, language);

  // Calculate progress circle
  const circumference = 2 * Math.PI * 45;
  const progress = (health.score / 100) * circumference;

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <Heart className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">
            {language === 'ar' ? 'درجة صحة العلاقات' : 'Relationship Health Score'}
          </h3>
          <p className="text-xs text-gray-400">
            {language === 'ar' ? 'مؤشر شامل لصحة العلاقات' : 'Overall relationship health indicator'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* Score Circle */}
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg className="w-28 h-28 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="56"
              cy="56"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-white/5"
            />
            {/* Progress circle */}
            <circle
              cx="56"
              cy="56"
              r="45"
              stroke="url(#progressGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={health.status === 'excellent' ? '#10b981' : health.status === 'good' ? '#3b82f6' : health.status === 'fair' ? '#f59e0b' : '#ef4444'} />
                <stop offset="100%" stopColor={health.status === 'excellent' ? '#34d399' : health.status === 'good' ? '#60a5fa' : health.status === 'fair' ? '#fbbf24' : '#f87171'} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">{health.score}</span>
            <span className="text-xs text-gray-400">/100</span>
          </div>
        </div>

        {/* Status and Details */}
        <div className="flex-1 space-y-4">
          {/* Status Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${statusConfig.bg} ${statusConfig.border} border`}>
            <span className={statusConfig.color}>{statusConfig.icon}</span>
            <span className={`font-medium ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <Link2 className="w-3 h-3" />
                {language === 'ar' ? 'متصل' : 'Connected'}
              </div>
              <p className="text-lg font-semibold text-white">
                {health.percentageConnected.toFixed(0)}%
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <Link2Off className="w-3 h-3" />
                {language === 'ar' ? 'ييتيم' : 'Orphan'}
              </div>
              <p className="text-lg font-semibold text-white">
                {health.orphanCount}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <Activity className="w-3 h-3" />
                {language === 'ar' ? 'المتوسط' : 'Average'}
              </div>
              <p className="text-lg font-semibold text-white">
                {health.averageRelations.toFixed(1)}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <AlertTriangle className="w-3 h-3" />
                {language === 'ar' ? 'معزول' : 'Isolated'}
              </div>
              <p className="text-lg font-semibold text-white">
                {health.isolatedCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// SMART INSIGHTS CARDS COMPONENT
// =====================================================

interface SmartInsightsCardsProps {
  mostConnected: { id: string; title: string; count: number } | null;
  leastConnected: { id: string; title: string; count: number } | null;
  totalOrphan: number;
  averageRelations: number;
}

const SmartInsightsCards: React.FC<SmartInsightsCardsProps> = ({
  mostConnected,
  leastConnected,
  totalOrphan,
  averageRelations,
}) => {
  const { language } = useLanguage();

  const cards: InsightCard[] = [
    {
      id: 'most-connected',
      title: language === 'ar' ? 'الأكثر اتصالاً' : 'Most Connected',
      value: mostConnected?.count || 0,
      subtitle: mostConnected?.title || '-',
      icon: <Zap className="w-5 h-5" />,
      color: 'text-emerald-400',
      bgGradient: 'from-emerald-500/10 to-emerald-600/5',
      borderColor: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/20',
    },
    {
      id: 'least-connected',
      title: language === 'ar' ? 'الأقل اتصالاً' : 'Least Connected',
      value: leastConnected?.count || 0,
      subtitle: leastConnected?.title || '-',
      icon: <Target className="w-5 h-5" />,
      color: 'text-amber-400',
      bgGradient: 'from-amber-500/10 to-amber-600/5',
      borderColor: 'border-amber-500/20',
      iconBg: 'bg-amber-500/20',
    },
    {
      id: 'total-orphan',
      title: language === 'ar' ? 'إجمالي الخدمات اليتيمة' : 'Total Orphan Services',
      value: totalOrphan,
      subtitle: language === 'ar' ? 'خدمات بدون علاقات' : 'Services without relations',
      icon: <Link2Off className="w-5 h-5" />,
      color: 'text-red-400',
      bgGradient: 'from-red-500/10 to-red-600/5',
      borderColor: 'border-red-500/20',
      iconBg: 'bg-red-500/20',
    },
    {
      id: 'average-relations',
      title: language === 'ar' ? 'متوسط العلاقات' : 'Average Relations',
      value: averageRelations.toFixed(1),
      subtitle: language === 'ar' ? 'لكل خدمة' : 'per service',
      icon: <Network className="w-5 h-5" />,
      color: 'text-blue-400',
      bgGradient: 'from-blue-500/10 to-blue-600/5',
      borderColor: 'border-blue-500/20',
      iconBg: 'bg-blue-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`bg-gradient-to-br ${card.bgGradient} border ${card.borderColor} rounded-xl p-4 transition-all duration-200 hover:scale-[1.02]`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center ${card.color}`}>
              {card.icon}
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-white mb-1">{card.value}</p>
            <p className={`text-xs font-medium ${card.color} mb-1`}>{card.title}</p>
            <p className="text-xs text-gray-500 truncate" title={card.subtitle}>
              {card.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// =====================================================
// RELATIONSHIP WARNINGS COMPONENT
// =====================================================

interface RelationshipWarningsProps {
  warnings: WarningItem[];
}

const RelationshipWarnings: React.FC<RelationshipWarningsProps> = ({ warnings }) => {
  const { language } = useLanguage();

  if (warnings.length === 0) {
    return (
      <div className="bg-[#0a0a0a] border border-emerald-500/20 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">
              {language === 'ar' ? 'تنبيهات العلاقات' : 'Relationship Warnings'}
            </h3>
            <p className="text-xs text-gray-400">
              {language === 'ar' ? 'لا توجد مشاكل حالياً' : 'No issues currently'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 rounded-lg p-3">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">
            {language === 'ar' ? 'جميع العلاقات صحية!' : 'All relationships are healthy!'}
          </span>
        </div>
      </div>
    );
  }

  const getSeverityConfig = (severity: string) => {
    const configs = {
      high: {
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        icon: <AlertCircle className="w-4 h-4" />,
      },
      medium: {
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        icon: <AlertTriangle className="w-4 h-4" />,
      },
      low: {
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        icon: <AlertTriangle className="w-4 h-4" />,
      },
    };
    return configs[severity as keyof typeof configs] || configs.low;
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">
            {language === 'ar' ? 'تنبيهات العلاقات' : 'Relationship Warnings'}
          </h3>
          <p className="text-xs text-gray-400">
            {language === 'ar'
              ? `${warnings.length} تنبيه يحتاج اهتمامك`
              : `${warnings.length} warning${warnings.length > 1 ? 's' : ''} need${warnings.length === 1 ? 's' : ''} your attention`
            }
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {warnings.map((warning) => {
          const config = getSeverityConfig(warning.severity);
          return (
            <div
              key={warning.id}
              className={`flex items-start gap-3 p-3 rounded-lg ${config.bg} border ${config.border}`}
            >
              <span className={config.color}>{config.icon}</span>
              <p className={`text-sm ${config.color}`}>{warning.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// =====================================================
// RECOMMENDATIONS PANEL COMPONENT
// =====================================================

interface RecommendationsPanelProps {
  recommendations: Recommendation[];
}

const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({ recommendations }) => {
  const { language } = useLanguage();

  const getPriorityConfig = (priority: string) => {
    const configs = {
      high: {
        color: 'text-red-400',
        bg: 'bg-red-500/20',
        border: 'border-l-red-500',
        badge: language === 'ar' ? 'أولوية عالية' : 'High Priority',
      },
      medium: {
        color: 'text-amber-400',
        bg: 'bg-amber-500/20',
        border: 'border-l-amber-500',
        badge: language === 'ar' ? 'أولوية متوسطة' : 'Medium Priority',
      },
      low: {
        color: 'text-blue-400',
        bg: 'bg-blue-500/20',
        border: 'border-l-blue-500',
        badge: language === 'ar' ? 'أولوية منخفضة' : 'Low Priority',
      },
    };
    return configs[priority as keyof typeof configs] || configs.low;
  };

  if (recommendations.length === 0) {
    return (
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">
              {language === 'ar' ? 'لوحة الاقتراحات' : 'Recommendations Panel'}
            </h3>
            <p className="text-xs text-gray-400">
              {language === 'ar' ? 'تحسينات مقترحة' : 'Suggested improvements'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-400 bg-white/5 rounded-lg p-3">
          <CheckCircle2 className="w-5 h-5 text-gray-500" />
          <span className="text-sm">
            {language === 'ar' ? 'لا توجد اقتراحات حالياً' : 'No recommendations at this time'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">
            {language === 'ar' ? 'لوحة الاقتراحات' : 'Recommendations Panel'}
          </h3>
          <p className="text-xs text-gray-400">
            {language === 'ar'
              ? `${recommendations.length} اقتراح للتحسين`
              : `${recommendations.length} recommendation${recommendations.length > 1 ? 's' : ''} for improvement`
            }
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => {
          const config = getPriorityConfig(rec.priority);
          return (
            <div
              key={rec.id}
              className={`bg-white/5 rounded-xl p-4 border-l-4 ${config.border} transition-all duration-200 hover:bg-white/[0.07]`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full ${config.bg} flex items-center justify-center text-xs font-medium ${config.color}`}>
                    {index + 1}
                  </span>
                  <h4 className="text-white font-medium">{rec.title}</h4>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                  {config.badge}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-3 pl-8">{rec.description}</p>
              <div className="pl-8">
                <button className={`inline-flex items-center gap-1.5 text-sm font-medium ${config.color} hover:underline`}>
                  {rec.actionLabel}
                  <ArrowRight className={`w-4 h-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// =====================================================
// MAIN COMPONENT
// =====================================================

const ServiceRelationshipInsights: React.FC = () => {
  const { services } = useServices();
  const { language } = useLanguage();

  // Calculate health score and all metrics
  const healthData = useMemo((): HealthScoreResult => {
    if (services.length === 0) {
      return {
        score: 0,
        status: 'poor',
        percentageConnected: 0,
        orphanCount: 0,
        averageRelations: 0,
        isolatedCount: 0,
      };
    }

    // Calculate orphan services (no relationships)
    const orphanServices = services.filter(
      (s) => !s.relatedServiceIds || s.relatedServiceIds.length === 0
    );
    const orphanCount = orphanServices.length;

    // Calculate connected percentage
    const connectedServices = services.length - orphanCount;
    const percentageConnected = (connectedServices / services.length) * 100;

    // Calculate total relationships
    const totalRelationships = services.reduce(
      (acc, s) => acc + (s.relatedServiceIds?.length || 0),
      0
    );

    // Calculate average relationships per service
    const averageRelations = totalRelationships / services.length;

    // Calculate isolated services (only 0-1 relationships)
    const isolatedCount = services.filter(
      (s) => !s.relatedServiceIds || s.relatedServiceIds.length <= 1
    ).length;

    // Calculate health score (0-100)
    // Factors: connected percentage (40%), low orphan count (30%), good average relations (30%)
    const connectedScore = percentageConnected * 0.4;
    const orphanPenalty = Math.max(0, (orphanCount / services.length) * 30);
    const avgRelationScore = Math.min(averageRelations / 3, 1) * 30; // Assume 3 is good average
    const score = Math.round(connectedScore + (30 - orphanPenalty) + avgRelationScore);

    return {
      score: Math.min(100, Math.max(0, score)),
      status: getHealthStatus(score),
      percentageConnected,
      orphanCount,
      averageRelations,
      isolatedCount,
    };
  }, [services]);

  // Calculate most and least connected services
  const connectionData = useMemo(() => {
    const withRelations = services
      .map((s) => ({
        id: s.id,
        title: s.title,
        count: s.relatedServiceIds?.length || 0,
      }))
      .filter((s) => s.count > 0)
      .sort((a, b) => b.count - a.count);

    return {
      mostConnected: withRelations[0] || null,
      leastConnected: withRelations[withRelations.length - 1] || null,
    };
  }, [services]);

  // Generate warnings
  const warnings = useMemo((): WarningItem[] => {
    const warningList: WarningItem[] = [];

    if (services.length > 0) {
      const orphanPercentage = (healthData.orphanCount / services.length) * 100;

      if (orphanPercentage > 30) {
        warningList.push({
          id: 'high-orphan',
          type: 'high_orphan',
          message:
            language === 'ar'
              ? `نسبة عالية من الخدمات اليتيمة (${orphanPercentage.toFixed(0)}%). فكر في ربط هذه الخدمات بخدمات ذات صلة.`
              : `High number of orphan services (${orphanPercentage.toFixed(0)}%). Consider linking these services to related ones.`,
          severity: orphanPercentage > 50 ? 'high' : 'medium',
        });
      }

      if (healthData.averageRelations < 1 && services.length > 3) {
        warningList.push({
          id: 'low-relationships',
          type: 'low_relationships',
          message:
            language === 'ar'
              ? `متوسط العلاقات منخفض (${healthData.averageRelations.toFixed(1)}). حاول إضافة المزيد من العلاقات بين الخدمات.`
              : `Low average relationships (${healthData.averageRelations.toFixed(1)}). Try adding more relationships between services.`,
          severity: healthData.averageRelations < 0.5 ? 'high' : 'medium',
        });
      }

      const isolatedPercentage = (healthData.isolatedCount / services.length) * 100;
      if (isolatedPercentage > 50) {
        warningList.push({
          id: 'too-isolated',
          type: 'too_isolated',
          message:
            language === 'ar'
              ? `كثير من الخدمات معزولة (${isolatedPercentage.toFixed(0)}%). راجع الاتصالات بين الخدمات.`
              : `Too many isolated services (${isolatedPercentage.toFixed(0)}%). Review service interconnections.`,
          severity: isolatedPercentage > 70 ? 'high' : 'low',
        });
      }
    }

    return warningList;
  }, [services, healthData, language]);

  // Generate recommendations
  const recommendations = useMemo((): Recommendation[] => {
    const recList: Recommendation[] = [];

    if (healthData.orphanCount > 0) {
      recList.push({
        id: 'link-orphans',
        title: language === 'ar' ? 'ربط الخدمات اليتيمة' : 'Link Orphan Services',
        description:
          language === 'ar'
            ? `هناك ${healthData.orphanCount} خدمة بدون علاقات. قم بربطها بخدمات ذات صلة لتحسين التنقل وتجربة المستخدم.`
            : `There are ${healthData.orphanCount} services without relationships. Link them to related services to improve navigation and user experience.`,
        priority: healthData.orphanCount > 3 ? 'high' : 'medium',
        actionLabel: language === 'ar' ? 'عرض الخدمات اليتيمة' : 'View Orphan Services',
      });
    }

    if (healthData.averageRelations < 2) {
      recList.push({
        id: 'increase-connections',
        title: language === 'ar' ? 'زيادة الروابط بين الخدمات' : 'Increase Service Connections',
        description:
          language === 'ar'
            ? `متوسط العلاقات الحالي هو ${healthData.averageRelations.toFixed(1)}. الهدف الموصى به هو 2-3 علاقات لكل خدمة.`
            : `Current average is ${healthData.averageRelations.toFixed(1)} relationships. The recommended target is 2-3 relationships per service.`,
        priority: healthData.averageRelations < 1 ? 'high' : 'medium',
        actionLabel: language === 'ar' ? 'إدارة العلاقات' : 'Manage Relationships',
      });
    }

    if (healthData.isolatedCount > services.length * 0.3) {
      recList.push({
        id: 'review-isolated',
        title: language === 'ar' ? 'مراجعة الخدمات المعزولة' : 'Review Isolated Services',
        description:
          language === 'ar'
            ? `لديك ${healthData.isolatedCount} خدمات ذات صلات محدودة. راجع كل خدمة لتحديد فرص ربط محتملة.`
            : `You have ${healthData.isolatedCount} services with limited connections. Review each service to identify potential linking opportunities.`,
        priority: 'medium',
        actionLabel: language === 'ar' ? 'عرض الخدمات' : 'View Services',
      });
    }

    if (healthData.status === 'excellent' && healthData.averageRelations >= 2) {
      recList.push({
        id: 'maintain-connections',
        title: language === 'ar' ? 'الحفاظ على العلاقات' : 'Maintain Relationships',
        description:
          language === 'ar'
            ? 'شبكة العلاقات في حالة ممتازة! استمر في مراقبة العلاقات عند إضافة خدمات جديدة.'
            : 'Your relationship network is in excellent condition! Continue monitoring relationships when adding new services.',
        priority: 'low',
        actionLabel: language === 'ar' ? 'إضافة خدمة جديدة' : 'Add New Service',
      });
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    recList.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return recList;
  }, [services, healthData, language]);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <Activity className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">
            {language === 'ar' ? 'رؤى علاقات الخدمات' : 'Service Relationship Insights'}
          </h2>
          <p className="text-sm text-gray-400">
            {language === 'ar'
              ? `تحليل شامل لـ ${services.length} خدمات`
              : `Comprehensive analysis of ${services.length} services`}
          </p>
        </div>
      </div>

      {/* Health Score */}
      <RelationshipHealthScore health={healthData} />

      {/* Smart Insights Cards */}
      <SmartInsightsCards
        mostConnected={connectionData.mostConnected}
        leastConnected={connectionData.leastConnected}
        totalOrphan={healthData.orphanCount}
        averageRelations={healthData.averageRelations}
      />

      {/* Warnings and Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RelationshipWarnings warnings={warnings} />
        <RecommendationsPanel recommendations={recommendations} />
      </div>
    </div>
  );
};

export default ServiceRelationshipInsights;
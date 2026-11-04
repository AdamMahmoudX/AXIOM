// =====================================================
// SEO DASHBOARD PAGE - AXIOMX ADMIN SYSTEM
// Phase 4F-F1: SEO Dashboard UI + 4F-F2: SEO Reports Engine + 4F-F3: SEO Alerts System
// Phase 4F-F4: Content Intelligence and SEO Analysis
// Phase 4F-F5: SEO Performance Trends
// Phase 4F-F6: SEO Automation Rules
// =====================================================

// =====================================================
// SEO COMMAND CENTER - AXIOMX ADMIN SYSTEM
// Phase 4F-F8: Final SEO Command Center
// =====================================================

import {
  SEODashboardEngine,
  SEOMetricsAggregator,
  SEOSystemStatusMonitor,
  SEOModulesRegistry,
  SEOCommandActionsManager,
  SEOCommandCenterPersistence,
  formatTimestamp,
  getActivitySeverityColor,
  getActivitySeverityIcon,
  CommandActionType,
  CommandResult,
  ActivityFeedEntry,
  SEOModuleInfo,
  ModuleStatus,
  SEOSystemSummary,
} from '../../../lib/SEOCommandCenter';

import React, { useMemo, useState, useEffect } from 'react';
import { useProjects } from '../../../context/ProjectContext';
import { useArticles } from '../../../context/ArticleContext';
import { useServices } from '../../../context/ServiceContext';
import { useLanguage } from '../../../context/LanguageContext';
import {
  FolderKanban,
  FileText,
  Search,
  TrendingUp,
  TrendingDown,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  ChevronDown,
  ChevronUp,
  Trophy,
  AlertTriangle,
  FileWarning,
  Bell,
  BellOff,
  Check,
  X,
  RefreshCw,
  Target,
  Link2,
  Link2Off,
  Sparkles,
  KeyRound,
  Zap,
  BarChart3,
  ExternalLink,
  Globe,
  Calendar,
  CalendarDays,
  CalendarRange,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Plus,
  Trash2,
  Clock,
  LineChart,
  PieChart,
  ArrowUp,
  ArrowDown,
  Play,
  Pause,
  Settings,
  Cog,
  RotateCcw,
  CheckSquare,
  Square,
  Filter,
  Eye,
  Briefcase,
} from 'lucide-react';
import {
  generateSEOReport,
  downloadReport,
  getIssueLabel,
  getScoreLabel,
  getScoreColorClass,
  getScoreBgColorClass,
  SEOContentItem,
  SEOIssue,
  SEOReport,
} from '../../../lib/SEOReportsEngine';
import {
  detectAllAlerts,
  getAlertsCount,
  getAlertDetails,
  resolveAlertItem,
  unresolveAlertItem,
  clearAllResolvedAlerts,
  SEOAlert,
} from '../../../lib/SEOAlertsEngine';
import {
  SEOKeyword,
  SearchIntent,
  INTENT_LABELS,
  getKeywords,
  getKeywordsByIntent,
  analyzeKeywordGaps,
  calculatePriority,
  getKeywordStatistics,
  initializeDefaultKeywords,
  getUnlinkedContent,
  getTopPriorityKeywords,
} from '../../../lib/SEOKeywordsManager';
import {
  analyzeInternalLinks,
  findOrphanContent,
  findLinkOpportunities,
  generateLinkReport,
  ContentNode,
  LinkOpportunity,
} from '../../../lib/InternalLinkAnalyzer';
import {
  SEOTrendsEngine,
  SEOPerformanceSnapshot,
  TrendReport,
  SEOTrendDataPoint,
} from '../../../lib/SEOTrendsEngine';
import {
  AutomationRule,
  AutomationHistoryEntry,
  getAutomationRules,
  toggleRuleEnabled,
  executeSpecificRule,
  getRecentHistory,
  clearAutomationHistory,
  initializeAutomationRules,
  getRuleTypeLabel,
  getActionTypeLabel,
  getStatusColorClass,
  getStatusBgColorClass,
} from '../../../lib/SEOAutomationEngine';
import {
  SEOHealthMonitor,
  SEOHealthStatus,
  SEOHealthIssue,
  SEOHealthPage,
  HealthScoreCalculator,
  CriticalIssuesDetector,
  HealthScanResult,
} from '../../../lib/SEOHealthMonitor';

// SEO Score calculation helper
const calculateSEOConfigScore = (seo: { title?: string; description?: string }): number => {
  let score = 0;
  if (seo.title && seo.title.length > 0) score += 50;
  if (seo.description && seo.description.length > 0) score += 50;
  return score;
};

interface DashboardCardProps {
  title: string;
  titleAr: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  subtitleAr?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  titleAr,
  value,
  icon,
  color,
  subtitle,
  subtitleAr,
}) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
      <div className={`flex items-start justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <p className="text-4xl font-bold text-white mb-1 text-start rtl:text-end">{value}</p>
      <p className="text-sm text-gray-400 text-start rtl:text-end">
        {language === 'ar' ? titleAr : title}
      </p>
      {(subtitle || subtitleAr) && (
        <p className="text-xs text-gray-500 mt-1 text-start rtl:text-end">
          {language === 'ar' ? subtitleAr : subtitle}
        </p>
      )}
    </div>
  );
};

interface SEOScoreCardProps {
  title: string;
  titleAr: string;
  score: number;
  configured: number;
  total: number;
}

const SEOScoreCard: React.FC<SEOScoreCardProps> = ({
  title,
  titleAr,
  score,
  configured,
  total,
}) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const getScoreColor = (s: number) => {
    if (s >= 80) return 'from-green-500 to-emerald-500';
    if (s >= 60) return 'from-blue-500 to-cyan-500';
    if (s >= 40) return 'from-amber-500 to-yellow-500';
    return 'from-red-500 to-rose-500';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 80) return language === 'ar' ? 'ممتاز' : 'Excellent';
    if (s >= 60) return language === 'ar' ? 'جيد جداً' : 'Good';
    if (s >= 40) return language === 'ar' ? 'مقبول' : 'Fair';
    return language === 'ar' ? 'يحتاج تحسين' : 'Needs Improvement';
  };

  const getScoreIcon = (s: number) => {
    if (s >= 60) return <CheckCircle className="w-6 h-6 text-green-400" />;
    if (s >= 40) return <AlertCircle className="w-6 h-6 text-amber-400" />;
    return <XCircle className="w-6 h-6 text-red-400" />;
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
      <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <h3 className="text-lg font-semibold text-white text-start rtl:text-end">
          {language === 'ar' ? titleAr : title}
        </h3>
        <div className="flex items-center gap-2">
          {getScoreIcon(score)}
          <span className="text-sm font-medium text-gray-400">
            {getScoreLabel(score)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-white/10"
            />
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
                transition: 'stroke-dashoffset 1s ease-out',
              }}
            />
            <defs>
              <linearGradient
                id="scoreGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="rgb(34, 197, 94)" />
                <stop offset="50%" stopColor="rgb(59, 130, 246)" />
                <stop offset="100%" stopColor="rgb(168, 85, 247)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">{score}%</span>
            <span className="text-xs text-gray-500">{language === 'ar' ? 'المتوسط' : 'Average'}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5">
        <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-gray-500">
            {language === 'ar' ? 'مُعد' : 'Configured'}
          </span>
          <span className="text-white font-medium">
            {configured} / {total}
          </span>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// SERVICE SEO SUMMARY REPORT SECTION - NEW
// =====================================================

interface ServiceSEOSummaryReportSectionProps {
  services: any[];
}

const ServiceSEOSummaryReportSection: React.FC<ServiceSEOSummaryReportSectionProps> = ({ services }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Calculate service SEO statistics
  const totalServices = services.length;

  const seoCompletedServices = services.filter(
    (service) =>
      service.content.en.seo?.title &&
      service.content.en.seo.title.length > 0 &&
      service.content.en.seo?.description &&
      service.content.en.seo.description.length > 0
  ).length;

  const seoIncompleteServices = totalServices - seoCompletedServices;

  const serviceSEOScores = services.map((s) => calculateSEOConfigScore(s.content.en.seo || {}));
  const avgServiceSEOScore =
    serviceSEOScores.length > 0
      ? Math.round(serviceSEOScores.reduce((a, b) => a + b, 0) / serviceSEOScores.length)
      : 0;

  // Missing SEO Titles count
  const missingSEOTitles = services.filter(
    (service) => !service.content.en.seo?.title || service.content.en.seo.title.length === 0
  ).length;

  // Missing SEO Descriptions count
  const missingSEODescriptions = services.filter(
    (service) => !service.content.en.seo?.description || service.content.en.seo.description.length === 0
  ).length;

  // Missing Focus Keywords count
  const missingFocusKeywords = services.filter(
    (service) => !service.content.en.seo?.focusKeyword || service.content.en.seo.focusKeyword.length === 0
  ).length;

  // Export SEO Summary Report as JSON
  const handleExportSEOSummary = () => {
    setIsExporting(true);

    const now = new Date();
    const timestamp = now.toISOString();

    // Create comprehensive JSON report
    const reportData = {
      dashboardSummary: {
        generatedAt: timestamp,
        language: language === 'ar' ? 'Arabic' : 'English',
        totalServices: totalServices,
        reportTitle: language === 'ar' ? 'تقرير ملخص SEO للخدمات' : 'Service SEO Summary Report',
      },
      serviceStatistics: {
        totalServices: totalServices,
        seoCompleted: seoCompletedServices,
        seoIncomplete: seoIncompleteServices,
        completionRate: totalServices > 0 ? Math.round((seoCompletedServices / totalServices) * 100) : 0,
      },
      seoCompletionStatistics: {
        missingSEOTitles: missingSEOTitles,
        missingSEODescriptions: missingSEODescriptions,
        missingFocusKeywords: missingFocusKeywords,
        hasTitle: seoCompletedServices + services.filter(s => s.content.en.seo?.title && s.content.en.seo.title.length > 0).length,
        hasDescription: seoCompletedServices + services.filter(s => s.content.en.seo?.description && s.content.en.seo.description.length > 0).length,
        hasFocusKeyword: services.filter(s => s.content.en.seo?.focusKeyword && s.content.en.seo.focusKeyword.length > 0).length,
      },
      seoScoreStatistics: {
        averageSEOScore: avgServiceSEOScore,
        scoreDistribution: {
          excellent: services.filter(s => calculateSEOConfigScore(s.content.en.seo || {}) >= 80).length,
          good: services.filter(s => {
            const score = calculateSEOConfigScore(s.content.en.seo || {});
            return score >= 60 && score < 80;
          }).length,
          fair: services.filter(s => {
            const score = calculateSEOConfigScore(s.content.en.seo || {});
            return score >= 40 && score < 60;
          }).length,
          poor: services.filter(s => calculateSEOConfigScore(s.content.en.seo || {}) < 40).length,
        },
        servicesScores: services.map(s => ({
          id: s.id,
          name: s.name || s.content?.en?.title || 'Unknown',
          score: calculateSEOConfigScore(s.content.en.seo || {}),
          hasSEO: !!(s.content.en.seo?.title && s.content.en.seo?.description),
        })),
      },
    };

    // Convert to JSON string with proper formatting
    const jsonString = JSON.stringify(reportData, null, 2);

    // Create and download the file
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `service-seo-summary-report-${now.toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show success message
    setIsExporting(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  return (
    <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
      {/* Header */}
      <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-violet-400" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="text-lg font-semibold text-white">
              {language === 'ar' ? 'تقرير ملخص SEO للخدمات' : 'Service SEO Summary Report'}
            </h3>
            <p className="text-xs text-gray-500">
              {language === 'ar' ? 'عرض شامل لإحصائيات SEO الخدمات' : 'Comprehensive overview of services SEO statistics'}
            </p>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportSEOSummary}
          disabled={isExporting}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            isExporting
              ? 'bg-violet-500/30 text-violet-400 cursor-wait'
              : 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 hover:from-violet-500/30 hover:to-purple-500/30 text-violet-400 border border-violet-500/30'
          }`}
        >
          {isExporting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              {language === 'ar' ? 'جاري التصدير...' : 'Exporting...'}
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              {language === 'ar' ? 'تصدير تقرير SEO' : 'Export SEO Summary'}
            </>
          )}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Total Services */}
        <div className="bg-white/5 rounded-xl p-4">
          <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Briefcase className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-gray-400">
              {language === 'ar' ? 'إجمالي الخدمات' : 'Total Services'}
            </span>
          </div>
          <p className="text-2xl font-bold text-white">{totalServices}</p>
        </div>

        {/* SEO Complete */}
        <div className="bg-white/5 rounded-xl p-4">
          <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">
              {language === 'ar' ? 'SEO مكتمل' : 'SEO Complete'}
            </span>
          </div>
          <p className="text-2xl font-bold text-green-400">{seoCompletedServices}</p>
        </div>

        {/* SEO Incomplete */}
        <div className="bg-white/5 rounded-xl p-4">
          <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-400">
              {language === 'ar' ? 'SEO غير مكتمل' : 'SEO Incomplete'}
            </span>
          </div>
          <p className="text-2xl font-bold text-amber-400">{seoIncompleteServices}</p>
        </div>

        {/* Average SEO Score */}
        <div className="bg-white/5 rounded-xl p-4">
          <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Target className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">
              {language === 'ar' ? 'متوسط درجة SEO' : 'Average SEO Score'}
            </span>
          </div>
          <p className={`text-2xl font-bold ${avgServiceSEOScore >= 60 ? 'text-green-400' : avgServiceSEOScore >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
            {avgServiceSEOScore}%
          </p>
        </div>
      </div>

      {/* Missing SEO Items */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-300">
          {language === 'ar' ? 'عناصر SEO المفقودة' : 'Missing SEO Items'}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Missing SEO Titles */}
          <div className={`flex items-center justify-between p-3 bg-red-500/10 rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-red-400" />
              </div>
              <span className="text-sm text-gray-300">
                {language === 'ar' ? 'عناوين SEO مفقودة' : 'Missing SEO Titles'}
              </span>
            </div>
            <span className="text-xl font-bold text-red-400">{missingSEOTitles}</span>
          </div>

          {/* Missing SEO Descriptions */}
          <div className={`flex items-center justify-between p-3 bg-amber-500/10 rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-sm text-gray-300">
                {language === 'ar' ? 'أوصاف SEO مفقودة' : 'Missing SEO Descriptions'}
              </span>
            </div>
            <span className="text-xl font-bold text-amber-400">{missingSEODescriptions}</span>
          </div>

          {/* Missing Focus Keywords */}
          <div className={`flex items-center justify-between p-3 bg-blue-500/10 rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <KeyRound className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-sm text-gray-300">
                {language === 'ar' ? 'كلمات مفتاحية مفقودة' : 'Missing Focus Keywords'}
              </span>
            </div>
            <span className="text-xl font-bold text-blue-400">{missingFocusKeywords}</span>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className={`mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl ${isRTL ? 'flex-row-reverse' : ''} flex items-center gap-3`}>
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <p className="text-green-400 font-medium">
              {language === 'ar' ? 'تم تصدير التقرير بنجاح!' : 'Report exported successfully!'}
            </p>
            <p className="text-sm text-green-300/70">
              {language === 'ar' ? 'تم تحميل ملف JSON على جهازك' : 'JSON file has been downloaded to your device'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Service SEO Summary Card - Phase 5D-3-1
interface ServiceSEOSummaryCardProps {
  services: any[];
}

const ServiceSEOSummaryCard: React.FC<ServiceSEOSummaryCardProps> = ({ services }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const totalServices = services.length;

  const seoCompletedServices = services.filter(
    (service) =>
      service.content.en.seo?.title &&
      service.content.en.seo.title.length > 0 &&
      service.content.en.seo?.description &&
      service.content.en.seo.description.length > 0
  ).length;

  const seoIncompleteServices = totalServices - seoCompletedServices;

  const serviceSEOScores = services.map((s) => calculateSEOConfigScore(s.content.en.seo || {}));
  const avgServiceSEOScore =
    serviceSEOScores.length > 0
      ? Math.round(serviceSEOScores.reduce((a, b) => a + b, 0) / serviceSEOScores.length)
      : 0;

  // Get services that need SEO improvement
  const servicesNeedingSEO = services.filter(
    (service) =>
      !service.content.en.seo?.title ||
      service.content.en.seo.title.length === 0 ||
      !service.content.en.seo?.description ||
      service.content.en.seo.description.length === 0
  );

  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-green-400';
    if (s >= 60) return 'text-blue-400';
    if (s >= 40) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (s: number) => {
    if (s >= 80) return 'bg-green-500/20 text-green-400';
    if (s >= 60) return 'bg-blue-500/20 text-blue-400';
    if (s >= 40) return 'bg-amber-500/20 text-amber-400';
    return 'bg-red-500/20 text-red-400';
  };

  return (
    <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
      <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-orange-400" />
          </div>
          <h3 className="text-lg font-semibold text-white text-start rtl:text-end">
            {language === 'ar' ? 'ملخص SEO الخدمات' : 'Service SEO Summary'}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${getScoreColor(avgServiceSEOScore)}`}>
            {avgServiceSEOScore}%
          </span>
        </div>
      </div>

      {/* Service SEO Progress Bar */}
      <div className="mb-6">
        <div className={`flex justify-between text-sm mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-gray-400">
            {language === 'ar' ? 'نسبة إكمال SEO' : 'SEO Completion Rate'}
          </span>
          <span className="text-white font-medium">
            {totalServices > 0 ? Math.round((seoCompletedServices / totalServices) * 100) : 0}%
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${totalServices > 0 ? (seoCompletedServices / totalServices) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">
              {language === 'ar' ? 'مكتمل' : 'Completed'}
            </span>
          </div>
          <p className="text-2xl font-bold text-white">{seoCompletedServices}</p>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-400">
              {language === 'ar' ? 'غير مكتمل' : 'Incomplete'}
            </span>
          </div>
          <p className="text-2xl font-bold text-amber-400">{seoIncompleteServices}</p>
        </div>
      </div>

      {/* Services Needing SEO Improvement */}
      {servicesNeedingSEO.length > 0 && (
        <div className="border-t border-white/10 pt-4">
          <h4 className="text-sm font-medium text-gray-400 mb-3 text-start rtl:text-end">
            {language === 'ar' ? 'خدمات تحتاج تحسين SEO' : 'Services Needing SEO Improvement'}
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {servicesNeedingSEO.slice(0, 5).map((service) => {
              const score = calculateSEOConfigScore(service.content.en.seo || {});
              return (
                <div
                  key={service.id}
                  className={`flex items-center justify-between p-3 bg-white/5 rounded-lg ${
                    isRTL ? 'flex-row-reverse' : ''
                  }`}
                >
                  <span className="text-sm text-gray-300 truncate flex-1 mx-2">
                    {service.title}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getScoreBgColor(score)}`}>
                    {score}%
                  </span>
                </div>
              );
            })}
            {servicesNeedingSEO.length > 5 && (
              <p className="text-xs text-gray-500 text-center">
                {language === 'ar'
                  ? `و ${servicesNeedingSEO.length - 5} خدمات أخرى`
                  : `and ${servicesNeedingSEO.length - 5} more services`}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================
// SERVICE SEO ANALYTICS SECTION - Phase 5D-3-2
// =====================================================

interface ServiceSEOAnalyticsSectionProps {
  services: any[];
}

interface ServiceSEOItem {
  id: string;
  title: string;
  seoScore: number;
  seoStatus: 'complete' | 'incomplete';
  focusKeyword: string;
  lastUpdated: string;
}

const ServiceSEOAnalyticsSection: React.FC<ServiceSEOAnalyticsSectionProps> = ({ services }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'complete' | 'incomplete'>('all');
  const [sortOrder, setSortOrder] = useState<'highest' | 'lowest'>('highest');
  const [isTableExpanded, setIsTableExpanded] = useState(false);

  // Transform services to SEO items
  const serviceSEOItems: ServiceSEOItem[] = services.map(service => {
    const seo = service.content.en.seo || {};
    const hasTitle = seo.title && seo.title.length > 0;
    const hasDescription = seo.description && seo.description.length > 0;
    const isComplete = hasTitle && hasDescription;

    return {
      id: service.id,
      title: service.title,
      seoScore: calculateSEOConfigScore(seo),
      seoStatus: isComplete ? 'complete' : 'incomplete',
      focusKeyword: seo.focusKeyword || '-',
      lastUpdated: service.updatedAt,
    };
  });

  // Filter services
  const filteredServices = useMemo(() => {
    let filtered = serviceSEOItems;

    if (selectedFilter === 'complete') {
      filtered = filtered.filter(s => s.seoStatus === 'complete');
    } else if (selectedFilter === 'incomplete') {
      filtered = filtered.filter(s => s.seoStatus === 'incomplete');
    }

    // Sort
    if (sortOrder === 'highest') {
      filtered = [...filtered].sort((a, b) => b.seoScore - a.seoScore);
    } else {
      filtered = [...filtered].sort((a, b) => a.seoScore - b.seoScore);
    }

    return filtered;
  }, [serviceSEOItems, selectedFilter, sortOrder]);

  // Top SEO Services (top 5)
  const topSEOServices = useMemo(() => {
    return [...serviceSEOItems]
      .sort((a, b) => b.seoScore - a.seoScore)
      .slice(0, 5);
  }, [serviceSEOItems]);

  // Services Needing Improvement
  const servicesNeedingImprovement = useMemo(() => {
    return serviceSEOItems
      .filter(s => s.seoStatus === 'incomplete')
      .sort((a, b) => a.seoScore - b.seoScore)
      .slice(0, 5);
  }, [serviceSEOItems]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 text-green-400';
    if (score >= 60) return 'bg-blue-500/20 text-blue-400';
    if (score >= 40) return 'bg-amber-500/20 text-amber-400';
    return 'bg-red-500/20 text-red-400';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const displayServices = isTableExpanded ? filteredServices : filteredServices.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-orange-400" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h2 className="text-xl font-semibold text-white">
              {language === 'ar' ? 'تحليلات SEO الخدمات' : 'Service SEO Analytics'}
            </h2>
            <p className="text-xs text-gray-500">
              {language === 'ar' ? 'تفاصيل شاملة لكل خدمة' : 'Detailed view for each service'}
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm transition-all ${
              selectedFilter === 'all'
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            {language === 'ar' ? 'الكل' : 'All'}
          </button>
          <button
            onClick={() => setSelectedFilter('complete')}
            className={`px-4 py-2 rounded-xl text-sm transition-all ${
              selectedFilter === 'complete'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            {language === 'ar' ? 'SEO مكتمل' : 'SEO Complete'}
          </button>
          <button
            onClick={() => setSelectedFilter('incomplete')}
            className={`px-4 py-2 rounded-xl text-sm transition-all ${
              selectedFilter === 'incomplete'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            {language === 'ar' ? 'SEO غير مكتمل' : 'SEO Incomplete'}
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Services Table */}
        <div className="lg:col-span-2 bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="flex items-center justify-between p-4 bg-white/5 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">
              {language === 'ar' ? 'جدول الخدمات' : 'Services Table'}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">
                {language === 'ar' ? 'ترتيب:' : 'Sort:'}
              </span>
              <button
                onClick={() => setSortOrder(sortOrder === 'highest' ? 'lowest' : 'highest')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                  sortOrder === 'highest'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                }`}
              >
                {sortOrder === 'highest' ? (
                  <>
                    <ArrowUp className="w-4 h-4" />
                    {language === 'ar' ? 'الأعلى' : 'Highest'}
                  </>
                ) : (
                  <>
                    <ArrowDown className="w-4 h-4" />
                    {language === 'ar' ? 'الأقل' : 'Lowest'}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr className={`${isRTL ? 'text-right' : 'text-left'}`}>
                  <th className="px-4 py-3 text-sm font-medium text-gray-400">
                    {language === 'ar' ? 'اسم الخدمة' : 'Service Name'}
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-400">
                    {language === 'ar' ? 'درجة SEO' : 'SEO Score'}
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-400">
                    {language === 'ar' ? 'حالة SEO' : 'SEO Status'}
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-400">
                    {language === 'ar' ? 'الكلمة المفتاحية' : 'Focus Keyword'}
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-400">
                    {language === 'ar' ? 'آخر تحديث' : 'Last Updated'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayServices.map((service, index) => (
                  <tr
                    key={service.id}
                    className={`border-t border-white/5 hover:bg-white/5 transition-all ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 w-6">#{index + 1}</span>
                        <span className="text-white font-medium truncate max-w-[200px]">
                          {service.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-lg font-bold ${getScoreColor(service.seoScore)}`}>
                        {service.seoScore}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-3 py-1 rounded-full ${getScoreBgColor(service.seoScore)}`}>
                        {service.seoStatus === 'complete'
                          ? (language === 'ar' ? 'مكتمل' : 'Complete')
                          : (language === 'ar' ? 'غير مكتمل' : 'Incomplete')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-400 truncate max-w-[150px] block">
                        {service.focusKeyword}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-500">
                        {formatDate(service.lastUpdated)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          {filteredServices.length > 10 && (
            <div className="p-4 border-t border-white/10">
              <button
                onClick={() => setIsTableExpanded(!isTableExpanded)}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-orange-400 hover:text-orange-300 transition-colors"
              >
                {isTableExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    {language === 'ar' ? 'عرض أقل' : 'Show Less'}
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    {language === 'ar' ? 'عرض الكل' : 'Show All'} ({filteredServices.length})
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Lists */}
        <div className="space-y-6">
          {/* Top SEO Services */}
          <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                {language === 'ar' ? 'أفضل خدمات SEO' : 'Top SEO Services'}
              </h3>
            </div>

            {topSEOServices.length === 0 ? (
              <p className="text-gray-400 text-center py-4">
                {language === 'ar' ? 'لا توجد خدمات' : 'No services'}
              </p>
            ) : (
              <div className="space-y-3">
                {topSEOServices.map((service, index) => (
                  <div
                    key={service.id}
                    className={`flex items-center gap-3 p-3 bg-white/5 rounded-xl ${
                      isRTL ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full ${getScoreBgColor(service.seoScore)} flex items-center justify-center`}>
                      <span className={`text-sm font-bold ${getScoreColor(service.seoScore)}`}>
                        #{index + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {service.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {service.seoScore}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Services Needing Improvement */}
          <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                {language === 'ar' ? 'خدمات تحتاج تحسين' : 'Services Needing Improvement'}
              </h3>
            </div>

            {servicesNeedingImprovement.length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">
                  {language === 'ar' ? 'جميع الخدمات جيدة!' : 'All services are good!'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {servicesNeedingImprovement.map((service) => (
                  <div
                    key={service.id}
                    className={`flex items-center gap-3 p-3 bg-amber-500/10 rounded-xl ${
                      isRTL ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {service.title}
                      </p>
                      <p className="text-xs text-amber-400">
                        {service.seoScore}% - {language === 'ar' ? 'يحتاج تحسين' : 'Needs improvement'}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getScoreBgColor(service.seoScore)}`}>
                      {service.seoScore}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// SERVICE SEO QUICK FIX ACTIONS - NEW SECTION
// =====================================================

interface ServiceSEOQuickFixItem {
  serviceId: string;
  serviceTitle: string;
  issues: {
    type: 'missing_title' | 'missing_description' | 'missing_keyword' | 'low_score';
    label: string;
    labelAr: string;
    severity: 'high' | 'medium';
  }[];
  currentScore: number;
}

interface ServiceSEOQuickFixSectionProps {
  services: any[];
  onUpdateService: (id: string, language: 'en' | 'ar', content: any) => void;
}

const ServiceSEOQuickFixSection: React.FC<ServiceSEOQuickFixSectionProps> = ({ services, onUpdateService }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Get services with SEO issues
  const servicesWithIssues = useMemo((): ServiceSEOQuickFixItem[] => {
    return services
      .filter(service => {
        const seo = service.content?.en?.seo || {};
        return (
          !seo.title || seo.title.trim() === '' ||
          !seo.description || seo.description.trim() === '' ||
          !seo.focusKeyword || seo.focusKeyword.trim() === '' ||
          calculateSEOConfigScore(seo) < 60
        );
      })
      .map(service => {
        const seo = service.content?.en?.seo || {};
        const issues: ServiceSEOQuickFixItem['issues'] = [];

        if (!seo.title || seo.title.trim() === '') {
          issues.push({
            type: 'missing_title',
            label: 'Missing SEO Title',
            labelAr: 'عنوان SEO مفقود',
            severity: 'high'
          });
        }

        if (!seo.description || seo.description.trim() === '') {
          issues.push({
            type: 'missing_description',
            label: 'Missing SEO Description',
            labelAr: 'وصف SEO مفقود',
            severity: 'high'
          });
        }

        if (!seo.focusKeyword || seo.focusKeyword.trim() === '') {
          issues.push({
            type: 'missing_keyword',
            label: 'Missing Focus Keyword',
            labelAr: 'كلمة مفتاحية رئيسية مفقودة',
            severity: 'medium'
          });
        }

        if (calculateSEOConfigScore(seo) < 60) {
          issues.push({
            type: 'low_score',
            label: 'Low SEO Score',
            labelAr: 'درجة SEO منخفضة',
            severity: 'medium'
          });
        }

        return {
          serviceId: service.id,
          serviceTitle: service.title,
          issues,
          currentScore: calculateSEOConfigScore(seo)
        };
      })
      .filter(item => item.issues.length > 0);
  }, [services]);

  // Generate SEO Title based on service name
  const generateSEOTitle = (serviceTitle: string): string => {
    const suffixes = {
      en: ['Services', 'Solutions', 'Professional', 'Expert'],
      ar: ['الخدمات', 'الحلول', 'احترافي', 'متخصص']
    };
    const lang = language;
    return `${serviceTitle} | ${suffixes[lang][Math.floor(Math.random() * suffixes[lang].length)]} ${serviceTitle}`;
  };

  // Generate SEO Description
  const generateSEODescription = (serviceTitle: string): string => {
    const templates = {
      en: [
        `Professional ${serviceTitle} services. Expert solutions for your business needs. Contact us today for a consultation.`,
        `Get expert ${serviceTitle} solutions. We provide comprehensive services tailored to your requirements.`,
        `Transform your business with our ${serviceTitle} services. Contact us now for professional assistance.`
      ],
      ar: [
        `خدمات ${serviceTitle} الاحترافية. حلول متخصصة لاحتياجات عملك. تواصل معنا اليوم للاستشارة.`,
        `احصل على حلول ${serviceTitle} المتخصصة. نقدم خدمات شاملة مصممة خصيصاً لمتطلباتك.`,
        `حوّل عملك مع خدمات ${serviceTitle} الخاصة بنا. تواصل معنا الآن للحصول على المساعدة المتخصصة.`
      ]
    };
    const lang = language;
    const templatesList = templates[lang];
    return templatesList[Math.floor(Math.random() * templatesList.length)];
  };

  // Generate Focus Keyword
  const generateFocusKeyword = (serviceTitle: string): string => {
    const words = serviceTitle.toLowerCase().split(' ');
    return words.length > 2 ? words.slice(0, 3).join(' ') : serviceTitle.toLowerCase();
  };

  // Handle action button click
  const handleAction = async (serviceId: string, actionType: 'title' | 'description' | 'keyword' | 'improve') => {
    setProcessingId(`${serviceId}-${actionType}`);

    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    const seo = service.content?.en?.seo || {};
    let newSeo = { ...seo };

    switch (actionType) {
      case 'title':
        newSeo.title = generateSEOTitle(service.title);
        break;
      case 'description':
        newSeo.description = generateSEODescription(service.title);
        break;
      case 'keyword':
        newSeo.focusKeyword = generateFocusKeyword(service.title);
        break;
      case 'improve':
        if (!newSeo.title) {
          newSeo.title = generateSEOTitle(service.title);
        }
        if (!newSeo.description) {
          newSeo.description = generateSEODescription(service.title);
        }
        if (!newSeo.focusKeyword) {
          newSeo.focusKeyword = generateFocusKeyword(service.title);
        }
        break;
    }

    onUpdateService(serviceId, 'en', { seo: newSeo });

    // Show success message
    const actionLabels = {
      title: { en: 'SEO Title generated', ar: 'تم توليد عنوان SEO' },
      description: { en: 'SEO Description generated', ar: 'تم توليد وصف SEO' },
      keyword: { en: 'Focus Keyword generated', ar: 'تم توليد الكلمة المفتاحية' },
      improve: { en: 'SEO Score improved', ar: 'تم تحسين درجة SEO' }
    };

    setSuccessMessage(actionLabels[actionType][language]);
    setTimeout(() => setSuccessMessage(null), 3000);
    setProcessingId(null);
  };

  // Get button configuration for each issue
  const getActionButton = (issue: ServiceSEOQuickFixItem['issues'][0], serviceId: string) => {
    const buttonConfig = {
      missing_title: {
        label: language === 'ar' ? 'توليد عنوان SEO' : 'Generate SEO Title',
        icon: <FileText className="w-4 h-4" />,
        color: 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
      },
      missing_description: {
        label: language === 'ar' ? 'توليد وصف SEO' : 'Generate SEO Description',
        icon: <FileWarning className="w-4 h-4" />,
        color: 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400'
      },
      missing_keyword: {
        label: language === 'ar' ? 'توليد كلمة مفتاحية' : 'Generate Focus Keyword',
        icon: <KeyRound className="w-4 h-4" />,
        color: 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400'
      },
      low_score: {
        label: language === 'ar' ? 'تحسين درجة SEO' : 'Improve SEO Score',
        icon: <TrendingUp className="w-4 h-4" />,
        color: 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
      }
    };

    const config = buttonConfig[issue.type];
    const isProcessing = processingId === `${serviceId}-${issue.type === 'missing_title' ? 'title' : issue.type === 'missing_description' ? 'description' : issue.type === 'missing_keyword' ? 'keyword' : 'improve'}`;

    return (
      <button
        onClick={() => handleAction(
          serviceId,
          issue.type === 'missing_title' ? 'title' :
          issue.type === 'missing_description' ? 'description' :
          issue.type === 'missing_keyword' ? 'keyword' : 'improve'
        )}
        disabled={isProcessing}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${config.color} ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        {isProcessing ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          config.icon
        )}
        {config.label}
      </button>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 text-green-400';
    if (score >= 60) return 'bg-blue-500/20 text-blue-400';
    if (score >= 40) return 'bg-amber-500/20 text-amber-400';
    return 'bg-red-500/20 text-red-400';
  };

  return (
    <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className={`flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-white/10 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-green-400" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="text-lg font-semibold text-white">
              {language === 'ar' ? 'إجراءات SEO السريعة للخدمات' : 'Service SEO Quick Fix Actions'}
            </h3>
            <p className="text-xs text-gray-400">
              {language === 'ar'
                ? 'إصلاح فوري لمشاكل SEO في الخدمات'
                : 'Instantly fix SEO issues in services'}
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-sm px-3 py-1 rounded-full bg-green-500/20 text-green-400">
            {servicesWithIssues.length} {language === 'ar' ? 'خدمة' : 'services'}
          </span>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className={`flex items-center gap-3 p-4 bg-green-500/20 border-b border-green-500/30 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-medium">{successMessage}</span>
        </div>
      )}

      {/* Services List */}
      <div className="max-h-[600px] overflow-y-auto">
        {servicesWithIssues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
            <p className="text-lg text-green-400 font-medium">
              {language === 'ar' ? 'جميع الخدمات مُحسّنة!' : 'All services are optimized!'}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {language === 'ar' ? 'لا توجد إجراءات مطلوبة' : 'No actions needed'}
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {servicesWithIssues.map((item) => (
              <div
                key={item.serviceId}
                className={`bg-white/5 rounded-xl overflow-hidden transition-all ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
              >
                {/* Service Header */}
                <div
                  className={`flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-all ${
                    isRTL ? 'flex-row-reverse' : ''
                  }`}
                  onClick={() => setExpandedService(expandedService === item.serviceId ? null : item.serviceId)}
                >
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <p className="text-white font-medium">{item.serviceTitle}</p>
                      <div className={`flex items-center gap-2 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {item.issues.map((issue, index) => (
                          <span
                            key={index}
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              issue.severity === 'high'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {language === 'ar' ? issue.labelAr : issue.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className={`text-lg font-bold ${getScoreColor(item.currentScore)}`}>
                      {item.currentScore}%
                    </span>
                    {expandedService === item.serviceId ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Actions */}
                {expandedService === item.serviceId && (
                  <div className="px-4 pb-4 border-t border-white/10">
                    <h4 className="text-sm font-medium text-gray-400 mb-3 mt-4">
                      {language === 'ar' ? 'الإجراءات المتاحة:' : 'Available Actions:'}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {item.issues.map((issue, index) => (
                        <div key={index}>
                          {getActionButton(issue, item.serviceId)}
                        </div>
                      ))}
                    </div>

                    {/* Quick Improve All Button */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <button
                        onClick={() => handleAction(item.serviceId, 'improve')}
                        disabled={processingId === `${item.serviceId}-improve`}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-sm bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 text-green-400 ${
                          isRTL ? 'flex-row-reverse' : ''
                        }`}
                      >
                        {processingId === `${item.serviceId}-improve` ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            {language === 'ar' ? 'جاري المعالجة...' : 'Processing...'}
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            {language === 'ar' ? 'تحسين كل شيء' : 'Improve All'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// =====================================================
// SERVICE SEO INSIGHTS SECTION - Phase 5D-3-3
// =====================================================

interface ServiceSEOInsightsSectionProps {
  services: any[];
}

interface ServiceSEOInsight {
  id: string;
  serviceId: string;
  serviceTitle: string;
  type: 'missing_title' | 'missing_description' | 'missing_keyword' | 'low_score' | 'high_score';
  severity: 'high' | 'medium' | 'low';
  recommendation: string;
  recommendationAr: string;
}

interface ServiceRecommendation {
  serviceId: string;
  serviceTitle: string;
  seoScore: number;
  priority: 'high' | 'medium' | 'low';
  issues: string[];
  issuesAr: string[];
  recommendations: string[];
  recommendationsAr: string[];
}

const ServiceSEOInsightsSection: React.FC<ServiceSEOInsightsSectionProps> = ({ services }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [expandedService, setExpandedService] = useState<string | null>(null);

  // Generate Smart Insights for services
  const serviceInsights = useMemo((): ServiceSEOInsight[] => {
    const insights: ServiceSEOInsight[] = [];

    services.forEach(service => {
      const seo = service.content.en.seo || {};

      // Missing SEO Title
      if (!seo.title || seo.title.trim() === '') {
        insights.push({
          id: `insight-${service.id}-title`,
          serviceId: service.id,
          serviceTitle: service.title,
          type: 'missing_title',
          severity: 'high',
          recommendation: 'Add an SEO title with your primary keyword (50-60 characters)',
          recommendationAr: 'أضف عنوان SEO مع الكلمة المفتاحية الرئيسية (50-60 حرف)',
        });
      }

      // Missing SEO Description
      if (!seo.description || seo.description.trim() === '') {
        insights.push({
          id: `insight-${service.id}-desc`,
          serviceId: service.id,
          serviceTitle: service.title,
          type: 'missing_description',
          severity: 'high',
          recommendation: 'Add a meta description with your primary keyword (150-160 characters)',
          recommendationAr: 'أضف وصف تعريفي مع الكلمة المفتاحية الرئيسية (150-160 حرف)',
        });
      }

      // Missing Focus Keyword
      if (!seo.focusKeyword || seo.focusKeyword.trim() === '') {
        insights.push({
          id: `insight-${service.id}-keyword`,
          serviceId: service.id,
          serviceTitle: service.title,
          type: 'missing_keyword',
          severity: 'medium',
          recommendation: 'Define a focus keyword for this service',
          recommendationAr: 'حدد كلمة مفتاحية رئيسية لهذه الخدمة',
        });
      }
    });

    return insights;
  }, [services]);

  // Generate Recommendations for each service
  const serviceRecommendations = useMemo((): ServiceRecommendation[] => {
    return services.map(service => {
      const seo = service.content.en.seo || {};
      const score = calculateSEOConfigScore(seo);

      const issues: string[] = [];
      const issuesAr: string[] = [];
      const recommendations: string[] = [];
      const recommendationsAr: string[] = [];

      // Check SEO title
      if (!seo.title || seo.title.trim() === '') {
        issues.push('Missing SEO Title');
        issuesAr.push('عنوان SEO مفقود');
        recommendations.push('Add an SEO title with your primary keyword');
        recommendationsAr.push('أضف عنوان SEO مع الكلمة المفتاحية الرئيسية');
      } else if (seo.title.length < 30) {
        issues.push('SEO Title too short');
        issuesAr.push('عنوان SEO قصير جداً');
        recommendations.push('Expand your SEO title to 50-60 characters');
        recommendationsAr.push('وسّع عنوان SEO الخاص بك إلى 50-60 حرف');
      }

      // Check SEO description
      if (!seo.description || seo.description.trim() === '') {
        issues.push('Missing Meta Description');
        issuesAr.push('وصف تعريفي مفقود');
        recommendations.push('Add a compelling meta description with your primary keyword');
        recommendationsAr.push('أضف وصفاً تعريفياً جذاباً مع الكلمة المفتاحية الرئيسية');
      } else if (seo.description.length < 100) {
        issues.push('Meta Description too short');
        issuesAr.push('الوصف التعريفي قصير جداً');
        recommendations.push('Expand your meta description to 150-160 characters');
        recommendationsAr.push('وسّع الوصف التعريفي الخاص بك إلى 150-160 حرف');
      }

      // Check focus keyword
      if (!seo.focusKeyword || seo.focusKeyword.trim() === '') {
        issues.push('Missing Focus Keyword');
        issuesAr.push('كلمة مفتاحية رئيسية مفقودة');
        recommendations.push('Define a primary focus keyword for this service');
        recommendationsAr.push('حدد كلمة مفتاحية رئيسية لهذه الخدمة');
      }

      // Determine priority based on score and issues
      let priority: 'high' | 'medium' | 'low';
      if (score < 40 || issues.length >= 2) {
        priority = 'high';
      } else if (score < 70 || issues.length === 1) {
        priority = 'medium';
      } else {
        priority = 'low';
      }

      return {
        serviceId: service.id,
        serviceTitle: service.title,
        seoScore: score,
        priority,
        issues,
        issuesAr,
        recommendations,
        recommendationsAr,
      };
    });
  }, [services]);

  // Calculate priority counts
  const priorityCounts = useMemo(() => {
    return {
      high: serviceRecommendations.filter(r => r.priority === 'high').length,
      medium: serviceRecommendations.filter(r => r.priority === 'medium').length,
      low: serviceRecommendations.filter(r => r.priority === 'low').length,
    };
  }, [serviceRecommendations]);

  // Filter services by priority
  const filteredRecommendations = useMemo(() => {
    if (selectedPriority === 'all') return serviceRecommendations;
    return serviceRecommendations.filter(r => r.priority === selectedPriority);
  }, [serviceRecommendations, selectedPriority]);

  // Get services missing specific SEO elements
  const servicesMissingTitle = services.filter(s => !s.content.en.seo?.title || s.content.en.seo.title.trim() === '').length;
  const servicesMissingDescription = services.filter(s => !s.content.en.seo?.description || s.content.en.seo.description.trim() === '').length;
  const servicesMissingKeyword = services.filter(s => !s.content.en.seo?.focusKeyword || s.content.en.seo.focusKeyword.trim() === '').length;
  const servicesWithLowScore = serviceRecommendations.filter(r => r.seoScore < 50).length;

  // Get severity colors
  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400';
      case 'medium':
        return 'bg-amber-500/20 text-amber-400';
      case 'low':
        return 'bg-green-500/20 text-green-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 text-green-400';
    if (score >= 60) return 'bg-blue-500/20 text-blue-400';
    if (score >= 40) return 'bg-amber-500/20 text-amber-400';
    return 'bg-red-500/20 text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-orange-400" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h2 className="text-2xl font-bold text-white">
              {language === 'ar' ? 'Service SEO Insights' : 'Service SEO Insights'}
            </h2>
            <p className="text-sm text-gray-400">
              {language === 'ar'
                ? 'تحليل ذكي وتحسين توصيات SEO للخدمات'
                : 'Smart insights and SEO improvement recommendations for services'}
            </p>
          </div>
        </div>
      </div>

      {/* Smart Insights Cards - Phase 5D-3-3-A */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Services Missing SEO Title */}
        <div className="bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-xs text-gray-400">
              {language === 'ar' ? 'بدون عنوان SEO' : 'Missing SEO Title'}
            </span>
          </div>
          <p className="text-2xl font-bold text-red-400">{servicesMissingTitle}</p>
          <p className="text-xs text-gray-500 mt-1">
            {services.length > 0 ? Math.round((servicesMissingTitle / services.length) * 100) : 0}%
            {language === 'ar' ? ' من الخدمات' : ' of services'}
          </p>
        </div>

        {/* Services Missing SEO Description */}
        <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-orange-400" />
            <span className="text-xs text-gray-400">
              {language === 'ar' ? 'بدون وصف SEO' : 'Missing SEO Description'}
            </span>
          </div>
          <p className="text-2xl font-bold text-orange-400">{servicesMissingDescription}</p>
          <p className="text-xs text-gray-500 mt-1">
            {services.length > 0 ? Math.round((servicesMissingDescription / services.length) * 100) : 0}%
            {language === 'ar' ? ' من الخدمات' : ' of services'}
          </p>
        </div>

        {/* Services Missing Focus Keyword */}
        <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <span className="text-xs text-gray-400">
              {language === 'ar' ? 'بدون كلمة مفتاحية' : 'Missing Focus Keyword'}
            </span>
          </div>
          <p className="text-2xl font-bold text-amber-400">{servicesMissingKeyword}</p>
          <p className="text-xs text-gray-500 mt-1">
            {services.length > 0 ? Math.round((servicesMissingKeyword / services.length) * 100) : 0}%
            {language === 'ar' ? ' من الخدمات' : ' of services'}
          </p>
        </div>

        {/* Services With Low SEO Score */}
        <div className="bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-red-400" />
            <span className="text-xs text-gray-400">
              {language === 'ar' ? 'درجة منخفضة' : 'Low SEO Score'}
            </span>
          </div>
          <p className="text-2xl font-bold text-red-400">{servicesWithLowScore}</p>
          <p className="text-xs text-gray-500 mt-1">
            {services.length > 0 ? Math.round((servicesWithLowScore / services.length) * 100) : 0}%
            {language === 'ar' ? ' من الخدمات' : ' of services'}
          </p>
        </div>
      </div>

      {/* Priority Levels Section */}
      <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
        <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              {language === 'ar' ? 'مستويات الأولوية' : 'Priority Levels'}
            </h3>
          </div>
        </div>

        {/* Priority Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* High Priority */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-400 font-medium">
                  {language === 'ar' ? 'أولوية عالية' : 'High Priority'}
                </span>
              </div>
              <span className="text-2xl font-bold text-red-400">{priorityCounts.high}</span>
            </div>
            <div className="w-full bg-red-500/20 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(priorityCounts.high / services.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Medium Priority */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-amber-400 font-medium">
                  {language === 'ar' ? 'أولوية متوسطة' : 'Medium Priority'}
                </span>
              </div>
              <span className="text-2xl font-bold text-amber-400">{priorityCounts.medium}</span>
            </div>
            <div className="w-full bg-amber-500/20 rounded-full h-2">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(priorityCounts.medium / services.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Low Priority */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400 font-medium">
                  {language === 'ar' ? 'أولوية منخفضة' : 'Low Priority'}
                </span>
              </div>
              <span className="text-2xl font-bold text-green-400">{priorityCounts.low}</span>
            </div>
            <div className="w-full bg-green-500/20 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(priorityCounts.low / services.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={() => setSelectedPriority('all')}
            className={`px-4 py-2 rounded-xl text-sm transition-all ${
              selectedPriority === 'all'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            {language === 'ar' ? 'الكل' : 'All'} ({services.length})
          </button>
          <button
            onClick={() => setSelectedPriority('high')}
            className={`px-4 py-2 rounded-xl text-sm transition-all ${
              selectedPriority === 'high'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            {language === 'ar' ? 'عالية' : 'High'} ({priorityCounts.high})
          </button>
          <button
            onClick={() => setSelectedPriority('medium')}
            className={`px-4 py-2 rounded-xl text-sm transition-all ${
              selectedPriority === 'medium'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            {language === 'ar' ? 'متوسطة' : 'Medium'} ({priorityCounts.medium})
          </button>
          <button
            onClick={() => setSelectedPriority('low')}
            className={`px-4 py-2 rounded-xl text-sm transition-all ${
              selectedPriority === 'low'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            {language === 'ar' ? 'منخفضة' : 'Low'} ({priorityCounts.low})
          </button>
        </div>
      </div>

      {/* Recommendations Panel */}
      <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl overflow-hidden">
        <div className={`flex items-center justify-between p-4 bg-white/5 border-b border-white/10 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <FileWarning className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              {language === 'ar' ? 'لوحة التوصيات' : 'Recommendations Panel'}
            </h3>
          </div>
          <span className="text-sm text-gray-400">
            {filteredRecommendations.length} {language === 'ar' ? 'خدمة' : 'services'}
          </span>
        </div>

        {/* Recommendations List */}
        <div className="max-h-[500px] overflow-y-auto">
          {filteredRecommendations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="w-12 h-12 text-green-400 mb-4" />
              <p className="text-gray-400">
                {language === 'ar' ? 'جميع الخدمات في حالة جيدة!' : 'All services are in good standing!'}
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {filteredRecommendations.map((rec) => (
                <div
                  key={rec.serviceId}
                  className={`bg-white/5 rounded-xl overflow-hidden transition-all ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}
                >
                  {/* Service Header */}
                  <div
                    className={`flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-all ${
                      isRTL ? 'flex-row-reverse' : ''
                    }`}
                    onClick={() => setExpandedService(expandedService === rec.serviceId ? null : rec.serviceId)}
                  >
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(rec.priority)}`}>
                        {rec.priority === 'high'
                          ? (language === 'ar' ? 'عالية' : 'High')
                          : rec.priority === 'medium'
                          ? (language === 'ar' ? 'متوسطة' : 'Medium')
                          : (language === 'ar' ? 'منخفضة' : 'Low')}
                      </span>
                      <span className="text-white font-medium">{rec.serviceTitle}</span>
                    </div>
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className={`text-lg font-bold ${getScoreColor(rec.seoScore)}`}>
                        {rec.seoScore}%
                      </span>
                      {expandedService === rec.serviceId ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedService === rec.serviceId && (
                    <div className="px-4 pb-4 border-t border-white/10">
                      {/* Issues */}
                      {rec.issues.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-400 mb-2">
                            {language === 'ar' ? 'المشاكل:' : 'Issues:'}
                          </h4>
                          <div className="space-y-2">
                            {rec.issues.map((issue, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-red-500/10 rounded-lg">
                                <XCircle className="w-4 h-4 text-red-400" />
                                <span className="text-sm text-red-300">
                                  {language === 'ar' ? rec.issuesAr[index] : issue}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommendations */}
                      {rec.recommendations.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-400 mb-2">
                            {language === 'ar' ? 'التوصيات:' : 'Recommendations:'}
                          </h4>
                          <div className="space-y-2">
                            {rec.recommendations.map((recItem, index) => (
                              <div key={index} className="flex items-start gap-2 p-2 bg-green-500/10 rounded-lg">
                                <Sparkles className="w-4 h-4 text-green-400 mt-0.5" />
                                <span className="text-sm text-green-300">
                                  {language === 'ar' ? rec.recommendationsAr[index] : recItem}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className={`flex items-center gap-3 mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <button
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl transition-all text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          {language === 'ar' ? 'عرض الخدمة' : 'View Service'}
                        </button>
                        <button
                          className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-xl transition-all text-sm"
                        >
                          <Settings className="w-4 h-4" />
                          {language === 'ar' ? 'تعديل SEO الخدمة' : 'Edit Service SEO'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =====================================================
// SEO RECOMMENDATIONS PANEL - Phase 5D-3-3-B
// =====================================================

interface SEORecommendation {
  id: string;
  serviceId: string;
  serviceTitle: string;
  issueType: 'missing_title' | 'missing_description' | 'missing_keyword' | 'low_score';
  issueTypeLabel: string;
  issueTypeLabelAr: string;
  recommendationText: string;
  recommendationTextAr: string;
  seoScore: number;
}

interface SEORecommendationsPanelProps {
  services: any[];
}

const SEORecommendationsPanel: React.FC<SEORecommendationsPanelProps> = ({ services }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'missing_title' | 'missing_description' | 'missing_keyword' | 'low_score'>('all');

  // Generate SEO Recommendations from ServiceContext only
  const recommendations = useMemo((): SEORecommendation[] => {
    const recs: SEORecommendation[] = [];

    services.forEach(service => {
      const seo = service.content.en.seo || {};
      const score = calculateSEOConfigScore(seo);

      // Missing SEO Title
      if (!seo.title || seo.title.trim() === '') {
        recs.push({
          id: `rec-${service.id}-title`,
          serviceId: service.id,
          serviceTitle: service.title,
          issueType: 'missing_title',
          issueTypeLabel: 'Missing SEO Title',
          issueTypeLabelAr: 'عنوان SEO مفقود',
          recommendationText: 'Add an SEO title with your primary keyword (50-60 characters)',
          recommendationTextAr: 'أضف عنوان SEO مع الكلمة المفتاحية الرئيسية (50-60 حرف)',
          seoScore: score,
        });
      }

      // Missing SEO Description
      if (!seo.description || seo.description.trim() === '') {
        recs.push({
          id: `rec-${service.id}-desc`,
          serviceId: service.id,
          serviceTitle: service.title,
          issueType: 'missing_description',
          issueTypeLabel: 'Missing SEO Description',
          issueTypeLabelAr: 'وصف SEO مفقود',
          recommendationText: 'Add a meta description with your primary keyword (150-160 characters)',
          recommendationTextAr: 'أضف وصفاً تعريفياً مع الكلمة المفتاحية الرئيسية (150-160 حرف)',
          seoScore: score,
        });
      }

      // Missing Focus Keyword
      if (!seo.focusKeyword || seo.focusKeyword.trim() === '') {
        recs.push({
          id: `rec-${service.id}-keyword`,
          serviceId: service.id,
          serviceTitle: service.title,
          issueType: 'missing_keyword',
          issueTypeLabel: 'Missing Focus Keyword',
          issueTypeLabelAr: 'كلمة مفتاحية رئيسية مفقودة',
          recommendationText: 'Define a primary focus keyword for this service',
          recommendationTextAr: 'حدد كلمة مفتاحية رئيسية لهذه الخدمة',
          seoScore: score,
        });
      }

      // Low SEO Score (below 50)
      if (score < 50) {
        recs.push({
          id: `rec-${service.id}-score`,
          serviceId: service.id,
          serviceTitle: service.title,
          issueType: 'low_score',
          issueTypeLabel: 'Low SEO Score',
          issueTypeLabelAr: 'درجة SEO منخفضة',
          recommendationText: `Improve your SEO configuration. Current score: ${score}%`,
          recommendationTextAr: `حسّن إعدادات SEO الخاصة بك. الدرجة الحالية: ${score}%`,
          seoScore: score,
        });
      }
    });

    // Sort by severity (missing_title and missing_description first, then low_score, then missing_keyword)
    const severityOrder = ['missing_title', 'missing_description', 'low_score', 'missing_keyword'];
    return recs.sort((a, b) => {
      const aIndex = severityOrder.indexOf(a.issueType);
      const bIndex = severityOrder.indexOf(b.issueType);
      if (aIndex !== bIndex) return aIndex - bIndex;
      return b.seoScore - a.seoScore;
    });
  }, [services]);

  // Filter recommendations
  const filteredRecommendations = useMemo(() => {
    if (selectedFilter === 'all') return recommendations;
    return recommendations.filter(rec => rec.issueType === selectedFilter);
  }, [recommendations, selectedFilter]);

  // Count by type
  const counts = useMemo(() => ({
    all: recommendations.length,
    missing_title: recommendations.filter(r => r.issueType === 'missing_title').length,
    missing_description: recommendations.filter(r => r.issueType === 'missing_description').length,
    missing_keyword: recommendations.filter(r => r.issueType === 'missing_keyword').length,
    low_score: recommendations.filter(r => r.issueType === 'low_score').length,
  }), [recommendations]);

  // Get issue type color
  const getIssueTypeColor = (issueType: string) => {
    switch (issueType) {
      case 'missing_title':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'missing_description':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'missing_keyword':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low_score':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Get issue type icon
  const getIssueTypeIcon = (issueType: string) => {
    switch (issueType) {
      case 'missing_title':
        return <AlertCircle className="w-4 h-4" />;
      case 'missing_description':
        return <FileText className="w-4 h-4" />;
      case 'missing_keyword':
        return <KeyRound className="w-4 h-4" />;
      case 'low_score':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className={`flex items-center justify-between p-4 bg-white/5 border-b border-white/10 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="text-lg font-semibold text-white">
              {language === 'ar' ? 'SEO Recommendations' : 'SEO Recommendations'}
            </h3>
            <p className="text-xs text-gray-500">
              {language === 'ar'
                ? 'توصيات تحسين SEO تلقائية للخدمات'
                : 'Automatic SEO improvement recommendations for services'}
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-lg font-bold text-cyan-400">
            {counts.all}
          </span>
          <span className="text-sm text-gray-400">
            {language === 'ar' ? 'توصية' : 'recommendations'}
          </span>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className={`flex items-center gap-2 p-4 border-b border-white/10 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-4 py-2 rounded-xl text-sm transition-all ${
            selectedFilter === 'all'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
          }`}
        >
          {language === 'ar' ? 'الكل' : 'All'} ({counts.all})
        </button>
        <button
          onClick={() => setSelectedFilter('missing_title')}
          className={`px-4 py-2 rounded-xl text-sm transition-all ${
            selectedFilter === 'missing_title'
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
          }`}
        >
          {language === 'ar' ? 'بدون عنوان' : 'No Title'} ({counts.missing_title})
        </button>
        <button
          onClick={() => setSelectedFilter('missing_description')}
          className={`px-4 py-2 rounded-xl text-sm transition-all ${
            selectedFilter === 'missing_description'
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
          }`}
        >
          {language === 'ar' ? 'بدون وصف' : 'No Description'} ({counts.missing_description})
        </button>
        <button
          onClick={() => setSelectedFilter('missing_keyword')}
          className={`px-4 py-2 rounded-xl text-sm transition-all ${
            selectedFilter === 'missing_keyword'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
          }`}
        >
          {language === 'ar' ? 'بدون كلمة' : 'No Keyword'} ({counts.missing_keyword})
        </button>
        <button
          onClick={() => setSelectedFilter('low_score')}
          className={`px-4 py-2 rounded-xl text-sm transition-all ${
            selectedFilter === 'low_score'
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
          }`}
        >
          {language === 'ar' ? 'درجة منخفضة' : 'Low Score'} ({counts.low_score})
        </button>
      </div>

      {/* Recommendations List */}
      <div className="max-h-[500px] overflow-y-auto">
        {filteredRecommendations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="w-12 h-12 text-green-400 mb-4" />
            <p className="text-gray-400">
              {language === 'ar' ? 'لا توجد توصيات!' : 'No recommendations found!'}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {language === 'ar' ? 'جميع الخدمات في حالة جيدة' : 'All services are in good standing'}
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredRecommendations.map((rec) => (
              <div
                key={rec.id}
                className={`bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
              >
                <div className={`flex items-start justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getIssueTypeColor(rec.issueType)}`}>
                      {getIssueTypeIcon(rec.issueType)}
                    </div>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <p className="text-white font-medium">{rec.serviceTitle}</p>
                      <span className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${getIssueTypeColor(rec.issueType)}`}>
                        {language === 'ar' ? rec.issueTypeLabelAr : rec.issueTypeLabel}
                      </span>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${
                    rec.seoScore >= 80 ? 'text-green-400' :
                    rec.seoScore >= 60 ? 'text-blue-400' :
                    rec.seoScore >= 40 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {rec.seoScore}%
                  </span>
                </div>
                <div className={`flex items-start gap-2 p-3 bg-white/5 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Sparkles className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">
                    {language === 'ar' ? rec.recommendationTextAr : rec.recommendationText}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Top SEO Content Report Component
interface TopSEOContentReportProps {
  items: SEOContentItem[];
  maxItems?: number;
}

const TopSEOContentReport: React.FC<TopSEOContentReportProps> = ({ items, maxItems = 10 }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [isExpanded, setIsExpanded] = useState(false);

  const displayItems = isExpanded ? items : items.slice(0, maxItems);

  if (items.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white text-start rtl:text-end">
            {language === 'ar' ? 'أفضل محتوى SEO' : 'Top SEO Content'}
          </h3>
        </div>
        <p className="text-gray-400 text-center py-8">
          {language === 'ar' ? 'لا يوجد محتوى بعد' : 'No content available yet'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white text-start rtl:text-end">
            {language === 'ar' ? 'أفضل محتوى SEO' : 'Top SEO Content'}
          </h3>
        </div>
        <span className="text-sm text-gray-400">{items.length} {language === 'ar' ? 'عنصر' : 'items'}</span>
      </div>

      <div className="space-y-3">
        {displayItems.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-full ${getScoreBgColorClass(item.score)} flex items-center justify-center`}>
              <span className={`text-sm font-bold ${getScoreColorClass(item.score)}`}>
                #{index + 1}
              </span>
            </div>
            <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <p className="text-white font-medium truncate">{item.title}</p>
              <p className="text-xs text-gray-500">
                {item.type === 'project'
                  ? language === 'ar' ? 'مشروع' : 'Project'
                  : language === 'ar' ? 'مقال' : 'Article'}
              </p>
            </div>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className={`text-lg font-bold ${getScoreColorClass(item.score)}`}>
                {item.score}%
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${getScoreBgColorClass(item.score)} ${getScoreColorClass(item.score)}`}>
                {getScoreLabel(item.score, language)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {items.length > maxItems && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              {language === 'ar' ? 'عرض أقل' : 'Show Less'}
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              {language === 'ar' ? 'عرض الكل' : 'Show All'}
            </>
          )}
        </button>
      )}
    </div>
  );
};

// Worst SEO Content Report Component
interface WorstSEOContentReportProps {
  items: SEOContentItem[];
  maxItems?: number;
}

const WorstSEOContentReport: React.FC<WorstSEOContentReportProps> = ({ items, maxItems = 10 }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [isExpanded, setIsExpanded] = useState(false);

  const displayItems = isExpanded ? items : items.slice(0, maxItems);

  if (items.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-white text-start rtl:text-end">
            {language === 'ar' ? 'أسوأ محتوى SEO' : 'Worst SEO Content'}
          </h3>
        </div>
        <p className="text-gray-400 text-center py-8">
          {language === 'ar' ? 'لا يوجد محتوى يحتاج تحسين' : 'No content needs improvement'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-white text-start rtl:text-end">
            {language === 'ar' ? 'أسوأ محتوى SEO يحتاج تحسين' : 'Worst SEO Content Needs Improvement'}
          </h3>
        </div>
        <span className="text-sm text-gray-400">{items.length} {language === 'ar' ? 'عنصر' : 'items'}</span>
      </div>

      <div className="space-y-3">
        {displayItems.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-full ${getScoreBgColorClass(item.score)} flex items-center justify-center`}>
              <span className={`text-sm font-bold ${getScoreColorClass(item.score)}`}>
                {index + 1}
              </span>
            </div>
            <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <p className="text-white font-medium truncate">{item.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">
                  {item.type === 'project'
                    ? language === 'ar' ? 'مشروع' : 'Project'
                    : language === 'ar' ? 'مقال' : 'Article'}
                </span>
                {item.issues.length > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                    {item.issues.length} {language === 'ar' ? 'مشكلة' : 'issues'}
                  </span>
                )}
              </div>
            </div>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className={`text-lg font-bold ${getScoreColorClass(item.score)}`}>
                {item.score}%
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${getScoreBgColorClass(item.score)} ${getScoreColorClass(item.score)}`}>
                {getScoreLabel(item.score, language)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {items.length > maxItems && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              {language === 'ar' ? 'عرض أقل' : 'Show Less'}
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              {language === 'ar' ? 'عرض الكل' : 'Show All'}
            </>
          )}
        </button>
      )}
    </div>
  );
};

// SEO Issues Report Component
interface SEOIssuesReportProps {
  issues: SEOIssue[];
}

const SEOIssuesReport: React.FC<SEOIssuesReportProps> = ({ issues }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  if (issues.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <FileWarning className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold text-white text-start rtl:text-end">
            {language === 'ar' ? 'تقرير مشاكل SEO' : 'SEO Issues Report'}
          </h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <CheckCircle className="w-12 h-12 text-green-400" />
        </div>
        <p className="text-center text-green-400">
          {language === 'ar' ? 'لا توجد مشاكل SEO!' : 'No SEO issues found!'}
        </p>
      </div>
    );
  }

  const totalAffectedItems = issues.reduce((sum, issue) => sum + issue.count, 0);

  return (
    <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <FileWarning className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold text-white text-start rtl:text-end">
            {language === 'ar' ? 'تقرير مشاكل SEO' : 'SEO Issues Report'}
          </h3>
        </div>
        <span className="text-sm text-red-400">{totalAffectedItems} {language === 'ar' ? 'مشكلة' : 'issues'}</span>
      </div>

      <div className="space-y-3">
        {issues.map((issue, index) => (
          <div
            key={issue.type}
            className={`flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <p className="text-white font-medium">{getIssueLabel(issue.type, language)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {language === 'ar'
                  ? `${issue.count} عنصر متأثر`
                  : `${issue.count} items affected`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-red-400">{issue.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =====================================================
// KEYWORD GAP ANALYSIS COMPONENT (Phase 4F-F4)
// =====================================================

interface KeywordGapAnalysisProps {
  projects: any[];
  articles: any[];
}

const KeywordGapAnalysis: React.FC<KeywordGapAnalysisProps> = ({ projects, articles }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState<SearchIntent | 'all'>('all');

  // Initialize default keywords if none exist
  useMemo(() => {
    initializeDefaultKeywords();
  }, []);

  // Get all keywords
  const keywords = useMemo(() => getKeywords(), []);

  // Get keyword statistics
  const stats = useMemo(() => getKeywordStatistics(), [keywords]);

  // Filter keywords by intent
  const filteredKeywords = useMemo(() => {
    if (selectedIntent === 'all') return keywords;
    return keywords.filter(kw => kw.intent === selectedIntent);
  }, [keywords, selectedIntent]);

  // Get content IDs for gap analysis
  const contentKeywords = useMemo(() => {
    const kwList: string[] = [];
    projects.forEach(p => {
      if (p.content.en.seo.focusKeyword) kwList.push(p.content.en.seo.focusKeyword);
      if (p.content.en.seo.title) kwList.push(p.content.en.seo.title);
    });
    articles.forEach(a => {
      if (a.content.en.seo.focusKeyword) kwList.push(a.content.en.seo.focusKeyword);
      if (a.content.en.seo.title) kwList.push(a.content.en.seo.title);
    });
    return kwList;
  }, [projects, articles]);

  // Analyze keyword gaps
  const gapAnalysis = useMemo(() => analyzeKeywordGaps(contentKeywords), [contentKeywords]);

  // Get top priority keywords
  const topPriorityKeywords = useMemo(() => getTopPriorityKeywords(10), []);

  if (keywords.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-cyan-400" />
          </div>
          <h3 className="text-lg font-semibold text-white text-start rtl:text-end">
            {language === 'ar' ? 'تحليل فجوات الكلمات المفتاحية' : 'Keyword Gap Analysis'}
          </h3>
        </div>
        <p className="text-gray-400 text-center py-8">
          {language === 'ar' ? 'لا توجد كلمات مفتاحية. أضف كلمات مفتاحية للبدء.' : 'No keywords found. Add keywords to start.'}
        </p>
      </div>
    );
  }

  const displayKeywords = isExpanded ? filteredKeywords : filteredKeywords.slice(0, 10);

  return (
    <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-cyan-400" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="text-lg font-semibold text-white">
              {language === 'ar' ? 'تحليل فجوات الكلمات المفتاحية' : 'Keyword Gap Analysis'}
            </h3>
            <p className="text-xs text-gray-500">
              {language === 'ar' ? 'اكتشف الفرص غير المستغلة' : 'Discover untapped opportunities'}
            </p>
          </div>
        </div>
        <span className="text-sm text-cyan-400">{keywords.length} {language === 'ar' ? 'كلمة' : 'keywords'}</span>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">{language === 'ar' ? 'أولوية عالية' : 'High Priority'}</span>
          </div>
          <p className="text-xl font-bold text-green-400">{stats.highPriorityCount}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-400">{language === 'ar' ? 'منخفضة المنافسة' : 'Low Competition'}</span>
          </div>
          <p className="text-xl font-bold text-amber-400">{stats.lowDifficultyCount}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-gray-400">{language === 'ar' ? 'غير مستخدمة' : 'Unused'}</span>
          </div>
          <p className="text-xl font-bold text-cyan-400">{gapAnalysis.unusedKeywords.length}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-400">{language === 'ar' ? 'متوسط الأولوية' : 'Avg Priority'}</span>
          </div>
          <p className="text-xl font-bold text-purple-400">{stats.avgPriority}</p>
        </div>
      </div>

      {/* Intent Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setSelectedIntent('all')}
          className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
            selectedIntent === 'all'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
          }`}
        >
          {language === 'ar' ? 'الكل' : 'All'}
        </button>
        {(Object.keys(INTENT_LABELS) as SearchIntent[]).map(intent => (
          <button
            key={intent}
            onClick={() => setSelectedIntent(intent)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              selectedIntent === intent
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            {language === 'ar' ? INTENT_LABELS[intent].ar : INTENT_LABELS[intent].en}
          </button>
        ))}
      </div>

      {/* Keywords List */}
      <div className="space-y-2">
        {displayKeywords.map(keyword => (
          <div
            key={keyword.id}
            className={`flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{keyword.keyword}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  keyword.intent === 'transactional' ? 'bg-green-500/20 text-green-400' :
                  keyword.intent === 'commercial' ? 'bg-blue-500/20 text-blue-400' :
                  keyword.intent === 'informational' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {language === 'ar' ? INTENT_LABELS[keyword.intent].ar : INTENT_LABELS[keyword.intent].en}
                </span>
                <span className="text-xs text-gray-500">{keyword.group}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="text-xs text-gray-500">{language === 'ar' ? 'الصعوبة' : 'Difficulty'}</p>
                <p className={`text-sm font-medium ${
                  keyword.difficulty <= 30 ? 'text-green-400' :
                  keyword.difficulty <= 60 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {keyword.difficulty}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">{language === 'ar' ? 'الأولوية' : 'Priority'}</p>
                <p className={`text-sm font-medium ${
                  keyword.priority >= 70 ? 'text-green-400' :
                  keyword.priority >= 40 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {keyword.priority}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Expand/Collapse Button */}
      {filteredKeywords.length > 10 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              {language === 'ar' ? 'عرض أقل' : 'Show Less'}
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              {language === 'ar' ? 'عرض الكل' : 'Show All'}
            </>
          )}
        </button>
      )}

      {/* Recommendations */}
      {gapAnalysis.recommendations.length > 0 && (
        <div className="mt-6 pt-4 border-t border-white/10">
          <h4 className="text-sm font-medium text-white mb-3">
            {language === 'ar' ? 'التوصيات' : 'Recommendations'}
          </h4>
          <div className="space-y-2">
            {gapAnalysis.recommendations.slice(0, 5).map((rec, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-green-500/10 rounded-lg">
                <Sparkles className="w-4 h-4 text-green-400 mt-0.5" />
                <p className="text-sm text-green-300">{rec.keyword.keyword}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================
// CONTENT IMPROVEMENT SUGGESTIONS COMPONENT (Phase 4F-F4)
// =====================================================

interface ContentImprovementSuggestionsProps {
  projects: any[];
  articles: any[];
}

interface ContentSuggestion {
  contentId: string;
  contentTitle: string;
  contentType: 'project' | 'article';
  suggestions: {
    type: string;
    typeAr: string;
    typeEn: string;
    severity: 'critical' | 'warning';
  }[];
}

const ContentImprovementSuggestions: React.FC<ContentImprovementSuggestionsProps> = ({ projects, articles }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'project' | 'article'>('all');

  // Generate suggestions for all content
  const suggestions = useMemo((): ContentSuggestion[] => {
    const allSuggestions: ContentSuggestion[] = [];

    // Process projects
    projects.forEach(project => {
      const contentSuggestions: ContentSuggestion['suggestions'] = [];
      const seo = project.content.en.seo || {};

      if (!seo.title || seo.title.trim() === '') {
        contentSuggestions.push({
          type: 'missing_seo_title',
          typeAr: 'عنوان SEO مفقود',
          typeEn: 'Missing SEO Title',
          severity: 'critical',
        });
      }

      if (!seo.description || seo.description.trim() === '') {
        contentSuggestions.push({
          type: 'missing_meta_description',
          typeAr: 'وصف تعريفي مفقود',
          typeEn: 'Missing Meta Description',
          severity: 'critical',
        });
      }

      if (!seo.focusKeyword || seo.focusKeyword.trim() === '') {
        contentSuggestions.push({
          type: 'missing_focus_keyword',
          typeAr: 'كلمة مفتاحية رئيسية مفقودة',
          typeEn: 'Missing Focus Keyword',
          severity: 'critical',
        });
      }

      if (!seo.ogTitle || seo.ogTitle.trim() === '') {
        contentSuggestions.push({
          type: 'missing_og_title',
          typeAr: 'OpenGraph Title مفقود',
          typeEn: 'Missing OpenGraph Title',
          severity: 'warning',
        });
      }

      if (!seo.ogDescription || seo.ogDescription.trim() === '') {
        contentSuggestions.push({
          type: 'missing_og_description',
          typeAr: 'OpenGraph Description مفقود',
          typeEn: 'Missing OpenGraph Description',
          severity: 'warning',
        });
      }

      if (contentSuggestions.length > 0) {
        allSuggestions.push({
          contentId: project.id,
          contentTitle: project.content.en.title || project.name,
          contentType: 'project',
          suggestions: contentSuggestions,
        });
      }
    });

    // Process articles
    articles.forEach(article => {
      const contentSuggestions: ContentSuggestion['suggestions'] = [];
      const seo = article.content.en.seo || {};

      if (!seo.title || seo.title.trim() === '') {
        contentSuggestions.push({
          type: 'missing_seo_title',
          typeAr: 'عنوان SEO مفقود',
          typeEn: 'Missing SEO Title',
          severity: 'critical',
        });
      }

      if (!seo.description || seo.description.trim() === '') {
        contentSuggestions.push({
          type: 'missing_meta_description',
          typeAr: 'وصف تعريفي مفقود',
          typeEn: 'Missing Meta Description',
          severity: 'critical',
        });
      }

      if (!seo.focusKeyword || seo.focusKeyword.trim() === '') {
        contentSuggestions.push({
          type: 'missing_focus_keyword',
          typeAr: 'كلمة مفتاحية رئيسية مفقودة',
          typeEn: 'Missing Focus Keyword',
          severity: 'critical',
        });
      }

      if (!seo.ogTitle || seo.ogTitle.trim() === '') {
        contentSuggestions.push({
          type: 'missing_og_title',
          typeAr: 'OpenGraph Title مفقود',
          typeEn: 'Missing OpenGraph Title',
          severity: 'warning',
        });
      }

      if (!seo.ogDescription || seo.ogDescription.trim() === '') {
        contentSuggestions.push({
          type: 'missing_og_description',
          typeAr: 'OpenGraph Description مفقود',
          typeEn: 'Missing OpenGraph Description',
          severity: 'warning',
        });
      }

      if (contentSuggestions.length > 0) {
        allSuggestions.push({
          contentId: article.id,
          contentTitle: article.content.en.title || article.title,
          contentType: 'article',
          suggestions: contentSuggestions,
        });
      }
    });

    // Sort by critical suggestions count
    return allSuggestions.sort((a, b) => {
      const aCritical = a.suggestions.filter(s => s.severity === 'critical').length;
      const bCritical = b.suggestions.filter(s => s.severity === 'critical').length;
      return bCritical - aCritical;
    });
  }, [projects, articles]);

  // Filter by type
  const filteredSuggestions = useMemo(() => {
    if (selectedType === 'all') return suggestions;
    return suggestions.filter(s => s.contentType === selectedType);
  }, [suggestions, selectedType]);

  const displaySuggestions = isExpanded ? filteredSuggestions : filteredSuggestions.slice(0, 8);

  // Count totals
  const totalCritical = suggestions.reduce(
    (sum, s) => sum + s.suggestions.filter(sug => sug.severity === 'critical').length,
    0
  );
  const totalWarning = suggestions.reduce(
    (sum, s) => sum + s.suggestions.filter(sug => sug.severity === 'warning').length,
    0
  );

  if (suggestions.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-white text-start rtl:text-end">
            {language === 'ar' ? 'اقتراحات تحسين المحتوى' : 'Content Improvement Suggestions'}
          </h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <CheckCircle className="w-12 h-12 text-green-400" />
        </div>
        <p className="text-center text-green-400">
          {language === 'ar' ? 'جميع المحتوى مُحسّن بشكل جيد!' : 'All content is well optimized!'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="text-lg font-semibold text-white">
              {language === 'ar' ? 'اقتراحات تحسين المحتوى' : 'Content Improvement Suggestions'}
            </h3>
            <p className="text-xs text-gray-500">
              {language === 'ar' ? 'تحسينات SEO المقترحة لكل محتوى' : 'Suggested SEO improvements for each content'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm px-2 py-1 rounded-full bg-red-500/20 text-red-400">
            {totalCritical} {language === 'ar' ? 'حرج' : 'Critical'}
          </span>
          <span className="text-sm px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">
            {totalWarning} {language === 'ar' ? 'تحذير' : 'Warning'}
          </span>
        </div>
      </div>

      {/* Type Filter */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
            selectedType === 'all'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
          }`}
        >
          {language === 'ar' ? 'الكل' : 'All'} ({suggestions.length})
        </button>
        <button
          onClick={() => setSelectedType('project')}
          className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
            selectedType === 'project'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
          }`}
        >
          {language === 'ar' ? 'المشاريع' : 'Projects'} ({suggestions.filter(s => s.contentType === 'project').length})
        </button>
        <button
          onClick={() => setSelectedType('article')}
          className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
            selectedType === 'article'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
          }`}
        >
          {language === 'ar' ? 'المقالات' : 'Articles'} ({suggestions.filter(s => s.contentType === 'article').length})
        </button>
      </div>

      {/* Suggestions List */}
      <div className="space-y-3">
        {displaySuggestions.map(item => (
          <div
            key={item.contentId}
            className={`p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all ${
              isRTL ? 'text-right' : 'text-left'
            }`}
          >
            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {item.contentType === 'project' ? (
                <FolderKanban className="w-4 h-4 text-blue-400" />
              ) : (
                <FileText className="w-4 h-4 text-purple-400" />
              )}
              <p className="text-white font-medium">{item.contentTitle}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                item.contentType === 'project' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
              }`}>
                {item.contentType === 'project'
                  ? language === 'ar' ? 'مشروع' : 'Project'
                  : language === 'ar' ? 'مقال' : 'Article'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {item.suggestions.map((suggestion, index) => (
                <span
                  key={index}
                  className={`text-xs px-2 py-1 rounded-lg ${
                    suggestion.severity === 'critical'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {language === 'ar' ? suggestion.typeAr : suggestion.typeEn}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Expand/Collapse */}
      {filteredSuggestions.length > 8 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              {language === 'ar' ? 'عرض أقل' : 'Show Less'}
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              {language === 'ar' ? 'عرض الكل' : 'Show All'}
            </>
          )}
        </button>
      )}
    </div>
  );
};

// =====================================================
// INTERNAL LINKS ANALYSIS COMPONENT (Phase 4F-F4)
// =====================================================

interface InternalLinksAnalysisProps {
  projects: any[];
  articles: any[];
}

const InternalLinksAnalysis: React.FC<InternalLinksAnalysisProps> = ({ projects, articles }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [isExpanded, setIsExpanded] = useState(false);

  // Analyze internal links
  const analysis = useMemo(() => {
    return analyzeInternalLinks(projects, articles);
  }, [projects, articles]);

  const { orphanContent, pagesWithoutIncomingLinks, pagesWithoutOutgoingLinks, linkOpportunities, linkReport } = analysis;

  return (
    <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
            <Link2 className="w-5 h-5 text-violet-400" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="text-lg font-semibold text-white">
              {language === 'ar' ? 'تحليل الروابط الداخلية' : 'Internal Links Analysis'}
            </h3>
            <p className="text-xs text-gray-500">
              {language === 'ar' ? 'اكتشف فرص ربط المحتوى' : 'Discover content linking opportunities'}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Link2 className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-gray-400">{language === 'ar' ? 'إجمالي الروابط' : 'Total Links'}</span>
          </div>
          <p className="text-xl font-bold text-violet-400">{linkReport.totalLinks}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Link2Off className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-400">{language === 'ar' ? 'محتوى معزول' : 'Orphan Content'}</span>
          </div>
          <p className="text-xl font-bold text-red-400">{orphanContent.length}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <ExternalLink className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-400">{language === 'ar' ? 'بدون روابط داخلة' : 'No Incoming Links'}</span>
          </div>
          <p className="text-xl font-bold text-amber-400">{pagesWithoutIncomingLinks.length}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">{language === 'ar' ? 'فرص الربط' : 'Link Opportunities'}</span>
          </div>
          <p className="text-xl font-bold text-green-400">{linkOpportunities.length}</p>
        </div>
      </div>

      {/* Orphan Content */}
      {orphanContent.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
            <Link2Off className="w-4 h-4 text-red-400" />
            {language === 'ar' ? 'المحتوى المعزول (لا روابط داخلة أو خارجة)' : 'Orphan Content (No incoming or outgoing links)'}
          </h4>
          <div className="space-y-2">
            {orphanContent.slice(0, 5).map(node => (
              <div key={node.id} className="flex items-center gap-2 p-2 bg-red-500/10 rounded-lg">
                {node.type === 'project' ? (
                  <FolderKanban className="w-4 h-4 text-blue-400" />
                ) : (
                  <FileText className="w-4 h-4 text-purple-400" />
                )}
                <span className="text-sm text-red-300 truncate">{node.title}</span>
              </div>
            ))}
            {orphanContent.length > 5 && (
              <p className="text-xs text-gray-500">
                +{orphanContent.length - 5} {language === 'ar' ? 'المزيد' : 'more'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Link Opportunities */}
      {linkOpportunities.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-green-400" />
            {language === 'ar' ? 'فرص الربط الداخلي' : 'Internal Link Opportunities'}
          </h4>
          <div className="space-y-2">
            {linkOpportunities.slice(0, isExpanded ? linkOpportunities.length : 5).map((opp, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-green-500/10 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-green-300">
                    {language === 'ar' ? opp.reasonAr : opp.reason}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                    opp.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                    opp.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {opp.priority === 'high' ? language === 'ar' ? 'أولوية عالية' : 'High' :
                     opp.priority === 'medium' ? language === 'ar' ? 'متوسطة' : 'Medium' :
                     language === 'ar' ? 'منخفضة' : 'Low'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expand Button */}
      {linkOpportunities.length > 5 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 text-sm text-violet-400 hover:text-violet-300 transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              {language === 'ar' ? 'عرض أقل' : 'Show Less'}
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              {language === 'ar' ? 'عرض الكل' : `Show All (${linkOpportunities.length})`}
            </>
          )}
        </button>
      )}
    </div>
  );
};

// =====================================================
// EXPORT BUTTONS
// =====================================================

interface ExportButtonProps {
  report: SEOReport;
  projects: any[];
  articles: any[];
}

const ExportButtons: React.FC<ExportButtonProps> = ({ report, projects, articles }) => {
  const { language } = useLanguage();

  // Export single report
  const handleExportReport = () => {
    const filename = `seo-report-${new Date().toISOString().split('T')[0]}.json`;
    downloadReport(report, filename);
  };

  // Export full SEO audit
  const handleExportFullAudit = () => {
    // Get all data
    const keywords = getKeywords();
    const stats = getKeywordStatistics();
    initializeDefaultKeywords();
    const gapAnalysis = analyzeKeywordGaps([
      ...projects.map(p => p.content.en.seo.focusKeyword).filter(Boolean),
      ...articles.map(a => a.content.en.seo.focusKeyword).filter(Boolean),
    ]);
    const internalLinksAnalysis = analyzeInternalLinks(projects, articles);
    const alerts = detectAllAlerts([...report.topContent, ...report.worstContent]);

    // Build full audit report
    const fullAudit = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalContent: projects.length + articles.length,
        totalProjects: projects.length,
        totalArticles: articles.length,
        avgSEOScore: report.summary.avgScore,
        seoCoverage: report.summary.coverage,
        totalKeywords: keywords.length,
        orphanContentCount: internalLinksAnalysis.orphanContent.length,
        linkOpportunitiesCount: internalLinksAnalysis.linkOpportunities.length,
        alertsCount: alerts.length,
        issuesCount: report.issues.reduce((sum, i) => sum + i.count, 0),
      },
      keywords: {
        total: keywords.length,
        statistics: stats,
        byIntent: {
          informational: keywords.filter(k => k.intent === 'informational').length,
          commercial: keywords.filter(k => k.intent === 'commercial').length,
          transactional: keywords.filter(k => k.intent === 'transactional').length,
          navigational: keywords.filter(k => k.intent === 'navigational').length,
        },
        topPriority: getTopPriorityKeywords(10),
        gapAnalysis: {
          unusedKeywords: gapAnalysis.unusedKeywords.map(k => ({ keyword: k.keyword, priority: k.priority, difficulty: k.difficulty })),
          recommendations: gapAnalysis.recommendations.map(r => ({ keyword: r.keyword.keyword, reason: r.reason })),
        },
      },
      seoReport: report,
      alerts: alerts.map(a => ({
        type: a.type,
        severity: a.severity,
        title: language === 'ar' ? a.titleAr : a.title,
        description: language === 'ar' ? a.descriptionAr : a.description,
        count: a.count,
      })),
      internalLinksAnalysis: {
        totalLinks: internalLinksAnalysis.totalLinks,
        orphanContent: internalLinksAnalysis.orphanContent.map(c => ({ title: c.title, type: c.type, url: c.url })),
        pagesWithoutIncomingLinks: internalLinksAnalysis.pagesWithoutIncomingLinks.map(c => ({ title: c.title, type: c.type })),
        pagesWithoutOutgoingLinks: internalLinksAnalysis.pagesWithoutOutgoingLinks.map(c => ({ title: c.title, type: c.type })),
        linkOpportunities: internalLinksAnalysis.linkOpportunities.slice(0, 20).map(o => ({
          source: o.sourceNode.title,
          target: o.targetNode.title,
          reason: language === 'ar' ? o.reasonAr : o.reason,
          priority: o.priority,
        })),
        report: internalLinksAnalysis.linkReport,
      },
      recommendations: {
        contentImprovement: [...report.worstContent, ...report.topContent]
          .filter(c => c.score < 100)
          .slice(0, 10)
          .map(c => ({
            title: c.title,
            type: c.type,
            score: c.score,
            issues: c.issues.map(i => getIssueLabel(i.type, language)),
          })),
      },
    };

    // Download
    const json = JSON.stringify(fullAudit, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `seo-audit-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleExportReport}
        className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-xl transition-all duration-300"
      >
        <Download className="w-4 h-4" />
        {language === 'ar' ? 'تصدير التقرير' : 'Export Report'}
      </button>
      <button
        onClick={handleExportFullAudit}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl transition-all duration-300"
      >
        <Sparkles className="w-4 h-4" />
        {language === 'ar' ? 'تصدير تقرير SEO كامل' : 'Export Full SEO Audit'}
      </button>
    </div>
  );
};

// =====================================================
// ALERT COMPONENTS
// =====================================================

interface AlertCounterProps {
  label: string;
  count: number;
  color: string;
  bgColor: string;
}

const AlertCounter: React.FC<AlertCounterProps> = ({ label, count, color, bgColor }) => (
  <div className={`flex items-center gap-2 px-4 py-2 ${bgColor} rounded-xl`}>
    <span className={`text-2xl font-bold ${color}`}>{count}</span>
    <span className="text-sm text-gray-400">{label}</span>
  </div>
);

interface AlertItemProps {
  alert: SEOAlert;
  onResolve: (alertType: string, itemId: string) => void;
  onUnresolve: (alertType: string, itemId: string) => void;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert, onResolve, onUnresolve }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [isExpanded, setIsExpanded] = useState(false);

  const { resolvedItems, unresolvedItems } = getAlertDetails(alert);
  const isAllResolved = unresolvedItems.length === 0;

  const getSeverityIcon = () => {
    if (alert.severity === 'critical') {
      return <XCircle className="w-5 h-5 text-red-400" />;
    }
    return <AlertTriangle className="w-5 h-5 text-amber-400" />;
  };

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all duration-300 ${
        alert.severity === 'critical'
          ? 'border-red-500/30 bg-red-500/5'
          : 'border-amber-500/30 bg-amber-500/5'
      }`}
    >
      <div
        className={`flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-all ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {getSeverityIcon()}
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <p className="text-white font-medium">
              {language === 'ar' ? alert.titleAr : alert.title}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'ar' ? alert.descriptionAr : alert.description}
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              alert.severity === 'critical'
                ? 'bg-red-500/20 text-red-400'
                : 'bg-amber-500/20 text-amber-400'
            }`}
          >
            {alert.count} {language === 'ar' ? 'عنصر' : 'items'}
          </span>
          {isAllResolved ? (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400">
              {language === 'ar' ? 'تم الحل' : 'Resolved'}
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400">
              {unresolvedItems.length} {language === 'ar' ? 'معلق' : 'pending'}
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-white/10 p-4 bg-black/20">
          {unresolvedItems.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-400 mb-2">
                {language === 'ar' ? 'العناصر المعلقة:' : 'Pending Items:'}
              </p>
              <div className="space-y-2">
                {unresolvedItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 bg-white/5 rounded-lg ${
                      isRTL ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <p className="text-white text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-gray-500">
                        {item.type === 'project'
                          ? language === 'ar' ? 'مشروع' : 'Project'
                          : language === 'ar' ? 'مقال' : 'Article'}
                      </p>
                    </div>
                    <button
                      onClick={() => onResolve(alert.type, item.id)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all text-sm"
                    >
                      <Check className="w-4 h-4" />
                      {language === 'ar' ? 'تم الحل' : 'Resolve'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resolvedItems.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-400 mb-2">
                {language === 'ar' ? 'العناصر المحلولة:' : 'Resolved Items:'}
              </p>
              <div className="space-y-2">
                {resolvedItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 bg-green-500/10 rounded-lg ${
                      isRTL ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <p className="text-gray-400 text-sm">{item.title}</p>
                    </div>
                    <button
                      onClick={() => onUnresolve(alert.type, item.id)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-lg transition-all text-sm"
                    >
                      <RefreshCw className="w-4 h-4" />
                      {language === 'ar' ? 'إعادة فتح' : 'Reopen'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface SEOAlertsWidgetProps {
  alerts: SEOAlert[];
  onResolve: (alertType: string, itemId: string) => void;
  onUnresolve: (alertType: string, itemId: string) => void;
  onClearAll: () => void;
}

const SEOAlertsWidget: React.FC<SEOAlertsWidgetProps> = ({
  alerts,
  onResolve,
  onUnresolve,
  onClearAll,
}) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [isExpanded, setIsExpanded] = useState(true);
  const [showResolved, setShowResolved] = useState(false);

  const counts = getAlertsCount(alerts);

  const visibleAlerts = showResolved
    ? alerts
    : alerts.filter((alert) => {
        const { unresolvedItems } = getAlertDetails(alert);
        return unresolvedItems.length > 0;
      });

  if (alerts.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <BellOff className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-white text-start rtl:text-end">
            {language === 'ar' ? 'تنبيهات SEO' : 'SEO Alerts'}
          </h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <CheckCircle className="w-12 h-12 text-green-400" />
        </div>
        <p className="text-center text-green-400">
          {language === 'ar' ? 'لا توجد تنبيهات!' : 'No alerts found!'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl overflow-hidden">
      <div
        className={`flex items-center justify-between p-4 bg-white/5 cursor-pointer ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-400" />
            </div>
            {counts.total > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                {counts.total}
              </span>
            )}
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="text-lg font-semibold text-white">
              {language === 'ar' ? 'تنبيهات SEO' : 'SEO Alerts'}
            </h3>
            <p className="text-xs text-gray-500">
              {language === 'ar'
                ? 'مشاكل SEO تحتاج اهتمام'
                : 'SEO issues that need attention'}
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      <div
        className={`flex items-center gap-4 px-4 py-3 border-t border-white/10 ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
      >
        <AlertCounter
          label={language === 'ar' ? 'حرج' : 'Critical'}
          count={counts.critical}
          color="text-red-400"
          bgColor="bg-red-500/10"
        />
        <AlertCounter
          label={language === 'ar' ? 'تحذير' : 'Warning'}
          count={counts.warning}
          color="text-amber-400"
          bgColor="bg-amber-500/10"
        />
        <AlertCounter
          label={language === 'ar' ? 'الإجمالي' : 'Total'}
          count={counts.total}
          color="text-blue-400"
          bgColor="bg-blue-500/10"
        />
      </div>

      {isExpanded && (
        <div className="border-t border-white/10">
          <div
            className={`flex items-center justify-between px-4 py-3 bg-white/5 ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
          >
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showResolved}
                onChange={(e) => setShowResolved(e.target.checked)}
                className="w-4 h-4 rounded border-gray-500 text-blue-500 focus:ring-blue-500 bg-transparent"
              />
              <span className="text-sm text-gray-400">
                {language === 'ar' ? 'إظهار المحلولة' : 'Show Resolved'}
              </span>
            </label>
            {counts.total > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClearAll();
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-lg transition-all text-sm"
              >
                <X className="w-4 h-4" />
                {language === 'ar' ? 'مسح الكل' : 'Clear All'}
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto p-4 space-y-3">
            {visibleAlerts.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                {language === 'ar' ? 'لا توجد تنبيهات معلقة' : 'No pending alerts'}
              </p>
            ) : (
              visibleAlerts.map((alert) => (
                <AlertItem
                  key={alert.id}
                  alert={alert}
                  onResolve={onResolve}
                  onUnresolve={onUnresolve}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================
// MAIN DASHBOARD COMPONENT
// =====================================================

const SEODashboardPage: React.FC = () => {
  const { projects } = useProjects();
  const { articles } = useArticles();
  const { services, updateServiceContent } = useServices();
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  // Generate SEO Report
  const report = useMemo(() => {
    return generateSEOReport(projects as any, articles as any);
  }, [projects, articles]);

  // Generate SEO Alerts
  const alerts = useMemo(() => {
    const allItems: SEOContentItem[] = [
      ...report.topContent,
      ...report.worstContent,
    ];
    return detectAllAlerts(allItems);
  }, [report]);

  // Handle resolve alert item
  const handleResolveAlert = (alertType: string, itemId: string) => {
    resolveAlertItem(alertType as any, itemId);
    setForceRender((prev) => prev + 1);
  };

  // Handle unresolve alert item
  const handleUnresolveAlert = (alertType: string, itemId: string) => {
    unresolveAlertItem(alertType as any, itemId);
    setForceRender((prev) => prev + 1);
  };

  // Handle clear all resolved alerts
  const handleClearAllResolved = () => {
    clearAllResolvedAlerts();
    setForceRender((prev) => prev + 1);
  };

  const [, setForceRender] = useState(0);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const totalArticles = articles.length;
    const totalServices = services.length;

    const seoConfiguredProjects = projects.filter(
      (project) =>
        project.content.en.seo.title &&
        project.content.en.seo.title.length > 0 &&
        project.content.en.seo.description &&
        project.content.en.seo.description.length > 0
    ).length;

    const seoConfiguredArticles = articles.filter(
      (article) =>
        article.content.en.seo.title &&
        article.content.en.seo.title.length > 0 &&
        article.content.en.seo.description &&
        article.content.en.seo.description.length > 0
    ).length;

    // Service SEO statistics
    const seoCompletedServices = services.filter(
      (service) =>
        service.content.en.seo.title &&
        service.content.en.seo.title.length > 0 &&
        service.content.en.seo.description &&
        service.content.en.seo.description.length > 0
    ).length;

    const seoIncompleteServices = totalServices - seoCompletedServices;

    const serviceSEOScores = services.map((s) => calculateSEOConfigScore(s.content.en.seo || {}));
    const avgServiceSEOScore =
      serviceSEOScores.length > 0
        ? Math.round(serviceSEOScores.reduce((a, b) => a + b, 0) / serviceSEOScores.length)
        : 0;

    const allSEOScores = [
      ...projects.map((p) => calculateSEOConfigScore(p.content.en.seo || {})),
      ...articles.map((a) => calculateSEOConfigScore(a.content.en.seo || {})),
      ...services.map((s) => calculateSEOConfigScore(s.content.en.seo || {})),
    ];
    const avgSEOScore =
      allSEOScores.length > 0
        ? Math.round(allSEOScores.reduce((a, b) => a + b, 0) / allSEOScores.length)
        : 0;

    return {
      totalProjects,
      totalArticles,
      totalServices,
      seoConfiguredProjects,
      seoConfiguredArticles,
      seoCompletedServices,
      seoIncompleteServices,
      avgSEOScore,
      avgServiceSEOScore,
    };
  }, [projects, articles, services]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {language === 'ar' ? 'لوحة تحكم SEO' : 'SEO Dashboard'}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {language === 'ar'
              ? 'نظرة عامة على تحسين محركات البحث'
              : 'Overview of SEO performance and configuration'}
          </p>
        </div>
        <ExportButtons report={report} projects={projects} articles={articles} />
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Projects"
          titleAr="إجمالي المشاريع"
          value={stats.totalProjects}
          icon={<FolderKanban className="w-6 h-6 text-blue-400" />}
          color="bg-blue-500/20"
        />

        <DashboardCard
          title="Total Articles"
          titleAr="إجمالي المقالات"
          value={stats.totalArticles}
          icon={<FileText className="w-6 h-6 text-purple-400" />}
          color="bg-purple-500/20"
        />

        <DashboardCard
          title="SEO Configured Projects"
          titleAr="مشاريع مُعد لها SEO"
          value={stats.seoConfiguredProjects}
          icon={<Search className="w-6 h-6 text-green-400" />}
          color="bg-green-500/20"
          subtitle={`${Math.round((stats.seoConfiguredProjects / stats.totalProjects) * 100)}% of total`}
          subtitleAr={`${Math.round((stats.seoConfiguredProjects / stats.totalProjects) * 100)}% من الإجمالي`}
        />

        <DashboardCard
          title="SEO Configured Articles"
          titleAr="مقالات مُعد لها SEO"
          value={stats.seoConfiguredArticles}
          icon={<Search className="w-6 h-6 text-cyan-400" />}
          color="bg-cyan-500/20"
          subtitle={`${Math.round((stats.seoConfiguredArticles / stats.totalArticles) * 100)}% of total`}
          subtitleAr={`${Math.round((stats.seoConfiguredArticles / stats.totalArticles) * 100)}% من الإجمالي`}
        />
      </div>

      {/* Service SEO Overview - Phase 5D-3-1 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">
          {language === 'ar' ? 'نظرة عامة على SEO الخدمات' : 'Service SEO Overview'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Total Services"
            titleAr="إجمالي الخدمات"
            value={stats.totalServices}
            icon={<Briefcase className="w-6 h-6 text-orange-400" />}
            color="bg-orange-500/20"
          />

          <DashboardCard
            title="SEO Completed Services"
            titleAr="خدمات مكتملة SEO"
            value={stats.seoCompletedServices}
            icon={<CheckCircle className="w-6 h-6 text-green-400" />}
            color="bg-green-500/20"
            subtitle={`${stats.totalServices > 0 ? Math.round((stats.seoCompletedServices / stats.totalServices) * 100) : 0}% of total`}
            subtitleAr={`${stats.totalServices > 0 ? Math.round((stats.seoCompletedServices / stats.totalServices) * 100) : 0}% من الإجمالي`}
          />

          <DashboardCard
            title="SEO Incomplete Services"
            titleAr="خدمات غير مكتملة SEO"
            value={stats.seoIncompleteServices}
            icon={<AlertCircle className="w-6 h-6 text-amber-400" />}
            color="bg-amber-500/20"
            subtitle={`${stats.totalServices > 0 ? Math.round((stats.seoIncompleteServices / stats.totalServices) * 100) : 0}% needs improvement`}
            subtitleAr={`${stats.totalServices > 0 ? Math.round((stats.seoIncompleteServices / stats.totalServices) * 100) : 0}% يحتاج تحسين`}
          />

          <DashboardCard
            title="Average SEO Score"
            titleAr="متوسط درجة SEO"
            value={`${stats.avgServiceSEOScore}%`}
            icon={<Target className="w-6 h-6 text-purple-400" />}
            color="bg-purple-500/20"
          />
        </div>
      </div>

      {/* Service SEO Summary Report Section - NEW */}
      <ServiceSEOSummaryReportSection services={services} />

      {/* Service SEO Analytics - Phase 5D-3-2 */}
      <ServiceSEOAnalyticsSection services={services} />

      {/* Service SEO Quick Fix Actions - NEW SECTION */}
      <ServiceSEOQuickFixSection
        services={services}
        onUpdateService={updateServiceContent}
      />

      {/* Service SEO Insights - Phase 5D-3-3-A */}
      <ServiceSEOInsightsSection services={services} />

      {/* SEO Score Average Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SEOScoreCard
          title="SEO Score Average"
          titleAr="متوسط درجة SEO"
          score={stats.avgSEOScore}
          configured={stats.seoConfiguredProjects + stats.seoConfiguredArticles + stats.seoCompletedServices}
          total={stats.totalProjects + stats.totalArticles + stats.totalServices}
        />

        {/* Service SEO Summary Card - Phase 5D-3-1 */}
        <ServiceSEOSummaryCard services={services} />

        {/* Additional Stats Card */}
        <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
          <h3 className="text-lg font-semibold text-white mb-6 text-start rtl:text-end">
            {language === 'ar' ? 'إحصائيات SEO' : 'SEO Statistics'}
          </h3>

          <div className="space-y-4">
            <div className={`flex items-center justify-between p-4 bg-white/5 rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-gray-300">
                  {language === 'ar' ? 'مشاريع بدون SEO' : 'Projects Without SEO'}
                </span>
              </div>
              <span className="text-xl font-bold text-amber-400">
                {stats.totalProjects - stats.seoConfiguredProjects}
              </span>
            </div>

            <div className={`flex items-center justify-between p-4 bg-white/5 rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-gray-300">
                  {language === 'ar' ? 'مقالات بدون SEO' : 'Articles Without SEO'}
                </span>
              </div>
              <span className="text-xl font-bold text-amber-400">
                {stats.totalArticles - stats.seoConfiguredArticles}
              </span>
            </div>

            <div className={`flex items-center justify-between p-4 bg-white/5 rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-gray-300">
                  {language === 'ar' ? 'تغطية SEO' : 'SEO Coverage'}
                </span>
              </div>
              <span className="text-xl font-bold text-green-400">
                {Math.round(
                  ((stats.seoConfiguredProjects + stats.seoConfiguredArticles) /
                    (stats.totalProjects + stats.totalArticles)) *
                    100
                )}%
              </span>
            </div>

            <div className={`flex items-center justify-between p-4 bg-white/5 rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-gray-300">
                  {language === 'ar' ? 'الأفضل أداءً' : 'Best Performers'}
                </span>
              </div>
              <span className="text-xl font-bold text-purple-400">
                {stats.seoConfiguredProjects + stats.seoConfiguredArticles}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Alerts Section */}
      <SEOAlertsWidget
        alerts={alerts}
        onResolve={handleResolveAlert}
        onUnresolve={handleUnresolveAlert}
        onClearAll={handleClearAllResolved}
      />

      {/* SEO Reports Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white">
          {language === 'ar' ? 'تقارير SEO' : 'SEO Reports'}
        </h2>

        {/* Top and Worst Content Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopSEOContentReport items={report.topContent} maxItems={10} />
          <WorstSEOContentReport items={report.worstContent} maxItems={10} />
        </div>

        {/* SEO Issues Report */}
        <SEOIssuesReport issues={report.issues} />
      </div>

      {/* NEW SECTIONS - Phase 4F-F4 */}

      {/* Keyword Gap Analysis Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white">
          {language === 'ar' ? 'تحليل المحتوى والكلمات المفتاحية' : 'Content & Keyword Analysis'}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <KeywordGapAnalysis projects={projects} articles={articles} />
          <ContentImprovementSuggestions projects={projects} articles={articles} />
        </div>
      </div>

      {/* Internal Links Analysis Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white">
          {language === 'ar' ? 'تحليل الروابط الداخلية' : 'Internal Links Analysis'}
        </h2>
        <InternalLinksAnalysis projects={projects} articles={articles} />
      </div>

      {/* SEO PERFORMANCE TRENDS - Phase 4F-F5 */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white">
          {language === 'ar' ? 'اتجاهات أداء SEO' : 'SEO Performance Trends'}
        </h2>
        <SEOTrendsSection projects={projects} articles={articles} />
      </div>

      {/* SEO AUTOMATION RULES - Phase 4F-F6 */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white">
          {language === 'ar' ? 'أتمتة SEO' : 'SEO Automation'}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AutomationRulesPanel projects={projects} articles={articles} />
          <AutomationActivityLog onClearHistory={() => setForceRender((prev) => prev + 1)} />
        </div>
      </div>

      {/* SEO HEALTH MONITORING - Phase 4F-F7 */}
      <SEOHealthMonitorSection projects={projects} articles={articles} />

      {/* SEO COMMAND CENTER - Phase 4F-F8 */}
      <SEOCommandCenterSection projects={projects} articles={articles} />
    </div>
  );
};

// =====================================================
// SEO TRENDS SECTION - Phase 4F-F5
// =====================================================

interface SEOTrendsSectionProps {
  projects: any[];
  articles: any[];
}

const SEOTrendsSection: React.FC<SEOTrendsSectionProps> = ({ projects, articles }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // Take performance snapshot
  const snapshot = useMemo(() => {
    return SEOTrendsEngine.takePerformanceSnapshot(projects, articles);
  }, [projects, articles]);

  // Generate trend report
  const trendReport = useMemo(() => {
    return SEOTrendsEngine.generateTrendReport(selectedPeriod, projects, articles);
  }, [selectedPeriod, projects, articles]);

  // Load trend data for charts
  const trendData = useMemo(() => {
    const days = selectedPeriod === 'daily' ? 1 : selectedPeriod === 'weekly' ? 7 : 30;
    return SEOTrendsEngine.getTrendsForPeriod(days);
  }, [selectedPeriod]);

  return (
    <div className="space-y-6">
      {/* Trend Report Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedPeriod('daily')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              selectedPeriod === 'daily'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            <Calendar className="w-4 h-4" />
            {language === 'ar' ? 'يومي' : 'Daily'}
          </button>
          <button
            onClick={() => setSelectedPeriod('weekly')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              selectedPeriod === 'weekly'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            {language === 'ar' ? 'أسبوعي' : 'Weekly'}
          </button>
          <button
            onClick={() => setSelectedPeriod('monthly')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              selectedPeriod === 'monthly'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            <CalendarRange className="w-4 h-4" />
            {language === 'ar' ? 'شهري' : 'Monthly'}
          </button>
        </div>
        <button
          onClick={() => {
            const data = SEOTrendsEngine.exportTrendData();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `seo-trends-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-xl transition-all"
        >
          <Download className="w-4 h-4" />
          {language === 'ar' ? 'تصدير البيانات' : 'Export Data'}
        </button>
      </div>

      {/* Trend Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <TrendSummaryCard
          title={language === 'ar' ? 'تغير المتوسط' : 'Avg Score Change'}
          value={`${trendReport.summary.avgScoreChange > 0 ? '+' : ''}${trendReport.summary.avgScoreChange}%`}
          change={trendReport.summary.avgScoreChange}
          icon={<LineChart className="w-5 h-5" />}
        />
        <TrendSummaryCard
          title={language === 'ar' ? 'تحسينات' : 'Improvements'}
          value={trendReport.summary.totalImprovements.toString()}
          change={trendReport.summary.totalImprovements}
          positive
          icon={<ArrowUp className="w-5 h-5" />}
        />
        <TrendSummaryCard
          title={language === 'ar' ? 'تراجعات' : 'Regressions'}
          value={trendReport.summary.totalRegressions.toString()}
          change={trendReport.summary.totalRegressions}
          negative
          icon={<ArrowDown className="w-5 h-5" />}
        />
        <TrendSummaryCard
          title={language === 'ar' ? 'مشاكل جديدة' : 'New Issues'}
          value={trendReport.summary.newIssues.toString()}
          change={trendReport.summary.newIssues}
          negative
          icon={<AlertTriangle className="w-5 h-5" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SEOScoreTrendChart trendData={trendData} />
        <ScoreDistributionChart trendData={trendData} />
      </div>

      {/* Improvements vs Regressions Chart */}
      <ImprovementsChart trendData={trendData} />

      {/* Top Improvers & Decliners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopMoversList
          title={language === 'ar' ? 'أفضل المحسنين' : 'Top Improvers'}
          items={trendReport.topImprovers}
          type="improver"
        />
        <TopMoversList
          title={language === 'ar' ? 'أكثر التراجعات' : 'Top Decliners'}
          items={trendReport.topDecliners}
          type="decliner"
        />
      </div>

      {/* Recommendations */}
      <RecommendationsCard recommendations={trendReport.recommendations} />

      {/* New Content Added */}
      {trendReport.contentAdded.length > 0 && (
        <NewContentCard content={trendReport.contentAdded} />
      )}
    </div>
  );
};

// =====================================================
// TREND SUMMARY CARD COMPONENT
// =====================================================

interface TrendSummaryCardProps {
  title: string;
  value: string;
  change: number;
  positive?: boolean;
  negative?: boolean;
  icon: React.ReactNode;
}

const TrendSummaryCard: React.FC<TrendSummaryCardProps> = ({
  title,
  value,
  change,
  positive,
  negative,
  icon,
}) => {
  const getColorClass = () => {
    if (positive) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (negative) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (change > 0) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (change < 0) return 'bg-red-500/20 text-red-400 border-red-500/30';
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <div className={`rounded-2xl p-4 border ${getColorClass()}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">{title}</span>
        {icon}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <div className="flex items-center gap-1 mt-1">
        {change > 0 ? (
          <ArrowUp className="w-3 h-3 text-green-400" />
        ) : change < 0 ? (
          <ArrowDown className="w-3 h-3 text-red-400" />
        ) : (
          <Minus className="w-3 h-3 text-gray-400" />
        )}
        <span className={`text-xs ${change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-gray-500'}`}>
          {Math.abs(change)} {change === 1 ? 'item' : 'items'}
        </span>
      </div>
    </div>
  );
};

// =====================================================
// SEO SCORE TREND CHART COMPONENT
// =====================================================

interface SEOScoreTrendChartProps {
  trendData: SEOTrendDataPoint[];
}

const SEOScoreTrendChart: React.FC<SEOScoreTrendChartProps> = ({ trendData }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  if (trendData.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <LineChart className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white text-start rtl:text-end">
            {language === 'ar' ? 'اتجاه درجة SEO' : 'SEO Score Trend'}
          </h3>
        </div>
        <div className="flex items-center justify-center py-12">
          <Activity className="w-12 h-12 text-gray-500" />
        </div>
        <p className="text-center text-gray-500">
          {language === 'ar' ? 'لا توجد بيانات كافية بعد' : 'Not enough data yet'}
        </p>
      </div>
    );
  }

  // Calculate chart dimensions
  const maxScore = 100;
  const chartHeight = 200;
  const padding = 20;

  // Create SVG path for the line
  const points = trendData.map((d, i) => {
    const x = padding + (i / Math.max(trendData.length - 1, 1)) * (400 - 2 * padding);
    const y = chartHeight - padding - (d.avgScore / maxScore) * (chartHeight - 2 * padding);
    return { x, y, data: d };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  // Create area path
  const areaPathD = `${pathD} L ${points[points.length - 1]?.x || 0} ${chartHeight - padding} L ${points[0]?.x || 0} ${chartHeight - padding} Z`;

  return (
    <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <LineChart className="w-5 h-5 text-blue-400" />
        </div>
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h3 className="text-lg font-semibold text-white">
            {language === 'ar' ? 'اتجاه درجة SEO' : 'SEO Score Trend'}
          </h3>
          <p className="text-xs text-gray-500">
            {language === 'ar' ? 'متوسط الدرجات عبر الوقت' : 'Average scores over time'}
          </p>
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 400 ${chartHeight}`} className="w-full h-auto">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((val) => {
            const y = chartHeight - padding - (val / maxScore) * (chartHeight - 2 * padding);
            return (
              <g key={val}>
                <line
                  x1={padding}
                  y1={y}
                  x2={400 - padding}
                  y2={y}
                  stroke="rgba(255,255,255,0.1)"
                  strokeDasharray="4,4"
                />
                <text
                  x={padding - 8}
                  y={y + 4}
                  fill="rgba(255,255,255,0.5)"
                  fontSize="10"
                  textAnchor="end"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path d={areaPathD} fill="url(#scoreGradient)" />

          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#3b82f6"
              stroke="white"
              strokeWidth="2"
            />
          ))}

          {/* Gradient for line */}
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between mt-2 px-4">
          {trendData.slice(-5).map((d, i) => (
            <span key={i} className="text-xs text-gray-500">
              {d.date.slice(5)}
            </span>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-xs text-gray-400">
            {language === 'ar' ? 'متوسط درجة SEO' : 'Avg SEO Score'}
          </span>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// SCORE DISTRIBUTION CHART COMPONENT
// =====================================================

interface ScoreDistributionChartProps {
  trendData: SEOTrendDataPoint[];
}

const ScoreDistributionChart: React.FC<ScoreDistributionChartProps> = ({ trendData }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  // Aggregate distribution from trend data
  const latestData = trendData[trendData.length - 1];

  const distribution = latestData?.scoreDistribution || {
    excellent: 0,
    good: 0,
    fair: 0,
    poor: 0,
  };

  const total = distribution.excellent + distribution.good + distribution.fair + distribution.poor;

  const categories = [
    { key: 'excellent', label: language === 'ar' ? 'ممتاز' : 'Excellent', color: 'bg-green-500', threshold: '80-100' },
    { key: 'good', label: language === 'ar' ? 'جيد جداً' : 'Good', color: 'bg-blue-500', threshold: '60-79' },
    { key: 'fair', label: language === 'ar' ? 'مقبول' : 'Fair', color: 'bg-amber-500', threshold: '40-59' },
    { key: 'poor', label: language === 'ar' ? 'يحتاج تحسين' : 'Needs Work', color: 'bg-red-500', threshold: '0-39' },
  ];

  return (
    <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
          <PieChart className="w-5 h-5 text-purple-400" />
        </div>
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h3 className="text-lg font-semibold text-white">
            {language === 'ar' ? 'توزيع الدرجات' : 'Score Distribution'}
          </h3>
          <p className="text-xs text-gray-500">
            {language === 'ar' ? 'حالة المحتوى الحالية' : 'Current content status'}
          </p>
        </div>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const count = distribution[cat.key as keyof typeof distribution] || 0;
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <div key={cat.key} className={isRTL ? 'text-right' : 'text-left'}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                  <span className="text-sm text-gray-300">{cat.label}</span>
                  <span className="text-xs text-gray-500">({cat.threshold})</span>
                </div>
                <span className="text-sm font-medium text-white">
                  {count} ({percentage}%)
                </span>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${cat.color} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">
            {language === 'ar' ? 'إجمالي المحتوى' : 'Total Content'}
          </span>
          <span className="text-lg font-bold text-white">{total}</span>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// IMPROVEMENTS CHART COMPONENT
// =====================================================

interface ImprovementsChartProps {
  trendData: SEOTrendDataPoint[];
}

const ImprovementsChart: React.FC<ImprovementsChartProps> = ({ trendData }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  if (trendData.length === 0) {
    return null;
  }

  const chartHeight = 150;
  const padding = 20;
  const chartWidth = 400;

  // Calculate improvements vs regressions
  const improvements = trendData.map((d) => d.improvementsCount);
  const regressions = trendData.map((d) => d.regressionsCount);
  const maxValue = Math.max(...improvements, ...regressions, 1);

  const improvementPoints = trendData.map((d, i) => {
    const x = padding + (i / Math.max(trendData.length - 1, 1)) * (chartWidth - 2 * padding);
    const y = chartHeight - padding - (d.improvementsCount / maxValue) * (chartHeight - 2 * padding);
    return { x, y };
  });

  const regressionPoints = trendData.map((d, i) => {
    const x = padding + (i / Math.max(trendData.length - 1, 1)) * (chartWidth - 2 * padding);
    const y = chartHeight - padding - (d.regressionsCount / maxValue) * (chartHeight - 2 * padding);
    return { x, y };
  });

  const improvementPath = improvementPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const regressionPath = regressionPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const totalImprovements = improvements.reduce((a, b) => a + b, 0);
  const totalRegressions = regressions.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="text-lg font-semibold text-white">
              {language === 'ar' ? 'التحسينات مقابل التراجعات' : 'Improvements vs Regressions'}
            </h3>
            <p className="text-xs text-gray-500">
              {language === 'ar' ? 'تتبع التغييرات عبر الوقت' : 'Track changes over time'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-400">
              {language === 'ar' ? 'تحسينات' : 'Improvements'}: {totalImprovements}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm text-gray-400">
              {language === 'ar' ? 'تراجعات' : 'Regressions'}: {totalRegressions}
            </span>
          </div>
        </div>
      </div>

      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((val) => {
          const y = chartHeight - padding - (val * (chartHeight - 2 * padding));
          return (
            <line
              key={val}
              x1={padding}
              y1={y}
              x2={chartWidth - padding}
              y2={y}
              stroke="rgba(255,255,255,0.1)"
              strokeDasharray="4,4"
            />
          );
        })}

        {/* Improvements line */}
        <path
          d={improvementPath}
          fill="none"
          stroke="#22c55e"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Regressions line */}
        <path
          d={regressionPath}
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4,4"
        />

        {/* Data points */}
        {improvementPoints.map((p, i) => (
          <circle key={`imp-${i}`} cx={p.x} cy={p.y} r="3" fill="#22c55e" />
        ))}
        {regressionPoints.map((p, i) => (
          <circle key={`reg-${i}`} cx={p.x} cy={p.y} r="3" fill="#ef4444" />
        ))}
      </svg>

      {/* X-axis labels */}
      <div className="flex justify-between mt-2 px-4">
        {trendData.slice(-5).map((d, i) => (
          <span key={i} className="text-xs text-gray-500">
            {d.date.slice(5)}
          </span>
        ))}
      </div>
    </div>
  );
};

// =====================================================
// TOP MOVERS LIST COMPONENT
// =====================================================

interface TopMoversListProps {
  title: string;
  items: TrendReport['topImprovers'] | TrendReport['topDecliners'];
  type: 'improver' | 'decliner';
}

const TopMoversList: React.FC<TopMoversListProps> = ({ title, items, type }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  if (items.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            type === 'improver' ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            {type === 'improver' ? (
              <ArrowUp className={`w-5 h-5 text-green-400`} />
            ) : (
              <ArrowDown className={`w-5 h-5 text-red-400`} />
            )}
          </div>
          <h3 className="text-lg font-semibold text-white text-start rtl:text-end">{title}</h3>
        </div>
        <p className="text-gray-500 text-center py-8">
          {language === 'ar' ? 'لا توجد بيانات' : 'No data available'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          type === 'improver' ? 'bg-green-500/20' : 'bg-red-500/20'
        }`}>
          {type === 'improver' ? (
            <ArrowUp className={`w-5 h-5 text-green-400`} />
          ) : (
            <ArrowDown className={`w-5 h-5 text-red-400`} />
          )}
        </div>
        <h3 className="text-lg font-semibold text-white text-start rtl:text-end">{title}</h3>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              type === 'improver' ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              <span className={`text-sm font-bold ${
                type === 'improver' ? 'text-green-400' : 'text-red-400'
              }`}>
                #{index + 1}
              </span>
            </div>
            <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
              <p className="text-white font-medium truncate">{item.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  item.type === 'project' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {item.type === 'project'
                    ? language === 'ar' ? 'مشروع' : 'Project'
                    : language === 'ar' ? 'مقال' : 'Article'}
                </span>
                <span className="text-xs text-gray-500">
                  {item.previousScore}% → {item.currentScore}%
                </span>
              </div>
            </div>
            <div className={`flex items-center gap-1 ${
              type === 'improver' ? 'text-green-400' : 'text-red-400'
            }`}>
              {type === 'improver' ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
              <span className="text-lg font-bold">
                {type === 'improver' ? '+' : ''}{item.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =====================================================
// RECOMMENDATIONS CARD COMPONENT
// =====================================================

interface RecommendationsCardProps {
  recommendations: string[];
}

const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ recommendations }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-cyan-400" />
        </div>
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h3 className="text-lg font-semibold text-white">
            {language === 'ar' ? 'التوصيات' : 'Recommendations'}
          </h3>
          <p className="text-xs text-gray-500">
            {language === 'ar' ? 'إرشادات لتحسين أداء SEO' : 'Guidance for improving SEO performance'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-3 bg-white/5 rounded-xl ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-cyan-400 font-medium">{index + 1}</span>
            </div>
            <p className="text-gray-300 text-sm">{rec}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// =====================================================
// NEW CONTENT CARD COMPONENT
// =====================================================

interface NewContentCardProps {
  content: TrendReport['contentAdded'];
}

const NewContentCard: React.FC<NewContentCardProps> = ({ content }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
          <Plus className="w-5 h-5 text-violet-400" />
        </div>
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h3 className="text-lg font-semibold text-white">
            {language === 'ar' ? 'محتوى جديد' : 'New Content'}
          </h3>
          <p className="text-xs text-gray-500">
            {language === 'ar' ? 'محتوى تمت إضافته حديثاً' : 'Content added recently'}
          </p>
        </div>
        <span className="ml-auto text-sm text-violet-400">
          {content.length} {language === 'ar' ? 'عنصر' : 'items'}
        </span>
      </div>

      <div className="space-y-2">
        {content.slice(0, 5).map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 p-3 bg-white/5 rounded-xl ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
          >
            {item.type === 'project' ? (
              <FolderKanban className="w-4 h-4 text-blue-400" />
            ) : (
              <FileText className="w-4 h-4 text-purple-400" />
            )}
            <span className="text-white text-sm truncate flex-1">{item.title}</span>
            <span className={`text-sm font-medium ${
              item.score >= 80 ? 'text-green-400' :
              item.score >= 60 ? 'text-blue-400' :
              item.score >= 40 ? 'text-amber-400' : 'text-red-400'
            }`}>
              {item.score}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// =====================================================
// AUTOMATION RULES PANEL - Phase 4F-F6
// =====================================================

interface AutomationRulesPanelProps {
  projects: any[];
  articles: any[];
}

const AutomationRulesPanel: React.FC<AutomationRulesPanelProps> = ({ projects, articles }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [runningRuleId, setRunningRuleId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Initialize rules on mount
  useEffect(() => {
    const initializedRules = initializeAutomationRules();
    setRules(initializedRules);
  }, [refreshKey]);

  // Handle toggle rule enabled
  const handleToggleRule = (ruleId: string, enabled: boolean) => {
    toggleRuleEnabled(ruleId, enabled);
    setRefreshKey((prev) => prev + 1);
  };

  // Handle run rule
  const handleRunRule = async (ruleId: string) => {
    setRunningRuleId(ruleId);

    // Create SEO content items from projects and articles
    const contentItems: SEOContentItem[] = [
      ...projects.map((p) => ({
        id: p.id,
        type: 'project' as const,
        title: p.content.en.title || p.name,
        slug: p.content.en.slug || p.name.toLowerCase().replace(/\s+/g, '-'),
        seo: {
          title: p.content.en.seo?.title,
          description: p.content.en.seo?.description,
          focusKeyword: p.content.en.seo?.focusKeyword,
          openGraph: p.content.en.seo?.ogTitle ? {
            title: p.content.en.seo.ogTitle,
            description: p.content.en.seo.ogDescription,
            image: p.content.en.seo.ogImage,
          } : undefined,
        },
        score: calculateSEOConfigScore(p.content.en.seo || {}),
        issues: [],
      })),
      ...articles.map((a) => ({
        id: a.id,
        type: 'article' as const,
        title: a.content.en.title || a.title,
        slug: a.content.en.slug || a.title.toLowerCase().replace(/\s+/g, '-'),
        seo: {
          title: a.content.en.seo?.title,
          description: a.content.en.seo?.description,
          focusKeyword: a.content.en.seo?.focusKeyword,
          openGraph: a.content.en.seo?.ogTitle ? {
            title: a.content.en.seo.ogTitle,
            description: a.content.en.seo.ogDescription,
            image: a.content.en.seo.ogImage,
          } : undefined,
        },
        score: calculateSEOConfigScore(a.content.en.seo || {}),
        issues: [],
      })),
    ];

    // Execute the rule
    executeSpecificRule(ruleId, contentItems);
    setRefreshKey((prev) => prev + 1);

    // Clear running state after a short delay
    setTimeout(() => {
      setRunningRuleId(null);
    }, 1000);
  };

  // Count totals
  const totalSuccessCount = rules.reduce((sum, rule) => sum + rule.successCount, 0);
  const totalExecutions = rules.reduce((sum, rule) => sum + rule.successCount + rule.failureCount, 0);
  const activeRulesCount = rules.filter((r) => r.enabled).length;

  // Format last execution time
  const formatLastExecution = (dateStr?: string): string => {
    if (!dateStr) return language === 'ar' ? 'لم يتم التنفيذ' : 'Never run';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return language === 'ar' ? 'الآن' : 'Just now';
    if (diffMins < 60) return `${diffMins}${language === 'ar' ? ' دقيقة' : 'min ago'}`;
    if (diffHours < 24) return `${diffHours}${language === 'ar' ? ' ساعة' : 'h ago'}`;
    return `${diffDays}${language === 'ar' ? ' يوم' : 'd ago'}`;
  };

  return (
    <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div
        className={`flex items-center justify-between p-4 bg-white/5 cursor-pointer ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
            <Cog className="w-5 h-5 text-orange-400" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="text-lg font-semibold text-white">
              {language === 'ar' ? 'قواعد الأتمتة' : 'Automation Rules'}
            </h3>
            <p className="text-xs text-gray-500">
              {language === 'ar' ? 'إصلاح تلقائي لمشاكل SEO' : 'Auto-fix SEO issues'}
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-sm px-3 py-1 rounded-full bg-green-500/20 text-green-400">
            {activeRulesCount} {language === 'ar' ? 'نشط' : 'active'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Stats Bar */}
      <div
        className={`flex items-center gap-6 px-4 py-3 border-t border-white/10 ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
      >
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-sm text-gray-400">
            {language === 'ar' ? 'نجاح' : 'Success' }: <span className="text-green-400 font-medium">{totalSuccessCount}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-gray-400">
            {language === 'ar' ? 'إجمالي' : 'Total' }: <span className="text-blue-400 font-medium">{totalExecutions}</span>
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-white/10 p-4">
          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={`flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all ${
                  isRTL ? 'flex-row-reverse' : ''
                }`}
              >
                {/* Enable/Disable Toggle */}
                <button
                  onClick={() => handleToggleRule(rule.id, !rule.enabled)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                    rule.enabled
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {rule.enabled ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>

                {/* Rule Info */}
                <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <p className="text-white font-medium">
                    {language === 'ar' ? rule.nameAr : rule.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      rule.action === 'auto_fix'
                        ? 'bg-green-500/20 text-green-400'
                        : rule.action === 'notify'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {getActionTypeLabel(rule.action, language)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {language === 'ar' ? 'النوع' : 'Type' }: {getRuleTypeLabel(rule.type, language)}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">{language === 'ar' ? 'آخر تنفيذ' : 'Last Run'}</p>
                    <p className="text-sm text-gray-400">
                      {formatLastExecution(rule.lastExecution)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">{language === 'ar' ? 'نجاح' : 'Success'}</p>
                    <p className="text-lg font-bold text-green-400">{rule.successCount}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">{language === 'ar' ? 'فشل' : 'Failed'}</p>
                    <p className="text-lg font-bold text-red-400">{rule.failureCount}</p>
                  </div>
                </div>

                {/* Run Button */}
                <button
                  onClick={() => handleRunRule(rule.id)}
                  disabled={runningRuleId === rule.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    runningRuleId === rule.id
                      ? 'bg-orange-500/30 text-orange-400 cursor-wait'
                      : 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400'
                  }`}
                >
                  {runningRuleId === rule.id ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      {language === 'ar' ? 'جاري...' : 'Running...'}
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      {language === 'ar' ? 'تشغيل' : 'Run'}
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================
// AUTOMATION ACTIVITY LOG - Phase 4F-F6
// =====================================================

interface AutomationActivityLogProps {
  onClearHistory: () => void;
}

const AutomationActivityLog: React.FC<AutomationActivityLogProps> = ({ onClearHistory }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [history, setHistory] = useState<AutomationHistoryEntry[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failed' | 'skipped'>('all');

  // Refresh history
  useEffect(() => {
    setHistory(getRecentHistory(100));
  }, [refreshKey]);

  // Handle clear history
  const handleClearHistory = () => {
    clearAutomationHistory();
    setRefreshKey((prev) => prev + 1);
    onClearHistory();
  };

  // Filter history
  const filteredHistory = filterStatus === 'all'
    ? history
    : history.filter((h) => h.status === filterStatus);

  // Format time
  const formatTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format date
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Group history by date
  const groupedHistory = useMemo(() => {
    const groups: { [key: string]: AutomationHistoryEntry[] } = {};
    filteredHistory.forEach((entry) => {
      const dateKey = entry.executedAt.split('T')[0];
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(entry);
    });
    return groups;
  }, [filteredHistory]);

  return (
    <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div
        className={`flex items-center justify-between p-4 bg-white/5 ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
      >
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-cyan-400" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="text-lg font-semibold text-white">
              {language === 'ar' ? 'سجل النشاط' : 'Activity Log'}
            </h3>
            <p className="text-xs text-gray-500">
              {language === 'ar' ? 'آخر العمليات المنفذة' : 'Recent automation executions'}
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-sm text-gray-400">
            {history.length} {language === 'ar' ? 'سجل' : 'entries'}
          </span>
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all text-sm"
          >
            <Trash2 className="w-4 h-4" />
            {language === 'ar' ? 'مسح' : 'Clear'}
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className={`flex items-center gap-2 px-4 py-3 border-t border-white/10 ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
      >
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
            filterStatus === 'all'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
          }`}
        >
          {language === 'ar' ? 'الكل' : 'All'}
        </button>
        <button
          onClick={() => setFilterStatus('success')}
          className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
            filterStatus === 'success'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
          }`}
        >
          {language === 'ar' ? 'نجاح' : 'Success'}
        </button>
        <button
          onClick={() => setFilterStatus('failed')}
          className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
            filterStatus === 'failed'
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
          }`}
        >
          {language === 'ar' ? 'فشل' : 'Failed'}
        </button>
        <button
          onClick={() => setFilterStatus('skipped')}
          className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
            filterStatus === 'skipped'
              ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
          }`}
        >
          {language === 'ar' ? 'تم التخطي' : 'Skipped'}
        </button>
      </div>

      {/* History List */}
      <div className="border-t border-white/10 max-h-96 overflow-y-auto">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Clock className="w-12 h-12 text-gray-500 mb-4" />
            <p className="text-gray-500">
              {language === 'ar' ? 'لا يوجد سجل نشاط' : 'No activity history'}
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {Object.entries(groupedHistory).map(([date, entries]) => (
              <div key={date}>
                {/* Date Header */}
                <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-400">{formatDate(date)}</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Entries for this date */}
                <div className="space-y-2">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className={`flex items-start gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all ${
                        isRTL ? 'flex-row-reverse' : ''
                      }`}
                    >
                      {/* Status Icon */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        entry.status === 'success'
                          ? 'bg-green-500/20 text-green-400'
                          : entry.status === 'failed'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {entry.status === 'success' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : entry.status === 'failed' ? (
                          <XCircle className="w-4 h-4" />
                        ) : (
                          <Minus className="w-4 h-4" />
                        )}
                      </div>

                      {/* Entry Info */}
                      <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-white font-medium truncate">{entry.ruleName}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBgColorClass(entry.status)} ${getStatusColorClass(entry.status)}`}>
                            {entry.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {entry.contentTitle} ({entry.contentType === 'project' ? language === 'ar' ? 'مشروع' : 'Project' : language === 'ar' ? 'مقال' : 'Article'})
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{entry.details}</p>
                      </div>

                      {/* Time and Duration */}
                      <div className={`text-right ${isRTL ? 'text-left' : 'text-right'}`}>
                        <p className="text-sm text-gray-400">{formatTime(entry.executedAt)}</p>
                        <p className="text-xs text-gray-500">{entry.duration}ms</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// =====================================================
// SEO HEALTH MONITOR SECTION - Phase 4F-F7
// =====================================================

interface SEOHealthMonitorSectionProps {
  projects: any[];
  articles: any[];
}

const SEOHealthMonitorSection: React.FC<SEOHealthMonitorSectionProps> = ({ projects, articles }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  // Perform health scan
  const scanResult = useMemo(() => {
    return SEOHealthMonitor.scan(projects, articles);
  }, [projects, articles]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">
        {language === 'ar' ? 'رصد صحة SEO' : 'SEO Health Monitoring'}
      </h2>

      {/* SEO Health Panel */}
      <SEOHealthPanel healthStatus={scanResult.healthStatus} />

      {/* SEO Health Issues Report */}
      <SEOHealthIssuesReport issues={scanResult.issues} worstPages={scanResult.worstPages} />
    </div>
  );
};

// =====================================================
// SEO HEALTH PANEL COMPONENT - Phase 4F-F7
// =====================================================

interface SEOHealthPanelProps {
  healthStatus: SEOHealthStatus;
}

const SEOHealthPanel: React.FC<SEOHealthPanelProps> = ({ healthStatus }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  // Get status color
  const getStatusColor = (status: SEOHealthStatus['status']) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'good':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'fair':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'poor':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  // Get status label
  const getStatusLabel = (status: SEOHealthStatus['status']) => {
    const labels: Record<SEOHealthStatus['status'], { en: string; ar: string }> = {
      excellent: { en: 'Excellent', ar: 'ممتاز' },
      good: { en: 'Good', ar: 'جيد' },
      fair: { en: 'Fair', ar: 'مقبول' },
      poor: { en: 'Poor', ar: 'ضعيف' },
    };
    return labels[status][language];
  };

  // Get trend icon
  const getTrendIcon = () => {
    switch (healthStatus.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  // Format last scanned time
  const formatLastScanned = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate circumference for circular progress
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (healthStatus.overallScore / 100) * circumference;

  return (
    <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
      <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Activity className="w-6 h-6 text-emerald-400" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="text-lg font-semibold text-white">
              {language === 'ar' ? 'لوحة صحة SEO' : 'SEO Health Panel'}
            </h3>
            <p className="text-xs text-gray-500">
              {language === 'ar' ? 'الحالة الصحية الشاملة لمحتواك' : 'Overall health status of your content'}
            </p>
          </div>
        </div>

        {/* Health Status Badge */}
        <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(healthStatus.status)}`}>
          {getStatusLabel(healthStatus.status)}
        </span>
      </div>

      {/* Main Score Display */}
      <div className="flex items-center justify-center mb-8">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="45"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              className="text-white/10"
            />
            <circle
              cx="80"
              cy="80"
              r="45"
              stroke="url(#healthScoreGradient)"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
                transition: 'stroke-dashoffset 1s ease-out',
              }}
            />
            <defs>
              <linearGradient
                id="healthScoreGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="rgb(34, 197, 94)" />
                <stop offset="50%" stopColor="rgb(59, 130, 246)" />
                <stop offset="100%" stopColor="rgb(168, 85, 247)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-white">{healthStatus.overallScore}%</span>
            <span className="text-xs text-gray-400">
              {language === 'ar' ? 'النتيجة الإجمالية' : 'Overall Score'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Critical Issues */}
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center mx-auto mb-2">
            <XCircle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400">{healthStatus.criticalIssuesCount}</p>
          <p className="text-xs text-gray-400">
            {language === 'ar' ? 'مشكلة حرجة' : 'Critical Issues'}
          </p>
        </div>

        {/* Warnings */}
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center mx-auto mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400">{healthStatus.warningsCount}</p>
          <p className="text-xs text-gray-400">
            {language === 'ar' ? 'تحذيرات' : 'Warnings'}
          </p>
        </div>

        {/* Healthy Pages */}
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-400">{healthStatus.healthyPagesCount}</p>
          <p className="text-xs text-gray-400">
            {language === 'ar' ? 'صفحة سليمة' : 'Healthy Pages'}
          </p>
        </div>

        {/* Total Scanned */}
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-400">{healthStatus.totalPagesScanned}</p>
          <p className="text-xs text-gray-400">
            {language === 'ar' ? 'إجمالي الصفحات' : 'Total Pages'}
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className={`flex items-center justify-between pt-4 border-t border-white/10 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-500">
            {language === 'ar' ? 'آخر مسح:' : 'Last scan:'} {formatLastScanned(healthStatus.lastScanned)}
          </span>
        </div>

        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-xs text-gray-500">
            {language === 'ar' ? 'الاتجاه:' : 'Trend:'}
          </span>
          {getTrendIcon()}
        </div>
      </div>
    </div>
  );
};

// =====================================================
// SEO HEALTH ISSUES REPORT COMPONENT - Phase 4F-F7
// =====================================================

interface SEOHealthIssuesReportProps {
  issues: SEOHealthIssue[];
  worstPages: SEOHealthPage[];
}

const SEOHealthIssuesReport: React.FC<SEOHealthIssuesReportProps> = ({ issues, worstPages }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [showWorstFirst, setShowWorstFirst] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  // Get issue type icon
  const getIssueIcon = (type: SEOHealthIssue['type']) => {
    switch (type) {
      case 'missing_title':
        return <FileText className="w-4 h-4" />;
      case 'missing_description':
        return <FileWarning className="w-4 h-4" />;
      case 'missing_keywords':
        return <KeyRound className="w-4 h-4" />;
      case 'missing_og':
        return <Globe className="w-4 h-4" />;
      case 'broken_links':
        return <Link2Off className="w-4 h-4" />;
      case 'low_score':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Get issue type label
  const getIssueTypeLabel = (type: SEOHealthIssue['type']) => {
    const labels: Record<SEOHealthIssue['type'], { en: string; ar: string }> = {
      missing_title: { en: 'Missing Titles', ar: 'عناوين مفقودة' },
      missing_description: { en: 'Missing Descriptions', ar: 'أوصاف مفقودة' },
      missing_keywords: { en: 'Missing Focus Keywords', ar: 'كلمات مفتاحية رئيسية مفقودة' },
      missing_og: { en: 'Missing OpenGraph Data', ar: 'بيانات OpenGraph مفقودة' },
      broken_links: { en: 'Broken Internal Links', ar: 'روابط داخلية معطلة' },
      low_score: { en: 'Low SEO Score Content', ar: 'محتوى بدرجة SEO منخفضة' },
    };
    return labels[type]?.[language] || type;
  };

  // Sort issues by count (worst first or best first)
  const sortedIssues = useMemo(() => {
    const sorted = [...issues].sort((a, b) => {
      // First sort by severity (critical first)
      if (a.severity !== b.severity) {
        return a.severity === 'critical' ? -1 : 1;
      }
      // Then by count
      return showWorstFirst ? b.count - a.count : a.count - b.count;
    });
    return sorted;
  }, [issues, showWorstFirst]);

  // Count totals
  const totalCritical = issues
    .filter((i) => i.severity === 'critical')
    .reduce((sum, i) => sum + i.count, 0);
  const totalWarnings = issues
    .filter((i) => i.severity === 'warning')
    .reduce((sum, i) => sum + i.count, 0);

  // Sort worst pages by score (lowest first)
  const sortedWorstPages = useMemo(() => {
    return [...worstPages].sort((a, b) => a.score - b.score);
  }, [worstPages]);

  if (issues.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
        <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              {language === 'ar' ? 'تقرير مشاكل SEO' : 'SEO Health Issues Report'}
            </h3>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <p className="text-lg text-green-400 font-medium">
              {language === 'ar' ? 'لا توجد مشاكل! 🎉' : 'No issues found! 🎉'}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {language === 'ar' ? 'جميع صفحاتك في حالة صحية ممتازة' : 'All your pages are in excellent health'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div
        className={`flex items-center justify-between p-4 bg-white/5 cursor-pointer ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="text-lg font-semibold text-white">
              {language === 'ar' ? 'تقرير مشاكل SEO' : 'SEO Health Issues Report'}
            </h3>
            <p className="text-xs text-gray-500">
              {language === 'ar' ? 'مشاكل تحتاج إلى انتباه' : 'Issues that need attention'}
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="flex items-center gap-2">
            <span className="text-sm px-2 py-1 rounded-full bg-red-500/20 text-red-400">
              {totalCritical} {language === 'ar' ? 'حرج' : 'Critical'}
            </span>
            <span className="text-sm px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">
              {totalWarnings} {language === 'ar' ? 'تحذير' : 'Warning'}
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-white/10">
          {/* Controls Bar */}
          <div
            className={`flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10 ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
          >
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showWorstFirst}
                onChange={(e) => setShowWorstFirst(e.target.checked)}
                className="w-4 h-4 rounded border-gray-500 text-blue-500 focus:ring-blue-500 bg-transparent"
              />
              <span className="text-sm text-gray-400">
                {language === 'ar' ? 'عرض أسوأ العناصر أولاً' : 'Show worst items first'}
              </span>
            </label>
            <span className="text-sm text-gray-400">
              {issues.length} {language === 'ar' ? 'نوع مشكلة' : 'issue types'}
            </span>
          </div>

          {/* Issues List */}
          <div className="max-h-96 overflow-y-auto">
            {sortedIssues.map((issue) => (
              <div
                key={issue.id}
                className={`border-b border-white/5 last:border-b-0 ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`flex items-center gap-4 p-4 hover:bg-white/5 transition-all cursor-pointer ${
                    isRTL ? 'flex-row-reverse' : ''
                  }`}
                  onClick={() => setSelectedIssue(selectedIssue === issue.id ? null : issue.id)}
                >
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      issue.severity === 'critical'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {getIssueIcon(issue.type)}
                  </div>

                  {/* Issue Info */}
                  <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <p className="text-white font-medium">
                      {getIssueTypeLabel(issue.type)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'ar'
                        ? `${issue.count} صفحة متأثرة`
                        : `${issue.count} pages affected`}
                    </p>
                  </div>

                  {/* Count */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xl font-bold ${
                        issue.severity === 'critical' ? 'text-red-400' : 'text-amber-400'
                      }`}
                    >
                      {issue.count}
                    </span>
                    {selectedIssue === issue.id ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details - Affected Pages */}
                {selectedIssue === issue.id && (
                  <div className="px-4 pb-4 bg-black/20">
                    <p className="text-sm text-gray-400 mb-3">
                      {language === 'ar' ? 'الصفحات المتأثرة:' : 'Affected Pages:'}
                    </p>
                    <div className="space-y-2">
                      {issue.affectedPages.slice(0, 10).map((page) => (
                        <div
                          key={page.id}
                          className={`flex items-center gap-3 p-3 bg-white/5 rounded-lg ${
                            isRTL ? 'flex-row-reverse' : ''
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                            {page.type === 'project' ? (
                              <FolderKanban className="w-4 h-4 text-blue-400" />
                            ) : (
                              <FileText className="w-4 h-4 text-purple-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm truncate">{page.title}</p>
                            <p className="text-xs text-gray-500">
                              {page.type === 'project'
                                ? language === 'ar'
                                  ? 'مشروع'
                                  : 'Project'
                                : language === 'ar'
                                ? 'مقال'
                                : 'Article'}
                            </p>
                          </div>
                          <span
                            className={`text-sm font-medium ${HealthScoreCalculator.getScoreColorClass(page.score)}`}
                          >
                            {page.score}%
                          </span>
                        </div>
                      ))}
                      {issue.affectedPages.length > 10 && (
                        <p className="text-xs text-gray-500 text-center py-2">
                          +{issue.affectedPages.length - 10}{' '}
                          {language === 'ar' ? 'صفحة أخرى' : 'more pages'}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Worst Pages Section */}
          {sortedWorstPages.length > 0 && (
            <div className="border-t border-white/10 p-4">
              <h4 className="text-sm font-medium text-white mb-3">
                {language === 'ar' ? 'الصفحات التي تحتاج تحسين' : 'Pages Needing Improvement'}
              </h4>
              <div className="space-y-2">
                {sortedWorstPages.slice(0, 5).map((page, index) => (
                  <div
                    key={page.id}
                    className={`flex items-center gap-3 p-3 bg-white/5 rounded-lg ${
                      isRTL ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        page.score >= 60
                          ? 'bg-green-500/20 text-green-400'
                          : page.score >= 40
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      <span className="text-sm font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{page.title}</p>
                      <p className="text-xs text-gray-500">
                        {page.type === 'project'
                          ? language === 'ar'
                            ? 'مشروع'
                            : 'Project'
                          : language === 'ar'
                          ? 'مقال'
                          : 'Article'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col items-end">
                        <span
                          className={`text-lg font-bold ${HealthScoreCalculator.getScoreColorClass(page.score)}`}
                        >
                          {page.score}%
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${HealthScoreCalculator.getScoreBgColorClass(page.score)} ${HealthScoreCalculator.getScoreColorClass(page.score)}`}
                        >
                          {HealthScoreCalculator.getScoreLabel(page.score, language)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// =====================================================
// SEO COMMAND CENTER SECTION - Phase 4F-F8
// =====================================================

interface SEOCommandCenterSectionProps {
  projects: any[];
  articles: any[];
}

const SEOCommandCenterSection: React.FC<SEOCommandCenterSectionProps> = ({ projects, articles }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [isLoading, setIsLoading] = useState(false);
  const [lastCommandResult, setLastCommandResult] = useState<CommandResult | null>(null);
  const [forceRender, setForceRender] = useState(0);

  // Get system summary from dashboard engine
  const systemSummary = useMemo(() => {
    return SEODashboardEngine.getDashboardData(projects, articles);
  }, [projects, articles, forceRender]);

  // Get all modules status
  const modulesStatus = useMemo(() => {
    return SEOSystemStatusMonitor.checkAllModulesStatus();
  }, [forceRender]);

  // Get activity feed
  const activityFeed = useMemo(() => {
    return SEOCommandActionsManager.getActivityFeed().slice(0, 20);
  }, [forceRender]);

  // Get command center state
  const commandCenterState = useMemo(() => {
    return SEOCommandActionsManager.getCommandCenterState();
  }, [forceRender]);

  // Execute command action
  const handleExecuteCommand = async (action: CommandActionType) => {
    setIsLoading(true);
    try {
      const result = await SEOCommandActionsManager.executeCommand(action, projects, articles);
      setLastCommandResult(result);
      setForceRender((prev) => prev + 1);
    } catch (error) {
      console.error('[SEOCommandCenter] Command execution error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get status icon component
  const getStatusIcon = (status: ModuleStatus) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'offline':
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  // Get status color
  const getStatusColor = (status: ModuleStatus) => {
    switch (status) {
      case 'online':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'offline':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
            <Activity className="w-6 h-6 text-purple-400" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h2 className="text-2xl font-bold text-white">
              {language === 'ar' ? 'مركز قيادة SEO' : 'SEO Command Center'}
            </h2>
            <p className="text-sm text-gray-400">
              {language === 'ar'
                ? 'الإدارة المركزية لجميع أنظمة SEO'
                : 'Central management for all SEO systems'}
            </p>
          </div>
        </div>
      </div>

      {/* A) System Overview */}
      <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
        <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">
            {language === 'ar' ? 'نظرة عامة على النظام' : 'System Overview'}
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Overall SEO Score */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Award className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-gray-400">
                {language === 'ar' ? 'درجة SEO الإجمالية' : 'Overall SEO Score'}
              </span>
            </div>
            <p className={`text-2xl font-bold ${SEODashboardEngine.getScoreColor(systemSummary.overallScore)}`}>
              {systemSummary.overallScore}%
            </p>
          </div>

          {/* Health Score */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-gray-400">
                {language === 'ar' ? 'درجة الصحة' : 'Health Score'}
              </span>
            </div>
            <p className={`text-2xl font-bold ${SEODashboardEngine.getScoreColor(systemSummary.healthScore)}`}>
              {systemSummary.healthScore}%
            </p>
          </div>

          {/* Active Alerts */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Bell className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-gray-400">
                {language === 'ar' ? 'التنبيهات النشطة' : 'Active Alerts'}
              </span>
            </div>
            <p className={`text-2xl font-bold ${systemSummary.activeAlerts > 0 ? 'text-amber-400' : 'text-green-400'}`}>
              {systemSummary.activeAlerts}
            </p>
          </div>

          {/* Automation Rules */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-gray-400">
                {language === 'ar' ? 'قواعد الأتمتة النشطة' : 'Active Automation Rules'}
              </span>
            </div>
            <p className="text-2xl font-bold text-cyan-400">
              {systemSummary.activeAutomationRules}
            </p>
          </div>

          {/* Keywords Tracked */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <KeyRound className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-400">
                {language === 'ar' ? 'كلمات المفتاح المتتبعة' : 'Keywords Tracked'}
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-400">
              {systemSummary.keywordsTracked}
            </p>
          </div>

          {/* Internal Links */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Link2 className="w-4 h-4 text-violet-400" />
              <span className="text-xs text-gray-400">
                {language === 'ar' ? 'الروابط الداخلية' : 'Internal Links'}
              </span>
            </div>
            <p className="text-2xl font-bold text-violet-400">
              {systemSummary.internalLinksCount}
            </p>
          </div>

          {/* Trends Status */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">
                {language === 'ar' ? 'حالة الاتجاهات' : 'Trends Status'}
              </span>
            </div>
            <p className={`text-2xl font-bold ${systemSummary.trendsStatus === 'active' ? 'text-green-400' : 'text-gray-400'}`}>
              {systemSummary.trendsStatus === 'active'
                ? language === 'ar' ? 'نشط' : 'Active'
                : language === 'ar' ? 'غير نشط' : 'Inactive'}
            </p>
          </div>

          {/* Healthy Pages */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">
                {language === 'ar' ? 'صفحات صحية' : 'Healthy Pages'}
              </span>
            </div>
            <p className="text-2xl font-bold text-green-400">
              {systemSummary.healthyPages}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* B) Modules Status Panel */}
        <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
          <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Settings className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              {language === 'ar' ? 'حالة الوحدات' : 'Modules Status'}
            </h3>
          </div>

          <div className="space-y-3">
            {modulesStatus.map((module) => (
              <div
                key={module.id}
                className={`flex items-center justify-between p-3 bg-white/5 rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {getStatusIcon(module.status)}
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <p className="text-white text-sm font-medium">
                      {language === 'ar' ? module.nameAr : module.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {language === 'ar' ? module.descriptionAr : module.description}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="flex items-center gap-2">
                    {module.stats.map((stat, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-white/5 rounded text-gray-400">
                        {language === 'ar' ? stat.labelAr : stat.label}: {stat.value}
                      </span>
                    ))}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(module.status)}`}>
                    {module.status === 'online'
                      ? language === 'ar' ? 'متصل' : 'Online'
                      : module.status === 'warning'
                      ? language === 'ar' ? 'تحذير' : 'Warning'
                      : module.status === 'error'
                      ? language === 'ar' ? 'خطأ' : 'Error'
                      : language === 'ar' ? 'غير متصل' : 'Offline'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* C) Quick Actions Panel */}
        <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
          <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleExecuteCommand('full_scan')}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl transition-all disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm">
                {language === 'ar' ? 'فحص SEO كامل' : 'Full SEO Scan'}
              </span>
            </button>

            <button
              onClick={() => handleExecuteCommand('generate_report')}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-xl transition-all disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm">
                {language === 'ar' ? 'إنشاء تقرير' : 'Generate Report'}
              </span>
            </button>

            <button
              onClick={() => handleExecuteCommand('health_check')}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl transition-all disabled:opacity-50"
            >
              <Activity className="w-4 h-4" />
              <span className="text-sm">
                {language === 'ar' ? 'فحص الصحة' : 'Health Check'}
              </span>
            </button>

            <button
              onClick={() => handleExecuteCommand('execute_automation')}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-xl transition-all disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm">
                {language === 'ar' ? 'تنفيذ الأتمتة' : 'Execute Automation'}
              </span>
            </button>

            <button
              onClick={() => handleExecuteCommand('refresh_trends')}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl transition-all disabled:opacity-50"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">
                {language === 'ar' ? 'تحديث الاتجاهات' : 'Refresh Trends'}
              </span>
            </button>

            <button
              onClick={() => handleExecuteCommand('analyze_links')}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-3 bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 rounded-xl transition-all disabled:opacity-50"
            >
              <Link2 className="w-4 h-4" />
              <span className="text-sm">
                {language === 'ar' ? 'تحليل الروابط' : 'Analyze Links'}
              </span>
            </button>
          </div>

          {/* Last Command Result */}
          {lastCommandResult && (
            <div className={`mt-4 p-3 rounded-xl ${lastCommandResult.success ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
              <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {lastCommandResult.success ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
                <p className={`text-sm font-medium ${lastCommandResult.success ? 'text-green-400' : 'text-red-400'}`}>
                  {language === 'ar' ? lastCommandResult.messageAr : lastCommandResult.message}
                </p>
              </div>
              <p className="text-xs text-gray-500">
                {language === 'ar' ? 'المدة' : 'Duration'}: {lastCommandResult.duration}ms
              </p>
            </div>
          )}

          {isLoading && (
            <div className="mt-4 flex items-center justify-center gap-2 text-cyan-400">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm">
                {language === 'ar' ? 'جاري التنفيذ...' : 'Executing...'}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* D) Activity Feed */}
        <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
          <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              {language === 'ar' ? 'سجل النشاط' : 'Activity Feed'}
            </h3>
          </div>

          {activityFeed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Activity className="w-12 h-12 text-gray-500 mb-2" />
              <p className="text-gray-500 text-sm">
                {language === 'ar' ? 'لا يوجد نشاط بعد' : 'No activity yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {activityFeed.map((entry) => (
                <div
                  key={entry.id}
                  className={`p-3 bg-white/5 rounded-xl ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className={`text-xs ${getActivitySeverityColor(entry.severity)}`}>
                      {entry.severity?.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(entry.timestamp, language)}
                    </span>
                  </div>
                  <p className="text-white text-sm font-medium">
                    {language === 'ar' ? entry.titleAr : entry.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {language === 'ar' ? entry.descriptionAr : entry.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* E) SEO System Summary */}
        <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
          <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <PieChart className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              {language === 'ar' ? 'ملخص نظام SEO' : 'SEO System Summary'}
            </h3>
          </div>

          <div className="space-y-4">
            {/* Critical Issues */}
            <div className={`flex items-center justify-between p-3 bg-red-500/10 rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="text-sm text-gray-300">
                  {language === 'ar' ? 'مشاكل حرجة' : 'Critical Issues'}
                </span>
              </div>
              <span className="text-xl font-bold text-red-400">{systemSummary.criticalIssues}</span>
            </div>

            {/* Warnings */}
            <div className={`flex items-center justify-between p-3 bg-amber-500/10 rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-gray-300">
                  {language === 'ar' ? 'تحذيرات' : 'Warnings'}
                </span>
              </div>
              <span className="text-xl font-bold text-amber-400">{systemSummary.warnings}</span>
            </div>

            {/* Healthy Pages */}
            <div className={`flex items-center justify-between p-3 bg-green-500/10 rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">
                  {language === 'ar' ? 'صفحات صحية' : 'Healthy Pages'}
                </span>
              </div>
              <span className="text-xl font-bold text-green-400">{systemSummary.healthyPages}</span>
            </div>

            {/* Top Performing Content */}
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Trophy className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">
                  {language === 'ar' ? 'أفضل محتوى أداءً' : 'Top Performing Content'}
                </span>
              </div>
              {systemSummary.topContent.length > 0 ? (
                <div className="space-y-2">
                  {systemSummary.topContent.slice(0, 3).map((item) => (
                    <div key={item.id} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xs text-purple-400 truncate flex-1">{item.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-purple-500/20 ${SEODashboardEngine.getScoreColor(item.score)}`}>
                        {item.score}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  {language === 'ar' ? 'لا يوجد محتوى بعد' : 'No content yet'}
                </p>
              )}
            </div>

            {/* Worst Performing Content */}
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-gray-300">
                  {language === 'ar' ? 'أسوأ محتوى أداءً' : 'Worst Performing Content'}
                </span>
              </div>
              {systemSummary.worstContent.length > 0 ? (
                <div className="space-y-2">
                  {systemSummary.worstContent.slice(0, 3).map((item) => (
                    <div key={item.id} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-xs text-amber-400 truncate flex-1">{item.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-amber-500/20 ${SEODashboardEngine.getScoreColor(item.score)}`}>
                        {item.score}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  {language === 'ar' ? 'لا يوجد محتوى بعد' : 'No content yet'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEODashboardPage;
// =====================================================
// SERVICE ANALYTICS REPORTS - AXIOMX ADMIN SYSTEM
// Phase 5F-3: Service Analytics Reports
// =====================================================

import React, { useMemo, useState } from 'react';
import { useServices } from '../context/ServiceContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Service,
  PerformanceReportItem,
  SEOReportItem,
  TranslationReportItem,
  CategoryReportItem,
  RelationshipsReportItem,
  ReportData,
  AnyReportItem,
} from '../types/project';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  ListChecks,
  Globe,
  Link2,
  Search,
  Clock,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';

// =====================================================
// REPORT TYPES
// =====================================================

type ReportType = 'performance' | 'seo' | 'translation' | 'category' | 'relationships';
type ExportFormat = 'copy' | 'json';

// =====================================================
// HELPER FUNCTIONS
// =====================================================

// Calculate SEO score for a service
const calculateServiceSEOScore = (service: Service): number => {
  const enContent = service.content?.en;
  const arContent = service.content?.ar;

  if (!enContent) return 0;

  let score = 0;
  const maxScore = 100;

  // Title presence (15 points)
  if (enContent.title && enContent.title.length > 0) score += 15;
  if (arContent?.title && arContent.title.length > 0) score += 15;

  // Description presence (15 points)
  if (enContent.description && enContent.description.length > 50) score += 15;
  if (arContent?.description && arContent.description.length > 50) score += 15;

  // SEO title presence (10 points)
  if (enContent.seo?.title && enContent.seo.title.length > 0) score += 10;
  if (arContent?.seo?.title && arContent.seo.title.length > 0) score += 10;

  // SEO description presence (10 points)
  if (enContent.seo?.description && enContent.seo.description.length > 0) score += 10;
  if (arContent?.seo?.description && arContent.seo.description.length > 0) score += 10;

  // OG tags presence (10 points)
  if (enContent.seo?.ogTitle && enContent.seo.ogTitle.length > 0) score += 5;
  if (enContent.seo?.ogDescription && enContent.seo.ogDescription.length > 0) score += 5;

  // Translation status (10 points)
  if (service.translationStatus?.en === 'complete') score += 5;
  if (service.translationStatus?.ar === 'complete') score += 5;

  // Image presence (5 points)
  if (service.image && service.image.length > 0) score += 5;

  return Math.min(score, maxScore);
};

// Get SEO score color
const getSEOScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-amber-400';
  return 'text-red-400';
};

// Get SEO score background color
const getSEOScoreBg = (score: number): string => {
  if (score >= 80) return 'bg-green-500/20';
  if (score >= 60) return 'bg-amber-500/20';
  return 'bg-red-500/20';
};

// =====================================================
// REPORT CARD COMPONENT
// =====================================================

interface ReportCardProps {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: React.ReactNode;
  iconColor: string;
  onClick: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({
  title,
  titleAr,
  description,
  descriptionAr,
  icon,
  iconColor,
  onClick,
}) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <button
      onClick={onClick}
      className="w-full text-right bg-[#0a0a0a] border border-white/5 rounded-xl p-5 hover:border-white/10 hover:bg-white/5 transition-all duration-200 group"
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl ${iconColor} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold mb-1">
            {isRTL ? titleAr : title}
          </h3>
          <p className="text-sm text-gray-400">
            {isRTL ? descriptionAr : description}
          </p>
        </div>
      </div>
    </button>
  );
};

// =====================================================
// REPORT VIEWER COMPONENT
// =====================================================

interface ReportViewerProps {
  reportType: ReportType;
  onBack: () => void;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ reportType, onBack }) => {
  const { language } = useLanguage();
  const { services } = useServices();
  const [exportFormat, setExportFormat] = useState<ExportFormat>('copy');
  const [copied, setCopied] = useState(false);

  const isRTL = language === 'ar';

  // Generate report data based on type
  const reportData = useMemo(() => {
    switch (reportType) {
      case 'performance':
        return generatePerformanceReport(services, language);
      case 'seo':
        return generateSEOReport(services, language);
      case 'translation':
        return generateTranslationReport(services, language);
      case 'category':
        return generateCategoryReport(services, language);
      case 'relationships':
        return generateRelationshipsReport(services, language);
      default:
        return { title: '', data: [] };
    }
  }, [services, language, reportType]);

  const handleCopy = () => {
    const text = formatReportAsText(reportData, reportType, language);
    void navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(reportData.data, null, 2);
    void navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reportConfig = {
    performance: {
      title: language === 'ar' ? 'تقرير أداء الخدمات' : 'Service Performance Report',
      icon: <TrendingUp className="w-6 h-6" />,
      iconColor: 'bg-blue-500/20 text-blue-400',
    },
    seo: {
      title: language === 'ar' ? 'تقرير SEO' : 'SEO Report',
      icon: <Search className="w-6 h-6" />,
      iconColor: 'bg-green-500/20 text-green-400',
    },
    translation: {
      title: language === 'ar' ? 'تقرير الترجمة' : 'Translation Status Report',
      icon: <Globe className="w-6 h-6" />,
      iconColor: 'bg-purple-500/20 text-purple-400',
    },
    category: {
      title: language === 'ar' ? 'تقرير التصنيفات' : 'Category Distribution Report',
      icon: <PieChart className="w-6 h-6" />,
      iconColor: 'bg-amber-500/20 text-amber-400',
    },
    relationships: {
      title: language === 'ar' ? 'تقرير العلاقات' : 'Relationships Report',
      icon: <Link2 className="w-6 h-6" />,
      iconColor: 'bg-cyan-500/20 text-cyan-400',
    },
  };

  const config = reportConfig[reportType];

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          {language === 'ar' ? 'رجوع' : 'Back'}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            {language === 'ar' ? 'نسخ كنص' : 'Copy as Text'}
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white transition-colors"
          >
            <Download className="w-4 h-4" />
            {language === 'ar' ? 'تصدير JSON' : 'Export JSON'}
          </button>
        </div>
      </div>

      {/* Report Title */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/5 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl ${config.iconColor} flex items-center justify-center`}>
            {config.icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{config.title}</h2>
            <p className="text-sm text-gray-400 mt-1">
              {new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
        <ReportContent reportType={reportType} data={reportData} />
      </div>
    </div>
  );
};

// =====================================================
// REPORT CONTENT COMPONENTS
// =====================================================

interface ReportContentProps {
  reportType: ReportType;
  data: ReportData;
}

const ReportContent: React.FC<ReportContentProps> = ({ reportType, data }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  switch (reportType) {
    case 'performance':
      return <PerformanceReportTable data={data.data.filter((item): item is PerformanceReportItem => 'status' in item)} />;
    case 'seo':
      return <SEOReportTable data={data.data.filter((item): item is SEOReportItem => 'score' in item)} />;
    case 'translation':
      return <TranslationReportTable data={data.data.filter((item): item is TranslationReportItem => 'overallStatus' in item)} />;
    case 'category':
      return <CategoryReportTable data={data.data.filter((item): item is CategoryReportItem => 'category' in item)} />;
    case 'relationships':
      return <RelationshipsReportTable data={data.data.filter((item): item is RelationshipsReportItem => 'related' in item)} />;
    default:
      return null;
  }
};

// Performance Report Table
const PerformanceReportTable: React.FC<{ data: PerformanceReportItem[] }> = ({ data }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
              {language === 'ar' ? 'الخدمة' : 'Service'}
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">
              {language === 'ar' ? 'الحالة' : 'Status'}
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">
              {language === 'ar' ? 'تاريخ الإنشاء' : 'Created'}
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">
              {language === 'ar' ? 'آخر تحديث' : 'Updated'}
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">
              {language === 'ar' ? 'مميز' : 'Featured'}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-white/5">
              <td className="px-4 py-3 text-white font-medium">{item.title}</td>
              <td className="px-4 py-3 text-center">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                  item.status === 'published'
                    ? 'bg-green-500/20 text-green-400'
                    : item.status === 'draft'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-3 text-center text-gray-400 text-sm">{item.created}</td>
              <td className="px-4 py-3 text-center text-gray-400 text-sm">{item.updated}</td>
              <td className="px-4 py-3 text-center">
                {item.featured ? (
                  <CheckCircle className="w-5 h-5 text-amber-400 mx-auto" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-600 mx-auto" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// SEO Report Table
const SEOReportTable: React.FC<{ data: SEOReportItem[] }> = ({ data }) => {
  const { language } = useLanguage();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-500/20';
    if (score >= 60) return 'text-amber-400 bg-amber-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
              {language === 'ar' ? 'الخدمة' : 'Service'}
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">
              {language === 'ar' ? 'النقاط' : 'Score'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
              {language === 'ar' ? 'العناصر المفقودة' : 'Missing Items'}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-white/5">
              <td className="px-4 py-3 text-white font-medium">{item.title}</td>
              <td className="px-4 py-3 text-center">
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(item.score)}`}>
                  {item.score}%
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {item.missing.map((missing: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded text-xs">
                      {missing}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Translation Report Table
const TranslationReportTable: React.FC<{ data: TranslationReportItem[] }> = ({ data }) => {
  const { language } = useLanguage();

  const getStatusIcon = (status: string) => {
    if (status === 'complete') {
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
    if (status === 'incomplete') {
      return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    }
    return <XCircle className="w-4 h-4 text-red-400" />;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
              {language === 'ar' ? 'الخدمة' : 'Service'}
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">
              {language === 'ar' ? 'الإنجليزية' : 'English'}
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">
              {language === 'ar' ? 'العربية' : 'Arabic'}
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">
              {language === 'ar' ? 'الحالة الإجمالية' : 'Overall Status'}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-white/5">
              <td className="px-4 py-3 text-white font-medium">{item.title}</td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  {getStatusIcon(item.enStatus)}
                  <span className="text-sm text-gray-400">{item.enStatus}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  {getStatusIcon(item.arStatus)}
                  <span className="text-sm text-gray-400">{item.arStatus}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                  item.overallStatus === 'complete'
                    ? 'bg-green-500/20 text-green-400'
                    : item.overallStatus === 'partial'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {item.overallStatus}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Category Report Table
const CategoryReportTable: React.FC<{ data: CategoryReportItem[] }> = ({ data }) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
        return (
          <div key={index} className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">{item.category}</span>
              <span className="text-gray-400 text-sm">
                {item.count} {language === 'ar' ? 'خدمة' : 'services'} ({percentage}%)
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Relationships Report Table
const RelationshipsReportTable: React.FC<{ data: RelationshipsReportItem[] }> = ({ data }) => {
  const { language } = useLanguage();

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
              {language === 'ar' ? 'الخدمة' : 'Service'}
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">
              {language === 'ar' ? 'عدد العلاقات' : 'Connections'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
              {language === 'ar' ? 'الخدمات المرتبطة' : 'Related Services'}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-white/5">
              <td className="px-4 py-3 text-white font-medium">{item.title}</td>
              <td className="px-4 py-3 text-center">
                <span className="inline-flex px-2.5 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                  {item.count}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {item.related.length > 0 ? (
                    item.related.map((rel: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-white/5 text-gray-400 rounded text-xs">
                        {rel}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">
                      {language === 'ar' ? 'لا توجد علاقات' : 'No connections'}
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// =====================================================
// REPORT DATA GENERATORS
// =====================================================

const generatePerformanceReport = (services: Service[], language: string): ReportData => {
  const data = services.map(service => ({
    title: service.title,
    status: service.status,
    created: new Date(service.createdAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US'),
    updated: new Date(service.updatedAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US'),
    featured: service.featured,
  }));

  return {
    title: language === 'ar' ? 'تقرير أداء الخدمات' : 'Service Performance Report',
    data,
  };
};

const generateSEOReport = (services: Service[], language: string): ReportData => {
  const data = services.map(service => {
    const score = calculateServiceSEOScore(service);
    const missing: string[] = [];

    const enContent = service.content?.en;
    const arContent = service.content?.ar;

    if (!enContent?.title) missing.push(language === 'ar' ? 'عنوان EN' : 'EN Title');
    if (!arContent?.title) missing.push(language === 'ar' ? 'عنوان AR' : 'AR Title');
    if (!enContent?.description || enContent.description.length < 50) missing.push(language === 'ar' ? 'وصف EN' : 'EN Description');
    if (!arContent?.description || arContent.description.length < 50) missing.push(language === 'ar' ? 'وصف AR' : 'AR Description');
    if (!enContent?.seo?.title) missing.push(language === 'ar' ? 'SEO EN' : 'SEO EN');
    if (!arContent?.seo?.title) missing.push(language === 'ar' ? 'SEO AR' : 'SEO AR');
    if (!enContent?.seo?.ogTitle) missing.push('OG Title');
    if (!enContent?.seo?.ogDescription) missing.push('OG Description');
    if (service.translationStatus?.en !== 'complete') missing.push(language === 'ar' ? 'ترجمة EN' : 'EN Translation');
    if (service.translationStatus?.ar !== 'complete') missing.push(language === 'ar' ? 'ترجمة AR' : 'AR Translation');

    return {
      title: service.title,
      score,
      missing,
    };
  });

  // Sort by score descending
  data.sort((a, b) => b.score - a.score);

  return {
    title: language === 'ar' ? 'تقرير SEO' : 'SEO Report',
    data,
  };
};

const generateTranslationReport = (services: Service[], language: string): ReportData => {
  const data = services.map(service => {
    const enStatus = service.translationStatus?.en || 'missing';
    const arStatus = service.translationStatus?.ar || 'missing';

    let overallStatus: TranslationReportItem['overallStatus'];
    if (enStatus === 'complete' && arStatus === 'complete') {
      overallStatus = 'complete';
    } else if (enStatus === 'complete' || arStatus === 'complete') {
      overallStatus = 'partial';
    } else {
      overallStatus = 'missing';
    }

    return {
      title: service.title,
      enStatus,
      arStatus,
      overallStatus,
    };
  });

  return {
    title: language === 'ar' ? 'تقرير الترجمة' : 'Translation Status Report',
    data,
  };
};

const generateCategoryReport = (services: Service[], language: string): ReportData => {
  const categoryMap = new Map<string, number>();

  services.forEach(service => {
    const category = service.category || (language === 'ar' ? 'غير مصنف' : 'Uncategorized');
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
  });

  const data = Array.from(categoryMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  return {
    title: language === 'ar' ? 'تقرير التصنيفات' : 'Category Distribution Report',
    data,
  };
};

const generateRelationshipsReport = (services: Service[], language: string): ReportData => {
  const data = services.map(service => {
    const related = (service.relatedServiceIds || [])
      .map(id => services.find(s => s.id === id)?.title || id);

    return {
      title: service.title,
      count: service.relatedServiceIds?.length || 0,
      related,
    };
  });

  // Sort by connection count descending
  data.sort((a, b) => b.count - a.count);

  return {
    title: language === 'ar' ? 'تقرير العلاقات' : 'Relationships Report',
    data,
  };
};

// =====================================================
// FORMAT REPORT AS TEXT
// =====================================================

const formatReportAsText = (reportData: ReportData, reportType: ReportType, language: string): string => {
  const isRTL = language === 'ar';
  let text = '';

  switch (reportType) {
    case 'performance':
      text = isRTL ? '=== تقرير أداء الخدمات ===\n\n' : '=== Service Performance Report ===\n\n';
      reportData.data.forEach((item: AnyReportItem) => {
        const performanceItem = item as PerformanceReportItem; // Type assertion
        text += `${performanceItem.title} | ${performanceItem.status} | ${performanceItem.created} | ${performanceItem.featured ? '✓' : '✗'}\n`;
      });
      break;

    case 'seo':
      text = isRTL ? '=== تقرير SEO ===\n\n' : '=== SEO Report ===\n\n';
      reportData.data.forEach((item: AnyReportItem) => {
        const seoItem = item as SEOReportItem; // Type assertion
        text += `${seoItem.title} | Score: ${seoItem.score}%`;
        if (seoItem.missing.length > 0) {
          text += ` | Missing: ${seoItem.missing.join(', ')}`;
        }
        text += '\n';
      });
      break;

    case 'translation':
      text = isRTL ? '=== تقرير الترجمة ===\n\n' : '=== Translation Status Report ===\n\n';
      reportData.data.forEach((item: AnyReportItem) => {
        const translationItem = item as TranslationReportItem; // Type assertion
        text += `${translationItem.title} | EN: ${translationItem.enStatus} | AR: ${translationItem.arStatus} | ${translationItem.overallStatus}\n`;
      });
      break;

    case 'category':
      text = isRTL ? '=== تقرير التصنيفات ===\n\n' : '=== Category Distribution Report ===\n\n';
      const totalCategories = reportData.data.reduce((sum: number, item: AnyReportItem) => {
        const categoryItem = item as CategoryReportItem; // Type assertion here too
        return sum + categoryItem.count;
      }, 0);
      reportData.data.forEach((item: AnyReportItem) => {
        const categoryItem = item as CategoryReportItem; // Type assertion
        const percentage = totalCategories > 0 ? Math.round((categoryItem.count / totalCategories) * 100) : 0;
        text += `${categoryItem.category}: ${categoryItem.count} (${percentage}%)\n`;
      });
      break;

    case 'relationships':
      text = isRTL ? '=== تقرير العلاقات ===\n\n' : '=== Relationships Report ===\n\n';
      reportData.data.forEach((item: AnyReportItem) => {
        const relationshipsItem = item as RelationshipsReportItem; // Type assertion
        text += `${relationshipsItem.title}: ${relationshipsItem.count} connections`;
        if (relationshipsItem.related.length > 0) {
          text += ` -> ${relationshipsItem.related.join(', ')}`;
        }
        text += '\n';
      });
      break;
  }

  return text;
};

// =====================================================
// MAIN COMPONENT
// =====================================================

const ServiceAnalyticsReports: React.FC = () => {
  const { language } = useLanguage();
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);

  const isRTL = language === 'ar';

  const reportTypes = [
    {
      type: 'performance' as ReportType,
      title: 'Service Performance Report',
      titleAr: 'تقرير أداء الخدمات',
      description: 'View service status, creation dates, and featured services',
      descriptionAr: 'عرض حالة الخدمات وتواريخ الإنشاء والخدمات المميزة',
      icon: <TrendingUp className="w-6 h-6" />,
      iconColor: 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20',
    },
    {
      type: 'seo' as ReportType,
      title: 'SEO Report',
      titleAr: 'تقرير SEO',
      description: 'Analyze SEO scores and identify missing optimization elements',
      descriptionAr: 'تحليل نقاط SEO وتحديد العناصر المفقودة',
      icon: <Search className="w-6 h-6" />,
      iconColor: 'bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/20',
    },
    {
      type: 'translation' as ReportType,
      title: 'Translation Status Report',
      titleAr: 'تقرير الترجمة',
      description: 'Check translation completeness for English and Arabic',
      descriptionAr: 'التحقق من اكتمال الترجمة للغة الإنجليزية والعربية',
      icon: <Globe className="w-6 h-6" />,
      iconColor: 'bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/20',
    },
    {
      type: 'category' as ReportType,
      title: 'Category Distribution Report',
      titleAr: 'تقرير التصنيفات',
      description: 'View service distribution across categories',
      descriptionAr: 'عرض توزيع الخدمات عبر التصنيفات',
      icon: <PieChart className="w-6 h-6" />,
      iconColor: 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20',
    },
    {
      type: 'relationships' as ReportType,
      title: 'Relationships Report',
      titleAr: 'تقرير العلاقات',
      description: 'Analyze service relationships and connections',
      descriptionAr: 'تحليل علاقات وروابط الخدمات',
      icon: <Link2 className="w-6 h-6" />,
      iconColor: 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/20',
    },
  ];

  if (selectedReport) {
    return (
      <ReportViewer
        reportType={selectedReport}
        onBack={() => setSelectedReport(null)}
      />
    );
  }

  return (
    <div className="mb-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
          <FileText className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">
            {language === 'ar' ? 'تقارير تحليلات الخدمات' : 'Service Analytics Reports'}
          </h2>
          <p className="text-sm text-gray-400">
            {language === 'ar' ? 'إنشاء وتصدير تقارير مفصلة' : 'Generate and export detailed reports'}
          </p>
        </div>
      </div>

      {/* Report Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((report) => (
          <ReportCard
            key={report.type}
            title={report.title}
            titleAr={report.titleAr}
            description={report.description}
            descriptionAr={report.descriptionAr}
            icon={report.icon}
            iconColor={report.iconColor}
            onClick={() => setSelectedReport(report.type)}
          />
        ))}
      </div>
    </div>
  );
};

export default ServiceAnalyticsReports;
// =====================================================
// SERVICE ANALYTICS EXPORT - AXIOMX ADMIN SYSTEM
// Phase 5F-4: Service Analytics Export
// =====================================================

import React, { useState, useMemo } from 'react';
import { useServices } from '../context/ServiceContext';
import { useLanguage } from '../context/LanguageContext';
import { Service } from '../types/project';
import {
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  Check,
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
} from 'lucide-react';
import {
  calculateServiceSEOScore,
  getConnectionCount,
} from './ServiceAnalyticsFilters';

// =====================================================
// HELPER FUNCTIONS
// =====================================================

// Format date for export
const formatDate = (dateStr: string, language: string): string => {
  return new Date(dateStr).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Calculate SEO completeness status
const isSEOComplete = (service: Service): boolean => {
  const enContent = service.content?.en;
  const arContent = service.content?.ar;

  if (!enContent) return false;

  if (service.translationStatus?.en !== 'complete') return false;
  if (service.translationStatus?.ar !== 'complete') return false;

  if (!enContent.seo?.title || enContent.seo.title.length === 0) return false;
  if (!enContent.seo?.description || enContent.seo.description.length === 0) return false;
  if (!arContent?.seo?.title || arContent.seo.title.length === 0) return false;
  if (!arContent?.seo?.description || arContent.seo.description.length === 0) return false;

  if (!enContent.seo?.ogTitle || enContent.seo.ogTitle.length === 0) return false;
  if (!enContent.seo?.ogDescription || enContent.seo.ogDescription.length === 0) return false;

  if (!enContent.description || enContent.description.length < 100) return false;
  if (!arContent?.description || arContent.description.length < 100) return false;

  return true;
};

// Check if service has SEO issues
const hasSEOIssues = (service: Service): boolean => {
  const enContent = service.content?.en;
  const arContent = service.content?.ar;

  if (!enContent?.seo?.title || enContent.seo.title.length === 0) return true;
  if (!enContent?.seo?.description || enContent.seo.description.length === 0) return true;
  if (!enContent?.title || enContent.title.length === 0) return true;
  if (service.translationStatus?.ar === 'missing') return true;
  if (!service.shortDescription || service.shortDescription.length < 20) return true;

  return false;
};

// Check if service is fully optimized
const isFullyOptimized = (service: Service): boolean => {
  const enContent = service.content?.en;
  const arContent = service.content?.ar;

  if (service.translationStatus?.en !== 'complete') return false;
  if (service.translationStatus?.ar !== 'complete') return false;

  if (!enContent?.seo?.title || enContent.seo.title.length === 0) return false;
  if (!enContent?.seo?.description || enContent.seo.description.length === 0) return false;
  if (!arContent?.seo?.title || arContent.seo.title.length === 0) return false;
  if (!arContent?.seo?.description || arContent.seo.description.length === 0) return false;

  if (!enContent?.seo?.ogTitle || enContent.seo.ogTitle.length === 0) return false;
  if (!enContent?.seo?.ogDescription || enContent.seo.ogDescription.length === 0) return false;

  if (!enContent?.description || enContent.description.length < 100) return false;
  if (!arContent?.description || arContent.description.length < 100) return false;

  return true;
};

// =====================================================
// EXPORT DATA GENERATORS
// =====================================================

// Generate JSON export data
const generateJSONExport = (services: Service[], language: string) => {
  const exportData = services.map(service => {
    const seoScore = calculateServiceSEOScore(service);
    const connections = getConnectionCount(service, services);

    return {
      id: service.id,
      title: service.title,
      titleAr: service.content?.ar?.title || '',
      status: service.status,
      category: service.category,
      tags: service.tags,
      featured: service.featured,
      seoScore,
      seoComplete: isSEOComplete(service),
      hasSEOIssues: hasSEOIssues(service),
      connections,
      relatedServicesCount: service.relatedServiceIds?.length || 0,
      translationStatus: {
        en: service.translationStatus?.en || 'missing',
        ar: service.translationStatus?.ar || 'missing',
      },
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
      publishedAt: service.publishedAt,
      seo: {
        en: {
          title: service.content?.en?.seo?.title || '',
          description: service.content?.en?.seo?.description || '',
          ogTitle: service.content?.en?.seo?.ogTitle || '',
          ogDescription: service.content?.en?.seo?.ogDescription || '',
        },
        ar: {
          title: service.content?.ar?.seo?.title || '',
          description: service.content?.ar?.seo?.description || '',
          ogTitle: service.content?.ar?.seo?.ogTitle || '',
          ogDescription: service.content?.ar?.seo?.ogDescription || '',
        },
      },
    };
  });

  return {
    exportDate: new Date().toISOString(),
    language,
    totalServices: services.length,
    services: exportData,
  };
};

// Generate CSV export data
const generateCSVExport = (services: Service[], language: string): string => {
  const headers = language === 'ar'
    ? ['المعرف', 'العنوان', 'العنوان (EN)', 'الحالة', 'التصنيف', 'الوسوم', 'مميز', 'نقاط SEO', 'مكتمل SEO', 'عدد الاتصالات', 'الترجمة EN', 'الترجمة AR', 'تاريخ الإنشاء', 'تاريخ التحديث']
    : ['ID', 'Title', 'Title (AR)', 'Status', 'Category', 'Tags', 'Featured', 'SEO Score', 'SEO Complete', 'Connections', 'Translation EN', 'Translation AR', 'Created', 'Updated'];

  const rows = services.map(service => {
    const seoScore = calculateServiceSEOScore(service);
    const connections = getConnectionCount(service, services);

    return [
      service.id,
      `"${service.title}"`,
      `"${service.content?.ar?.title || ''}"`,
      service.status,
      `"${service.category || ''}"`,
      `"${service.tags.join(', ')}"`,
      service.featured ? 'Yes' : 'No',
      seoScore,
      isSEOComplete(service) ? 'Yes' : 'No',
      connections,
      service.translationStatus?.en || 'missing',
      service.translationStatus?.ar || 'missing',
      formatDate(service.createdAt, language),
      formatDate(service.updatedAt, language),
    ];
  });

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
};

// Generate Summary Report
const generateSummaryReport = (services: Service[], language: string): string => {
  const isRTL = language === 'ar';

  // Calculate statistics
  const totalServices = services.length;
  const publishedServices = services.filter(s => s.status === 'published').length;
  const draftServices = services.filter(s => s.status === 'draft').length;
  const archivedServices = services.filter(s => s.status === 'archived').length;
  const featuredServices = services.filter(s => s.featured).length;

  const seoScores = services.map(s => calculateServiceSEOScore(s));
  const averageSEOScore = seoScores.length > 0
    ? Math.round(seoScores.reduce((a, b) => a + b, 0) / seoScores.length)
    : 0;

  const servicesWithSEOIssues = services.filter(s => hasSEOIssues(s)).length;
  const servicesFullyOptimized = services.filter(s => isFullyOptimized(s)).length;

  const enComplete = services.filter(s => s.translationStatus?.en === 'complete').length;
  const arComplete = services.filter(s => s.translationStatus?.ar === 'complete').length;
  const enMissing = services.filter(s => s.translationStatus?.en === 'missing').length;
  const arMissing = services.filter(s => s.translationStatus?.ar === 'missing').length;

  // Calculate relationships
  const allRelationships = new Set<string>();
  services.forEach(service => {
    service.relatedServiceIds?.forEach(relId => {
      allRelationships.add(`${service.id}-${relId}`);
      allRelationships.add(`${relId}-${service.id}`);
    });
  });
  const totalRelationships = Math.floor(allRelationships.size / 2);
  const servicesWithNoConnections = services.filter(s => !s.relatedServiceIds?.length).length;

  // Category distribution
  const categoryMap = new Map<string, number>();
  services.forEach(service => {
    const category = service.category || (isRTL ? 'غير مصنف' : 'Uncategorized');
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
  });
  const topCategories = Array.from(categoryMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Build report
  let report = '';
  const title = isRTL ? '=== تقرير تحليلات الخدمات ===' : '=== Service Analytics Report ===';
  const date = new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  report += `${title}\n`;
  report += `${date}\n`;
  report += `${'='.repeat(50)}\n\n`;

  // Overview Section
  report += isRTL ? '--- نظرة عامة ---\n' : '--- Overview ---\n';
  report += `${isRTL ? 'إجمالي الخدمات' : 'Total Services'}: ${totalServices}\n`;
  report += `${isRTL ? 'خدمات منشورة' : 'Published Services'}: ${publishedServices}\n`;
  report += `${isRTL ? 'مسودات' : 'Drafts'}: ${draftServices}\n`;
  report += `${isRTL ? 'أرشيف' : 'Archived'}: ${archivedServices}\n`;
  report += `${isRTL ? 'خدمات مميزة' : 'Featured Services'}: ${featuredServices}\n`;
  report += '\n';

  // SEO Section
  report += isRTL ? '--- تحليل SEO ---\n' : '--- SEO Analysis ---\n';
  report += `${isRTL ? 'متوسط نقاط SEO' : 'Average SEO Score'}: ${averageSEOScore}%\n`;
  report += `${isRTL ? 'خدمات محسنة بالكامل' : 'Fully Optimized'}: ${servicesFullyOptimized}\n`;
  report += `${isRTL ? 'خدمات بمشاكل SEO' : 'With SEO Issues'}: ${servicesWithSEOIssues}\n`;
  report += '\n';

  // Translation Section
  report += isRTL ? '--- حالة الترجمة ---\n' : '--- Translation Status ---\n';
  report += `${isRTL ? 'الإنجليزية مكتملة' : 'English Complete'}: ${enComplete}\n`;
  report += `${isRTL ? 'العربية مكتملة' : 'Arabic Complete'}: ${arComplete}\n`;
  report += `${isRTL ? 'الإنجليزية مفقودة' : 'English Missing'}: ${enMissing}\n`;
  report += `${isRTL ? 'العربية مفقودة' : 'Arabic Missing'}: ${arMissing}\n`;
  report += '\n';

  // Relationships Section
  report += isRTL ? '--- العلاقات ---\n' : '--- Relationships ---\n';
  report += `${isRTL ? 'إجمالي العلاقات' : 'Total Relationships'}: ${totalRelationships}\n`;
  report += `${isRTL ? 'خدمات بدون اتصالات' : 'Services Without Connections'}: ${servicesWithNoConnections}\n`;
  report += '\n';

  // Categories Section
  report += isRTL ? '--- التصنيفات ---\n' : '--- Categories ---\n';
  topCategories.forEach(([category, count]) => {
    const percentage = Math.round((count / totalServices) * 100);
    report += `${category}: ${count} (${percentage}%)\n`;
  });
  report += '\n';

  // Footer
  report += `${'='.repeat(50)}\n`;
  report += isRTL
    ? 'نهاية التقرير - AXIOMX Service Analytics'
    : 'End of Report - AXIOMX Service Analytics';

  return report;
};

// =====================================================
// FILE DOWNLOAD HELPER
// =====================================================

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// =====================================================
// EXPORT BUTTON COMPONENT
// =====================================================

interface ExportButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  labelAr: string;
  color: string;
  success: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  onClick,
  icon,
  label,
  labelAr,
  color,
  success,
}) => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-5 py-3 rounded-xl font-medium transition-all hover:scale-105 ${color}`}
    >
      {success ? (
        <Check className="w-5 h-5" />
      ) : (
        icon
      )}
      <span>{isRTL ? labelAr : label}</span>
    </button>
  );
};

// =====================================================
// MAIN COMPONENT
// =====================================================

const ServiceAnalyticsExport: React.FC = () => {
  const { language } = useLanguage();
  const { services } = useServices();
  const [expandedSection, setExpandedSection] = useState(true);
  const [exportSuccess, setExportSuccess] = useState<'json' | 'csv' | 'summary' | null>(null);

  const isRTL = language === 'ar';

  // Calculate export preview stats
  const exportStats = useMemo(() => ({
    totalServices: services.length,
    estimatedJSONSize: Math.round(JSON.stringify(generateJSONExport(services, language)).length / 1024),
    estimatedCSVSize: Math.round(generateCSVExport(services, language).length / 1024),
    estimatedSummarySize: Math.round(generateSummaryReport(services, language).length / 1024),
  }), [services, language]);

  // Export handlers
  const handleExportJSON = () => {
    const data = generateJSONExport(services, language);
    const filename = `service-analytics-${new Date().toISOString().split('T')[0]}.json`;
    downloadFile(JSON.stringify(data, null, 2), filename, 'application/json');
    setExportSuccess('json');
    setTimeout(() => setExportSuccess(null), 2000);
  };

  const handleExportCSV = () => {
    const data = generateCSVExport(services, language);
    const filename = `service-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    downloadFile(data, filename, 'text/csv;charset=utf-8');
    setExportSuccess('csv');
    setTimeout(() => setExportSuccess(null), 2000);
  };

  const handleExportSummary = () => {
    const data = generateSummaryReport(services, language);
    const filename = `service-summary-report-${new Date().toISOString().split('T')[0]}.txt`;
    downloadFile(data, filename, 'text/plain;charset=utf-8');
    setExportSuccess('summary');
    setTimeout(() => setExportSuccess(null), 2000);
  };

  return (
    <div className="mb-6">
      {/* Section Header */}
      <button
        onClick={() => setExpandedSection(!expandedSection)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-white/5 rounded-xl hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center">
            <Download className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-white">
              {language === 'ar' ? 'تصدير تحليلات الخدمات' : 'Service Analytics Export'}
            </h3>
            <p className="text-xs text-gray-400">
              {language === 'ar' ? 'تصدير البيانات بصيغ مختلفة' : 'Export data in various formats'}
            </p>
          </div>
        </div>
        {expandedSection ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Export Content */}
      {expandedSection && (
        <div className="p-4 border-t border-white/5 space-y-4">
          {/* Export Stats Preview */}
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">
                {language === 'ar' ? 'معاينة التصدير' : 'Export Preview'}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{exportStats.totalServices}</p>
                <p className="text-xs text-gray-400">
                  {language === 'ar' ? 'إجمالي الخدمات' : 'Total Services'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-400">~{exportStats.estimatedJSONSize}KB</p>
                <p className="text-xs text-gray-400">JSON</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-400">~{exportStats.estimatedCSVSize}KB</p>
                <p className="text-xs text-gray-400">CSV</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-purple-400">~{exportStats.estimatedSummarySize}KB</p>
                <p className="text-xs text-gray-400">
                  {language === 'ar' ? 'التقرير' : 'Report'}
                </p>
              </div>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ExportButton
              onClick={handleExportJSON}
              icon={<FileJson className="w-5 h-5" />}
              label="Export JSON"
              labelAr="تصدير JSON"
              color="bg-blue-600 hover:bg-blue-500 text-white"
              success={exportSuccess === 'json'}
            />

            <ExportButton
              onClick={handleExportCSV}
              icon={<FileSpreadsheet className="w-5 h-5" />}
              label="Export CSV"
              labelAr="تصدير CSV"
              color="bg-green-600 hover:bg-green-500 text-white"
              success={exportSuccess === 'csv'}
            />

            <ExportButton
              onClick={handleExportSummary}
              icon={<FileText className="w-5 h-5" />}
              label="Export Summary"
              labelAr="تقرير ملخص"
              color="bg-purple-600 hover:bg-purple-500 text-white"
              success={exportSuccess === 'summary'}
            />
          </div>

          {/* Export Info */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>
              {language === 'ar'
                ? `آخر تحديث: ${formatDate(new Date().toISOString(), language)}`
                : `Last update: ${formatDate(new Date().toISOString(), language)}`
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceAnalyticsExport;
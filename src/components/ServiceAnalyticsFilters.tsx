// =====================================================
// SERVICE ANALYTICS FILTERS - AXIOMX ADMIN SYSTEM
// Phase 5F-2: Service Analytics Filters
// =====================================================

import React, { useState, useMemo, useCallback } from 'react';
import { useServices } from '../context/ServiceContext';
import { useCategories } from '../context/CategoryContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Service,
  ServiceStatus,
} from '../types/project';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Tag,
  CheckCircle,
  AlertTriangle,
  Link2,
  RefreshCw,
} from 'lucide-react';

// =====================================================
// FILTER TYPES
// =====================================================

export interface ServiceFilters {
  category: string | null;
  status: ServiceStatus | null;
  seoComplete: 'all' | 'complete' | 'incomplete';
  minConnections: number | null;
  searchQuery: string;
}

export interface FilterSummary {
  activeFilterCount: number;
  matchingServicesCount: number;
  totalServicesCount: number;
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

// Calculate SEO completeness status
const isSEOComplete = (service: Service): boolean => {
  const enContent = service.content?.en;
  const arContent = service.content?.ar;

  if (!enContent) return false;

  // Check for complete translation in both languages
  if (service.translationStatus?.en !== 'complete') return false;
  if (service.translationStatus?.ar !== 'complete') return false;

  // Check for essential SEO fields
  if (!enContent.seo?.title || enContent.seo.title.length === 0) return false;
  if (!enContent.seo?.description || enContent.seo.description.length === 0) return false;
  if (!arContent?.seo?.title || arContent.seo.title.length === 0) return false;
  if (!arContent?.seo?.description || arContent.seo.description.length === 0) return false;

  // Check for OG tags
  if (!enContent.seo?.ogTitle || enContent.seo.ogTitle.length === 0) return false;
  if (!enContent.seo?.ogDescription || enContent.seo.ogDescription.length === 0) return false;

  // Check for sufficient description
  if (!enContent.description || enContent.description.length < 100) return false;
  if (!arContent?.description || arContent.description.length < 100) return false;

  return true;
};

// Get connection count for a service
const getConnectionCount = (service: Service, allServices: Service[]): number => {
  const incomingConnections = allServices.filter(
    s => s.relatedServiceIds?.includes(service.id)
  ).length;
  const outgoingConnections = service.relatedServiceIds?.length || 0;
  return incomingConnections + outgoingConnections;
};

// =====================================================
// FILTER BAR COMPONENT
// =====================================================

interface FilterBarProps {
  filters: ServiceFilters;
  onFiltersChange: (filters: ServiceFilters) => void;
  categories: { id: string; name: string; nameAr: string }[];
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFiltersChange, categories }) => {
  const { language } = useLanguage();
  const [expandedSection, setExpandedSection] = useState<string | null>('filters');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const statusOptions: { value: ServiceStatus | null; label: string }[] = [
    { value: null, label: language === 'ar' ? 'الكل' : 'All' },
    { value: 'published', label: language === 'ar' ? 'منشور' : 'Published' },
    { value: 'draft', label: language === 'ar' ? 'مسودة' : 'Draft' },
    { value: 'archived', label: language === 'ar' ? 'مؤرشف' : 'Archived' },
  ];

  const seoOptions: { value: 'all' | 'complete' | 'incomplete'; label: string }[] = [
    { value: 'all', label: language === 'ar' ? 'الكل' : 'All' },
    { value: 'complete', label: language === 'ar' ? 'مكتمل' : 'Complete' },
    { value: 'incomplete', label: language === 'ar' ? 'غير مكتمل' : 'Incomplete' },
  ];

  const connectionOptions: { value: number | null; label: string }[] = [
    { value: null, label: language === 'ar' ? 'الكل' : 'All' },
    { value: 0, label: language === 'ar' ? '0 اتصال' : '0 connections' },
    { value: 1, label: language === 'ar' ? '1+ اتصال' : '1+ connections' },
    { value: 3, label: language === 'ar' ? '3+ اتصالات' : '3+ connections' },
    { value: 5, label: language === 'ar' ? '5+ اتصالات' : '5+ connections' },
  ];

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
      {/* Filter Header */}
      <button
        onClick={() => toggleSection('filters')}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
            <Filter className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-right">
            <h3 className="text-lg font-semibold text-white">
              {language === 'ar' ? 'فلاتر تحليلات الخدمات' : 'Service Analytics Filters'}
            </h3>
            <p className="text-xs text-gray-400">
              {language === 'ar' ? 'تصفية وتحليل البيانات' : 'Filter and analyze data'}
            </p>
          </div>
        </div>
        {expandedSection === 'filters' ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Filter Content */}
      {expandedSection === 'filters' && (
        <div className="p-4 border-t border-white/5 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
              placeholder={language === 'ar' ? 'البحث باسم الخدمة...' : 'Search by service name...'}
              className="w-full pr-10 pl-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-colors"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
            {filters.searchQuery && (
              <button
                onClick={() => onFiltersChange({ ...filters, searchQuery: '' })}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {language === 'ar' ? 'التصنيف' : 'Category'}
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => onFiltersChange({ ...filters, category: e.target.value || null })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500/50 transition-colors cursor-pointer"
              >
                <option value="">{language === 'ar' ? 'الكل' : 'All'}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {language === 'ar' ? cat.nameAr : cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {language === 'ar' ? 'الحالة' : 'Status'}
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  status: (e.target.value as ServiceStatus) || null
                })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500/50 transition-colors cursor-pointer"
              >
                {statusOptions.map((option) => (
                  <option key={option.value || 'all'} value={option.value || ''}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* SEO Completeness Filter */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {language === 'ar' ? 'اكتمال SEO' : 'SEO Completion'}
              </label>
              <select
                value={filters.seoComplete}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  seoComplete: e.target.value as 'all' | 'complete' | 'incomplete'
                })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500/50 transition-colors cursor-pointer"
              >
                {seoOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Connections Filter */}
            <div>
              <label className="block text-xs text-gray-400 mb-2 flex items-center gap-1">
                <Link2 className="w-3 h-3" />
                {language === 'ar' ? 'عدد العلاقات' : 'Connections'}
              </label>
              <select
                value={filters.minConnections ?? ''}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  minConnections: e.target.value ? parseInt(e.target.value) : null
                })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-500/50 transition-colors cursor-pointer"
              >
                {connectionOptions.map((option) => (
                  <option key={option.value ?? 'all'} value={option.value ?? ''}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================
// FILTER SUMMARY COMPONENT
// =====================================================

interface FilterSummaryProps {
  filters: ServiceFilters;
  summary: FilterSummary;
  onClearFilters: () => void;
}

const FilterSummary: React.FC<FilterSummaryProps> = ({ filters, summary, onClearFilters }) => {
  const { language } = useLanguage();

  const hasActiveFilters = useMemo(() => {
    return (
      filters.category !== null ||
      filters.status !== null ||
      filters.seoComplete !== 'all' ||
      filters.minConnections !== null ||
      filters.searchQuery.trim() !== ''
    );
  }, [filters]);

  return (
    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-xl p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Filter Stats */}
        <div className="flex items-center gap-6">
          {/* Active Filters Count */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Filter className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">{summary.activeFilterCount}</p>
              <p className="text-xs text-gray-400">
                {language === 'ar' ? 'فلتر مفعل' : 'Active Filter'}
              </p>
            </div>
          </div>

          {/* Matching Services */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">
                {summary.matchingServicesCount}
                <span className="text-sm text-gray-400 mx-1">/</span>
                <span className="text-sm text-gray-500">{summary.totalServicesCount}</span>
              </p>
              <p className="text-xs text-gray-400">
                {language === 'ar' ? 'خدمات مطابقة' : 'Matching Services'}
              </p>
            </div>
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-all hover:scale-105"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">
              {language === 'ar' ? 'مسح جميع الفلاتر' : 'Clear All Filters'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

// =====================================================
// EMPTY STATE COMPONENT
// =====================================================

interface EmptyStateProps {
  onResetFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onResetFilters }) => {
  const { language } = useLanguage();

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-8 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-500/20 flex items-center justify-center">
        <Search className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        {language === 'ar' ? 'لا توجد خدمات مطابقة' : 'No Matching Services'}
      </h3>
      <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
        {language === 'ar'
          ? 'لم يتم العثور على خدمات تطابق المعايير المحددة. حاول تعديل الفلاتر.'
          : 'No services found matching your criteria. Try adjusting the filters.'}
      </p>
      <button
        onClick={onResetFilters}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-medium transition-all hover:scale-105"
      >
        <RefreshCw className="w-4 h-4" />
        <span>
          {language === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
        </span>
      </button>
    </div>
  );
};

// =====================================================
// MAIN SERVICE ANALYTICS FILTERS COMPONENT
// =====================================================

interface ServiceAnalyticsFiltersProps {
  children: (filteredServices: Service[]) => React.ReactNode;
}

const ServiceAnalyticsFilters: React.FC<ServiceAnalyticsFiltersProps> = ({ children }) => {
  const { services } = useServices();
  const { categories } = useCategories();
  const { language } = useLanguage();

  // Initialize filters state
  const [filters, setFilters] = useState<ServiceFilters>({
    category: null,
    status: null,
    seoComplete: 'all',
    minConnections: null,
    searchQuery: '',
  });

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      category: null,
      status: null,
      seoComplete: 'all',
      minConnections: null,
      searchQuery: '',
    });
  }, []);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: ServiceFilters) => {
    setFilters(newFilters);
  }, []);

  // Calculate filtered services
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      // Category filter
      if (filters.category && !service.categoryIds?.includes(filters.category)) {
        return false;
      }

      // Status filter
      if (filters.status && service.status !== filters.status) {
        return false;
      }

      // SEO completeness filter
      const seoComplete = isSEOComplete(service);
      if (filters.seoComplete === 'complete' && !seoComplete) {
        return false;
      }
      if (filters.seoComplete === 'incomplete' && seoComplete) {
        return false;
      }

      // Min connections filter
      if (filters.minConnections !== null) {
        const connectionCount = getConnectionCount(service, services);
        if (connectionCount < filters.minConnections) {
          return false;
        }
      }

      // Search query filter
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const titleMatch = service.title.toLowerCase().includes(query);
        const categoryMatch = service.category.toLowerCase().includes(query);
        const tagsMatch = service.tags?.some(tag => tag.toLowerCase().includes(query));

        // Also check content titles
        const enTitleMatch = service.content?.en?.title?.toLowerCase().includes(query);
        const arTitleMatch = service.content?.ar?.title?.toLowerCase().includes(query);

        if (!titleMatch && !categoryMatch && !tagsMatch && !enTitleMatch && !arTitleMatch) {
          return false;
        }
      }

      return true;
    });
  }, [services, filters]);

  // Calculate filter summary
  const filterSummary = useMemo((): FilterSummary => {
    const activeFilterCount = [
      filters.category !== null,
      filters.status !== null,
      filters.seoComplete !== 'all',
      filters.minConnections !== null,
      filters.searchQuery.trim() !== '',
    ].filter(Boolean).length;

    return {
      activeFilterCount,
      matchingServicesCount: filteredServices.length,
      totalServicesCount: services.length,
    };
  }, [filters, filteredServices, services]);

  // Get active categories for filter dropdown
  const activeCategories = useMemo(() => {
    return categories
      .filter(cat => cat.status === 'active')
      .map(cat => ({
        id: cat.id,
        name: cat.name,
        nameAr: cat.nameAr,
      }));
  }, [categories]);

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        categories={activeCategories}
      />

      {/* Filter Summary */}
      <FilterSummary
        filters={filters}
        summary={filterSummary}
        onClearFilters={clearFilters}
      />

      {/* Empty State or Children */}
      {filteredServices.length === 0 ? (
        <EmptyState onResetFilters={clearFilters} />
      ) : (
        children(filteredServices)
      )}
    </div>
  );
};

// =====================================================
// HELPER FUNCTIONS FOR SEO SCORE CALCULATION
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

// Export helper functions for use in other components
export { calculateServiceSEOScore, getConnectionCount, isSEOComplete };
export type { ServiceFilters, FilterSummary };

export default ServiceAnalyticsFilters;
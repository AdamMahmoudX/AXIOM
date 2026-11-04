// =====================================================
// SERVICE AUDIT LOG SYSTEM - AXIOMX ADMIN SYSTEM
// Phase 6A-6: Service Audit & Activity Logs
// =====================================================

import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  AuditLogEntry,
  AuditLogAction,
  AuditLogActionLabels,
  AuditLogActionIcons,
} from '../context/ServiceContext';
import {
  History,
  ChevronDown,
  ChevronRight,
  Filter,
  Download,
  Search,
  X,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Send,
  CheckCircle,
  XCircle,
  Eye,
  Archive,
  RotateCcw,
  FileText,
  ChevronUp,
  ChevronLeft,
} from 'lucide-react';
import Portal from './Portal';

const LucideIconsMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Plus,
  Edit2,
  Trash2,
  Copy,
  RotateCcw,
  CheckCircle,
  Eye,
  XCircle,
  History,
  Send,
  Archive,
  FileText,
};

// =====================================================
// AUDIT LOG FILTERS COMPONENT
// =====================================================

interface AuditLogFiltersProps {
  filters: {
    action: AuditLogAction | 'all';
    dateRange: 'all' | 'today' | 'week' | 'month';
    userId: string | 'all';
  };
  onFilterChange: (filters: AuditLogFiltersProps['filters']) => void;
  uniqueUsers: { id: string; name: string }[];
}

const AuditLogFilters: React.FC<AuditLogFiltersProps> = ({
  filters,
  onFilterChange,
  uniqueUsers,
}) => {
  const { language } = useLanguage();

  const actionOptions: { value: AuditLogAction | 'all'; label: string }[] = [
    { value: 'all', label: language === 'ar' ? 'الكل' : 'All Actions' },
    { value: 'create', label: language === 'ar' ? 'إنشاء' : 'Create' },
    { value: 'edit', label: language === 'ar' ? 'تعديل' : 'Edit' },
    { value: 'delete', label: language === 'ar' ? 'حذف' : 'Delete' },
    { value: 'duplicate', label: language === 'ar' ? 'نسخ' : 'Duplicate' },
    { value: 'status_change', label: language === 'ar' ? 'تغيير الحالة' : 'Status Change' },
    { value: 'approval_action', label: language === 'ar' ? 'إجراء موافقة' : 'Approval Action' },
    { value: 'publish', label: language === 'ar' ? 'نشر' : 'Publish' },
    { value: 'unpublish', label: language === 'ar' ? 'إلغاء النشر' : 'Unpublish' },
  ];

  const dateRangeOptions: { value: 'all' | 'today' | 'week' | 'month'; label: string }[] = [
    { value: 'all', label: language === 'ar' ? 'الكل' : 'All Time' },
    { value: 'today', label: language === 'ar' ? 'اليوم' : 'Today' },
    { value: 'week', label: language === 'ar' ? 'هذا الأسبوع' : 'This Week' },
    { value: 'month', label: language === 'ar' ? 'هذا الشهر' : 'This Month' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
      {/* Action Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-400" />
        <select
          value={filters.action}
          onChange={(e) => onFilterChange({ ...filters, action: e.target.value as AuditLogAction | 'all' })}
          className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {actionOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range Filter */}
      <div className="flex items-center gap-2">
        <select
          value={filters.dateRange}
          onChange={(e) => onFilterChange({ ...filters, dateRange: e.target.value as 'all' | 'today' | 'week' | 'month' })}
          className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {dateRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* User Filter */}
      <div className="flex items-center gap-2">
        <select
          value={filters.userId}
          onChange={(e) => onFilterChange({ ...filters, userId: e.target.value })}
          className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">
            {language === 'ar' ? 'جميع المستخدمين' : 'All Users'}
          </option>
          {uniqueUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      {(filters.action !== 'all' || filters.dateRange !== 'all' || filters.userId !== 'all') && (
        <button
          onClick={() => onFilterChange({ action: 'all', dateRange: 'all', userId: 'all' })}
          className="flex items-center gap-1 px-2 py-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-3 h-3" />
          {language === 'ar' ? 'مسح' : 'Clear'}
        </button>
      )}
    </div>
  );
};

// =====================================================
// AUDIT LOG ENTRY COMPONENT
// =====================================================

interface AuditLogEntryCardProps {
  entry: AuditLogEntry;
  isExpanded: boolean;
  onToggle: () => void;
}

const AuditLogEntryCard: React.FC<AuditLogEntryCardProps> = ({
  entry,
  isExpanded,
  onToggle,
}) => {
  const { language } = useLanguage();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return language === 'ar' ? 'الآن' : 'Just now';
    }
    if (diffMins < 60) {
      return language === 'ar'
        ? `منذ ${diffMins} ${diffMins === 1 ? 'دقيقة' : 'دقائق'}`
        : `${diffMins} ${diffMins === 1 ? 'min' : 'mins'} ago`;
    }
    if (diffHours < 24) {
      return language === 'ar'
        ? `منذ ${diffHours} ${diffHours === 1 ? 'ساعة' : 'ساعات'}`
        : `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    }
    if (diffDays < 7) {
      return language === 'ar'
        ? `منذ ${diffDays} ${diffDays === 1 ? 'يوم' : 'أيام'}`
        : `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    }
    return formatDate(dateStr);
  };

  const iconConfig = AuditLogActionIcons[entry.action];
  const IconComponent = LucideIconsMap[iconConfig.icon] || History;

  return (
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-colors">
      {/* Header */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer"
        onClick={onToggle}
      >
        {/* Icon */}
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${AuditLogActionIcons[entry.action].bgColor}`}>
          <IconComponent className={`w-5 h-5 ${AuditLogActionIcons[entry.action].color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-white font-medium text-sm">
              {AuditLogActionLabels[entry.action][language]}
            </h4>
            <span className="text-gray-500 text-xs">
              #{entry.serviceId.slice(-6)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-400 text-xs">
              {entry.userName}
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-500 text-xs">
              {getTimeAgo(entry.timestamp)}
            </span>
          </div>
        </div>

        {/* Expand Icon */}
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-white/10">
          <div className="mt-3 space-y-3">
            {/* Service Title */}
            {entry.serviceTitle && (
              <div className="flex items-start gap-2">
                <span className="text-gray-500 text-xs w-20 flex-shrink-0">
                  {language === 'ar' ? 'الخدمة:' : 'Service:'}
                </span>
                <span className="text-gray-300 text-xs">{entry.serviceTitle}</span>
              </div>
            )}

            {/* Action Details */}
            {entry.details && Object.keys(entry.details).length > 0 && (
              <div className="space-y-2">
                <span className="text-gray-500 text-xs">
                  {language === 'ar' ? 'التفاصيل:' : 'Details:'}
                </span>
                <div className="bg-white/5 rounded-lg p-3 space-y-1.5">
                  {Object.entries(entry.details).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-gray-300">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {entry.description && (
              <div className="flex items-start gap-2">
                <span className="text-gray-500 text-xs w-20 flex-shrink-0">
                  {language === 'ar' ? 'الوصف:' : 'Description:'}
                </span>
                <span className="text-gray-300 text-xs">{entry.description}</span>
              </div>
            )}

            {/* Timestamp */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <span className="text-gray-500 text-xs">
                {language === 'ar' ? 'الوقت:' : 'Time:'}
              </span>
              <span className="text-gray-400 text-xs">{formatDate(entry.timestamp)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================
// AUDIT LOG STATISTICS COMPONENT
// =====================================================

interface AuditLogStatsProps {
  entries: AuditLogEntry[];
}

const AuditLogStats: React.FC<AuditLogStatsProps> = ({ entries }) => {
  const { language } = useLanguage();

  const stats = useMemo(() => {
    const actionCounts: Record<AuditLogAction, number> = {
      create: 0,
      edit: 0,
      delete: 0,
      duplicate: 0,
      status_change: 0,
      approval_action: 0,
      publish: 0,
      unpublish: 0,
    };

    entries.forEach((entry) => {
      actionCounts[entry.action]++;
    });

    return actionCounts;
  }, [entries]);

  const statItems = [
    { key: 'create' as const, icon: Plus, color: 'text-green-400', bg: 'bg-green-500/20' },
    { key: 'edit' as const, icon: Edit2, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { key: 'delete' as const, icon: Trash2, color: 'text-red-400', bg: 'bg-red-500/20' },
    { key: 'duplicate' as const, icon: Copy, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { key: 'status_change' as const, icon: RotateCcw, color: 'text-amber-400', bg: 'bg-amber-500/20' },
    { key: 'publish' as const, icon: Eye, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
    { key: 'unpublish' as const, icon: XCircle, color: 'text-gray-400', bg: 'bg-gray-500/20' },
    { key: 'approval_action' as const, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  ];

  return (
    <div className="grid grid-cols-4 md:grid-cols-8 gap-2 p-4 bg-white/5 rounded-xl border border-white/10">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.key}
            className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-white/5 transition-colors"
            title={`${AuditLogActionLabels[item.key][language]}: ${stats[item.key]}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.bg}`}>
              <Icon className={`w-4 h-4 ${item.color}`} />
            </div>
            <span className="text-gray-400 text-xs">{stats[item.key]}</span>
          </div>
        );
      })}
    </div>
  );
};

// =====================================================
// SERVICE AUDIT HISTORY COMPONENT (Main Export)
// =====================================================

interface ServiceAuditHistoryProps {
  entries: AuditLogEntry[];
  serviceId: string;
  serviceTitle?: string;
  showStats?: boolean;
  showFilters?: boolean;
  maxHeight?: string;
}

export const ServiceAuditHistory: React.FC<ServiceAuditHistoryProps> = ({
  entries,
  serviceId,
  serviceTitle,
  showStats = true,
  showFilters = true,
  maxHeight = '600px',
}) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const [filters, setFilters] = useState<{
    action: AuditLogAction | 'all';
    dateRange: 'all' | 'today' | 'week' | 'month';
    userId: string | 'all';
  }>({
    action: 'all',
    dateRange: 'all',
    userId: 'all',
  });

  // Filter entries
  const filteredEntries = useMemo(() => {
    let result = entries.filter((entry) => entry.serviceId === serviceId);

    // Filter by action
    if (filters.action !== 'all') {
      result = result.filter((entry) => entry.action === filters.action);
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfWeek = new Date(startOfDay);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      result = result.filter((entry) => {
        const entryDate = new Date(entry.timestamp);
        switch (filters.dateRange) {
          case 'today':
            return entryDate >= startOfDay;
          case 'week':
            return entryDate >= startOfWeek;
          case 'month':
            return entryDate >= startOfMonth;
          default:
            return true;
        }
      });
    }

    // Filter by user
    if (filters.userId !== 'all') {
      result = result.filter((entry) => entry.userId === filters.userId);
    }

    return result;
  }, [entries, serviceId, filters]);

  // Get unique users for filter dropdown
  const uniqueUsers = useMemo(() => {
    const usersMap = new Map<string, string>();
    entries
      .filter((entry) => entry.serviceId === serviceId)
      .forEach((entry) => {
        if (!usersMap.has(entry.userId)) {
          usersMap.set(entry.userId, entry.userName);
        }
      });
    return Array.from(usersMap.entries()).map(([id, name]) => ({ id, name }));
  }, [entries, serviceId]);

  // Toggle entry expansion
  const toggleEntry = (entryId: string) => {
    setExpandedEntries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(entryId)) {
        newSet.delete(entryId);
      } else {
        newSet.add(entryId);
      }
      return newSet;
    });
  };

  // Export logs
  const handleExport = () => {
    const dataStr = JSON.stringify(filteredEntries, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-log-${serviceId}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const displayedEntries = showAll ? filteredEntries : filteredEntries.slice(0, 10);
  const hasMore = filteredEntries.length > 10;

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <History className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">
              {language === 'ar' ? 'سجل التدقيق' : 'Audit Log'}
            </h3>
            <p className="text-gray-500 text-xs">
              {serviceTitle
                ? `${language === 'ar' ? 'لـ' : 'For'} ${serviceTitle}`
                : language === 'ar'
                ? `${filteredEntries.length} سجل`
                : `${filteredEntries.length} entries`}
            </p>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 text-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          {language === 'ar' ? 'تصدير' : 'Export'}
        </button>
      </div>

      {/* Stats */}
      {showStats && entries.length > 0 && (
        <div className="px-4 pt-4">
          <AuditLogStats entries={entries.filter((e) => e.serviceId === serviceId)} />
        </div>
      )}

      {/* Filters */}
      {showFilters && entries.length > 0 && (
        <div className="px-4 pt-4">
          <AuditLogFilters
            filters={filters}
            onFilterChange={setFilters}
            uniqueUsers={uniqueUsers}
          />
        </div>
      )}

      {/* Entries List */}
      <div
        className="p-4 space-y-3 overflow-y-auto"
        style={{ maxHeight }}
      >
        {filteredEntries.length === 0 ? (
          <div className="text-center py-8">
            <History className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">
              {language === 'ar' ? 'لا توجد سجلات' : 'No audit entries'}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              {language === 'ar'
                ? 'ستظهر هنا جميع إجراءات الخدمة'
                : 'All service actions will appear here'}
            </p>
          </div>
        ) : (
          <>
            {displayedEntries.map((entry) => (
              <AuditLogEntryCard
                key={entry.id}
                entry={entry}
                isExpanded={expandedEntries.has(entry.id)}
                onToggle={() => toggleEntry(entry.id)}
              />
            ))}

            {/* Show More/Less */}
            {hasMore && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full py-3 text-center text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                {showAll ? (
                  <>
                    <ChevronUp className="w-4 h-4 inline mr-1" />
                    {language === 'ar' ? 'عرض أقل' : 'Show Less'}
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 inline mr-1" />
                    {language === 'ar'
                      ? `عرض ${filteredEntries.length - 10} سجلات أخرى`
                      : `Show ${filteredEntries.length - 10} more entries`}
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// =====================================================
// COMPACT AUDIT LOG PREVIEW (For Dashboard)
// =====================================================

interface AuditLogPreviewProps {
  entries: AuditLogEntry[];
  serviceId: string;
  limit?: number;
}

export const AuditLogPreview: React.FC<AuditLogPreviewProps> = ({
  entries,
  serviceId,
  limit = 5,
}) => {
  const { language } = useLanguage();

  const recentEntries = useMemo(() => {
    return entries
      .filter((entry) => entry.serviceId === serviceId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }, [entries, serviceId, limit]);

  if (recentEntries.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center py-4">
        {language === 'ar' ? 'لا توجد سجلات حديثة' : 'No recent activity'}
      </p>
    );
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return language === 'ar' ? 'الآن' : 'Just now';
    if (diffMins < 60) return language === 'ar' ? `منذ ${diffMins} د` : `${diffMins}m ago`;
    return language === 'ar' ? `منذ ${Math.floor(diffMins / 60)} س` : `${Math.floor(diffMins / 60)}h ago`;
  };

  return (
    <div className="space-y-2">
      {recentEntries.map((entry) => {
        const iconConfig = AuditLogActionIcons[entry.action];
        const IconComponent = LucideIconsMap[iconConfig.icon] || History;
        return (
          <div
            key={entry.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${AuditLogActionIcons[entry.action].bgColor}`}>
              <IconComponent className={`w-4 h-4 ${AuditLogActionIcons[entry.action].color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate">
                {AuditLogActionLabels[entry.action][language]}
              </p>
              <p className="text-gray-500 text-xs">
                {entry.userName} • {formatTime(entry.timestamp)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ServiceAuditHistory;
import {
  AuditLogActionLabels,
  AuditLogEntry,
} from '../context/ServiceContext';

export interface ActivityFeedItem {
  id: string;
  timestamp: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  source: 'service';
}

const formatRelativeTime = (timestamp: string, language: 'en' | 'ar'): string => {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 1) return language === 'ar' ? 'الآن' : 'Just now';
  if (minutes < 60) return language === 'ar' ? `منذ ${minutes} د` : `${minutes}m ago`;
  if (hours < 24) return language === 'ar' ? `منذ ${hours} س` : `${hours}h ago`;
  return language === 'ar' ? `منذ ${days} ي` : `${days}d ago`;
};

export const getRelativeTime = formatRelativeTime;

export const buildActivityFeed = ({
  auditLogs,
  limit = 20,
}: {
  auditLogs: AuditLogEntry[];
  limit?: number;
}): ActivityFeedItem[] => {
  const serviceItems: ActivityFeedItem[] = auditLogs.map((log) => {
    const label = AuditLogActionLabels[log.action];
    return {
      id: `service-${log.id}`,
      timestamp: log.timestamp,
      titleEn: label.en,
      titleAr: label.ar,
      descriptionEn: `${log.serviceTitle} · ${log.userName}`,
      descriptionAr: `${log.serviceTitle} · ${log.userName}`,
      source: 'service',
    };
  });

  return serviceItems
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
};

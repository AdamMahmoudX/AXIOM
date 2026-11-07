import React, { useMemo, useState } from 'react';
import { Activity, Boxes, Search } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { useServices } from '../../../context/ServiceContext';
import { buildActivityFeed, getRelativeTime } from '../../../utils/activityFeed';

const sourceIcon = {
  service: Boxes,
} as const;

const sourceColor = {
  service: 'bg-emerald-500/10 text-emerald-400',
} as const;

const ActivityPage: React.FC = () => {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const { auditLogs } = useServices();
  const [search, setSearch] = useState('');

  const activities = useMemo(
    () => buildActivityFeed({ auditLogs, limit: 100 }),
    [auditLogs]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return activities.filter((item) => {
      if (!query) return true;
      const haystack = [
        item.titleEn,
        item.titleAr,
        item.descriptionEn,
        item.descriptionAr,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [activities, search]);

  return (
    <div className="space-y-6">
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-end' : 'text-start'}>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Activity className="w-7 h-7 text-blue-400" />
            {language === 'ar' ? 'سجل النشاط' : 'Activity Logs'}
          </h1>
          <p className="text-gray-400 mt-1">
            {language === 'ar'
              ? 'سجل تغييرات الخدمات المسجلة فعلياً'
              : 'Recorded service change history'}
          </p>
        </div>
        <span className="px-3 py-1 text-sm bg-white/5 border border-white/10 rounded-full text-gray-300">
          {filtered.length} {language === 'ar' ? 'حدث' : 'events'}
        </span>
      </div>

      <div className={`flex flex-col md:flex-row gap-3 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
        <div className="relative flex-1">
          <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 ${isRTL ? 'right-3' : 'left-3'}`} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'ar' ? 'بحث في السجل...' : 'Search activity...'}
            className={`w-full py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 ${
              isRTL ? 'pr-10 pl-4 text-end' : 'pl-10 pr-4'
            }`}
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            {language === 'ar' ? 'لا توجد أنشطة مطابقة' : 'No matching activity yet'}
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {filtered.map((item) => {
              const Icon = sourceIcon[item.source];
              return (
                <li
                  key={item.id}
                  className={`flex items-start gap-4 p-4 hover:bg-white/[0.02] transition-colors ${
                    isRTL ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${sourceColor[item.source]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className={`flex-1 min-w-0 ${isRTL ? 'text-end' : 'text-start'}`}>
                    <div className={`flex items-center justify-between gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <p className="text-sm font-medium text-white">
                        {language === 'ar' ? item.titleAr : item.titleEn}
                      </p>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {getRelativeTime(item.timestamp, language)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 truncate">
                      {language === 'ar' ? item.descriptionAr : item.descriptionEn}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ActivityPage;

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useEmployees } from '../../context/EmployeeContext';
import { useProjects } from '../../context/ProjectContext';
import { useArticles } from '../../context/ArticleContext';
import { useServices } from '../../context/ServiceContext';
import { buildActivityFeed, getRelativeTime } from '../../utils/activityFeed';
import { Boxes, FolderKanban, FileText } from 'lucide-react';
import {
  Users,
  FolderKanban,
  FileText,
  Eye,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface StatCardProps {
  title: string;
  titleAr: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, titleAr, value, change, icon, color }) => {
  const { language, t } = useLanguage();
  const isPositive = change >= 0;
  const isRTL = language === 'ar';

  return (
    <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
      <div className={`flex items-start justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          {icon}
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className={`w-4 h-4 ${isRTL ? 'rotate-90' : ''}`} />
          ) : (
            <ArrowDownRight className={`w-4 h-4 ${isRTL ? 'rotate-90' : ''}`} />
          )}
          {Math.abs(change)}%
        </div>
      </div>
      <p className="text-3xl font-bold text-white mb-1 text-start rtl:text-end">{value}</p>
      <p className="text-sm text-gray-500 text-start rtl:text-end">{language === 'ar' ? titleAr : title}</p>
    </div>
  );
};

interface ChartBarProps {
  height: number;
  label: string;
}

const SimpleBarChart: React.FC<{ data: ChartBarProps[]; title: string; titleAr: string }> = ({
  data,
  title,
  titleAr,
}) => {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';
  const maxHeight = Math.max(...data.map((d) => d.height));

  return (
    <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6 text-start rtl:text-end">
        {language === 'ar' ? titleAr : title}
      </h3>
      <div className={`flex items-end gap-3 h-40 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {data.map((item, index) => (
          <div key={index} className={`flex-1 flex flex-col items-center gap-2 ${isRTL ? 'flex-col-reverse' : ''}`}>
            <div className="w-full bg-gradient-to-t from-blue-500/20 to-blue-500/5 rounded-t-lg relative group">
              <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500"
                style={{ height: `${(item.height / maxHeight) * 100}%` }}
              />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.height}%
              </div>
            </div>
            <span className="text-xs text-gray-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  titleAr: string;
  time: string;
  timeAr: string;
  description: string;
  descriptionAr: string;
  color: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  icon,
  title,
  titleAr,
  time,
  timeAr,
  description,
  descriptionAr,
  color,
}) => {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div className={`flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`flex items-center justify-between gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <p className="text-sm font-medium text-white text-start rtl:text-end">
            {language === 'ar' ? titleAr : title}
          </p>
          <span className={`text-xs text-gray-500 flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Clock className="w-3 h-3" />
            {language === 'ar' ? timeAr : time}
          </span>
        </div>
        <p className="text-xs text-gray-400 text-start rtl:text-end">
          {language === 'ar' ? descriptionAr : description}
        </p>
      </div>
    </div>
  );
};

const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const { employees } = useEmployees();
  const { projects } = useProjects();
  const { articles } = useArticles();
  const { services, auditLogs } = useServices();
  const isRTL = language === 'ar';

  const activeProjectsCount = useMemo(
    () => projects.filter((project) => project.status === 'in_progress').length,
    [projects]
  );

  const stats = useMemo(
    () => [
      {
        title: t('admin.totalUsers'),
        titleAr: t('admin.totalUsers'),
        value: employees.length.toLocaleString(),
        change: 0,
        icon: <Users className="w-6 h-6 text-blue-400" />,
        color: 'bg-blue-500/10',
      },
      {
        title: t('admin.activeProjects'),
        titleAr: t('admin.activeProjects'),
        value: activeProjectsCount.toLocaleString(),
        change: 0,
        icon: <FolderKanban className="w-6 h-6 text-emerald-400" />,
        color: 'bg-emerald-500/10',
      },
      {
        title: t('admin.articlesCount'),
        titleAr: t('admin.articlesCount'),
        value: articles.length.toLocaleString(),
        change: 0,
        icon: <FileText className="w-6 h-6 text-amber-400" />,
        color: 'bg-amber-500/10',
      },
      {
        title: t('admin.totalViews'),
        titleAr: t('admin.totalViews'),
        value: services.length.toLocaleString(),
        change: 0,
        icon: <Eye className="w-6 h-6 text-purple-400" />,
        color: 'bg-purple-500/10',
      },
    ],
    [activeProjectsCount, articles.length, employees.length, services.length, t]
  );

  const pieChartData = useMemo(() => {
    const total = projects.length + services.length + articles.length;
    const toPercent = (count: number) => (total > 0 ? Math.round((count / total) * 100) : 0);

    return [
      {
        label: language === 'ar' ? 'المشاريع' : 'Projects',
        value: toPercent(projects.length),
        color: 'bg-blue-500',
      },
      {
        label: language === 'ar' ? 'الخدمات' : 'Services',
        value: toPercent(services.length),
        color: 'bg-emerald-500',
      },
      {
        label: language === 'ar' ? 'المقالات' : 'Articles',
        value: toPercent(articles.length),
        color: 'bg-amber-500',
      },
      {
        label: language === 'ar' ? 'أخرى' : 'Other',
        value: total > 0 ? Math.max(0, 100 - toPercent(projects.length) - toPercent(services.length) - toPercent(articles.length)) : 0,
        color: 'bg-purple-500',
      },
    ];
  }, [articles.length, language, projects.length, services.length]);

  const chartData = [
    { height: 65, label: language === 'ar' ? 'يناير' : 'Jan' },
    { height: 45, label: language === 'ar' ? 'فبراير' : 'Feb' },
    { height: 78, label: language === 'ar' ? 'مارس' : 'Mar' },
    { height: 52, label: language === 'ar' ? 'أبريل' : 'Apr' },
    { height: 90, label: language === 'ar' ? 'مايو' : 'May' },
    { height: 68, label: language === 'ar' ? 'يونيو' : 'Jun' },
  ];

  const activityIcons = {
    service: Boxes,
    project: FolderKanban,
    article: FileText,
  } as const;

  const activityColors = {
    service: 'bg-emerald-500/10',
    project: 'bg-blue-500/10',
    article: 'bg-amber-500/10',
  } as const;

  const activities = useMemo(() => {
    return buildActivityFeed({ auditLogs, projects, articles, limit: 4 }).map((item) => {
      const Icon = activityIcons[item.source];
      return {
        icon: <Icon className={`w-5 h-5 ${item.source === 'service' ? 'text-emerald-400' : item.source === 'project' ? 'text-blue-400' : 'text-amber-400'}`} />,
        title: item.titleEn,
        titleAr: item.titleAr,
        time: getRelativeTime(item.timestamp, language),
        timeAr: getRelativeTime(item.timestamp, language),
        description: item.descriptionEn,
        descriptionAr: item.descriptionAr,
        color: activityColors[item.source],
      };
    });
  }, [articles, auditLogs, language, projects]);

  const getRoleLabel = (role: string | undefined) => {
    if (!role) return '';
    if (role === 'owner') return t('role.owner');
    if (role === 'admin') return language === 'ar' ? 'مدير النظام' : 'Admin';
    if (role === 'manager') return t('role.manager');
    if (role === 'employee') return t('role.employee');
    return role;
  };

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-end' : 'text-start'}>
          <h1 className="text-2xl font-bold text-white">
            {language === 'ar' ? t('admin.welcome') : t('admin.welcome')}, {user?.username}!
          </h1>
          <p className="text-gray-400 mt-1">
            {t('admin.welcomeSubtitle')}
          </p>
        </div>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="px-3 py-1 text-sm bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 capitalize">
            {getRoleLabel(user?.role)}
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart */}
        <div className="lg:col-span-2">
          <SimpleBarChart
            data={chartData}
            title={t('admin.monthlyPerformance')}
            titleAr={t('admin.monthlyPerformance')}
          />
        </div>

        {/* Pie chart */}
        <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 text-start rtl:text-end">
            {t('admin.contentDistribution')}
          </h3>
          <div className="space-y-4">
            {pieChartData.map((item, index) => (
              <div key={index} className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="flex-1 text-sm text-gray-400 text-start rtl:text-end">{item.label}</span>
                <span className="text-sm font-medium text-white">{item.value}%</span>
                <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
        <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h3 className="text-lg font-semibold text-white text-start rtl:text-end">
            {t('admin.recentActivity')}
          </h3>
          <Link
            to="/admin/activity"
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            {t('admin.viewAll')}
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activities.map((activity, index) => (
            <ActivityItem key={index} {...activity} />
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6 text-start rtl:text-end">
          {t('admin.quickActions')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: t('admin.newProject'), color: 'from-blue-500 to-blue-600' },
            { label: t('admin.addMember'), color: 'from-emerald-500 to-emerald-600' },
            { label: t('admin.writeArticle'), color: 'from-amber-500 to-amber-600' },
            { label: t('admin.sendMessage'), color: 'from-purple-500 to-purple-600' },
          ].map((action, index) => (
            <button
              key={index}
              className={`p-4 rounded-xl bg-gradient-to-r ${action.color} text-white font-medium text-sm hover:opacity-90 transition-opacity`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
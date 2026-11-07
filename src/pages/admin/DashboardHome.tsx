import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useEmployees } from '../../context/EmployeeContext';
import { useProjects } from '../../context/ProjectContext';
import { useArticles } from '../../context/ArticleContext';
import { useServices } from '../../context/ServiceContext';
import { buildActivityFeed, getRelativeTime } from '../../utils/activityFeed';
import {
  Boxes,
  Users,
  FolderKanban,
  FileText,
  Clock,
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  to: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, to }) => {
  return (
    <Link
      to={to}
      className="block bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-white mb-1 text-start rtl:text-end">{value}</p>
      <p className="text-sm text-gray-500 text-start rtl:text-end">{title}</p>
    </Link>
  );
};

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  titleAr: string;
  time: string;
  description: string;
  descriptionAr: string;
  color: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  icon,
  title,
  titleAr,
  time,
  description,
  descriptionAr,
  color,
}) => {
  const { language } = useLanguage();
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
            {time}
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
  const location = useLocation();
  const { employees } = useEmployees();
  const { projects } = useProjects();
  const { articles } = useArticles();
  const { services, auditLogs } = useServices();
  const isRTL = language === 'ar';
  const adminBase = location.pathname.startsWith('/ar/admin') ? '/ar/admin' : '/admin';

  const activeProjectsCount = useMemo(
    () => projects.filter((project) => project.status === 'in_progress').length,
    [projects]
  );

  const stats = useMemo(
    () => [
      {
        title: t('admin.employeesCount'),
        value: employees.length.toLocaleString(),
        icon: <Users className="w-6 h-6 text-blue-400" />,
        color: 'bg-blue-500/10',
        to: `${adminBase}/employees`,
      },
      {
        title: t('admin.activeProjects'),
        value: activeProjectsCount.toLocaleString(),
        icon: <FolderKanban className="w-6 h-6 text-emerald-400" />,
        color: 'bg-emerald-500/10',
        to: `${adminBase}/projects`,
      },
      {
        value: services.length.toLocaleString(),
        title: t('admin.servicesCount'),
        icon: <Boxes className="w-6 h-6 text-purple-400" />,
        color: 'bg-purple-500/10',
        to: `${adminBase}/services`,
      },
      {
        title: t('admin.articlesCount'),
        value: articles.length.toLocaleString(),
        icon: <FileText className="w-6 h-6 text-amber-400" />,
        color: 'bg-amber-500/10',
        to: `${adminBase}/articles`,
      },
    ],
    [activeProjectsCount, adminBase, articles.length, employees.length, services.length, t]
  );

  const activityIcons = {
    service: Boxes,
  } as const;

  const activityColors = {
    service: 'bg-emerald-500/10',
  } as const;

  const activities = useMemo(() => {
    return buildActivityFeed({ auditLogs, limit: 4 }).map((item) => {
      const Icon = activityIcons[item.source];
      return {
        id: item.id,
        icon: <Icon className="w-5 h-5 text-emerald-400" />,
        title: item.titleEn,
        titleAr: item.titleAr,
        time: getRelativeTime(item.timestamp, language),
        description: item.descriptionEn,
        descriptionAr: item.descriptionAr,
        color: activityColors[item.source],
      };
    });
  }, [auditLogs, language]);

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
            {t('admin.welcome')}, {user?.username}!
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
        {stats.map((stat) => (
          <StatCard key={stat.to} {...stat} />
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
        <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h3 className="text-lg font-semibold text-white text-start rtl:text-end">
            {t('admin.recentActivity')}
          </h3>
          <Link
            to={`${adminBase}/activity`}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            {t('admin.viewAll')}
          </Link>
        </div>
        {activities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map((activity) => (
              <ActivityItem key={activity.id} {...activity} />
            ))}
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-gray-500">
            {language === 'ar' ? 'لا توجد أنشطة مسجلة بعد' : 'No activity has been recorded yet'}
          </p>
        )}
      </div>

      {/* Quick actions */}
      <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6 text-start rtl:text-end">
          {t('admin.quickActions')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: t('admin.newProject'), color: 'from-blue-500 to-blue-600', to: `${adminBase}/projects/create` },
            { label: t('admin.addMember'), color: 'from-emerald-500 to-emerald-600', to: `${adminBase}/employees` },
            { label: t('admin.writeArticle'), color: 'from-amber-500 to-amber-600', to: `${adminBase}/articles/create` },
            { label: t('admin.sendMessage'), color: 'from-purple-500 to-purple-600', to: `${adminBase}/messages` },
          ].map((action, index) => (
            <Link
              key={index}
              to={action.to}
              className={`block p-4 rounded-xl bg-gradient-to-r ${action.color} text-white font-medium text-sm text-center hover:opacity-90 transition-opacity`}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
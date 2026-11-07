import { lazy } from 'react';
import { Link, Route, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const DashboardHome = lazy(() => import('../pages/admin/DashboardHome'));
const ProjectsPage = lazy(() => import('../pages/admin/pages/ProjectsPage'));
const ProjectCreatePage = lazy(() => import('../pages/admin/pages/ProjectCreatePage'));
const ProjectEditPage = lazy(() => import('../pages/admin/pages/ProjectEditPage'));
const ProjectViewPage = lazy(() => import('../pages/admin/pages/ProjectViewPage'));
const ServicesPage = lazy(() => import('../pages/admin/pages/ServicesPage'));
const ServiceCreatePage = lazy(() => import('../pages/admin/pages/ServiceCreatePage'));
const ServiceViewPage = lazy(() => import('../pages/admin/pages/ServiceViewPage'));
const CategoriesListPage = lazy(() => import('../pages/admin/pages/CategoriesListPage'));
const CategoryCreatePage = lazy(() => import('../pages/admin/pages/CategoryCreatePage'));
const CategoryEditPage = lazy(() => import('../pages/admin/pages/CategoryEditPage'));
const ArticlesPage = lazy(() => import('../pages/admin/pages/ArticlesPage'));
const ArticleCreatePage = lazy(() => import('../pages/admin/pages/ArticleCreatePage'));
const ArticleEditPage = lazy(() => import('../pages/admin/pages/ArticleEditPage'));
const EmployeeProfile = lazy(() => import('../pages/admin/pages/EmployeeProfile'));
const MessagesPage = lazy(() => import('../pages/admin/pages/MessagesPage'));
const ActivityPage = lazy(() => import('../pages/admin/pages/ActivityPage'));
const ChatPage = lazy(() => import('../pages/admin/pages/ChatPage'));
const AttachmentsPage = lazy(() => import('../pages/admin/pages/AttachmentsPage'));
const ServiceEditPage = lazy(() => import('../pages/admin/pages/ServiceEditPage'));
const EmployeesPage = lazy(() => import('../pages/admin/pages/EmployeesPage'));
const SettingsPage = lazy(() => import('../pages/admin/pages/SettingsPage'));
const PermissionsPage = lazy(() => import('../pages/admin/pages/PermissionsPage'));
const SEODashboardPage = lazy(() => import('../pages/admin/pages/SEODashboardPage'));

const AdminNotFound = () => {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  const adminBase = pathname.startsWith('/ar/admin') ? '/ar/admin' : '/admin';

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">404</p>
      <h1 className="mt-3 text-2xl font-bold text-white">
        {language === 'ar' ? 'الصفحة غير موجودة' : 'Page not found'}
      </h1>
      <Link to={adminBase} className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">
        {language === 'ar' ? 'العودة إلى لوحة التحكم' : 'Back to dashboard'}
      </Link>
    </div>
  );
};

export const AdminChildRoutes = (
  <>
    <Route index element={<DashboardHome />} />
    <Route path="projects" element={<ProjectsPage />} />
    <Route path="projects/create" element={<ProjectCreatePage />} />
    <Route path="projects/edit/:id" element={<ProjectEditPage />} />
    <Route path="projects/view/:id" element={<ProjectViewPage />} />
    <Route path="services" element={<ServicesPage />} />
    <Route path="services/create" element={<ServiceCreatePage />} />
    <Route path="services/edit/:serviceId" element={<ServiceEditPage />} />
    <Route path="services/view/:serviceId" element={<ServiceViewPage />} />
    <Route path="categories" element={<CategoriesListPage />} />
    <Route path="categories/create" element={<CategoryCreatePage />} />
    <Route path="categories/edit/:id" element={<CategoryEditPage />} />
    <Route path="articles" element={<ArticlesPage />} />
    <Route path="articles/create" element={<ArticleCreatePage />} />
    <Route path="articles/edit/:id" element={<ArticleEditPage />} />
    <Route path="employees" element={<EmployeesPage />} />
    <Route path="employees/:id" element={<EmployeeProfile />} />
    <Route path="messages" element={<MessagesPage />} />
    <Route path="chat" element={<ChatPage />} />
    <Route path="attachments" element={<AttachmentsPage />} />
    <Route path="settings" element={<SettingsPage />} />
    <Route path="permissions" element={<PermissionsPage />} />
    <Route path="activity" element={<ActivityPage />} />
    <Route path="seo-dashboard" element={<SEODashboardPage />} />
    <Route path="*" element={<AdminNotFound />} />
  </>
);

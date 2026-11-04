import { lazy } from 'react';
import { Route } from 'react-router-dom';

import DashboardHome from '../pages/admin/DashboardHome';
import ProjectsPage from '../pages/admin/pages/ProjectsPage';
import ProjectCreatePage from '../pages/admin/pages/ProjectCreatePage';
import ProjectEditPage from '../pages/admin/pages/ProjectEditPage';
import ProjectViewPage from '../pages/admin/pages/ProjectViewPage';
import ServicesPage from '../pages/admin/pages/ServicesPage';
import ServiceCreatePage from '../pages/admin/pages/ServiceCreatePage';
import ServiceViewPage from '../pages/admin/pages/ServiceViewPage';
import CategoriesListPage from '../pages/admin/pages/CategoriesListPage';
import CategoryCreatePage from '../pages/admin/pages/CategoryCreatePage';
import CategoryEditPage from '../pages/admin/pages/CategoryEditPage';
import ArticlesPage from '../pages/admin/pages/ArticlesPage';
import ArticleCreatePage from '../pages/admin/pages/ArticleCreatePage';
import ArticleEditPage from '../pages/admin/pages/ArticleEditPage';
import EmployeeProfile from '../pages/admin/pages/EmployeeProfile';
import MessagesPage from '../pages/admin/pages/MessagesPage';

const ActivityPage = lazy(() => import('../pages/admin/pages/ActivityPage'));
const ChatPage = lazy(() => import('../pages/admin/pages/ChatPage'));
const AttachmentsPage = lazy(() => import('../pages/admin/pages/AttachmentsPage'));

const ServiceEditPage = lazy(() => import('../pages/admin/pages/ServiceEditPage'));
const EmployeesPage = lazy(() => import('../pages/admin/pages/EmployeesPage'));
const SettingsPage = lazy(() => import('../pages/admin/pages/SettingsPage'));
const PermissionsPage = lazy(() => import('../pages/admin/pages/PermissionsPage'));
const SEODashboardPage = lazy(() => import('../pages/admin/pages/SEODashboardPage'));

export const AdminChildRoutes = () => (
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
  </>
);

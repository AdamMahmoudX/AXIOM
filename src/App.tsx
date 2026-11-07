import React, { lazy, Suspense } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

// Hooks
import { useAxiomXLoginShortcut } from './hooks/useKeyboardShortcut';

// Components
import { PageLoader } from './components/common';
import { SharedLayout, HomePage } from './components/home';
import ProtectedRoute from './components/ProtectedRoute';
import { AdminChildRoutes } from './routes/adminRoutes';
import SiteVisualEditor from './components/SiteVisualEditor';

// Lazy loaded public pages
const ServicePage = lazy(() => import('./pages/services/ServicePage'));
const ArticlePage = lazy(() => import('./pages/articles/ArticlePage'));
const ProjectsPagePublic = lazy(() => import('./pages/projects/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/projects/ProjectDetailPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const PendingApprovalPage = lazy(() => import('./pages/auth/PendingApprovalPage'));
const EmployeePendingPage = lazy(() => import('./pages/auth/EmployeePendingPage'));
const EmployeeRegistrationWizard = lazy(() => import('./pages/auth/EmployeeRegistrationWizard'));
const OnboardingWizard = lazy(() => import('./pages/auth/OnboardingWizard'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const ArticlesPage = lazy(() => import('./pages/admin/pages/ArticlesPage'));
const ArticleCreatePage = lazy(() => import('./pages/admin/pages/ArticleCreatePage'));
const ArticleEditPage = lazy(() => import('./pages/admin/pages/ArticleEditPage'));
const ArticleEditorRoute = lazy(() => import('./components/ArticleEditorRoute'));

const publicPages = [
  { path: '/', element: <HomePage /> },
  { path: '/projects', element: <ProjectsPagePublic /> },
  { path: '/projects/:projectSlug', element: <ProjectDetailPage /> },
  { path: '/services/:serviceId', element: <ServicePage /> },
  { path: '/articles/:slug', element: <ArticlePage /> },
];

const createPublicRoutes = (prefix = '') =>
  publicPages.map(({ path, element }) => {
    const routePath = path === '/' ? prefix || '/' : `${prefix}${path}`;
    return (
      <Route
        key={routePath}
        path={routePath}
        element={<SharedLayout>{element}</SharedLayout>}
      />
    );
  });

const KeyboardShortcutHandler: React.FC = () => {
  const navigate = useNavigate();
  useAxiomXLoginShortcut(() => { navigate('/login'); });
  return null;
};

const AdminUnavailablePage: React.FC = () => (
  <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-center">
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-white">لوحة الإدارة غير متاحة / Admin unavailable</h1>
      <p className="mt-3 text-gray-400">
        يلزم ربط خادم مصادقة وإدارة محتوى دائمة قبل تفعيلها.
        Authentication and persistent CMS services are required before enabling it.
      </p>
      <Link to="/" className="mt-6 inline-block text-blue-400 hover:text-blue-300">
        العودة للرئيسية / Back to home
      </Link>
    </div>
  </main>
);

const AppWithIntro: React.FC = () => {
  return <App />;
};

function App() {
  const adminLayout = (
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  );

  return (
    <>
      <KeyboardShortcutHandler />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {createPublicRoutes()}
          {createPublicRoutes('/ar')}

          <Route path="/login" element={<LoginPage />} />
          <Route path="/pending-approval" element={<PendingApprovalPage />} />
          <Route path="/cms/articles" element={<ArticleEditorRoute><ArticlesPage /></ArticleEditorRoute>} />
          <Route path="/cms/articles/create" element={<ArticleEditorRoute><ArticleCreatePage /></ArticleEditorRoute>} />
          <Route path="/cms/articles/edit/:id" element={<ArticleEditorRoute><ArticleEditPage /></ArticleEditorRoute>} />
          {import.meta.env.PROD && (
            <>
              <Route path="/admin/*" element={<AdminUnavailablePage />} />
              <Route path="/ar/admin/*" element={<AdminUnavailablePage />} />
            </>
          )}
          {import.meta.env.DEV && (
            <>
              <Route path="/employee-registration" element={<EmployeeRegistrationWizard />} />
              <Route path="/employee-pending" element={<EmployeePendingPage />} />
              <Route path="/onboarding/*" element={<OnboardingWizard />} />

              <Route path="/admin" element={adminLayout}>
                {AdminChildRoutes}
              </Route>
              <Route path="/ar/admin" element={adminLayout}>
                {AdminChildRoutes}
              </Route>
            </>
          )}
        </Routes>
      </Suspense>
      <SiteVisualEditor />
    </>
  );
}

export default AppWithIntro;

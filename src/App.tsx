import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { EmployeeProvider } from './context/EmployeeContext';
import { ProjectProvider } from './context/ProjectContext';
import { ServiceProvider } from './context/ServiceContext';
import { CategoryProvider } from './context/CategoryContext';
import { ArticleProvider } from './context/ArticleContext';

// Hooks
import { useAxiomXLoginShortcut } from './hooks/useKeyboardShortcut';

// Components
import { PageLoader } from './components/common';
import { IntroAnimation } from './components/animations';
import { SharedLayout, HomePage } from './components/home';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import { AdminChildRoutes } from './routes/adminRoutes';

// Pages - Auth
import LoginPage from './pages/auth/LoginPage';
import PendingApprovalPage from './pages/auth/PendingApprovalPage';
import EmployeePendingPage from './pages/auth/EmployeePendingPage';
import EmployeeRegistrationWizard from './pages/auth/EmployeeRegistrationWizard';
import OnboardingWizard from './pages/auth/OnboardingWizard';

// Lazy loaded public pages
const ServicePage = lazy(() => import('./pages/services/ServicePage'));
const ArticlePage = lazy(() => import('./pages/articles/ArticlePage'));
const ProjectsPagePublic = lazy(() => import('./pages/projects/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/projects/ProjectDetailPage'));

// Service routing configuration
const servicesConfig = [
  { id: 'web-engineering', titleKey: 'services.web', descKey: 'services.web.desc', route: '/services/web-engineering' },
  { id: 'mobile-applications', titleKey: 'services.mobile', descKey: 'services.mobile.desc', route: '/services/mobile-applications' },
  { id: 'ui-ux-architecture', titleKey: 'services.ui', descKey: 'services.ui.desc', route: '/services/ui-ux-architecture' },
  { id: 'ai-systems', titleKey: 'services.ai', descKey: 'services.ai.desc', route: '/services/ai-systems' },
  { id: 'game-development', titleKey: 'services.games', descKey: 'services.games.desc', route: '/services/game-development' },
  { id: 'digital-infrastructure', titleKey: 'services.software', descKey: 'services.software.desc', route: '/services/digital-infrastructure' },
];

const KeyboardShortcutHandler: React.FC = () => {
  const navigate = useNavigate();

  useAxiomXLoginShortcut(() => {
    navigate('/login');
  });

  return null;
};

export const getLanguageFromPath = (pathname: string): 'en' | 'ar' | null => {
  if (pathname.startsWith('/ar') || pathname.startsWith('/ar/')) {
    return 'ar';
  }
  return null;
};

export const getPathWithoutLanguage = (pathname: string): string => {
  if (pathname.startsWith('/ar')) {
    return pathname.replace(/^\/ar/, '') || '/';
  }
  return pathname;
};

export const buildLocalizedPath = (path: string, language: 'en' | 'ar'): string => {
  if (language === 'ar') {
    return `/ar${path === '/' ? '' : path}`;
  }
  return path;
};

const AppWithIntro: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('axiomx_intro_seen');
    if (hasSeenIntro) {
      setShowIntro(false);
    }
  }, []);

  const handleIntroComplete = useCallback(() => {
    localStorage.setItem('axiomx_intro_seen', 'true');
    setShowIntro(false);
  }, []);

  return (
    <>
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
      <App />
    </>
  );
};

function App() {
  const adminLayout = (
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  );

  return (
    <AuthProvider>
      <EmployeeProvider>
        <ProjectProvider>
          <ServiceProvider>
            <CategoryProvider>
              <ArticleProvider>
                <KeyboardShortcutHandler />
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* English Public routes */}
                    <Route path="/" element={<SharedLayout><HomePage /></SharedLayout>} />
                    <Route path="/projects" element={<SharedLayout><ProjectsPagePublic /></SharedLayout>} />
                    <Route path="/projects/:projectSlug" element={<SharedLayout><ProjectDetailPage /></SharedLayout>} />
                    <Route path="/services/:serviceId" element={<SharedLayout><ServicePage /></SharedLayout>} />
                    <Route path="/articles/:slug" element={<SharedLayout><ArticlePage /></SharedLayout>} />

                    {/* Arabic Public routes (/ar/*) */}
                    <Route path="/ar" element={<SharedLayout><HomePage /></SharedLayout>} />
                    <Route path="/ar/" element={<SharedLayout><HomePage /></SharedLayout>} />
                    <Route path="/ar/projects" element={<SharedLayout><ProjectsPagePublic /></SharedLayout>} />
                    <Route path="/ar/projects/:projectSlug" element={<SharedLayout><ProjectDetailPage /></SharedLayout>} />
                    <Route path="/ar/services/:serviceId" element={<SharedLayout><ServicePage /></SharedLayout>} />
                    <Route path="/ar/articles/:slug" element={<SharedLayout><ArticlePage /></SharedLayout>} />

                    {/* Authentication routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/employee-registration" element={<EmployeeRegistrationWizard />} />
                    <Route path="/employee-pending" element={<EmployeePendingPage />} />
                    <Route path="/pending-approval" element={<PendingApprovalPage />} />
                    <Route path="/onboarding/*" element={<OnboardingWizard />} />

                    {/* Admin routes */}
                    <Route path="/admin" element={adminLayout}>
                      <AdminChildRoutes />
                    </Route>
                    <Route path="/ar/admin" element={adminLayout}>
                      <AdminChildRoutes />
                    </Route>
                  </Routes>
                </Suspense>
              </ArticleProvider>
            </CategoryProvider>
          </ServiceProvider>
        </ProjectProvider>
      </EmployeeProvider>
    </AuthProvider>
  );
}

export default AppWithIntro;
export { servicesConfig };

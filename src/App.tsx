import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

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

const KeyboardShortcutHandler: React.FC = () => {
  const navigate = useNavigate();
  useAxiomXLoginShortcut(() => { navigate('/login'); });
  return null;
};

const AppWithIntro: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('axiomx_intro_seen');
    if (hasSeenIntro) setShowIntro(false);
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
    <>
      <KeyboardShortcutHandler />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path=\"/\" element={<SharedLayout><HomePage /></SharedLayout>} />
          <Route path=\"/projects\" element={<SharedLayout><ProjectsPagePublic /></SharedLayout>} />
          <Route path=\"/projects/:projectSlug\" element={<SharedLayout><ProjectDetailPage /></SharedLayout>} />
          <Route path=\"/services/:serviceId\" element={<SharedLayout><ServicePage /></SharedLayout>} />
          <Route path=\"/articles/:slug\" element={<SharedLayout><ArticlePage /></SharedLayout>} />

          <Route path=\"/ar\" element={<SharedLayout><HomePage /></SharedLayout>} />
          <Route path=\"/ar/\" element={<SharedLayout><HomePage /></SharedLayout>} />
          <Route path=\"/ar/projects\" element={<SharedLayout><ProjectsPagePublic /></SharedLayout>} />
          <Route path=\"/ar/projects/:projectSlug\" element={<SharedLayout><ProjectDetailPage /></SharedLayout>} />
          <Route path=\"/ar/services/:serviceId\" element={<SharedLayout><ServicePage /></SharedLayout>} />
          <Route path=\"/ar/articles/:slug\" element={<SharedLayout><ArticlePage /></SharedLayout>} />

          <Route path=\"/login\" element={<LoginPage />} />
          <Route path=\"/employee-registration\" element={<EmployeeRegistrationWizard />} />
          <Route path=\"/employee-pending\" element={<EmployeePendingPage />} />
          <Route path=\"/pending-approval\" element={<PendingApprovalPage />} />
          <Route path=\"/onboarding/*\" element={<OnboardingWizard />} />

          <Route path=\"/admin\" element={adminLayout}>
            <AdminChildRoutes />
          </Route>
          <Route path=\"/ar/admin\" element={adminLayout}>
            <AdminChildRoutes />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default AppWithIntro;

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="relative">
          <div className="absolute -inset-10 rounded-full bg-blue-500/20 animate-ping" />
          <div className="relative w-16 h-16 border-2 border-blue-500/50 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const authStatus = user.authStatus ?? 'active';

  if (authStatus === 'pending_review' || authStatus === 'pending_registration') {
    return <Navigate to="/onboarding/step-1" state={{ from: location }} replace />;
  }

  if (authStatus === 'pending_approval') {
    return <Navigate to="/pending-approval" state={{ from: location }} replace />;
  }

  if (authStatus === 'suspended' || authStatus === 'rejected') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (authStatus === 'active') {
    return <>{children}</>;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;

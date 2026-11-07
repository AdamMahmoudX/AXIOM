import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { isSiteEditorAccount } from '../config/siteEditor';

const ArticleEditorRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading, user } = useAuth();
  const { language } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-gray-300">
        {language === 'ar' ? 'جارٍ التحقق من صلاحية التحرير...' : 'Checking editor access...'}
      </div>
    );
  }

  if (!user || !isSiteEditorAccount(user.id)) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default ArticleEditorRoute;

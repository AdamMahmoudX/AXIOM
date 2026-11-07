import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const ProjectDetailPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">{t('common.notFound')}</h1>
        <Link to="/" className="text-blue-400 hover:text-blue-300">
          {t('common.returnHome')}
        </Link>
      </div>
    </div>
  );
};

export default ProjectDetailPage;

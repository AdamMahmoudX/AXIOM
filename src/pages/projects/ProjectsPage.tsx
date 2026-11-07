import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useProjects } from '../../context/ProjectContext';
import { PROJECT_STATUS_LABELS } from '../../types/project';

/**
 * =====================================================
 * PROJECTS PAGE - Simple vertical card layout
 * Each card represents one project from CMS context
 * =====================================================
 */

const ProjectsPage: React.FC = () => {
  const { t, isRTL, language } = useLanguage();
  const { projects } = useProjects();
  const navigate = useNavigate();
  const lang = language === 'ar' ? 'ar' : 'en';
  const prefix = language === 'ar' ? '/ar' : '';

  const publicProjects = projects.filter((p) => p.status !== 'cancelled');

  const handleProjectClick = (slug: string) => {
    navigate(`${prefix}/projects/${slug}`);
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-[72px]">
      {/* Header */}
      <div className="py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">{t('projects.title')}</h1>
          <p className="text-gray-400">{t('projects.subtitle')}</p>
        </div>
      </div>

      {/* Vertical Cards List */}
      <div className="px-6 pb-16">
        <div className="max-w-3xl mx-auto space-y-6">
          {publicProjects.length === 0 ? (
            <p className="py-12 text-center text-gray-400">{t('projects.empty')}</p>
          ) : publicProjects.map((project) => {
            const title = project.content[lang].title || project.name;
            const description = project.shortDescription || project.content[lang].excerpt;
            const slug = project.content.en.slug;
            const category = project.category || '';
            const statusLabel = PROJECT_STATUS_LABELS[project.status][lang];

            return (
              <article
                key={project.id}
                onClick={() => handleProjectClick(slug)}
                className="group cursor-pointer bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]"


              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0">
                    <img
                      src={project.image}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      {category && (
                        <span
                          className="px-3 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30"

                        >
                          {category}
                        </span>
                      )}
                      <span
                        className="text-xs text-gray-500"

                      >
                        {statusLabel}
                      </span>
                    </div>

                    <h2
                      className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300"

                    >
                      {title}
                    </h2>

                    <p
                      className="text-gray-400 text-sm leading-relaxed mb-4"

                    >
                      {description}
                    </p>

                    <div
                      className="flex items-center gap-2 text-blue-400 text-sm"

                    >
                      <span>{t('projects.viewProject')}</span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-blue-500/3 blur-2xl" />
      </div>
    </div>
  );
};

export default ProjectsPage;

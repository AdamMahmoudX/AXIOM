import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useProjects } from '../../context/ProjectContext';
import { PROJECT_STATUS_LABELS } from '../../types/project';
import { ProjectCard } from '../cards';

const ProjectsSection: React.FC = () => {
  const { t, language } = useLanguage();
  const { projects } = useProjects();
  const lang = language === 'ar' ? 'ar' : 'en';

  const projectsList = projects
    .filter((p) => p.status !== 'cancelled')
    .slice(0, 6)
    .map((project) => ({
      image: project.image,
      title: project.content[lang].title || project.name,
      description: project.shortDescription || project.content[lang].excerpt,
      tags: project.category ? [project.category] : [],
      status: PROJECT_STATUS_LABELS[project.status][lang],
      technologies: project.client ? [project.client] : [],
      slug: project.content.en.slug,
    }));

  if (projectsList.length === 0) return null;

  return (
    <section id="projects" className="py-32 bg-[#050505] relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
            linear-gradient(225deg, rgba(34, 197, 94, 0.05) 0%, transparent 50%)
          `
        }} />
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/5 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-gradient-to-r from-green-600/10 to-teal-500/5 blur-3xl" />
      </div>

      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-green-500/20 rounded-tl-3xl" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-green-500/20 rounded-br-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {t('projects.title')}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('projects.cuttingEdge')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsList.map((project, index) => (
            <ProjectCard key={project.slug} {...project} delay={index * 150} cardIndex={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
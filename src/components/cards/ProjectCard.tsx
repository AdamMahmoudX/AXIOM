import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

interface ProjectCardProps {
  image: string;
  title: string;
  description: string;
  tags: string[];
  status: string;
  technologies: string[];
  delay: number;
  cardIndex: number;
  slug: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  image, title, description, tags, status, technologies, delay, cardIndex, slug
}) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const prefix = language === 'ar' ? '/ar' : '';
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={cardRef}
      onClick={() => navigate(`${prefix}/projects/${slug}`)}
      className={`group relative rounded-2xl overflow-hidden transition-all duration-700 cursor-pointer ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl group-hover:border-green-500/30 transition-all duration-500" />
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-100/5 via-transparent to-gray-900/20 group-hover:from-green-500/10 group-hover:to-transparent transition-all duration-500" />
      <div className="absolute inset-0 rounded-2xl shadow-[0_0_60px_rgba(34,197,94,0)] group-hover:shadow-[0_0_60px_rgba(34,197,94,0.15)] transition-all duration-500" />

      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="relative">
          <div className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-60 group-hover:opacity-80 transition-opacity" />
          <div className="relative w-2.5 h-2.5 rounded-full bg-gradient-to-br from-green-400 via-green-500 to-green-600 shadow-[0_0_10px_rgba(34,197,94,0.8)]">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
          </div>
        </div>
        <span
          className="px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(34,197,94,0.1) 100%)',
            border: '1px solid rgba(34,197,94,0.3)',
            color: '#4ade80',
            textShadow: '0 0 10px rgba(34,197,94,0.5)'
          }}
        >
          {status}
        </span>
      </div>

      <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/10 to-transparent animate-pulse"
               style={{ transform: 'translateY(-100%)', animation: 'scan 2s ease-in-out infinite' }} />
        </div>
      </div>

      <div className="relative p-6 space-y-4">
        <h3
          className="text-xl font-bold text-white group-hover:text-green-400 transition-colors duration-300"
          style={{ textShadow: '0 0 20px rgba(255,255,255,0.1)' }}
        >
          {title}
        </h3>

        <p className="text-gray-400 text-sm leading-relaxed">
          {description}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs font-medium rounded-lg transition-all duration-300 group-hover:border-green-500/30"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#9ca3af'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {technologies.length > 0 && (
          <div className="flex items-center gap-3 pt-2 border-t border-white/5">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">{t('projects.tech') || 'Tech:'}</span>
            <div className="flex flex-wrap gap-1.5">
              {technologies.slice(0, 4).map((tech, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-[10px] rounded bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-500/20 text-blue-400/80"
                >
                  {tech}
                </span>
              ))}
              {technologies.length > 4 && (
                <span className="px-2 py-0.5 text-[10px] rounded bg-white/5 text-gray-500">
                  +{technologies.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl">
          <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-green-500/0 group-hover:border-green-500/50 transition-all duration-500"
               style={{ transform: 'translate(30%, -30%) rotate(45deg)' }} />
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </div>
  );
};

export default ProjectCard;
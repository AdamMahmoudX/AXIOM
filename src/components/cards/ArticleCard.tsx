import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

interface ArticleCardProps {
  slug: string;
  image: string;
  title: string;
  description: string;
  category: string;
  readTime: number;
  delay: number;
  cardIndex: number;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  slug, image, title, description, category, readTime, delay, cardIndex
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTimeout(() => setIsVisible(true), delay);
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={`group cursor-pointer transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      onClick={() => navigate(`/articles/${slug}`)}
    >
      <div className="relative rounded-2xl overflow-hidden bg-white/[0.02] border border-white/5 group-hover:border-blue-500/30 transition-all duration-300">
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent" />
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-3">
            <span className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {category}
            </span>
            <span className="text-gray-500 text-sm">{readTime} {t('read.time')}</span>
          </div>
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-300 mb-2">
            {title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2">
            {description}
          </p>
          <div className="flex items-center gap-2 mt-4 text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>{t('articles.readArticle')}</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
};

export default ArticleCard;
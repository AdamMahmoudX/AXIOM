import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

interface ServiceCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  route: string;
  delay: number;
  cardIndex: number;
}

const defaultServiceIcon = (
  <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9" />
  </svg>
);

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, route, delay, cardIndex }) => {
  const { t, isRTL } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

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
    <div ref={cardRef}>
      <Link
        to={route}
        className={`group relative block p-8 rounded-2xl bg-white/[0.02] border border-white/5 transition-all duration-700 hover:border-blue-500/30 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-6 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300">
          {icon || defaultServiceIcon}
        </div>

        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
          {title}
        </h3>

        <p className="text-gray-400 leading-relaxed mb-6">
          {description}
        </p>

        <div className="flex items-center text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>{t('services.exploreService')}</span>
          <svg className={`w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500/0 group-hover:border-blue-500/50 transition-colors duration-500 rounded-tr-2xl" />
        </div>
      </Link>
    </div>
  );
};

export default ServiceCard;
import React, { useState, useEffect } from 'react';
import { GridBackground, FloatingParticles } from '../animations';
import { ClientFormModal } from '../modals';
import { AXIOMXLogo } from '../common';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
      <GridBackground />
      <FloatingParticles />

      <div
        className="absolute w-96 h-96 rounded-full pointer-events-none transition-all duration-1000 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          left: mousePos.x - 192,
          top: mousePos.y - 192,
        }}
      />

      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center">
        <div
          className="mb-8 flex justify-center"
          style={{ marginTop: '20px', marginBottom: '10px' }}
        >
          <div className="relative flex items-center justify-center">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(120,180,255,0.18) 0%, rgba(120,180,255,0.08) 35%, transparent 75%)',
                filter: 'blur(80px)',
                opacity: 0.9,
                width: '600px',
                height: '300px',
                transform: 'translate(-40px, -50px)',
              }}
            />
            <img
              src="/axiomx-logo.png"
              alt="AXIOMX Logo"
              loading="eager"
              fetchPriority="high"
              className="relative w-[520px] max-w-full object-contain"
              data-guide-id="hero.logo"
              data-guide-name="Hero AXIOMX Logo"
              data-guide-type="logo"
              data-guide-target="/"
              style={{
                animation: 'float 6s ease-in-out infinite',
                background: 'transparent',
                opacity: '1',
                visibility: 'visible',
              }}
            />
          </div>
        </div>

        <div>
          <p className="text-xl sm:text-2xl text-blue-400 font-medium mb-4 tracking-wide">
            {t('hero.subtitle')}
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('hero.description')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            className="group relative px-8 py-4 rounded-xl overflow-hidden cursor-pointer bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all duration-300"
            data-guide-id="hero.login"
            data-guide-name="Join AXIOMX Team Button"
            data-guide-type="button"
            data-guide-target="/login"
          >
            <span className="relative text-white font-medium flex items-center gap-2">
              <svg className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              {t('hero.joinTeam')}
            </span>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      <ClientFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </section>
  );
};

export default HeroSection;
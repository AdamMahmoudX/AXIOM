import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Languages, LogIn } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useLanguageSwitch } from '../../utils/LanguageSwitchHelper';
import { AXIOMXLogo } from '../common';

const Navigation: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const { t, isRTL } = useLanguage();
  const { switchLanguage, getCurrentLanguage } = useLanguageSwitch();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#050505]/80 backdrop-blur-xl border-b border-white/5' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/"
            className="flex items-center gap-2 group"
            data-guide-id="nav.logo"
            data-guide-name="AXIOMX Logo"
            data-guide-type="logo"
            data-guide-target="/"
          >
            <AXIOMXLogo />
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {!import.meta.env.PROD && (
            <Link
              to="/login"
              className="group inline-flex h-10 items-center gap-2 rounded-xl border border-blue-400/30 bg-gradient-to-r from-blue-600 to-blue-500 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300/60 hover:from-blue-500 hover:to-blue-400 hover:shadow-blue-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
              data-guide-id="nav.login"
              data-guide-name="Log in"
              data-guide-type="button"
              data-guide-target="/login"
            >
              <LogIn size={16} aria-hidden="true" className={isRTL ? 'rotate-180' : ''} />
              <span>{t('nav.login')}</span>
            </Link>
          )}
          <button
            onClick={() => switchLanguage(getCurrentLanguage() === 'en' ? 'ar' : 'en')}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm font-medium text-gray-200 transition-all duration-300 hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
            aria-label={`Switch language to ${getCurrentLanguage() === 'en' ? 'Arabic' : 'English'}`}
            data-guide-id="nav.language-switch"
            data-guide-name="Language Switch"
            data-guide-type="button"
            data-guide-target={getCurrentLanguage() === 'en' ? 'ar' : 'en'}
          >
            <Languages size={17} aria-hidden="true" className="text-blue-300" />
            <span>{getCurrentLanguage() === 'en' ? 'العربية' : 'English'}</span>
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navigation;
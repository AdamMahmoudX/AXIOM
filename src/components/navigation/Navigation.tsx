import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';
import { useLanguageSwitch } from '../../utils/LanguageSwitchHelper';
import { AXIOMXLogo } from '../common';

const Navigation: React.FC = () => {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { handleNavigationClick } = useSmoothScroll();
  const { switchLanguage, getLanguageLabel, getCurrentLanguage } = useLanguageSwitch();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getLocalizedHref = (path: string): string => {
    const currentLang = getCurrentLanguage();
    if (currentLang === 'ar' && !path.startsWith('#')) {
      return `/ar${path === '/' ? '' : path}`;
    }
    return path;
  };

  const navItems = [
    { key: 'nav.home', href: '#hero', isAnchor: true },
    { key: 'nav.projects', href: '/projects', isAnchor: false },
    { key: 'nav.services', href: '/services/web-engineering', isAnchor: false },
  ];

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

        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item, idx) => (
            item.isAnchor ? (
              <a
                key={item.key}
                href={item.href}
                onClick={(e) => handleNavigationClick(e, item.href)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-300 relative group"
                data-guide-id={`nav.item.${idx + 1}`}
                data-guide-name={item.key}
                data-guide-type="navigation"
                data-guide-target={item.href}
              >
                {t(item.key)}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300" />
              </a>
            ) : (
              <Link
                key={item.key}
                to={getLocalizedHref(item.href)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors duration-300 relative group"
                data-guide-id={`nav.item.${idx + 1}`}
                data-guide-name={item.key}
                data-guide-type="navigation"
                data-guide-target={getLocalizedHref(item.href)}
              >
                {t(item.key)}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300" />
              </Link>
            )
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => switchLanguage(getCurrentLanguage() === 'en' ? 'ar' : 'en')}
            className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300"
            data-guide-id="nav.language-switch"
            data-guide-name="Language Switch"
            data-guide-type="button"
            data-guide-target={getCurrentLanguage() === 'en' ? 'ar' : 'en'}
          >
            <span className="text-xs font-medium text-gray-300">{getLanguageLabel(getCurrentLanguage() === 'en' ? 'ar' : 'en')}</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center"
            data-guide-id="nav.mobile-menu"
            data-guide-name="Mobile Menu Button"
            data-guide-type="button"
            data-guide-target={mobileMenuOpen ? 'close' : 'open'}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-96 border-t border-white/5' : 'max-h-0'
        } bg-[#0B0B0B]/95 backdrop-blur-xl`}
      >
        <div className="px-6 py-4 border-b border-white/5">
          <img
            src="/axiomx-logo.png"
            alt="AXIOMX Logo"
            loading="eager"
            fetchPriority="high"
            className="h-16 w-36 object-contain bg-transparent block"
            data-guide-id="nav.mobile-logo"
            data-guide-name="Mobile AXIOMX Logo"
            data-guide-type="logo"
            data-guide-target="/"
            style={{ maxWidth: '150px', maxHeight: '64px' }}
          />
        </div>
        <div className="px-6 py-4 space-y-2">
          {navItems.map((item, idx) => (
            item.isAnchor ? (
              <a
                key={item.key}
                href={item.href}
                onClick={(e) => {
                  handleNavigationClick(e, item.href);
                  setMobileMenuOpen(false);
                }}
                className="block px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-300"
                data-guide-id={`nav.mobile-item.${idx + 1}`}
                data-guide-name={item.key}
                data-guide-type="navigation"
                data-guide-target={item.href}
              >
                {t(item.key)}
              </a>
            ) : (
              <Link
                key={item.key}
                to={getLocalizedHref(item.href)}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-300"
                data-guide-id={`nav.mobile-item.${idx + 1}`}
                data-guide-name={item.key}
                data-guide-type="navigation"
                data-guide-target={getLocalizedHref(item.href)}
              >
                {t(item.key)}
              </Link>
            )
          ))}
          <Link
            to="/#contact"
            className="block px-4 py-3 text-center bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg"
            data-guide-id="nav.mobile-cta"
            data-guide-name="Mobile Get Started"
            data-guide-type="button"
            data-guide-target="/#contact"
          >
            {t('nav.getStarted')}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
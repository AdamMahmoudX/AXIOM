import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';
import { AXIOMXLogo } from '../common';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { handleNavigationClick } = useSmoothScroll();

  const navLinks = [
    { key: 'nav.home', href: '#hero', isRoute: false },
    { key: 'nav.projects', href: '/projects', isRoute: true },
  ];

  return (
    <footer id="contact" className="py-16 bg-[#0B0B0B] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <AXIOMXLogo />
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">{t('footer.tagline')}</p>

          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Navigation</h4>
            <ul className="space-y-3">
              {navLinks.map((link, index) => (
                <li key={link.key}>
                  {link.isRoute ? (
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                      data-guide-id={`footer.nav.${index + 1}`}
                      data-guide-name={link.key}
                      data-guide-type="navigation"
                      data-guide-target={link.href}
                    >
                      {t(link.key)}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      onClick={(e) => handleNavigationClick(e, link.href)}
                      className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
                      data-guide-id={`footer.nav.${index + 1}`}
                      data-guide-name={link.key}
                      data-guide-type="navigation"
                      data-guide-target={link.href}
                    >
                      {t(link.key)}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
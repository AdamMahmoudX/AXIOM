import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useServices } from '../../context/ServiceContext';
import { ServiceCard } from '../cards';

const ServicesSection: React.FC = () => {
  const { t, language } = useLanguage();
  const { getPublishedServices } = useServices();
  const lang = language === 'ar' ? 'ar' : 'en';
  const prefix = language === 'ar' ? '/ar' : '';

  const services = getPublishedServices().map((service) => ({
    title: service.content[lang].title || service.title,
    description: service.content[lang].excerpt || service.shortDescription,
    route: `${prefix}/services/${service.content.en.slug}`,
  }));

  return (
    <section id="services" className="py-32 bg-[#0B0B0B]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-blue-400 text-sm font-medium tracking-wider uppercase mb-4 block">Capabilities</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">{t('services.title')}</h2>
          <p className="text-gray-400 text-lg">{t('services.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.route} {...service} delay={index * 100} cardIndex={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
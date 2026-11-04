import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useServices } from '../../context/ServiceContext';

// Service data configuration
const servicesData: Record<string, {
  titleKey: string;
  descriptionKey: string;
  icon: React.ReactNode;
  heroBg: string;
  technologies: string[];
  keywords: { term: string; termKey: string; href: string }[];
  features: { titleKey: string; descKey: string }[];
}> = {
  'web-engineering': {
    titleKey: 'services.web',
    descriptionKey: 'services.web.desc',
    icon: <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9" /></svg>,
    heroBg: 'from-blue-900/30 to-purple-900/30',
    technologies: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'GraphQL', 'Docker', 'AWS', 'Redis'],
    keywords: [
      { term: 'React', termKey: 'service.keyword.react', href: '/articles/react-framework' },
      { term: 'API', termKey: 'service.keyword.api', href: '/articles/react-framework' },
      { term: 'Authentication', termKey: 'service.keyword.auth', href: '/articles/cybersecurity-basics' },
      { term: 'Database', termKey: 'service.keyword.database', href: '/articles/smart-web-platform' },
      { term: 'Cloud Infrastructure', termKey: 'service.keyword.cloud', href: '/articles/smart-web-platform' },
    ],
    features: [
      { titleKey: 'service.web.feature1.title', descKey: 'service.web.feature1.desc' },
      { titleKey: 'service.web.feature2.title', descKey: 'service.web.feature2.desc' },
      { titleKey: 'service.web.feature3.title', descKey: 'service.web.feature3.desc' },
    ],
  },
  'mobile-applications': {
    titleKey: 'services.mobile',
    descriptionKey: 'services.mobile.desc',
    icon: <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
    heroBg: 'from-green-900/30 to-cyan-900/30',
    technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'Realm', 'SwiftUI'],
    keywords: [
      { term: 'React', termKey: 'service.keyword.react', href: '/articles/react-native-guide' },
      { term: 'UI/UX', termKey: 'service.keyword.uiux', href: '/articles/mobile-ux' },
      { term: 'API', termKey: 'service.keyword.mobileapi', href: '/articles/mobile-api' },
      { term: 'Authentication', termKey: 'service.keyword.mobileauth', href: '/articles/mobile-auth' },
    ],
    features: [
      { titleKey: 'service.mobile.feature1.title', descKey: 'service.mobile.feature1.desc' },
      { titleKey: 'service.mobile.feature2.title', descKey: 'service.mobile.feature2.desc' },
      { titleKey: 'service.mobile.feature3.title', descKey: 'service.mobile.feature3.desc' },
    ],
  },
  'ui-ux-architecture': {
    titleKey: 'services.ui',
    descriptionKey: 'services.ui.desc',
    icon: <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>,
    heroBg: 'from-pink-900/30 to-purple-900/30',
    technologies: ['Figma', 'Adobe XD', 'After Effects', 'Prototyping', 'Design Systems', 'Accessibility'],
    keywords: [
      { term: 'UI/UX', termKey: 'service.keyword.uiux', href: '/articles/ui-ux-principles' },
      { term: 'React', termKey: 'service.keyword.react', href: '/articles/component-design' },
      { term: 'Accessibility', termKey: 'service.keyword.a11y', href: '/articles/a11y-guide' },
    ],
    features: [
      { titleKey: 'service.ui.feature1.title', descKey: 'service.ui.feature1.desc' },
      { titleKey: 'service.ui.feature2.title', descKey: 'service.ui.feature2.desc' },
      { titleKey: 'service.ui.feature3.title', descKey: 'service.ui.feature3.desc' },
    ],
  },
  'ai-systems': {
    titleKey: 'services.ai',
    descriptionKey: 'services.ai.desc',
    icon: <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    heroBg: 'from-violet-900/30 to-blue-900/30',
    technologies: ['Python', 'TensorFlow', 'PyTorch', 'OpenAI API', 'LangChain', 'Hugging Face', 'MLflow'],
    keywords: [
      { term: 'AI', termKey: 'service.keyword.ai', href: '/articles/future-of-ai' },
      { term: 'Machine Learning', termKey: 'service.keyword.ml', href: '/articles/future-of-ai' },
      { term: 'API', termKey: 'service.keyword.aiapi', href: '/articles/hor-ai-assistant' },
      { term: 'Cloud Infrastructure', termKey: 'service.keyword.aicloud', href: '/articles/smart-web-platform' },
    ],
    features: [
      { titleKey: 'service.ai.feature1.title', descKey: 'service.ai.feature1.desc' },
      { titleKey: 'service.ai.feature2.title', descKey: 'service.ai.feature2.desc' },
      { titleKey: 'service.ai.feature3.title', descKey: 'service.ai.feature3.desc' },
    ],
  },
  'game-development': {
    titleKey: 'services.games',
    descriptionKey: 'services.games.desc',
    icon: <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    heroBg: 'from-orange-900/30 to-red-900/30',
    technologies: ['Unity', 'Unreal Engine', 'C#', 'C++', 'Blender', 'Three.js', 'WebGL'],
    keywords: [
      { term: 'Game Development', termKey: 'service.keyword.gamedev', href: '/articles/game-dev-guide' },
      { term: 'Unity', termKey: 'service.keyword.unity', href: '/articles/unity-tips' },
      { term: '3D Graphics', termKey: 'service.keyword.graphics', href: '/articles/3d-rendering' },
      { term: 'AI', termKey: 'service.keyword.gameai', href: '/articles/game-ai' },
    ],
    features: [
      { titleKey: 'service.games.feature1.title', descKey: 'service.games.feature1.desc' },
      { titleKey: 'service.games.feature2.title', descKey: 'service.games.feature2.desc' },
      { titleKey: 'service.games.feature3.title', descKey: 'service.games.feature3.desc' },
    ],
  },
  'digital-infrastructure': {
    titleKey: 'services.software',
    descriptionKey: 'services.software.desc',
    icon: <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>,
    heroBg: 'from-cyan-900/30 to-blue-900/30',
    technologies: ['Kubernetes', 'Terraform', 'Docker', 'AWS', 'Azure', 'GCP', 'CI/CD', 'Monitoring'],
    keywords: [
      { term: 'Cloud Infrastructure', termKey: 'service.keyword.cloud', href: '/articles/cloud-architecture' },
      { term: 'Cybersecurity', termKey: 'service.keyword.security', href: '/articles/cybersecurity-basics' },
      { term: 'DevOps', termKey: 'service.keyword.devops', href: '/articles/devops-pipeline' },
      { term: 'Database', termKey: 'service.keyword.infradb', href: '/articles/infrastructure-db' },
    ],
    features: [
      { titleKey: 'service.software.feature1.title', descKey: 'service.software.feature1.desc' },
      { titleKey: 'service.software.feature2.title', descKey: 'service.software.feature2.desc' },
      { titleKey: 'service.software.feature3.title', descKey: 'service.software.feature3.desc' },
    ],
  },
};

// Floating Particles Component
const FloatingParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = 400;

    const particles: { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${p.opacity})`;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-50" />;
};

// Interactive Keyword Component
const KeywordLink: React.FC<{ term: string; termKey: string; href: string; index: number; label?: string }> = ({ term, termKey, href, index, label }) => {
  const { t } = useLanguage();
  const displayLabel = label ?? (termKey.startsWith('service.keyword.') && !termKey.includes('react') ? term : t(termKey));
  return (
    <Link
      to={href}
      className="inline-block px-3 py-1 mx-1 my-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:border-blue-400/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 font-medium"


    >
      {displayLabel}
    </Link>
  );
};

// Related Card Component
const RelatedCard: React.FC<{ type: string; title: string; href: string; index: number }> = ({ type, title, href, index }) => {
  const { t } = useLanguage();
  const icons: Record<string, React.ReactNode> = {
    project: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />,
    article: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
    developer: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
  };

  return (
    <Link
      to={href}
      className="group p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all duration-300 hover:shadow-[0_0_25px_rgba(59,130,246,0.1)] hover:-translate-y-1"


    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {icons[type]}
          </svg>
        </div>
        <span className="text-xs text-gray-500 uppercase tracking-wider">{t(`service.card.type.${type}`)}</span>
      </div>
      <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors duration-300">{title}</h4>
      <div className="mt-3 flex items-center text-blue-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {t('common.explore')}
        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </Link>
  );
};

type ResolvedService = {
  source: 'static' | 'cms';
  titleKey?: string;
  descriptionKey?: string;
  title?: string;
  description?: string;
  icon: React.ReactNode;
  heroBg: string;
  technologies: string[];
  keywords: { term: string; termKey: string; href: string }[];
  features: { titleKey: string; descKey: string; title?: string; description?: string }[];
};

const defaultServiceIcon = (
  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

// Main Service Page Component
const ServicePage: React.FC = () => {
  const { serviceId } = useParams();
  const { t, isRTL, language } = useLanguage();
  const { getServiceBySlug } = useServices();
  const [isLoaded, setIsLoaded] = useState(false);

  const lang = language === 'ar' ? 'ar' : 'en';
  const staticService = serviceId ? servicesData[serviceId] : null;
  const cmsService = serviceId ? getServiceBySlug(serviceId, lang) ?? getServiceBySlug(serviceId, 'en') : undefined;

  const service: ResolvedService | null = staticService
    ? { source: 'static', ...staticService }
    : cmsService
      ? {
          source: 'cms',
          title: cmsService.content[lang]?.title || cmsService.title,
          description: cmsService.content[lang]?.description || cmsService.content[lang]?.excerpt || cmsService.shortDescription,
          icon: defaultServiceIcon,
          heroBg: 'from-blue-900/30 to-purple-900/30',
          technologies: cmsService.tags,
          keywords: cmsService.tags.map((tag, index) => ({
            term: tag,
            termKey: `service.keyword.${index}`,
            href: `/articles/${tag.toLowerCase().replace(/\s+/g, '-')}`,
          })),
          features: cmsService.content[lang]?.blocks?.slice(0, 3).map((block, index) => {
            const blockContent = 'content' in block && block.content
              ? (typeof block.content === 'string' ? block.content : (block.content as { en?: string; ar?: string })[lang] || (block.content as { en?: string }).en || '')
              : '';
            return {
              titleKey: `service.cms.feature.${index}.title`,
              descKey: `service.cms.feature.${index}.desc`,
              title: block.type === 'title' ? blockContent : `${cmsService.content[lang]?.title || cmsService.title} ${index + 1}`,
              description: block.type === 'richText' ? blockContent : cmsService.content[lang]?.excerpt || '',
            };
          }) ?? [{
            titleKey: 'service.cms.feature.0.title',
            descKey: 'service.cms.feature.0.desc',
            title: cmsService.content[lang]?.title || cmsService.title,
            description: cmsService.content[lang]?.excerpt || cmsService.shortDescription,
          }],
        }
      : null;

  useEffect(() => {
    setIsLoaded(true);
    window.scrollTo(0, 0);
  }, [serviceId, service?.source, staticService, cmsService]);

  if (!service) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">{t('common.notFound')}</h1>
          <Link to="/" className="text-blue-400 hover:text-blue-300">{t('common.returnHome')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#050505] transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${service.heroBg} opacity-50`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.15)_0%,_transparent_70%)]" />
        <FloatingParticles />

        <div className="relative z-20 max-w-5xl mx-auto px-6 py-32 text-center">
          <div
            className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center border border-blue-500/30 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all duration-500"

           
          >
            {service.icon}
          </div>

          <h1
            className="text-5xl sm:text-6xl font-bold text-white mb-6 tracking-tight"

           
          >
            {service.source === 'static' && service.titleKey ? t(service.titleKey) : service.title}
          </h1>

          <p
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10"

           
          >
            {service.source === 'static' && service.descriptionKey ? t(service.descriptionKey) : service.description}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {service.keywords.map((kw, i) => (
              <KeywordLink key={i} term={kw.term} termKey={kw.termKey} href={kw.href} index={i} label={service.source === 'cms' ? kw.term : undefined} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[#0B0B0B]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-400 text-sm font-medium tracking-wider uppercase mb-4 block">{t('common.whatWeOffer')}</span>
            <h2 className="text-4xl font-bold text-white">{t('common.serviceCapabilities')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {service.features.map((feature, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all duration-500 group"


              >
                <div
                  className="w-12 h-12 mb-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300"

                >
                  <span className="text-2xl font-bold text-blue-400">{i + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title ?? t(feature.titleKey)}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description ?? t(feature.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-24 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-400 text-sm font-medium tracking-wider uppercase mb-4 block">{t('projects.relatedTech')}</span>
            <h2 className="text-4xl font-bold text-white">{t('common.techStack')}</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {service.technologies.map((tech, i) => (
              <div
                key={i}
                className="px-6 py-3 rounded-full bg-white/[0.03] border border-white/10 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300 text-gray-300 hover:text-white cursor-pointer"


              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Content Section */}
      <section className="py-24 bg-[#0B0B0B]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-400 text-sm font-medium tracking-wider uppercase mb-4 block">{t('common.exploreMore')}</span>
            <h2 className="text-4xl font-bold text-white">{t('common.relatedContent')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RelatedCard type="project" title={t('service.related.ecommerce')} href="/projects/ecommerce" index={0} />
            <RelatedCard type="project" title={t('service.related.fintech')} href="/projects/fintech" index={1} />
            <RelatedCard type="project" title={t('service.related.health')} href="/projects/health" index={2} />
            <RelatedCard type="article" title={t('service.related.startGuide')} href="/articles/getting-started" index={0} />
            <RelatedCard type="article" title={t('service.related.bestPractices')} href="/articles/best-practices" index={1} />
            <RelatedCard type="article" title={t('service.related.caseStudies')} href="/articles/case-studies" index={2} />
            <RelatedCard type="developer" title={t('service.related.ahmedHassan')} href="/developers/ahmed" index={0} />
            <RelatedCard type="developer" title={t('service.related.sarahChen')} href="/developers/sarah" index={1} />
            <RelatedCard type="developer" title={t('service.related.marcusWilliams')} href="/developers/marcus" index={2} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#050505]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/20 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.1)_0%,_transparent_50%)]" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t('common.readyToStart')}</h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                {t('common.transformIdeas')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/#contact"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all duration-300 hover:-translate-y-1"

                 
                >
                  {t('common.getStarted')}
                </Link>
                <Link
                  to="/"
                  className="px-8 py-4 rounded-xl border border-white/20 text-white font-medium hover:bg-white/5 hover:border-blue-500/50 transition-all duration-300"

                 
                >
                  {t('common.returnHome')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#0B0B0B] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/axiomx-logo.png" alt="AXIOMX Logo" className="h-8 w-[94px] object-contain" />
              <span className="text-gray-400 text-sm">{t('common.footerTagline')}</span>
            </div>
            <div className="flex gap-4">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">{t('nav.home')}</Link>
              <Link to="/#services" className="text-gray-400 hover:text-white transition-colors">{t('nav.services')}</Link>
              <Link to="/#projects" className="text-gray-400 hover:text-white transition-colors">{t('nav.projects')}</Link>
              <Link to="/#contact" className="text-gray-400 hover:text-white transition-colors">{t('nav.contact')}</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
            {t('common.footerCopyright')}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ServicePage;
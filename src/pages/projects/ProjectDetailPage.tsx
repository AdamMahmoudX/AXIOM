import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { MissingTranslationWarning } from '../../components/MissingTranslationWarning';
import { useProjects } from '../../context/ProjectContext';
import { useLanguageSwitch, checkTranslationAvailability, getAvailableLanguage } from '../../utils/LanguageSwitchHelper';
import { Project as ProjectType } from '../../types/project';
import { SEOManager, generateCanonicalUrl } from '../../components/seo';
import { WEBSITE_URL } from '../../utils/structuredData';

/**
 * =====================================================
 * #12 PROJECT DETAIL PAGE - MULTILINGUAL SUPPORT
 * Standalone project article page with full i18n support
 * =====================================================
 */

interface ProjectContentSection {
  id: string;
  type: 'text' | 'image' | 'video' | 'youtube' | 'code' | 'gallery' | 'quote';
  titleKey?: string;
  content?: string;
  src?: string;
  altKey?: string;
  language?: string;
  embedId?: string;
  items?: string[];
  captionKey?: string;
}

interface FAQItem {
  questionKey: string;
  answerKey: string;
}

interface StaticProject {
  id: string;
  slug: string;
  image: string;
  titleKey: string;
  descKey: string;
  fullDescKey: string;
  statusKey: string;
  durationKey: string;
  longDescription?: string;
  sections?: ProjectContentSection[];
  faq?: FAQItem[];
  clientKey?: string;
  yearKey?: string;
}

// Union type for both project types
type ProjectData = ProjectType | StaticProject;

const projectsData: StaticProject[] = [
  {
    id: 'hor-ai-assistant',
    slug: 'hor-ai-assistant',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
    titleKey: 'project.horAI.title',
    descKey: 'project.horAI.desc',
    fullDescKey: 'project.horAI.fullDesc',
    statusKey: 'status.live',
    durationKey: 'project.duration.horAI',
    clientKey: 'project.client.horAI',
    yearKey: '2024',
    longDescription: 'An advanced AI-powered virtual assistant designed to revolutionize customer interactions and streamline business operations through intelligent conversation. The system leverages cutting-edge machine learning models to understand context, sentiment, and user intent, enabling natural and productive dialogues across multiple channels.',
    sections: [
      { id: 'overview', type: 'text', titleKey: 'project.overview', content: 'The AXIOMX AI Assistant represents a breakthrough in conversational AI technology. Built with enterprise-grade architecture, it delivers seamless interactions across multiple channels while maintaining context and learning from each conversation.' },
      { id: 'architecture', type: 'image', titleKey: 'project.architecture', src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80', altKey: 'project.alt.aiArchitecture', captionKey: 'project.capSystem' },
      { id: 'implementation', type: 'text', titleKey: 'project.implementation', content: 'The implementation leverages OpenAI\'s GPT models with custom fine-tuning to understand domain-specific terminology. Redis caching ensures sub-100ms response times, while MongoDB provides flexible document storage for conversation history.' },
      { id: 'code-example', type: 'code', titleKey: 'project.apiExample', language: 'typescript', content: `// OpenAI API Integration\nconst openai = new OpenAIApi(configuration);\n\nasync function generateResponse(userMessage: string, context: ConversationContext) {\n  const response = await openai.createChatCompletion({\n    model: "gpt-4-turbo",\n    messages: [\n      { role: "system", content: SYSTEM_PROMPT },\n      { role: "user", content: userMessage }\n    ],\n    temperature: 0.7,\n    max_tokens: 500\n  });\n  return response.choices[0].message.content;\n}` },
      { id: 'gallery', type: 'gallery', titleKey: 'project.screenshots', items: [
        'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=600&q=80',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80'
      ]},
      { id: 'performance', type: 'text', titleKey: 'project.performance', content: 'The system processes over 50,000 conversations daily with an average response time of 85ms. Customer satisfaction scores have improved by 40% since implementation.' }
    ],
    faq: [
      { questionKey: 'faq.howContext', answerKey: 'faq.howContext.answer' },
      { questionKey: 'faq.integrateSystems', answerKey: 'faq.integrateSystems.answer' },
      { questionKey: 'faq.languages', answerKey: 'faq.languages.answer' }
    ]
  },
  {
    id: 'cyber-security-dashboard',
    slug: 'cyber-security-dashboard',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80',
    titleKey: 'project.cyberSecurity.title',
    descKey: 'project.cyberSecurity.desc',
    fullDescKey: 'project.cyberSecurity.fullDesc',
    statusKey: 'status.live',
    durationKey: 'project.duration.cyberSecurity',
    clientKey: 'project.client.cyberSecurity',
    yearKey: '2024',
    longDescription: 'A comprehensive cybersecurity monitoring and threat detection platform that uses machine learning to identify, analyze, and respond to security threats in real-time. The platform integrates with existing security infrastructure to provide a unified view of organizational security posture.',
    sections: [
      { id: 'overview', type: 'text', titleKey: 'project.overview', content: 'The Cyber Security Dashboard provides enterprise-level security monitoring with AI-powered threat detection. The platform integrates with existing security infrastructure to provide a unified view of organizational security posture.' },
      { id: 'detection', type: 'image', titleKey: 'project.detection', src: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80', altKey: 'project.alt.threatDetection', captionKey: 'project.capThreat' },
      { id: 'ml-model', type: 'code', titleKey: 'project.mlModel', language: 'python', content: `# TensorFlow-based threat detection\nimport tensorflow as tf\nfrom tensorflow.keras import layers\n\ndef build_threat_detector(input_shape):\n    model = tf.keras.Sequential([\n        layers.Dense(256, activation='relu', input_shape=input_shape),\n        layers.Dropout(0.3),\n        layers.Dense(128, activation='relu'),\n        layers.Dense(64, activation='relu'),\n        layers.Dense(1, activation='sigmoid')\n    ])\n    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])\n    return model` }
    ],
    faq: [
      { questionKey: 'faq.threatAccuracy', answerKey: 'faq.threatAccuracy.answer' },
      { questionKey: 'faq.autoResponse', answerKey: 'faq.autoResponse.answer' }
    ]
  },
  {
    id: 'smart-web-platform',
    slug: 'smart-web-platform',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    titleKey: 'project.smartWeb.title',
    descKey: 'project.smartWeb.desc',
    fullDescKey: 'project.smartWeb.fullDesc',
    statusKey: 'status.live',
    durationKey: 'project.duration.smartWeb',
    clientKey: 'project.client.smartWeb',
    yearKey: '2024',
    longDescription: 'A modern web platform built with Next.js featuring server-side rendering, optimized performance, and excellent SEO capabilities. The platform includes a comprehensive analytics dashboard for monitoring user engagement and business metrics.',
    sections: [
      { id: 'overview', type: 'text', titleKey: 'project.overview', content: 'The Smart Web Platform delivers exceptional performance with server-side rendering and optimized frontend architecture.' },
      { id: 'gallery', type: 'gallery', titleKey: 'project.platformScreenshots', items: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80'
      ]}
    ],
    faq: [
      { questionKey: 'faq.pageLoad', answerKey: 'faq.pageLoad.answer' },
      { questionKey: 'faq.seoOptimized', answerKey: 'faq.seoOptimized.answer' }
    ]
  },
  {
    id: 'ecommerce-platform',
    slug: 'ecommerce-platform',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
    titleKey: 'project.ecommerce.title',
    descKey: 'project.ecommerce.desc',
    fullDescKey: 'project.ecommerce.fullDesc',
    statusKey: 'status.live',
    durationKey: 'project.duration.ecommerce',
    clientKey: 'project.client.ecommerce',
    yearKey: '2023',
    longDescription: 'A comprehensive e-commerce platform with payment processing, inventory management, and real-time analytics. Built with React and Node.js for scalability and performance.'
  },
  {
    id: 'healthcare-app',
    slug: 'healthcare-app',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80',
    titleKey: 'project.healthcare.title',
    descKey: 'project.healthcare.desc',
    fullDescKey: 'project.healthcare.fullDesc',
    statusKey: 'status.live',
    durationKey: 'project.duration.healthcare',
    clientKey: 'project.client.healthcare',
    yearKey: '2023',
    longDescription: 'A HIPAA-compliant healthcare application with telemedicine capabilities, patient records management, and prescription tracking.'
  },
  {
    id: 'gaming-platform',
    slug: 'gaming-platform',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&q=80',
    titleKey: 'project.gaming.title',
    descKey: 'project.gaming.desc',
    fullDescKey: 'project.gaming.fullDesc',
    statusKey: 'status.live',
    durationKey: 'project.duration.gaming',
    clientKey: 'project.client.gaming',
    yearKey: '2023',
    longDescription: 'A cross-platform gaming platform with multiplayer support, leaderboards, and real-time matchmaking powered by Unity and Photon.'
  },
  {
    id: 'fintech-dashboard',
    slug: 'fintech-dashboard',
    image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1200&q=80',
    titleKey: 'project.fintech.title',
    descKey: 'project.fintech.desc',
    fullDescKey: 'project.fintech.fullDesc',
    statusKey: 'status.live',
    durationKey: 'project.duration.fintech',
    clientKey: 'project.client.fintech',
    yearKey: '2024',
    longDescription: 'A comprehensive fintech dashboard for portfolio tracking, risk analysis, and automated trading with real-time analytics.'
  },
  {
    id: 'education-platform',
    slug: 'education-platform',
    image: 'https://images.unsplash.com/photo-1501504905252-473c52e21e20?w=1200&q=80',
    titleKey: 'project.education.title',
    descKey: 'project.education.desc',
    fullDescKey: 'project.education.fullDesc',
    statusKey: 'status.live',
    durationKey: 'project.duration.education',
    clientKey: 'project.client.education',
    yearKey: '2024',
    longDescription: 'An interactive education platform with video streaming, quizzes, progress tracking, and certificate generation.'
  },
  {
    id: 'logistics-tracking',
    slug: 'logistics-tracking',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80',
    titleKey: 'project.logistics.title',
    descKey: 'project.logistics.desc',
    fullDescKey: 'project.logistics.fullDesc',
    statusKey: 'status.live',
    durationKey: 'project.duration.logistics',
    clientKey: 'project.client.logistics',
    yearKey: '2023',
    longDescription: 'A logistics tracking system with route optimization, fleet management, and predictive analytics powered by machine learning.'
  },
  {
    id: 'social-media-app',
    slug: 'social-media-app',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80',
    titleKey: 'project.social.title',
    descKey: 'project.social.desc',
    fullDescKey: 'project.social.fullDesc',
    statusKey: 'status.live',
    durationKey: 'project.duration.social',
    clientKey: 'project.client.social',
    yearKey: '2024',
    longDescription: 'A feature-rich social media application with real-time chat, timeline feed, and media sharing capabilities.'
  }
];

// Components
const CodeBlock: React.FC<{ code: string; language?: string; index?: number }> = ({ code, language, index = 0 }) => (
  <div
    className="rounded-xl overflow-hidden bg-[#0a0a0a] border border-white/10 my-6"


  >
    {language && (
      <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-gray-400 text-sm ml-2">{language}</span>
      </div>
    )}
    <pre className="p-4 overflow-x-auto">
      <code className="text-sm text-gray-300 font-mono whitespace-pre">{code}</code>
    </pre>
  </div>
);

const YouTubeEmbed: React.FC<{ videoId: string; title?: string; index?: number }> = ({ videoId, title, index = 0 }) => (
  <div
    className="rounded-xl overflow-hidden border border-white/10 my-6"


  >
    {title && (
      <div className="px-4 py-3 bg-white/5 border-b border-white/10">
        <span className="text-gray-300 text-sm">{title}</span>
      </div>
    )}
    <div className="aspect-video">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title || 'Video'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  </div>
);

const ImageGallery: React.FC<{ images: string[]; title?: string; altText?: string; index?: number }> = ({ images, title, altText, index = 0 }) => (
  <div className="my-6">
    {title && <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {images.map((img, idx) => (
        <div key={idx} className="relative rounded-xl overflow-hidden group">
          <img
            src={img}
            alt={altText || 'Image'}
            className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ))}
    </div>
  </div>
);

// Main Component
const ProjectDetailPage: React.FC = () => {
  const { t, isRTL, language, setLanguage } = useLanguage();
  const { projectSlug } = useParams<{ projectSlug: string }>();
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const { getProjectBySlug } = useProjects();
  const { switchLanguage, getLanguageLabel, getCurrentLanguage } = useLanguageSwitch();

  // Find project from context or fallback to static data
  const projectFromContext = getProjectBySlug(projectSlug || '', language);
  const staticProject = projectsData.find(p => p.slug === projectSlug);

  // Check if this is a static project (boolean for logic)
  const isStatic = !!staticProject && !projectFromContext;

  // Check translation availability
  const hasTranslation = projectFromContext
    ? checkTranslationAvailability(projectFromContext.content as Record<string, unknown>, language)
    : true;

  // Get available language if current translation is missing
  const availableLang = projectFromContext ? getAvailableLanguage(projectFromContext.content) : null;

  // Handle missing translation - switch to available language
  useEffect(() => {
    if (projectFromContext && !hasTranslation && availableLang) {
      // Show warning but don't auto-switch - let user decide
    }
  }, [projectFromContext, hasTranslation, availableLang]);

  // Determine the project to display
  const project = projectFromContext || staticProject;

  // Handle both StaticProject and ProjectType - type guard function (must be before SEO vars)
  const isStaticProjectType = (p: ProjectData | null): p is StaticProject => p !== null && 'titleKey' in p;

  // SEO: Get project title and description for SEO Manager
  const projectTitle = projectFromContext?.content[language]?.title || (isStaticProjectType(project) ? t((project as StaticProject).titleKey) : '');
  const projectDescription = projectFromContext?.content[language]?.description || (isStaticProjectType(project) ? (project as StaticProject).longDescription : '') || '';
  const projectExcerpt = projectFromContext?.content[language]?.excerpt || '';
  const projectSlugFromContext = projectFromContext?.content[language]?.slug || '';
  const projectSlugValue = projectSlugFromContext || projectSlug || '';
  const projectSEO = projectFromContext?.content[language]?.seo;
  const projectImage = project?.image || '';

  useEffect(() => {
    if (!project) navigate(language === 'ar' ? '/ar/projects' : '/projects');
  }, [project, navigate, language]);

  if (!project) {
    return (
      <div className={`min-h-screen bg-[#050505] pt-[72px] flex items-center justify-center ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">{t('common.notFound')}</h1>
          <Link to="/projects" className="text-blue-400 hover:text-blue-300 transition-colors">
            {t('common.backToProjects')}
          </Link>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, { bg: string; text: string }> = {
    'status.live': { bg: 'bg-green-500/20', text: 'text-green-400' },
    'status.inProgress': { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
    'status.completed': { bg: 'bg-blue-500/20', text: 'text-blue-400' }
  };

  const projectStatusKey = isStaticProjectType(project) ? (project as StaticProject).statusKey : 'status.live';
  const currentStatus = statusColors[projectStatusKey] || statusColors['status.live'];

  return (
    <>
      {/* SEO Manager - Dynamic Meta Tags */}
      <SEOManager
        title={projectSEO?.title || projectTitle}
        description={projectSEO?.description || projectDescription || projectExcerpt}
        keywords={projectSEO?.keywords}
        ogTitle={projectSEO?.ogTitle || projectTitle}
        ogDescription={projectSEO?.ogDescription || projectDescription || projectExcerpt}
        ogImage={projectSEO?.ogImage || projectImage}
        ogType="article"
        canonicalUrl={projectSEO?.canonicalUrl || generateCanonicalUrl(WEBSITE_URL, `/projects/${projectSlugValue}`, language)}
      />

      <div className={`min-h-screen bg-[#050505] pt-[72px] ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* HERO - Cover Image */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={project.image}
            alt={isStaticProjectType(project) ? t((project as StaticProject).titleKey) : (project as ProjectType).content[language]?.title || ''}
            className="w-full h-full object-cover"
           
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-cyan-500/10 animate-pulse" />
        </div>

        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

        <div className="relative z-10 h-full flex items-end pb-8 px-6">
          <div className="max-w-5xl mx-auto w-full">
            {/* Translation Warning */}
            {projectFromContext && !hasTranslation && (
              <div className="mb-4">
                <MissingTranslationWarning
                  content={projectFromContext.content as { en: { title: string; slug: string; excerpt: string; description: string; seo: { title: string; description: string; ogTitle: string; ogDescription: string }; blocks: unknown[] }; ar: { title: string; slug: string; excerpt: string; description: string; seo: { title: string; description: string; ogTitle: string; ogDescription: string }; blocks: unknown[] } }}
                  fieldName={t('common.projectOverview')}
                />
                <button
                  onClick={() => switchLanguage(availableLang as 'en' | 'ar')}
                  className="mt-2 px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm hover:bg-blue-500/30 transition-colors"
                >
                  {language === 'en' ? 'عرض باللغة العربية' : 'View in English'}
                </button>
              </div>
            )}

            <h1
              className="text-3xl md:text-5xl font-bold text-white mb-4"

             
            >
              {/* Use multilingual content from context or fallback to translation key */}
              {projectFromContext?.content[language]?.title || (isStaticProjectType(project) ? t((project as StaticProject).titleKey) : (project as ProjectType).content[language]?.title || '')}
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <span
                className={`px-4 py-2 rounded-full ${currentStatus.bg} ${currentStatus.text} border border-current/30 text-sm font-medium`}
               
              >
                {isStaticProjectType(project) ? t((project as StaticProject).statusKey) : (project as ProjectType).status}
              </span>
              {isStaticProjectType(project) && (project as StaticProject).clientKey && <span className="text-gray-400 text-sm">{t((project as StaticProject).clientKey)}</span>}
              {isStaticProjectType(project) && (project as StaticProject).yearKey && <span className="text-gray-500 text-sm">{(project as StaticProject).yearKey}</span>}

              {/* Language Switch Button */}
              <button
                onClick={() => switchLanguage(getCurrentLanguage() === 'en' ? 'ar' : 'en')}
                className="ml-4 px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300"
               
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A8.001 8.001 0 0116.953 5H19l4 4m-10-4l4 4m-4-4l4-4" />
                </svg>
                <span className="text-xs font-medium text-gray-300">{getLanguageLabel(getCurrentLanguage() === 'en' ? 'ar' : 'en')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLE CONTENT */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Project Description - Multilingual */}
          <div className="mb-10">
            <p className="text-gray-300 leading-relaxed text-lg">
              {/* Use multilingual content from context or fallback to static description */}
              {projectFromContext?.content[language]?.description || (isStaticProjectType(project) ? ((project as StaticProject).longDescription || t((project as StaticProject).fullDescKey)) : (project as ProjectType).content[language]?.description || '')}
            </p>
          </div>

          {/* Content Sections - Only for static projects */}
          {isStaticProjectType(project) && (project as StaticProject).sections?.map((section, sectionIndex) => (
            <div key={section.id} className="mb-10">
              {section.type === 'text' && (
                <>
                  {section.titleKey && (
                    <h2
                      className="text-2xl font-bold text-white mb-4"

                    >
                      {t(section.titleKey)}
                    </h2>
                  )}
                  <p className="text-gray-300 leading-relaxed">{section.content}</p>
                </>
              )}
              {section.type === 'image' && (
                <div>
                  {section.titleKey && (
                    <h2
                      className="text-2xl font-bold text-white mb-4"

                    >
                      {t(section.titleKey)}
                    </h2>
                  )}
                  <div className="relative rounded-xl overflow-hidden">
                    <img src={section.src} alt={section.altKey ? t(section.altKey) : ''} className="w-full" loading="lazy" />
                  </div>
                  {section.captionKey && <p className="text-gray-500 text-sm mt-3 text-center">{t(section.captionKey)}</p>}
                </div>
              )}
              {section.type === 'code' && (
                <>
                  {section.titleKey && (
                    <h2
                      className="text-2xl font-bold text-white mb-4"

                    >
                      {t(section.titleKey)}
                    </h2>
                  )}
                  <CodeBlock code={section.content || ''} language={section.language} index={sectionIndex} />
                </>
              )}
              {section.type === 'gallery' && section.items && (
                <ImageGallery
                  title={section.titleKey ? t(section.titleKey) : undefined}
                  images={section.items}
                  altText={t('project.alt.galleryImage')}
                  index={sectionIndex}
                />
              )}
              {section.type === 'youtube' && section.embedId && (
                <>
                  {section.titleKey && (
                    <h2
                      className="text-2xl font-bold text-white mb-4"

                    >
                      {t(section.titleKey)}
                    </h2>
                  )}
                  <YouTubeEmbed videoId={section.embedId} />
                </>
              )}
            </div>
          ))}

          {/* FAQ Section - Only for static projects */}
          {isStaticProjectType(project) && (project as StaticProject).faq && (project as StaticProject).faq.length > 0 && (
            <div className="mt-16 pt-8 border-t border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">{t('projectDetail.faq')}</h2>
              <div className="space-y-3">
                {(project as StaticProject).faq.map((item, index) => (
                  <div
                    key={index}
                    className="border border-white/10 rounded-xl overflow-hidden"


                  >
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                      className="w-full px-6 py-4 flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.05] transition-colors duration-300 text-left"

                    >
                      <span className="text-white font-medium pr-4">
                        {index + 1}. {t(item.questionKey)}
                      </span>
                      <svg
                        className={`w-5 h-5 text-blue-400 flex-shrink-0 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"

                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${openFaqIndex === index ? 'max-h-96' : 'max-h-0'}`}

                    >
                      <p className="px-6 py-4 text-gray-400 leading-relaxed">{t(item.answerKey)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section Only */}
          <div
            className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-500/10 border border-blue-500/30 text-center"
           
          >
            <h3 className="text-xl font-bold text-white mb-3">{t('projectDetail.startProject')}</h3>
            <p className="text-gray-400 mb-6">{t('projectDetail.qualityText')}</p>
            <Link
              to="/#contact"
              className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all duration-300"
             
            >
              {t('common.contactUs')}
            </Link>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default ProjectDetailPage;
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '../../context/LanguageContext';
import { MissingTranslationWarning } from '../../components/MissingTranslationWarning';
import { useArticles } from '../../context/ArticleContext';
import { useLanguageSwitch, checkTranslationAvailability, getAvailableLanguage } from '../../utils/LanguageSwitchHelper';
import { SEOManager, generateCanonicalUrl } from '../../components/seo';
import { WEBSITE_URL } from '../../utils/structuredData';
import { getContentByLanguage, type Block } from '../../components/blocks/blockTypes';
import VideoEmbed, { getVideoEmbedSource } from '../../components/articles/VideoEmbed';

/**
 * =====================================================
 * #11 RICH CONTENT RENDERER
 * =====================================================
 */

// Code block renderer with syntax highlighting
const CodeBlock: React.FC<{ children: string; className?: string; index?: number }> = ({ children, className, index = 0 }) => {
  const language = className?.replace('language-', '') || 'text';

  return (
    <div
      className="relative group my-6 rounded-xl overflow-hidden"


    >
      <div className="absolute top-0 right-0 px-3 py-1 text-xs font-mono text-gray-400 bg-white/5 border-l border-b border-white/10 rounded-bl-lg">
        {language}
      </div>
      <pre className="bg-[#0a0a0a] border border-white/10 p-4 overflow-x-auto">
        <code className={`text-sm font-mono text-gray-300 ${className || ''}`}>
          {children}
        </code>
      </pre>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-transparent to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
    </div>
  );
};

// Quote renderer with futuristic styling
const BlockQuote: React.FC<{ children: React.ReactNode; index?: number }> = ({ children, index = 0 }) => {
  return (
    <blockquote
      className="relative my-8 px-6 py-4 rounded-xl bg-white/[0.02] border-l-2 border-blue-500"


    >
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/5 to-transparent rounded-xl" />
      <div className="absolute top-0 left-0 w-8 h-8">
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-blue-500/40" />
      </div>
      <div className="absolute bottom-0 right-0 w-8 h-8">
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-blue-500/40" />
      </div>
      <div className="relative text-gray-300 italic leading-relaxed">
        {children}
      </div>
    </blockquote>
  );
};

// Inline code renderer
const InlineCode: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <code className="px-2 py-1 text-sm font-mono text-blue-400 bg-blue-500/10 rounded border border-blue-500/20">
      {children}
    </code>
  );
};

// External link renderer
const ExternalLink: React.FC<{ href: string; children: React.ReactNode; index?: number }> = ({ href, children, index = 0 }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 hover:text-blue-300 transition-colors duration-300"


    >
      {children}
    </a>
  );
};

// Article content renderer
const ArticleContent: React.FC<{ content: string; index?: number }> = ({ content, index = 0 }) => {
  return (
    <div className="prose prose-invert prose-blue max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 mt-12 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-10 mb-4 flex items-center gap-3">
              <span className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-blue-400 mt-8 mb-3">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-gray-300 leading-relaxed mb-6 text-lg">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-none space-y-2 mb-6">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-6 text-gray-300">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-300 leading-relaxed flex items-start gap-3">
              <span className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
              <span>{children}</span>
            </li>
          ),
          blockquote: ({ children }) => <BlockQuote>{children}</BlockQuote>,
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return <InlineCode>{children}</InlineCode>;
            }
            return <CodeBlock className={className}>{String(children).replace(/\n$/, '')}</CodeBlock>;
          },
          a: ({ href, children }) => {
            const videoSource = href ? getVideoEmbedSource(href) : null;
            return videoSource
              ? <VideoEmbed url={href || ''} />
              : <ExternalLink href={href || ''}>{children}</ExternalLink>;
          },
          img: ({ src, alt }) => (
            <figure className="my-8">
              <div className="relative rounded-xl overflow-hidden border border-white/10 group">
                <img src={src} alt={alt || ''} className="w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              {alt && (
                <figcaption className="text-center text-sm text-gray-500 mt-3">{alt}</figcaption>
              )}
            </figure>
          ),
          hr: () => (
            <hr className="my-12 border-white/10" />
          ),
          strong: ({ children }) => (
            <strong className="text-white font-semibold">{children}</strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

const ArticleBlocks: React.FC<{ blocks: Block[]; language: 'en' | 'ar' }> = ({ blocks, language }) => (
  <div className="space-y-6">
    {blocks.map((block) => {
      switch (block.type) {
        case 'title': {
          const title = getContentByLanguage(block.content, language);
          if (block.level === 1) return <h2 key={block.id} className="my-8 text-3xl font-bold text-white">{title}</h2>;
          if (block.level === 2) return <h3 key={block.id} className="my-6 text-2xl font-bold text-white">{title}</h3>;
          return <h4 key={block.id} className="my-4 text-xl font-semibold text-sky-300">{title}</h4>;
        }
        case 'richText':
          return <div key={block.id}><ArticleContent content={getContentByLanguage(block.content, language)} /></div>;
        case 'image': {
          const alt = getContentByLanguage(block.alt, language);
          const caption = getContentByLanguage(block.caption, language);
          return (
            <figure key={block.id} className="my-8">
              <img src={block.url} alt={alt} loading="lazy" className="w-full rounded-xl border border-white/10" />
              {caption && <figcaption className="mt-3 text-center text-sm text-gray-500">{caption}</figcaption>}
            </figure>
          );
        }
        case 'video':
          return (
            <VideoEmbed
              key={block.id}
              url={block.url}
              caption={getContentByLanguage(block.caption, language)}
            />
          );
        case 'quote':
          return (
            <blockquote key={block.id} className="my-8 border-s-2 border-blue-500 bg-white/[.03] p-5 text-lg italic text-gray-200">
              <ArticleContent content={getContentByLanguage(block.content, language)} />
              {getContentByLanguage(block.author, language) && (
                <footer className="mt-3 text-sm not-italic text-gray-400">
                  {getContentByLanguage(block.author, language)}
                </footer>
              )}
            </blockquote>
          );
        case 'divider':
          return <hr key={block.id} className="my-10 border-white/10" />;
        default:
          return null;
      }
    })}
  </div>
);

/**
 * =====================================================
 * #11 ARTICLE PAGE - MAIN ARTICLE PAGE
 * =====================================================
 */

const ArticlePage: React.FC = () => {
  const { t, isRTL, language } = useLanguage();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const { getArticleBySlug: getArticleFromContext, articlesLoading, articlesError } = useArticles();
  const { switchLanguage, getLanguageLabel, getCurrentLanguage } = useLanguageSwitch();

  // Check translation availability for article from context
  const articleFromContext = getArticleFromContext(slug || '', language);
  const articleContent = articleFromContext?.content[language];
  const isLoading = articlesLoading;
  const hasTranslation = articleFromContext
    ? checkTranslationAvailability(articleFromContext.content as Record<string, unknown>, language)
    : true;
  const availableLang = articleFromContext ? getAvailableLanguage(articleFromContext.content) : null;

  // SEO: Get article data for SEO Manager
  const articleTitle = articleContent?.title || '';
  const articleDescription = articleContent?.description || '';
  const articleExcerpt = articleContent?.excerpt || '';
  const articleSlug = articleFromContext?.content[language]?.slug || slug || '';
  const articleSEO = articleFromContext?.content[language]?.seo;
  const articleImage = articleFromContext?.image || '';
  const articleAuthor = articleFromContext?.authorName || articleFromContext?.author || '';
  const articlePublishedTime = articleFromContext?.publishedAt || articleFromContext?.createdAt || '';

  useEffect(() => {
    if (!slug) {
      navigate('/');
      return;
    }

    setShowContent(false);
    // Scroll to top on article change
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!articlesLoading && articleFromContext) {
      requestAnimationFrame(() => setShowContent(true));
    }
  }, [slug, navigate, articlesLoading, articleFromContext]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: articleTitle,
        text: articleDescription || articleExcerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="relative">
          <div className="absolute -inset-10 rounded-full bg-blue-500/20 animate-ping" />
          <div className="relative w-16 h-16 border-2 border-blue-500/50 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (articlesError && !articleFromContext) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-white">
            {language === 'ar' ? 'تعذر تحميل المقال' : 'Unable to load this article'}
          </h1>
          <p role="alert" className="text-gray-400">
            {language === 'ar' ? 'تحقق من اتصالك وحاول مرة أخرى لاحقاً.' : 'Check your connection and try again later.'}
          </p>
        </div>
      </div>
    );
  }

  if (!articleFromContext) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">{t('common.notFound')}</h1>
          <Link to="/" className="text-blue-400 hover:text-blue-300 transition-colors">
            {t('common.returnHome')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* SEO Manager - Dynamic Meta Tags */}
      <SEOManager
        title={articleSEO?.title || articleTitle}
        description={articleSEO?.description || articleDescription || articleExcerpt}
        keywords={articleSEO?.keywords}
        ogTitle={articleSEO?.ogTitle || articleTitle}
        ogDescription={articleSEO?.ogDescription || articleDescription || articleExcerpt}
        ogImage={articleSEO?.ogImage || articleImage}
        ogType="article"
        canonicalUrl={articleSEO?.canonicalUrl || generateCanonicalUrl(WEBSITE_URL, `/articles/${articleSlug}`, language)}
        article={{
          publishedTime: articlePublishedTime,
          author: articleAuthor,
          section: articleFromContext.category,
          tags: articleFromContext.tags,
        }}
      />

      <div className="min-h-screen bg-[#050505]">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={articleFromContext.image}
            alt={articleTitle}
            className="w-full h-full object-cover"
           
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-[#050505]/60 to-[#050505]" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-blue-500/10" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className={`transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Translation Warning */}
              {articleFromContext && !hasTranslation && (
                <div className="mb-6">
                  <MissingTranslationWarning
                    content={articleFromContext.content as { en: { title: string; slug: string; excerpt: string; description: string; seo: { title: string; description: string; ogTitle: string; ogDescription: string }; blocks: unknown[] }; ar: { title: string; slug: string; excerpt: string; description: string; seo: { title: string; description: string; ogTitle: string; ogDescription: string }; blocks: unknown[] } }}
                    fieldName={t('common.relatedArticles')}
                  />
                  <button
                    onClick={() => availableLang && switchLanguage(availableLang as 'en' | 'ar')}
                    className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm hover:bg-blue-500/30 transition-colors"
                  >
                    {language === 'en' ? 'عرض باللغة العربية' : 'View in English'}
                  </button>
                </div>
              )}

              <span
                className="inline-block px-4 py-2 text-sm rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 mb-6"
               
              >
                {articleFromContext.category}
              </span>

              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"

               
              >
                {/* Use multilingual content from context or fallback to default */}
                {articleTitle}
              </h1>

              <p
                className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
               
              >
                {/* Use multilingual excerpt from context or fallback to default */}
                {articleExcerpt || articleDescription}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {articleAuthor}
                </span>

                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(articlePublishedTime).toLocaleDateString(language === 'ar' ? 'ar' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>

                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {articleFromContext.readTime} {t('article.minRead')}
                </span>

                <button
                  onClick={() => switchLanguage(getCurrentLanguage() === 'en' ? 'ar' : 'en')}
                  className="ml-4 w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300"
                 
                >
                  <span className="text-xs font-medium text-gray-300">{getLanguageLabel(getCurrentLanguage() === 'en' ? 'ar' : 'en')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-blue-500/5 blur-2xl" />
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className={`transition-all duration-700 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {articleContent?.description && (
            <ArticleContent content={articleContent.description} />
          )}
          {articleContent?.blocks.length ? (
            <ArticleBlocks
              blocks={articleContent.blocks}
              language={language}
            />
          ) : null}
        </div>

        {/* Tags */}
        <div className={`mt-12 flex flex-wrap gap-2 transition-all duration-700 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {articleFromContext.tags.map((tag, index) => (
            <span
              key={index}
              className="px-4 py-2 text-sm rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-blue-500/30 transition-colors duration-300"

            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Share Section */}
        <div className={`mt-12 pt-8 border-t border-white/10 transition-all duration-700 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">{t('article.share')}</h3>
              <p className="text-gray-400 text-sm">{t('article.shareDesc')}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 flex items-center gap-2"
               
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                {t('common.share')}
              </button>
            </div>
          </div>
        </div>

        {/* Back Navigation */}
        <div className={`mt-16 transition-all duration-700 delay-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Link
            to="/#articles"
            className="group inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
           
          >
            <svg
              className={`w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300 ${isRTL ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('article.backToArticles')}
          </Link>
        </div>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-blue-500/3 blur-2xl" />
      </div>
      </div>
    </>
  );
};

export default ArticlePage;
// =====================================================
// SEO MANAGER COMPONENT - AXIOMX ADMIN SYSTEM
// Phase 4F-C: SEO Runtime & Meta Tags
// Centralized component for managing all Meta Tags
// =====================================================

import React, { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { SEOContent } from '../../types/project';

// Default SEO values
const DEFAULT_SEO = {
  siteName: 'AXIOMX',
  siteNameAr: 'AXIOMX',
  baseUrl: 'https://axiomx.space.minimax.io',
  defaultImage: 'https://axiomx.space.minimax.io/axiomx-logo.png',
};

// Props interface for SEOManager
export interface SEOManagerProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product' | 'profile';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  noIndex?: boolean;
  language?: 'en' | 'ar';
}

// Get or create meta tag helper
const getOrCreateMetaTag = (name: string, property?: boolean): HTMLMetaElement | null => {
  const attribute = property ? 'property' : 'name';
  let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;

  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }

  return meta;
};

// Get or create link tag helper
const getOrCreateLinkTag = (rel: string): HTMLLinkElement | null => {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }

  return link;
};

// Main SEO Manager Component
const SEOManager: React.FC<SEOManagerProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  article,
  noIndex = false,
  language = 'en',
}) => {
  const location = useLocation();
  const { language: contextLanguage } = useLanguage();
  const currentLang = language || contextLanguage;

  // Update document title
  const updateTitle = useCallback((newTitle: string) => {
    const fullTitle = newTitle.includes(DEFAULT_SEO.siteName)
      ? newTitle
      : `${newTitle} | ${currentLang === 'ar' ? DEFAULT_SEO.siteNameAr : DEFAULT_SEO.siteName}`;

    document.title = fullTitle;

    // Update og:title if not explicitly set
    const ogTitleMeta = getOrCreateMetaTag('og:title', true);
    if (ogTitleMeta && !ogTitle) {
      ogTitleMeta.setAttribute('content', fullTitle);
    }
  }, [currentLang, ogTitle]);

  // Update meta description
  const updateDescription = useCallback((newDescription: string) => {
    const descMeta = getOrCreateMetaTag('description');
    if (descMeta) {
      descMeta.setAttribute('content', newDescription);
    }

    // Update og:description if not explicitly set
    const ogDescMeta = getOrCreateMetaTag('og:description', true);
    if (ogDescMeta && !ogDescription) {
      ogDescMeta.setAttribute('content', newDescription);
    }
  }, [ogDescription]);

  // Update meta keywords
  const updateKeywords = useCallback((newKeywords: string) => {
    const keywordsMeta = getOrCreateMetaTag('keywords');
    if (keywordsMeta) {
      keywordsMeta.setAttribute('content', newKeywords);
    }
  }, []);

  // Update canonical URL
  const updateCanonical = useCallback((url: string) => {
    const canonicalLink = getOrCreateLinkTag('canonical');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', url);
    }
  }, []);

  // Update OpenGraph tags
  const updateOpenGraph = useCallback((options: {
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogType?: string;
    url?: string;
  }) => {
    const currentUrl = `${DEFAULT_SEO.baseUrl}${location.pathname}`;

    // og:url
    const ogUrlMeta = getOrCreateMetaTag('og:url', true);
    if (ogUrlMeta) {
      ogUrlMeta.setAttribute('content', options.url || currentUrl);
    }

    // og:type
    const ogTypeMeta = getOrCreateMetaTag('og:type', true);
    if (ogTypeMeta) {
      ogTypeMeta.setAttribute('content', options.ogType || 'website');
    }

    // og:title
    const ogTitleMeta = getOrCreateMetaTag('og:title', true);
    if (ogTitleMeta) {
      ogTitleMeta.setAttribute('content', options.ogTitle || document.title);
    }

    // og:description
    const ogDescMeta = getOrCreateMetaTag('og:description', true);
    if (ogDescMeta) {
      ogDescMeta.setAttribute('content', options.ogDescription || '');
    }

    // og:image
    const ogImageMeta = getOrCreateMetaTag('og:image', true);
    if (ogImageMeta) {
      ogImageMeta.setAttribute('content', options.ogImage || DEFAULT_SEO.defaultImage);
    }

    // og:image:secure_url
    const ogImageSecureMeta = getOrCreateMetaTag('og:image:secure_url', true);
    if (ogImageSecureMeta) {
      ogImageSecureMeta.setAttribute('content', options.ogImage || DEFAULT_SEO.defaultImage);
    }

    // og:locale
    const ogLocaleMeta = getOrCreateMetaTag('og:locale', true);
    if (ogLocaleMeta) {
      ogLocaleMeta.setAttribute('content', currentLang === 'ar' ? 'ar_AR' : 'en_US');
    }

    // og:site_name
    const ogSiteNameMeta = getOrCreateMetaTag('og:site_name', true);
    if (ogSiteNameMeta) {
      ogSiteNameMeta.setAttribute('content', currentLang === 'ar' ? DEFAULT_SEO.siteNameAr : DEFAULT_SEO.siteName);
    }

    // Twitter Card
    const twitterCardMeta = getOrCreateMetaTag('twitter:card');
    if (twitterCardMeta) {
      twitterCardMeta.setAttribute('content', 'summary_large_image');
    }

    const twitterTitleMeta = getOrCreateMetaTag('twitter:title');
    if (twitterTitleMeta) {
      twitterTitleMeta.setAttribute('content', options.ogTitle || document.title);
    }

    const twitterDescMeta = getOrCreateMetaTag('twitter:description');
    if (twitterDescMeta) {
      twitterDescMeta.setAttribute('content', options.ogDescription || '');
    }

    const twitterImageMeta = getOrCreateMetaTag('twitter:image');
    if (twitterImageMeta) {
      twitterImageMeta.setAttribute('content', options.ogImage || DEFAULT_SEO.defaultImage);
    }

    const twitterUrlMeta = getOrCreateMetaTag('twitter:url');
    if (twitterUrlMeta) {
      twitterUrlMeta.setAttribute('content', options.url || currentUrl);
    }
  }, [location.pathname, currentLang]);

  // Update article-specific meta tags
  const updateArticleMeta = useCallback((articleData?: SEOManagerProps['article']) => {
    if (!articleData) return;

    if (articleData.publishedTime) {
      const publishedMeta = getOrCreateMetaTag('article:published_time', true);
      if (publishedMeta) {
        publishedMeta.setAttribute('content', articleData.publishedTime);
      }
    }

    if (articleData.modifiedTime) {
      const modifiedMeta = getOrCreateMetaTag('article:modified_time', true);
      if (modifiedMeta) {
        modifiedMeta.setAttribute('content', articleData.modifiedTime);
      }
    }

    if (articleData.author) {
      const authorMeta = getOrCreateMetaTag('article:author', true);
      if (authorMeta) {
        authorMeta.setAttribute('content', articleData.author);
      }
    }

    if (articleData.section) {
      const sectionMeta = getOrCreateMetaTag('article:section', true);
      if (sectionMeta) {
        sectionMeta.setAttribute('content', articleData.section);
      }
    }

    if (articleData.tags && articleData.tags.length > 0) {
      // Remove existing tag metas
      document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());

      // Add new tag metas
      articleData.tags.forEach(tag => {
        const tagMeta = document.createElement('meta');
        tagMeta.setAttribute('property', 'article:tag');
        tagMeta.setAttribute('content', tag);
        document.head.appendChild(tagMeta);
      });
    }
  }, []);

  // Handle robots/noindex
  const updateRobots = useCallback((shouldNoIndex: boolean) => {
    const robotsMeta = getOrCreateMetaTag('robots');
    if (robotsMeta) {
      robotsMeta.setAttribute('content', shouldNoIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }

    const googlebotMeta = getOrCreateMetaTag('googlebot');
    if (googlebotMeta) {
      googlebotMeta.setAttribute('content', shouldNoIndex ? 'noindex, nofollow' : 'index, follow');
    }
  }, []);

  // Main effect to update all SEO tags
  useEffect(() => {
    // Update document title
    if (title) {
      updateTitle(title);
    }

    // Update meta description
    if (description) {
      updateDescription(description);
    }

    // Update meta keywords
    if (keywords) {
      updateKeywords(keywords);
    }

    // Update canonical URL
    if (canonicalUrl) {
      updateCanonical(canonicalUrl);
    } else {
      // Auto-generate canonical URL from current path
      const autoCanonical = `${DEFAULT_SEO.baseUrl}${location.pathname}`;
      updateCanonical(autoCanonical);
    }

    // Update OpenGraph tags
    updateOpenGraph({
      ogTitle,
      ogDescription,
      ogImage,
      ogType,
    });

    // Update article-specific meta
    updateArticleMeta(article);

    // Handle noindex
    updateRobots(noIndex);

    // Cleanup function to reset to defaults on unmount
    return () => {
      // This cleanup runs when component unmounts
    };
  }, [
    title,
    description,
    keywords,
    canonicalUrl,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    article,
    noIndex,
    location.pathname,
    updateTitle,
    updateDescription,
    updateKeywords,
    updateCanonical,
    updateOpenGraph,
    updateArticleMeta,
    updateRobots,
  ]);

  // This component doesn't render anything
  return null;
};

// Helper function to generate canonical URL
export const generateCanonicalUrl = (
  baseUrl: string = DEFAULT_SEO.baseUrl,
  path: string,
  language: 'en' | 'ar' = 'en'
): string => {
  // Remove trailing slash and language prefix if present
  const cleanPath = path.replace(/\/$/, '').replace(/^\/(ar|en)\//, '/');

  // Add language prefix for Arabic
  const prefix = language === 'ar' ? '/ar' : '';

  return `${baseUrl}${prefix}${cleanPath}`;
};

// Helper function to generate SEO content from project/article data
export const generateSEOFromContent = (
  content: {
    title?: string;
    description?: string;
    excerpt?: string;
    seo?: SEOContent;
    slug?: string;
  } | undefined,
  language: 'en' | 'ar',
  type: 'project' | 'article' = 'article',
  options?: {
    baseUrl?: string;
    defaultImage?: string;
  }
): SEOManagerProps => {
  const baseUrl = options?.baseUrl || DEFAULT_SEO.baseUrl;
  const defaultImage = options?.defaultImage || DEFAULT_SEO.defaultImage;

  if (!content) {
    return {
      title: '',
      description: '',
      keywords: '',
      canonicalUrl: baseUrl,
      ogTitle: '',
      ogDescription: '',
      ogImage: defaultImage,
      ogType: type === 'article' ? 'article' : 'website',
    };
  }

  // Get SEO data from content or generate from content
  const seoData = content.seo as SEOContent | undefined || {} as SEOContent;

  const title = seoData?.title || content.title || '';
  const description = seoData?.description || content.description || content.excerpt || '';
  const keywords = seoData?.keywords || '';

  // OpenGraph data
  const ogTitle = seoData?.ogTitle || seoData?.title || content.title || '';
  const ogDescription = seoData?.ogDescription || seoData?.description || content.description || content.excerpt || '';
  const ogImage = seoData?.ogImage || defaultImage;

  // Canonical URL
  const slug = content.slug || '';
  const canonicalUrl = seoData?.canonicalUrl || generateCanonicalUrl(baseUrl, `/${type}/${slug}`, language);

  // OG Type
  const ogType = type === 'article' ? 'article' : 'website';

  return {
    title,
    description,
    keywords,
    canonicalUrl,
    ogTitle,
    ogDescription,
    ogImage,
    ogType: ogType as 'website' | 'article' | 'product' | 'profile',
  };
};

export default SEOManager;
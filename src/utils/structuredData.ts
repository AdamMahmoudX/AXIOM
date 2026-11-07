/**
 * =====================================================
 * STRUCTURED DATA UTILITY - Schema.org JSON-LD Generator
 * AXIOMX Admin System - Phase 4F-D
 * =====================================================
 *
 * Generates Schema.org structured data for:
 * - Organization schema (global)
 * - Article schema (blog posts)
 * - Project/CreativeWork schema (portfolio projects)
 * - BreadcrumbList schema
 * - WebSite schema
 * =====================================================
 */

import { Article } from '../types/project';
import { Project } from '../types/project';
import { SITE_URL } from '../config/env';

// Base URL for the website
export const WEBSITE_URL = SITE_URL;

// Organization schema - applies to all pages
export interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs: string[];
  contactPoint?: {
    '@type': 'ContactPoint';
    contactType: string;
    email: string;
  };
}

export const generateOrganizationSchema = (): OrganizationSchema => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AXIOMX',
  url: WEBSITE_URL,
  logo: `${WEBSITE_URL}/axiomx-logo.png`,
  description: 'AXIOMX technology solutions.',
  sameAs: [],
});

// WebSite schema for search
export interface WebSiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
}

export const generateWebSiteSchema = (): WebSiteSchema => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'AXIOMX',
  url: WEBSITE_URL,
});

// Article schema for blog posts
export interface ArticleSchema {
  '@context': 'https://schema.org';
  '@type': 'Article';
  headline: string;
  description: string;
  image: string;
  author: {
    '@type': 'Person';
    name: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  datePublished: string;
  dateModified: string;
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
  keywords?: string;
  articleSection?: string;
  wordCount?: number;
}

export const generateArticleSchema = (
  article: Article,
  language: 'en' | 'ar'
): ArticleSchema => {
  const content = article.content[language];
  const url = `${WEBSITE_URL}/${language === 'ar' ? 'ar' : ''}articles/${content.slug || article.id}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: content.title || article.title,
    description: content.excerpt || article.excerpt,
    image: article.image,
    author: {
      '@type': 'Person',
      name: article.authorName || article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'AXIOMX',
      logo: {
        '@type': 'ImageObject',
        url: `${WEBSITE_URL}/axiomx-logo.png`,
      },
    },
    datePublished: article.createdAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: article.tags?.join(', ') || '',
    articleSection: article.category,
    wordCount: article.readTime ? article.readTime * 200 : undefined,
  };
};

// CreativeWork schema for projects
export interface ProjectSchema {
  '@context': 'https://schema.org';
  '@type': 'CreativeWork';
  name: string;
  description: string;
  image: string;
  author: {
    '@type': 'Organization';
    name: string;
  };
  dateCreated: string;
  dateModified: string;
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
  genre?: string;
  keywords?: string;
}

export const generateProjectSchema = (
  project: Project,
  language: 'en' | 'ar'
): ProjectSchema => {
  const content = project.content[language];
  const url = `${WEBSITE_URL}/${language === 'ar' ? 'ar' : ''}projects/${content.slug || project.id}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: content.title || project.name,
    description: content.excerpt || project.shortDescription,
    image: project.image,
    author: {
      '@type': 'Organization',
      name: 'AXIOMX',
    },
    dateCreated: project.createdAt,
    dateModified: project.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    genre: project.category,
    keywords: project.category,
  };
};

// BreadcrumbList schema for navigation
export interface BreadcrumbItem {
  position: number;
  name: string;
  url: string;
}

export interface BreadcrumbListSchema {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

export const generateBreadcrumbSchema = (items: BreadcrumbItem[]): BreadcrumbListSchema => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item) => ({
    '@type': 'ListItem',
    position: item.position,
    name: item.name,
    item: item.url,
  })),
});

// Service schema for services pages
export interface ServiceSchema {
  '@context': 'https://schema.org';
  '@type': 'Service';
  name: string;
  description: string;
  provider: {
    '@type': 'Organization';
    name: string;
  };
  areaServed: string;
  serviceType: string;
}

export const generateServiceSchema = (
  name: string,
  description: string,
  category: string
): ServiceSchema => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  provider: {
    '@type': 'Organization',
    name: 'AXIOMX',
  },
  areaServed: 'Worldwide',
  serviceType: category,
});

// Utility function to convert schema to JSON-LD string
export const toJsonLd = <T>(schema: T): string => {
  return JSON.stringify(schema);
};

// Helper to inject JSON-LD script into document
export const injectJsonLd = (schema: object, id: string = 'structured-data'): void => {
  if (typeof document !== 'undefined') {
    // Remove existing script if present
    const existingScript = document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }

    // Create new script element
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify(schema);

    // Insert at the end of head
    document.head.appendChild(script);
  }
};
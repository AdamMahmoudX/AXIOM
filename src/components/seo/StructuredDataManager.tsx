/**
 * =====================================================
 * STRUCTURED DATA MANAGER - React Component
 * AXIOMX Admin System - Phase 4F-D
 * =====================================================
 *
 * Dynamically injects JSON-LD structured data based on current route
 * =====================================================
 */

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateArticleSchema,
  generateProjectSchema,
  generateBreadcrumbSchema,
  injectJsonLd,
  WEBSITE_URL,
} from '../../utils/structuredData';
import { useArticles } from '../../context/ArticleContext';
import { useProjects } from '../../context/ProjectContext';
import { useLanguage } from '../../context/LanguageContext';

interface StructuredDataManagerProps {
  // Optional explicit type override
  type?: 'article' | 'project' | 'service' | 'home';
  // ID for the specific content item (article/project ID)
  id?: string;
  // Slug for the specific content
  slug?: string;
  // Custom breadcrumb items
  breadcrumbItems?: Array<{ name: string; url: string }>;
}

const StructuredDataManager: React.FC<StructuredDataManagerProps> = ({
  type,
  id,
  slug,
  breadcrumbItems,
}) => {
  const location = useLocation();
  const { articles, getArticle } = useArticles();
  const { projects, getProject } = useProjects();
  const { language } = useLanguage();

  useEffect(() => {
    // Generate and inject schemas based on current route
    const injectSchemas = () => {
      // Always inject organization schema
      const orgSchema = generateOrganizationSchema();
      injectJsonLd(orgSchema, 'schema-organization');

      // Inject website schema for home page
      if (location.pathname === '/' || location.pathname === '/ar') {
        const websiteSchema = generateWebSiteSchema();
        injectJsonLd(websiteSchema, 'schema-website');
      }

      // Handle specific content types
      if (type === 'article' && id) {
        const article = getArticle(id);
        if (article && article.status === 'published') {
          const articleSchema = generateArticleSchema(article, language);
          injectJsonLd(articleSchema, 'schema-article');
        }
      }

      if (type === 'project' && id) {
        const project = getProject(id);
        if (project) {
          const projectSchema = generateProjectSchema(project, language);
          injectJsonLd(projectSchema, 'schema-project');
        }
      }

      // Inject breadcrumb schema if items provided
      if (breadcrumbItems && breadcrumbItems.length > 0) {
        const breadcrumbSchema = generateBreadcrumbSchema(
          breadcrumbItems.map((item, index) => ({
            position: index + 1,
            name: item.name,
            url: item.url,
          }))
        );
        injectJsonLd(breadcrumbSchema, 'schema-breadcrumb');
      }
    };

    // Debounce to avoid multiple rapid injections
    const timeoutId = setTimeout(injectSchemas, 100);

    return () => clearTimeout(timeoutId);
  }, [location.pathname, type, id, slug, language, articles, projects, breadcrumbItems]);

  // This component doesn't render anything
  return null;
};

export default StructuredDataManager;

/**
 * Hook for programmatic structured data management
 */
export const useStructuredData = () => {
  const { articles } = useArticles();
  const { projects } = useProjects();
  const { language } = useLanguage();

  const getArticleStructuredData = (articleId: string) => {
    const article = articles.find((a) => a.id === articleId);
    if (!article) return null;

    return {
      '@context': 'https://schema.org',
      ...generateArticleSchema(article, language),
    };
  };

  const getProjectStructuredData = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return null;

    return {
      '@context': 'https://schema.org',
      ...generateProjectSchema(project, language),
    };
  };

  return {
    getArticleStructuredData,
    getProjectStructuredData,
    injectJsonLd,
    WEBSITE_URL,
  };
};
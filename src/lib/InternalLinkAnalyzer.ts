// =====================================================
// INTERNAL LINK ANALYZER - AXIOMX ADMIN SYSTEM
// Phase 4F-F4: Content Intelligence and SEO Analysis
// Analyzes internal linking structure between content items
// =====================================================

import { Project } from '../types/project';
import { Article } from '../types/project';
import { InternalLink, LinkType } from '../data/internalLinks';

// =====================================================
// TYPES
// =====================================================

// Content Node for link analysis
export interface ContentNode {
  id: string;
  type: 'project' | 'article' | 'service';
  title: string;
  titleAr?: string;
  slug: string;
  url: string;
}

// Link between content nodes
export interface ContentLink {
  sourceId: string;
  targetId: string;
  sourceType: 'project' | 'article' | 'service';
  targetType: 'project' | 'article' | 'service';
  anchorText?: string;
}

// Internal Link Analysis Result
export interface InternalLinkAnalysis {
  analyzedAt: string;
  totalNodes: number;
  totalLinks: number;
  orphanContent: ContentNode[];
  pagesWithoutIncomingLinks: ContentNode[];
  pagesWithoutOutgoingLinks: ContentNode[];
  poorlyConnectedContent: ContentNode[];
  linkOpportunities: LinkOpportunity[];
  linkReport: LinkReport;
}

// Link Opportunity
export interface LinkOpportunity {
  sourceNode: ContentNode;
  targetNode: ContentNode;
  reason: string;
  reasonAr: string;
  suggestedAnchorText?: string;
  suggestedAnchorTextAr?: string;
  priority: 'high' | 'medium' | 'low';
}

// Link Report Summary
export interface LinkReport {
  totalProjects: number;
  totalArticles: number;
  totalServices: number;
  totalLinks: number;
  projectsWithIncomingLinks: number;
  projectsWithOutgoingLinks: number;
  articlesWithIncomingLinks: number;
  articlesWithOutgoingLinks: number;
  avgLinksPerContent: number;
  maxLinks: { nodeId: string; count: number };
  minLinks: { nodeId: string; count: number };
}

// Storage key
const LINKS_ANALYSIS_STORAGE_KEY = 'axiomx_internal_links_analysis';
const CUSTOM_LINKS_STORAGE_KEY = 'axiomx_custom_internal_links';

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

// Get all content nodes
export const getAllContentNodes = (
  projects: Project[],
  articles: Article[]
): ContentNode[] => {
  const nodes: ContentNode[] = [];

  // Add projects
  projects.forEach((project) => {
    if (project.content.en.title && project.content.en.slug) {
      nodes.push({
        id: project.id,
        type: 'project',
        title: project.content.en.title,
        titleAr: project.content.ar.title,
        slug: project.content.en.slug,
        url: `/projects/${project.content.en.slug}`,
      });
    }
  });

  // Add articles
  articles.forEach((article) => {
    if (article.content.en.title && article.content.en.slug) {
      nodes.push({
        id: article.id,
        type: 'article',
        title: article.content.en.title,
        titleAr: article.content.ar.title,
        slug: article.content.en.slug,
        url: `/articles/${article.content.en.slug}`,
      });
    }
  });

  return nodes;
};

// Get incoming links count for a node
export const getIncomingLinksCount = (
  nodeId: string,
  links: ContentLink[]
): number => {
  return links.filter((link) => link.targetId === nodeId).length;
};

// Get outgoing links count for a node
export const getOutgoingLinksCount = (
  nodeId: string,
  links: ContentLink[]
): number => {
  return links.filter((link) => link.sourceId === nodeId).length;
};

// Check if content is orphan (no incoming or outgoing links)
export const isOrphanContent = (
  nodeId: string,
  links: ContentLink[]
): boolean => {
  const incoming = getIncomingLinksCount(nodeId, links);
  const outgoing = getOutgoingLinksCount(nodeId, links);
  return incoming === 0 && outgoing === 0;
};

// =====================================================
// STORAGE FUNCTIONS
// =====================================================

// Get stored custom links
export const getStoredCustomLinks = (): ContentLink[] => {
  try {
    const stored = localStorage.getItem(CUSTOM_LINKS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as ContentLink[];
    }
  } catch (error) {
    console.error('[InternalLinkAnalyzer] Error loading custom links:', error);
  }
  return [];
};

// Save custom links
const saveCustomLinks = (links: ContentLink[]): void => {
  try {
    localStorage.setItem(CUSTOM_LINKS_STORAGE_KEY, JSON.stringify(links));
    console.log('[InternalLinkAnalyzer] Custom links saved to localStorage');
  } catch (error) {
    console.error('[InternalLinkAnalyzer] Error saving custom links:', error);
  }
};

// =====================================================
// CUSTOM LINK MANAGEMENT
// =====================================================

// Add a custom link
export const addCustomLink = (link: Omit<ContentLink, never>): boolean => {
  const links = getStoredCustomLinks();

  // Check if link already exists
  const exists = links.some(
    (l) => l.sourceId === link.sourceId && l.targetId === link.targetId
  );

  if (exists) {
    console.warn('[InternalLinkAnalyzer] Link already exists');
    return false;
  }

  links.push(link);
  saveCustomLinks(links);
  console.log('[InternalLinkAnalyzer] Custom link added:', link.sourceId, '->', link.targetId);

  return true;
};

// Remove a custom link
export const removeCustomLink = (sourceId: string, targetId: string): boolean => {
  const links = getStoredCustomLinks();
  const initialLength = links.length;

  const filteredLinks = links.filter(
    (l) => !(l.sourceId === sourceId && l.targetId === targetId)
  );

  if (filteredLinks.length === initialLength) {
    console.warn('[InternalLinkAnalyzer] Link not found');
    return false;
  }

  saveCustomLinks(filteredLinks);
  console.log('[InternalLinkAnalyzer] Custom link removed:', sourceId, '->', targetId);

  return true;
};

// =====================================================
// LINK ANALYSIS FUNCTIONS
// =====================================================

// Analyze internal links between all content
export const analyzeInternalLinks = (
  projects: Project[],
  articles: Article[],
  services?: InternalLink[]
): InternalLinkAnalysis => {
  const nodes = getAllContentNodes(projects, articles);

  // Get custom links
  const customLinks = getStoredCustomLinks();

  // Build link graph from content blocks
  const contentLinks: ContentLink[] = [];

  // Extract links from project blocks
  projects.forEach((project) => {
    const projectLinks = extractLinksFromBlocks(project.id, 'project', project.content.en.blocks || []);
    contentLinks.push(...projectLinks);

    const projectLinksAr = extractLinksFromBlocks(project.id, 'project', project.content.ar.blocks || []);
    contentLinks.push(...projectLinksAr);
  });

  // Extract links from article blocks
  articles.forEach((article) => {
    const articleLinks = extractLinksFromBlocks(article.id, 'article', article.content.en.blocks || []);
    contentLinks.push(...articleLinks);

    const articleLinksAr = extractLinksFromBlocks(article.id, 'article', article.content.ar.blocks || []);
    contentLinks.push(...articleLinksAr);
  });

  // Combine content links with custom links
  const allLinks = [...contentLinks, ...customLinks];

  // Find orphan content
  const orphanContent = findOrphanContent(nodes, allLinks);

  // Find pages without incoming links
  const pagesWithoutIncomingLinks = findPagesWithoutIncomingLinks(nodes, allLinks);

  // Find pages without outgoing links
  const pagesWithoutOutgoingLinks = findPagesWithoutOutgoingLinks(nodes, allLinks);

  // Find poorly connected content
  const poorlyConnectedContent = findPoorlyConnectedContent(nodes, allLinks);

  // Find link opportunities
  const linkOpportunities = findLinkOpportunities(nodes, allLinks);

  // Generate link report
  const linkReport = generateLinkReport(nodes, allLinks);

  // Save analysis result
  const analysis: InternalLinkAnalysis = {
    analyzedAt: new Date().toISOString(),
    totalNodes: nodes.length,
    totalLinks: allLinks.length,
    orphanContent,
    pagesWithoutIncomingLinks,
    pagesWithoutOutgoingLinks,
    poorlyConnectedContent,
    linkOpportunities,
    linkReport,
  };

  try {
    localStorage.setItem(LINKS_ANALYSIS_STORAGE_KEY, JSON.stringify(analysis));
  } catch (error) {
    console.error('[InternalLinkAnalyzer] Error saving analysis:', error);
  }

  return analysis;
};

// Extract links from content blocks
const extractLinksFromBlocks = (
  sourceId: string,
  sourceType: 'project' | 'article',
  blocks: any[]
): ContentLink[] => {
  const links: ContentLink[] = [];

  blocks.forEach((block) => {
    // Check for richText blocks with links
    if (block.type === 'richText' && block.content) {
      // Extract internal links from rich text content
      const content = typeof block.content === 'string'
        ? block.content
        : block.content.en || block.content.ar || '';

      const internalLinkPattern = /\/(projects|articles)\/([^\s<>"']+)/g;
      let match;

      while ((match = internalLinkPattern.exec(content)) !== null) {
        const targetType = match[1] === 'projects' ? 'project' : 'article';
        const targetSlug = match[2];

        // Find target node by slug
        // This is a simplified version - in production, you'd query the actual data
        links.push({
          sourceId,
          targetId: targetSlug, // Using slug as ID for now
          sourceType,
          targetType,
          anchorText: extractAnchorText(content, match.index),
        });
      }
    }

    // Check for link block type
    if (block.type === 'link' && block.targetId) {
      links.push({
        sourceId,
        targetId: block.targetId,
        sourceType,
        targetType: block.targetType || 'project',
        anchorText: block.text || block.title,
      });
    }

    // Check for internal blocks with links
    if (block.internalLinks && Array.isArray(block.internalLinks)) {
      block.internalLinks.forEach((link: any) => {
        links.push({
          sourceId,
          targetId: link.id,
          sourceType,
          targetType: link.type || 'project',
          anchorText: link.title,
        });
      });
    }
  });

  return links;
};

// Extract anchor text around a URL
const extractAnchorText = (content: string, urlIndex: number): string => {
  const before = content.substring(Math.max(0, urlIndex - 50), urlIndex);
  const after = content.substring(urlIndex, Math.min(content.length, urlIndex + 50));

  // Find text between > and < before the URL
  const beforeMatch = before.match(/>([^<]+)$/);
  if (beforeMatch) {
    return beforeMatch[1].trim();
  }

  return '';
};

// Find orphan content (no incoming or outgoing links)
export const findOrphanContent = (
  nodes: ContentNode[],
  links: ContentLink[]
): ContentNode[] => {
  return nodes.filter((node) => isOrphanContent(node.id, links));
};

// Find pages without incoming links
export const findPagesWithoutIncomingLinks = (
  nodes: ContentNode[],
  links: ContentLink[]
): ContentNode[] => {
  return nodes.filter((node) => getIncomingLinksCount(node.id, links) === 0);
};

// Find pages without outgoing links
export const findPagesWithoutOutgoingLinks = (
  nodes: ContentNode[],
  links: ContentLink[]
): ContentNode[] => {
  return nodes.filter((node) => getOutgoingLinksCount(node.id, links) === 0);
};

// Find poorly connected content (low link count)
export const findPoorlyConnectedContent = (
  nodes: ContentNode[],
  links: ContentLink[],
  threshold: number = 1
): ContentNode[] => {
  return nodes.filter((node) => {
    const totalLinks = getIncomingLinksCount(node.id, links) + getOutgoingLinksCount(node.id, links);
    return totalLinks <= threshold;
  });
};

// Find link opportunities
export const findLinkOpportunities = (
  nodes: ContentNode[],
  links: ContentLink[]
): LinkOpportunity[] => {
  const opportunities: LinkOpportunity[] = [];

  // Find nodes without outgoing links that could link to orphan content
  const pagesWithoutOutgoing = findPagesWithoutOutgoingLinks(nodes, links);
  const orphanContent = findOrphanContent(nodes, links);
  const pagesWithoutIncoming = findPagesWithoutIncomingLinks(nodes, links);

  // Opportunity 1: Connect pages without outgoing links to orphan content
  pagesWithoutOutgoing.forEach((sourceNode) => {
    orphanContent.forEach((targetNode) => {
      if (sourceNode.id !== targetNode.id) {
        opportunities.push({
          sourceNode,
          targetNode,
          reason: `Link from "${sourceNode.title}" to orphan content "${targetNode.title}"`,
          reasonAr: `ربط "${sourceNode.titleAr || sourceNode.title}" بالمحتوى المعزول "${targetNode.titleAr || targetNode.title}"`,
          suggestedAnchorText: targetNode.title,
          suggestedAnchorTextAr: targetNode.titleAr,
          priority: 'high',
        });
      }
    });
  });

  // Opportunity 2: Connect related content by type
  const projects = nodes.filter((n) => n.type === 'project');
  const articles = nodes.filter((n) => n.type === 'article');

  // Find articles without incoming project links
  const articlesWithoutProjectLinks = articles.filter((article) => {
    const incomingProjectLinks = links.filter(
      (link) => link.targetId === article.id && link.sourceType === 'project'
    );
    return incomingProjectLinks.length === 0;
  });

  projects.forEach((project) => {
    articlesWithoutProjectLinks.forEach((article) => {
      // Check if link already exists
      const linkExists = links.some(
        (l) => l.sourceId === project.id && l.targetId === article.id
      );

      if (!linkExists) {
        opportunities.push({
          sourceNode: project,
          targetNode: article,
          reason: `Related project "${project.title}" could link to article "${article.title}"`,
          reasonAr: `المشروع ذو الصلة "${project.titleAr || project.title}" يمكنه ربط المقالة "${article.titleAr || article.title}"`,
          suggestedAnchorText: article.title,
          suggestedAnchorTextAr: article.titleAr,
          priority: 'medium',
        });
      }
    });
  });

  // Sort by priority
  opportunities.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Limit to top 50 opportunities
  return opportunities.slice(0, 50);
};

// Generate link report
export const generateLinkReport = (
  nodes: ContentNode[],
  links: ContentLink[]
): LinkReport => {
  const projects = nodes.filter((n) => n.type === 'project');
  const articles = nodes.filter((n) => n.type === 'article');
  const services = nodes.filter((n) => n.type === 'service');

  let totalIncoming = 0;
  let totalOutgoing = 0;
  let maxLinksCount = 0;
  let maxLinksNodeId = '';
  let minLinksCount = Infinity;
  let minLinksNodeId = '';

  nodes.forEach((node) => {
    const incoming = getIncomingLinksCount(node.id, links);
    const outgoing = getOutgoingLinksCount(node.id, links);
    const total = incoming + outgoing;

    totalIncoming += incoming;
    totalOutgoing += outgoing;

    if (total > maxLinksCount) {
      maxLinksCount = total;
      maxLinksNodeId = node.id;
    }

    if (total < minLinksCount) {
      minLinksCount = total;
      minLinksNodeId = node.id;
    }
  });

  const avgLinksPerContent = nodes.length > 0
    ? Math.round((totalIncoming + totalOutgoing) / nodes.length)
    : 0;

  return {
    totalProjects: projects.length,
    totalArticles: articles.length,
    totalServices: services.length,
    totalLinks: links.length,
    projectsWithIncomingLinks: projects.filter((p) => getIncomingLinksCount(p.id, links) > 0).length,
    projectsWithOutgoingLinks: projects.filter((p) => getOutgoingLinksCount(p.id, links) > 0).length,
    articlesWithIncomingLinks: articles.filter((a) => getIncomingLinksCount(a.id, links) > 0).length,
    articlesWithOutgoingLinks: articles.filter((a) => getOutgoingLinksCount(a.id, links) > 0).length,
    avgLinksPerContent,
    maxLinks: { nodeId: maxLinksNodeId, count: maxLinksCount },
    minLinks: { nodeId: minLinksNodeId, count: minLinksCount === Infinity ? 0 : minLinksCount },
  };
};

// =====================================================
// GETTERS
// =====================================================

// Get last analysis result
export const getLastAnalysis = (): InternalLinkAnalysis | null => {
  try {
    const stored = localStorage.getItem(LINKS_ANALYSIS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as InternalLinkAnalysis;
    }
  } catch (error) {
    console.error('[InternalLinkAnalyzer] Error loading last analysis:', error);
  }
  return null;
};

// Get link graph for visualization
export const getLinkGraph = (
  nodes: ContentNode[],
  links: ContentLink[]
): { nodes: ContentNode[]; edges: ContentLink[] } => {
  // Filter to only include nodes that have links
  const linkedNodeIds = new Set<string>();
  links.forEach((link) => {
    linkedNodeIds.add(link.sourceId);
    linkedNodeIds.add(link.targetId);
  });

  const linkedNodes = nodes.filter((node) => linkedNodeIds.has(node.id));

  return {
    nodes: linkedNodes,
    edges: links,
  };
};

// =====================================================
// STATISTICS
// =====================================================

// Get internal linking statistics
export const getLinkingStatistics = (
  projects: Project[],
  articles: Article[]
): {
  totalContent: number;
  linkedContent: number;
  orphanContent: number;
  linkingPercentage: number;
  avgIncomingPerContent: number;
  avgOutgoingPerContent: number;
} => {
  const nodes = getAllContentNodes(projects, articles);
  const links = getStoredCustomLinks();
  const analysis = getLastAnalysis();

  if (!analysis || nodes.length === 0) {
    return {
      totalContent: nodes.length,
      linkedContent: nodes.length,
      orphanContent: 0,
      linkingPercentage: 100,
      avgIncomingPerContent: 0,
      avgOutgoingPerContent: 0,
    };
  }

  const linkedContent = nodes.length - analysis.orphanContent.length;
  const linkingPercentage = Math.round((linkedContent / nodes.length) * 100);

  let totalIncoming = 0;
  let totalOutgoing = 0;

  nodes.forEach((node) => {
    totalIncoming += getIncomingLinksCount(node.id, links);
    totalOutgoing += getOutgoingLinksCount(node.id, links);
  });

  return {
    totalContent: nodes.length,
    linkedContent,
    orphanContent: analysis.orphanContent.length,
    linkingPercentage,
    avgIncomingPerContent: Math.round(totalIncoming / nodes.length),
    avgOutgoingPerContent: Math.round(totalOutgoing / nodes.length),
  };
};

// =====================================================
// EXPORT
// =====================================================

// Export analysis as JSON
export const exportAnalysisAsJSON = (analysis: InternalLinkAnalysis): string => {
  return JSON.stringify(analysis, null, 2);
};

// Export analysis as downloadable file
export const downloadAnalysisReport = (analysis: InternalLinkAnalysis): void => {
  const json = exportAnalysisAsJSON(analysis);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `internal-links-analysis-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
  // Analysis
  analyzeInternalLinks,
  findOrphanContent,
  findLinkOpportunities,
  generateLinkReport,

  // Custom Links
  addCustomLink,
  removeCustomLink,
  getStoredCustomLinks,

  // Utilities
  getAllContentNodes,
  getIncomingLinksCount,
  getOutgoingLinksCount,
  isOrphanContent,

  // Getters
  getLastAnalysis,
  getLinkGraph,

  // Statistics
  getLinkingStatistics,

  // Export
  exportAnalysisAsJSON,
  downloadAnalysisReport,
};
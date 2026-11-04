// =====================================================
// INTERNAL LINKS DATA - AXIOMX ADMIN SYSTEM
// Phase 4C: Internal Linking System
// =====================================================

// =====================================================
// TYPES
// =====================================================

export type LinkType = 'project' | 'article' | 'service';

export interface InternalLink {
  id: string;
  type: LinkType;
  title: string;
  titleAr: string;
  url: string;
  icon?: string;
}

export interface RichTextLink {
  id: string;
  text: string;
  linkId: string;
  linkType: LinkType;
}

export const LINK_TYPE_LABELS: Record<LinkType, { en: string; ar: string }> = {
  project: { en: 'Project', ar: 'مشروع' },
  article: { en: 'Article', ar: 'مقال' },
  service: { en: 'Service', ar: 'خدمة' },
};

export const LINK_TYPE_ICONS: Record<LinkType, string> = {
  project: 'folder',
  article: 'file-text',
  service: 'briefcase',
};

// =====================================================
// PROJECTS LINKS
// =====================================================

export const PROJECT_LINKS: InternalLink[] = [
  {
    id: 'proj-001',
    type: 'project',
    title: 'AXIOMX Admin Dashboard',
    titleAr: 'لوحة تحكم AXIOMX',
    url: '/admin/projects/view/proj-001',
  },
  {
    id: 'proj-002',
    type: 'project',
    title: 'HealthTrack Mobile App',
    titleAr: 'تطبيق HealthTrack',
    url: '/admin/projects/view/proj-002',
  },
  {
    id: 'proj-003',
    type: 'project',
    title: 'FinanceFlow SaaS Platform',
    titleAr: 'منصة FinanceFlow',
    url: '/admin/projects/view/proj-003',
  },
  {
    id: 'proj-004',
    type: 'project',
    title: 'EduLearn Platform',
    titleAr: 'منصة EduLearn',
    url: '/admin/projects/view/proj-004',
  },
  {
    id: 'proj-005',
    type: 'project',
    title: 'RetailMax E-commerce',
    titleAr: 'RetailMax للتجارة الإلكترونية',
    url: '/admin/projects/view/proj-005',
  },
  {
    id: 'proj-006',
    type: 'project',
    title: 'SmartHome IoT System',
    titleAr: 'نظام SmartHome IoT',
    url: '/admin/projects/view/proj-006',
  },
  {
    id: 'proj-007',
    type: 'project',
    title: 'CryptoTrack Wallet',
    titleAr: 'محفظة CryptoTrack',
    url: '/admin/projects/view/proj-007',
  },
  {
    id: 'proj-008',
    type: 'project',
    title: 'TravelEase App',
    titleAr: 'تطبيق TravelEase',
    url: '/admin/projects/view/proj-008',
  },
  {
    id: 'proj-009',
    type: 'project',
    title: 'HRConnect Portal',
    titleAr: 'بوابة HRConnect',
    url: '/admin/projects/view/proj-009',
  },
  {
    id: 'proj-010',
    type: 'project',
    title: 'GameArena Platform',
    titleAr: 'منصة GameArena',
    url: '/admin/projects/view/proj-010',
  },
  {
    id: 'proj-011',
    type: 'project',
    title: 'MediCare Portal',
    titleAr: 'بوابة MediCare',
    url: '/admin/projects/view/proj-011',
  },
  {
    id: 'proj-012',
    type: 'project',
    title: 'LogisticsPro Tracker',
    titleAr: 'متتبع LogisticsPro',
    url: '/admin/projects/view/proj-012',
  },
  {
    id: 'proj-013',
    type: 'project',
    title: 'FitLife Dashboard',
    titleAr: 'لوحة FitLife',
    url: '/admin/projects/view/proj-013',
  },
  {
    id: 'proj-014',
    type: 'project',
    title: 'RealEstate Hub',
    titleAr: 'مركز RealEstate',
    url: '/admin/projects/view/proj-014',
  },
  {
    id: 'proj-015',
    type: 'project',
    title: 'FoodDelivery App',
    titleAr: 'تطبيق FoodDelivery',
    url: '/admin/projects/view/proj-015',
  },
];

// =====================================================
// ARTICLES LINKS
// =====================================================

export const ARTICLE_LINKS: InternalLink[] = [
  {
    id: 'article-cybersecurity',
    type: 'article',
    title: 'Cybersecurity Basics',
    titleAr: 'أساسيات الأمن السيبراني',
    url: '/articles/cybersecurity-basics',
  },
  {
    id: 'article-future-ai',
    type: 'article',
    title: 'The Future of AI',
    titleAr: 'مستقبل الذكاء الاصطناعي',
    url: '/articles/future-of-ai',
  },
  {
    id: 'article-react-framework',
    type: 'article',
    title: 'React Framework Guide',
    titleAr: 'دليل إطار عمل React',
    url: '/articles/react-framework',
  },
  {
    id: 'article-web-security',
    type: 'article',
    title: 'Web Application Security',
    titleAr: 'أمان تطبيقات الويب',
    url: '/articles/web-security',
  },
  {
    id: 'article-cloud-computing',
    type: 'article',
    title: 'Introduction to Cloud Computing',
    titleAr: 'مقدمة في الحوسبة السحابية',
    url: '/articles/cloud-computing',
  },
  {
    id: 'article-devops-practices',
    type: 'article',
    title: 'DevOps Best Practices',
    titleAr: 'أفضل ممارسات DevOps',
    url: '/articles/devops-practices',
  },
  {
    id: 'article-mobile-ui',
    type: 'article',
    title: 'Mobile UI Design Trends',
    titleAr: 'اتجاهات تصميم واجهات الهاتف',
    url: '/articles/mobile-ui',
  },
  {
    id: 'article-ai-ml-intro',
    type: 'article',
    title: 'AI & Machine Learning Introduction',
    titleAr: 'مقدمة في الذكاء الاصطناعي',
    url: '/articles/ai-ml-intro',
  },
];

// =====================================================
// SERVICES LINKS
// =====================================================

export const SERVICE_LINKS: InternalLink[] = [
  {
    id: 'service-web',
    type: 'service',
    title: 'Web Engineering',
    titleAr: 'هندسة الويب',
    url: '/services/web-engineering',
  },
  {
    id: 'service-mobile',
    type: 'service',
    title: 'Mobile Applications',
    titleAr: 'تطبيقات الهاتف',
    url: '/services/mobile-applications',
  },
  {
    id: 'service-ui',
    type: 'service',
    title: 'UI/UX Architecture',
    titleAr: 'هندسة UI/UX',
    url: '/services/ui-ux-architecture',
  },
  {
    id: 'service-ai',
    type: 'service',
    title: 'AI Systems',
    titleAr: 'أنظمة الذكاء الاصطناعي',
    url: '/services/ai-systems',
  },
  {
    id: 'service-games',
    type: 'service',
    title: 'Game Development',
    titleAr: 'تطوير الألعاب',
    url: '/services/game-development',
  },
  {
    id: 'service-software',
    type: 'service',
    title: 'Digital Infrastructure',
    titleAr: 'البنية التحتية الرقمية',
    url: '/services/digital-infrastructure',
  },
];

// =====================================================
// ALL LINKS COMBINED
// =====================================================

export const ALL_LINKS: InternalLink[] = [
  ...PROJECT_LINKS,
  ...ARTICLE_LINKS,
  ...SERVICE_LINKS,
];

// =====================================================
// HELPER FUNCTIONS
// =====================================================

// Get links by type
export const getLinksByType = (type: LinkType): InternalLink[] => {
  switch (type) {
    case 'project':
      return PROJECT_LINKS;
    case 'article':
      return ARTICLE_LINKS;
    case 'service':
      return SERVICE_LINKS;
    default:
      return [];
  }
};

// Get link by ID
export const getLinkById = (id: string): InternalLink | undefined => {
  return ALL_LINKS.find((link) => link.id === id);
};

// Search links
export const searchLinks = (query: string): InternalLink[] => {
  const lowerQuery = query.toLowerCase();
  return ALL_LINKS.filter(
    (link) =>
      link.title.toLowerCase().includes(lowerQuery) ||
      link.titleAr.includes(query)
  );
};

// Check if link exists
export const linkExists = (id: string): boolean => {
  return ALL_LINKS.some((link) => link.id === id);
};

// Get broken links (links that point to non-existent items)
export const getBrokenLinks = (linkIds: string[]): string[] => {
  return linkIds.filter((id) => !linkExists(id));
};
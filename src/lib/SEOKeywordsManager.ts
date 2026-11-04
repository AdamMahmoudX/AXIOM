// =====================================================
// SEO KEYWORDS MANAGER - AXIOMX ADMIN SYSTEM
// Phase 4F-F4: Content Intelligence and SEO Analysis
// Centralized keyword management library with intent classification
// =====================================================

// =====================================================
// TYPES
// =====================================================

// Search Intent Types
export type SearchIntent = 'informational' | 'commercial' | 'transactional' | 'navigational';

// Keyword Interface
export interface SEOKeyword {
  id: string;
  keyword: string;
  keywordAr?: string;
  group: string;
  groupAr?: string;
  intent: SearchIntent;
  difficulty: number; // 0-100
  priority: number; // 0-100
  volume?: number;
  cpc?: number;
  createdAt: string;
  updatedAt: string;
  relatedKeywords?: string[];
  contentIds?: {
    projectIds: string[];
    articleIds: string[];
  };
}

// Keyword Group Interface
export interface KeywordGroup {
  id: string;
  name: string;
  nameAr?: string;
  description?: string;
  keywords: string[];
  color?: string;
}

// Storage key
const KEYWORDS_STORAGE_KEY = 'axiomx_seo_keywords';
const GROUPS_STORAGE_KEY = 'axiomx_seo_keyword_groups';

// Intent Labels
export const INTENT_LABELS: Record<SearchIntent, { en: string; ar: string; description: string; descriptionAr: string }> = {
  informational: {
    en: 'Informational',
    ar: 'معلوماتية',
    description: 'User is looking for information or answers',
    descriptionAr: 'المستخدم يبحث عن معلومات أو إجابات',
  },
  commercial: {
    en: 'Commercial',
    ar: 'تجارية',
    description: 'User is researching products or services',
    descriptionAr: 'المستخدم يبحث عن منتجات أو خدمات',
  },
  transactional: {
    en: 'Transactional',
    ar: 'شرائية',
    description: 'User is ready to make a purchase',
    descriptionAr: 'المستخدم مستعد للشراء',
  },
  navigational: {
    en: 'Navigational',
    ar: 'تنقلية',
    description: 'User is looking for a specific website or page',
    descriptionAr: 'المستخدم يبحث عن موقع أو صفحة محددة',
  },
};

// Default Keyword Groups
export const DEFAULT_KEYWORD_GROUPS: KeywordGroup[] = [
  {
    id: 'group-web-dev',
    name: 'Web Development',
    nameAr: 'تطوير الويب',
    description: 'Keywords related to web development services',
    keywords: ['web development', 'website development', 'web design', 'frontend', 'backend'],
    color: '#3B82F6',
  },
  {
    id: 'group-mobile',
    name: 'Mobile Development',
    nameAr: 'تطوير التطبيقات',
    description: 'Keywords related to mobile app development',
    keywords: ['mobile app development', 'ios development', 'android development', 'react native'],
    color: '#10B981',
  },
  {
    id: 'group-ai',
    name: 'AI & Machine Learning',
    nameAr: 'الذكاء الاصطناعي',
    description: 'Keywords related to AI and ML solutions',
    keywords: ['artificial intelligence', 'machine learning', 'ai solutions', 'deep learning'],
    color: '#8B5CF6',
  },
  {
    id: 'group-ecommerce',
    name: 'E-commerce',
    nameAr: 'التجارة الإلكترونية',
    description: 'Keywords related to e-commerce solutions',
    keywords: ['ecommerce development', 'online store', 'shopify development', 'woocommerce'],
    color: '#F59E0B',
  },
  {
    id: 'group-uiux',
    name: 'UI/UX Design',
    nameAr: 'تصميم UI/UX',
    description: 'Keywords related to design services',
    keywords: ['ui design', 'ux design', 'user interface', 'user experience', 'figma'],
    color: '#EC4899',
  },
];

// =====================================================
// STORAGE FUNCTIONS
// =====================================================

// Get keywords from localStorage
export const getStoredKeywords = (): SEOKeyword[] => {
  try {
    const stored = localStorage.getItem(KEYWORDS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as SEOKeyword[];
    }
  } catch (error) {
    console.error('[SEOKeywordsManager] Error loading keywords:', error);
  }
  return [];
};

// Save keywords to localStorage
const saveKeywords = (keywords: SEOKeyword[]): void => {
  try {
    localStorage.setItem(KEYWORDS_STORAGE_KEY, JSON.stringify(keywords));
    console.log('[SEOKeywordsManager] Keywords saved to localStorage');
  } catch (error) {
    console.error('[SEOKeywordsManager] Error saving keywords:', error);
  }
};

// Get keyword groups from localStorage
export const getStoredGroups = (): KeywordGroup[] => {
  try {
    const stored = localStorage.getItem(GROUPS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as KeywordGroup[];
    }
  } catch (error) {
    console.error('[SEOKeywordsManager] Error loading groups:', error);
  }
  return DEFAULT_KEYWORD_GROUPS;
};

// Save keyword groups to localStorage
const saveGroups = (groups: KeywordGroup[]): void => {
  try {
    localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
    console.log('[SEOKeywordsManager] Groups saved to localStorage');
  } catch (error) {
    console.error('[SEOKeywordsManager] Error saving groups:', error);
  }
};

// =====================================================
// KEYWORD CRUD OPERATIONS
// =====================================================

// Create a new keyword
export const createKeyword = (
  keywordData: Omit<SEOKeyword, 'id' | 'createdAt' | 'updatedAt'>
): SEOKeyword => {
  const keywords = getStoredKeywords();
  const id = `kw-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();

  const newKeyword: SEOKeyword = {
    ...keywordData,
    id,
    createdAt: now,
    updatedAt: now,
  };

  keywords.push(newKeyword);
  saveKeywords(keywords);
  console.log('[SEOKeywordsManager] Keyword created:', newKeyword.keyword);

  return newKeyword;
};

// Update an existing keyword
export const updateKeyword = (
  id: string,
  updates: Partial<Omit<SEOKeyword, 'id' | 'createdAt'>>
): SEOKeyword | null => {
  const keywords = getStoredKeywords();
  const index = keywords.findIndex((kw) => kw.id === id);

  if (index === -1) {
    console.error('[SEOKeywordsManager] Keyword not found:', id);
    return null;
  }

  const updatedKeyword: SEOKeyword = {
    ...keywords[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  keywords[index] = updatedKeyword;
  saveKeywords(keywords);
  console.log('[SEOKeywordsManager] Keyword updated:', updatedKeyword.keyword);

  return updatedKeyword;
};

// Delete a keyword
export const deleteKeyword = (id: string): boolean => {
  const keywords = getStoredKeywords();
  const index = keywords.findIndex((kw) => kw.id === id);

  if (index === -1) {
    console.error('[SEOKeywordsManager] Keyword not found:', id);
    return false;
  }

  const deletedKeyword = keywords.splice(index, 1)[0];
  saveKeywords(keywords);
  console.log('[SEOKeywordsManager] Keyword deleted:', deletedKeyword.keyword);

  return true;
};

// Get all keywords
export const getKeywords = (): SEOKeyword[] => {
  return getStoredKeywords();
};

// Get keywords by group
export const getKeywordsByGroup = (groupName: string): SEOKeyword[] => {
  const keywords = getStoredKeywords();
  return keywords.filter(
    (kw) => kw.group.toLowerCase() === groupName.toLowerCase()
  );
};

// Get keywords by intent
export const getKeywordsByIntent = (intent: SearchIntent): SEOKeyword[] => {
  const keywords = getStoredKeywords();
  return keywords.filter((kw) => kw.intent === intent);
};

// Get keyword by ID
export const getKeywordById = (id: string): SEOKeyword | undefined => {
  const keywords = getStoredKeywords();
  return keywords.find((kw) => kw.id === id);
};

// Search keywords
export const searchKeywords = (query: string): SEOKeyword[] => {
  const keywords = getStoredKeywords();
  const lowerQuery = query.toLowerCase();

  return keywords.filter(
    (kw) =>
      kw.keyword.toLowerCase().includes(lowerQuery) ||
      (kw.keywordAr && kw.keywordAr.includes(query)) ||
      kw.group.toLowerCase().includes(lowerQuery)
  );
};

// =====================================================
// KEYWORD ANALYSIS FUNCTIONS
// =====================================================

// Calculate priority score for a keyword
export const calculatePriority = (keyword: SEOKeyword): number => {
  let priority = 0;

  // Volume factor (0-30 points)
  if (keyword.volume) {
    if (keyword.volume >= 10000) priority += 30;
    else if (keyword.volume >= 5000) priority += 25;
    else if (keyword.volume >= 1000) priority += 20;
    else if (keyword.volume >= 500) priority += 15;
    else if (keyword.volume >= 100) priority += 10;
    else priority += 5;
  }

  // Difficulty factor (inverse - 0-30 points)
  if (keyword.difficulty <= 20) priority += 30;
  else if (keyword.difficulty <= 40) priority += 25;
  else if (keyword.difficulty <= 60) priority += 20;
  else if (keyword.difficulty <= 80) priority += 10;
  else priority += 5;

  // Intent factor (0-25 points)
  switch (keyword.intent) {
    case 'transactional':
      priority += 25; // Highest value
      break;
    case 'commercial':
      priority += 20;
      break;
    case 'informational':
      priority += 15;
      break;
    case 'navigational':
      priority += 10;
      break;
  }

  // Content coverage factor (0-15 points)
  const contentIds = keyword.contentIds || { projectIds: [], articleIds: [] };
  const contentCount = contentIds.projectIds.length + contentIds.articleIds.length;
  if (contentCount >= 3) priority += 15;
  else if (contentCount === 2) priority += 10;
  else if (contentCount === 1) priority += 5;

  return Math.min(100, priority);
};

// Recalculate priorities for all keywords
export const recalculateAllPriorities = (): SEOKeyword[] => {
  const keywords = getStoredKeywords();
  const updatedKeywords = keywords.map((kw) => ({
    ...kw,
    priority: calculatePriority(kw),
  }));

  saveKeywords(updatedKeywords);
  console.log('[SEOKeywordsManager] All priorities recalculated');

  return updatedKeywords;
};

// =====================================================
// CONTENT-KEYWORD LINKING
// =====================================================

// Link keyword to content
export const linkKeywordToContent = (
  keywordId: string,
  contentType: 'project' | 'article',
  contentId: string
): boolean => {
  const keywords = getStoredKeywords();
  const index = keywords.findIndex((kw) => kw.id === keywordId);

  if (index === -1) {
    console.error('[SEOKeywordsManager] Keyword not found:', keywordId);
    return false;
  }

  const keyword = keywords[index];
  const contentIds = keyword.contentIds || { projectIds: [], articleIds: [] };

  if (contentType === 'project') {
    if (!contentIds.projectIds.includes(contentId)) {
      contentIds.projectIds.push(contentId);
    }
  } else {
    if (!contentIds.articleIds.includes(contentId)) {
      contentIds.articleIds.push(contentId);
    }
  }

  keywords[index] = {
    ...keyword,
    contentIds,
    priority: calculatePriority({ ...keyword, contentIds }),
    updatedAt: new Date().toISOString(),
  };

  saveKeywords(keywords);
  console.log('[SEOKeywordsManager] Keyword linked to content:', keywordId, contentType, contentId);

  return true;
};

// Unlink keyword from content
export const unlinkKeywordFromContent = (
  keywordId: string,
  contentType: 'project' | 'article',
  contentId: string
): boolean => {
  const keywords = getStoredKeywords();
  const index = keywords.findIndex((kw) => kw.id === keywordId);

  if (index === -1) {
    console.error('[SEOKeywordsManager] Keyword not found:', keywordId);
    return false;
  }

  const keyword = keywords[index];
  const contentIds = keyword.contentIds || { projectIds: [], articleIds: [] };

  if (contentType === 'project') {
    contentIds.projectIds = contentIds.projectIds.filter((id) => id !== contentId);
  } else {
    contentIds.articleIds = contentIds.articleIds.filter((id) => id !== contentId);
  }

  keywords[index] = {
    ...keyword,
    contentIds,
    priority: calculatePriority({ ...keyword, contentIds }),
    updatedAt: new Date().toISOString(),
  };

  saveKeywords(keywords);
  console.log('[SEOKeywordsManager] Keyword unlinked from content:', keywordId, contentType, contentId);

  return true;
};

// Get content without keywords
export const getUnlinkedContent = (
  contentType: 'project' | 'article',
  contentIds: string[]
): string[] => {
  const keywords = getStoredKeywords();
  const linkedIds = new Set<string>();

  keywords.forEach((kw) => {
    const kwContentIds = kw.contentIds || { projectIds: [], articleIds: [] };
    const ids = contentType === 'project' ? kwContentIds.projectIds : kwContentIds.articleIds;
    ids.forEach((id) => linkedIds.add(id));
  });

  return contentIds.filter((id) => !linkedIds.has(id));
};

// =====================================================
// KEYWORD GROUP FUNCTIONS
// =====================================================

// Create a new keyword group
export const createKeywordGroup = (
  groupData: Omit<KeywordGroup, 'id'>
): KeywordGroup => {
  const groups = getStoredGroups();
  const id = `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const newGroup: KeywordGroup = {
    ...groupData,
    id,
  };

  groups.push(newGroup);
  saveGroups(groups);
  console.log('[SEOKeywordsManager] Keyword group created:', newGroup.name);

  return newGroup;
};

// Update a keyword group
export const updateKeywordGroup = (
  id: string,
  updates: Partial<Omit<KeywordGroup, 'id'>>
): KeywordGroup | null => {
  const groups = getStoredGroups();
  const index = groups.findIndex((g) => g.id === id);

  if (index === -1) {
    console.error('[SEOKeywordsManager] Keyword group not found:', id);
    return null;
  }

  const updatedGroup: KeywordGroup = {
    ...groups[index],
    ...updates,
  };

  groups[index] = updatedGroup;
  saveGroups(groups);
  console.log('[SEOKeywordsManager] Keyword group updated:', updatedGroup.name);

  return updatedGroup;
};

// Delete a keyword group
export const deleteKeywordGroup = (id: string): boolean => {
  const groups = getStoredGroups();
  const index = groups.findIndex((g) => g.id === id);

  if (index === -1) {
    console.error('[SEOKeywordsManager] Keyword group not found:', id);
    return false;
  }

  const deletedGroup = groups.splice(index, 1)[0];
  saveGroups(groups);
  console.log('[SEOKeywordsManager] Keyword group deleted:', deletedGroup.name);

  return true;
};

// Get all keyword groups
export const getKeywordGroups = (): KeywordGroup[] => {
  return getStoredGroups();
};

// =====================================================
// ANALYSIS & STATISTICS
// =====================================================

// Get keyword statistics
export const getKeywordStatistics = (): {
  totalKeywords: number;
  byIntent: Record<SearchIntent, number>;
  byGroup: Record<string, number>;
  avgDifficulty: number;
  avgPriority: number;
  highPriorityCount: number;
  lowDifficultyCount: number;
} => {
  const keywords = getStoredKeywords();

  const stats = {
    totalKeywords: keywords.length,
    byIntent: {
      informational: 0,
      commercial: 0,
      transactional: 0,
      navigational: 0,
    } as Record<SearchIntent, number>,
    byGroup: {} as Record<string, number>,
    avgDifficulty: 0,
    avgPriority: 0,
    highPriorityCount: 0,
    lowDifficultyCount: 0,
  };

  if (keywords.length === 0) return stats;

  let totalDifficulty = 0;
  let totalPriority = 0;

  keywords.forEach((kw) => {
    // Count by intent
    stats.byIntent[kw.intent]++;

    // Count by group
    stats.byGroup[kw.group] = (stats.byGroup[kw.group] || 0) + 1;

    // Accumulate difficulty and priority
    totalDifficulty += kw.difficulty;
    totalPriority += kw.priority;

    // Count high priority keywords (>= 70)
    if (kw.priority >= 70) stats.highPriorityCount++;

    // Count low difficulty keywords (<= 30)
    if (kw.difficulty <= 30) stats.lowDifficultyCount++;
  });

  stats.avgDifficulty = Math.round(totalDifficulty / keywords.length);
  stats.avgPriority = Math.round(totalPriority / keywords.length);

  return stats;
};

// Get top priority keywords
export const getTopPriorityKeywords = (limit: number = 10): SEOKeyword[] => {
  const keywords = getStoredKeywords();
  return [...keywords].sort((a, b) => b.priority - a.priority).slice(0, limit);
};

// Get low competition keywords (easy to rank)
export const getLowCompetitionKeywords = (limit: number = 10): SEOKeyword[] => {
  const keywords = getStoredKeywords();
  return [...keywords]
    .filter((kw) => kw.difficulty <= 40)
    .sort((a, b) => a.difficulty - b.difficulty)
    .slice(0, limit);
};

// =====================================================
// KEYWORD GAP ANALYSIS
// =====================================================

// Analyze keyword gaps - keywords not used in any content
export const analyzeKeywordGaps = (contentKeywords: string[]): {
  unusedKeywords: SEOKeyword[];
  usedKeywords: SEOKeyword[];
  recommendations: { keyword: SEOKeyword; reason: string }[];
} => {
  const keywords = getStoredKeywords();
  const contentKeywordsLower = contentKeywords.map((k) => k.toLowerCase());

  const unusedKeywords: SEOKeyword[] = [];
  const usedKeywords: SEOKeyword[] = [];
  const recommendations: { keyword: SEOKeyword; reason: string }[] = [];

  keywords.forEach((kw) => {
    const isUsed = contentKeywordsLower.some(
      (ck) =>
        kw.keyword.toLowerCase().includes(ck) ||
        ck.includes(kw.keyword.toLowerCase())
    );

    if (!isUsed) {
      unusedKeywords.push(kw);

      // Generate recommendation based on priority and difficulty
      if (kw.priority >= 60 && kw.difficulty <= 50) {
        recommendations.push({
          keyword: kw,
          reason: `High priority (${kw.priority}) and low competition (${kw.difficulty})`,
        });
      }
    } else {
      usedKeywords.push(kw);
    }
  });

  // Sort recommendations by priority
  recommendations.sort((a, b) => b.keyword.priority - a.keyword.priority);

  return { unusedKeywords, usedKeywords, recommendations };
};

// =====================================================
// IMPORT/EXPORT
// =====================================================

// Export keywords as JSON
export const exportKeywordsAsJSON = (): string => {
  const keywords = getStoredKeywords();
  const groups = getStoredGroups();

  return JSON.stringify({ keywords, groups }, null, 2);
};

// Import keywords from JSON
export const importKeywordsFromJSON = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);

    if (data.keywords && Array.isArray(data.keywords)) {
      saveKeywords(data.keywords);
    }

    if (data.groups && Array.isArray(data.groups)) {
      saveGroups(data.groups);
    }

    console.log('[SEOKeywordsManager] Keywords imported successfully');
    return true;
  } catch (error) {
    console.error('[SEOKeywordsManager] Error importing keywords:', error);
    return false;
  }
};

// =====================================================
// DEFAULT KEYWORDS INITIALIZATION
// =====================================================

// Initialize with default keywords if none exist
export const initializeDefaultKeywords = (): void => {
  const keywords = getStoredKeywords();

  if (keywords.length > 0) return;

  const defaultKeywords: Omit<SEOKeyword, 'id' | 'createdAt' | 'updatedAt'>[] = [
    // Web Development Keywords
    {
      keyword: 'web development company',
      keywordAr: 'شركة تطوير الويب',
      group: 'Web Development',
      intent: 'commercial',
      difficulty: 65,
      priority: 75,
      volume: 5400,
      contentIds: { projectIds: ['proj-001'], articleIds: [] },
    },
    {
      keyword: 'custom web application',
      keywordAr: 'تطبيق ويب مخصص',
      group: 'Web Development',
      intent: 'commercial',
      difficulty: 55,
      priority: 70,
      volume: 3200,
      contentIds: { projectIds: [], articleIds: [] },
    },
    {
      keyword: 'react development services',
      keywordAr: 'خدمات تطوير React',
      group: 'Web Development',
      intent: 'commercial',
      difficulty: 45,
      priority: 68,
      volume: 2100,
      contentIds: { projectIds: [], articleIds: ['article-005'] },
    },
    {
      keyword: 'full stack development',
      keywordAr: 'تطوير Full Stack',
      group: 'Web Development',
      intent: 'informational',
      difficulty: 50,
      priority: 60,
      volume: 8800,
      contentIds: { projectIds: [], articleIds: [] },
    },
    // Mobile Development Keywords
    {
      keyword: 'mobile app development company',
      keywordAr: 'شركة تطوير تطبيقات الجوال',
      group: 'Mobile Development',
      intent: 'commercial',
      difficulty: 70,
      priority: 80,
      volume: 6600,
      contentIds: { projectIds: ['proj-002', 'proj-008'], articleIds: [] },
    },
    {
      keyword: 'ios app development',
      keywordAr: 'تطوير تطبيقات iOS',
      group: 'Mobile Development',
      intent: 'commercial',
      difficulty: 60,
      priority: 72,
      volume: 4400,
      contentIds: { projectIds: [], articleIds: [] },
    },
    {
      keyword: 'android app development',
      keywordAr: 'تطوير تطبيقات أندرويد',
      group: 'Mobile Development',
      intent: 'commercial',
      difficulty: 58,
      priority: 70,
      volume: 4800,
      contentIds: { projectIds: [], articleIds: [] },
    },
    // AI Keywords
    {
      keyword: 'ai solutions business',
      keywordAr: 'حلول الذكاء الاصطناعي للأعمال',
      group: 'AI & Machine Learning',
      intent: 'commercial',
      difficulty: 55,
      priority: 75,
      volume: 3900,
      contentIds: { projectIds: ['proj-004'], articleIds: ['article-001'] },
    },
    {
      keyword: 'machine learning development',
      keywordAr: 'تطوير تعلم الآلة',
      group: 'AI & Machine Learning',
      intent: 'commercial',
      difficulty: 50,
      priority: 68,
      volume: 2900,
      contentIds: { projectIds: [], articleIds: [] },
    },
    {
      keyword: 'chatbot development',
      keywordAr: 'تطوير الشات بوت',
      group: 'AI & Machine Learning',
      intent: 'transactional',
      difficulty: 40,
      priority: 65,
      volume: 2200,
      contentIds: { projectIds: [], articleIds: [] },
    },
    // E-commerce Keywords
    {
      keyword: 'ecommerce website development',
      keywordAr: 'تطوير موقع تجارة إلكترونية',
      group: 'E-commerce',
      intent: 'transactional',
      difficulty: 60,
      priority: 78,
      volume: 5900,
      contentIds: { projectIds: ['proj-005'], articleIds: [] },
    },
    {
      keyword: 'online store development',
      keywordAr: 'تطوير متجر إلكتروني',
      group: 'E-commerce',
      intent: 'transactional',
      difficulty: 52,
      priority: 72,
      volume: 3600,
      contentIds: { projectIds: [], articleIds: [] },
    },
    // UI/UX Keywords
    {
      keyword: 'ui ux design services',
      keywordAr: 'خدمات تصميم UI UX',
      group: 'UI/UX Design',
      intent: 'commercial',
      difficulty: 48,
      priority: 70,
      volume: 4100,
      contentIds: { projectIds: [], articleIds: ['article-002'] },
    },
    {
      keyword: 'user experience design',
      keywordAr: 'تصميم تجربة المستخدم',
      group: 'UI/UX Design',
      intent: 'informational',
      difficulty: 42,
      priority: 62,
      volume: 7200,
      contentIds: { projectIds: [], articleIds: [] },
    },
    // Informational Keywords
    {
      keyword: 'how to improve website seo',
      keywordAr: 'كيفية تحسين seo الموقع',
      group: 'Web Development',
      intent: 'informational',
      difficulty: 35,
      priority: 55,
      volume: 12100,
      contentIds: { projectIds: [], articleIds: [] },
    },
    {
      keyword: 'cloud architecture best practices',
      keywordAr: 'أفضل ممارسات البنية السحابية',
      group: 'Web Development',
      intent: 'informational',
      difficulty: 45,
      priority: 58,
      volume: 5800,
      contentIds: { projectIds: [], articleIds: ['article-003'] },
    },
    // Navigational Keywords
    {
      keyword: 'axiomx services',
      keywordAr: 'خدمات Axiomx',
      group: 'Web Development',
      intent: 'navigational',
      difficulty: 15,
      priority: 50,
      volume: 800,
      contentIds: { projectIds: [], articleIds: [] },
    },
  ];

  defaultKeywords.forEach((kw) => createKeyword(kw));
  console.log('[SEOKeywordsManager] Default keywords initialized');
};

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
  // Constants
  INTENT_LABELS,
  DEFAULT_KEYWORD_GROUPS,

  // CRUD
  createKeyword,
  updateKeyword,
  deleteKeyword,
  getKeywords,
  getKeywordsByGroup,
  getKeywordsByIntent,
  getKeywordById,
  searchKeywords,

  // Analysis
  calculatePriority,
  recalculateAllPriorities,

  // Content Linking
  linkKeywordToContent,
  unlinkKeywordFromContent,
  getUnlinkedContent,

  // Groups
  createKeywordGroup,
  updateKeywordGroup,
  deleteKeywordGroup,
  getKeywordGroups,

  // Statistics
  getKeywordStatistics,
  getTopPriorityKeywords,
  getLowCompetitionKeywords,

  // Gap Analysis
  analyzeKeywordGaps,

  // Import/Export
  exportKeywordsAsJSON,
  importKeywordsFromJSON,

  // Initialization
  initializeDefaultKeywords,
};
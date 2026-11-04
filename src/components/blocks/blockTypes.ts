// =====================================================
// BLOCK TYPES - AXIOMX ADMIN SYSTEM
// Phase 4E: Multilingual Content System
// =====================================================

export type BlockType =
  | 'title'
  | 'richText'
  | 'image'
  | 'gallery'
  | 'video'
  | 'divider'
  | 'quote'
  | 'team'
  | 'stats'
  | 'timeline'
  | 'cta';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

// =====================================================
// MULTILINGUAL BLOCK CONTENT
// =====================================================

export interface MultilingualContent {
  en: string;
  ar: string;
}

export interface MultilingualCaption {
  en: string;
  ar: string;
}

// =====================================================
// BLOCK INTERFACES WITH MULTILINGUAL SUPPORT
// =====================================================

export interface TitleBlock extends BaseBlock {
  type: 'title';
  content: MultilingualContent;
  level: 1 | 2 | 3;
}

export interface RichTextBlock extends BaseBlock {
  type: 'richText';
  content: MultilingualContent;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  url: string;
  alt: MultilingualContent;
  caption: MultilingualCaption;
}

export interface GalleryImage {
  url: string;
  alt: MultilingualContent;
}

export interface GalleryBlock extends BaseBlock {
  type: 'gallery';
  images: GalleryImage[];
  layout: 'grid' | 'carousel';
}

export interface VideoBlock extends BaseBlock {
  type: 'video';
  url: string;
  caption: MultilingualCaption;
}

export interface DividerBlock extends BaseBlock {
  type: 'divider';
  style: 'line' | 'dots' | 'space';
}

export interface QuoteBlock extends BaseBlock {
  type: 'quote';
  content: MultilingualContent;
  author: MultilingualContent;
}

// Stats Block - Multilingual
export interface StatItem {
  value: string;
  label: MultilingualContent;
}

export interface StatsBlock extends BaseBlock {
  type: 'stats';
  title: MultilingualContent;
  stats: StatItem[];
  layout: 'grid' | 'row' | 'cards';
}

// Timeline Block - Multilingual
export interface TimelineItem {
  id: string;
  date: string;
  title: MultilingualContent;
  description: MultilingualContent;
  icon?: string;
}

export interface TimelineBlock extends BaseBlock {
  type: 'timeline';
  title: MultilingualContent;
  items: TimelineItem[];
  layout: 'vertical' | 'horizontal';
}

// CTA Block - Multilingual
export interface CTABlock extends BaseBlock {
  type: 'cta';
  title: MultilingualContent;
  description: MultilingualContent;
  buttonText: MultilingualContent;
  buttonUrl: string;
  backgroundColor: string;
  alignment: 'left' | 'center' | 'right';
}

// Team Member interface for Team Block
export interface TeamMember {
  id: string;
  employeeId: string;
}

// Team Block interface - Already had some Arabic support, now fully multilingual
export interface TeamBlock extends BaseBlock {
  type: 'team';
  title: MultilingualContent;
  description: MultilingualContent;
  memberIds: string[]; // References to employee IDs
  layout: 'grid' | 'list' | 'carousel';
  showSearch: boolean;
}

// =====================================================
// UNION TYPE
// =====================================================

export type Block =
  | TitleBlock
  | RichTextBlock
  | ImageBlock
  | GalleryBlock
  | VideoBlock
  | DividerBlock
  | QuoteBlock
  | TeamBlock
  | StatsBlock
  | TimelineBlock
  | CTABlock;

// =====================================================
// LABELS & ICONS
// =====================================================

export const BLOCK_LABELS: Record<BlockType, { en: string; ar: string }> = {
  title: { en: 'Title', ar: 'عنوان' },
  richText: { en: 'Rich Text', ar: 'نص غني' },
  image: { en: 'Image', ar: 'صورة' },
  gallery: { en: 'Gallery', ar: 'معرض صور' },
  video: { en: 'Video', ar: 'فيديو' },
  divider: { en: 'Divider', ar: 'فاصل' },
  quote: { en: 'Quote', ar: 'اقتباس' },
  team: { en: 'Team', ar: 'الفريق' },
  stats: { en: 'Statistics', ar: 'إحصائيات' },
  timeline: { en: 'Timeline', ar: 'الجدول الزمني' },
  cta: { en: 'Call to Action', ar: 'دعوة للإجراء' },
};

export const BLOCK_ICONS: Record<BlockType, string> = {
  title: 'type',
  richText: 'file-text',
  image: 'image',
  gallery: 'images',
  video: 'video',
  divider: 'minus',
  quote: 'quote',
  team: 'users',
  stats: 'chart',
  timeline: 'clock',
  cta: 'mouse-pointer',
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

// Create default multilingual content
export const createMultilingualContent = (en: string = '', ar: string = ''): MultilingualContent => ({
  en,
  ar,
});

// Create default multilingual caption
export const createMultilingualCaption = (en: string = '', ar: string = ''): MultilingualCaption => ({
  en,
  ar,
});

// Get content based on language
export const getContentByLanguage = (content: MultilingualContent, language: 'en' | 'ar'): string => {
  return content[language] || content.en || '';
};

// Check if content is complete for a language
export const isContentComplete = (content: MultilingualContent): boolean => {
  return Boolean(content.en && content.en.trim() && content.ar && content.ar.trim());
};

// Deep clone a block with new ID
export const cloneBlock = (block: Block): Block => {
  return {
    ...JSON.parse(JSON.stringify(block)),
    id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
};

// Duplicate block content to other language
export const duplicateBlockContent = (block: Block, fromLang: 'en' | 'ar', toLang: 'en' | 'ar'): Block => {
  const newBlock = cloneBlock(block);

  // Helper to duplicate multilingual content
  const duplicateContent = (content: MultilingualContent | MultilingualCaption | undefined): MultilingualContent | MultilingualCaption | undefined => {
    if (!content) return undefined;
    if (typeof content === 'object' && 'en' in content && 'ar' in content) {
      return { ...content, [toLang]: content[fromLang] };
    }
    return undefined;
  };

  switch (block.type) {
    case 'title':
      (newBlock as TitleBlock).content = duplicateContent(block.content) as MultilingualContent;
      break;
    case 'richText':
      (newBlock as RichTextBlock).content = duplicateContent(block.content) as MultilingualContent;
      break;
    case 'image':
      const imgBlock = newBlock as ImageBlock;
      imgBlock.alt = duplicateContent(block.alt) as MultilingualContent;
      imgBlock.caption = duplicateContent(block.caption) as MultilingualCaption;
      break;
    case 'quote':
      const quoteBlock = newBlock as QuoteBlock;
      quoteBlock.content = duplicateContent(block.content) as MultilingualContent;
      quoteBlock.author = duplicateContent(block.author) as MultilingualContent;
      break;
    case 'team':
      const teamBlock = newBlock as TeamBlock;
      teamBlock.title = duplicateContent(block.title) as MultilingualContent;
      teamBlock.description = duplicateContent(block.description) as MultilingualContent;
      break;
    case 'stats':
      const statsBlock = newBlock as StatsBlock;
      statsBlock.title = duplicateContent(block.title) as MultilingualContent;
      statsBlock.stats = block.stats.map(stat => ({
        ...stat,
        label: { ...stat.label, [toLang]: stat.label[fromLang] },
      }));
      break;
    case 'timeline':
      const timelineBlock = newBlock as TimelineBlock;
      timelineBlock.title = duplicateContent(block.title) as MultilingualContent;
      timelineBlock.items = block.items.map(item => ({
        ...item,
        title: { ...item.title, [toLang]: item.title[fromLang] },
        description: { ...item.description, [toLang]: item.description[fromLang] },
      }));
      break;
    case 'cta':
      const ctaBlock = newBlock as CTABlock;
      ctaBlock.title = duplicateContent(block.title) as MultilingualContent;
      ctaBlock.description = duplicateContent(block.description) as MultilingualContent;
      ctaBlock.buttonText = duplicateContent(block.buttonText) as MultilingualContent;
      break;
  }

  return newBlock;
};
// =====================================================
// BLOCK EDITOR - AXIOMX ADMIN SYSTEM
// Phase 4E: Multilingual Content System
// =====================================================

import React, { useState, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  Block,
  BlockType,
  BLOCK_LABELS,
  BLOCK_ICONS,
  MultilingualContent,
  createMultilingualContent,
} from './blockTypes';
import {
  TitleBlockComponent,
  RichTextBlockComponent,
  ImageBlockComponent,
  GalleryBlockComponent,
  VideoBlockComponent,
  DividerBlockComponent,
  QuoteBlockComponent,
  TeamBlockComponent,
  StatsBlockComponent,
  TimelineBlockComponent,
  CTABlockComponent,
} from './BlockComponents';
import {
  Plus,
  ChevronDown,
  Type,
  FileText,
  Image as ImageIcon,
  Images,
  Video,
  Minus,
  Quote,
  GripVertical,
  Layers,
  Save,
  Undo,
  Redo,
  Users,
  BarChart3,
  Clock,
  MousePointer,
} from 'lucide-react';

const BLOCK_ICONS_MAP: Record<BlockType, React.ReactNode> = {
  title: <Type className="w-4 h-4" />,
  richText: <FileText className="w-4 h-4" />,
  image: <ImageIcon className="w-4 h-4" />,
  gallery: <Images className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
  divider: <Minus className="w-4 h-4" />,
  quote: <Quote className="w-4 h-4" />,
  team: <Users className="w-4 h-4" />,
  stats: <BarChart3 className="w-4 h-4" />,
  timeline: <Clock className="w-4 h-4" />,
  cta: <MousePointer className="w-4 h-4" />,
};

type ContentLanguage = 'en' | 'ar';

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
  readOnly?: boolean;
  activeLanguage?: ContentLanguage;
  onLanguageChange?: (lang: ContentLanguage) => void;
  showLanguageTabs?: boolean;
  translationStatus?: {
    en: 'complete' | 'needs_review' | 'missing';
    ar: 'complete' | 'needs_review' | 'missing';
  };
  onDuplicateBlocks?: (from: ContentLanguage, to: ContentLanguage) => void;
}

const BlockEditor: React.FC<BlockEditorProps> = ({
  blocks,
  onChange,
  readOnly = false,
  activeLanguage = 'en',
  onLanguageChange,
  showLanguageTabs = false,
  translationStatus,
  onDuplicateBlocks,
}) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const canEdit = !readOnly && (user?.role === 'owner' || user?.role === 'admin');

  const generateId = () => `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Create default multilingual content
  const createDefaultContent = (): MultilingualContent => ({
    en: '',
    ar: '',
  });

  const createDefaultBlock = (type: BlockType): Block => {
    const base = { id: generateId(), type };
    switch (type) {
      case 'title':
        return { ...base, type: 'title', content: createDefaultContent(), level: 2 };
      case 'richText':
        return { ...base, type: 'richText', content: createDefaultContent() };
      case 'image':
        return {
          ...base,
          type: 'image',
          url: '',
          alt: createDefaultContent(),
          caption: { en: '', ar: '' },
        };
      case 'gallery':
        return {
          ...base,
          type: 'gallery',
          images: [
            { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop', alt: createDefaultContent() },
          ],
          layout: 'grid',
        };
      case 'video':
        return { ...base, type: 'video', url: '', caption: { en: '', ar: '' } };
      case 'divider':
        return { ...base, type: 'divider', style: 'line' };
      case 'quote':
        return {
          ...base,
          type: 'quote',
          content: createDefaultContent(),
          author: createDefaultContent(),
        };
      case 'team':
        return {
          ...base,
          type: 'team',
          title: createDefaultContent(),
          description: createDefaultContent(),
          memberIds: [],
          layout: 'grid',
          showSearch: true,
        };
      case 'stats':
        return {
          ...base,
          type: 'stats',
          title: createDefaultContent(),
          stats: [],
          layout: 'grid',
        };
      case 'timeline':
        return {
          ...base,
          type: 'timeline',
          title: createDefaultContent(),
          items: [],
          layout: 'vertical',
        };
      case 'cta':
        return {
          ...base,
          type: 'cta',
          title: createDefaultContent(),
          description: createDefaultContent(),
          buttonText: createDefaultContent(),
          buttonUrl: '',
          backgroundColor: 'blue',
          alignment: 'center',
        };
      default:
        return { ...base, type: 'richText', content: createDefaultContent() };
    }
  };

  const addBlock = (type: BlockType) => {
    const newBlock = createDefaultBlock(type);
    onChange([...blocks, newBlock]);
    setShowAddMenu(false);
    setEditingBlockId(newBlock.id);
  };

  const deleteBlock = (id: string) => {
    onChange(blocks.filter((b) => b.id !== id));
  };

  const copyBlock = (id: string) => {
    const block = blocks.find((b) => b.id === id);
    if (block) {
      const newBlock = { ...JSON.parse(JSON.stringify(block)), id: generateId() };
      const index = blocks.findIndex((b) => b.id === id);
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      onChange(newBlocks);
    }
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex((b) => b.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    onChange(newBlocks);
  };

  const updateBlock = useCallback(
    (id: string, updates: Partial<Block>) => {
      onChange(blocks.map((b) => (b.id === id ? { ...b, ...updates } as Block : b)));
    },
    [blocks, onChange]
  );

  const renderBlock = (block: Block, index: number) => {
    const isEditing = editingBlockId === block.id;

    const commonProps = {
      isEditing,
      onStartEdit: () => setEditingBlockId(block.id),
      onEndEdit: () => setEditingBlockId(null),
      onMoveUp: () => moveBlock(block.id, 'up'),
      onMoveDown: () => moveBlock(block.id, 'down'),
      onCopy: () => copyBlock(block.id),
      onDelete: () => deleteBlock(block.id),
      canMoveUp: index > 0,
      canMoveDown: index < blocks.length - 1,
      activeLanguage,
    };

    switch (block.type) {
      case 'title':
        return (
          <TitleBlockComponent
            key={block.id}
            block={block}
            onUpdate={(content, level) => updateBlock(block.id, { content, level } as Partial<Block>)}
            {...commonProps}
          />
        );
      case 'richText':
        return (
          <RichTextBlockComponent
            key={block.id}
            block={block}
            onUpdate={(content) => updateBlock(block.id, { content })}
            {...commonProps}
          />
        );
      case 'image':
        return (
          <ImageBlockComponent
            key={block.id}
            block={block}
            onUpdate={(url, alt, caption) => updateBlock(block.id, { url, alt, caption })}
            {...commonProps}
          />
        );
      case 'gallery':
        return (
          <GalleryBlockComponent
            key={block.id}
            block={block}
            onUpdate={(images, layout) => updateBlock(block.id, { images, layout })}
            {...commonProps}
          />
        );
      case 'video':
        return (
          <VideoBlockComponent
            key={block.id}
            block={block}
            onUpdate={(url, caption) => updateBlock(block.id, { url, caption })}
            {...commonProps}
          />
        );
      case 'divider':
        return (
          <DividerBlockComponent
            key={block.id}
            block={block}
            onUpdate={(style) => updateBlock(block.id, { style })}
            {...commonProps}
          />
        );
      case 'quote':
        return (
          <QuoteBlockComponent
            key={block.id}
            block={block}
            onUpdate={(content, author) => updateBlock(block.id, { content, author })}
            {...commonProps}
          />
        );
      case 'team':
        return (
          <TeamBlockComponent
            key={block.id}
            block={block}
            onUpdate={(updates) => updateBlock(block.id, updates)}
            {...commonProps}
          />
        );
      case 'stats':
        return (
          <StatsBlockComponent
            key={block.id}
            block={block}
            onUpdate={(updates) => updateBlock(block.id, updates)}
            {...commonProps}
          />
        );
      case 'timeline':
        return (
          <TimelineBlockComponent
            key={block.id}
            block={block}
            onUpdate={(updates) => updateBlock(block.id, updates)}
            {...commonProps}
          />
        );
      case 'cta':
        return (
          <CTABlockComponent
            key={block.id}
            block={block}
            onUpdate={(updates) => updateBlock(block.id, updates)}
            {...commonProps}
          />
        );
      default:
        return null;
    }
  };

  // Filter blocks by active language (show all blocks, but display appropriate language content)
  const filteredBlocks = blocks;

  const blockTypes: BlockType[] = [
    'title',
    'richText',
    'image',
    'gallery',
    'video',
    'divider',
    'quote',
    'team',
    'stats',
    'timeline',
    'cta',
  ];

  return (
    <div className="relative">
      {/* Language Tabs (if enabled) */}
      {showLanguageTabs && onLanguageChange && (
        <div className="mb-4">
          <div className="bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden">
            <div className="flex items-center border-b border-white/10">
              {[
                { code: 'ar' as ContentLanguage, label: 'العربية', flag: '🇸🇦' },
                { code: 'en' as ContentLanguage, label: 'English', flag: '🇺🇸' },
              ].map((lang, index) => (
                <React.Fragment key={lang.code}>
                  <button
                    onClick={() => onLanguageChange(lang.code)}
                    className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 transition-colors relative ${
                      activeLanguage === lang.code
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="font-medium">{lang.label}</span>
                    {activeLanguage === lang.code && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                    )}
                  </button>
                  {index === 0 && translationStatus && (
                    <button
                      onClick={() => onDuplicateBlocks?.('en', 'ar')}
                      className="px-2 py-2 text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                      title="Copy English to Arabic"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Editor Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Layers className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">
              {language === 'ar' ? 'محرر المحتوى' : 'Content Editor'}
              {showLanguageTabs && (
                <span className="ml-2 text-xs text-gray-400">
                  ({activeLanguage === 'ar' ? 'العربية' : 'English'})
                </span>
              )}
            </h3>
            <p className="text-xs text-gray-500">
              {blocks.length} {language === 'ar' ? 'عنصر' : 'blocks'}
            </p>
          </div>
        </div>

        {canEdit && (
          <div className="relative">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {language === 'ar' ? 'إضافة عنصر' : 'Add Block'}
              <ChevronDown className={`w-4 h-4 transition-transform ${showAddMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Add Block Menu */}
            {showAddMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowAddMenu(false)} />
                <div className="absolute top-full mt-2 right-0 w-56 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 py-2 overflow-hidden">
                  {blockTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => addBlock(type)}
                      className="w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 flex items-center gap-3 transition-colors"
                    >
                      <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-400">
                        {BLOCK_ICONS_MAP[type]}
                      </span>
                      {BLOCK_LABELS[type][language === 'ar' ? 'ar' : 'en']}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Blocks Container */}
      <div className="space-y-2">
        {blocks.length === 0 ? (
          <div className="bg-[#0a0a0a] border border-dashed border-white/10 rounded-xl p-12 text-center">
            <Layers className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 mb-4">
              {language === 'ar'
                ? 'لا توجد عناصر. ابدأ بإضافة محتوى جديد.'
                : 'No blocks yet. Start adding content.'}
            </p>
            {canEdit && (
              <button
                onClick={() => setShowAddMenu(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-medium transition-colors"
              >
                {language === 'ar' ? 'إضافة أول عنصر' : 'Add First Block'}
              </button>
            )}
          </div>
        ) : (
          blocks.map((block, index) => (
            <div
              key={block.id}
              className={`relative ${draggedIndex === index ? 'opacity-50' : ''}`}
              draggable={canEdit}
              onDragStart={() => setDraggedIndex(index)}
              onDragEnd={() => setDraggedIndex(null)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (draggedIndex !== null && draggedIndex !== index) {
                  const newBlocks = [...blocks];
                  const [removed] = newBlocks.splice(draggedIndex, 1);
                  newBlocks.splice(index, 0, removed);
                  onChange(newBlocks);
                }
                setDraggedIndex(null);
              }}
            >
              {canEdit && (
                <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab z-20">
                  <div className="w-6 h-6 rounded bg-black/50 flex items-center justify-center">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              )}
              {renderBlock(block, index)}
            </div>
          ))
        )}
      </div>

      {/* Add Block Button (Bottom) */}
      {blocks.length > 0 && canEdit && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <button
            onClick={() => setShowAddMenu(true)}
            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-xl text-gray-400 text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {language === 'ar' ? 'إضافة عنصر جديد' : 'Add New Block'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BlockEditor;
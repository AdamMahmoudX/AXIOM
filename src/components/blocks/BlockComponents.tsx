// =====================================================
// BLOCK COMPONENTS - AXIOMX ADMIN SYSTEM
// Phase 4E: Multilingual Content System
// =====================================================

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  TitleBlock,
  RichTextBlock,
  ImageBlock,
  GalleryBlock,
  VideoBlock,
  DividerBlock,
  QuoteBlock,
  TeamBlock,
  StatsBlock,
  TimelineBlock,
  CTABlock,
  Block,
  MultilingualContent,
  GalleryImage,
  StatItem,
  TimelineItem,
} from './blockTypes';
import {
  Type,
  FileText,
  Image as ImageIcon,
  Images,
  Video,
  Minus,
  Quote,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Edit2,
  Check,
  X,
  GripVertical,
  Plus,
  Settings,
  Link2,
  AlertTriangle,
  Users,
  BarChart3,
  Clock,
  MousePointer,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import { TeamBlockComponent } from './TeamBlockComponent';
import { LinkPicker } from '../links/LinkPicker';
import { TextLink } from '../links/RichTextEditor';
import { getBrokenLinks, LinkType, LINK_TYPE_LABELS } from '../../data/internalLinks';

type ContentLanguage = 'en' | 'ar';

interface BlockActionBarProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
  onCopy: () => void;
  onDelete: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

const BlockActionBar: React.FC<BlockActionBarProps> = ({
  onMoveUp,
  onMoveDown,
  onCopy,
  onDelete,
  canMoveUp,
  canMoveDown,
}) => {
  const { language } = useLanguage();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
      <button
        onClick={onMoveUp}
        disabled={!canMoveUp}
        className="w-7 h-7 rounded-lg bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors disabled:opacity-30"
        title={language === 'ar' ? 'تحريك لأعلى' : 'Move Up'}
      >
        <ChevronUp className="w-4 h-4 text-white" />
      </button>
      <button
        onClick={onMoveDown}
        disabled={!canMoveDown}
        className="w-7 h-7 rounded-lg bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors disabled:opacity-30"
        title={language === 'ar' ? 'تحريك لأسفل' : 'Move Down'}
      >
        <ChevronDown className="w-4 h-4 text-white" />
      </button>
      <button
        onClick={onCopy}
        className="w-7 h-7 rounded-lg bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
        title={language === 'ar' ? 'نسخ' : 'Copy'}
      >
        <Copy className="w-4 h-4 text-white" />
      </button>
      {showConfirm ? (
        <div className="flex items-center gap-1">
          <button
            onClick={() => { onDelete(); setShowConfirm(false); }}
            className="w-7 h-7 rounded-lg bg-red-600 hover:bg-red-500 flex items-center justify-center transition-colors"
          >
            <Check className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="w-7 h-7 rounded-lg bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          className="w-7 h-7 rounded-lg bg-black/50 hover:bg-red-600/80 flex items-center justify-center transition-colors"
          title={language === 'ar' ? 'حذف' : 'Delete'}
        >
          <Trash2 className="w-4 h-4 text-white" />
        </button>
      )}
    </div>
  );
};

// =====================================================
// COMMON BLOCK PROPS
// =====================================================

interface CommonBlockProps {
  isEditing: boolean;
  onStartEdit: () => void;
  onEndEdit: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onCopy: () => void;
  onDelete: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  activeLanguage: ContentLanguage;
}

// =====================================================
// TITLE BLOCK
// =====================================================

interface TitleBlockProps extends CommonBlockProps {
  block: TitleBlock;
  onUpdate: (content: MultilingualContent, level?: 1 | 2 | 3) => void;
}

const TitleBlockComponent: React.FC<TitleBlockProps> = ({
  block,
  onUpdate,
  isEditing,
  onStartEdit,
  onEndEdit,
  onMoveUp,
  onMoveDown,
  onCopy,
  onDelete,
  canMoveUp,
  canMoveDown,
  activeLanguage,
}) => {
  const { language } = useLanguage();
  const [editContent, setEditContent] = useState<MultilingualContent>(block.content);
  const [editLevel, setEditLevel] = useState(block.level);

  const handleSave = () => {
    onUpdate(editContent, editLevel);
    onEndEdit();
  };

  const handleCancel = () => {
    setEditContent(block.content);
    setEditLevel(block.level);
    onEndEdit();
  };

  const updateContent = (lang: ContentLanguage, value: string) => {
    setEditContent(prev => ({ ...prev, [lang]: value }));
  };

  const TitleTag = `h${block.level}` as keyof JSX.IntrinsicElements;

  return (
    <div className="relative group py-2">
      <BlockActionBar
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onCopy={onCopy}
        onDelete={onDelete}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
      />

      {isEditing ? (
        <div className="space-y-3 bg-[#0a0a0a] border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-400">
              {language === 'ar' ? 'عنوان' : 'Title'}
            </span>
          </div>
          <div className="flex gap-2 mb-3">
            {([1, 2, 3] as const).map((level) => (
              <button
                key={level}
                onClick={() => setEditLevel(level)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  editLevel === level
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                H{level}
              </button>
            ))}
          </div>

          {/* English Content */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">🇺🇸 English</label>
            <input
              type="text"
              value={editContent.en}
              onChange={(e) => updateContent('en', e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              placeholder="Enter English title..."
              autoFocus
            />
          </div>

          {/* Arabic Content */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">🇸🇦 العربية</label>
            <input
              type="text"
              value={editContent.ar}
              onChange={(e) => updateContent('ar', e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              placeholder="أدخل العنوان بالعربية..."
              dir="rtl"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-medium transition-colors"
            >
              {language === 'ar' ? 'حفظ' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 text-sm font-medium transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={onStartEdit}
          className="cursor-pointer hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors"
        >
          <TitleTag
            className={`font-bold text-white ${
              block.level === 1
                ? 'text-3xl'
                : block.level === 2
                ? 'text-2xl'
                : 'text-xl'
            }`}
            dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
          >
            {block.content[activeLanguage] || block.content.en || (language === 'ar' ? 'عنوان فارغ...' : 'Empty title...')}
          </TitleTag>
        </div>
      )}
    </div>
  );
};

// =====================================================
// RICH TEXT BLOCK
// =====================================================

interface RichTextBlockProps extends CommonBlockProps {
  block: RichTextBlock;
  onUpdate: (content: MultilingualContent) => void;
}

const RichTextBlockComponent: React.FC<RichTextBlockProps> = ({
  block,
  onUpdate,
  isEditing,
  onStartEdit,
  onEndEdit,
  onMoveUp,
  onMoveDown,
  onCopy,
  onDelete,
  canMoveUp,
  canMoveDown,
  activeLanguage,
}) => {
  const { language } = useLanguage();
  const [editContent, setEditContent] = useState<MultilingualContent>(block.content);

  const handleSave = () => {
    onUpdate(editContent);
    onEndEdit();
  };

  const handleCancel = () => {
    setEditContent(block.content);
    onEndEdit();
  };

  const updateContent = (lang: ContentLanguage, value: string) => {
    setEditContent(prev => ({ ...prev, [lang]: value }));
  };

  return (
    <div className="relative group py-2">
      <BlockActionBar
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onCopy={onCopy}
        onDelete={onDelete}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
      />

      {isEditing ? (
        <div className="space-y-3 bg-[#0a0a0a] border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-400">
              {language === 'ar' ? 'نص غني' : 'Rich Text'}
            </span>
          </div>

          {/* English Content */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">🇺🇸 English</label>
            <textarea
              value={editContent.en}
              onChange={(e) => updateContent('en', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 resize-none"
              placeholder="Enter English text..."
            />
          </div>

          {/* Arabic Content */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">🇸🇦 العربية</label>
            <textarea
              value={editContent.ar}
              onChange={(e) => updateContent('ar', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 resize-none"
              placeholder="أدخل النص بالعربية..."
              dir="rtl"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-medium transition-colors"
            >
              {language === 'ar' ? 'حفظ' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 text-sm font-medium transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={onStartEdit}
          className="cursor-pointer hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors"
        >
          <div className="text-gray-300 leading-relaxed whitespace-pre-wrap" dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}>
            {block.content[activeLanguage] || block.content.en || (
              <span className="text-gray-500">
                {language === 'ar' ? 'نص فارغ...' : 'Empty text...'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================
// IMAGE BLOCK
// =====================================================

interface ImageBlockProps extends CommonBlockProps {
  block: ImageBlock;
  onUpdate: (url: string, alt: MultilingualContent, caption: { en: string; ar: string }) => void;
}

const sampleImages = [
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop',
];

const ImageBlockComponent: React.FC<ImageBlockProps> = ({
  block,
  onUpdate,
  isEditing,
  onStartEdit,
  onEndEdit,
  onMoveUp,
  onMoveDown,
  onCopy,
  onDelete,
  canMoveUp,
  canMoveDown,
}) => {
  const { language } = useLanguage();
  const [editUrl, setEditUrl] = useState(block.url);
  const [editAlt, setEditAlt] = useState<MultilingualContent>(block.alt);
  const [editCaption, setEditCaption] = useState(block.caption);

  const handleSave = () => {
    onUpdate(editUrl, editAlt, editCaption);
    onEndEdit();
  };

  const handleCancel = () => {
    setEditUrl(block.url);
    setEditAlt(block.alt);
    setEditCaption(block.caption);
    onEndEdit();
  };

  return (
    <div className="relative group py-2">
      <BlockActionBar
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onCopy={onCopy}
        onDelete={onDelete}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
      />

      {isEditing ? (
        <div className="space-y-3 bg-[#0a0a0a] border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-400">
              {language === 'ar' ? 'صورة' : 'Image'}
            </span>
          </div>
          <input
            type="url"
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
            placeholder="https://..."
          />
          <div className="grid grid-cols-5 gap-2">
            {sampleImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setEditUrl(img)}
                className={`w-full h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                  editUrl === img ? 'border-blue-500' : 'border-transparent hover:border-white/20'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Alt Text - Bilingual */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">🇺🇸 Alt Text (English)</label>
            <input
              type="text"
              value={editAlt.en}
              onChange={(e) => setEditAlt(prev => ({ ...prev, en: e.target.value }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              placeholder="Alt text..."
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">🇸🇦 نص بديل (العربية)</label>
            <input
              type="text"
              value={editAlt.ar}
              onChange={(e) => setEditAlt(prev => ({ ...prev, ar: e.target.value }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              placeholder="النص البديل..."
              dir="rtl"
            />
          </div>

          {/* Caption - Bilingual */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">🇺🇸 Caption (English)</label>
            <input
              type="text"
              value={editCaption.en}
              onChange={(e) => setEditCaption(prev => ({ ...prev, en: e.target.value }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              placeholder="Caption..."
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">🇸🇦 تعليق (العربية)</label>
            <input
              type="text"
              value={editCaption.ar}
              onChange={(e) => setEditCaption(prev => ({ ...prev, ar: e.target.value }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              placeholder="التعليق..."
              dir="rtl"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-medium transition-colors"
            >
              {language === 'ar' ? 'حفظ' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 text-sm font-medium transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={onStartEdit}
          className="cursor-pointer hover:opacity-90 transition-opacity rounded-lg overflow-hidden"
        >
          {block.url ? (
            <figure>
              <img
                src={block.url}
                alt={block.alt.en || block.alt.ar || ''}
                className="w-full rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Invalid+Image';
                }}
              />
              {(block.caption.en || block.caption.ar) && (
                <figcaption className="mt-2 text-sm text-gray-500 text-center">
                  {block.caption.en || block.caption.ar}
                </figcaption>
              )}
            </figure>
          ) : (
            <div className="w-full h-48 bg-white/5 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-gray-600" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// =====================================================
// GALLERY BLOCK
// =====================================================

interface GalleryBlockProps extends CommonBlockProps {
  block: GalleryBlock;
  onUpdate: (images: GalleryImage[], layout?: 'grid' | 'carousel') => void;
}

const GalleryBlockComponent: React.FC<GalleryBlockProps> = ({
  block,
  onUpdate,
  isEditing,
  onStartEdit,
  onEndEdit,
  onMoveUp,
  onMoveDown,
  onCopy,
  onDelete,
  canMoveUp,
  canMoveDown,
}) => {
  const { language } = useLanguage();
  const [editImages, setEditImages] = useState(block.images);
  const [editLayout, setEditLayout] = useState(block.layout);

  const addImage = () => {
    setEditImages([...editImages, { url: sampleImages[0], alt: { en: '', ar: '' } }]);
  };

  const removeImage = (index: number) => {
    setEditImages(editImages.filter((_, i) => i !== index));
  };

  const updateImage = (index: number, url: string) => {
    const newImages = [...editImages];
    newImages[index] = { ...newImages[index], url };
    setEditImages(newImages);
  };

  const handleSave = () => {
    onUpdate(editImages, editLayout);
    onEndEdit();
  };

  const handleCancel = () => {
    setEditImages(block.images);
    setEditLayout(block.layout);
    onEndEdit();
  };

  return (
    <div className="relative group py-2">
      <BlockActionBar
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onCopy={onCopy}
        onDelete={onDelete}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
      />

      {isEditing ? (
        <div className="space-y-3 bg-[#0a0a0a] border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <Images className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-400">
              {language === 'ar' ? 'معرض صور' : 'Gallery'}
            </span>
          </div>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setEditLayout('grid')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                editLayout === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {language === 'ar' ? 'شبكة' : 'Grid'}
            </button>
            <button
              onClick={() => setEditLayout('carousel')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                editLayout === 'carousel'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {language === 'ar' ? 'دائري' : 'Carousel'}
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {editImages.map((img, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <select
                  value={img.url}
                  onChange={(e) => updateImage(idx, e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                >
                  {sampleImages.map((simg, sidx) => (
                    <option key={sidx} value={simg}>
                      Image {sidx + 1}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => removeImage(idx)}
                  className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addImage}
            className="w-full px-3 py-2 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-lg text-gray-400 text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {language === 'ar' ? 'إضافة صورة' : 'Add Image'}
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-medium transition-colors"
            >
              {language === 'ar' ? 'حفظ' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 text-sm font-medium transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={onStartEdit}
          className="cursor-pointer hover:opacity-90 transition-opacity"
        >
          {block.layout === 'grid' ? (
            <div className="grid grid-cols-3 gap-2">
              {block.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={img.alt.en || img.alt.ar || ''}
                  className="w-full aspect-square object-cover rounded-lg"
                />
              ))}
            </div>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {block.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={img.alt.en || img.alt.ar || ''}
                  className="w-48 h-32 object-cover rounded-lg flex-shrink-0"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// =====================================================
// VIDEO BLOCK
// =====================================================

interface VideoBlockProps extends CommonBlockProps {
  block: VideoBlock;
  onUpdate: (url: string, caption: { en: string; ar: string }) => void;
}

const VideoBlockComponent: React.FC<VideoBlockProps> = ({
  block,
  onUpdate,
  isEditing,
  onStartEdit,
  onEndEdit,
  onMoveUp,
  onMoveDown,
  onCopy,
  onDelete,
  canMoveUp,
  canMoveDown,
}) => {
  const { language } = useLanguage();
  const [editUrl, setEditUrl] = useState(block.url);
  const [editCaption, setEditCaption] = useState(block.caption);

  const handleSave = () => {
    onUpdate(editUrl, editCaption);
    onEndEdit();
  };

  const handleCancel = () => {
    setEditUrl(block.url);
    setEditCaption(block.caption);
    onEndEdit();
  };

  const isYouTube = block.url.includes('youtube.com') || block.url.includes('youtu.be');

  return (
    <div className="relative group py-2">
      <BlockActionBar
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onCopy={onCopy}
        onDelete={onDelete}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
      />

      {isEditing ? (
        <div className="space-y-3 bg-[#0a0a0a] border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-400">
              {language === 'ar' ? 'فيديو' : 'Video'}
            </span>
          </div>
          <input
            type="url"
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
            placeholder="YouTube URL or direct video URL"
          />
          <div>
            <label className="text-xs text-gray-500 mb-1 block">🇺🇸 Caption (English)</label>
            <input
              type="text"
              value={editCaption.en}
              onChange={(e) => setEditCaption(prev => ({ ...prev, en: e.target.value }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              placeholder="Caption..."
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">🇸🇦 تعليق (العربية)</label>
            <input
              type="text"
              value={editCaption.ar}
              onChange={(e) => setEditCaption(prev => ({ ...prev, ar: e.target.value }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              placeholder="التعليق..."
              dir="rtl"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-medium transition-colors"
            >
              {language === 'ar' ? 'حفظ' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 text-sm font-medium transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={onStartEdit}
          className="cursor-pointer hover:opacity-90 transition-opacity"
        >
          {block.url ? (
            <figure>
              {isYouTube ? (
                <div className="aspect-video rounded-lg overflow-hidden bg-black">
                  <iframe
                    src={block.url.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Video"
                  />
                </div>
              ) : (
                <video src={block.url} controls className="w-full rounded-lg" />
              )}
              {(block.caption.en || block.caption.ar) && (
                <figcaption className="mt-2 text-sm text-gray-500 text-center">
                  {block.caption.en || block.caption.ar}
                </figcaption>
              )}
            </figure>
          ) : (
            <div className="w-full h-48 bg-white/5 rounded-lg flex items-center justify-center">
              <Video className="w-12 h-12 text-gray-600" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// =====================================================
// DIVIDER BLOCK
// =====================================================

interface DividerBlockProps extends CommonBlockProps {
  block: DividerBlock;
  onUpdate: (style: 'line' | 'dots' | 'space') => void;
}

const DividerBlockComponent: React.FC<DividerBlockProps> = ({
  block,
  onUpdate,
  isEditing,
  onStartEdit,
  onEndEdit,
  onMoveUp,
  onMoveDown,
  onCopy,
  onDelete,
  canMoveUp,
  canMoveDown,
}) => {
  const { language } = useLanguage();

  const handleStyleChange = (style: 'line' | 'dots' | 'space') => {
    onUpdate(style);
    onEndEdit();
  };

  return (
    <div className="relative group py-4">
      <BlockActionBar
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onCopy={onCopy}
        onDelete={onDelete}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
      />

      {isEditing ? (
        <div className="bg-[#0a0a0a] border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Minus className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-400">
              {language === 'ar' ? 'فاصل' : 'Divider'}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleStyleChange('line')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                block.style === 'line'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {language === 'ar' ? 'خط' : 'Line'}
            </button>
            <button
              onClick={() => handleStyleChange('dots')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                block.style === 'dots'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {language === 'ar' ? 'نقاط' : 'Dots'}
            </button>
            <button
              onClick={() => handleStyleChange('space')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                block.style === 'space'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {language === 'ar' ? 'مسافة' : 'Space'}
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={onStartEdit}
          className="cursor-pointer hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors"
        >
          {block.style === 'line' && <hr className="border-white/10" />}
          {block.style === 'dots' && (
            <div className="flex items-center justify-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
            </div>
          )}
          {block.style === 'space' && <div className="h-8" />}
        </div>
      )}
    </div>
  );
};

// =====================================================
// QUOTE BLOCK
// =====================================================

interface QuoteBlockProps extends CommonBlockProps {
  block: QuoteBlock;
  onUpdate: (content: MultilingualContent, author: MultilingualContent) => void;
}

const QuoteBlockComponent: React.FC<QuoteBlockProps> = ({
  block,
  onUpdate,
  isEditing,
  onStartEdit,
  onEndEdit,
  onMoveUp,
  onMoveDown,
  onCopy,
  onDelete,
  canMoveUp,
  canMoveDown,
  activeLanguage,
}) => {
  const { language } = useLanguage();
  const [editContent, setEditContent] = useState<MultilingualContent>(block.content);
  const [editAuthor, setEditAuthor] = useState<MultilingualContent>(block.author);

  const handleSave = () => {
    onUpdate(editContent, editAuthor);
    onEndEdit();
  };

  const handleCancel = () => {
    setEditContent(block.content);
    setEditAuthor(block.author);
    onEndEdit();
  };

  return (
    <div className="relative group py-2">
      <BlockActionBar
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onCopy={onCopy}
        onDelete={onDelete}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
      />

      {isEditing ? (
        <div className="space-y-3 bg-[#0a0a0a] border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <Quote className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-400">
              {language === 'ar' ? 'اقتباس' : 'Quote'}
            </span>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">🇺🇸 Quote (English)</label>
            <textarea
              value={editContent.en}
              onChange={(e) => setEditContent(prev => ({ ...prev, en: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 resize-none"
              placeholder="Enter quote text..."
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">🇸🇦 الاقتباس (العربية)</label>
            <textarea
              value={editContent.ar}
              onChange={(e) => setEditContent(prev => ({ ...prev, ar: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 resize-none"
              placeholder="أدخل نص الاقتباس..."
              dir="rtl"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">🇺🇸 Author (English)</label>
            <input
              type="text"
              value={editAuthor.en}
              onChange={(e) => setEditAuthor(prev => ({ ...prev, en: e.target.value }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              placeholder="Author name..."
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">🇸🇦 المؤلف (العربية)</label>
            <input
              type="text"
              value={editAuthor.ar}
              onChange={(e) => setEditAuthor(prev => ({ ...prev, ar: e.target.value }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              placeholder="اسم المؤلف..."
              dir="rtl"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-medium transition-colors"
            >
              {language === 'ar' ? 'حفظ' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 text-sm font-medium transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={onStartEdit}
          className="cursor-pointer hover:bg-white/5 rounded-lg p-4 -m-2 transition-colors border-r-4 border-blue-500"
          dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
        >
          <blockquote className="text-lg text-gray-300 italic mb-2">
            "{block.content[activeLanguage] || block.content.en}"
          </blockquote>
          {(block.author[activeLanguage] || block.author.en) && (
            <cite className="text-sm text-gray-500 not-italic">
              — {block.author[activeLanguage] || block.author.en}
            </cite>
          )}
        </div>
      )}
    </div>
  );
};

// =====================================================
// STATS BLOCK
// =====================================================

interface StatsBlockProps extends CommonBlockProps {
  block: StatsBlock;
  onUpdate: (updates: Partial<StatsBlock>) => void;
}

const StatsBlockComponent: React.FC<StatsBlockProps> = ({
  block,
  onUpdate,
  isEditing,
  onStartEdit,
  onEndEdit,
  onMoveUp,
  onMoveDown,
  onCopy,
  onDelete,
  canMoveUp,
  canMoveDown,
  activeLanguage,
}) => {
  const { language } = useLanguage();
  const [editTitle, setEditTitle] = useState<MultilingualContent>(block.title);
  const [editStats, setEditStats] = useState<StatItem[]>(block.stats);
  const [editLayout, setEditLayout] = useState(block.layout);

  const addStat = () => {
    setEditStats([...editStats, { value: '0', label: { en: '', ar: '' } }]);
  };

  const removeStat = (index: number) => {
    setEditStats(editStats.filter((_, i) => i !== index));
  };

  const updateStat = (index: number, field: 'value' | 'label', lang: ContentLanguage, value: string) => {
    const newStats = [...editStats];
    if (field === 'value') {
      newStats[index] = { ...newStats[index], value };
    } else {
      newStats[index] = { ...newStats[index], label: { ...newStats[index].label, [lang]: value } };
    }
    setEditStats(newStats);
  };

  const handleSave = () => {
    onUpdate({ title: editTitle, stats: editStats, layout: editLayout });
    onEndEdit();
  };

  const handleCancel = () => {
    setEditTitle(block.title);
    setEditStats(block.stats);
    setEditLayout(block.layout);
    onEndEdit();
  };

  return (
    <div className="relative group py-2">
      <BlockActionBar
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onCopy={onCopy}
        onDelete={onDelete}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
      />

      {isEditing ? (
        <div className="space-y-3 bg-[#0a0a0a] border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-400">
              {language === 'ar' ? 'إحصائيات' : 'Statistics'}
            </span>
          </div>

          <div className="flex gap-2 mb-3">
            {(['grid', 'row', 'cards'] as const).map((layout) => (
              <button
                key={layout}
                onClick={() => setEditLayout(layout)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  editLayout === layout
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {layout.charAt(0).toUpperCase() + layout.slice(1)}
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">🇺🇸 Title (English)</label>
            <input
              type="text"
              value={editTitle.en}
              onChange={(e) => setEditTitle(prev => ({ ...prev, en: e.target.value }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              placeholder="Statistics title..."
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">🇸🇦 العنوان (العربية)</label>
            <input
              type="text"
              value={editTitle.ar}
              onChange={(e) => setEditTitle(prev => ({ ...prev, ar: e.target.value }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              placeholder="عنوان الإحصائيات..."
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            {editStats.map((stat, idx) => (
              <div key={idx} className="flex gap-2 items-start p-2 bg-white/5 rounded-lg">
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => updateStat(idx, 'value', 'en', e.target.value)}
                  className="w-20 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                  placeholder="Value"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={stat.label.en}
                    onChange={(e) => updateStat(idx, 'label', 'en', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50 mb-1"
                    placeholder="Label (EN)"
                  />
                  <input
                    type="text"
                    value={stat.label.ar}
                    onChange={(e) => updateStat(idx, 'label', 'ar', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                    placeholder="التسمية (AR)"
                    dir="rtl"
                  />
                </div>
                <button
                  onClick={() => removeStat(idx)}
                  className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addStat}
            className="w-full px-3 py-2 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-lg text-gray-400 text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {language === 'ar' ? 'إضافة إحصائية' : 'Add Statistic'}
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-medium transition-colors"
            >
              {language === 'ar' ? 'حفظ' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 text-sm font-medium transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={onStartEdit}
          className="cursor-pointer hover:bg-white/5 rounded-lg p-4 -m-2 transition-colors"
        >
          <h3 className="text-xl font-bold text-white mb-4" dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}>
            {block.title[activeLanguage] || block.title.en}
          </h3>
          <div className={`grid gap-4 ${
            block.layout === 'row' ? 'grid-cols-4' :
            block.layout === 'cards' ? 'grid-cols-2' :
            'grid-cols-4'
          }`}>
            {block.stats.map((stat, idx) => (
              <div key={idx} className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-3xl font-bold text-blue-400 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400" dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}>
                  {stat.label[activeLanguage] || stat.label.en}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================
// TIMELINE BLOCK
// =====================================================

interface TimelineBlockProps extends CommonBlockProps {
  block: TimelineBlock;
  onUpdate: (updates: Partial<TimelineBlock>) => void;
}

const TimelineBlockComponent: React.FC<TimelineBlockProps> = ({
  block,
  onUpdate,
  isEditing,
  onStartEdit,
  onEndEdit,
  onMoveUp,
  onMoveDown,
  onCopy,
  onDelete,
  canMoveUp,
  canMoveDown,
  activeLanguage,
}) => {
  const { language } = useLanguage();
  const [editTitle, setEditTitle] = useState<MultilingualContent>(block.title);
  const [editItems, setEditItems] = useState<TimelineItem[]>(block.items);
  const [editLayout, setEditLayout] = useState(block.layout);

  const addItem = () => {
    setEditItems([...editItems, {
      id: `item-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: { en: '', ar: '' },
      description: { en: '', ar: '' },
    }]);
  };

  const removeItem = (index: number) => {
    setEditItems(editItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof TimelineItem, lang: ContentLanguage | null, value: string) => {
    const newItems = [...editItems];
    if (field === 'date') {
      newItems[index] = { ...newItems[index], date: value };
    } else if (lang) {
      const contentField = field as 'title' | 'description';
      newItems[index] = {
        ...newItems[index],
        [contentField]: {
          ...newItems[index][contentField],
          [lang]: value
        }
      };
    }
    setEditItems(newItems);
  };

  const handleSave = () => {
    onUpdate({ title: editTitle, items: editItems, layout: editLayout });
    onEndEdit();
  };

  const handleCancel = () => {
    setEditTitle(block.title);
    setEditItems(block.items);
    setEditLayout(block.layout);
    onEndEdit();
  };

  return (
    <div className="relative group py-2">
      <BlockActionBar
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onCopy={onCopy}
        onDelete={onDelete}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
      />

      {isEditing ? (
        <div className="space-y-3 bg-[#0a0a0a] border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-400">
              {language === 'ar' ? 'الجدول الزمني' : 'Timeline'}
            </span>
          </div>

          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setEditLayout('vertical')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                editLayout === 'vertical'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {language === 'ar' ? 'عمودي' : 'Vertical'}
            </button>
            <button
              onClick={() => setEditLayout('horizontal')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                editLayout === 'horizontal'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {language === 'ar' ? 'أفقي' : 'Horizontal'}
            </button>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">🇺🇸 Title (English)</label>
            <input
              type="text"
              value={editTitle.en}
              onChange={(e) => setEditTitle(prev => ({ ...prev, en: e.target.value }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              placeholder="Timeline title..."
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">🇸🇦 العنوان (العربية)</label>
            <input
              type="text"
              value={editTitle.ar}
              onChange={(e) => setEditTitle(prev => ({ ...prev, ar: e.target.value }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              placeholder="عنوان الجدول الزمني..."
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            {editItems.map((item, idx) => (
              <div key={item.id} className="p-3 bg-white/5 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={item.date}
                    onChange={(e) => updateItem(idx, 'date', null, e.target.value)}
                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                  />
                  <button
                    onClick={() => removeItem(idx)}
                    className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-red-400" />
                  </button>
                </div>
                <input
                  type="text"
                  value={item.title.en}
                  onChange={(e) => updateItem(idx, 'title', 'en', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                  placeholder="Title (EN)"
                />
                <input
                  type="text"
                  value={item.title.ar}
                  onChange={(e) => updateItem(idx, 'title', 'ar', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50"
                  placeholder="العنوان (AR)"
                  dir="rtl"
                />
                <textarea
                  value={item.description.en}
                  onChange={(e) => updateItem(idx, 'description', 'en', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50 resize-none"
                  placeholder="Description (EN)"
                />
                <textarea
                  value={item.description.ar}
                  onChange={(e) => updateItem(idx, 'description', 'ar', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50 resize-none"
                  placeholder="الوصف (AR)"
                  dir="rtl"
                />
              </div>
            ))}
          </div>

          <button
            onClick={addItem}
            className="w-full px-3 py-2 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-lg text-gray-400 text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {language === 'ar' ? 'إضافة عنصر' : 'Add Item'}
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-medium transition-colors"
            >
              {language === 'ar' ? 'حفظ' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 text-sm font-medium transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={onStartEdit}
          className="cursor-pointer hover:bg-white/5 rounded-lg p-4 -m-2 transition-colors"
        >
          <h3 className="text-xl font-bold text-white mb-4" dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}>
            {block.title[activeLanguage] || block.title.en}
          </h3>
          <div className="space-y-4">
            {block.items.map((item, idx) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-20 text-center">
                  <div className="text-sm font-medium text-blue-400">{item.date}</div>
                </div>
                <div className="flex-1 border-r-2 border-white/10 pr-4">
                  <h4 className="font-semibold text-white mb-1" dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    {item.title[activeLanguage] || item.title.en}
                  </h4>
                  <p className="text-sm text-gray-400" dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    {item.description[activeLanguage] || item.description.en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================
// CTA BLOCK
// =====================================================

interface CTABlockProps extends CommonBlockProps {
  block: CTABlock;
  onUpdate: (updates: Partial<CTABlock>) => void;
}

const CTABlockComponent: React.FC<CTABlockProps> = ({
  block,
  onUpdate,
  isEditing,
  onStartEdit,
  onEndEdit,
  onMoveUp,
  onMoveDown,
  onCopy,
  onDelete,
  canMoveUp,
  canMoveDown,
  activeLanguage,
}) => {
  const { language } = useLanguage();
  const [editTitle, setEditTitle] = useState<MultilingualContent>(block.title);
  const [editDescription, setEditDescription] = useState<MultilingualContent>(block.description);
  const [editButtonText, setEditButtonText] = useState<MultilingualContent>(block.buttonText);
  const [editButtonUrl, setEditButtonUrl] = useState(block.buttonUrl);
  const [editAlignment, setEditAlignment] = useState(block.alignment);
  const [editBackgroundColor, setEditBackgroundColor] = useState(block.backgroundColor);

  const handleSave = () => {
    onUpdate({
      title: editTitle,
      description: editDescription,
      buttonText: editButtonText,
      buttonUrl: editButtonUrl,
      alignment: editAlignment,
      backgroundColor: editBackgroundColor,
    });
    onEndEdit();
  };

  const handleCancel = () => {
    setEditTitle(block.title);
    setEditDescription(block.description);
    setEditButtonText(block.buttonText);
    setEditButtonUrl(block.buttonUrl);
    setEditAlignment(block.alignment);
    setEditBackgroundColor(block.backgroundColor);
    onEndEdit();
  };

  const bgColors: Record<string, string> = {
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    green: 'bg-green-600',
    orange: 'bg-orange-600',
    red: 'bg-red-600',
  };

  return (
    <div className="relative group py-2">
      <BlockActionBar
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onCopy={onCopy}
        onDelete={onDelete}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
      />

      {isEditing ? (
        <div className="space-y-3 bg-[#0a0a0a] border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <MousePointer className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-400">
              {language === 'ar' ? 'دعوة للإجراء' : 'Call to Action'}
            </span>
          </div>

          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setEditAlignment('left')}
              className={`p-2 rounded-lg transition-colors ${editAlignment === 'left' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400'}`}
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setEditAlignment('center')}
              className={`p-2 rounded-lg transition-colors ${editAlignment === 'center' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400'}`}
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => setEditAlignment('right')}
              className={`p-2 rounded-lg transition-colors ${editAlignment === 'right' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400'}`}
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2 mb-3">
            {['blue', 'purple', 'green', 'orange', 'red'].map((color) => (
              <button
                key={color}
                onClick={() => setEditBackgroundColor(color)}
                className={`w-8 h-8 rounded-lg ${bgColors[color]} ${
                  editBackgroundColor === color ? 'ring-2 ring-white' : ''
                }`}
              />
            ))}
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">🇺🇸 Title (English)</label>
            <input
              type="text"
              value={editTitle.en}
              onChange={(e) => setEditTitle(prev => ({ ...prev, en: e.target.value }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              placeholder="CTA title..."
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">🇸🇦 العنوان (العربية)</label>
            <input
              type="text"
              value={editTitle.ar}
              onChange={(e) => setEditTitle(prev => ({ ...prev, ar: e.target.value }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              placeholder="عنوان الدعوة..."
              dir="rtl"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">🇺🇸 Description (English)</label>
            <textarea
              value={editDescription.en}
              onChange={(e) => setEditDescription(prev => ({ ...prev, en: e.target.value }))}
              rows={2}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 resize-none"
              placeholder="Description..."
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">🇸🇦 الوصف (العربية)</label>
            <textarea
              value={editDescription.ar}
              onChange={(e) => setEditDescription(prev => ({ ...prev, ar: e.target.value }))}
              rows={2}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 resize-none"
              placeholder="الوصف..."
              dir="rtl"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">🇺🇸 Button Text (English)</label>
            <input
              type="text"
              value={editButtonText.en}
              onChange={(e) => setEditButtonText(prev => ({ ...prev, en: e.target.value }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              placeholder="Button text..."
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">🇸🇦 نص الزر (العربية)</label>
            <input
              type="text"
              value={editButtonText.ar}
              onChange={(e) => setEditButtonText(prev => ({ ...prev, ar: e.target.value }))}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              placeholder="نص الزر..."
              dir="rtl"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Button URL</label>
            <input
              type="url"
              value={editButtonUrl}
              onChange={(e) => setEditButtonUrl(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              placeholder="https://..."
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-medium transition-colors"
            >
              {language === 'ar' ? 'حفظ' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 text-sm font-medium transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={onStartEdit}
          className={`cursor-pointer rounded-xl p-6 ${
            bgColors[block.backgroundColor] || bgColors.blue
          } ${block.alignment === 'right' ? 'text-right' : block.alignment === 'center' ? 'text-center' : 'text-left'}`}
          dir={activeLanguage === 'ar' ? 'rtl' : 'ltr'}
        >
          <h3 className="text-2xl font-bold text-white mb-2">
            {block.title[activeLanguage] || block.title.en}
          </h3>
          <p className="text-white/80 mb-4">
            {block.description[activeLanguage] || block.description.en}
          </p>
          <a
            href={block.buttonUrl}
            className="inline-block px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-white/90 transition-colors"
          >
            {block.buttonText[activeLanguage] || block.buttonText.en}
          </a>
        </div>
      )}
    </div>
  );
};

// =====================================================
// EXPORTS
// =====================================================

export {
  TitleBlockComponent,
  RichTextBlockComponent,
  ImageBlockComponent,
  GalleryBlockComponent,
  VideoBlockComponent,
  DividerBlockComponent,
  QuoteBlockComponent,
  StatsBlockComponent,
  TimelineBlockComponent,
  CTABlockComponent,
  TeamBlockComponent,
  BlockActionBar,
};
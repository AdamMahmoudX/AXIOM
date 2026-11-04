// =====================================================
// RICH TEXT EDITOR WITH LINKS - AXIOMX ADMIN SYSTEM
// Phase 4C: Internal Linking System
// =====================================================

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { LinkPicker, LinkPickerValue } from './LinkPicker';
import {
  Link2,
  Unlink,
  Edit2,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  Save,
  X,
  ChevronDown,
  Link,
} from 'lucide-react';

// =====================================================
// TYPES
// =====================================================

export interface TextLink {
  id: string;
  start: number;
  end: number;
  linkId: string;
  linkType: 'project' | 'article' | 'service';
  linkTitle: string;
  linkTitleAr: string;
  linkUrl: string;
}

export interface RichTextContent {
  text: string;
  links: TextLink[];
}

export interface RichTextEditorProps {
  content: RichTextContent;
  onChange: (content: RichTextContent) => void;
  placeholder?: string;
  minHeight?: string;
  readOnly?: boolean;
}

// =====================================================
// RICH TEXT EDITOR COMPONENT
// =====================================================

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder,
  minHeight = '200px',
  readOnly = false,
}) => {
  const { language } = useLanguage();
  const editorRef = useRef<HTMLDivElement>(null);
  const [showLinkPicker, setShowLinkPicker] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState<Range | null>(null);
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Handle text selection
  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const range = selection.getRangeAt(0);
      if (editorRef.current?.contains(range.commonAncestorContainer)) {
        setSelectedText(selection.toString());
        setSelectionRange(range.cloneRange());
      }
    } else {
      setSelectedText('');
      setSelectionRange(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleSelectionChange);
    return () => document.removeEventListener('mouseup', handleSelectionChange);
  }, [handleSelectionChange]);

  // Insert link at selection
  const handleInsertLink = (link: LinkPickerValue) => {
    if (selectionRange && selectedText) {
      const newLink: TextLink = {
        id: `link-${Date.now()}`,
        start: content.text.indexOf(selectedText),
        end: content.text.indexOf(selectedText) + selectedText.length,
        linkId: link.id,
        linkType: link.type,
        linkTitle: link.title,
        linkTitleAr: link.titleAr,
        linkUrl: link.url,
      };

      onChange({
        text: content.text,
        links: [...content.links, newLink],
      });

      setSelectedText('');
      setSelectionRange(null);
    }
    setShowLinkPicker(false);
  };

  // Remove link
  const handleRemoveLink = (linkId: string) => {
    onChange({
      text: content.text,
      links: content.links.filter((l) => l.id !== linkId),
    });
    setEditingLinkIndex(null);
  };

  // Edit link
  const handleEditLink = (link: TextLink) => {
    setEditingLinkIndex(content.links.findIndex((l) => l.id === link.id));
    setShowLinkPicker(true);
  };

  // Render content with links
  const renderContent = () => {
    if (!content.text) {
      return (
        <span className="text-gray-500">
          {placeholder || (language === 'ar' ? 'اكتب النص هنا...' : 'Type here...')}
        </span>
      );
    }

    // Sort links by start position
    const sortedLinks = [...content.links].sort((a, b) => a.start - b.start);

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    sortedLinks.forEach((link, index) => {
      // Add text before link
      if (link.start > lastIndex) {
        parts.push(
          <span key={`text-${index}`}>{content.text.slice(lastIndex, link.start)}</span>
        );
      }

      // Add linked text
      const linkText = content.text.slice(link.start, link.end);
      parts.push(
        <span
          key={`link-${link.id}`}
          className="internal-link"
          data-link-id={link.id}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleEditLink(link);
          }}
          title={language === 'ar' ? link.linkTitleAr : link.linkTitle}
        >
          {linkText}
        </span>
      );

      lastIndex = link.end;
    });

    // Add remaining text
    if (lastIndex < content.text.length) {
      parts.push(<span key="text-end">{content.text.slice(lastIndex)}</span>);
    }

    return parts;
  };

  // Handle input changes
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newText = e.currentTarget.textContent || '';
    onChange({
      text: newText,
      links: content.links,
    });
  };

  // Format shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Ctrl/Cmd + K to open link picker
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (selectedText) {
        setShowLinkPicker(true);
      }
    }
  };

  return (
    <div className="relative">
      {/* Toolbar */}
      {!readOnly && (
        <div className="mb-2">
          <div className="flex items-center gap-1 flex-wrap">
            {/* Link Button */}
            <button
              onClick={() => {
                if (selectedText) {
                  setShowLinkPicker(true);
                }
              }}
              disabled={!selectedText}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                selectedText
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'bg-white/5 text-gray-400 cursor-not-allowed'
              }`}
              title={language === 'ar' ? 'إضافة رابط (Ctrl+K)' : 'Add Link (Ctrl+K)'}
            >
              <Link2 className="w-4 h-4" />
              {language === 'ar' ? 'رابط' : 'Link'}
            </button>

            {/* Format buttons */}
            <button
              onClick={() => {
                document.execCommand('bold');
              }}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                document.execCommand('italic');
              }}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                document.execCommand('underline');
              }}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-white/10 mx-1" />

            {/* Heading buttons */}
            <button
              onClick={() => {
                document.execCommand('formatBlock', false, 'h1');
              }}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                document.execCommand('formatBlock', false, 'h2');
              }}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                document.execCommand('formatBlock', false, 'h3');
              }}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-white/10 mx-1" />

            {/* List buttons */}
            <button
              onClick={() => {
                document.execCommand('insertUnorderedList');
              }}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                document.execCommand('insertOrderedList');
              }}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                document.execCommand('formatBlock', false, 'blockquote');
              }}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </button>
          </div>

          {/* Link info banner */}
          {selectedText && (
            <div className="mt-2 px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-between">
              <span className="text-sm text-blue-400">
                {language === 'ar' ? 'النص المحدد:' : 'Selected:'} "{selectedText.slice(0, 30)}
                {selectedText.length > 30 ? '...' : ''}"
              </span>
              <button
                onClick={() => setShowLinkPicker(true)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-medium transition-colors"
              >
                {language === 'ar' ? 'إضافة رابط' : 'Add Link'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!readOnly}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full min-h-[${minHeight}] p-4 bg-[#0a0a0a] border rounded-xl text-gray-300 placeholder-gray-500 focus:outline-none transition-colors ${
          isFocused
            ? 'border-blue-500/50 ring-2 ring-blue-500/20'
            : 'border-white/10'
        } ${readOnly ? 'cursor-default' : 'cursor-text'}`}
        style={{ minHeight }}
        suppressContentEditableWarning
      >
        {renderContent()}
      </div>

      {/* Link Picker Modal */}
      <LinkPicker
        isOpen={showLinkPicker}
        onClose={() => {
          setShowLinkPicker(false);
          setEditingLinkIndex(null);
        }}
        onSelect={handleInsertLink}
        onRemove={
          editingLinkIndex !== null
            ? () => {
                if (content.links[editingLinkIndex]) {
                  handleRemoveLink(content.links[editingLinkIndex].id);
                }
              }
            : undefined
        }
        selectedLink={
          editingLinkIndex !== null && content.links[editingLinkIndex]
            ? {
                id: content.links[editingLinkIndex].linkId,
                type: content.links[editingLinkIndex].linkType,
                title: content.links[editingLinkIndex].linkTitle,
                titleAr: content.links[editingLinkIndex].linkTitleAr,
                url: content.links[editingLinkIndex].linkUrl,
              }
            : null
        }
        mode={editingLinkIndex !== null ? 'edit' : 'insert'}
      />
    </div>
  );
};

// =====================================================
// LINK MANAGEMENT COMPONENT
// =====================================================

export interface LinkManagerProps {
  links: TextLink[];
  onRemoveLink: (linkId: string) => void;
  onEditLink: (link: TextLink) => void;
}

export const LinkManager: React.FC<LinkManagerProps> = ({
  links,
  onRemoveLink,
  onEditLink,
}) => {
  const { language } = useLanguage();

  if (links.length === 0) {
    return null;
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project':
        return 'text-blue-400 bg-blue-500/20';
      case 'article':
        return 'text-green-400 bg-green-500/20';
      case 'service':
        return 'text-purple-400 bg-purple-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-xl">
      <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
        <Link2 className="w-4 h-4" />
        {language === 'ar' ? 'الروابط ({count})' : 'Links ({count})'}
      </h4>
      <div className="space-y-2">
        {links.map((link) => (
          <div
            key={link.id}
            className="flex items-center gap-3 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <div className={`px-2 py-1 rounded text-xs ${getTypeColor(link.linkType)}`}>
              {link.linkType}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">
                {language === 'ar' ? link.linkTitleAr : link.linkTitle}
              </p>
              <p className="text-xs text-gray-500 truncate">{link.linkUrl}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEditLink(link)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                title={language === 'ar' ? 'تعديل' : 'Edit'}
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onRemoveLink(link.id)}
                className="w-7 h-7 rounded-lg bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-400 hover:text-white transition-colors"
                title={language === 'ar' ? 'حذف' : 'Delete'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RichTextEditor;
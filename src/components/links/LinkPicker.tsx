// =====================================================
// INTERNAL LINK PICKER - AXIOMX ADMIN SYSTEM
// Phase 4C: Internal Linking System
// =====================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Search,
  X,
  Folder,
  FileText,
  Briefcase,
  ChevronRight,
  ExternalLink,
  AlertTriangle,
  Check,
  Link2,
  Unlink,
} from 'lucide-react';
import {
  PROJECT_LINKS,
  ARTICLE_LINKS,
  SERVICE_LINKS,
  ALL_LINKS,
  searchLinks,
  InternalLink,
  LinkType,
  LINK_TYPE_LABELS,
} from '../../data/internalLinks';

// =====================================================
// LINK PICKER TYPES
// =====================================================

export interface LinkPickerValue {
  id: string;
  type: LinkType;
  title: string;
  titleAr: string;
  url: string;
}

export interface LinkPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (link: LinkPickerValue) => void;
  onRemove?: () => void;
  selectedLink?: LinkPickerValue | null;
  mode?: 'insert' | 'edit';
}

// =====================================================
// LINK PICKER COMPONENT
// =====================================================

export const LinkPicker: React.FC<LinkPickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  onRemove,
  selectedLink,
  mode = 'insert',
}) => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | LinkType>('all');
  const [filteredLinks, setFilteredLinks] = useState<InternalLink[]>(ALL_LINKS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Filter links based on search and category
  useEffect(() => {
    let links = ALL_LINKS;

    // Filter by category
    if (activeCategory !== 'all') {
      links = links.filter((link) => link.type === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      links = links.filter(
        (link) =>
          link.title.toLowerCase().includes(query) ||
          link.titleAr.includes(searchQuery)
      );
    }

    setFilteredLinks(links);
    setSelectedIndex(0);
  }, [searchQuery, activeCategory]);

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
    // Reset state when opening
    if (isOpen) {
      setSearchQuery('');
      setActiveCategory('all');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredLinks.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredLinks[selectedIndex]) {
          handleSelectLink(filteredLinks[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    },
    [filteredLinks, selectedIndex, onClose]
  );

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  const handleSelectLink = (link: InternalLink) => {
    onSelect({
      id: link.id,
      type: link.type,
      title: link.title,
      titleAr: link.titleAr,
      url: link.url,
    });
    onClose();
  };

  const handleRemoveLink = () => {
    if (onRemove) {
      onRemove();
    }
    onClose();
  };

  // Get category icon
  const getCategoryIcon = (type: LinkType) => {
    switch (type) {
      case 'project':
        return <Folder className="w-4 h-4" />;
      case 'article':
        return <FileText className="w-4 h-4" />;
      case 'service':
        return <Briefcase className="w-4 h-4" />;
    }
  };

  // Get category color
  const getCategoryColor = (type: LinkType) => {
    switch (type) {
      case 'project':
        return 'text-blue-400 bg-blue-500/20';
      case 'article':
        return 'text-green-400 bg-green-500/20';
      case 'service':
        return 'text-purple-400 bg-purple-500/20';
    }
  };

  const categories = [
    { id: 'all', label: language === 'ar' ? 'الكل' : 'All', count: ALL_LINKS.length },
    { id: 'project', label: LINK_TYPE_LABELS.project[language === 'ar' ? 'ar' : 'en'], count: PROJECT_LINKS.length },
    { id: 'article', label: LINK_TYPE_LABELS.article[language === 'ar' ? 'ar' : 'en'], count: ARTICLE_LINKS.length },
    { id: 'service', label: LINK_TYPE_LABELS.service[language === 'ar' ? 'ar' : 'en'], count: SERVICE_LINKS.length },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    {mode === 'edit'
                      ? language === 'ar'
                        ? 'تعديل الرابط'
                        : 'Edit Link'
                      : language === 'ar'
                      ? 'اختيار رابط داخلي'
                      : 'Select Internal Link'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {language === 'ar'
                      ? 'ابحث واختر من المشاريع والمقالات والخدمات'
                      : 'Search and choose from projects, articles, and services'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={language === 'ar' ? 'ابحث...' : 'Search...'}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="px-4 py-3 border-b border-white/10 flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as 'all' | LinkType)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>

          {/* Results */}
          <div ref={resultsRef} className="flex-1 overflow-y-auto p-2">
            {filteredLinks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertTriangle className="w-12 h-12 text-gray-600 mb-3" />
                <p className="text-gray-400">
                  {language === 'ar'
                    ? 'لم يتم العثور على نتائج'
                    : 'No results found'}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {language === 'ar'
                    ? 'جرب البحث بكلمات مختلفة'
                    : 'Try different search terms'}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredLinks.map((link, index) => (
                  <button
                    key={link.id}
                    onClick={() => handleSelectLink(link)}
                    className={`w-full p-3 rounded-xl text-left transition-all ${
                      selectedIndex === index
                        ? 'bg-blue-500/20 border border-blue-500/50'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getCategoryColor(
                          link.type
                        )}`}
                      >
                        {getCategoryIcon(link.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium truncate">
                            {language === 'ar' ? link.titleAr : link.title}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${getCategoryColor(
                              link.type
                            )}`}
                          >
                            {LINK_TYPE_LABELS[link.type][
                              language === 'ar' ? 'ar' : 'en'
                            ]}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {link.url}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {selectedLink && mode === 'edit' && (
            <div className="p-4 border-t border-white/10 bg-white/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">
                    {language === 'ar' ? selectedLink.titleAr : selectedLink.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {selectedLink.url}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleRemoveLink}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Unlink className="w-4 h-4" />
                  {language === 'ar' ? 'إزالة الرابط' : 'Remove Link'}
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-sm font-medium transition-colors"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </div>
          )}

          {/* Keyboard hints */}
          <div className="px-4 py-2 border-t border-white/5 bg-black/20">
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10">↑↓</kbd>
                {language === 'ar' ? 'للتنقل' : 'Navigate'}
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10">Enter</kbd>
                {language === 'ar' ? 'للاختيار' : 'Select'}
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10">Esc</kbd>
                {language === 'ar' ? 'للإغلاق' : 'Close'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LinkPicker;
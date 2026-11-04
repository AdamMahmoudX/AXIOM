// =====================================================
// ARTICLES PAGE - AXIOMX ADMIN SYSTEM
// Phase 4E: Multilingual Content System
// =====================================================

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArticles } from '../../../context/ArticleContext';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { Article, ArticleStatus, ARTICLE_STATUS_LABELS, ARTICLE_STATUS_COLORS } from '../../../types/project';
import { LanguageBadge, TranslationStatusDisplay } from '../../../components/LanguageTabs';
import {
  Search,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  FileText,
  FolderOpen,
  X,
} from 'lucide-react';
import Portal from '../../../components/Portal';

// Status Badge Component
const StatusBadge: React.FC<{ status: ArticleStatus }> = ({ status }) => {
  const { language } = useLanguage();
  const config = ARTICLE_STATUS_COLORS[status];
  const labels = ARTICLE_STATUS_LABELS[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {labels[language === 'ar' ? 'ar' : 'en']}
    </span>
  );
};

// Stats Cards
const StatsCards: React.FC<{ articles: Article[] }> = ({ articles }) => {
  const { language } = useLanguage();
  const stats = useMemo(() => ({
    total: articles.length,
    published: articles.filter(a => a.status === 'published').length,
    draft: articles.filter(a => a.status === 'draft').length,
    archived: articles.filter(a => a.status === 'archived').length,
  }), [articles]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-gray-400">{language === 'ar' ? 'إجمالي المقالات' : 'Total Articles'}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.published}</p>
            <p className="text-xs text-gray-400">{language === 'ar' ? 'منشور' : 'Published'}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.draft}</p>
            <p className="text-xs text-gray-400">{language === 'ar' ? 'مسودة' : 'Draft'}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-500/10 to-gray-600/5 border border-gray-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-500/20 flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.archived}</p>
            <p className="text-xs text-gray-400">{language === 'ar' ? 'مؤرشف' : 'Archived'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Action Menu Component with Portal
interface ActionMenuProps {
  article: Article;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ article, onView, onEdit, onDelete, buttonRef, onClose }) => {
  const { language } = useLanguage();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right + window.scrollX - 192,
      });
    }
  }, [buttonRef]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [buttonRef, onClose]);

  return (
    <Portal>
      <div
        ref={menuRef}
        className="fixed bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-[9999] py-1 min-w-[192px]"
        style={{ top: `${position.top}px`, left: `${position.left}px` }}
      >
        <button
          onClick={() => { onView(article.id); onClose(); }}
          className="w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 flex items-center gap-2 transition-colors"
        >
          <Eye className="w-4 h-4" />
          {language === 'ar' ? 'عرض المقال' : 'View Article'}
        </button>
        <button
          onClick={() => { onEdit(article.id); onClose(); }}
          className="w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 flex items-center gap-2 transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          {language === 'ar' ? 'تعديل' : 'Edit'}
        </button>
        <div className="border-t border-white/5 my-1" />
        <button
          onClick={() => { onDelete(article.id); onClose(); }}
          className="w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          {language === 'ar' ? 'حذف' : 'Delete'}
        </button>
      </div>
    </Portal>
  );
};

// Article Card Component
const ArticleCard: React.FC<{
  article: Article;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ article, onView, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const { language } = useLanguage();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Check language availability
  const hasEn = article.content?.en?.title?.trim() !== '';
  const hasAr = article.content?.ar?.title?.trim() !== '';

  // Get translation status
  const getTranslationStatus = (): { en: 'complete' | 'needs_review' | 'missing'; ar: 'complete' | 'needs_review' | 'missing' } => {
    if (article.translationStatus) {
      return article.translationStatus;
    }
    return {
      en: hasEn && hasAr ? 'complete' : hasEn ? 'needs_review' : 'missing',
      ar: hasAr && hasEn ? 'complete' : hasAr ? 'needs_review' : 'missing',
    };
  };

  const translationStatus = getTranslationStatus();

  return (
    <>
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all duration-200 group">
        {/* Article Image */}
        {article.image && (
          <div className="relative h-40 overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <StatusBadge status={article.status} />
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-white font-semibold line-clamp-1 flex-1">{article.title}</h3>
            <LanguageBadge hasEn={hasEn} hasAr={hasAr} />
          </div>

          {article.excerpt && (
            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{article.excerpt}</p>
          )}

          {/* Translation Status */}
          <div className="mb-3">
            <TranslationStatusDisplay
              enStatus={translationStatus.en}
              arStatus={translationStatus.ar}
            />
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(article.createdAt)}</span>
            </div>
            {article.author && (
              <div className="flex items-center gap-1">
                <span>{article.author}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onView(article.id)}
              className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {language === 'ar' ? 'عرض' : 'View'}
            </button>
            <button
              ref={buttonRef}
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {showMenu && (
        <ActionMenu
          article={article}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          buttonRef={buttonRef}
          onClose={() => setShowMenu(false)}
        />
      )}
    </>
  );
};

// Delete Confirmation Modal
const DeleteModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  articleTitle: string;
}> = ({ isOpen, onClose, onConfirm, articleTitle }) => {
  const { language } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <Trash2 className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            {language === 'ar' ? 'حذف المقال' : 'Delete Article'}
          </h3>
          <p className="text-gray-400 mb-6">
            {language === 'ar'
              ? `هل أنت متأكد من حذف "${articleTitle}"؟ لا يمكن التراجع عن هذا الإجراء.`
              : `Are you sure you want to delete "${articleTitle}"? This action cannot be undone.`
            }
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 font-medium transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 rounded-xl text-white font-medium transition-colors"
            >
              {language === 'ar' ? 'حذف' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Articles Page Component
const ArticlesPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const { articles, deleteArticle } = useArticles();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | 'all'>('all');
  const [languageFilter, setLanguageFilter] = useState<'all' | 'en' | 'ar' | 'both'>('all');
  const [deleteArticleId, setDeleteArticleId] = useState<string | null>(null);

  const canManageArticles = user?.role === 'owner' || user?.role === 'admin';

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = searchQuery === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (article.author && article.author.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || article.status === statusFilter;

      // Language filter
      const hasEn = article.content?.en?.title?.trim() !== '';
      const hasAr = article.content?.ar?.title?.trim() !== '';

      let matchesLanguage = true;
      if (languageFilter === 'en') matchesLanguage = hasEn && !hasAr;
      else if (languageFilter === 'ar') matchesLanguage = hasAr && !hasEn;
      else if (languageFilter === 'both') matchesLanguage = hasEn && hasAr;

      return matchesSearch && matchesStatus && matchesLanguage;
    });
  }, [articles, searchQuery, statusFilter, languageFilter]);

  const handleViewArticle = (id: string) => {
    navigate(`/articles/${id}`);
  };

  const handleEditArticle = (id: string) => {
    navigate(`/admin/articles/edit/${id}`);
  };

  const handleDeleteArticle = (id: string) => {
    setDeleteArticleId(id);
  };

  const confirmDelete = () => {
    if (deleteArticleId) {
      deleteArticle(deleteArticleId);
      setDeleteArticleId(null);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {language === 'ar' ? 'إدارة المقالات' : 'Article Management'}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {language === 'ar'
              ? `إجمالي ${filteredArticles.length} مقال`
              : `${filteredArticles.length} articles total`
            }
          </p>
        </div>

        {canManageArticles && (
          <button
            onClick={() => navigate('/admin/articles/create')}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {language === 'ar' ? 'إضافة مقال جديد' : 'Add New Article'}
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <StatsCards articles={articles} />

      {/* Search & Filters */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ar' ? 'البحث عن مقال...' : 'Search articles...'}
              className="w-full pr-10 pl-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ArticleStatus | 'all')}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-colors min-w-[160px]"
          >
            <option value="all">{language === 'ar' ? 'الكل' : 'All'}</option>
            <option value="published">{language === 'ar' ? 'منشور' : 'Published'}</option>
            <option value="draft">{language === 'ar' ? 'مسودة' : 'Draft'}</option>
            <option value="archived">{language === 'ar' ? 'مؤرشف' : 'Archived'}</option>
          </select>

          {/* Language Filter */}
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value as 'all' | 'en' | 'ar' | 'both')}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 transition-colors min-w-[160px]"
          >
            <option value="all">{language === 'ar' ? 'كل اللغات' : 'All Languages'}</option>
            <option value="en">{language === 'ar' ? 'إنجليزي فقط' : 'English Only'}</option>
            <option value="ar">{language === 'ar' ? 'عربي فقط' : 'Arabic Only'}</option>
            <option value="both">{language === 'ar' ? 'ثنائي اللغة' : 'Bilingual'}</option>
          </select>
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredArticles.map(article => (
            <ArticleCard
              key={article.id}
              article={article}
              onView={handleViewArticle}
              onEdit={handleEditArticle}
              onDelete={handleDeleteArticle}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-12 text-center">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">
            {language === 'ar' ? 'لا توجد مقالات' : 'No articles found'}
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deleteArticleId}
        onClose={() => setDeleteArticleId(null)}
        onConfirm={confirmDelete}
        articleTitle={articles.find(a => a.id === deleteArticleId)?.title || ''}
      />
    </div>
  );
};

export default ArticlesPage;
// =====================================================
// MANAGE LANGUAGES MODAL - AXIOMX ADMIN SYSTEM
// Phase 4E: Multilingual Content System
// =====================================================

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TranslationStatus, TRANSLATION_STATUS_COLORS, calculateTranslationStatus, LanguageContent } from '../types/project';
import { X, Check, AlertTriangle, XCircle, Languages, Copy, ArrowRight } from 'lucide-react';

interface ManageLanguagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    en: LanguageContent;
    ar: LanguageContent;
  };
  onDuplicate: (from: 'en' | 'ar', to: 'en' | 'ar') => void;
  title?: string;
}

export const ManageLanguagesModal: React.FC<ManageLanguagesModalProps> = ({
  isOpen,
  onClose,
  content,
  onDuplicate,
  title = 'Manage Languages'
}) => {
  const { language, t } = useLanguage();

  if (!isOpen) return null;

  // Calculate status for each language
  const enStatus = calculateTranslationStatus(content.en);
  const arStatus = calculateTranslationStatus(content.ar);

  // Count translated and missing fields
  const countTranslatedFields = (langContent: LanguageContent): number => {
    let count = 0;
    if (langContent.title) count++;
    if (langContent.slug) count++;
    if (langContent.excerpt) count++;
    if (langContent.description) count++;
    if (langContent.seo?.title) count++;
    if (langContent.seo?.description) count++;
    if (langContent.seo?.ogTitle) count++;
    if (langContent.seo?.ogDescription) count++;
    if (langContent.blocks && langContent.blocks.length > 0) count++;
    return count;
  };

  const totalFields = 9; // title, slug, excerpt, description, seo.title, seo.description, seo.ogTitle, seo.ogDescription, blocks

  const enTranslatedFields = countTranslatedFields(content.en);
  const arTranslatedFields = countTranslatedFields(content.ar);

  const getStatusIcon = (status: TranslationStatus) => {
    switch (status) {
      case 'complete':
        return <Check className="w-4 h-4 text-green-400" />;
      case 'needs_review':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'missing':
        return <XCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusLabel = (status: TranslationStatus) => {
    switch (status) {
      case 'complete':
        return language === 'ar' ? 'مكتمل' : 'Complete';
      case 'needs_review':
        return language === 'ar' ? 'يحتاج مراجعة' : 'Needs Review';
      case 'missing':
        return language === 'ar' ? 'مفقود' : 'Missing';
    }
  };

  const getStatusColor = (status: TranslationStatus) => {
    return TRANSLATION_STATUS_COLORS[status];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#0a0a0a] border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Languages className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <p className="text-sm text-gray-400">
                {language === 'ar' ? 'إدارة اللغات والترجمة' : 'Manage Languages & Translation'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Language Versions */}
          <div className="grid grid-cols-2 gap-4">
            {/* English Version */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🇺🇸</span>
                  <span className="text-lg font-semibold text-white">English</span>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${getStatusColor(enStatus).bg}`}>
                  {getStatusIcon(enStatus)}
                  <span className={`text-sm font-medium ${getStatusColor(enStatus).text}`}>
                    {getStatusLabel(enStatus)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{language === 'ar' ? 'الحقول المترجمة' : 'Translated Fields'}</span>
                  <span>{enTranslatedFields}/{totalFields}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                    style={{ width: `${(enTranslatedFields / totalFields) * 100}%` }}
                  />
                </div>
              </div>

              {/* Missing Fields */}
              {enStatus !== 'complete' && (
                <div className="mt-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs text-amber-400">
                    {language === 'ar'
                      ? `${totalFields - enTranslatedFields} حقل مفقود`
                      : `${totalFields - enTranslatedFields} fields missing`}
                  </p>
                </div>
              )}
            </div>

            {/* Arabic Version */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🇸🇦</span>
                  <span className="text-lg font-semibold text-white">العربية</span>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${getStatusColor(arStatus).bg}`}>
                  {getStatusIcon(arStatus)}
                  <span className={`text-sm font-medium ${getStatusColor(arStatus).text}`}>
                    {getStatusLabel(arStatus)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{language === 'ar' ? 'الحقول المترجمة' : 'Translated Fields'}</span>
                  <span>{arTranslatedFields}/{totalFields}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
                    style={{ width: `${(arTranslatedFields / totalFields) * 100}%` }}
                  />
                </div>
              </div>

              {/* Missing Fields */}
              {arStatus !== 'complete' && (
                <div className="mt-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs text-amber-400">
                    {language === 'ar'
                      ? `${totalFields - arTranslatedFields} حقل مفقود`
                      : `${totalFields - arTranslatedFields} fields missing`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Duplicate Translation Section */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Copy className="w-5 h-5 text-blue-400" />
              {language === 'ar' ? 'نسخ الترجمة' : 'Duplicate Translation'}
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              {language === 'ar'
                ? 'انسخ المحتوى من لغة إلى أخرى لتوفير الوقت'
                : 'Copy content from one language to another to save time'}
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => onDuplicate('en', 'ar')}
                disabled={enStatus === 'missing'}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-bold">EN</span>
                <ArrowRight className="w-4 h-4" />
                <span className="font-bold">AR</span>
              </button>
              <button
                onClick={() => onDuplicate('ar', 'en')}
                disabled={arStatus === 'missing'}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-bold">AR</span>
                <ArrowRight className="w-4 h-4" />
                <span className="font-bold">EN</span>
              </button>
            </div>
          </div>

          {/* Translation Summary */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">
              {language === 'ar' ? 'ملخص الترجمة' : 'Translation Summary'}
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-lg bg-green-500/10">
                <p className="text-2xl font-bold text-green-400">
                  {enStatus === 'complete' && arStatus === 'complete' ? '2' :
                   (enStatus === 'complete' || arStatus === 'complete') ? '1' : '0'}
                </p>
                <p className="text-xs text-gray-400">
                  {language === 'ar' ? 'مكتمل' : 'Complete'}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10">
                <p className="text-2xl font-bold text-amber-400">
                  {(enStatus === 'needs_review' || arStatus === 'needs_review') ?
                    ((enStatus === 'needs_review' ? 1 : 0) + (arStatus === 'needs_review' ? 1 : 0)) : '0'}
                </p>
                <p className="text-xs text-gray-400">
                  {language === 'ar' ? 'يحتاج مراجعة' : 'Needs Review'}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-red-500/10">
                <p className="text-2xl font-bold text-red-400">
                  {(enStatus === 'missing' || arStatus === 'missing') ?
                    ((enStatus === 'missing' ? 1 : 0) + (arStatus === 'missing' ? 1 : 0)) : '0'}
                </p>
                <p className="text-xs text-gray-400">
                  {language === 'ar' ? 'مفقود' : 'Missing'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 flex justify-end gap-3 px-6 py-4 bg-[#0a0a0a] border-t border-white/10">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-white/10 text-gray-300 hover:bg-white/20 transition-colors"
          >
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageLanguagesModal;
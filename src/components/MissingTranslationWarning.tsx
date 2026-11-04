// =====================================================
// MISSING TRANSLATION WARNING - AXIOMX ADMIN SYSTEM
// Phase 4E: Multilingual Content System
// =====================================================

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AlertTriangle } from 'lucide-react';

// Flexible content type for MissingTranslationWarning
interface FlexibleLanguageContent {
  title?: string;
  slug?: string;
  excerpt?: string;
  description?: string;
  seo?: {
    title?: string;
    description?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    keywords?: string;
  };
  blocks?: unknown[];
}

interface MissingTranslationWarningProps {
  content: {
    en: FlexibleLanguageContent;
    ar: FlexibleLanguageContent;
  };
  fieldName?: string;
}

interface MissingField {
  language: 'en' | 'ar';
  field: string;
}

export const MissingTranslationWarning: React.FC<MissingTranslationWarningProps> = ({
  content,
  fieldName
}) => {
  const { language } = useLanguage();

  // Check for missing fields
  const getMissingFields = (): MissingField[] => {
    const missing: MissingField[] = [];

    // Check English
    if (!content.en.title) missing.push({ language: 'en', field: 'title' });
    if (!content.en.slug) missing.push({ language: 'en', field: 'slug' });
    if (!content.en.excerpt) missing.push({ language: 'en', field: 'excerpt' });
    if (!content.en.description) missing.push({ language: 'en', field: 'description' });
    if (!content.en.seo?.title) missing.push({ language: 'en', field: 'seo.title' });
    if (!content.en.seo?.description) missing.push({ language: 'en', field: 'seo.description' });
    if (!content.en.blocks || content.en.blocks.length === 0) missing.push({ language: 'en', field: 'blocks' });

    // Check Arabic
    if (!content.ar.title) missing.push({ language: 'ar', field: 'title' });
    if (!content.ar.slug) missing.push({ language: 'ar', field: 'slug' });
    if (!content.ar.excerpt) missing.push({ language: 'ar', field: 'excerpt' });
    if (!content.ar.description) missing.push({ language: 'ar', field: 'description' });
    if (!content.ar.seo?.title) missing.push({ language: 'ar', field: 'seo.title' });
    if (!content.ar.seo?.description) missing.push({ language: 'ar', field: 'seo.description' });
    if (!content.ar.blocks || content.ar.blocks.length === 0) missing.push({ language: 'ar', field: 'blocks' });

    return missing;
  };

  const missingFields = getMissingFields();

  if (missingFields.length === 0) {
    return null;
  }

  const enMissing = missingFields.filter(f => f.language === 'en').length;
  const arMissing = missingFields.filter(f => f.language === 'ar').length;

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
      <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-amber-400">
          {language === 'ar'
            ? 'تحذير: ترجمة غير مكتملة'
            : 'Warning: Incomplete Translation'}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {language === 'ar'
            ? `مفقود: ${enMissing > 0 ? `${enMissing} حقل إنجليزي` : ''}${enMissing > 0 && arMissing > 0 ? '، ' : ''}${arMissing > 0 ? `${arMissing} حقل عربي` : ''}`
            : `Missing: ${enMissing > 0 ? `${enMissing} English field${enMissing > 0 && arMissing > 0 ? ', ' : ''}` : ''}${arMissing > 0 ? `${arMissing} Arabic field` : ''}`}
        </p>
        {fieldName && (
          <p className="text-xs text-amber-300 mt-1">
            {language === 'ar'
              ? `الحقل: ${fieldName}`
              : `Field: ${fieldName}`}
          </p>
        )}
      </div>
    </div>
  );
};

// Compact badge version for inline display
interface MissingTranslationBadgeProps {
  hasMissing: boolean;
  count: number;
}

export const MissingTranslationBadge: React.FC<MissingTranslationBadgeProps> = ({
  hasMissing,
  count
}) => {
  const { language } = useLanguage();

  if (!hasMissing) {
    return null;
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">
      <AlertTriangle className="w-3 h-3" />
      {count} {language === 'ar' ? 'مفقود' : 'missing'}
    </span>
  );
};

export default MissingTranslationWarning;
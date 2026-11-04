// =====================================================
// LANGUAGE TABS COMPONENT - AXIOMX ADMIN SYSTEM
// Phase 4E: Multilingual Content System
// =====================================================

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TranslationStatus, TRANSLATION_STATUS_COLORS } from '../types/project';
import { Check, AlertTriangle, X, Copy, Languages } from 'lucide-react';

type ContentLanguage = 'en' | 'ar';

interface LanguageTabsProps {
  activeLanguage: ContentLanguage;
  onLanguageChange: (lang: ContentLanguage) => void;
  translationStatus?: {
    en: TranslationStatus;
    ar: TranslationStatus;
  };
  onDuplicate?: (from: ContentLanguage, to: ContentLanguage) => void;
  showDuplicateButtons?: boolean;
}

const LanguageTabs: React.FC<LanguageTabsProps> = ({
  activeLanguage,
  onLanguageChange,
  translationStatus,
  onDuplicate,
  showDuplicateButtons = true,
}) => {
  const { language } = useLanguage();

  const languages: { code: ContentLanguage; label: string; flag: string }[] = [
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
  ];

  const getStatusIcon = (status: TranslationStatus) => {
    switch (status) {
      case 'complete':
        return <Check className="w-3 h-3" />;
      case 'needs_review':
        return <AlertTriangle className="w-3 h-3" />;
      case 'missing':
        return <X className="w-3 h-3" />;
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

  const handleDuplicate = (from: ContentLanguage, to: ContentLanguage) => {
    if (onDuplicate) {
      onDuplicate(from, to);
    }
  };

  return (
    <div className="bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden">
      {/* Tabs Header */}
      <div className="flex items-center border-b border-white/10">
        {languages.map((lang, index) => (
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

              {/* Status Badge */}
              {translationStatus && (
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${
                    TRANSLATION_STATUS_COLORS[translationStatus[lang.code]].bg
                  } ${
                    TRANSLATION_STATUS_COLORS[translationStatus[lang.code]].text
                  }`}
                >
                  {getStatusIcon(translationStatus[lang.code])}
                </span>
              )}

              {/* Active Indicator */}
              {activeLanguage === lang.code && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
              )}
            </button>
            {index < languages.length - 1 && showDuplicateButtons && (
              <button
                onClick={() => handleDuplicate(lang.code, languages[index + 1].code)}
                className="px-2 py-2 text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                title={language === 'ar' ? `نسخ إلى ${languages[index + 1].label}` : `Duplicate to ${languages[index + 1].label}`}
              >
                <Copy className="w-4 h-4" />
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Duplicate Buttons Row */}
      {showDuplicateButtons && (
        <div className="flex items-center gap-2 p-3 border-t border-white/5 bg-white/5">
          <Languages className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">
            {language === 'ar' ? 'نسخ المحتوى:' : 'Duplicate Content:'}
          </span>
          <button
            onClick={() => handleDuplicate('en', 'ar')}
            disabled={!translationStatus || translationStatus.en === 'missing'}
            className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-lg text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={language === 'ar' ? 'نسخ الإنجليزي إلى العربي' : 'Copy English to Arabic'}
          >
            EN → AR
          </button>
          <button
            onClick={() => handleDuplicate('ar', 'en')}
            disabled={!translationStatus || translationStatus.ar === 'missing'}
            className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-lg text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={language === 'ar' ? 'نسخ العربي إلى الإنجليزي' : 'Copy Arabic to English'}
          >
            AR → EN
          </button>
        </div>
      )}
    </div>
  );
};

// Translation Status Badge Component
interface TranslationStatusBadgeProps {
  status: TranslationStatus;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export const TranslationStatusBadge: React.FC<TranslationStatusBadgeProps> = ({
  status,
  showLabel = false,
  size = 'sm',
}) => {
  const { language } = useLanguage();

  const getStatusIcon = () => {
    switch (status) {
      case 'complete':
        return <Check className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />;
      case 'needs_review':
        return <AlertTriangle className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />;
      case 'missing':
        return <X className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />;
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'complete':
        return language === 'ar' ? 'مكتمل' : 'Complete';
      case 'needs_review':
        return language === 'ar' ? 'يحتاج مراجعة' : 'Needs Review';
      case 'missing':
        return language === 'ar' ? 'مفقود' : 'Missing';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      } ${TRANSLATION_STATUS_COLORS[status].bg} ${TRANSLATION_STATUS_COLORS[status].text}`}
    >
      {getStatusIcon()}
      {showLabel && getStatusLabel()}
    </span>
  );
};

// Language Indicator Badge (for tables)
interface LanguageBadgeProps {
  hasEn: boolean;
  hasAr: boolean;
}

export const LanguageBadge: React.FC<LanguageBadgeProps> = ({ hasEn, hasAr }) => {
  return (
    <div className="flex items-center gap-1">
      {hasEn && (
        <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-bold rounded">
          EN
        </span>
      )}
      {hasAr && (
        <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded">
          AR
        </span>
      )}
      {!hasEn && !hasAr && (
        <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded">
          --
        </span>
      )}
    </div>
  );
};

// Combined Translation Status Display
interface TranslationStatusDisplayProps {
  enStatus: TranslationStatus;
  arStatus: TranslationStatus;
}

export const TranslationStatusDisplay: React.FC<TranslationStatusDisplayProps> = ({
  enStatus,
  arStatus,
}) => {
  const { language } = useLanguage();

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500 font-medium">EN:</span>
        <TranslationStatusBadge status={enStatus} showLabel size="sm" />
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500 font-medium">AR:</span>
        <TranslationStatusBadge status={arStatus} showLabel size="sm" />
      </div>
    </div>
  );
};

export default LanguageTabs;
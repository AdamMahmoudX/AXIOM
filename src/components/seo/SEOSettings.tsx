// =====================================================
// SEO SETTINGS COMPONENT - AXIOMX ADMIN SYSTEM
// Phase 4F-B: SEO Automation System
// Professional SEO System with Full OpenGraph Support
// Auto SEO Generation, Score System, Checklist & Focus Keyword Analysis
// =====================================================

import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SEOContent } from '../../types/project';
import {
  Search,
  Link,
  Target,
  Sparkles,
  Check,
  AlertTriangle,
  X,
  Image,
  Share2,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Circle,
  Hash,
  FileText,
  Eye,
  Zap,
  RefreshCw,
} from 'lucide-react';

// SEO Length Validation Status
type ValidationStatus = 'good' | 'warning' | 'error' | 'empty';

// SEO Checklist Item
interface SEOChecklistItem {
  id: string;
  label: string;
  labelAr: string;
  status: 'pass' | 'fail' | 'warning' | 'empty';
  score: number;
  maxScore: number;
  tooltip: string;
  tooltipAr: string;
}

// Calculate validation status based on length
const getTitleValidation = (length: number): ValidationStatus => {
  if (length === 0) return 'empty';
  if (length >= 30 && length <= 60) return 'good';
  if (length >= 20 && length <= 70) return 'warning';
  return 'error';
};

const getDescriptionValidation = (length: number): ValidationStatus => {
  if (length === 0) return 'empty';
  if (length >= 120 && length <= 160) return 'good';
  if (length >= 80 && length <= 180) return 'warning';
  return 'error';
};

const getOgTitleValidation = (length: number): ValidationStatus => {
  if (length === 0) return 'empty';
  if (length >= 40 && length <= 60) return 'good';
  if (length >= 30 && length <= 70) return 'warning';
  return 'error';
};

const getOgDescriptionValidation = (length: number): ValidationStatus => {
  if (length === 0) return 'empty';
  if (length >= 80 && length <= 125) return 'good';
  if (length >= 60 && length <= 150) return 'warning';
  return 'error';
};

// Validation Badge Component
const ValidationBadge: React.FC<{
  status: ValidationStatus;
  count: number;
  label: string;
  min: number;
  max: number;
}> = ({ status, count, label, min, max }) => {
  const { language } = useLanguage();

  const statusConfig = {
    good: {
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      icon: <Check className="w-3 h-3" />,
      label: language === 'ar' ? 'جيد' : 'Good',
    },
    warning: {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400',
      icon: <AlertTriangle className="w-3 h-3" />,
      label: language === 'ar' ? 'تحذير' : 'Warning',
    },
    error: {
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      icon: <X className="w-3 h-3" />,
      label: language === 'ar' ? 'خطأ' : 'Error',
    },
    empty: {
      bg: 'bg-gray-500/20',
      text: 'text-gray-400',
      icon: <span className="w-3 h-3" />,
      label: language === 'ar' ? 'فارغ' : 'Empty',
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${config.bg}`}>
      <span className={config.text}>{config.icon}</span>
      <span className={`text-xs font-medium ${config.text}`}>
        {label}: {count}/{min}-{max}
      </span>
      <span className={`text-xs ${config.text} opacity-75`}>
        ({config.label})
      </span>
    </div>
  );
};

// SEO Score Circle Component
const SEOScoreCircle: React.FC<{ score: number; size?: 'sm' | 'md' | 'lg' }> = ({ score, size = 'md' }) => {
  const { language } = useLanguage();

  const sizeConfig = {
    sm: { w: 'w-16', h: 'h-16', text: 'text-lg', stroke: 4 },
    md: { w: 'w-24', h: 'h-24', text: 'text-2xl', stroke: 5 },
    lg: { w: 'w-32', h: 'h-32', text: 'text-4xl', stroke: 6 },
  };

  const config = sizeConfig[size];
  const radius = size === 'sm' ? 26 : size === 'md' ? 40 : 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBg = () => {
    if (score >= 80) return 'rgba(34, 197, 94, 0.1)';
    if (score >= 60) return 'rgba(234, 179, 8, 0.1)';
    if (score >= 40) return 'rgba(249, 115, 22, 0.1)';
    return 'rgba(239, 68, 68, 0.1)';
  };

  const getScoreBorder = () => {
    if (score >= 80) return 'border-green-500/30';
    if (score >= 60) return 'border-yellow-500/30';
    if (score >= 40) return 'border-orange-500/30';
    return 'border-red-500/30';
  };

  return (
    <div className={`relative ${config.w} ${config.h}`}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={config.stroke}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke={score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : score >= 40 ? '#f97316' : '#ef4444'}
          strokeWidth={config.stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500"
        />
      </svg>
      <div className={`absolute inset-0 flex flex-col items-center justify-center ${getScoreBg()} rounded-full border-2 ${getScoreBorder()}`}>
        <span className={`${config.text} font-bold ${getScoreColor()}`}>{score}</span>
        <span className="text-[8px] text-gray-400">{language === 'ar' ? 'من 100' : '/100'}</span>
      </div>
    </div>
  );
};

// Checklist Item Component
const ChecklistItem: React.FC<{ item: SEOChecklistItem; language: 'en' | 'ar' }> = ({ item, language }) => {
  const getStatusIcon = () => {
    switch (item.status) {
      case 'pass':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'fail':
        return <X className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default:
        return <Circle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getBgColor = () => {
    switch (item.status) {
      case 'pass':
        return 'bg-green-500/10';
      case 'fail':
        return 'bg-red-500/10';
      case 'warning':
        return 'bg-yellow-500/10';
      default:
        return 'bg-white/5';
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg ${getBgColor()} transition-colors`}
      title={language === 'ar' ? item.tooltipAr : item.tooltip}
    >
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <span className="text-sm text-gray-300">
          {language === 'ar' ? item.labelAr : item.label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">
          +{item.score}/{item.maxScore}
        </span>
      </div>
    </div>
  );
};

// Focus Keyword Analysis Component
const FocusKeywordAnalysis: React.FC<{
  focusKeyword: string;
  title: string;
  description: string;
  excerpt: string;
  language: 'en' | 'ar';
}> = ({ focusKeyword, title, description, excerpt, language }) => {
  if (!focusKeyword) {
    return (
      <div className="p-4 bg-orange-500/10 rounded-xl border border-orange-500/20">
        <div className="flex items-center gap-2 text-orange-400">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">
            {language === 'ar'
              ? 'أدخل الكلمة المفتاحية الرئيسية لرؤية التحليل'
              : 'Enter a focus keyword to see analysis'}
          </span>
        </div>
      </div>
    );
  }

  const countOccurrences = (text: string, keyword: string): number => {
    if (!text || !keyword) return 0;
    const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  };

  const titleCount = countOccurrences(title, focusKeyword);
  const descCount = countOccurrences(description, focusKeyword);
  const excerptCount = countOccurrences(excerpt, focusKeyword);
  const totalCount = titleCount + descCount + excerptCount;

  const getDensity = (): string => {
    const totalText = `${title} ${description} ${excerpt}`;
    const words = totalText.split(/\s+/).filter(w => w.length > 0).length;
    if (words === 0) return '0';
    return ((totalCount / words) * 100).toFixed(2);
  };

  const density = parseFloat(getDensity());

  const getStatus = (count: number, min: number, max: number) => {
    if (count === 0) return 'missing';
    if (count >= min && count <= max) return 'good';
    if (count < min) return 'low';
    return 'high';
  };

  const titleStatus = getStatus(titleCount, 1, 2);
  const descStatus = getStatus(descCount, 2, 6);
  const densityStatus = density >= 1 && density <= 3 ? 'good' : density < 1 ? 'low' : 'high';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good':
        return <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400">
          {language === 'ar' ? 'ممتاز' : 'Good'}
        </span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-400">
          {language === 'ar' ? 'منخفض' : 'Low'}
        </span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-xs bg-orange-500/20 text-orange-400">
          {language === 'ar' ? 'مرتفع' : 'High'}
        </span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs bg-gray-500/20 text-gray-400">
          {language === 'ar' ? 'مفقود' : 'Missing'}
        </span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Keyword Summary */}
      <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-xl">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-gray-300">
            {language === 'ar' ? 'الكلمة المفتاحية:' : 'Keyword:'}
          </span>
          <span className="text-sm font-medium text-purple-400">{focusKeyword}</span>
        </div>
        <div className="text-sm font-bold text-white">{totalCount}x</div>
      </div>

      {/* Occurrences Breakdown */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-white/5 rounded-lg text-center">
          <div className="text-xs text-gray-500 mb-1">
            {language === 'ar' ? 'في العنوان' : 'In Title'}
          </div>
          <div className="text-lg font-bold text-white">{titleCount}</div>
          {getStatusBadge(titleStatus)}
        </div>
        <div className="p-3 bg-white/5 rounded-lg text-center">
          <div className="text-xs text-gray-500 mb-1">
            {language === 'ar' ? 'في الوصف' : 'In Description'}
          </div>
          <div className="text-lg font-bold text-white">{descCount}</div>
          {getStatusBadge(descStatus)}
        </div>
        <div className="p-3 bg-white/5 rounded-lg text-center">
          <div className="text-xs text-gray-500 mb-1">
            {language === 'ar' ? 'في المختصر' : 'In Excerpt'}
          </div>
          <div className="text-lg font-bold text-white">{excerptCount}</div>
          {getStatusBadge(excerptCount > 0 ? 'good' : 'missing')}
        </div>
      </div>

      {/* Density Analysis */}
      <div className="p-4 bg-white/5 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">
            {language === 'ar' ? 'كثافة الكلمة المفتاحية' : 'Keyword Density'}
          </span>
          {getStatusBadge(densityStatus)}
        </div>
        <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`absolute h-full rounded-full transition-all ${
              density >= 1 && density <= 3
                ? 'bg-green-500'
                : 'bg-yellow-500'
            }`}
            style={{ width: `${Math.min(density * 10, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">0%</span>
          <span className="text-xs text-gray-400 font-medium">{density}%</span>
          <span className="text-xs text-gray-500">10%</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {language === 'ar'
            ? 'النسبة المثالية: 1-3%'
            : 'Ideal density: 1-3%'}
        </p>
      </div>

      {/* Alerts */}
      {(titleCount === 0 || descCount === 0) && (
        <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {language === 'ar' ? 'تحذير:' : 'Warning:'}
            {titleCount === 0 && (
              <span>{language === 'ar' ? 'الكلمة المفتاحية غير موجودة في العنوان' : 'Keyword missing in title'}</span>
            )}
            {titleCount === 0 && descCount === 0 && ' | '}
            {descCount === 0 && (
              <span>{language === 'ar' ? 'الكلمة المفتاحية غير موجودة في الوصف' : 'Keyword missing in description'}</span>
            )}
          </div>
        </div>
      )}

      {density > 3 && (
        <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
          <div className="flex items-center gap-2 text-orange-400 text-sm">
            <AlertTriangle className="w-4 h-4" />
            {language === 'ar'
              ? 'كثافة عالية قد تؤثر سلباً على تحسين محركات البحث'
              : 'High keyword density may negatively impact SEO'}
          </div>
        </div>
      )}
    </div>
  );
};

// Generate SEO from content
const generateSEOFromContent = (
  title: string,
  excerpt: string,
  description: string,
  language: 'en' | 'ar'
): Partial<SEOContent> => {
  // Generate SEO Title (max 60 chars, use title if short enough)
  let seoTitle = title;
  if (title.length > 60) {
    seoTitle = title.substring(0, 57) + '...';
  }

  // Add brand suffix if not already present
  const brandSuffix = ' | AXIOMX';
  if (!seoTitle.includes('AXIOMX') && !seoTitle.includes('|')) {
    if (seoTitle.length + brandSuffix.length <= 60) {
      seoTitle += brandSuffix;
    }
  }

  // Generate SEO Description (120-160 chars)
  const fullDescription = description || excerpt;
  let seoDescription = '';
  if (fullDescription) {
    if (fullDescription.length <= 160) {
      seoDescription = fullDescription;
    } else {
      // Find a good breaking point
      const truncated = fullDescription.substring(0, 157);
      const lastSpace = truncated.lastIndexOf(' ');
      seoDescription = (lastSpace > 100 ? truncated.substring(0, lastSpace) : truncated) + '...';
    }
  }

  // Extract keywords from title and description
  const textForKeywords = `${title} ${excerpt} ${description}`;
  const words = textForKeywords
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3);

  // Get unique words and create keyword string
  const uniqueWords = [...new Set(words)].slice(0, 8);
  const keywords = uniqueWords.join(', ');

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: keywords,
    ogTitle: seoTitle,
    ogDescription: seoDescription,
  };
};

// Main SEO Settings Component
interface SEOSettingsProps {
  seo: SEOContent;
  title: string;
  description: string;
  excerpt: string;
  onSeoChange: (field: keyof SEOContent, value: string) => void;
  language: 'en' | 'ar';
}

const SEOSettings: React.FC<SEOSettingsProps> = ({
  seo,
  title,
  description,
  excerpt,
  onSeoChange,
  language,
}) => {
  const { language: uiLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<'main' | 'analysis' | 'preview'>('main');
  const [suggestedTitle, setSuggestedTitle] = useState('');
  const [suggestedDescription, setSuggestedDescription] = useState('');

  const titleLength = seo.title.length;
  const descriptionLength = seo.description.length;
  const ogTitleLength = seo.ogTitle?.length || 0;
  const ogDescriptionLength = seo.ogDescription?.length || 0;

  const titleValidation = getTitleValidation(titleLength);
  const descriptionValidation = getDescriptionValidation(descriptionLength);
  const ogTitleValidation = getOgTitleValidation(ogTitleLength);
  const ogDescriptionValidation = getOgDescriptionValidation(ogDescriptionLength);

  // Generate suggestions when title or description changes
  useEffect(() => {
    if (title && !seo.title) {
      const suggested = generateSEOFromContent(title, excerpt, description, language);
      setSuggestedTitle(suggested.title || '');
    }
    if ((description || excerpt) && !seo.description) {
      const suggested = generateSEOFromContent(title, excerpt, description, language);
      setSuggestedDescription(suggested.description || '');
    }
  }, [title, description, excerpt, seo.title, seo.description, language]);

  // Auto-suggestion handlers
  const handleApplySuggestedTitle = () => {
    if (suggestedTitle) {
      onSeoChange('title', suggestedTitle);
      setSuggestedTitle('');
    }
  };

  const handleApplySuggestedDescription = () => {
    if (suggestedDescription) {
      onSeoChange('description', suggestedDescription);
      setSuggestedDescription('');
    }
  };

  const handleGenerateSEO = () => {
    const generated = generateSEOFromContent(title, excerpt, description, language);

    if (generated.title) onSeoChange('title', generated.title);
    if (generated.description) onSeoChange('description', generated.description);
    if (generated.keywords) onSeoChange('keywords', generated.keywords!);
    if (generated.ogTitle) onSeoChange('ogTitle', generated.ogTitle!);
    if (generated.ogDescription) onSeoChange('ogDescription', generated.ogDescription!);

    setSuggestedTitle('');
    setSuggestedDescription('');
  };

  // Calculate SEO Score
  const seoScore = useMemo(() => {
    let score = 0;
    const maxScore = 100;

    // Title validation (20 points)
    if (titleLength >= 30 && titleLength <= 60) {
      score += 20;
    } else if (titleLength >= 20 && titleLength <= 70) {
      score += 15;
    } else if (titleLength > 0) {
      score += 5;
    }

    // Description validation (20 points)
    if (descriptionLength >= 120 && descriptionLength <= 160) {
      score += 20;
    } else if (descriptionLength >= 80 && descriptionLength <= 180) {
      score += 15;
    } else if (descriptionLength > 0) {
      score += 5;
    }

    // Focus keyword presence (15 points)
    if (seo.focusKeyword) {
      const keywordInTitle = seo.title.toLowerCase().includes(seo.focusKeyword.toLowerCase());
      const keywordInDesc = seo.description.toLowerCase().includes(seo.focusKeyword.toLowerCase());

      if (keywordInTitle && keywordInDesc) {
        score += 15;
      } else if (keywordInTitle || keywordInDesc) {
        score += 10;
      } else {
        score += 5;
      }
    }

    // OpenGraph settings (15 points)
    if (seo.ogTitle && ogTitleLength >= 40 && ogTitleLength <= 60) score += 8;
    else if (seo.ogTitle) score += 4;

    if (seo.ogDescription && ogDescriptionLength >= 80 && ogDescriptionLength <= 125) score += 7;
    else if (seo.ogDescription) score += 3;

    // Keywords (10 points)
    if (seo.keywords && seo.keywords.length > 0) {
      const keywordCount = seo.keywords.split(',').filter(k => k.trim()).length;
      if (keywordCount >= 3 && keywordCount <= 8) score += 10;
      else if (keywordCount > 0) score += 5;
    }

    // Canonical URL (10 points)
    if (seo.canonicalUrl && seo.canonicalUrl.startsWith('http')) {
      score += 10;
    }

    // Slug validation (10 points)
    if (seo.focusKeyword) {
      const slugFromKeyword = seo.focusKeyword.toLowerCase().replace(/\s+/g, '-');
      // This is a simplified check - in real app would check actual slug
      score += 5;
    }

    return Math.min(score, maxScore);
  }, [
    titleLength, descriptionLength, ogTitleLength, ogDescriptionLength,
    seo.title, seo.description, seo.focusKeyword, seo.ogTitle, seo.ogDescription,
    seo.keywords, seo.canonicalUrl
  ]);

  // Generate SEO Checklist
  const checklistItems = useMemo((): SEOChecklistItem[] => {
    const items: SEOChecklistItem[] = [
      {
        id: 'title-length',
        label: 'Title Length (30-60 chars)',
        labelAr: 'طول العنوان (30-60 حرف)',
        status: titleLength >= 30 && titleLength <= 60 ? 'pass' :
                titleLength > 0 ? 'warning' : 'empty',
        score: titleLength >= 30 && titleLength <= 60 ? 20 : titleLength > 0 ? 10 : 0,
        maxScore: 20,
        tooltip: 'Title should be between 30-60 characters for best results',
        tooltipAr: 'يجب أن يكون العنوان بين 30-60 حرفاً للحصول على أفضل النتائج',
      },
      {
        id: 'desc-length',
        label: 'Description Length (120-160 chars)',
        labelAr: 'طول الوصف (120-160 حرف)',
        status: descriptionLength >= 120 && descriptionLength <= 160 ? 'pass' :
                descriptionLength > 0 ? 'warning' : 'empty',
        score: descriptionLength >= 120 && descriptionLength <= 160 ? 20 : descriptionLength > 0 ? 10 : 0,
        maxScore: 20,
        tooltip: 'Meta description should be between 120-160 characters',
        tooltipAr: 'يجب أن يكون الوصف التعريفي بين 120-160 حرفاً',
      },
      {
        id: 'focus-keyword',
        label: 'Focus Keyword Present',
        labelAr: 'الكلمة المفتاحية موجودة',
        status: seo.focusKeyword ? 'pass' : 'empty',
        score: seo.focusKeyword ? 15 : 0,
        maxScore: 15,
        tooltip: 'A focus keyword helps search engines understand your content',
        tooltipAr: 'تساعد الكلمة المفتاحية الرئيسية محركات البحث على فهم محتواك',
      },
      {
        id: 'keyword-in-title',
        label: 'Keyword in Title',
        labelAr: 'الكلمة المفتاحية في العنوان',
        status: seo.focusKeyword && seo.title.toLowerCase().includes(seo.focusKeyword.toLowerCase()) ? 'pass' :
                seo.focusKeyword ? 'fail' : 'empty',
        score: seo.focusKeyword && seo.title.toLowerCase().includes(seo.focusKeyword.toLowerCase()) ? 10 : 0,
        maxScore: 10,
        tooltip: 'Include your focus keyword in the SEO title',
        tooltipAr: 'أدخل الكلمة المفتاحية الرئيسية في عنوان SEO',
      },
      {
        id: 'keyword-in-desc',
        label: 'Keyword in Description',
        labelAr: 'الكلمة المفتاحية في الوصف',
        status: seo.focusKeyword && seo.description.toLowerCase().includes(seo.focusKeyword.toLowerCase()) ? 'pass' :
                seo.focusKeyword ? 'fail' : 'empty',
        score: seo.focusKeyword && seo.description.toLowerCase().includes(seo.focusKeyword.toLowerCase()) ? 10 : 0,
        maxScore: 10,
        tooltip: 'Include your focus keyword in the meta description',
        tooltipAr: 'أدخل الكلمة المفتاحية الرئيسية في الوصف التعريفي',
      },
      {
        id: 'og-title',
        label: 'Open Graph Title',
        labelAr: 'عنوان Open Graph',
        status: seo.ogTitle && ogTitleLength >= 40 && ogTitleLength <= 60 ? 'pass' :
                seo.ogTitle ? 'warning' : 'empty',
        score: seo.ogTitle && ogTitleLength >= 40 && ogTitleLength <= 60 ? 8 : seo.ogTitle ? 4 : 0,
        maxScore: 8,
        tooltip: 'Open Graph title for social media sharing (40-60 chars)',
        tooltipAr: 'عنوان Open Graph لمشاركة وسائل التواصل (40-60 حرف)',
      },
      {
        id: 'og-desc',
        label: 'Open Graph Description',
        labelAr: 'وصف Open Graph',
        status: seo.ogDescription && ogDescriptionLength >= 80 && ogDescriptionLength <= 125 ? 'pass' :
                seo.ogDescription ? 'warning' : 'empty',
        score: seo.ogDescription && ogDescriptionLength >= 80 && ogDescriptionLength <= 125 ? 7 : seo.ogDescription ? 3 : 0,
        maxScore: 7,
        tooltip: 'Open Graph description for social media (80-125 chars)',
        tooltipAr: 'وصف Open Graph لوسائل التواصل (80-125 حرف)',
      },
      {
        id: 'canonical-url',
        label: 'Canonical URL',
        labelAr: 'رابط Canonical',
        status: seo.canonicalUrl && seo.canonicalUrl.startsWith('http') ? 'pass' :
                seo.canonicalUrl ? 'warning' : 'empty',
        score: seo.canonicalUrl && seo.canonicalUrl.startsWith('http') ? 10 : 0,
        maxScore: 10,
        tooltip: 'Canonical URL helps prevent duplicate content issues',
        tooltipAr: 'يساعد رابط Canonical في منع مشاكل المحتوى المكرر',
      },
    ];

    return items;
  }, [
    titleLength, descriptionLength, ogTitleLength, ogDescriptionLength,
    seo.focusKeyword, seo.title, seo.description, seo.ogTitle, seo.ogDescription,
    seo.canonicalUrl
  ]);

  const hasContent = title.trim() || excerpt.trim() || description.trim();

  return (
    <div className="space-y-6">
      {/* Header with Tabs and Generate Button */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">
            {uiLanguage === 'ar' ? 'إعدادات SEO' : 'SEO Settings'}
          </h3>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setActiveTab('main')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'main'
                ? 'bg-purple-500/20 text-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {uiLanguage === 'ar' ? 'الإعدادات' : 'Settings'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('analysis')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
              activeTab === 'analysis'
                ? 'bg-purple-500/20 text-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3 h-3" />
            {uiLanguage === 'ar' ? 'التحليل' : 'Analysis'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
              activeTab === 'preview'
                ? 'bg-purple-500/20 text-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Eye className="w-3 h-3" />
            {uiLanguage === 'ar' ? 'معاينة' : 'Preview'}
          </button>
        </div>

        {hasContent && (
          <button
            type="button"
            onClick={handleGenerateSEO}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/30 rounded-xl text-purple-300 text-sm font-medium transition-all duration-200"
          >
            <Sparkles className="w-4 h-4" />
            {uiLanguage === 'ar' ? 'توليد تلقائي' : 'Auto Generate'}
          </button>
        )}
      </div>

      {/* Main Tab */}
      {activeTab === 'main' && (
        <>
          {/* Validation Indicators - Meta Tags */}
          <div className="flex flex-wrap items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-xs text-gray-400 font-medium">
              {uiLanguage === 'ar' ? 'معاينة التحقق:' : 'Validation Preview:'}
            </span>
            <ValidationBadge
              status={titleValidation}
              count={titleLength}
              label={uiLanguage === 'ar' ? 'العنوان' : 'Title'}
              min={30}
              max={60}
            />
            <ValidationBadge
              status={descriptionValidation}
              count={descriptionLength}
              label={uiLanguage === 'ar' ? 'الوصف' : 'Description'}
              min={120}
              max={160}
            />
          </div>

          {/* Meta Tags Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <Search className="w-4 h-4 text-blue-400" />
              <h4 className="text-sm font-semibold text-gray-300">
                {uiLanguage === 'ar' ? 'وسوم Meta' : 'Meta Tags'}
              </h4>
            </div>

            {/* Focus Keyword */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Target className="w-4 h-4 text-orange-400" />
                {uiLanguage === 'ar' ? 'الكلمة المفتاحية الرئيسية' : 'Focus Keyword'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={seo.focusKeyword || ''}
                  onChange={(e) => onSeoChange('focusKeyword', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                  placeholder={uiLanguage === 'ar' ? 'كلمة مفتاحية واحدة' : 'Single keyword phrase'}
                  dir="ltr"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {uiLanguage === 'ar' ? 'الكلمة المفتاحية الرئيسية للصفحة' : 'Primary keyword for this page'}
              </p>
            </div>

            {/* Canonical URL */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Link className="w-4 h-4 text-cyan-400" />
                {uiLanguage === 'ar' ? 'رابط Canonical' : 'Canonical URL'}
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={seo.canonicalUrl || ''}
                  onChange={(e) => onSeoChange('canonicalUrl', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                  placeholder="https://..."
                  dir="ltr"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {uiLanguage === 'ar' ? 'الرابط المفضل لمحركات البحث' : 'Preferred URL for search engines'}
              </p>
            </div>

            {/* SEO Title with Auto Suggestion */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {uiLanguage === 'ar' ? 'عنوان SEO (Meta Title)' : 'SEO Title (Meta Title)'}
                <span className="ml-2 text-xs text-gray-500">
                  ({titleLength}/60 {uiLanguage === 'ar' ? 'حرف' : 'chars'})
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={seo.title}
                  onChange={(e) => onSeoChange('title', e.target.value)}
                  className={`w-full px-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none ${
                    titleValidation === 'good' ? 'pr-12' : titleValidation === 'warning' || titleValidation === 'error' ? 'pr-12' : 'pr-4'
                  }`}
                  placeholder={uiLanguage === 'ar' ? 'عنوان يظهر في محركات البحث (30-60 حرف)' : 'Title for search engines (30-60 chars)'}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {titleValidation === 'good' && <Check className="w-4 h-4 text-green-400" />}
                  {titleValidation === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                  {titleValidation === 'error' && <X className="w-4 h-4 text-red-400" />}
                </div>
              </div>

              {/* Auto Suggestion */}
              {suggestedTitle && !seo.title && (
                <div className="mt-2 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-gray-300">
                        {uiLanguage === 'ar' ? 'اقتراح:' : 'Suggestion:'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSuggestedTitle('')}
                        className="px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        {uiLanguage === 'ar' ? 'تجاهل' : 'Dismiss'}
                      </button>
                      <button
                        type="button"
                        onClick={handleApplySuggestedTitle}
                        className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/30 transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        {uiLanguage === 'ar' ? 'تطبيق' : 'Apply'}
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-400 truncate">{suggestedTitle}</p>
                </div>
              )}

              <p className="mt-1 text-xs text-gray-500">
                {uiLanguage === 'ar'
                  ? 'يُنصح: 30-60 حرف. يظهر في نتائج البحث.'
                  : 'Recommended: 30-60 characters. Shown in search results.'}
              </p>
            </div>

            {/* SEO Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {uiLanguage === 'ar' ? 'الكلمات المفتاحية (Meta Keywords)' : 'Keywords (Meta Keywords)'}
              </label>
              <input
                type="text"
                value={seo.keywords || ''}
                onChange={(e) => onSeoChange('keywords', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                placeholder={uiLanguage === 'ar' ? 'كلمة1، كلمة2، كلمة3' : 'keyword1, keyword2, keyword3'}
                dir="ltr"
              />
              <p className="mt-1 text-xs text-gray-500">
                {uiLanguage === 'ar'
                  ? 'مفصولة بفواصل. 3-5 كلمات مفتاحية مثالية.'
                  : 'Comma separated. 3-5 keywords is ideal.'}
              </p>
            </div>

            {/* SEO Description with Auto Suggestion */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {uiLanguage === 'ar' ? 'وصف SEO (Meta Description)' : 'SEO Description (Meta Description)'}
                <span className="ml-2 text-xs text-gray-500">
                  ({descriptionLength}/160 {uiLanguage === 'ar' ? 'حرف' : 'chars'})
                </span>
              </label>
              <div className="relative">
                <textarea
                  value={seo.description}
                  onChange={(e) => onSeoChange('description', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none ${
                    descriptionValidation === 'good' ? 'pr-12' : descriptionValidation === 'warning' || descriptionValidation === 'error' ? 'pr-12' : 'pr-4'
                  }`}
                  placeholder={uiLanguage === 'ar'
                    ? 'وصف يظهر في نتائج البحث (120-160 حرف)'
                    : 'Description for search results (120-160 chars)'}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                />
                <div className="absolute right-3 bottom-3">
                  {descriptionValidation === 'good' && <Check className="w-4 h-4 text-green-400" />}
                  {descriptionValidation === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                  {descriptionValidation === 'error' && <X className="w-4 h-4 text-red-400" />}
                </div>
              </div>

              {/* Auto Suggestion */}
              {suggestedDescription && !seo.description && (
                <div className="mt-2 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-gray-300">
                        {uiLanguage === 'ar' ? 'اقتراح:' : 'Suggestion:'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSuggestedDescription('')}
                        className="px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        {uiLanguage === 'ar' ? 'تجاهل' : 'Dismiss'}
                      </button>
                      <button
                        type="button"
                        onClick={handleApplySuggestedDescription}
                        className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/30 transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        {uiLanguage === 'ar' ? 'تطبيق' : 'Apply'}
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-400 line-clamp-2">{suggestedDescription}</p>
                </div>
              )}

              <p className="mt-1 text-xs text-gray-500">
                {uiLanguage === 'ar'
                  ? 'يُنصح: 120-160 حرف. يوضح محتوى الصفحة في البحث.'
                  : 'Recommended: 120-160 characters. Summarizes page content in search.'}
              </p>
            </div>
          </div>

          {/* OpenGraph Section */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <Share2 className="w-4 h-4 text-pink-400" />
              <h4 className="text-sm font-semibold text-gray-300">
                {uiLanguage === 'ar' ? 'إعدادات Open Graph' : 'Open Graph Settings'}
              </h4>
            </div>

            {/* Validation Indicators - OpenGraph */}
            <div className="flex flex-wrap items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-xs text-gray-400 font-medium">
                {uiLanguage === 'ar' ? 'معاينة OpenGraph:' : 'OpenGraph Preview:'}
              </span>
              <ValidationBadge
                status={ogTitleValidation}
                count={ogTitleLength}
                label={uiLanguage === 'ar' ? 'العنوان' : 'Title'}
                min={40}
                max={60}
              />
              <ValidationBadge
                status={ogDescriptionValidation}
                count={ogDescriptionLength}
                label={uiLanguage === 'ar' ? 'الوصف' : 'Description'}
                min={80}
                max={125}
              />
            </div>

            {/* OG Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {uiLanguage === 'ar' ? 'عنوان Open Graph' : 'Open Graph Title'}
                <span className="ml-2 text-xs text-gray-500">
                  ({ogTitleLength}/60 {uiLanguage === 'ar' ? 'حرف' : 'chars'})
                </span>
              </label>
              <div className={`relative rounded-xl border transition-colors ${
                ogTitleValidation === 'good' ? 'border-green-500/50 bg-green-500/5' :
                ogTitleValidation === 'warning' ? 'border-yellow-500/50 bg-yellow-500/5' :
                ogTitleValidation === 'error' ? 'border-red-500/50 bg-red-500/5' :
                'border-white/10'
              }`}>
                <input
                  type="text"
                  value={seo.ogTitle || ''}
                  onChange={(e) => onSeoChange('ogTitle', e.target.value)}
                  className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none"
                  placeholder={uiLanguage === 'ar' ? 'عنوان للمشاركة على وسائل التواصل' : 'Title for social media sharing'}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {ogTitleValidation === 'good' && <Check className="w-4 h-4 text-green-400" />}
                  {ogTitleValidation === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                  {ogTitleValidation === 'error' && <X className="w-4 h-4 text-red-400" />}
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {uiLanguage === 'ar'
                  ? 'يُنصح: 40-60 حرف. يظهر عند المشاركة على Facebook, LinkedIn.'
                  : 'Recommended: 40-60 characters. Shown when sharing on Facebook, LinkedIn.'}
              </p>
            </div>

            {/* OG Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {uiLanguage === 'ar' ? 'وصف Open Graph' : 'Open Graph Description'}
                <span className="ml-2 text-xs text-gray-500">
                  ({ogDescriptionLength}/125 {uiLanguage === 'ar' ? 'حرف' : 'chars'})
                </span>
              </label>
              <div className={`relative rounded-xl border transition-colors ${
                ogDescriptionValidation === 'good' ? 'border-green-500/50 bg-green-500/5' :
                ogDescriptionValidation === 'warning' ? 'border-yellow-500/50 bg-yellow-500/5' :
                ogDescriptionValidation === 'error' ? 'border-red-500/50 bg-red-500/5' :
                'border-white/10'
              }`}>
                <textarea
                  value={seo.ogDescription || ''}
                  onChange={(e) => onSeoChange('ogDescription', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none"
                  placeholder={uiLanguage === 'ar'
                    ? 'وصف للمشاركة على وسائل التواصل (80-125 حرف)'
                    : 'Description for social media (80-125 chars)'}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                />
                <div className="absolute right-3 bottom-3">
                  {ogDescriptionValidation === 'good' && <Check className="w-4 h-4 text-green-400" />}
                  {ogDescriptionValidation === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                  {ogDescriptionValidation === 'error' && <X className="w-4 h-4 text-red-400" />}
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {uiLanguage === 'ar'
                  ? 'يُنصح: 80-125 حرف. يوضح المحتوى عند المشاركة.'
                  : 'Recommended: 80-125 characters. Summarizes content when shared.'}
              </p>
            </div>

            {/* OG Image */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Image className="w-4 h-4 text-purple-400" />
                {uiLanguage === 'ar' ? 'صورة Open Graph' : 'Open Graph Image URL'}
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={seo.ogImage || ''}
                  onChange={(e) => onSeoChange('ogImage', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                  placeholder="https://.../og-image.jpg"
                  dir="ltr"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {uiLanguage === 'ar'
                  ? 'الحجم الموصى به: 1200x630 بكسل. صور بنسبة 1.91:1.'
                  : 'Recommended size: 1200x630px. Use 1.91:1 aspect ratio.'}
              </p>
              {seo.ogImage && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">
                    {uiLanguage === 'ar' ? 'معاينة الصورة:' : 'Image Preview:'}
                  </p>
                  <div className="w-full max-w-md h-40 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                    <img
                      src={seo.ogImage}
                      alt="OG Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x315?text=Invalid+Image';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Analysis Tab */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          {/* SEO Score */}
          <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
            <SEOScoreCircle score={seoScore} size="lg" />
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-white mb-1">
                {uiLanguage === 'ar' ? 'درجة تحسين محركات البحث' : 'SEO Score'}
              </h4>
              <p className="text-sm text-gray-400 mb-3">
                {seoScore >= 80
                  ? uiLanguage === 'ar'
                    ? 'ممتاز! محتواك مُحسّن بشكل جيد لمحركات البحث'
                    : 'Excellent! Your content is well optimized for search engines'
                  : seoScore >= 60
                  ? uiLanguage === 'ar'
                    ? 'جيد! هناك بعض التحسينات المطلوبة'
                    : 'Good! Some improvements are needed'
                  : seoScore >= 40
                  ? uiLanguage === 'ar'
                    ? 'مقبول. يجب تحسين عدة عناصر'
                    : 'Acceptable. Several elements need improvement'
                  : uiLanguage === 'ar'
                  ? 'يحتاج تحسين. راجع قائمة التحقق أدناه'
                  : 'Needs improvement. Review the checklist below'}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleGenerateSEO}
                  className="px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 transition-colors flex items-center gap-1"
                >
                  <Zap className="w-3 h-3" />
                  {uiLanguage === 'ar' ? 'تحسين تلقائي' : 'Auto Optimize'}
                </button>
              </div>
            </div>
          </div>

          {/* SEO Checklist */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <h4 className="text-sm font-semibold text-gray-300">
                {uiLanguage === 'ar' ? 'قائمة تحقق SEO' : 'SEO Checklist'}
              </h4>
            </div>
            <div className="space-y-2">
              {checklistItems.map((item) => (
                <ChecklistItem key={item.id} item={item} language={uiLanguage === 'ar' ? 'ar' : 'en'} />
              ))}
            </div>
          </div>

          {/* Focus Keyword Analysis */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-orange-400" />
              <h4 className="text-sm font-semibold text-gray-300">
                {uiLanguage === 'ar' ? 'تحليل الكلمة المفتاحية' : 'Focus Keyword Analysis'}
              </h4>
            </div>
            <FocusKeywordAnalysis
              focusKeyword={seo.focusKeyword || ''}
              title={seo.title}
              description={seo.description}
              excerpt={excerpt}
              language={uiLanguage === 'ar' ? 'ar' : 'en'}
            />
          </div>
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          {/* Google Search Preview */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300">
              {uiLanguage === 'ar' ? 'معاينة نتائج البحث (Google)' : 'Search Result Preview (Google)'}
            </h4>
            <div className="p-6 bg-white rounded-lg">
              <div className="max-w-[600px]">
                <div className="text-blue-600 text-lg hover:underline cursor-pointer truncate">
                  {seo.title || (uiLanguage === 'ar' ? 'عنوان الصفحة...' : 'Page Title...')}
                </div>
                <div className="text-green-700 text-sm truncate">
                  {seo.canonicalUrl || 'https://example.com/page-url'}
                </div>
                <div className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {seo.description || (uiLanguage === 'ar' ? 'وصف الصفحة سيظهر هنا...' : 'Page description will appear here...')}
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Preview */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300">
              {uiLanguage === 'ar' ? 'معاينة المشاركة (Social Media)' : 'Share Preview (Social Media)'}
            </h4>
            <div className="p-4 bg-[#f0f0f0] rounded-lg border border-gray-200">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden max-w-[500px]">
                {seo.ogImage && (
                  <div className="w-full h-52 bg-gray-200">
                    <img
                      src={seo.ogImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="p-3">
                  <div className="text-[10px] uppercase tracking-wide text-gray-500 mb-1">
                    {uiLanguage === 'ar' ? 'الموقع الإلكتروني' : 'WEBSITE.COM'}
                  </div>
                  <div className="font-bold text-gray-900 truncate">
                    {seo.ogTitle || seo.title || (uiLanguage === 'ar' ? 'عنوان المشاركة...' : 'Share Title...')}
                  </div>
                  <div className="text-xs text-gray-500 line-clamp-2 mt-1">
                    {seo.ogDescription || seo.description || (uiLanguage === 'ar' ? 'وصف المشاركة...' : 'Share description...')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SEOSettings;
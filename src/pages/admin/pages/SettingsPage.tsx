// =====================================================
// SETTINGS PAGE - AXIOMX ADMIN SYSTEM
// Phase 4F-E: Analytics & Search Console Integration
// Phase 6A-1: Services CMS Settings
// Central settings for GA4, Search Console, Default SEO, and Services
// =====================================================

import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useSEOSettings } from '../../../context/SEOSettingsContext';
import { useServices } from '../../../context/ServiceContext';
import { useAuth } from '../../../context/AuthContext';
import {
  Activity,
  Search,
  Settings,
  Globe,
  Key,
  Check,
  X,
  AlertCircle,
  Info,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  ExternalLink,
  Shield,
  BarChart3,
  Link as LinkIcon,
  Boxes,
  Network,
  PieChart,
  Lock,
  Unlock,
  Plus,
  Edit3,
  Trash2,
  Send,
  Users,
} from 'lucide-react';

type SettingsTab = 'analytics' | 'searchConsole' | 'general' | 'services';

const SettingsPage: React.FC = () => {
  const { language } = useLanguage();
  const { settings, updateSettings, resetSettings, saveSettings, isLoaded } = useSEOSettings();
  const {
    settings: serviceSettings,
    updateSettings: updateServiceSettings,
    resetSettings: resetServiceSettings,
    updatePermissions,
    resetPermissions,
    getPermissions,
  } = useServices();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('analytics');
  const [showVerificationCode, setShowVerificationCode] = useState(false);
  const [showAnalyticsId, setShowAnalyticsId] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const isRTL = language === 'ar';
  const canManagePermissions = user?.role === 'owner' || user?.role === 'admin';

  // Handle save with feedback
  const handleSave = async () => {
    setIsSaving(true);
    saveSettings();
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSaving(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  // Tab definitions
  const tabs = [
    { id: 'analytics' as const, label: 'Google Analytics 4', labelAr: 'Google Analytics 4', icon: BarChart3 },
    { id: 'searchConsole' as const, label: 'Search Console', labelAr: 'Search Console', icon: Search },
    { id: 'general' as const, label: 'General SEO', labelAr: 'SEO العام', icon: Globe },
    { id: 'services' as const, label: 'Services CMS', labelAr: 'إعدادات الخدمات', icon: Boxes },
  ];

  const permissions = getPermissions();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-500/20 rounded-xl">
            <Settings className="w-6 h-6 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            {language === 'ar' ? 'إعدادات الموقع' : 'Site Settings'}
          </h1>
        </div>
        <p className="text-gray-400">
          {language === 'ar'
            ? 'إدارة Google Analytics و Search Console وإعدادات SEO الافتراضية'
            : 'Manage Google Analytics, Search Console, and default SEO settings'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-white/5 rounded-xl p-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {isRTL ? tab.labelAr : tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Google Analytics 4 Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {language === 'ar' ? 'Google Analytics 4' : 'Google Analytics 4'}
                </h2>
                <p className="text-sm text-gray-400">
                  {language === 'ar'
                    ? 'تكوين التتبع وإدارة Measurement ID'
                    : 'Configure tracking and manage Measurement ID'}
                </p>
              </div>
            </div>

            {/* GA4 Enabled Toggle */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm font-medium text-white">
                    {language === 'ar' ? 'تفعيل التتبع' : 'Enable Tracking'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {language === 'ar'
                      ? 'تفعيل تتبع Page Views تلقائياً'
                      : 'Enable automatic page view tracking'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => updateSettings({ ga4Enabled: !settings.ga4Enabled })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.ga4Enabled ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.ga4Enabled ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Measurement ID Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Key className="w-4 h-4 text-yellow-400" />
                {language === 'ar' ? 'Measurement ID' : 'Measurement ID'}
              </label>
              <div className="relative">
                <input
                  type={showAnalyticsId ? 'text' : 'password'}
                  value={settings.ga4MeasurementId}
                  onChange={(e) => updateSettings({ ga4MeasurementId: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                  dir="ltr"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowAnalyticsId(!showAnalyticsId)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showAnalyticsId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {language === 'ar'
                  ? 'أدخل Measurement ID من Google Analytics (مثل G-XXXXXXXXXX)'
                  : 'Enter your Measurement ID from Google Analytics (e.g., G-XXXXXXXXXX)'}
              </p>
            </div>

            {/* Status */}
            <div className={`flex items-center gap-3 p-4 rounded-xl ${
              settings.ga4Enabled && settings.ga4MeasurementId
                ? 'bg-green-500/10 border border-green-500/20'
                : 'bg-yellow-500/10 border border-yellow-500/20'
            }`}>
              {settings.ga4Enabled && settings.ga4MeasurementId ? (
                <>
                  <Check className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-green-400">
                      {language === 'ar' ? 'Google Analytics مفعل' : 'Google Analytics Active'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {language === 'ar'
                        ? 'التتبع يعمل حالياً'
                        : 'Tracking is currently active'}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-sm font-medium text-yellow-400">
                      {language === 'ar' ? 'غير مفعل' : 'Not Configured'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {language === 'ar'
                        ? 'تفعيل وإدخال Measurement ID للبدء'
                        : 'Enable and enter Measurement ID to start tracking'}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Help Link */}
            <a
              href="https://analytics.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
            >
              <ExternalLink className="w-4 h-4" />
              {language === 'ar' ? 'فتح Google Analytics' : 'Open Google Analytics'}
            </a>
          </div>
        )}

        {/* Search Console Tab */}
        {activeTab === 'searchConsole' && (
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Search className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {language === 'ar' ? 'Google Search Console' : 'Google Search Console'}
                </h2>
                <p className="text-sm text-gray-400">
                  {language === 'ar'
                    ? 'التحقق من ملكية الموقع لمحركات البحث'
                    : 'Verify site ownership for search engines'}
                </p>
              </div>
            </div>

            {/* Search Console Enabled Toggle */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm font-medium text-white">
                    {language === 'ar' ? 'تفعيل التحقق' : 'Enable Verification'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {language === 'ar'
                      ? 'إضافة رمز التحقق تلقائياً'
                      : 'Automatically add verification code'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => updateSettings({ searchConsoleEnabled: !settings.searchConsoleEnabled })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.searchConsoleEnabled ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.searchConsoleEnabled ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Verification Code Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Key className="w-4 h-4 text-yellow-400" />
                {language === 'ar' ? 'رمز التحقق' : 'Verification Code'}
              </label>
              <div className="relative">
                <input
                  type={showVerificationCode ? 'text' : 'password'}
                  value={settings.searchConsoleCode}
                  onChange={(e) => updateSettings({ searchConsoleCode: e.target.value })}
                  placeholder={language === 'ar' ? 'أدخل رمز التحقق' : 'Enter verification code'}
                  dir="ltr"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowVerificationCode(!showVerificationCode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showVerificationCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {language === 'ar'
                  ? 'أدخل رمز التحقق من Search Console'
                  : 'Enter verification code from Search Console'}
              </p>
            </div>

            {/* Verification Method */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <LinkIcon className="w-4 h-4 text-purple-400" />
                {language === 'ar' ? 'طريقة التحقق' : 'Verification Method'}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'meta-tag', label: 'Meta Tag', labelAr: 'وسم Meta' },
                  { value: 'google-verification', label: 'Google Code', labelAr: 'كود Google' },
                  { value: 'html-file', label: 'HTML File', labelAr: 'ملف HTML' },
                  { value: 'dns-record', label: 'DNS', labelAr: 'DNS' },
                ].map(method => (
                  <button
                    key={method.value}
                    onClick={() => updateSettings({ searchConsoleMethod: method.value as any })}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      settings.searchConsoleMethod === method.value
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'
                    }`}
                  >
                    {isRTL ? method.labelAr : method.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {settings.searchConsoleMethod === 'meta-tag' && (
                  language === 'ar'
                    ? 'سيتم إضافة وسم Meta تلقائياً في رأس الصفحة'
                    : 'Meta tag will be automatically added to page head'
                )}
                {settings.searchConsoleMethod === 'google-verification' && (
                  language === 'ar'
                    ? 'كود التحقق من Google سيُضاف تلقائياً'
                    : 'Google verification code will be added automatically'
                )}
                {settings.searchConsoleMethod === 'html-file' && (
                  language === 'ar'
                    ? 'يتطلب رفع ملف HTML إلى جذر الموقع'
                    : 'Requires uploading HTML file to site root'
                )}
                {settings.searchConsoleMethod === 'dns-record' && (
                  language === 'ar'
                    ? 'يتطلب إضافة سجل TXT في DNS'
                    : 'Requires adding TXT record in DNS'
                )}
              </p>
            </div>

            {/* Status */}
            <div className={`flex items-center gap-3 p-4 rounded-xl ${
              settings.searchConsoleEnabled && settings.searchConsoleCode
                ? 'bg-green-500/10 border border-green-500/20'
                : 'bg-yellow-500/10 border border-yellow-500/20'
            }`}>
              {settings.searchConsoleEnabled && settings.searchConsoleCode ? (
                <>
                  <Check className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-green-400">
                      {language === 'ar' ? 'التحقق مفعل' : 'Verification Active'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {language === 'ar'
                        ? `الطريقة: ${settings.searchConsoleMethod}`
                        : `Method: ${settings.searchConsoleMethod}`}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-sm font-medium text-yellow-400">
                      {language === 'ar' ? 'غير مفعل' : 'Not Configured'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {language === 'ar'
                        ? 'أدخل رمز التحقق للتفعيل'
                        : 'Enter verification code to activate'}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Help Link */}
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300"
            >
              <ExternalLink className="w-4 h-4" />
              {language === 'ar' ? 'فتح Google Search Console' : 'Open Google Search Console'}
            </a>
          </div>
        )}

        {/* General SEO Tab */}
        {activeTab === 'general' && (
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Globe className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {language === 'ar' ? 'إعدادات SEO الافتراضية' : 'Default SEO Settings'}
                </h2>
                <p className="text-sm text-gray-400">
                  {language === 'ar'
                    ? 'القيم الافتراضية للموقع عند عدم وجود إعدادات مخصصة'
                    : 'Default values for site when no custom settings exist'}
                </p>
              </div>
            </div>

            {/* Site URL */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <LinkIcon className="w-4 h-4 text-cyan-400" />
                {language === 'ar' ? 'رابط الموقع' : 'Site URL'}
              </label>
              <input
                type="url"
                value={settings.siteUrl}
                onChange={(e) => updateSettings({ siteUrl: e.target.value })}
                placeholder="https://example.com"
                dir="ltr"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            {/* English Default SEO */}
            <div className="space-y-4 p-4 bg-white/5 rounded-xl">
              <h3 className="text-sm font-semibold text-gray-300">
                {language === 'ar' ? 'الإعدادات الافتراضية (الإنجليزية)' : 'Default Settings (English)'}
              </h3>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  {language === 'ar' ? 'عنوان الموقع الافتراضي' : 'Default Site Title'}
                </label>
                <input
                  type="text"
                  value={settings.defaultSiteTitle}
                  onChange={(e) => updateSettings({ defaultSiteTitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  {language === 'ar' ? 'وصف Meta الافتراضي' : 'Default Meta Description'}
                </label>
                <textarea
                  value={settings.defaultMetaDescription}
                  onChange={(e) => updateSettings({ defaultMetaDescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none"
                />
              </div>
            </div>

            {/* Arabic Default SEO */}
            <div className="space-y-4 p-4 bg-white/5 rounded-xl">
              <h3 className="text-sm font-semibold text-gray-300">
                {language === 'ar' ? 'الإعدادات الافتراضية (العربية)' : 'Default Settings (Arabic)'}
              </h3>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  {language === 'ar' ? 'عنوان الموقع الافتراضي' : 'Default Site Title'}
                </label>
                <input
                  type="text"
                  value={settings.defaultSiteTitleAr}
                  onChange={(e) => updateSettings({ defaultSiteTitleAr: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  {language === 'ar' ? 'وصف Meta الافتراضي' : 'Default Meta Description'}
                </label>
                <textarea
                  value={settings.defaultMetaDescriptionAr}
                  onChange={(e) => updateSettings({ defaultMetaDescriptionAr: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Keywords */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Info className="w-4 h-4 text-orange-400" />
                {language === 'ar' ? 'الكلمات المفتاحية الافتراضية' : 'Default Keywords'}
              </label>
              <input
                type="text"
                value={settings.defaultKeywords}
                onChange={(e) => updateSettings({ defaultKeywords: e.target.value })}
                placeholder="keyword1, keyword2, keyword3"
                dir="ltr"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
              />
              <p className="mt-1 text-xs text-gray-500">
                {language === 'ar'
                  ? 'مفصولة بفواصل'
                  : 'Comma separated'}
              </p>
            </div>
          </div>
        )}

        {/* Services CMS Settings Tab (Phase 6A-1) */}
        {activeTab === 'services' && (
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Boxes className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {language === 'ar' ? 'إعدادات الخدمات' : 'Services CMS Settings'}
                </h2>
                <p className="text-sm text-gray-400">
                  {language === 'ar'
                    ? 'إدارة إعدادات عرض وإدارة الخدمات'
                    : 'Manage services display and management settings'}
                </p>
              </div>
            </div>

            {/* Enable Services Module */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <Boxes className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-white">
                    {language === 'ar' ? 'تفعيل قسم الخدمات' : 'Enable Services Module'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {language === 'ar'
                      ? 'إظهار/إخفاء قائمة الخدمات وصفحاتها'
                      : 'Show/hide services menu and pages'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => updateServiceSettings({ enableServicesModule: !serviceSettings.enableServicesModule })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  serviceSettings.enableServicesModule ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    serviceSettings.enableServicesModule ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Enable Service SEO */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm font-medium text-white">
                    {language === 'ar' ? 'تفعيل SEO للخدمات' : 'Enable Service SEO'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {language === 'ar'
                      ? 'تفعيل إعدادات تحسين محركات البحث لكل خدمة'
                      : 'Enable SEO settings for each service'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => updateServiceSettings({ enableServiceSEO: !serviceSettings.enableServiceSEO })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  serviceSettings.enableServiceSEO ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    serviceSettings.enableServiceSEO ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Enable Service Relationships */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <Network className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-sm font-medium text-white">
                    {language === 'ar' ? 'تفعيل علاقات الخدمات' : 'Enable Service Relationships'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {language === 'ar'
                      ? 'تفعيل ربط الخدمات ببعضها البعض'
                      : 'Enable linking services to each other'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => updateServiceSettings({ enableServiceRelationships: !serviceSettings.enableServiceRelationships })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  serviceSettings.enableServiceRelationships ? 'bg-orange-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    serviceSettings.enableServiceRelationships ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Enable Analytics Dashboard */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <PieChart className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-sm font-medium text-white">
                    {language === 'ar' ? 'تفعيل لوحة التحليلات' : 'Enable Analytics Dashboard'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {language === 'ar'
                      ? 'تفعيل لوحة تحكم تحليلات الخدمات'
                      : 'Enable services analytics dashboard'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => updateServiceSettings({ enableAnalyticsDashboard: !serviceSettings.enableAnalyticsDashboard })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  serviceSettings.enableAnalyticsDashboard ? 'bg-purple-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    serviceSettings.enableAnalyticsDashboard ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Service Permissions Section (Phase 6A-2) */}
            {canManagePermissions && (
              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center gap-3 pb-4">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <Shield className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {language === 'ar' ? 'صلاحيات الخدمات' : 'Service Permissions'}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {language === 'ar'
                        ? 'إدارة صلاحيات إنشاء وتعديل وحذف ونشر الخدمات'
                        : 'Manage permissions for create, edit, delete, and publish services'}
                    </p>
                  </div>
                </div>

                {/* Allow Create */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Plus className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {language === 'ar' ? 'السماح بالإنشاء' : 'Allow Create'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {language === 'ar'
                          ? 'تمكين إنشاء خدمات جديدة'
                          : 'Enable creating new services'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => updatePermissions({ allowCreate: !permissions.allowCreate })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      permissions.allowCreate ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        permissions.allowCreate ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Allow Edit */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Edit3 className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {language === 'ar' ? 'السماح بالتعديل' : 'Allow Edit'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {language === 'ar'
                          ? 'تمكين تعديل الخدمات الموجودة'
                          : 'Enable editing existing services'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => updatePermissions({ allowEdit: !permissions.allowEdit })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      permissions.allowEdit ? 'bg-blue-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        permissions.allowEdit ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Allow Delete */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {language === 'ar' ? 'السماح بالحذف' : 'Allow Delete'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {language === 'ar'
                          ? 'تمكين حذف الخدمات'
                          : 'Enable deleting services'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => updatePermissions({ allowDelete: !permissions.allowDelete })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      permissions.allowDelete ? 'bg-red-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        permissions.allowDelete ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Allow Publish */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Send className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {language === 'ar' ? 'السماح بالنشر' : 'Allow Publish'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {language === 'ar'
                          ? 'تمكين نشر الخدمات'
                          : 'Enable publishing services'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => updatePermissions({ allowPublish: !permissions.allowPublish })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      permissions.allowPublish ? 'bg-amber-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        permissions.allowPublish ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Default Status */}
                <div className="p-4 bg-white/5 rounded-xl mb-3">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Info className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {language === 'ar' ? 'الحالة الافتراضية' : 'Default Status'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {language === 'ar'
                          ? 'الحالة الافتراضية للخدمات الجديدة'
                          : 'Default status for new services'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['draft', 'published', 'archived'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => updatePermissions({ defaultStatus: status })}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          permissions.defaultStatus === status
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'
                        }`}
                      >
                        {status === 'draft' && (language === 'ar' ? 'مسودة' : 'Draft')}
                        {status === 'published' && (language === 'ar' ? 'منشور' : 'Published')}
                        {status === 'archived' && (language === 'ar' ? 'مؤرشف' : 'Archived')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Require Approval for Publish */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                      <Lock className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {language === 'ar' ? 'طلب موافقة للنشر' : 'Require Approval for Publish'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {language === 'ar'
                          ? 'تتطلب خدمات المدير للموافقة'
                          : 'Require manager approval for publishing'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => updatePermissions({ requireApprovalForPublish: !permissions.requireApprovalForPublish })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      permissions.requireApprovalForPublish ? 'bg-cyan-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        permissions.requireApprovalForPublish ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Permissions Summary */}
                <div className="p-4 bg-white/5 rounded-xl">
                  <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {language === 'ar' ? 'ملخص الصلاحيات' : 'Permissions Summary'}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className={`flex items-center gap-2 p-2 rounded-lg ${
                      permissions.allowCreate ? 'bg-green-500/10 border border-green-500/20' : 'bg-gray-500/10 border border-gray-500/20'
                    }`}>
                      {permissions.allowCreate ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <X className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={`text-xs ${permissions.allowCreate ? 'text-green-400' : 'text-gray-500'}`}>
                        {language === 'ar' ? 'إنشاء' : 'Create'}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 p-2 rounded-lg ${
                      permissions.allowEdit ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-gray-500/10 border border-gray-500/20'
                    }`}>
                      {permissions.allowEdit ? (
                        <Check className="w-4 h-4 text-blue-400" />
                      ) : (
                        <X className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={`text-xs ${permissions.allowEdit ? 'text-blue-400' : 'text-gray-500'}`}>
                        {language === 'ar' ? 'تعديل' : 'Edit'}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 p-2 rounded-lg ${
                      permissions.allowDelete ? 'bg-red-500/10 border border-red-500/20' : 'bg-gray-500/10 border border-gray-500/20'
                    }`}>
                      {permissions.allowDelete ? (
                        <Check className="w-4 h-4 text-red-400" />
                      ) : (
                        <X className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={`text-xs ${permissions.allowDelete ? 'text-red-400' : 'text-gray-500'}`}>
                        {language === 'ar' ? 'حذف' : 'Delete'}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 p-2 rounded-lg ${
                      permissions.allowPublish ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-gray-500/10 border border-gray-500/20'
                    }`}>
                      {permissions.allowPublish ? (
                        <Check className="w-4 h-4 text-amber-400" />
                      ) : (
                        <X className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={`text-xs ${permissions.allowPublish ? 'text-amber-400' : 'text-gray-500'}`}>
                        {language === 'ar' ? 'نشر' : 'Publish'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reset Permissions */}
                <button
                  onClick={resetPermissions}
                  className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors mt-4"
                >
                  <RefreshCw className="w-4 h-4" />
                  {language === 'ar' ? 'إعادة تعيين الصلاحيات' : 'Reset Permissions'}
                </button>
              </div>
            )}

            {/* Status Summary */}
            <div className="p-4 bg-white/5 rounded-xl space-y-3">
              <h3 className="text-sm font-medium text-gray-300">
                {language === 'ar' ? 'حالة الإعدادات' : 'Settings Status'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                  serviceSettings.enableServicesModule
                    ? 'bg-blue-500/10 border border-blue-500/20'
                    : 'bg-gray-500/10 border border-gray-500/20'
                }`}>
                  {serviceSettings.enableServicesModule ? (
                    <Check className="w-4 h-4 text-blue-400" />
                  ) : (
                    <X className="w-4 h-4 text-gray-400" />
                  )}
                  <span className={`text-xs ${
                    serviceSettings.enableServicesModule ? 'text-blue-400' : 'text-gray-500'
                  }`}>
                    {language === 'ar' ? 'الخدمات' : 'Services'}
                  </span>
                </div>
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                  serviceSettings.enableServiceSEO
                    ? 'bg-green-500/10 border border-green-500/20'
                    : 'bg-gray-500/10 border border-gray-500/20'
                }`}>
                  {serviceSettings.enableServiceSEO ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <X className="w-4 h-4 text-gray-400" />
                  )}
                  <span className={`text-xs ${
                    serviceSettings.enableServiceSEO ? 'text-green-400' : 'text-gray-500'
                  }`}>
                    {language === 'ar' ? 'SEO' : 'SEO'}
                  </span>
                </div>
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                  serviceSettings.enableServiceRelationships
                    ? 'bg-orange-500/10 border border-orange-500/20'
                    : 'bg-gray-500/10 border border-gray-500/20'
                }`}>
                  {serviceSettings.enableServiceRelationships ? (
                    <Check className="w-4 h-4 text-orange-400" />
                  ) : (
                    <X className="w-4 h-4 text-gray-400" />
                  )}
                  <span className={`text-xs ${
                    serviceSettings.enableServiceRelationships ? 'text-orange-400' : 'text-gray-500'
                  }`}>
                    {language === 'ar' ? 'العلاقات' : 'Relations'}
                  </span>
                </div>
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                  serviceSettings.enableAnalyticsDashboard
                    ? 'bg-purple-500/10 border border-purple-500/20'
                    : 'bg-gray-500/10 border border-gray-500/20'
                }`}>
                  {serviceSettings.enableAnalyticsDashboard ? (
                    <Check className="w-4 h-4 text-purple-400" />
                  ) : (
                    <X className="w-4 h-4 text-gray-400" />
                  )}
                  <span className={`text-xs ${
                    serviceSettings.enableAnalyticsDashboard ? 'text-purple-400' : 'text-gray-500'
                  }`}>
                    {language === 'ar' ? 'التحليلات' : 'Analytics'}
                  </span>
                </div>
              </div>
            </div>

            {/* Reset Service Settings */}
            <button
              onClick={resetServiceSettings}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              {language === 'ar' ? 'إعادة تعيين إعدادات الخدمات' : 'Reset Services Settings'}
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={resetSettings}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            {language === 'ar' ? 'إعادة تعيين' : 'Reset to Defaults'}
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all ${
              isSaving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                {language === 'ar' ? 'جارٍ الحفظ...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {language === 'ar' ? 'حفظ الإعدادات' : 'Save Settings'}
              </>
            )}
          </button>
        </div>

        {/* Success Message */}
        {savedMessage && (
          <div className="fixed bottom-6 right-6 flex items-center gap-3 px-6 py-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 animate-fade-in">
            <Check className="w-5 h-5" />
            {language === 'ar' ? 'تم حفظ الإعدادات بنجاح' : 'Settings saved successfully'}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
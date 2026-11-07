import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  Image,
  Link as LinkIcon,
  LoaderCircle,
  Plus,
  Save,
  Settings,
  Trash2,
  X,
} from 'lucide-react';
import {
  siFacebook,
  siGithub,
  siInstagram,
  siTiktok,
  siWhatsapp,
  siX,
  siYoutube,
} from 'simple-icons';
import { useLanguage } from '../context/LanguageContext';
import { useSiteContent } from '../context/SiteContentContext';
import type { SiteNodeOverride, SiteStyleOverride, SocialLink, SocialPlatform } from '../types/siteContent';

const socialPlatforms: Array<{ value: SocialPlatform; label: string; icon: string }> = [
  { value: 'github', label: 'GitHub', icon: siGithub.path },
  { value: 'facebook', label: 'Facebook', icon: siFacebook.path },
  { value: 'x', label: 'X', icon: siX.path },
  { value: 'instagram', label: 'Instagram', icon: siInstagram.path },
  { value: 'whatsapp', label: 'WhatsApp', icon: siWhatsapp.path },
  { value: 'youtube', label: 'YouTube', icon: siYoutube.path },
  { value: 'tiktok', label: 'TikTok', icon: siTiktok.path },
];

type EditorTab = 'element' | 'social';

interface ElementDraft {
  textNodes: string[];
  src: string;
  alt: string;
  href: string;
  style: SiteStyleOverride;
}

const getTextNodes = (element: Element): Text[] => {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let node = walker.nextNode();
  while (node) {
    if (node.textContent?.trim() && !node.parentElement?.closest('[data-site-editor-ui]')) {
      nodes.push(node as Text);
    }
    node = walker.nextNode();
  }
  return nodes;
};

const getElementKey = (element: Element): string | null => {
  const indices: number[] = [];
  let current: Element | null = element;
  while (current && current !== document.body) {
    const parent = current.parentElement;
    if (!parent) return null;
    const index = Array.prototype.indexOf.call(parent.children, current) as number;
    if (index < 0) return null;
    indices.push(index);
    current = parent;
  }
  return indices.length ? indices.reverse().join('_') : null;
};

const getElementByKey = (key: string): Element | null => {
  let current: Element = document.body;
  for (const segment of key.split('_')) {
    const index = Number(segment);
    const next = current.children[index];
    if (!next) return null;
    current = next;
  }
  return current;
};

const applyOverride = (key: string, override: SiteNodeOverride): void => {
  const element = getElementByKey(key);
  if (!element || element.closest('[data-site-editor-ui]')) return;

  if (override.textNodes) {
    const nodes = getTextNodes(element);
    override.textNodes.forEach((value, index) => {
      if (nodes[index] && nodes[index].textContent !== value) nodes[index].textContent = value;
    });
  }

  if (element instanceof HTMLImageElement) {
    if (override.src && element.getAttribute('src') !== override.src) element.setAttribute('src', override.src);
    if (override.alt !== undefined && element.alt !== override.alt) element.alt = override.alt;
  }
  if (element instanceof HTMLAnchorElement && override.href && element.getAttribute('href') !== override.href) {
    element.setAttribute('href', override.href);
  }

  const htmlElement = element instanceof HTMLElement ? element : null;
  if (override.style && htmlElement) {
    for (const property of styleProperties) {
      const value = override.style[property];
      if (typeof value !== 'string' || !value) continue;
      const cssProperty = property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
      const cssValue = property === 'backgroundImage'
        ? `url("${value.replace(/["\\]/g, '')}")`
        : value;
      if (value && htmlElement.style.getPropertyValue(cssProperty) !== cssValue) {
        htmlElement.style.setProperty(cssProperty, cssValue);
      }
    }
  }
  if (typeof override.order === 'number' && htmlElement?.style.order !== String(override.order)) {
    if (htmlElement) htmlElement.style.order = String(override.order);
  }
};

const getDraft = (element: Element, override?: SiteNodeOverride): ElementDraft => ({
  textNodes: getTextNodes(element).map((node) => node.textContent ?? ''),
  src: element instanceof HTMLImageElement ? element.getAttribute('src') ?? '' : '',
  alt: element instanceof HTMLImageElement ? element.alt : '',
  href: element instanceof HTMLAnchorElement ? element.getAttribute('href') ?? '' : '',
  style: { ...override?.style },
});

const inputClass =
  'w-full rounded-lg border border-white/10 bg-[#080d18] px-3 py-2 text-sm text-white outline-none focus:border-blue-400';
const styleProperties: Array<keyof SiteStyleOverride> = [
  'color',
  'backgroundColor',
  'backgroundImage',
  'fontSize',
  'fontWeight',
  'textAlign',
  'display',
  'flexDirection',
];

const SiteVisualEditor: React.FC = () => {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  const {
    pageOverrides,
    socialLinks,
    isSiteEditor,
    isSiteContentLoading,
    siteContentError,
    savePageOverride,
    saveSocialLinks,
  } = useSiteContent();
  const [isOpen, setIsOpen] = useState(false);
  const [isPicking, setIsPicking] = useState(false);
  const [activeTab, setActiveTab] = useState<EditorTab>('element');
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [draft, setDraft] = useState<ElementDraft | null>(null);
  const [socialDraft, setSocialDraft] = useState<SocialLink[]>(socialLinks);
  const [newPlatform, setNewPlatform] = useState<SocialPlatform>('github');
  const [newUrl, setNewUrl] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const isRTL = language === 'ar';

  useEffect(() => {
    setSelectedElement(null);
    setSelectedKey(null);
    setDraft(null);
  }, [pathname]);

  useEffect(() => setSocialDraft(socialLinks), [socialLinks]);

  useEffect(() => {
    if (pathname.startsWith('/cms')) return;
    const applyAll = () => {
      for (const [key, override] of Object.entries(pageOverrides)) applyOverride(key, override);
    };

    applyAll();
    const observer = new MutationObserver(applyAll);
    observer.observe(document.getElementById('root') ?? document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: false,
    });
    return () => observer.disconnect();
  }, [pageOverrides, pathname]);

  useEffect(() => {
    if (!isPicking) return;
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || target.closest('[data-site-editor-ui]')) return;
      const root = document.getElementById('root');
      if (!root?.contains(target)) return;

      const closestInteractive = target.closest('input, textarea, select, option');
      if (closestInteractive) return;

      const element = target.closest('a,button,img,h1,h2,h3,h4,p,li,section,article,div,span');
      if (!element || element.closest('[data-site-editor-ui]')) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      const key = getElementKey(element);
      if (!key) {
        setError('تعذر تحديد العنصر لتحريره.');
        return;
      }

      setSelectedElement(element);
      setSelectedKey(key);
      setDraft(getDraft(element, pageOverrides[key]));
      setActiveTab('element');
      setError('');
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [isPicking, pageOverrides]);

  useEffect(() => {
    document.body.classList.toggle('site-content-picking', isPicking);
    if (selectedElement) selectedElement.setAttribute('data-site-editor-selected', 'true');
    return () => {
      document.body.classList.remove('site-content-picking');
      document.querySelectorAll('[data-site-editor-selected]').forEach((element) => {
        element.removeAttribute('data-site-editor-selected');
      });
    };
  }, [isPicking, selectedElement]);

  const selectedIsImage = selectedElement instanceof HTMLImageElement;
  const selectedIsLink = selectedElement instanceof HTMLAnchorElement;
  const canReorder = useMemo(() => {
    if (!selectedElement?.parentElement) return false;
    const display = getComputedStyle(selectedElement.parentElement).display;
    return display === 'flex' || display === 'inline-flex' || display === 'grid' || display === 'inline-grid'
      || selectedElement.tagName === 'SECTION';
  }, [selectedElement]);

  if (
    !isSiteEditor
    || pathname === '/login'
    || pathname.startsWith('/cms')
    || pathname.startsWith('/admin')
    || pathname.includes('pending')
    || pathname.startsWith('/onboarding')
    || pathname.startsWith('/employee-registration')
  ) return null;

  const updateStyle = (key: keyof SiteStyleOverride, value: string) => {
    setDraft((current) => current
      ? { ...current, style: { ...current.style, [key]: value || undefined } }
      : current);
  };

  const handleSaveElement = async () => {
    if (!selectedElement || !selectedKey || !draft) return;
    setIsSaving(true);
    setError('');
    setSaved(false);
    try {
      if (
        selectedElement.tagName === 'SECTION'
        && selectedElement.parentElement
        && !['flex', 'inline-flex', 'grid', 'inline-grid'].includes(getComputedStyle(selectedElement.parentElement).display)
      ) {
        const parentKey = getElementKey(selectedElement.parentElement);
        if (parentKey) {
          const currentParent = pageOverrides[parentKey] ?? {};
          await savePageOverride(parentKey, {
            ...currentParent,
            style: { ...currentParent.style, display: 'flex', flexDirection: 'column' },
          });
        }
      }

      const override: SiteNodeOverride = {
        ...(draft.textNodes.length ? { textNodes: draft.textNodes } : {}),
        ...(selectedIsImage ? { src: draft.src, alt: draft.alt } : {}),
        ...(selectedIsLink ? { href: draft.href } : {}),
        ...(Object.keys(draft.style).length ? { style: draft.style } : {}),
      };
      await savePageOverride(selectedKey, override);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر حفظ تعديلات الصفحة.');
    } finally {
      setIsSaving(false);
    }
  };

  const moveSelected = async (direction: -1 | 1) => {
    if (!selectedElement?.parentElement) return;
    const parent = selectedElement.parentElement;
    const children = Array.from(parent.children);
    const currentIndex = children.indexOf(selectedElement);
    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= children.length) return;
    [children[currentIndex], children[nextIndex]] = [children[nextIndex], children[currentIndex]];

    setIsSaving(true);
    setError('');
    try {
      if (selectedElement.tagName === 'SECTION' && !['flex', 'inline-flex', 'grid', 'inline-grid'].includes(getComputedStyle(parent).display)) {
        const parentKey = getElementKey(parent);
        if (parentKey) {
          const existingParent = pageOverrides[parentKey] ?? {};
          await savePageOverride(parentKey, {
            ...existingParent,
            style: { ...existingParent.style, display: 'flex', flexDirection: 'column' },
          });
        }
      }

      for (const [order, child] of children.entries()) {
        const key = getElementKey(child);
        if (!key) continue;
        const existing = pageOverrides[key] ?? {};
        await savePageOverride(key, { ...existing, order });
      }
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر تغيير ترتيب الأقسام.');
    } finally {
      setIsSaving(false);
    }
  };

  const addSocialLink = () => {
    const url = newUrl.trim();
    if (!url) {
      setError('أدخل رابط المنصة أولاً.');
      return;
    }
    setSocialDraft((current) => [...current, {
      id: crypto.randomUUID(),
      platform: newPlatform,
      url,
    }]);
    setNewUrl('');
    setError('');
  };

  const handleSaveSocialLinks = async () => {
    setIsSaving(true);
    setError('');
    setSaved(false);
    try {
      await saveSocialLinks(socialDraft);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'تعذر حفظ روابط التواصل.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <style>{`
        body.site-content-picking #root { cursor: crosshair; }
        body.site-content-picking #root * { cursor: crosshair !important; }
        [data-site-editor-selected="true"] { outline: 2px solid #38bdf8 !important; outline-offset: 3px !important; }
      `}</style>
      <div
        data-site-editor-ui
        className={`fixed bottom-5 z-[10000] ${isRTL ? 'left-5' : 'right-5'}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {!isOpen ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-sky-400/40 bg-slate-950/95 px-4 py-3 text-sm font-semibold text-white shadow-2xl shadow-black/50 hover:bg-slate-900"
          >
            <Settings className="h-5 w-5 text-sky-300" />
            لوحة تحرير الموقع
          </button>
        ) : (
          <section className="flex max-h-[82vh] w-[min(92vw,400px)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#080d18]/[.98] text-white shadow-2xl shadow-black/60 backdrop-blur-xl">
            <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <h2 className="font-semibold">لوحة تحرير الموقع</h2>
                <p className="mt-1 text-xs text-gray-400" dir="ltr">{pathname}</p>
                <Link
                  to="/cms/articles"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-sky-300 hover:text-sky-200"
                >
                  إدارة المقالات
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsPicking(false);
                  setSelectedElement(null);
                  setSelectedKey(null);
                  setDraft(null);
                }}
                aria-label="إغلاق لوحة التحرير"
                className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="grid grid-cols-2 gap-2 border-b border-white/10 p-3">
              <button
                type="button"
                onClick={() => setActiveTab('element')}
                className={`rounded-lg px-3 py-2 text-sm ${activeTab === 'element' ? 'bg-sky-500/20 text-sky-200' : 'text-gray-400 hover:bg-white/5'}`}
              >
                تحرير الصفحة
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('social'); setIsPicking(false); }}
                className={`rounded-lg px-3 py-2 text-sm ${activeTab === 'social' ? 'bg-sky-500/20 text-sky-200' : 'text-gray-400 hover:bg-white/5'}`}
              >
                التواصل الاجتماعي
              </button>
            </div>

            <div className="overflow-y-auto p-4">
              {isSiteContentLoading && (
                <div className="mb-3 flex items-center gap-2 text-xs text-gray-400">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  جارٍ تحميل المحتوى المحفوظ
                </div>
              )}
              {siteContentError && (
                <p role="alert" className="mb-3 rounded-lg bg-red-500/10 p-3 text-sm text-red-200">
                  فشل تحميل المحتوى من Firebase: {siteContentError}
                </p>
              )}

              {activeTab === 'element' ? (
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => { setIsPicking((current) => !current); setError(''); }}
                    className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium ${isPicking ? 'bg-amber-500/20 text-amber-200' : 'bg-sky-600 text-white hover:bg-sky-500'}`}
                  >
                    {isPicking ? <X className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {isPicking ? 'إيقاف تحديد العناصر' : 'اختر عنصرًا من الصفحة'}
                  </button>
                  {isPicking && <p className="text-xs leading-5 text-sky-100">انقر على النص أو الصورة أو الرابط الذي تريد تعديله.</p>}

                  {selectedElement && draft ? (
                    <div className="space-y-4 border-t border-white/10 pt-4">
                      <p className="text-xs text-gray-400">العنصر المحدد: <span className="font-mono text-sky-200">{selectedElement.tagName.toLowerCase()}</span></p>

                      {draft.textNodes.map((text, index) => (
                        <label key={`${selectedKey}-text-${index}`} className="block space-y-1.5 text-xs text-gray-300">
                          <span>النص {draft.textNodes.length > 1 ? index + 1 : ''}</span>
                          <textarea
                            rows={2}
                            value={text}
                            onChange={(event) => setDraft((current) => current
                              ? { ...current, textNodes: current.textNodes.map((value, itemIndex) => itemIndex === index ? event.target.value : value) }
                              : current)}
                            className={inputClass}
                          />
                        </label>
                      ))}

                      {selectedIsImage && (
                        <>
                          <label className="block space-y-1.5 text-xs text-gray-300">
                            <span className="flex items-center gap-2"><Image className="h-4 w-4" /> رابط الصورة</span>
                            <input value={draft.src} onChange={(event) => setDraft((current) => current ? { ...current, src: event.target.value } : current)} className={inputClass} dir="ltr" />
                          </label>
                          <label className="block space-y-1.5 text-xs text-gray-300">
                            <span>النص البديل للصورة</span>
                            <input value={draft.alt} onChange={(event) => setDraft((current) => current ? { ...current, alt: event.target.value } : current)} className={inputClass} />
                          </label>
                        </>
                      )}

                      {selectedIsLink && (
                        <label className="block space-y-1.5 text-xs text-gray-300">
                          <span className="flex items-center gap-2"><LinkIcon className="h-4 w-4" /> وجهة الرابط</span>
                          <input value={draft.href} onChange={(event) => setDraft((current) => current ? { ...current, href: event.target.value } : current)} className={inputClass} dir="ltr" />
                        </label>
                      )}

                      <div className="space-y-3 rounded-xl border border-white/10 bg-white/[.03] p-3">
                        <p className="text-sm font-medium">المظهر</p>
                        <label className="block space-y-1.5 text-xs text-gray-300">
                          <span>لون النص (CSS)</span>
                          <input value={draft.style.color ?? ''} onChange={(event) => updateStyle('color', event.target.value)} placeholder="#ffffff" className={inputClass} dir="ltr" />
                        </label>
                        <label className="block space-y-1.5 text-xs text-gray-300">
                          <span>لون الخلفية (CSS)</span>
                          <input value={draft.style.backgroundColor ?? ''} onChange={(event) => updateStyle('backgroundColor', event.target.value)} placeholder="transparent" className={inputClass} dir="ltr" />
                        </label>
                        <label className="block space-y-1.5 text-xs text-gray-300">
                          <span>رابط صورة الخلفية (اختياري)</span>
                          <input value={draft.style.backgroundImage ?? ''} onChange={(event) => updateStyle('backgroundImage', event.target.value)} placeholder="https://..." className={inputClass} dir="ltr" />
                        </label>
                        <label className="block space-y-1.5 text-xs text-gray-300">
                          <span>حجم النص</span>
                          <select value={draft.style.fontSize ?? ''} onChange={(event) => updateStyle('fontSize', event.target.value)} className={inputClass}>
                            <option value="">افتراضي</option>
                            {['12px', '14px', '16px', '18px', '20px', '24px', '32px', '40px', '48px'].map((size) => <option key={size}>{size}</option>)}
                          </select>
                        </label>
                        <label className="block space-y-1.5 text-xs text-gray-300">
                          <span>سماكة النص</span>
                          <select value={draft.style.fontWeight ?? ''} onChange={(event) => updateStyle('fontWeight', event.target.value)} className={inputClass}>
                            <option value="">افتراضي</option>
                            {['400', '500', '600', '700', '800'].map((weight) => <option key={weight} value={weight}>{weight}</option>)}
                          </select>
                        </label>
                        <label className="block space-y-1.5 text-xs text-gray-300">
                          <span>محاذاة النص</span>
                          <select value={draft.style.textAlign ?? ''} onChange={(event) => updateStyle('textAlign', event.target.value)} className={inputClass}>
                            <option value="">افتراضي</option>
                            <option value="left">يسار</option>
                            <option value="center">وسط</option>
                            <option value="right">يمين</option>
                          </select>
                        </label>
                      </div>

                      {canReorder && (
                        <div className="flex items-center justify-between rounded-xl border border-white/10 p-3">
                          <span className="text-sm text-gray-300">ترتيب العنصر أو القسم</span>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => { void moveSelected(-1); }} className="rounded-lg bg-white/10 p-2 hover:bg-white/20" aria-label="تحريك لأعلى"><ChevronUp className="h-4 w-4" /></button>
                            <button type="button" onClick={() => { void moveSelected(1); }} className="rounded-lg bg-white/10 p-2 hover:bg-white/20" aria-label="تحريك لأسفل"><ChevronDown className="h-4 w-4" /></button>
                          </div>
                        </div>
                      )}

                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => { void handleSaveElement(); }}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                      >
                        {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                        {saved ? 'تم الحفظ' : 'حفظ التعديلات'}
                      </button>
                    </div>
                  ) : (
                    <p className="text-center text-sm leading-6 text-gray-400">حدد عنصرًا من الصفحة لتعديل نصه أو صورته أو رابطه ومظهره.</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm leading-6 text-gray-400">تظهر هذه المنصات بأيقوناتها الرسمية في تذييل الموقع على جميع الصفحات.</p>
                  {socialDraft.map((link) => {
                    const platform = socialPlatforms.find((item) => item.value === link.platform);
                    return (
                      <div key={link.id} className="flex items-center gap-2 rounded-xl border border-white/10 p-3">
                        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-sky-200" aria-hidden="true">
                          <path fill="currentColor" d={platform?.icon ?? ''} />
                        </svg>
                        <span className="w-20 shrink-0 text-xs">{platform?.label ?? link.platform}</span>
                        <input
                          value={link.url}
                          onChange={(event) => setSocialDraft((current) => current.map((item) => item.id === link.id ? { ...item, url: event.target.value } : item))}
                          className={`${inputClass} min-w-0`}
                          dir="ltr"
                        />
                        <button
                          type="button"
                          onClick={() => setSocialDraft((current) => current.filter((item) => item.id !== link.id))}
                          className="rounded-lg p-2 text-red-300 hover:bg-red-500/10"
                          aria-label={`حذف ${platform?.label ?? link.platform}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}

                  <div className="space-y-2 rounded-xl border border-dashed border-white/15 p-3">
                    <p className="text-sm font-medium">إضافة منصة</p>
                    <select value={newPlatform} onChange={(event) => setNewPlatform(event.target.value as SocialPlatform)} className={inputClass}>
                      {socialPlatforms.map((platform) => <option key={platform.value} value={platform.value}>{platform.label}</option>)}
                    </select>
                    <div className="flex gap-2">
                      <input value={newUrl} onChange={(event) => setNewUrl(event.target.value)} placeholder="https://..." className={`${inputClass} min-w-0`} dir="ltr" />
                      <button type="button" onClick={addSocialLink} className="rounded-lg bg-sky-600 px-3 text-white hover:bg-sky-500" aria-label="إضافة رابط">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => { void handleSaveSocialLinks(); }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                  >
                    {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                    {saved ? 'تم الحفظ' : 'حفظ روابط التواصل'}
                  </button>
                </div>
              )}

              {error && <p role="alert" className="mt-3 rounded-lg bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
            </div>

            <footer className="flex items-center gap-2 border-t border-white/10 px-4 py-3 text-xs text-gray-500">
              <ExternalLink className="h-3.5 w-3.5" />
              التغييرات المحفوظة تظهر لجميع زوار الموقع
            </footer>
          </section>
        )}
      </div>
    </>
  );
};

export default SiteVisualEditor;

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';
import { firebaseAuth, firestore } from '../config/firebase';
import { isSiteEditorAccount } from '../config/siteEditor';
import type { SiteNodeOverride, SocialLink, SiteStyleOverride } from '../types/siteContent';

const GLOBAL_CONTENT_ID = 'global';
const EMPTY_OVERRIDES: Record<string, SiteNodeOverride> = {};

interface SiteContentContextValue {
  pageOverrides: Record<string, SiteNodeOverride>;
  socialLinks: SocialLink[];
  isSiteEditor: boolean;
  isSiteContentLoading: boolean;
  siteContentError: string | null;
  savePageOverride: (nodeKey: string, override: SiteNodeOverride) => Promise<void>;
  saveSocialLinks: (links: SocialLink[]) => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextValue | undefined>(undefined);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isSafeAssetUrl = (value: string): boolean =>
  validateExternalUrl(value) || (value.startsWith('/') && !value.startsWith('//'));

const isSafeLinkUrl = (value: string): boolean =>
  isSafeAssetUrl(value)
  || value.startsWith('#')
  || value.startsWith('mailto:')
  || value.startsWith('tel:');

const parseStyle = (value: unknown): SiteStyleOverride | undefined => {
  if (!isRecord(value)) return undefined;
  const style: SiteStyleOverride = {};
  if (typeof value.color === 'string') style.color = value.color;
  if (typeof value.backgroundColor === 'string') style.backgroundColor = value.backgroundColor;
  if (typeof value.backgroundImage === 'string' && isSafeAssetUrl(value.backgroundImage)) {
    style.backgroundImage = value.backgroundImage;
  }
  if (typeof value.fontSize === 'string') style.fontSize = value.fontSize;
  if (typeof value.fontWeight === 'string') style.fontWeight = value.fontWeight;
  if (value.textAlign === 'left' || value.textAlign === 'center' || value.textAlign === 'right') {
    style.textAlign = value.textAlign;
  }
  if (value.display === 'flex') style.display = 'flex';
  if (value.flexDirection === 'column') style.flexDirection = 'column';
  return style;
};

const parseOverride = (value: unknown): SiteNodeOverride | undefined => {
  if (!isRecord(value)) return undefined;
  const override: SiteNodeOverride = {};
  if (Array.isArray(value.textNodes) && value.textNodes.every((item) => typeof item === 'string')) {
    override.textNodes = value.textNodes;
  }
  if (typeof value.src === 'string' && isSafeAssetUrl(value.src)) override.src = value.src;
  if (typeof value.alt === 'string') override.alt = value.alt;
  if (typeof value.href === 'string' && isSafeLinkUrl(value.href)) override.href = value.href;
  const style = parseStyle(value.style);
  if (style) override.style = style;
  if (typeof value.order === 'number' && Number.isFinite(value.order)) override.order = value.order;
  return override;
};

const parsePageOverrides = (value: unknown): Record<string, SiteNodeOverride> => {
  if (!isRecord(value)) return EMPTY_OVERRIDES;
  return Object.fromEntries(
    Object.entries(value)
      .map(([key, override]) => [key, parseOverride(override)] as const)
      .filter((entry): entry is readonly [string, SiteNodeOverride] => entry[1] !== undefined),
  );
};

const parseSocialLinks = (value: unknown): SocialLink[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is SocialLink => {
    if (!isRecord(item)) return false;
    return typeof item.id === 'string'
      && typeof item.url === 'string'
      && validateExternalUrl(item.url)
      && typeof item.platform === 'string'
      && ['github', 'facebook', 'x', 'instagram', 'whatsapp', 'youtube', 'tiktok'].includes(item.platform);
  });
};

const validateExternalUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
};

export const SiteContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const pageId = encodeURIComponent(location.pathname);
  const [authUid, setAuthUid] = useState<string | null>(null);
  const [pageOverrides, setPageOverrides] = useState<Record<string, SiteNodeOverride>>(EMPTY_OVERRIDES);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);
  const [pageContentError, setPageContentError] = useState<string | null>(null);
  const [globalContentError, setGlobalContentError] = useState<string | null>(null);

  useEffect(() => onAuthStateChanged(firebaseAuth, (user) => {
    setAuthUid(user?.uid ?? null);
  }), []);

  useEffect(() => {
    setIsPageLoading(true);
    const pageRef = doc(firestore, 'siteContent', pageId);
    return onSnapshot(pageRef, (snapshot) => {
      setPageOverrides(snapshot.exists() ? parsePageOverrides(snapshot.data().overrides) : EMPTY_OVERRIDES);
      setPageContentError(null);
      setIsPageLoading(false);
    }, (error) => {
      console.error('Unable to load public page content:', error);
      setPageContentError(error.message);
      setIsPageLoading(false);
    });
  }, [pageId]);

  useEffect(() => {
    const globalRef = doc(firestore, 'siteContent', GLOBAL_CONTENT_ID);
    return onSnapshot(globalRef, (snapshot) => {
      setSocialLinks(snapshot.exists() ? parseSocialLinks(snapshot.data().socialLinks) : []);
      setGlobalContentError(null);
      setIsGlobalLoading(false);
    }, (error) => {
      console.error('Unable to load global site content:', error);
      setGlobalContentError(error.message);
      setIsGlobalLoading(false);
    });
  }, []);

  const savePageOverride = useCallback(async (nodeKey: string, override: SiteNodeOverride) => {
    if (!authUid || !isSiteEditorAccount(authUid)) {
      throw new Error('ليس لديك صلاحية تعديل محتوى الموقع.');
    }
    if (!/^[0-9_]+$/.test(nodeKey)) {
      throw new Error('تعذر التحقق من العنصر المحدد.');
    }
    if (override.src && !isSafeAssetUrl(override.src)) {
      throw new Error('يجب أن يكون مصدر الصورة رابطًا صالحًا أو مسارًا محليًا.');
    }
    if (override.style?.backgroundImage && !isSafeAssetUrl(override.style.backgroundImage)) {
      throw new Error('يجب أن يكون رابط الخلفية صالحًا أو مسارًا محليًا.');
    }
    if (override.href && !isSafeLinkUrl(override.href)) {
      throw new Error('يجب أن يكون الرابط صالحًا ويبدأ بـ http أو https.');
    }
    const pageRef = doc(firestore, 'siteContent', pageId);
    await setDoc(pageRef, { overrides: { [nodeKey]: override } }, { merge: true });
  }, [authUid, pageId]);

  const saveSocialLinks = useCallback(async (links: SocialLink[]) => {
    if (!authUid || !isSiteEditorAccount(authUid)) {
      throw new Error('ليس لديك صلاحية تعديل محتوى الموقع.');
    }
    if (links.some((link) => !validateExternalUrl(link.url))) {
      throw new Error('يجب أن تكون روابط التواصل صالحة وتبدأ بـ http أو https.');
    }
    await setDoc(doc(firestore, 'siteContent', GLOBAL_CONTENT_ID), { socialLinks: links }, { merge: true });
  }, [authUid]);

  const value = useMemo<SiteContentContextValue>(() => ({
    pageOverrides,
    socialLinks,
    isSiteEditor: Boolean(authUid && isSiteEditorAccount(authUid)),
    isSiteContentLoading: isPageLoading || isGlobalLoading,
    siteContentError: pageContentError ?? globalContentError,
    savePageOverride,
    saveSocialLinks,
  }), [
    authUid,
    isGlobalLoading,
    isPageLoading,
    pageOverrides,
    pageContentError,
    savePageOverride,
    saveSocialLinks,
    globalContentError,
    socialLinks,
  ]);

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
};

export const useSiteContent = (): SiteContentContextValue => {
  const context = useContext(SiteContentContext);
  if (!context) throw new Error('useSiteContent must be used within a SiteContentProvider');
  return context;
};

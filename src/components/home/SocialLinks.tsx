import React from 'react';
import { siFacebook, siGithub, siInstagram, siTiktok, siWhatsapp, siX, siYoutube } from 'simple-icons';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteContent } from '../../context/SiteContentContext';
import type { SocialPlatform } from '../../types/siteContent';

const socialIcons = {
  github: siGithub,
  facebook: siFacebook,
  x: siX,
  instagram: siInstagram,
  whatsapp: siWhatsapp,
  youtube: siYoutube,
  tiktok: siTiktok,
} satisfies Record<SocialPlatform, typeof siGithub>;

const platformNames: Record<SocialPlatform, { en: string; ar: string }> = {
  github: { en: 'GitHub', ar: 'جيت هب' },
  facebook: { en: 'Facebook', ar: 'فيسبوك' },
  x: { en: 'X', ar: 'إكس' },
  instagram: { en: 'Instagram', ar: 'إنستغرام' },
  whatsapp: { en: 'WhatsApp', ar: 'واتساب' },
  youtube: { en: 'YouTube', ar: 'يوتيوب' },
  tiktok: { en: 'TikTok', ar: 'تيك توك' },
};

const SocialLinks: React.FC = () => {
  const { socialLinks } = useSiteContent();
  const { language } = useLanguage();

  if (!socialLinks.length) return null;

  return (
    <nav aria-label={language === 'ar' ? 'حسابات التواصل الاجتماعي' : 'Social media'}>
      <ul className="flex flex-wrap items-center gap-3">
        {socialLinks.map((link) => {
          const icon = socialIcons[link.platform];
          return (
            <li key={link.id}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={platformNames[link.platform][language === 'ar' ? 'ar' : 'en']}
                title={platformNames[link.platform][language === 'ar' ? 'ar' : 'en']}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path fill="currentColor" d={icon.path} />
                </svg>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SocialLinks;

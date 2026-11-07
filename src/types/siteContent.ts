export type SocialPlatform =
  | 'github'
  | 'facebook'
  | 'x'
  | 'instagram'
  | 'whatsapp'
  | 'youtube'
  | 'tiktok';

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
}

export interface SiteStyleOverride {
  color?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  display?: 'flex';
  flexDirection?: 'column';
}

export interface SiteNodeOverride {
  textNodes?: string[];
  src?: string;
  alt?: string;
  href?: string;
  style?: SiteStyleOverride;
  order?: number;
}

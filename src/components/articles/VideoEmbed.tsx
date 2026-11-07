import React from 'react';

interface VideoEmbedSource {
  provider: 'YouTube' | 'Facebook' | 'TikTok';
  src: string;
}

export const getVideoEmbedSource = (rawUrl: string): VideoEmbedSource | null => {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;

  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  const pathSegments = url.pathname.split('/').filter(Boolean);

  if (['youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtube-nocookie.com', 'youtu.be'].includes(host)) {
    const videoId = host === 'youtu.be'
      ? pathSegments[0]
      : url.searchParams.get('v')
        || (['embed', 'shorts', 'live', 'v'].includes(pathSegments[0] ?? '') ? pathSegments[1] : undefined);
    if (!videoId || !/^[\w-]{11}$/.test(videoId)) return null;
    return {
      provider: 'YouTube',
      src: `https://www.youtube-nocookie.com/embed/${videoId}`,
    };
  }

  if (['facebook.com', 'm.facebook.com', 'fb.watch'].includes(host)) {
    const canonicalUrl = new URL(url);
    canonicalUrl.hash = '';
    canonicalUrl.searchParams.delete('fbclid');
    const isFacebookVideo = (
      host === 'fb.watch'
      || (pathSegments[0] === 'watch' && url.searchParams.has('v'))
      || ['videos', 'reel', 'reels', 'video.php'].includes(pathSegments[0] ?? '')
    );
    if (!isFacebookVideo) return null;
    return {
      provider: 'Facebook',
      src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(canonicalUrl.toString())}&show_text=false`,
    };
  }

  if (host === 'tiktok.com') {
    const videoId = pathSegments.at(-1);
    if (pathSegments.length < 3 || !/^\d{8,25}$/.test(videoId ?? '')) return null;
    return {
      provider: 'TikTok',
      src: `https://www.tiktok.com/player/v1/${videoId}`,
    };
  }

  return null;
};

const VideoEmbed: React.FC<{ url: string; caption?: string }> = ({ url, caption }) => {
  const source = getVideoEmbedSource(url);
  if (!source) {
    let safeUrl: string | null = null;
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:') {
        safeUrl = parsedUrl.toString();
      }
    } catch {
      safeUrl = null;
    }

    if (!safeUrl) {
      return caption ? <p className="my-4 text-sm text-gray-500">{caption}</p> : null;
    }

    return (
      <a
        href={safeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 underline underline-offset-4"
      >
        {caption || safeUrl}
      </a>
    );
  }

  return (
    <figure className="my-8">
      <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
        <iframe
          src={source.src}
          title={`${source.provider} video player`}
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      {caption && <figcaption className="mt-3 text-center text-sm text-gray-500">{caption}</figcaption>}
    </figure>
  );
};

export default VideoEmbed;

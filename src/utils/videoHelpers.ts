export type ParsedVideoSource =
  | {kind: 'youtube'; embedUrl: string; originalUrl: string}
  | {kind: 'direct'; srcUrl: string; originalUrl: string}
  | {kind: 'external'; href: string}
  | null;

export function parseCustomVideoUrl(rawUrl?: string | null): ParsedVideoSource {
  if (!rawUrl) return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    return null;
  }

  const host = url.hostname.toLowerCase().replace(/^www\./, '');

  // YouTube formats: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, youtube.com/embed/ID
  let youtubeId: string | null = null;
  if (host === 'youtu.be') {
    youtubeId = url.pathname.split('/').filter(Boolean)[0] ?? null;
  } else if (
    host === 'youtube.com' ||
    host === 'm.youtube.com' ||
    host === 'youtube-nocookie.com'
  ) {
    if (url.pathname === '/watch') {
      youtubeId = url.searchParams.get('v');
    } else if (
      url.pathname.startsWith('/shorts/') ||
      url.pathname.startsWith('/embed/')
    ) {
      youtubeId = url.pathname.split('/').filter(Boolean)[1] ?? null;
    }
  }

  if (youtubeId && /^[a-zA-Z0-9_-]{6,20}$/.test(youtubeId)) {
    return {
      kind: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&loop=1&playlist=${youtubeId}`,
      originalUrl: trimmed,
    };
  }

  const lowerPath = url.pathname.toLowerCase();
  if (
    lowerPath.endsWith('.mp4') ||
    lowerPath.endsWith('.webm') ||
    lowerPath.endsWith('.mov') ||
    lowerPath.endsWith('.m4v')
  ) {
    return {
      kind: 'direct',
      srcUrl: trimmed,
      originalUrl: trimmed,
    };
  }

  return {
    kind: 'external',
    href: trimmed,
  };
}

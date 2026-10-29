import type { Lang } from '../i18n/ui';

/**
 * Videos servidos desde el propio sitio (public/video/), sin YouTube.
 * Se generan con el proyecto de Remotion de video/<caso>/ y no llevan audio.
 */
export const videos: Record<string, Record<Lang, { src: string; poster: string; duration: string }>> = {
  mcp: {
    es: { src: '/video/osaka-es.mp4', poster: '/video/osaka-poster-es.jpg', duration: '52 s' },
    en: { src: '/video/osaka-en.mp4', poster: '/video/osaka-poster-en.jpg', duration: '52 s' },
  },
};

import type { Lang } from '../i18n/ui';

/**
 * Videos servidos desde el propio sitio (public/video/), sin YouTube.
 * Se generan con el proyecto de Remotion de video/<caso>/ y no llevan audio.
 */
export const videos: Record<string, Record<Lang, { src: string; poster: string; duration: string; transcript: string[] }>> = {
  mcp: {
    es: { src: '/video/osaka-es.mp4', poster: '/video/osaka-poster-es.jpg', duration: '52 s', transcript: [
      '«¿Cómo les fue a mis campañas la semana pasada?» La respuesta estaba repartida en seis plataformas: había que abrir cada una y cruzar los datos a mano, o pedir un reporte y esperar.',
      'Con Osaka, la pregunta se escribe una vez. Se eligen modelo, agente y cuentas, y responde con una tabla de inversión y ritmo por plataforma, más una sugerencia: «Tú decides». Los datos son ficticios, de KUBO, una marca demo. También funciona dentro de Claude.ai.',
      'Resultado: 47 usuarios activos, 17.6 M de tokens solo en la app web y 484 conversaciones reales revisadas para medir la calidad. Fuente: panel de administración de Osaka, octubre de 2026.',
    ] },
    en: { src: '/video/osaka-en.mp4', poster: '/video/osaka-poster-en.jpg', duration: '52 s', transcript: [
      '“How did my campaigns do last week?” The answer was spread across six platforms: you had to open each one and cross the data by hand, or ask for a report and wait.',
      'With Osaka, you ask the question once. You pick a model, an agent and accounts, and it answers with a table of spend and pace per platform, plus a suggestion: “You decide”. The data is fictional, from KUBO, a demo brand. It also works inside Claude.ai.',
      'Result: 47 active users, 17.6M tokens in the web app alone and 484 real conversations reviewed to measure quality. Source: Osaka admin dashboard, October 2026.',
    ] },
  },
};

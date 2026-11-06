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
  dash: {
    es: { src: '/video/hopper-es.mp4', poster: '/video/hopper-poster-es.jpg', duration: '52 s', transcript: [
      'Cada bug era una llamada. Cada dato que no cuadraba contra plataforma, una reunión. Y el tiempo de programar se iba en reuniones. La semana que se muestra es ilustrativa.',
      'Ahora se reporta desde el mismo dashboard y el contexto se captura solo. La IA hace el triage y solo pregunta lo necesario. La IA ubica el dato; el número lo lee el código, nunca el modelo. La prioridad la calcula una rúbrica, no quien reporta. Sin llamada: llega clasificado y listo para el fix. Los datos son ficticios, de KUBO, una marca demo.',
      'Resultado: 149 reportes de 9 personas (fuente: panel de Hopper, noviembre de 2026) y 14 de 16 notas reales clasificadas igual que yo en la primera prueba; las otras 2 eran ambiguas. La IA hace el triage y la clasificación. A mí me queda el fix.',
    ] },
    en: { src: '/video/hopper-en.mp4', poster: '/video/hopper-poster-en.jpg', duration: '52 s', transcript: [
      'Every bug meant a call. Every number that didn’t match the platform, a meeting. And my coding time went to meetings. The week shown is illustrative.',
      'Now you report from the dashboard itself and the context is captured for you. AI does the triage and asks only what’s needed. AI locates the figure; code reads the number, never the model. A rubric sets the priority, not the person reporting. No call: it arrives classified and ready for the fix. The data is fictional, from KUBO, a demo brand.',
      'Result: 149 reports from 9 people (source: Hopper dashboard, November 2026) and 14 of 16 real notes classified the way I would in the first test; the other 2 were ambiguous. AI handles the triage and the classification. I’m left with the fix.',
    ] },
  },
};

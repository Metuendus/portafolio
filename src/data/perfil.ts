import type { Lang } from '../i18n/ui';

/**
 * Lo que no cabe en el CV. También alimenta el corpus del evaluador de encaje, así que aquí solo van
 * hechos confirmados por José Carlos y ningún nombre de cliente, de compañero ni de proyecto de GCP.
 */
export interface Entrada {
  id: string;
  titulo: Record<Lang, string>;
  dato: Record<Lang, string>;
  texto: Record<Lang, string[]>;
}

export interface Seccion {
  id: string;
  titulo: Record<Lang, string>;
  nota?: Record<Lang, string>;
  entradas: Entrada[];
}

export const perfilCopy = {
  es: {
    title: 'Perfil ampliado · José Carlos Corona',
    description: 'Los proyectos que lideré, los RAG que programé y un error que cambió cómo trabajo con agentes.',
    h1: 'Lo que no cabe en el CV',
    intro: 'El CV es una selección. Aquí está el detalle de los proyectos que lideré, los RAG que programé, mis presentaciones con Google y un error que cambió cómo trabajo con agentes. Los clientes no van con nombre.',
    enlace: 'Ver el perfil ampliado',
    volver: 'Volver a Sobre mí',
  },
  en: {
    title: 'Extended profile · José Carlos Corona',
    description: 'The projects I led, the RAG systems I wrote and a mistake that changed how I work with agents.',
    h1: 'What doesn’t fit on the CV',
    intro: 'The CV is a selection. This is the detail behind the projects I led, the RAG systems I wrote, my talks with Google and a mistake that changed how I work with agents. Clients stay unnamed.',
    enlace: 'See the extended profile',
    volver: 'Back to About',
  },
};

export const secciones: Seccion[] = [
  {
    id: 'liderazgo',
    titulo: { es: 'Proyectos que lideré', en: 'Projects I led' },
    entradas: [
      {
        id: 'migracion',
        titulo: { es: 'Migración de Osaka a PassportHub', en: 'Migrating Osaka to PassportHub' },
        dato: { es: 'Equipo de desarrollo de 5 personas, conmigo', en: 'Development team of 5, including me' },
        texto: {
          es: ['Osaka pasó a ser un módulo dentro de PassportHub. Lideré la migración con todo el equipo de desarrollo y la coordiné de punta a punta. La plataforma PassportHub la lideró el gerente de Desarrollo.'],
          en: ['Osaka became a module inside PassportHub. I led the migration with the whole development team and coordinated it end to end. The PassportHub platform itself was led by the head of Development.'],
        },
      },
      {
        id: 'consultoria',
        titulo: { es: 'Consultoría para un cliente regional', en: 'Consulting project for a regional client' },
        dato: { es: 'Equipo de varias áreas: 2 de CRO, 1 de medición y la dirección general', en: 'Cross-functional team: 2 from CRO, 1 from measurement and the CEO’s office' },
        texto: {
          es: ['Lideré un equipo de varias áreas en una consultoría que la agencia le vendió a un cliente regional.'],
          en: ['I led a cross-functional team on a consulting project the agency sold to a regional client.'],
        },
      },
      {
        id: 'investigacion',
        titulo: { es: 'La investigación que terminó en Osaka', en: 'The research that became Osaka' },
        dato: { es: 'Equipo de varias áreas', en: 'Cross-functional team' },
        texto: {
          es: ['Lideré la investigación original del servidor MCP que hoy es Osaka, con personas de distintas áreas de datos. Después programé solo la primera versión, en 2025.'],
          en: ['I led the original research on the MCP server that is now Osaka, with people from different data teams. I then wrote the first version by myself, in 2025.'],
        },
      },
    ],
  },
  {
    id: 'rag',
    titulo: { es: 'RAG que programé', en: 'RAG systems I wrote' },
    nota: { es: 'Einstein también usa RAG, pero ahí fui product owner: el código lo escribió otra persona.', en: 'Einstein uses RAG too, but there I was product owner: someone else wrote the code.' },
    entradas: [
      {
        id: 'geo',
        titulo: { es: 'Demo en vivo de GEO', en: 'Live GEO demo' },
        dato: { es: '10 de marzo de 2026 · 30 personas · Next.js, Gemini, Cloud Run', en: 'March 10, 2026 · 30 people · Next.js, Gemini, Cloud Run' },
        texto: {
          es: ['La programé de punta a punta para explicar GEO en Google Señales, con KUBO, una marca demo, como ejemplo. El RAG es propio: embeddings y búsqueda por similitud, y sus respuestas entregaban citas. Cada persona participaba desde su celular y comparaba las respuestas sin contexto y con contexto.'],
          en: ['I wrote it end to end to explain GEO at Google Señales, using KUBO, a demo brand, as the example. The RAG is my own: embeddings and similarity search, and its answers came with citations. Each person joined from their phone and compared the answers with and without context.'],
        },
      },
      {
        id: 'doppel',
        titulo: { es: 'El RAG de Doppel', en: 'Doppel’s RAG' },
        dato: { es: 'Proyecto propio · implementado y funcional', en: 'Personal project · implemented and working' },
        texto: {
          es: ['Doppel es un agente de voz que entra a Google Meet con mi voz. Su RAG está hecho para hablar en vivo: suma una fracción mínima de tiempo a la respuesta y cita documentos sobre mi trabajo.'],
          en: ['Doppel is a voice agent that joins Google Meet with my voice. Its RAG is made for live speech: it adds a tiny fraction of time to the response and cites documents about my work.'],
        },
      },
    ],
  },
  {
    id: 'presentaciones',
    titulo: { es: 'Presentaciones con Google', en: 'Talks with Google' },
    entradas: [
      {
        id: 'senales',
        titulo: { es: 'Google Señales', en: 'Google Señales' },
        dato: { es: 'Varias presentaciones', en: 'Several talks' },
        texto: {
          es: ['He presentado varias veces en Google para el evento Señales. Una de esas presentaciones fue la demo de GEO de esta página.'],
          en: ['I’ve presented several times at Google for the Señales event. One of those talks was the GEO demo on this page.'],
        },
      },
      {
        id: 'growth-stack',
        titulo: { es: 'Growth Stack Sessions', en: 'Growth Stack Sessions' },
        dato: { es: 'EPA con Google · clientes y aliados', en: 'EPA with Google · clients and partners' },
        texto: {
          es: ['Fui uno de los presentadores de esta sesión sobre cómo conectar datos, decisiones y crecimiento desde medición, desarrollo, CRO/UX y análisis.'],
          en: ['I was one of the presenters at this session on connecting data, decisions and growth through measurement, development, CRO/UX and analysis.'],
        },
      },
    ],
  },
  {
    id: 'error',
    titulo: { es: 'El error que me enseñó a poner barreras', en: 'The mistake that taught me to set guardrails' },
    entradas: [
      {
        id: 'firestore',
        titulo: { es: 'Claude Code sobreescribió una colección de Firestore', en: 'Claude Code overwrote a Firestore collection' },
        dato: { es: 'Durante la demo de GEO, 2026', en: 'While building the GEO demo, 2026' },
        texto: {
          es: [
            'Trabajaba la demo en el mismo proyecto de Google Cloud donde la agencia tiene su infraestructura de producción. Claude Code se confundió y sobreescribió una colección de Firestore. Cuando me di cuenta ya era tarde, y no tenía respaldo.',
            'La reconstruí a partir de otros documentos que encontré y coordiné con los equipos de cuentas y operaciones para que recuperaran el acceso.',
            'Aprendí que a un agente hay que ponerle barreras antes de necesitarlas. Por eso creé los plugins de Claude Code de la agencia, que incluyen hooks de protección para que no se repita.',
          ],
          en: [
            'I was building the demo in the same Google Cloud project that holds the agency’s production infrastructure. Claude Code got confused and overwrote a Firestore collection. By the time I noticed it was too late, and I had no backup.',
            'I rebuilt it from other documents I found and coordinated with the account and operations teams so they got their access back.',
            'I learned that an agent needs guardrails before you need them. That’s why I created the agency’s Claude Code plugins, which include protective hooks so it doesn’t happen again.',
          ],
        },
      },
    ],
  },
];

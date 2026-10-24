import type { Lang } from '../i18n/ui';
import { cases, type Status } from './cases';

export type Front = 'epa' | 'own' | 'data' | 'teach' | 'lab';

export const fronts: { id: Front; name: Record<Lang, string>; blurb: Record<Lang, string> }[] = [
  { id: 'epa', name: { es: 'Trabajo en EPA', en: 'Work at EPA' }, blurb: { es: 'IA aplicada en una agencia de ~190 personas: adopción, criterio y datos.', en: 'Applied AI at a ~190-person agency: adoption, judgment and data.' } },
  { id: 'own', name: { es: 'Productos propios', en: 'Own products' }, blurb: { es: 'De cero a producción, con agentes sobre un chasis común.', en: 'From zero to production, with agents on a shared chassis.' } },
  { id: 'data', name: { es: 'Ciencia de datos', en: 'Data science' }, blurb: { es: 'Estadística y modelos antes de que todo fuera LLM.', en: 'Statistics and models before everything was an LLM.' } },
  { id: 'teach', name: { es: 'Enseñar y divulgar', en: 'Teaching and talks' }, blurb: { es: 'Programas, cursos y charlas para que otros construyan.', en: 'Programs, courses and talks so others can build.' } },
  { id: 'lab', name: { es: 'Laboratorio', en: 'Lab' }, blurb: { es: 'Experimentos chicos, cada uno con su lección.', en: 'Small experiments, each with its lesson.' } },
];

export interface Work {
  id: string;
  front: Front;
  year: string;
  status?: Status;
  name: Record<Lang, string>;
  line?: Record<Lang, string>;
}

/** Trabajo que no tiene página de caso (todavía). Los casos con página salen de `cases`. */
export const more: Work[] = [
  { id: 'copy-master', front: 'epa', year: '2024', status: 'prod', name: { es: 'Copy Master', en: 'Copy Master' }, line: { es: 'Add-on de Sheets que redacta anuncios con Claude, Gemini y Llama en Vertex AI; lo usa el equipo desde 2024.', en: 'A Sheets add-on that writes ads with Claude, Gemini and Llama on Vertex AI; the team has used it since 2024.' } },
  { id: 'doppel', front: 'own', year: '2026', status: 'wip', name: { es: 'Doppel', en: 'Doppel' }, line: { es: 'Un agente de voz que entra a mis reuniones de Meet, escucha y responde con contexto.', en: 'A voice agent that joins my Meet calls, listens and answers with context.' } },
  { id: 'mmm', front: 'data', year: '2024', name: { es: 'Mezcla de medios y segmentación de catálogo', en: 'Media mix and catalog segmentation' }, line: { es: 'Modelo de mezcla de medios con Robyn y clusters de producto para Performance Max, con marcas anonimizadas.', en: 'A Robyn media mix model and product clusters for Performance Max, with brands anonymized.' } },
  { id: 'geo-talk', front: 'teach', year: '2026', name: { es: 'Charla de GEO en Google Señales', en: 'GEO talk at Google Señales' }, line: { es: 'Demo en vivo de RAG con Gemini y una tienda ficticia hecha con imágenes de Vertex AI.', en: 'A live Gemini RAG demo and a fictional store built with Vertex AI images.' } },
  { id: 'fluency', front: 'teach', year: '2026', name: { es: 'Programa de AI Fluency y curso «Dashboards con Claude Code»', en: 'AI Fluency program and “Dashboards with Claude Code” course' } },
  { id: 'michilinguo', front: 'lab', year: '2026', name: { es: 'Michilinguo', en: 'Michilinguo' }, line: { es: 'Una app tipo Duolingo, sin conexión, para el viaje de mi pareja a Corea. La hice para una sola persona, y sí la usó.', en: 'An offline Duolingo-style app for my partner’s trip to Korea. Built for one person, who did use it.' } },
  { id: 'text-sql', front: 'lab', year: '2024', status: 'exp', name: { es: 'Agente de texto a SQL con gráficas', en: 'Text-to-SQL agent with charts' }, line: { es: 'LangGraph sobre BigQuery: una pregunta en español, una consulta y una gráfica.', en: 'LangGraph on BigQuery: a question in plain language, a query and a chart.' } },
  { id: 'gutenberg', front: 'lab', year: '2026', name: { es: 'Gutenberg', en: 'Gutenberg' }, line: { es: 'Un reporte mensual en PowerPoint que se arma solo con Apps Script.', en: 'A monthly PowerPoint report that builds itself with Apps Script.' } },
  { id: 'office-rpg', front: 'lab', year: '2026', name: { es: 'Juego de oficina', en: 'Office RPG' }, line: { es: 'Un RPG en Phaser protagonizado por el equipo de Datos.', en: 'A Phaser RPG starring the Data team.' } },
  { id: 'spend', front: 'lab', year: '2025', status: 'exp', name: { es: 'Analizador de gastos con Llama local', en: 'Spend analyzer with local Llama' }, line: { es: 'Categoriza mis gastos sin que los datos salgan de mi computadora.', en: 'Categorizes my spending without the data leaving my computer.' } },
  { id: 'openclaw', front: 'lab', year: '2026', name: { es: 'OpenClaw', en: 'OpenClaw' } },
  { id: 'gauss', front: 'lab', year: '2026', name: { es: 'Gauss', en: 'Gauss' } },
  { id: 'citation', front: 'lab', year: '2026', name: { es: 'GEO y Citation Tracker', en: 'GEO and Citation Tracker' } },
  { id: 'migration', front: 'epa', year: '2026', name: { es: 'Migración de OpenAI a Claude', en: 'Migration from OpenAI to Claude' } },
];

export const caseFront = (org: 'epa' | 'own'): Front => (org === 'epa' ? 'epa' : 'own');

export const countByFront = (f: Front) =>
  cases.filter((c) => caseFront(c.org) === f).length + more.filter((m) => m.front === f).length;

export const examplesByFront = (f: Front, lang: Lang) =>
  [...cases.filter((c) => caseFront(c.org) === f).map((c) => c.name[lang]), ...more.filter((m) => m.front === f).map((m) => m.name[lang])].slice(0, 2);

/** Cifras con fuente para «En números» y la tarjeta de 30 segundos. */
export const numbers: { v: string; l: Record<Lang, string>; source: Record<Lang, string> }[] = [
  { v: '9', l: { es: 'años en marketing digital, de cuentas a IA', en: 'years in digital marketing, from accounts to AI' }, source: { es: 'Trayectoria, desde 2017', en: 'Career, since 2017' } },
  { v: '28', l: { es: 'personas usan el servidor MCP de medios', en: 'people use the media MCP server' }, source: { es: 'LinkedIn, oct 2026', en: 'LinkedIn, Oct 2026' } },
  { v: '14.7M', l: { es: 'tokens procesados por ese servidor', en: 'tokens processed by that server' }, source: { es: 'LinkedIn, oct 2026', en: 'LinkedIn, Oct 2026' } },
  { v: '60', l: { es: 'personas en el pico de uso de la Librería de Prompts', en: 'people at the Prompt Library’s peak' }, source: { es: 'LinkedIn, oct 2026', en: 'LinkedIn, Oct 2026' } },
];

export const timeline: { year: string; t: Record<Lang, string>; mark?: 'origin' | 'now' }[] = [
  { year: '2017', t: { es: 'Ejecutivo de cuentas', en: 'Account executive' } },
  { year: '', t: { es: 'Analista de marketing digital', en: 'Digital marketing analyst' } },
  { year: '', t: { es: 'CRO', en: 'CRO' } },
  { year: '2019', t: { es: 'Analista de datos', en: 'Data analyst' } },
  { year: '2024', t: { es: 'Verne, mi primera herramienta con IA', en: 'Verne, my first AI tool' }, mark: 'origin' },
  { year: '', t: { es: 'IA y automatización en EPA', en: 'AI and automation at EPA' }, mark: 'now' },
];

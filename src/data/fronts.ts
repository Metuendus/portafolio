import type { Lang } from '../i18n/ui';
import { cases, type Status } from './cases';

export type Front = 'epa' | 'own' | 'data' | 'teach' | 'lab';

export const fronts: { id: Front; name: Record<Lang, string>; blurb: Record<Lang, string> }[] = [
  { id: 'epa', name: { es: 'Trabajo en EPA', en: 'Work at EPA' }, blurb: { es: 'Herramientas de IA para los equipos de la agencia, y las reglas y cursos para usarlas.', en: 'AI tools for the agency’s teams, plus the rules and courses to use them.' } },
  { id: 'own', name: { es: 'Productos propios', en: 'Own products' }, blurb: { es: 'Apps que hago después del trabajo, con la IA como núcleo y la app alrededor.', en: 'Apps I build after work, with AI at the core and the app built around it.' } },
  { id: 'data', name: { es: 'Datos y análisis', en: 'Data and analytics' }, blurb: { es: 'Lo que hice como Gerente de Datos de 2020 a 2024: BigQuery, R y muchos reportes.', en: 'My work as Data Manager from 2020 to 2024: BigQuery, R and a lot of reports.' } },
  { id: 'teach', name: { es: 'Enseñar y divulgar', en: 'Teaching and talks' }, blurb: { es: 'Cursos internos y un curso de GEO en la Universidad Panamericana.', en: 'Internal courses and a GEO course at Universidad Panamericana.' } },
  { id: 'lab', name: { es: 'Laboratorio', en: 'Lab' }, blurb: { es: 'Pruebas chicas para aprender algo. Algunas ya las dejé.', en: 'Small tries to learn something. I’ve dropped a few.' } },
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
  // EPA
  { id: 'kalman', front: 'epa', year: '2026', status: 'wip', name: { es: 'Kalman', en: 'Kalman' }, line: { es: 'Reportería IA-first: números deterministas desde el MCP de datos y narrativa con IA que una persona aprueba. Soy lead y desarrollador principal.', en: 'AI-first reporting: deterministic numbers from the data MCP and AI narrative a person approves. I’m the lead and main developer.' } },
  { id: 'sku-coppel', front: 'epa', year: '2026', status: 'prod', name: { es: 'Dashboard y ETL de SKU para Coppel', en: 'SKU dashboard and ETL for Coppel' }, line: { es: 'Co-desarrollado, con CI/CD a Cloud Run. El análisis diario de SKU pasó de un día completo a 30 minutos.', en: 'Co-developed, with CI/CD to Cloud Run. Daily SKU analysis went from a full day to 30 minutes.' } },
  { id: 'plugins', front: 'epa', year: '2026', name: { es: 'Gobierno del vibecoding', en: 'Vibecoding governance' }, line: { es: 'Marketplace de plugins de Claude Code de la agencia: stack cerrado para dashboards, guardrails de seguridad y 35 skills de medios.', en: 'The agency’s Claude Code plugin marketplace: a fixed stack for dashboards, security guardrails and 35 media skills.' } },
  { id: 'revolution', front: 'epa', year: '2025', name: { es: 'Programa de transformación con IA', en: 'AI transformation program' }, line: { es: 'Project lead: AI Score, plan de 90 días y la propuesta de EPA Labs. Impulsé la migración de la agencia de OpenAI a Claude.', en: 'Project lead: AI Score, a 90-day plan and the EPA Labs proposal. I pushed the agency’s move from OpenAI to Claude.' } },
  { id: 'text-sql', front: 'epa', year: '2024', status: 'exp', name: { es: 'Agente de texto a SQL con gráficas', en: 'Text-to-SQL agent with charts' }, line: { es: 'Mi primer agente con LangGraph: genera la consulta, la valida, la corrige y elige la gráfica.', en: 'My first LangGraph agent: it writes the query, validates it, fixes it and picks the chart.' } },
  { id: 'copy-master', front: 'epa', year: '2024', name: { es: 'Verne · Copy Master', en: 'Verne · Copy Master' }, line: { es: 'La primera herramienta de IA generativa de la agencia: un add-on de Sheets que redacta copies por medio con Gemini o Claude vía Vertex AI.', en: 'The agency’s first generative AI tool: a Sheets add-on that writes ad copy per channel with Gemini or Claude on Vertex AI.' } },
  { id: 'geo', front: 'epa', year: '2026', status: 'exp', name: { es: 'Servicio de GEO', en: 'GEO service' }, line: { es: 'Responsable del servicio de GEO de la agencia: un tracker de citas en varios LLM y demos para Google Señales 2026.', en: 'I run the agency’s GEO service: a citation tracker across several LLMs and demos for Google Señales 2026.' } },
  { id: 'gauss', front: 'epa', year: '2026', status: 'exp', name: { es: 'Gauss', en: 'Gauss' }, line: { es: 'MVP de un agente con ADK y Gemini que detecta anomalías en las cuentas.', en: 'An MVP agent on ADK and Gemini that flags anomalies in accounts.' } },
  // Propios
  { id: 'doppel', front: 'own', year: '2026', status: 'wip', name: { es: 'Doppel', en: 'Doppel' }, line: { es: 'Un agente de voz, con mi voz, que participa en Google Meet para demos internas, con RAG y consola del operador.', en: 'A voice agent, with my voice, that joins Google Meet for internal demos, with RAG and an operator console.' } },
  // Datos
  { id: 'central-db', front: 'data', year: '2021', name: { es: 'Base de datos central de medios', en: 'Central media database' }, line: { es: 'La base de medios de la agencia en BigQuery y un reemplazo interno de Supermetrics; de ahí salió la plataforma de datos actual.', en: 'The agency’s media database on BigQuery and an in-house Supermetrics replacement; today’s data platform grew from it.' } },
  { id: 'quarto', front: 'data', year: '2022', name: { es: 'Análisis para clientes en R y Quarto', en: 'Client analyses in R and Quarto' }, line: { es: 'Auditorías de UX móvil y PageSpeed, competitividad de precios y clustering de productos de Performance Max, con una plantilla propia.', en: 'Mobile UX and PageSpeed audits, price competitiveness and Performance Max product clustering, on a template of my own.' } },
  { id: 'mmm', front: 'data', year: '2024', status: 'exp', name: { es: 'Mezcla de medios y pronósticos', en: 'Media mix and forecasting' }, line: { es: 'Exploratorio: Marketing Mix Modeling con Robyn, pronósticos con Prophet y análisis causal con MarketMatching.', en: 'Exploratory: Marketing Mix Modeling with Robyn, forecasting with Prophet and causal analysis with MarketMatching.' } },
  { id: 'datalayer', front: 'data', year: '2023', name: { es: 'QA del dataLayer', en: 'dataLayer QA' }, line: { es: 'Valida el dataLayer de un sitio contra buenas prácticas de Google Analytics, con Selenium y Streamlit.', en: 'Checks a site’s dataLayer against Google Analytics best practices, with Selenium and Streamlit.' } },
  // Enseñar
  { id: 'courses', front: 'teach', year: '2026', name: { es: 'Cursos internos', en: 'Internal courses' }, line: { es: 'Prompting, AI Fluency (programa de Anthropic), «Dashboards con Claude Code», SQL, Looker Studio y Sheets.', en: 'Prompting, AI Fluency (Anthropic’s program), “Dashboards with Claude Code”, SQL, Looker Studio and Sheets.' } },
  { id: 'geo-up', front: 'teach', year: '2026', name: { es: 'Curso de GEO en la Universidad Panamericana', en: 'GEO course at Universidad Panamericana' }, line: { es: 'Generative Engine Optimization: cómo aparecer en las respuestas de los LLM.', en: 'Generative Engine Optimization: how to show up in LLM answers.' } },
  // Laboratorio
  { id: 'office-rpg', front: 'lab', year: '2026', name: { es: 'Juego de oficina', en: 'Office game' }, line: { es: 'Un juego pixel-art del equipo en Phaser, con sprites hechos en Vertex AI.', en: 'A pixel-art team game in Phaser, with sprites made on Vertex AI.' } },
  { id: 'spend', front: 'lab', year: '2025', status: 'exp', name: { es: 'Analizador de gastos con Llama local', en: 'Spend analyzer with local Llama' }, line: { es: 'Encuentra duplicados y anomalías en mis estados de cuenta sin que los datos salgan de mi computadora.', en: 'Finds duplicates and anomalies in my bank statements without the data leaving my computer.' } },
  { id: 'openclaw', front: 'lab', year: '2026', name: { es: 'OpenClaw', en: 'OpenClaw' }, line: { es: 'Lo implementé como asistente personal; ya está deprecado.', en: 'I set it up as a personal assistant; it’s now deprecated.' } },
];

export const caseFront = (org: 'epa' | 'own'): Front => (org === 'epa' ? 'epa' : 'own');

export const countByFront = (f: Front) =>
  cases.filter((c) => caseFront(c.org) === f).length + more.filter((m) => m.front === f).length;

export const examplesByFront = (f: Front, lang: Lang) =>
  [...cases.filter((c) => caseFront(c.org) === f).map((c) => c.name[lang]), ...more.filter((m) => m.front === f).map((m) => m.name[lang])].slice(0, 2);

/** Cifras con fuente para «En números» y la tarjeta de 30 segundos. */
export const numbers: { v: string; l: Record<Lang, string>; source: Record<Lang, string> }[] = [
  { v: '28', l: { es: 'personas activas en el servidor MCP de medios, con más de 14.7M tokens', en: 'active people on the media MCP server, with over 14.7M tokens' }, source: { es: 'panel de administración, oct 2026', en: 'admin dashboard, Oct 2026' } },
  { v: '30 min', l: { es: 'para el análisis diario de SKU de Coppel; antes tomaba un día completo', en: 'for Coppel’s daily SKU analysis, down from a full day' }, source: { es: 'proyecto con Coppel, 2026', en: 'Coppel project, 2026' } },
  { v: '170', l: { es: 'personas, toda la agencia en ese momento, con acceso a la Librería de Prompts', en: 'people, the whole agency at the time, with access to the Prompt Library' }, source: { es: 'lanzamiento, nov 2025', en: 'launch, Nov 2025' } },
  { v: '420,150', l: { es: 'registros cargados a BigQuery por ETL serverless con reintentos y backfill, para Tickspot y Coppel', en: 'records loaded into BigQuery by serverless ETLs with retries and backfill, for Tickspot and Coppel' }, source: { es: 'ETL de Tickspot y Coppel, 2025', en: 'Tickspot and Coppel ETLs, 2025' } },
];

export const timeline: { year: string; t: Record<Lang, string>; mark?: 'origin' | 'now' }[] = [
  { year: '2017', t: { es: 'Ejecutivo de cuentas; mis primeros reportes automáticos', en: 'Account executive; my first automated reports' } },
  { year: '2018', t: { es: 'Analista de marketing digital; aprendí R por un boletín', en: 'Digital marketing analyst; learned R from a newsletter' } },
  { year: '2019', t: { es: 'CRO & Data Analytics Lead, con equipo de 3', en: 'CRO & Data Analytics Lead, team of 3' } },
  { year: '2020', t: { es: 'Gerente de Datos', en: 'Data Manager' } },
  { year: '2024', t: { es: 'AI & Automation Lead; Verne, mi primera herramienta con IA', en: 'AI & Automation Lead; Verne, my first AI tool' }, mark: 'origin' },
  { year: '2025', t: { es: 'Primeros servidores MCP', en: 'First MCP servers' } },
  { year: '', t: { es: 'Servidor MCP de medios, Kalman, Hopper y productos propios', en: 'Media MCP server, Kalman, Hopper and my own products' }, mark: 'now' },
];

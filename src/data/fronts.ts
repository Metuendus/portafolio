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
  { id: 'sku', front: 'epa', year: '2026', status: 'prod', name: { es: 'Dashboard y ETL de SKU para clientes de EPA', en: 'SKU dashboard and ETL for EPA clients' }, line: { es: 'Co-desarrollado, con CI/CD a Cloud Run. En un cliente, el análisis diario de SKU pasó de un día completo a unos 30 minutos, según mi estimación.', en: 'Co-developed, with CI/CD to Cloud Run. For one client, daily SKU analysis went from a full day to about 30 minutes, by my estimate.' } },
  { id: 'passporthub', front: 'epa', year: '2026', name: { es: 'PassportHub', en: 'PassportHub' }, line: { es: 'Lo lideró el gerente de Desarrollo. Participé en la UX, en decidir qué features salían y en la coordinación de QA, y lideré la migración de Osaka como módulo.', en: 'Led by the head of Development. I worked on the UX, on deciding which features shipped and on coordinating QA, and I led the migration of Osaka as a module.' } },
  { id: 'plugins', front: 'epa', year: '2026', name: { es: 'Plugins de Claude Code para dashboards', en: 'Claude Code plugins for dashboards' }, line: { es: 'El marketplace de plugins de Claude Code de la agencia para hacer dashboards: stack cerrado, convenciones de BigQuery, despliegue a Cloud Run y guardrails de seguridad.', en: 'The agency’s Claude Code plugin marketplace for building dashboards: a fixed stack, BigQuery conventions, Cloud Run deployment and security guardrails.' } },
  { id: 'revolution', front: 'epa', year: '2025', name: { es: 'Programa de transformación con IA', en: 'AI transformation program' }, line: { es: 'Project lead: AI Score, plan de 90 días y la propuesta de EPA Labs. Impulsé la migración de la agencia de OpenAI a Claude.', en: 'Project lead: AI Score, a 90-day plan and the EPA Labs proposal. I pushed the agency’s move from OpenAI to Claude.' } },
  { id: 'text-sql', front: 'epa', year: '2024', status: 'exp', name: { es: 'Agente de texto a SQL con gráficas', en: 'Text-to-SQL agent with charts' }, line: { es: 'Mi primer agente con LangGraph: genera la consulta, la valida, la corrige y elige la gráfica.', en: 'My first LangGraph agent: it writes the query, validates it, fixes it and picks the chart.' } },
  { id: 'copy-master', front: 'epa', year: '2024', name: { es: 'Verne · Copy Master', en: 'Verne · Copy Master' }, line: { es: 'La primera herramienta de IA generativa de la agencia: un add-on de Sheets que redacta copies por medio con Gemini o Claude vía Vertex AI.', en: 'The agency’s first generative AI tool: a Sheets add-on that writes ad copy per channel with Gemini or Claude on Vertex AI.' } },
  { id: 'geo', front: 'epa', year: '2026', status: 'exp', name: { es: 'Servicio de GEO', en: 'GEO service' }, line: { es: 'Responsable del servicio de GEO de la agencia: un tracker de citas en varios LLM y demos para Google Señales 2026.', en: 'I run the agency’s GEO service: a citation tracker across several LLMs and demos for Google Señales 2026.' } },
  { id: 'gauss', front: 'epa', year: '2026', status: 'exp', name: { es: 'Gauss', en: 'Gauss' }, line: { es: 'MVP de un agente con ADK y Gemini que detecta anomalías en las cuentas.', en: 'An MVP agent on ADK and Gemini that flags anomalies in accounts.' } },
  // Propios
  { id: 'doppel', front: 'own', year: '2026', name: { es: 'Doppel', en: 'Doppel' }, line: { es: 'Un agente de voz, con mi voz, que participa en Google Meet para demos internas, con consola del operador. Su RAG cita documentos sobre mi trabajo. Implementado y funcional.', en: 'A voice agent, with my voice, that joins Google Meet for internal demos, with an operator console. Its RAG cites documents about my work. Implemented and working.' } },
  // Datos
  { id: 'central-db', front: 'data', year: '2021', name: { es: 'Base de datos central de medios', en: 'Central media database' }, line: { es: 'La base de medios de la agencia en BigQuery; además colaboré en la creación de un reemplazo interno de Supermetrics. De ahí salió la plataforma de datos actual.', en: 'The agency’s media database on BigQuery; I also helped build an in-house Supermetrics replacement. Today’s data platform grew from it.' } },
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
export const numbers: { v: string; proof?: string; l: Record<Lang, string>; source: Record<Lang, string> }[] = [
  { v: '47', proof: 'osaka-usuarios', l: { es: 'usuarios activos de Osaka, el servidor MCP de medios; casi todos lo usan vía MCP', en: 'active users of Osaka, the media MCP server; most use it through MCP' }, source: { es: 'panel de administración, oct 2026', en: 'admin dashboard, Oct 2026' } },
  { v: '38', proof: 'prompts-usuarios', l: { es: 'personas usaron la Librería de Prompts en los últimos 30 días, con 44 recursos publicados', en: 'people used the Prompt Library in the last 30 days, with 44 published resources' }, source: { es: 'panel de administración, nov 2026', en: 'admin dashboard, Nov 2026' } },
  { v: '484', l: { es: 'conversaciones reales de Osaka revisadas en un diagnóstico que lideré, para encontrar dónde fallaban las respuestas y por qué', en: 'real Osaka conversations reviewed in a diagnosis I led, to find where answers failed and why' }, source: { es: 'panel de administración de Osaka, oct 2026', en: 'Osaka admin dashboard, Oct 2026' } },
  { v: '14/16', l: { es: 'notas reales que Hopper clasificó igual que yo en su primera prueba; las otras 2 eran ambiguas', en: 'real notes Hopper classified the way I would in its first test; the other 2 were ambiguous' }, source: { es: 'prueba propia con 16 notas reales', en: 'my own test on 16 real notes' } },
];

/** Quién escribió el código. `case` enlaza a su caso; `profile`, al perfil ampliado. No entra al corpus: repite hechos de los casos. */
export interface Credit { name: Record<Lang, string>; note: Record<Lang, string>; case?: string; profile?: boolean; href?: string }
export const authorship: { id: 'built' | 'led'; title: Record<Lang, string>; items: Credit[] }[] = [
  {
    id: 'built',
    title: { es: 'Lo construí yo', en: 'I built it' },
    items: [
      { case: 'prompts', name: { es: 'Librería de Prompts', en: 'Prompt Library' }, note: { es: 'Diseño, código y despliegue. 38 personas la usaron en los últimos 30 días.', en: 'Design, code and deployment. 38 people used it in the last 30 days.' } },
      { case: 'dash', name: { es: 'Hopper', en: 'Hopper' }, note: { es: 'Mío de punta a punta: 149 reportes de 9 personas.', en: 'Mine end to end: 149 reports from 9 people.' } },
      { case: 'mcp', name: { es: 'Osaka, primera versión', en: 'Osaka, first version' }, note: { es: 'La hice solo en 2025. En la actual aporté el proveedor de DV360 y la autenticación del MCP.', en: 'I built it alone in 2025. In the current one I contributed the DV360 provider and MCP authentication.' } },
      { case: 'fundamentum', name: { es: 'Fundamentum y mis apps con agentes', en: 'Fundamentum and my agent apps' }, note: { es: 'El chasis y las apps que corren sobre él, como Iterum, Domi y Vocatio.', en: 'The chassis and the apps that run on it, such as Iterum, Domi and Vocatio.' } },
      { profile: true, name: { es: 'Dos RAG: la demo de GEO y Doppel', en: 'Two RAG systems: the GEO demo and Doppel' }, note: { es: 'Uno entregaba citas en una demo en vivo ante 30 personas; el otro responde con voz en Google Meet.', en: 'One returned citations in a live demo for 30 people; the other answers by voice in Google Meet.' } },
      { href: 'https://github.com/Metuendus/portafolio/tree/main/agente', name: { es: 'El evaluador de encaje de este sitio', en: 'This site’s fit evaluator' }, note: { es: 'Dos llamadas a un modelo, comprobaciones por código y costo medido en cada corrida.', en: 'Two model calls, code checks and cost measured on every run.' } },
    ],
  },
  {
    id: 'led',
    title: { es: 'Lo dirigí', en: 'I led it' },
    items: [
      { case: 'mcp', name: { es: 'Osaka en producción', en: 'Osaka in production' }, note: { es: 'Product owner: diseñé buena parte de la app y decidí qué features entraban. Un desarrollador de mi equipo escribió cerca del 80 % del código.', en: 'Product owner: I designed much of the app and decided which features went in. A developer on my team wrote about 80% of the code.' } },
      { case: 'einstein', name: { es: 'Einstein', en: 'Einstein' }, note: { es: 'Product owner: definí arquitectura, permisos y roadmap. Lo construyó un desarrollador de mi equipo.', en: 'Product owner: I set the architecture, permissions and roadmap. A developer on my team built it.' } },
      { profile: true, name: { es: 'Migración de Osaka a PassportHub', en: 'Migrating Osaka to PassportHub' }, note: { es: 'La lideré con el equipo de desarrollo: 5 personas, conmigo.', en: 'I led it with the development team: 5 people, including me.' } },
      { profile: true, name: { es: 'Consultoría para un cliente regional', en: 'Consulting project for a regional client' }, note: { es: 'Lideré un equipo de varias áreas: CRO, medición y dirección general.', en: 'I led a cross-functional team: CRO, measurement and the CEO’s office.' } },
    ],
  },
];

export const timeline: { year: string; proof?: string; t: Record<Lang, string>; mark?: 'origin' | 'now' }[] = [
  { year: '2017', t: { es: 'Ejecutivo de cuentas; mis primeros reportes automáticos', en: 'Account executive; my first automated reports' } },
  { year: '2018', t: { es: 'Analista de marketing digital; aprendí R por un boletín', en: 'Digital marketing analyst; learned R from a newsletter' } },
  { year: '2019', proof: 'puesto2', t: { es: 'CRO & Data Analytics Lead, con equipo de 3', en: 'CRO & Data Analytics Lead, team of 3' } },
  { year: '2020', t: { es: 'Gerente de Datos', en: 'Data Manager' } },
  { year: '2024', proof: 'puesto0', t: { es: 'AI & Automation Lead; Verne, mi primera herramienta con IA', en: 'AI & Automation Lead; Verne, my first AI tool' }, mark: 'origin' },
  { year: '2025', t: { es: 'Primeros servidores MCP', en: 'First MCP servers' } },
  { year: '', t: { es: 'Osaka, Hopper, Einstein y productos propios', en: 'Osaka, Hopper, Einstein and my own products' }, mark: 'now' },
];

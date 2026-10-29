import type { Lang } from '../i18n/ui';

/** Sobre mí: versión pública del perfil (perfil profesional v1.1.1, §2, §6, §10, §12 y §13). */

export interface Stage {
  role: Record<Lang, string>;
  dates: Record<Lang, string>;
  what: Record<Lang, string>;
  wins?: Record<Lang, string[]>;
}

export const aboutCopy = {
  es: {
    title: 'Sobre mí',
    h1: 'Nueve años en la misma agencia y cinco puestos distintos.',
    intro: [
      'Soy AI & Automation Lead en EPA.Digital, una agencia mexicana de performance marketing de unas 200 personas. Entré en 2017 como ejecutivo de cuentas, pasé por analítica, CRO y datos, y desde 2020 construyo la infraestructura de datos e IA de la agencia sobre Google Cloud.',
      'Hoy dirijo a un desarrollador de IA, soy product owner de productos internos como Einstein, Kalman y la Librería de Prompts, y co-dueño técnico del servidor MCP de medios que usan los equipos de cuentas. Por mi cuenta construyo Iterum, Domi y Vocatio.',
    ],
    expTag: 'EXPERIENCIA',
    expTitle: 'Todo en EPA.Digital, desde 2017',
    employer: 'EPA.Digital · Ciudad de México · julio 2017 – hoy',
    skillsTag: 'HABILIDADES',
    skillsTitle: 'Con qué trabajo',
    skillsNote: 'Solo lo que tiene un proyecto que lo respalde.',
    eduTag: 'FORMACIÓN',
    eduTitle: 'Educación, certificaciones e idiomas',
    langLabel: 'Idiomas',
    certLabel: 'Certificaciones',
    degreeLabel: 'Licenciatura',
    ctaTitle: '¿Hablamos?',
    ctaBody: 'Estoy abierto a roles de AI Engineer y Applied AI en CDMX, híbridos o remotos.',
  },
  en: {
    title: 'About',
    h1: 'Nine years at the same agency, five different jobs.',
    intro: [
      'I’m AI & Automation Lead at EPA.Digital, a Mexican performance marketing agency of about 200 people. I joined in 2017 as an account executive, moved through analytics, CRO and data, and since 2020 I’ve been building the agency’s data and AI infrastructure on Google Cloud.',
      'Today I lead one AI developer, I’m product owner of internal products such as Einstein, Kalman and the Prompt Library, and technical co-owner of the media MCP server account teams use. On my own time I build Iterum, Domi and Vocatio.',
    ],
    expTag: 'EXPERIENCE',
    expTitle: 'All at EPA.Digital, since 2017',
    employer: 'EPA.Digital · Mexico City · July 2017 – today',
    skillsTag: 'SKILLS',
    skillsTitle: 'What I work with',
    skillsNote: 'Only what a project backs up.',
    eduTag: 'BACKGROUND',
    eduTitle: 'Education, certifications and languages',
    langLabel: 'Languages',
    certLabel: 'Certifications',
    degreeLabel: 'Degree',
    ctaTitle: 'Shall we talk?',
    ctaBody: 'I’m open to AI Engineer and Applied AI roles in Mexico City, hybrid or remote.',
  },
};

export const stages: Stage[] = [
  {
    role: { es: 'AI & Automation Lead', en: 'AI & Automation Lead' },
    dates: { es: 'sep 2024 – hoy', en: 'Sep 2024 – today' },
    what: {
      es: 'Lidero la adopción de IA en la agencia: construyo y opero los sistemas que usan los equipos de cuentas, dirijo a un desarrollador de IA y asesoro a Desarrollo, Medición, Ciencia de Datos y UX. Trabajo con la dirección general en las iniciativas «IA first».',
      en: 'I lead AI adoption at the agency: I build and run the systems account teams use, lead one AI developer and advise Development, Measurement, Data Science and UX. I work with the CEO’s office on its “AI first” initiatives.',
    },
    wins: {
      es: [
        'Servidor MCP de medios: hice la primera versión en 2025 y soy co-dueño técnico de la de producción, un asistente agéntico sobre Meta, Google Ads, GA4, TikTok, Bing y DV360 en Cloud Run. Lideré el diagnóstico de calidad sobre 484 conversaciones reales.',
        'Librería de Prompts: la diseñé y construí (Next.js, Firestore, Cloud Run) y se abrió a las 170 personas de EPA, con analítica de uso en vivo y 0 USD al mes de operación.',
        'Product owner de Einstein, la base de conocimiento con RAG y conector MCP de la agencia, y lead de Kalman, la plataforma de reportería IA-first.',
        'Hopper: un portal de QA para dashboards que reemplazó una matriz de Excel de 993 filas por un flujo guiado que abre issues priorizados en GitHub.',
        'Dashboard y ETL de SKU para Coppel, co-desarrollado: el análisis diario pasó de un día completo a 30 minutos.',
        'Gobierno del vibecoding: el marketplace de plugins de Claude Code de la agencia, con stack cerrado, guardrails de seguridad y 35 skills de medios.',
        'Cursos internos de prompting, AI Fluency y «Dashboards con Claude Code», y curso de GEO en la Universidad Panamericana.',
      ],
      en: [
        'Media MCP server: I built the first version in 2025 and co-own the production one, an agentic assistant over Meta, Google Ads, GA4, TikTok, Bing and DV360 on Cloud Run. I led the quality review of 484 real conversations.',
        'Prompt Library: I designed and built it (Next.js, Firestore, Cloud Run) and it opened to all 170 people at EPA, with live usage analytics and 0 USD a month to run.',
        'Product owner of Einstein, the agency’s RAG knowledge base with an MCP connector, and lead of Kalman, the AI-first reporting platform.',
        'Hopper: a QA portal for dashboards that replaced a 993-row spreadsheet with a guided flow that opens prioritized GitHub issues.',
        'SKU dashboard and ETL for Coppel, co-developed: daily analysis went from a full day to 30 minutes.',
        'Vibecoding governance: the agency’s Claude Code plugin marketplace, with a fixed stack, security guardrails and 35 media skills.',
        'Internal courses on prompting, AI Fluency and “Dashboards with Claude Code”, plus a GEO course at Universidad Panamericana.',
      ],
    },
  },
  {
    role: { es: 'Gerente de Datos', en: 'Data Manager' },
    dates: { es: 'sep 2020 – sep 2024', en: 'Sep 2020 – Sep 2024' },
    what: {
      es: 'Responsable del área de datos: la base de datos central, la reportería automatizada, los análisis para clientes y las herramientas internas.',
      en: 'Owned the data area: the central database, automated reporting, client analyses and internal tools.',
    },
    wins: {
      es: [
        'Diseñé la base de datos de medios de la agencia en BigQuery y un reemplazo interno de Supermetrics, origen de la plataforma de datos actual.',
        'Benchmarks por medio y tipo de campaña, y bots de Slack con los KPIs diarios de las cuentas de e-commerce.',
        'Estandaricé los análisis para clientes en R y Quarto: auditorías de UX móvil, competitividad de precios y clustering de productos de Performance Max.',
        'Automatización de medios: scripts de Google Ads y un optimizador de keywords con aprobación humana en Sheets.',
        'Exploración de Marketing Mix Modeling con Robyn y pronósticos con Prophet.',
      ],
      en: [
        'Designed the agency’s media database on BigQuery and an in-house Supermetrics replacement, the origin of today’s data platform.',
        'Benchmarks by channel and campaign type, and Slack bots with daily KPIs for e-commerce accounts.',
        'Standardized client analyses in R and Quarto: mobile UX audits, price competitiveness and Performance Max product clustering.',
        'Media automation: Google Ads scripts and a keyword optimizer with human approval in Sheets.',
        'Explored Marketing Mix Modeling with Robyn and forecasting with Prophet.',
      ],
    },
  },
  {
    role: { es: 'CRO & Data Analytics Lead', en: 'CRO & Data Analytics Lead' },
    dates: { es: 'ene 2019 – sep 2020', en: 'Jan 2019 – Sep 2020' },
    what: {
      es: 'Creé y lideré el programa de optimización de conversión con un equipo de tres (UX, desarrollo y análisis). Después trabajé con la Dirección de Marketing en CRO y análisis de datos: KPIs de mercado y reportes automatizados con R y Google Sheets. De ahí salió la gerencia de datos.',
      en: 'Created and led the conversion optimization program with a team of three (UX, development and analysis). Later I worked with the Marketing Director on CRO and data analysis: market KPIs and automated reports with R and Google Sheets. That led to the data manager role.',
    },
  },
  {
    role: { es: 'Analista de marketing digital', en: 'Digital marketing analyst' },
    dates: { es: 'sep 2018 – dic 2018', en: 'Sep 2018 – Dec 2018' },
    what: {
      es: 'Análisis con Google Analytics y RStudio, scripts de Google Ads y automatización de reportes.',
      en: 'Analysis with Google Analytics and RStudio, Google Ads scripts and report automation.',
    },
  },
  {
    role: { es: 'Ejecutivo de cuentas', en: 'Account executive' },
    dates: { es: 'jul 2017 – sep 2018', en: 'Jul 2017 – Sep 2018' },
    what: {
      es: 'Campañas en Google, Facebook y Bing, con herramientas de inteligencia competitiva.',
      en: 'Campaigns on Google, Facebook and Bing, with competitive intelligence tools.',
    },
  },
];

export const skills: { name: Record<Lang, string>; items: string[] }[] = [
  { name: { es: 'IA y agentes', en: 'AI and agents' }, items: ['MCP', 'Claude · Anthropic SDK', 'Claude Code', 'Prompt engineering', 'Gemini · Vertex AI · ADK', 'LangGraph', 'RAG', 'Evals · guardrails', 'OpenAI SDK'] },
  { name: { es: 'Datos', en: 'Data' }, items: ['SQL · BigQuery', 'ETL', 'Python', 'Looker Studio', 'Firestore', 'GA4 · Google Ads · Meta · TikTok · DV360', 'R · Quarto', 'PostgreSQL'] },
  { name: { es: 'Desarrollo y nube', en: 'Engineering and cloud' }, items: ['TypeScript · Node', 'Next.js · React', 'Cloud Run', 'Cloud Functions · Scheduler', 'Apps Script', 'Terraform', 'pytest · vitest'] },
];

export const education = {
  degree: {
    es: 'Licenciatura en Administración · UNAM, Facultad de Contaduría y Administración · titulado en 2016',
    en: 'B.A. in Business Administration · UNAM, School of Accounting and Administration · graduated 2016',
  },
  certs: [
    { es: 'Launching into Machine Learning · Google · 2024', en: 'Launching into Machine Learning · Google · 2024' },
    { es: 'Prompt Design in Vertex AI · Google · 2024', en: 'Prompt Design in Vertex AI · Google · 2024' },
    { es: 'Data Analyst with Python · DataCamp · 2022', en: 'Data Analyst with Python · DataCamp · 2022' },
  ],
  langs: [
    { es: 'Español · nativo', en: 'Spanish · native' },
    { es: 'Inglés · intermedio (B1–B2), en clases', en: 'English · intermediate (B1–B2), taking classes' },
  ],
};

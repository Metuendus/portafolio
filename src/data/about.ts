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
      'Antes de EPA hice marketing BTL, y me chocaba que nadie supiera si algo funcionaba: se seguía haciendo porque siempre se había hecho. Quería algo que se pudiera medir, así que me fui a digital. Entré a EPA.Digital en 2017 como ejecutivo de cuentas.',
      'Lo primero que automaticé fueron mis reportes, en lo que entonces se llamaba Google Data Studio, porque odiaba repetirme en cada presentación. Luego quise automatizar las OET y la carga de anuncios y no pude. Estaba muy por encima de lo que sabía hacer, y eso me desesperaba.',
      'Una mañana, un boletín de PPC Hero contaba cómo alguien había usado R y una regresión lineal para reasignar presupuesto. Descargué RStudio pensando que sería algo como AdWords Editor, y a los dos minutos vi que era un lenguaje de programación con estadística incluida. Lo aprendí en las tardes. El CEO de la agencia me decía que lo estaba haciendo de la forma más difícil posible; no le hice caso.',
      'Ese gusto por el camino difícil también me costó. Llegué a juntas con matrices de correlación que el cliente no sabía leer, y tuve que aprender a explicar los datos en su idioma. Años después, cuando salió ChatGPT, lo usé primero para algo que no había podido resolver con modelos de NLP: los copies. Luego vi que también servía para programar, y desde entonces me dedico a eso.',
      'Hoy soy AI & Automation Lead en EPA.Digital, una agencia de unas 200 personas. Dirijo a un desarrollador de IA, soy product owner de productos internos como Einstein y la Librería de Prompts, y co-dueño técnico del servidor MCP de medios que usan los equipos de cuentas. Por mi cuenta construyo Iterum, Domi y Vocatio.',
      'Las hago después del trabajo, en Claude Code y Claude Design. La parte que más disfruto es el diseño: rebotar ideas para decidir qué entra y qué no, siempre con dos pilares, la IA como núcleo y la experiencia de uso. Ahí aprendí algo que en EPA no: sacar una app de principio a fin sin coordinar con otro equipo, siendo yo el primer usuario, y después probarla con usuarios beta.',
      'Lo que sigo trabajando: el orden al implementar (por eso hice Fundamentum), hablar menos rápido cuando explico ideas largas y el inglés, que está entre B1 y B2.',
      'Fuera del trabajo me gusta viajar, por México y fuera. Viví un tiempo en Baja California Sur y soy fan de los viajes por carretera y off-road. Veo mucha serie de HBO, como Succession y The Wire, Los Simpson y toda la ciencia ficción que pueda.',
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
    ctaBody: 'Busco un rol de AI Engineer o Applied AI en CDMX, híbrido o remoto, con un equipo propositivo que avance sin esperar a que le digan qué hacer. Después de cinco puestos distintos, quiero especializarme en IA y agentes.',
  },
  en: {
    title: 'About',
    h1: 'Nine years at the same agency, five different jobs.',
    intro: [
      'Before EPA I worked in below-the-line marketing, and it bugged me that nobody knew whether anything worked: things kept happening because they always had. I wanted something I could measure, so I moved to digital. I joined EPA.Digital in 2017 as an account executive.',
      'The first thing I automated was my reporting, in what was then called Google Data Studio, because I hated repeating myself in every presentation. Then I tried to automate insertion orders and ad uploads and couldn’t. It was way beyond what I knew how to do, and that drove me crazy.',
      'One morning a PPC Hero newsletter described someone using R and a linear regression to reallocate budget. I downloaded RStudio thinking it would be like AdWords Editor, and two minutes later realized it was a programming language with statistics built in. I learned it in the afternoons. The agency’s CEO kept telling me I was doing it the hardest way possible; I didn’t listen.',
      'That taste for the hard way cost me too. I showed up to client meetings with correlation matrices nobody could read, and had to learn to explain data in the client’s terms. Years later, when ChatGPT came out, I first used it for something I’d failed to solve with NLP models: ad copy. Then I saw it could also write code, and that’s what I’ve done since.',
      'Today I’m AI & Automation Lead at EPA.Digital, an agency of about 200 people. I lead one AI developer, I’m product owner of internal products such as Einstein and the Prompt Library, and technical co-owner of the media MCP server account teams use. On my own time I build Iterum, Domi and Vocatio.',
      'I build them after work, in Claude Code and Claude Design. The part I enjoy most is design: bouncing ideas around to decide what goes in and what doesn’t, always on two pillars, AI at the core and the user experience. That’s where I learned something EPA didn’t teach me: shipping an app end to end without coordinating with another team, as its first user, and then testing it with beta users.',
      'What I’m still working on: order when I build (that’s why I made Fundamentum), slowing down when I explain long ideas, and my English, which sits between B1 and B2.',
      'Outside work I like to travel, around Mexico and abroad. I lived in Baja California Sur for a while and I’m a big fan of road trips and off-road driving. I watch a lot of HBO, like Succession and The Wire, The Simpsons, and all the science fiction I can.',
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
    ctaBody: 'I’m looking for an AI Engineer or Applied AI role in Mexico City, hybrid or remote, with a proactive team that moves without waiting to be told what to do. After five different jobs, I want to specialize in AI and agents.',
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
        'Osaka, el servidor MCP de medios: hice la primera versión en 2025 y soy co-dueño técnico de la de producción, un asistente agéntico sobre Meta, Google Ads, GA4, TikTok, Bing y DV360 en Cloud Run. Lideré el diagnóstico de calidad sobre 484 conversaciones reales.',
        'Librería de Prompts: la diseñé y construí (Next.js, Firestore, Cloud Run) y se abrió a las 170 personas de EPA, con analítica de uso en vivo y 0 USD al mes de operación.',
        'Product owner de Einstein, la base de conocimiento con RAG y conector MCP de la agencia.',
        'Hopper: un portal de QA para dashboards que reemplazó una matriz de Excel de 993 filas por un flujo guiado que abre issues priorizados en GitHub.',
        'Dashboard y ETL de SKU para Coppel, co-desarrollado: el análisis diario pasó de un día completo a 30 minutos.',
        'Plugins de Claude Code para dashboards: el marketplace de la agencia, con stack cerrado, convenciones de BigQuery, despliegue a Cloud Run y guardrails de seguridad.',
        'Cursos internos de prompting, AI Fluency y «Dashboards con Claude Code», y curso de GEO en la Universidad Panamericana.',
      ],
      en: [
        'Osaka, the media MCP server: I built the first version in 2025 and co-own the production one, an agentic assistant over Meta, Google Ads, GA4, TikTok, Bing and DV360 on Cloud Run. I led the quality review of 484 real conversations.',
        'Prompt Library: I designed and built it (Next.js, Firestore, Cloud Run) and it opened to all 170 people at EPA, with live usage analytics and 0 USD a month to run.',
        'Product owner of Einstein, the agency’s RAG knowledge base with an MCP connector.',
        'Hopper: a QA portal for dashboards that replaced a 993-row spreadsheet with a guided flow that opens prioritized GitHub issues.',
        'SKU dashboard and ETL for Coppel, co-developed: daily analysis went from a full day to 30 minutes.',
        'Claude Code plugins for dashboards: the agency’s marketplace, with a fixed stack, BigQuery conventions, Cloud Run deployment and security guardrails.',
        'Internal courses on prompting, AI Fluency and “Dashboards with Claude Code”, plus a GEO course at Universidad Panamericana.',
      ],
    },
  },
  {
    role: { es: 'Gerente de Datos', en: 'Data Manager' },
    dates: { es: 'sep 2020 – sep 2024', en: 'Sep 2020 – Sep 2024' },
    what: {
      es: 'Uno de los gerentes del área de datos. Trabajé en la base de datos central, la reportería automatizada, los análisis para clientes y herramientas internas.',
      en: 'One of the managers in the data area. I worked on the central database, automated reporting, client analyses and internal tools.',
    },
    wins: {
      es: [
        'Diseñé la base de datos de medios de la agencia en BigQuery y colaboré en la creación de un reemplazo interno de Supermetrics, origen de la plataforma de datos actual.',
        'Benchmarks por medio y tipo de campaña, y bots de Slack con los KPIs diarios de las cuentas de e-commerce.',
        'Estandaricé los análisis para clientes en R y Quarto: auditorías de UX móvil, competitividad de precios y clustering de productos de Performance Max.',
        'Automatización de medios: scripts de Google Ads y un optimizador de keywords con aprobación humana en Sheets.',
        'Exploración de Marketing Mix Modeling con Robyn y pronósticos con Prophet.',
      ],
      en: [
        'Designed the agency’s media database on BigQuery and helped build an in-house Supermetrics replacement, the origin of today’s data platform.',
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
      es: 'Análisis con Google Analytics y R, que aprendí por mi cuenta, scripts de Google Ads y automatización de reportes.',
      en: 'Analysis with Google Analytics and R, which I taught myself, Google Ads scripts and report automation.',
    },
  },
  {
    role: { es: 'Ejecutivo de cuentas', en: 'Account executive' },
    dates: { es: 'jul 2017 – sep 2018', en: 'Jul 2017 – Sep 2018' },
    what: {
      es: 'Llevaba la relación con los clientes de campañas en Google, Facebook y Bing: llamadas, ajustes, copies con sus rondas de correcciones y OET hechas a mano. Ahí automaticé mis primeros reportes en Google Data Studio.',
      en: 'I handled client relationships for campaigns on Google, Facebook and Bing: calls, tweaks, ad copy with its rounds of revisions and insertion orders done by hand. That’s where I automated my first reports in Google Data Studio.',
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

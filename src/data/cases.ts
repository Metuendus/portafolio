import { moreDetails } from './cases-more';
import type { Lang } from '../i18n/ui';

export type Org = 'epa' | 'own';
export type Status = 'prod' | 'live' | 'wip' | 'post' | 'exp';
export type NodeKind = 'ext' | 'svc' | 'focus';

export interface CaseSummary {
  id: string;
  /** Color de captura placeholder; vacío usa la superficie del tema. */
  shot?: 'iterum' | 'domi' | 'vocatio' | 'fundamentum';
  /** Landing pública de la app (ahí están el ejemplo y el acceso). */
  app?: string;
  /** Repositorio público del proyecto, si existe. */
  repo?: string;
  org: Org;
  status?: Status;
  name: Record<Lang, string>;
  hook: Record<Lang, string>;
  /** Portada mientras no haya captura: un dato o una idea del caso, nunca una caja vacía. */
  cover: { v: string; l: Record<Lang, string> };
  /** Captura real del producto; donde no existe se queda la portada con un dato. */
  image?: { src: Record<Lang, string>; width: number; height: number; alt: Record<Lang, string> };
}

export interface Figure { v: string; l: string; source?: string }
export interface Decision { title: string; body: string; before?: string; after?: string }

export interface CaseContent {
  short: string;
  stack: string[];
  videoTitle: string;
  /** ID de YouTube; sin él, el póster queda como placeholder. */
  videoId?: string;
  problemTitle: string;
  problemBody: string;
  nodes: [NodeKind, string, string][];
  diagramNote: string;
  steps: string[];
  decisions: Decision[];
  quote?: string;
  quoteCap?: string;
  figures: Figure[];
  noUsageText?: string;
  resultText: string;
  shots: string[];
  role: string;
  roleNote: string;
  nextText?: string;
}

export interface CaseDetail {
  poster: 'iterum' | 'einstein' | 'fundamentum';
  content: Record<Lang, CaseContent>;
}

/** Orden de los 8 casos: alterna EPA y Propia (README §4 · Casos). */
export const cases: CaseSummary[] = [
  { id: 'mcp', org: 'epa', status: 'prod', name: { es: 'Osaka, servidor MCP de medios', en: 'Osaka, media MCP server' }, hook: { es: 'Los datos de cada medio vivían en su propia plataforma. Construimos una solución que genera insights de todos', en: 'Each channel’s data lived in its own platform. We built a solution that generates insights across all of them' } , cover: { v: '484', l: { es: 'conversaciones reales revisadas para medir la calidad', en: 'real conversations reviewed to measure quality' } }, image: { src: { es: '/video/osaka-poster-es.jpg', en: '/video/osaka-poster-en.jpg' }, width: 1920, height: 1080, alt: { es: 'Portada del video de Osaka, con datos ficticios de una marca demo.', en: 'Cover of the Osaka video, with fictional data from a demo brand.' } } },
  { id: 'iterum', org: 'own', shot: 'iterum', app: 'https://iterum.josecarloscorona.dev/demo', status: 'live', name: { es: 'Iterum', en: 'Iterum' }, hook: { es: 'Un agente que te ayuda a planificar tu viaje sin inventar nada', en: 'An agent that helps you plan your trip without making anything up' } , cover: { v: '0', l: { es: 'lugares sin verificar en un itinerario', en: 'unverified places in an itinerary' } }, image: { src: { es: '/capturas/iterum.jpg', en: '/capturas/iterum.jpg' }, width: 1440, height: 900, alt: { es: 'Iterum con un viaje de ejemplo a Lisboa: el plan del día, el Concierge proponiendo un vuelo más barato y el mapa del día.', en: 'Iterum with a sample trip to Lisbon: the day’s plan, the Concierge proposing a cheaper flight and the day’s map.' } } },
  { id: 'dash', org: 'epa', status: 'prod', name: { es: 'Dashboards y Hopper', en: 'Dashboards and Hopper' }, hook: { es: 'Cada bug en un dashboard era una llamada. Hopper recibe los reportes, los clasifica y los deja listos para corregir', en: 'Every dashboard bug meant a call. Hopper takes the reports, classifies them and gets them ready to fix' } , cover: { v: '149', l: { es: 'reportes de 9 personas en Hopper', en: 'reports from 9 people in Hopper' } }, image: { src: { es: '/video/hopper-poster-es.jpg', en: '/video/hopper-poster-en.jpg' }, width: 1920, height: 1080, alt: { es: 'Portada del video de Hopper: la comparación entre un dato reportado y el del dashboard, con datos ficticios de una marca demo.', en: 'Cover of the Hopper video: a reported figure compared with the dashboard’s, with fictional data from a demo brand.' } } },
  { id: 'domi', org: 'own', shot: 'domi', app: 'https://domi.josecarloscorona.dev/demo', status: 'live', name: { es: 'Domi', en: 'Domi' }, hook: { es: 'Buscar departamento en CDMX es cada vez más complejo. Domi te acompaña y te ayuda a investigar', en: 'Apartment hunting in Mexico City keeps getting harder. Domi stays with you and helps you research' } , cover: { v: 'CDMX', l: { es: 'cada zona medida con datos abiertos de la FGJ y el DENUE', en: 'every area measured with open FGJ and DENUE data' } }, image: { src: { es: '/capturas/domi.jpg', en: '/capturas/domi.jpg' }, width: 1440, height: 900, alt: { es: 'Domi con un departamento de ejemplo en Narvarte: el desglose de por qué tiene 86 puntos, cada dato con su fuente.', en: 'Domi with a sample apartment in Narvarte: the breakdown of why it scores 86, each figure with its source.' } } },
  { id: 'einstein', org: 'epa', status: 'prod', name: { es: 'Einstein', en: 'Einstein' }, hook: { es: 'Un cerebro para darle contexto a cualquier agente', en: 'A brain that gives context to any agent' } , cover: { v: 'RAG', l: { es: 'búsqueda con citas y conector MCP para Claude', en: 'cited search and an MCP connector for Claude' } } },
  { id: 'vocatio', org: 'own', shot: 'vocatio', app: 'https://vocatio.josecarloscorona.dev/demo', status: 'live', name: { es: 'Vocatio', en: 'Vocatio' }, hook: { es: 'Busca vacantes y adapta tu CV a cada una sin inventar: ningún bullet sin fuente', en: 'Finds openings and tailors your CV to each one without making things up: no bullet without a source' } , cover: { v: 'MX', l: { es: 'vacantes, CV y correo para profesionistas en México', en: 'jobs, CVs and email for professionals in Mexico' } }, image: { src: { es: '/capturas/vocatio.jpg', en: '/capturas/vocatio.jpg' }, width: 1440, height: 900, alt: { es: 'Vocatio con datos de muestra: un CV adaptado a una vacante, con la fuente de cada cambio en el Expediente.', en: 'Vocatio with sample data: a CV tailored to an opening, with each change’s source in the record.' } } },
  { id: 'prompts', org: 'epa', status: 'prod', name: { es: 'Librería de Prompts', en: 'Prompt Library' }, hook: { es: 'Cada script, prompt y automatización de la agencia en un solo lugar, con su uso a la vista', en: 'Every script, prompt and automation at the agency in one place, with its usage in plain sight' } , cover: { v: '38', l: { es: 'personas la usaron en los últimos 30 días', en: 'people used it in the last 30 days' } } },
  { id: 'fundamentum', org: 'own', shot: 'fundamentum', repo: 'https://github.com/Metuendus/fundamentum', name: { es: 'Fundamentum', en: 'Fundamentum' }, hook: { es: 'Un chasis unificado para crear apps agénticas', en: 'A unified chassis for building agentic apps' } , cover: { v: '3', l: { es: 'apps sobre el mismo chasis', en: 'apps on the same chassis' } } },
];

export const details: Record<string, CaseDetail> = {
  ...moreDetails,
  einstein: {
    poster: 'einstein',
    // Solo lo que respalda el repo EPA-Einstein (perfil v1.1.1, §7.2).
    content: {
      es: {
        short: 'Einstein',
        stack: ['FastAPI', 'React', 'Qdrant', 'Claude · Vertex AI', 'MCP'],
        videoTitle: 'Einstein: lo que aprendí con la primera versión',
        problemTitle: 'El CEO quería un lugar donde guardar lo que sabe la agencia.',
        problemBody: 'La idea era reunirlo en documentos que personas e IA pudieran consultar, con citas, y llevarlo hasta Claude, donde ya trabaja la gente.',
        nodes: [['ext', 'Equipo de la agencia', 'personas'], ['svc', 'Documentos', 'Markdown · [[enlaces]] · grafo'], ['focus', 'Búsqueda y chat', 'Qdrant · Claude en Vertex AI'], ['svc', 'Conector MCP', 'Claude.ai y Desktop']],
        diagramNote: 'Desplegado con Docker Compose en Compute Engine',
        steps: ['Cada documento es Markdown, con [[enlaces]] entre notas y un grafo para navegarlas.', 'La búsqueda semántica arma el contexto y el chat responde con citas.', 'Un conector MCP lleva la misma base a Claude.ai y Claude Desktop.'],
        decisions: [
          { title: 'Propuse que funcionara como un cerebro.', body: 'Mi propuesta original tenía dos memorias, una de corto y otra de largo plazo, y un agente que las reorganizara, como ocurre durante el sueño REM. Eso se quedó en propuesta; lo que se construyó es la búsqueda con citas y el conector MCP.' },
          { title: 'Toda respuesta trae citas.', body: 'El chat enlaza los documentos de donde sacó cada afirmación, para que cualquiera pueda revisarla.' },
          { title: 'Einstein también vive dentro de Claude.', body: 'Además de la web, un conector MCP deja consultar la misma base desde Claude.ai y Claude Desktop, sin cambiar de herramienta.' },
          { title: 'Lo que aprendí con la primera versión.', body: 'No la usábamos ni quienes la desarrollamos, porque ya trabajábamos con Obsidian, que hace muy bien ese trabajo. Si nosotros no la usábamos, probablemente nuestros usuarios tampoco. De ahí viene mi regla de planear antes de programar.' },
          { title: 'Quitamos el trámite de publicar.', body: 'En septiembre de 2026 eliminamos los roles y el flujo de borrador, revisión y publicación. Ahora todo es personal salvo lo que tú decidas publicar.', before: 'Borrador → en revisión → publicado.', after: 'Todo es personal salvo lo que publiques.' },
        ],
        figures: [],
        resultText: 'Einstein quedó desplegado, con chat con citas y conector MCP, y hoy es uno de los OKR de EPA. En septiembre de 2026 se quitaron los roles y el flujo de aprobación para simplificar el modelo de permisos.',
        shots: ['Documento con [[enlaces]] y grafo', 'Chat con citas', 'Conector MCP en Claude'],
        role: 'Product owner.',
        roleNote: 'Definí arquitectura, permisos y roadmap; lo construyó un desarrollador de mi equipo.',
      },
      en: {
        short: 'Einstein',
        stack: ['FastAPI', 'React', 'Qdrant', 'Claude · Vertex AI', 'MCP'],
        videoTitle: 'Einstein: what I learned from the first version',
        problemTitle: 'The CEO wanted one place to keep what the agency knows.',
        problemBody: 'The idea was to gather it into documents that people and AI could query, with citations, and bring it into Claude, where people already work.',
        nodes: [['ext', 'Agency team', 'people'], ['svc', 'Documents', 'Markdown · [[links]] · graph'], ['focus', 'Search and chat', 'Qdrant · Claude on Vertex AI'], ['svc', 'MCP connector', 'Claude.ai and Desktop']],
        diagramNote: 'Deployed with Docker Compose on Compute Engine',
        steps: ['Every document is Markdown, with [[links]] between notes and a graph to browse them.', 'Semantic search builds the context and the chat answers with citations.', 'An MCP connector brings the same base into Claude.ai and Claude Desktop.'],
        decisions: [
          { title: 'I proposed it should work like a brain.', body: 'My original proposal had two memories, short-term and long-term, and an agent that reorganized them, the way it happens during REM sleep. That stayed a proposal; what got built is cited search and the MCP connector.' },
          { title: 'Every answer comes with citations.', body: 'The chat links the documents behind each claim, so anyone can check it.' },
          { title: 'Einstein also lives inside Claude.', body: 'Besides the web app, an MCP connector lets people query the same base from Claude.ai and Claude Desktop without switching tools.' },
          { title: 'What I learned from the first version.', body: 'Not even those of us building it were using it, because we already worked in Obsidian, which does that job very well. If we weren’t using it, our users probably wouldn’t either. That’s where my rule of planning before coding comes from.' },
          { title: 'We dropped the publishing paperwork.', body: 'In September 2026 we removed roles and the draft, review and publish flow. Now everything is personal unless you choose to publish it.', before: 'Draft → in review → published.', after: 'Everything is personal unless you publish it.' },
        ],
        figures: [],
        resultText: 'Einstein shipped, with cited chat and an MCP connector, and today it’s one of EPA’s OKRs. In September 2026 roles and the approval flow were removed to simplify the permission model.',
        shots: ['Document with [[links]] and graph', 'Chat with citations', 'MCP connector in Claude'],
        role: 'Product owner.',
        roleNote: 'I set the architecture, permissions and roadmap; a developer on my team built it.',
      },
    },
  },
  iterum: {
    poster: 'iterum',
    content: {
      es: {
        short: 'Iterum',
        stack: ['Next.js', 'Firestore', 'Google Maps', 'Cloud Run', 'Agentes'],
        videoTitle: 'Iterum: una propuesta, de principio a fin',
        problemTitle: 'Antes de Iterum, mis viajes vivían en un Google Sheets.',
        problemBody: 'Ahí iban el presupuesto, el itinerario día por día y hora por hora, los trenes, los boletos y la dirección de cada hotel. Me quitaba la ansiedad de llegar a una ciudad que no conozco con poco tiempo entre vuelos. Probé apps como Wanderlog, que es muy buena, pero su IA es un chat pegado a la app. Yo quería lo contrario: la IA como núcleo y la app alrededor.',
        nodes: [['ext', 'Viajero', 'chat'], ['focus', 'Concierge', 'única voz'], ['svc', 'Especialistas', 'tarjetas firmadas'], ['svc', 'Auditoría', 'factibilidad · semáforo']],
        diagramNote: 'Desplegada en Cloud Run',
        steps: ['Hablas solo con Concierge.', 'Los especialistas preparan tarjetas firmadas; Concierge te las presenta como propuestas.', 'Antes de mostrar el plan, una auditoría de factibilidad lo marca con semáforo.'],
        decisions: [
          { title: 'En el chat escribe un solo agente.', body: 'Los especialistas trabajan detrás y firman sus tarjetas en el plan. En el chat escribe uno solo, para que nunca tengas que adivinar quién te está hablando.' },
          { title: 'Cada cambio pide tu aprobación.', body: 'Cada cambio que propone un agente llega con Aceptar, Editar y Rechazar, y una vista de antes y después. Dinero y compromisos siempre piden aprobación explícita.', before: 'El asistente cambia el plan.', after: 'Tú decides cada cambio.' },
          { title: 'Cada lugar se verifica en Google Places.', body: 'Cada lugar se verifica contra Google Places antes de entrar al plan, y una auditoría de factibilidad marca el itinerario con semáforo, ícono y explicación. Si algo no se encuentra, Iterum lo dice.' },
        ],
        figures: [],
        noUsageText: 'Todavía no hay cifras de uso.',
        resultText: 'Desplegada en Cloud Run. Ningún lugar entra al plan sin verificarse en Google Places; si no se encuentra, Iterum lo dice. La estrenaré en mi próximo viaje a Italia.',
        shots: ['Concierge y tarjetas firmadas', 'Propuesta · Aceptar · Editar · Rechazar', 'Auditoría de factibilidad · semáforo'],
        role: 'Creador.',
        roleNote: 'Producto, agentes y despliegue.',
      },
      en: {
        short: 'Iterum',
        stack: ['Next.js', 'Firestore', 'Google Maps', 'Cloud Run', 'Agents'],
        videoTitle: 'Iterum: one proposal, start to finish',
        problemTitle: 'Before Iterum, my trips lived in a Google Sheet.',
        problemBody: 'It held the budget, the itinerary day by day and hour by hour, the trains, the tickets and every hotel’s address. It took away the anxiety of landing in a city I don’t know with little time between flights. I tried apps like Wanderlog, which is very good, but its AI is a chat attached to the app. I wanted the opposite: AI at the core and the app built around it.',
        nodes: [['ext', 'Traveler', 'chat'], ['focus', 'Concierge', 'single voice'], ['svc', 'Specialists', 'signed cards'], ['svc', 'Audit', 'feasibility · traffic light']],
        diagramNote: 'Deployed on Cloud Run',
        steps: ['You only talk to Concierge.', 'Specialists prepare signed cards; Concierge presents them to you as proposals.', 'Before showing the plan, a feasibility audit marks it with a traffic light.'],
        decisions: [
          { title: 'Only one agent writes in the chat.', body: 'Specialists work behind the scenes and sign their cards in the plan. Only one voice writes in the chat, so you never have to guess who is talking.' },
          { title: 'Every change asks for your approval.', body: 'Every change an agent proposes comes with Accept, Edit and Reject, plus a before-and-after view. Money and commitments always need explicit approval.', before: 'The assistant changes the plan.', after: 'You decide every change.' },
          { title: 'Every place is checked on Google Places.', body: 'Every place is checked against Google Places before it enters the plan, and a feasibility audit marks the itinerary with a traffic light, icon and explanation. If something can’t be found, Iterum says so.' },
        ],
        figures: [],
        noUsageText: 'No usage figures yet.',
        resultText: 'Deployed on Cloud Run. No place enters the plan without being checked on Google Places; if it can’t be found, Iterum says so. I’ll debut it on my next trip to Italy.',
        shots: ['Concierge and signed cards', 'Proposal · Accept · Edit · Reject', 'Feasibility audit · traffic light'],
        role: 'Creator.',
        roleNote: 'Product, agents and deployment.',
      },
    },
  },
};

export const hasPage = (id: string) => id in details;

import { moreDetails } from './cases-more';
import type { Lang } from '../i18n/ui';

export type Org = 'epa' | 'own';
export type Status = 'prod' | 'live' | 'wip' | 'post' | 'exp';
export type NodeKind = 'ext' | 'svc' | 'focus';

export interface CaseSummary {
  id: string;
  /** Color de captura placeholder; vacío usa la superficie del tema. */
  shot?: 'iterum' | 'domi' | 'vocatio' | 'fundamentum';
  org: Org;
  status?: Status;
  name: Record<Lang, string>;
  hook: Record<Lang, string>;
  /** Portada mientras no haya captura: un dato o una idea del caso, nunca una caja vacía. */
  cover: { v: string; l: Record<Lang, string> };
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
  { id: 'mcp', org: 'epa', status: 'prod', name: { es: 'Servidor MCP de medios', en: 'Media MCP server' }, hook: { es: 'Un asistente que consulta Meta, Google Ads, GA4 y tres medios más por los equipos de cuentas', en: 'An assistant that queries Meta, Google Ads, GA4 and three more channels for account teams' } , cover: { v: '484', l: { es: 'conversaciones reales revisadas para medir la calidad', en: 'real conversations reviewed to measure quality' } } },
  { id: 'iterum', org: 'own', shot: 'iterum', status: 'live', name: { es: 'Iterum', en: 'Iterum' }, hook: { es: 'Planea el viaje contigo y verifica cada lugar antes de proponerlo', en: 'Plans the trip with you and checks every place before proposing it' } , cover: { v: '0', l: { es: 'lugares sin verificar en un itinerario', en: 'unverified places in an itinerary' } } },
  { id: 'dash', org: 'epa', status: 'prod', name: { es: 'Dashboards y Hopper', en: 'Dashboards and Hopper' }, hook: { es: 'De un Excel de 993 filas a QA guiado', en: 'From a 993-row spreadsheet to guided QA' } , cover: { v: '993', l: { es: 'filas de Excel que dejaron de llenarse a mano', en: 'spreadsheet rows nobody fills by hand anymore' } } },
  { id: 'domi', org: 'own', shot: 'domi', status: 'wip', name: { es: 'Domi', en: 'Domi' }, hook: { es: 'Busca departamento en CDMX, mide la zona y desconfía de lo sospechoso', en: 'Hunts for apartments in Mexico City, measures the area and distrusts what looks off' } , cover: { v: 'CDMX', l: { es: 'cada zona medida con datos abiertos de la FGJ y el DENUE', en: 'every area measured with open FGJ and DENUE data' } } },
  { id: 'einstein', org: 'epa', status: 'prod', name: { es: 'Einstein', en: 'Einstein' }, hook: { es: 'La base de conocimiento de la agencia. La primera versión no la usamos ni nosotros', en: 'The agency’s knowledge base. Not even we used the first version' } , cover: { v: 'v1', l: { es: 'lo que aprendí cuando la primera versión no se usó', en: 'what I learned when the first version went unused' } } },
  { id: 'vocatio', org: 'own', shot: 'vocatio', status: 'wip', name: { es: 'Vocatio', en: 'Vocatio' }, hook: { es: 'Busca vacantes, prepara tu CV y sigue tu correo mientras buscas trabajo', en: 'Finds openings, tailors your CV and tracks your inbox while you job hunt' } , cover: { v: 'MX', l: { es: 'vacantes, CV y correo para profesionistas en México', en: 'jobs, CVs and email for professionals in Mexico' } } },
  { id: 'prompts', org: 'epa', status: 'prod', name: { es: 'Librería de Prompts', en: 'Prompt Library' }, hook: { es: 'Un solo lugar para los prompts de 170 personas', en: 'One home for the prompts of 170 people' } , cover: { v: '170', l: { es: 'personas con acceso desde el lanzamiento', en: 'people with access from launch' } } },
  { id: 'fundamentum', org: 'own', shot: 'fundamentum', name: { es: 'Fundamentum', en: 'Fundamentum' }, hook: { es: 'El código que comparten Iterum, Domi y Vocatio', en: 'The code Iterum, Domi and Vocatio share' } , cover: { v: '3', l: { es: 'apps sobre el mismo chasis', en: 'apps on the same chassis' } } },
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
        videoTitle: 'Einstein: por qué no usamos la primera versión',
        problemTitle: 'Una base de conocimiento de la agencia, en la línea de Obsidian o NotebookLM.',
        problemBody: 'La idea era reunir lo que sabe la agencia en documentos que personas e IA pudieran consultar, con citas, y llevarlo hasta Claude, donde ya trabaja la gente.',
        nodes: [['ext', 'Equipo de la agencia', 'personas'], ['svc', 'Documentos', 'Markdown · [[enlaces]] · grafo'], ['focus', 'Búsqueda y chat', 'Qdrant · Claude en Vertex AI'], ['svc', 'Conector MCP', 'Claude.ai y Desktop']],
        diagramNote: 'Desplegado con Docker Compose en Compute Engine',
        steps: ['Cada documento es Markdown, con [[enlaces]] entre notas y un grafo para navegarlas.', 'La búsqueda semántica arma el contexto y el chat responde con citas.', 'Un conector MCP lleva la misma base a Claude.ai y Claude Desktop.'],
        decisions: [
          { title: 'Toda respuesta trae citas.', body: 'El chat enlaza los documentos de donde sacó cada afirmación, para que cualquiera pueda revisarla.' },
          { title: 'Einstein también vive dentro de Claude.', body: 'Además de la web, un conector MCP deja consultar la misma base desde Claude.ai y Claude Desktop, sin cambiar de herramienta.' },
          { title: 'Quitamos el trámite de publicar.', body: 'En septiembre de 2026 eliminamos los roles y el flujo de borrador, revisión y publicación. Ahora todo es personal salvo lo que tú decidas publicar.', before: 'Borrador → en revisión → publicado.', after: 'Todo es personal salvo lo que publiques.' },
        ],
        quote: 'Si nosotros, que lo desarrollamos, no lo usábamos, probablemente nuestros usuarios tampoco.',
        quoteCap: 'Momento clave · la primera versión',
        figures: [],
        resultText: 'La primera versión no se usó porque ya trabajábamos con Obsidian, que hace muy bien ese trabajo; yo lo sigo usando para lo personal. Einstein quedó desplegado, con chat con citas y conector MCP, y hoy es uno de los OKR de EPA. En septiembre de 2026 se quitaron los roles y el flujo de aprobación para simplificar el modelo de permisos.',
        shots: ['Documento con [[enlaces]] y grafo', 'Chat con citas', 'Conector MCP en Claude'],
        role: 'Product owner.',
        roleNote: 'Definí arquitectura, permisos y roadmap; lo construyó un desarrollador de mi equipo.',
      },
      en: {
        short: 'Einstein',
        stack: ['FastAPI', 'React', 'Qdrant', 'Claude · Vertex AI', 'MCP'],
        videoTitle: 'Einstein: why we didn’t use the first version',
        problemTitle: 'A knowledge base for the agency, along the lines of Obsidian or NotebookLM.',
        problemBody: 'The idea was to gather what the agency knows into documents that people and AI could query, with citations, and bring it into Claude, where people already work.',
        nodes: [['ext', 'Agency team', 'people'], ['svc', 'Documents', 'Markdown · [[links]] · graph'], ['focus', 'Search and chat', 'Qdrant · Claude on Vertex AI'], ['svc', 'MCP connector', 'Claude.ai and Desktop']],
        diagramNote: 'Deployed with Docker Compose on Compute Engine',
        steps: ['Every document is Markdown, with [[links]] between notes and a graph to browse them.', 'Semantic search builds the context and the chat answers with citations.', 'An MCP connector brings the same base into Claude.ai and Claude Desktop.'],
        decisions: [
          { title: 'Every answer comes with citations.', body: 'The chat links the documents behind each claim, so anyone can check it.' },
          { title: 'Einstein also lives inside Claude.', body: 'Besides the web app, an MCP connector lets people query the same base from Claude.ai and Claude Desktop without switching tools.' },
          { title: 'We dropped the publishing paperwork.', body: 'In September 2026 we removed roles and the draft, review and publish flow. Now everything is personal unless you choose to publish it.', before: 'Draft → in review → published.', after: 'Everything is personal unless you publish it.' },
        ],
        quote: 'If we, the people who built it, weren’t using it, our users probably wouldn’t either.',
        quoteCap: 'Key moment · the first version',
        figures: [],
        resultText: 'The first version went unused because we already worked in Obsidian, which does that job very well; I still use it for personal notes. Einstein shipped, with cited chat and an MCP connector, and today it’s one of EPA’s OKRs. In September 2026 roles and the approval flow were removed to simplify the permission model.',
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
        problemTitle: 'Iterum empezó en septiembre de 2026 como una página que dibujaba un itinerario en Google Maps a partir de un JSON.',
        problemBody: 'Para pasar de una lista de lugares a un plan que se pueda cumplir hacía falta más. Iterum pone a un equipo de agentes a armar el plan, verifica cada lugar antes de mostrártelo y te deja decidir cada cambio.',
        nodes: [['ext', 'Viajero', 'chat'], ['focus', 'Concierge', 'única voz'], ['svc', 'Especialistas', 'tarjetas firmadas'], ['svc', 'Auditoría', 'factibilidad · semáforo']],
        diagramNote: 'Desplegada en Cloud Run',
        steps: ['Hablas solo con Concierge.', 'Los especialistas preparan tarjetas firmadas; Concierge te las presenta como propuestas.', 'Antes de mostrar el plan, una auditoría de factibilidad lo marca con semáforo.'],
        decisions: [
          { title: 'En el chat escribe un solo agente.', body: 'Los especialistas trabajan detrás y firman sus tarjetas en el plan. En el chat escribe uno solo, para que nunca tengas que adivinar quién te está hablando.' },
          { title: 'Cada cambio pide tu aprobación.', body: 'Cada cambio que propone un agente llega con Aceptar, Editar y Rechazar, y una vista de antes y después. Dinero y compromisos siempre piden aprobación explícita.', before: 'El asistente cambia el plan.', after: 'Tú decides cada cambio.' },
          { title: 'Cada lugar se verifica en Google Places.', body: 'Cada lugar se verifica contra Google Places antes de entrar al plan, y una auditoría de factibilidad marca el itinerario con semáforo, ícono y explicación. Si algo no se encuentra, Iterum lo dice.' },
        ],
        figures: [{ v: '0', l: 'lugares inventados en los itinerarios' }],
        noUsageText: 'Todavía no hay cifras de uso.',
        resultText: 'Desplegada en Cloud Run.',
        shots: ['Concierge y tarjetas firmadas', 'Propuesta · Aceptar · Editar · Rechazar', 'Auditoría de factibilidad · semáforo'],
        role: 'Proyecto propio.',
        roleNote: 'Producto, agentes y despliegue.',
      },
      en: {
        short: 'Iterum',
        stack: ['Next.js', 'Firestore', 'Google Maps', 'Cloud Run', 'Agents'],
        videoTitle: 'Iterum: one proposal, start to finish',
        problemTitle: 'Iterum started in September 2026 as a page that drew an itinerary on Google Maps from a JSON file.',
        problemBody: 'Getting from a list of places to a plan you can actually follow took more than that. Iterum has a team of agents build the plan, checks every place before showing it and lets you decide on every change.',
        nodes: [['ext', 'Traveler', 'chat'], ['focus', 'Concierge', 'single voice'], ['svc', 'Specialists', 'signed cards'], ['svc', 'Audit', 'feasibility · traffic light']],
        diagramNote: 'Deployed on Cloud Run',
        steps: ['You only talk to Concierge.', 'Specialists prepare signed cards; Concierge presents them to you as proposals.', 'Before showing the plan, a feasibility audit marks it with a traffic light.'],
        decisions: [
          { title: 'Only one agent writes in the chat.', body: 'Specialists work behind the scenes and sign their cards in the plan. Only one voice writes in the chat, so you never have to guess who is talking.' },
          { title: 'Every change asks for your approval.', body: 'Every change an agent proposes comes with Accept, Edit and Reject, plus a before-and-after view. Money and commitments always need explicit approval.', before: 'The assistant changes the plan.', after: 'You decide every change.' },
          { title: 'Every place is checked on Google Places.', body: 'Every place is checked against Google Places before it enters the plan, and a feasibility audit marks the itinerary with a traffic light, icon and explanation. If something can’t be found, Iterum says so.' },
        ],
        figures: [{ v: '0', l: 'invented places in itineraries' }],
        noUsageText: 'No usage figures yet.',
        resultText: 'Deployed on Cloud Run.',
        shots: ['Concierge and signed cards', 'Proposal · Accept · Edit · Reject', 'Feasibility audit · traffic light'],
        role: 'Personal project.',
        roleNote: 'Product, agents and deployment.',
      },
    },
  },
};

export const caseNum = (id: string) => String(cases.findIndex((c) => c.id === id) + 1).padStart(2, '0');
export const hasPage = (id: string) => id in details;

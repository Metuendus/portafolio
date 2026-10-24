import type { Lang } from '../i18n/ui';

export type Org = 'epa' | 'own';
export type Status = 'prod' | 'wip' | 'post' | 'exp';
export type NodeKind = 'ext' | 'svc' | 'focus';

export interface CaseSummary {
  id: string;
  /** Color de captura placeholder; vacío usa la superficie del tema. */
  shot?: 'iterum' | 'domi' | 'vocatio' | 'fundamentum';
  org: Org;
  status?: Status;
  name: Record<Lang, string>;
  hook: Record<Lang, string>;
}

export interface Figure { v: string; l: string; source?: string }
export interface Decision { what: string; alt?: string; why: string; before?: string; after?: string }

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
  lead: string;
  decisions: Decision[];
  quote: string;
  quoteCap: string;
  figures: Figure[];
  noUsageText?: string;
  resultText: string;
  shots: string[];
  role: string;
  roleNote: string;
  nextText?: string;
}

export interface CaseDetail {
  poster: 'iterum' | 'einstein';
  content: Record<Lang, CaseContent>;
}

/** Orden de los 8 casos: alterna EPA y Propia (README §4 · Casos). */
export const cases: CaseSummary[] = [
  { id: 'mcp', org: 'epa', status: 'prod', name: { es: 'Servidor MCP de medios', en: 'Media MCP server' }, hook: { es: 'Automatiza el criterio, no la tarea', en: 'Automate judgment, not the task' } },
  { id: 'iterum', org: 'own', shot: 'iterum', status: 'prod', name: { es: 'Iterum', en: 'Iterum' }, hook: { es: 'Una agencia de viajes personal, no un cuaderno con asistente', en: 'A personal travel agency, not a notebook with an assistant' } },
  { id: 'dash', org: 'epa', status: 'prod', name: { es: 'Dashboards y Hopper', en: 'Dashboards and Hopper' }, hook: { es: 'De un Excel de 993 filas a QA guiado', en: 'From a 993-row spreadsheet to guided QA' } },
  { id: 'domi', org: 'own', shot: 'domi', status: 'wip', name: { es: 'Domi', en: 'Domi' }, hook: { es: 'No es un buscador con chatbot: los agentes juzgan y explican', en: 'Not a search engine with a chatbot: agents judge and explain' } },
  { id: 'einstein', org: 'epa', status: 'post', name: { es: 'Einstein, un postmortem', en: 'Einstein, a postmortem' }, hook: { es: 'Construimos el cerebro de la agencia y nadie lo usó', en: 'We built the agency’s brain and nobody used it' } },
  { id: 'vocatio', org: 'own', shot: 'vocatio', status: 'wip', name: { es: 'Vocatio', en: 'Vocatio' }, hook: { es: 'Tu equipo trabaja hasta que te llamen', en: 'Your team keeps working until they call you' } },
  { id: 'prompts', org: 'epa', status: 'prod', name: { es: 'Librería de Prompts', en: 'Prompt Library' }, hook: { es: 'Un solo lugar para los prompts de 170 personas', en: 'One home for the prompts of 170 people' } },
  { id: 'fundamentum', org: 'own', shot: 'fundamentum', name: { es: 'Fundamentum', en: 'Fundamentum' }, hook: { es: 'Un chasis para tres apps', en: 'One chassis for three apps' } },
];

export const details: Record<string, CaseDetail> = {
  einstein: {
    poster: 'einstein',
    // Solo lo que respalda el repo EPA-Einstein (perfil v1.1.1, §7.2).
    content: {
      es: {
        short: 'Einstein',
        stack: ['FastAPI', 'React', 'Qdrant', 'Claude · Vertex AI', 'MCP'],
        videoTitle: 'Einstein: qué construimos y por qué nadie lo usó',
        problemTitle: 'Una base de conocimiento de la agencia, en la línea de Obsidian o NotebookLM.',
        problemBody: 'La idea era reunir lo que sabe la agencia en documentos que personas e IA pudieran consultar, con citas, y llevarlo hasta Claude, donde ya trabaja la gente.',
        nodes: [['ext', 'Equipo de la agencia', 'personas'], ['svc', 'Documentos', 'Markdown · [[enlaces]] · grafo'], ['focus', 'Búsqueda y chat', 'Qdrant · Claude en Vertex AI'], ['svc', 'Conector MCP', 'Claude.ai y Desktop']],
        diagramNote: 'Desplegado con Docker Compose en Compute Engine',
        steps: ['Cada documento es Markdown, con [[enlaces]] entre notas y un grafo para navegarlas.', 'La búsqueda semántica arma el contexto y el chat responde con citas.', 'Un conector MCP lleva la misma base a Claude.ai y Claude Desktop.'],
        lead: 'Decidimos',
        decisions: [
          { what: 'que cada respuesta del chat lleve citas', alt: 'respuestas sin fuente', why: 'para poder revisar de dónde sale cada afirmación.' },
          { what: 'abrir la base por MCP', alt: 'quedarnos solo en la web', why: 'para consultarla desde Claude sin cambiar de herramienta.' },
          { what: 'quitar roles y flujo de aprobación', alt: 'mantener borrador, revisión y publicación', why: 'y pasar a un modelo donde todo es personal salvo lo que publiques.', before: 'Borrador → en revisión → publicado.', after: 'Todo es personal salvo lo que publiques.' },
        ],
        quote: 'Construimos el cerebro de la agencia y nadie lo usó. Ni los tres fundadores.',
        quoteCap: 'Momento clave · la adopción',
        figures: [],
        resultText: 'Quedó desplegado, con chat con citas y conector MCP. En septiembre de 2026 se quitaron los roles y el flujo de aprobación para simplificar el modelo de permisos.',
        shots: ['Documento con [[enlaces]] y grafo', 'Chat con citas', 'Conector MCP en Claude'],
        role: 'Product owner.',
        roleNote: 'Definí arquitectura, permisos y roadmap; lo construyó un desarrollador de mi equipo.',
      },
      en: {
        short: 'Einstein',
        stack: ['FastAPI', 'React', 'Qdrant', 'Claude · Vertex AI', 'MCP'],
        videoTitle: 'Einstein: what we built and why nobody used it',
        problemTitle: 'A knowledge base for the agency, along the lines of Obsidian or NotebookLM.',
        problemBody: 'The idea was to gather what the agency knows into documents that people and AI could query, with citations, and bring it into Claude, where people already work.',
        nodes: [['ext', 'Agency team', 'people'], ['svc', 'Documents', 'Markdown · [[links]] · graph'], ['focus', 'Search and chat', 'Qdrant · Claude on Vertex AI'], ['svc', 'MCP connector', 'Claude.ai and Desktop']],
        diagramNote: 'Deployed with Docker Compose on Compute Engine',
        steps: ['Every document is Markdown, with [[links]] between notes and a graph to browse them.', 'Semantic search builds the context and the chat answers with citations.', 'An MCP connector brings the same base into Claude.ai and Claude Desktop.'],
        lead: 'We decided',
        decisions: [
          { what: 'that every chat answer carries citations', alt: 'answers without a source', why: 'so you can check where each claim comes from.' },
          { what: 'to open the base over MCP', alt: 'staying web-only', why: 'so people could query it from Claude without switching tools.' },
          { what: 'to remove roles and the approval flow', alt: 'keeping draft, review and publish', why: 'and move to a model where everything is personal unless you publish it.', before: 'Draft → in review → published.', after: 'Everything is personal unless you publish it.' },
        ],
        quote: 'We built the agency’s brain and nobody used it. Not even the three founders.',
        quoteCap: 'Key moment · adoption',
        figures: [],
        resultText: 'It shipped, with cited chat and an MCP connector. In September 2026 roles and the approval flow were removed to simplify the permission model.',
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
        problemTitle: 'Planear un viaje con IA suele acabar en un cuaderno con asistente.',
        problemBody: 'Notas sueltas, lugares que no existen y nadie que revise si el plan es factible. Iterum funciona como una agencia de viajes personal: propone, verifica y espera tu decisión.',
        nodes: [['ext', 'Viajero', 'chat'], ['focus', 'Concierge', 'única voz'], ['svc', 'Especialistas', 'tarjetas firmadas'], ['svc', 'Auditoría', 'factibilidad · semáforo']],
        diagramNote: 'Desplegada en Cloud Run',
        steps: ['Hablas solo con Concierge.', 'Los especialistas preparan tarjetas firmadas; Concierge te las presenta como propuestas.', 'Antes de mostrar el plan, una auditoría de factibilidad lo marca con semáforo.'],
        lead: 'Decidí',
        decisions: [
          { what: 'que Concierge sea la única voz', alt: 'varios agentes hablándote a la vez', why: 'y los especialistas trabajan detrás, firmando sus tarjetas.' },
          { what: 'que todo cambio llegue como propuesta', alt: 'editar el itinerario por su cuenta', why: 'con tres salidas: Aceptar · Editar · Rechazar.', before: 'El asistente cambia el plan.', after: 'Tú decides cada cambio.' },
          { what: 'auditar la factibilidad con semáforo', why: 'y no mostrar lugares que no se pudieron verificar.' },
        ],
        quote: 'Iterum propone; tú aceptas, editas o rechazas.',
        quoteCap: 'Momento clave · la primera propuesta',
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
        problemTitle: 'Planning a trip with AI usually ends in a notebook with an assistant.',
        problemBody: 'Loose notes, places that don’t exist and nobody checking whether the plan is feasible. Iterum works like a personal travel agency: it proposes, verifies and waits for your decision.',
        nodes: [['ext', 'Traveler', 'chat'], ['focus', 'Concierge', 'single voice'], ['svc', 'Specialists', 'signed cards'], ['svc', 'Audit', 'feasibility · traffic light']],
        diagramNote: 'Deployed on Cloud Run',
        steps: ['You only talk to Concierge.', 'Specialists prepare signed cards; Concierge presents them to you as proposals.', 'Before showing the plan, a feasibility audit marks it with a traffic light.'],
        lead: 'I decided',
        decisions: [
          { what: 'to make Concierge the only voice', alt: 'several agents talking to you at once', why: 'and to have the specialists work behind it, signing their cards.' },
          { what: 'that every change arrives as a proposal', alt: 'editing the itinerary on its own', why: 'with three ways out: Accept · Edit · Reject.', before: 'The assistant changes the plan.', after: 'You decide every change.' },
          { what: 'to audit feasibility with a traffic light', why: 'and not show places that couldn’t be verified.' },
        ],
        quote: 'Iterum proposes; you accept, edit or reject.',
        quoteCap: 'Key moment · the first proposal',
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

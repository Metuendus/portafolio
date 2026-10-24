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
  { id: 'mcp', org: 'epa', name: { es: 'Servidor MCP de medios', en: 'Media MCP server' }, hook: { es: 'Automatiza el criterio, no la tarea', en: 'Automate judgment, not the task' } },
  { id: 'iterum', org: 'own', shot: 'iterum', status: 'prod', name: { es: 'Iterum', en: 'Iterum' }, hook: { es: 'Una agencia de viajes personal, no un cuaderno con asistente', en: 'A personal travel agency, not a notebook with an assistant' } },
  { id: 'dash', org: 'epa', name: { es: 'Dashboards y Hopper', en: 'Dashboards and Hopper' }, hook: { es: 'De un Excel de 993 filas a QA guiado', en: 'From a 993-row spreadsheet to guided QA' } },
  { id: 'domi', org: 'own', shot: 'domi', name: { es: 'Domi', en: 'Domi' }, hook: { es: 'No es un buscador con chatbot: los agentes juzgan y explican', en: 'Not a search engine with a chatbot: agents judge and explain' } },
  { id: 'einstein', org: 'epa', status: 'post', name: { es: 'Einstein, un postmortem', en: 'Einstein, a postmortem' }, hook: { es: 'Construimos el cerebro de la agencia y nadie lo usó', en: 'We built the agency’s brain and nobody used it' } },
  { id: 'vocatio', org: 'own', shot: 'vocatio', name: { es: 'Vocatio', en: 'Vocatio' }, hook: { es: 'Tu equipo trabaja hasta que te llamen', en: 'Your team keeps working until they call you' } },
  { id: 'prompts', org: 'epa', name: { es: 'Librería de Prompts', en: 'Prompt Library' }, hook: { es: 'Cada prompt documenta su impacto', en: 'Every prompt documents its impact' } },
  { id: 'fundamentum', org: 'own', shot: 'fundamentum', name: { es: 'Fundamentum', en: 'Fundamentum' }, hook: { es: 'Un chasis para tres apps', en: 'One chassis for three apps' } },
];

export const details: Record<string, CaseDetail> = {
  einstein: {
    poster: 'einstein',
    content: {
      es: {
        short: 'Einstein',
        stack: ['Outline'],
        videoTitle: 'Einstein: qué construimos y por qué nadie lo usó',
        problemTitle: 'Un cerebro de la agencia que respetara quién puede ver qué.',
        problemBody: 'La idea era reunir el conocimiento de la agencia en un solo lugar que personas e IA pudieran consultar, sin que nadie viera lo que no le toca.',
        nodes: [['ext', 'Equipo de la agencia', 'personas'], ['svc', 'Outline', 'permisos en 4 niveles'], ['focus', 'Recuperación', 'RAG · GraphRAG · LLM Wiki'], ['svc', 'Asistente de IA', 'respuesta con contexto']],
        diagramNote: 'Evaluación: golden set de 30 preguntas en 10 categorías',
        steps: ['Los documentos viven en Outline, la v1, con permisos en 4 niveles.', 'Una capa de recuperación arma el contexto. Comparamos RAG, GraphRAG y LLM Wiki.', 'Cada arquitectura se mide contra el mismo golden set de 30 preguntas.'],
        lead: 'Decidimos',
        decisions: [
          { what: 'construir la v1 sobre Outline', why: 'con permisos en 4 niveles desde el primer día.' },
          { what: 'elegir la arquitectura con un golden set', alt: 'elegirla por intuición', why: 'de 30 preguntas en 10 categorías.', before: 'RAG, GraphRAG y LLM Wiki sobre la mesa, sin medir.', after: 'Mismas 30 preguntas para las tres: 6–8K contra 15–30K tokens por consulta.' },
          { what: 'reencuadrar el producto a «compartir y auditar contexto de IA»', alt: 'insistir con el cerebro de la agencia', why: 'porque la adopción fue cero, incluidos los tres fundadores. Quedó en ADR-001.', before: 'El cerebro de la agencia.', after: 'Compartir y auditar contexto de IA.' },
        ],
        quote: 'Construimos el cerebro de la agencia y nadie lo usó. Ni los tres fundadores.',
        quoteCap: 'Momento clave · adopción cero',
        figures: [
          { v: '0', l: 'personas lo usaron, incluidos los tres fundadores' },
          { v: '30', l: 'preguntas en 10 categorías en el golden set' },
          { v: '6–8K', l: 'tokens por consulta, contra 15–30K de la alternativa más pesada' },
        ],
        resultText: 'El producto se reencuadró a «compartir y auditar contexto de IA». La decisión y su razonamiento están en ADR-001.',
        shots: ['Outline · permisos por nivel', 'Golden set · 30 preguntas en 10 categorías', 'ADR-001 · reencuadre'],
        role: 'Product owner.',
        roleNote: 'Otra persona construyó.',
        nextText: 'Compartir y auditar contexto de IA, según ADR-001.',
      },
      // Traducción propia siguiendo el patrón del handoff (README §4 la marca como pendiente): revisar antes de publicar.
      en: {
        short: 'Einstein',
        stack: ['Outline'],
        videoTitle: 'Einstein: what we built and why nobody used it',
        problemTitle: 'An agency brain that respected who can see what.',
        problemBody: 'The idea was to bring the agency’s knowledge into one place that people and AI could query, without anyone seeing what they shouldn’t.',
        nodes: [['ext', 'Agency team', 'people'], ['svc', 'Outline', '4-level permissions'], ['focus', 'Retrieval', 'RAG · GraphRAG · LLM Wiki'], ['svc', 'AI assistant', 'answer with context']],
        diagramNote: 'Evaluation: golden set of 30 questions in 10 categories',
        steps: ['Documents live in Outline, the v1, with 4-level permissions.', 'A retrieval layer builds the context. We compared RAG, GraphRAG and LLM Wiki.', 'Each architecture is measured against the same 30-question golden set.'],
        lead: 'We decided',
        decisions: [
          { what: 'to build the v1 on Outline', why: 'with 4-level permissions from day one.' },
          { what: 'to choose the architecture with a golden set', alt: 'choosing it by gut feeling', why: 'of 30 questions in 10 categories.', before: 'RAG, GraphRAG and LLM Wiki on the table, unmeasured.', after: 'Same 30 questions for all three: 6–8K vs 15–30K tokens per query.' },
          { what: 'to reframe the product as “sharing and auditing AI context”', alt: 'pushing on with the agency’s brain', why: 'because adoption was zero, the three founders included. It’s recorded in ADR-001.', before: 'The agency’s brain.', after: 'Sharing and auditing AI context.' },
        ],
        quote: 'We built the agency’s brain and nobody used it. Not even the three founders.',
        quoteCap: 'Key moment · zero adoption',
        figures: [
          { v: '0', l: 'people used it, the three founders included' },
          { v: '30', l: 'questions in 10 categories in the golden set' },
          { v: '6–8K', l: 'tokens per query, vs 15–30K for the heaviest alternative' },
        ],
        resultText: 'The product was reframed as “sharing and auditing AI context”. The decision and its reasoning are in ADR-001.',
        shots: ['Outline · permissions by level', 'Golden set · 30 questions in 10 categories', 'ADR-001 · reframing'],
        role: 'Product owner.',
        roleNote: 'Someone else built it.',
        nextText: 'Sharing and auditing AI context, per ADR-001.',
      },
    },
  },
  iterum: {
    poster: 'iterum',
    content: {
      es: {
        short: 'Iterum',
        stack: ['Cloud Run', 'Agentes'],
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
        stack: ['Cloud Run', 'Agents'],
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

# Handoff · josecarloscorona.dev

Portafolio de José Carlos Corona. Astro en Google Cloud. ES por defecto, EN en `/en/`. Tema claro y oscuro.

## Archivos

| Archivo | Contenido |
|---|---|
| `tokens/jc-tokens.css` | Todos los tokens (fuente de verdad) |
| `JC Design System.dc.html` | Ficha técnica: componentes y sus estados |
| `JC Inicio y Proyectos.dc.html` | 1a–1f, 2a–2c |
| `JC Página de caso.dc.html` | 3a–3h (Einstein e Iterum) |
| `JC Secundarias.dc.html` | 4a Sobre mí, 4b Contacto, 4c Escritos, 4d 404, 4g Estados, 4h Open Graph |
| `JC Oscuro e inglés.dc.html` | 4e modo oscuro, 4f inglés + medición de desbordes |

Cada id es un ancla dentro de su archivo (`#3d`, `#3d-iterum`, `#4f`). Los archivos tienen Tweaks: `theme` (light/dark) y `mode` (borrador muestra los «(falta)»; producción los oculta).

---

## 1. Tokens

Prefijo `--jc-`. Claro en `:root`, oscuro en `[data-theme="dark"]`. Fuentes: Instrument Sans 400/500/600/700 y Fragment Mono 400 (Google Fonts).

**Color**

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `ink` | #0B0D0E | #F2F3F4 | Texto principal, botón primario |
| `text-2` | #3A3F44 | #B8BEC4 | Cuerpo |
| `text-3` | #5B6168 | #959CA3 | Meta, mono |
| `canvas` | #FFFFFF | #0E1011 | Fondo de página |
| `surface` | #F5F6F7 | #16191B | Franjas, chips de stack |
| `card` | #FFFFFF | #1A1D20 | Tarjetas, popover |
| `hairline` / `-strong` | #E3E5E8 / #C9CDD2 | #2A2F33 / #3D4349 | Bordes |
| `accent` | #1D5C47 | #6CC5A0 | Pino: links, foco, «foco del caso» |
| `accent-hover` | #154635 | #8AD6B5 | |
| `accent-soft` | #E6F0EC | #16302A | Resaltado, «Después», nodo foco |
| `ok` / `-bg` | #176B3F / #E4F3EA | #6DD39A / #12301F | En producción |
| `warn` / `-bg` | #835000 / #FAF0D7 | #F0B95A / #33260F | En construcción, «(falta)» |
| `risk` / `-bg` | #A3261B / #F9E3E0 | #F2877B / #3A1A17 | Errores de formulario |
| `neutral` / `-bg` | #3A3F44 / #EEF0F2 | #B8BEC4 / #23272B | Postmortem |

Colores de producto (solo en capturas y diagrama): Iterum #1456F0 · Domi #D4421F · Vocatio #2E3F9E. Póster Fundamentum #1D5C47, póster Einstein #23272B.

**Tipografía**

| Rol | Escritorio | Móvil (≤640) |
|---|---|---|
| display | 56/1.05 · 600 · −1.8 (héroe y h1 de caso a 64/−2.2) | 40/−1.2 |
| h1 | 40/1.1 · 600 · −1.2 | 32/−0.9 |
| h2 | 28/1.15 · 600 · −0.6 | 24 |
| h3 | 20/1.25 · 600 · −0.3 | 20 |
| cuerpo | 17/1.6 · 400 (lead 19–24) | 16–17 |
| meta | 14/1.45 · 500 | 14 |
| micro | 12/1.4 · mono | 11–12 |

Cifras siempre `tabular-nums`. Sin cursivas.

**Espacio, forma, sombra, movimiento**: base 4 (`space-1`…`space-24`); tap mínimo 44; contenedor 1200, gutter 32 / 20 móvil. Radios xs 4 · sm 8 · md 12 · lg 16 · xl 24 · pill. Sombras 1 reposo, 2 menús/popover, 3 hover de tarjeta. Duraciones 150 / 200 / 250 ms, ease `(.2,0,0,1)`; con `prefers-reduced-motion` todo a 0.

---

## 2. Componentes

| Componente | Medidas | Estados |
|---|---|---|
| Botón primario | 44 alto (52 héroe, 48 móvil), pill, 600 15 | reposo tinta · hover pino · presionado pino oscuro · foco anillo 2 px · deshabilitado hairline |
| Botón secundario | igual, borde 1 px tinta | hover surface · presionado hairline |
| Link | 600 15, subrayado 1 px, flecha | hover 2 px + flecha +3 px |
| Chip origen | 26–28 alto, contorno | EPA (edificio) · Propia (persona). Informativo |
| Chip estado | 26–28, fondo suave + ícono | En producción · En construcción · Postmortem |
| Chip stack | 24, radio 6, mono 12 | máx. 3 |
| Segmentado (filtro, idioma, tema) | 40 escritorio / 44 móvil | activo: card + shadow-1, `aria-pressed` |
| Tarjeta de caso | padding 8, radio 16, captura 16:10 radio 12 | hover/foco: shadow-3, borde fuerte, captura 103 %, flecha +4 |
| Fila de caso alternada (1c) | captura 620, gap 64 | igual que tarjeta |
| Bloque de cifra | 56/600 (40 móvil) + etiqueta + «Fuente:» mono | sin fuente → «Fuente: (falta)» punteado warn; sin cifra → frase plana |
| Bloque de decisión | card radio 16, padding 28/32 | alternativa tachada y Antes→Después opcionales |
| Cita | 64 (40 en ficha, 32 móvil), comillas pino, filete 2 px | una por caso |
| Diagrama | panel surface con retícula 16 px; nodos 164 flexibles | Servicio · Foco del caso (pino 2 px) · Externo (punteado) |
| Video con fachada | 16:9, radio 24 (16 móvil), botón 72–88 | póster → cargando → iframe; error a los 8 s |
| Propuesta del agente | popover 300, radio 12, shadow-2 | proponiendo → aplicado / descartado → repetir |
| Nav | 72 escritorio, 60 + 44 de status móvil | actual: subrayado pino 2 px; hover surface |
| Menú móvil | pantalla completa, filas 64 | foco atrapado, Esc cierra |
| Captura placeholder | rayado 135°, etiqueta PLACEHOLDER · CLARO/OSCURO | imagen que falla: icono + alt + Reintentar |

---

## 3. Pantallas

Escritorio 1440 (padding lateral 120). Móvil 402 × 874, gutter 20, scroll interno en el marco.

### Inicio
- **1a Héroe** — nav 72; padding 128/136; h1 64 máx. 1000; bajada 20/1.55 máx. 720; botones 52. Microinteracción: a 1,4 s el cursor «agente» viaja (700 ms) a «todos los días», lo resalta y abre la propuesta. Aceptar subraya en pino 5 px; Descartar no cambia nada; ambos ofrecen «Repetir». Reduced-motion: aparece sin recorrido.
- **1b Tesis** — 3 columnas, filete 2 px, h3 28.
- **1c Casos** — 8 filas alternadas, gancho 32.
- **1d Chasis** — fondo surface, diagrama + video 60 s.
- **1e Cierre** — h2 56, línea 24, Contacto + LinkedIn 52, pie mono.
- **1f Móvil** — mismo orden; botones a ancho completo 48.

### Proyectos
- **2a Índice** — h1 56; filtro Todos 8 · EPA 4 · Propios 4; rejilla 4 × 2, gap 24.
- **2b También construí** — columna 320 + lista numerada, filas 22 px de padding.
- **2c Móvil** — filtro 3 × 44 a ancho completo, tarjetas apiladas.

### Página de caso (plantilla)
Columna de título 280 + contenido, gap 64; secciones con padding 96.
- **3a Encabezado** — migas + «NN / 08», h1 64, gancho 24, chips, video 16:9 con barra de capítulos Problema · Momento clave · Resultado.
- **3b Problema** — enunciado 40 + párrafo 19, máx. 760.
- **3c Cómo funciona** — diagrama + 3 pasos.
- **3d Tres decisiones** — fondo surface, 3 bloques de decisión.
- **3e Momento clave** — cita 64, padding 120.
- **3f Resultado** — 3 cifras o cifra + frase plana; párrafo 19.
- **3g Galería** — 3 pares claro/oscuro 16:10 (9:16 en móvil).
- **3h Rol y qué sigue** — 2 tarjetas + anterior/siguiente según el índice + pie.

### Secundarias
- **4a Sobre mí** — h1 56 + intro 24; línea de tiempo horizontal de 6 hitos (vertical en móvil), punto pino para Verne y tinta llena para «Hoy»; cita de Verne 44; Stack (filas 140 + chips) y Certificaciones.
- **4b Contacto** — h1 64; dos filas grandes (valor 36): correo con «Copiar» → «Copiado» 2 s (`aria-live`), LinkedIn con flecha. Sin formulario.
- **4c Escritos** — vacío: «Pronto.» 64 + texto + Ver proyectos. Con artículos: filas fecha 140 · título 28 + bajada 17 + relacionado.
- **4d 404** — «404» 220 (120 móvil) como bloque de cifra con fuente; propuesta del agente: Aceptar lleva a Proyectos, Descartar responde con humor y ofrece «Mejor al inicio».
- **4e Oscuro** — Inicio y caso Einstein con `data-theme="dark"`, escritorio y móvil.
- **4f Inglés** — Home y Case Iterum en EN. Arriba, informe en vivo: nodos con desborde horizontal (scrollWidth vs clientWidth) y tabla de longitudes ES/EN de los textos más largos. Reglas: nada de `nowrap` en textos, nodos de diagrama flexibles, títulos con `text-wrap: balance`.
- **4g Estados** — video cargando (spinner o «Cargando…» con reduced-motion; error a 8 s con link a YouTube); imagen que falla (marco conserva proporción, alt visible, Reintentar); demo de reduced-motion con selector Normal/Reducido.
- **4h Open Graph** — 1200 × 630, padding 64; columna de texto (monograma 48 + dominio, «NN / 08 · origen», nombre 64, gancho 28, filete pino) + captura 400 de ancho radio 24. Siempre en claro.

---

## 4. Copy final

### Global
| Clave | ES | EN |
|---|---|---|
| nav | Proyectos · Escritos · Sobre mí · Contacto | Projects · Writing · About · Contact |
| pie | Hecho con Astro en Google Cloud · © 2026 · CDMX | Built with Astro on Google Cloud · © 2026 · Mexico City |
| tema | Cambiar a tema oscuro / claro | Switch to dark / light theme |
| leer | Leer el caso | Read the case |
| origen | EPA · Propia | EPA · Personal |
| estado | En producción · En construcción · Postmortem | In production · In progress · Postmortem |
| filtro | Todos · EPA · Propios | All · EPA · Personal |

### Inicio
| Clave | ES | EN |
|---|---|---|
| h1 | Construyo sistemas de IA que la gente usa todos los días, no demos. | I build AI systems people use every day, not demos. |
| bajada | Lidero datos e IA en una agencia de marketing digital de ~190 personas y construyo productos propios con agentes en Google Cloud. 9 años en marketing digital, desde CDMX. | I lead data and AI at a ~190-person digital marketing agency and build my own agent products on Google Cloud. 9 years in digital marketing, based in Mexico City. |
| botones | Ver proyectos · Contacto | View projects · Contact |
| agente | agente · PROPUESTA DEL AGENTE · Subrayar «todos los días». Es lo que separa un sistema de una demo. · Aceptar · Descartar · Aplicado. Tú decidiste. · Descartado. Nada cambió. · Repetir | agent · AGENT PROPOSAL · Underline “every day”. It’s what separates a system from a demo. · Accept · Dismiss · Applied. You decided. · Dismissed. Nothing changed. · Replay |
| tesis | CÓMO TRABAJO · Tres principios | HOW I WORK · Three principles |
| 01 | Proponer, no imponer — El sistema sugiere el cambio; una persona lo acepta o lo descarta. — Lo muestra: Servidor MCP de medios | Propose, don’t impose — The system suggests the change; a person accepts or dismisses it. — See it in: Media MCP server |
| 02 | Toda cifra con fuente — Si un número aparece en pantalla, se puede rastrear de dónde salió. — Lo muestra: Domi | Every figure has a source — If a number shows up on screen, you can trace where it came from. — See it in: Domi |
| 03 | No todo es LLM — Reglas, SQL y estadística primero; el modelo entra donde aporta. — Lo muestra: Dashboards y Hopper | Not everything is an LLM — Rules, SQL and statistics first; the model comes in where it helps. — See it in: Dashboards and Hopper |
| chasis | Un chasis para tres apps · chasis común · Google Cloud · Fundamentum en 60 s | One chassis for three apps · shared chassis · Google Cloud · Fundamentum in 60 s |
| cierre | Soy José Carlos Corona. · Lidero datos e IA en EPA y construyo Iterum, Domi y Vocatio sobre Fundamentum. | I’m José Carlos Corona. · I lead data and AI at EPA and build Iterum, Domi and Vocatio on Fundamentum. |

### Casos
| # | ES | EN |
|---|---|---|
| 01 | Servidor MCP de medios — Automatiza el criterio, no la tarea | Media MCP server — Automate judgment, not the task |
| 02 | Iterum — Una agencia de viajes personal, no un cuaderno con asistente | Iterum — A personal travel agency, not a notebook with an assistant |
| 03 | Dashboards y Hopper — De un Excel de 993 filas a QA guiado | Dashboards and Hopper — From a 993-row spreadsheet to guided QA |
| 04 | Domi — No es un buscador con chatbot: los agentes juzgan y explican | Domi — Not a search engine with a chatbot: agents judge and explain |
| 05 | Einstein, un postmortem — Construimos el cerebro de la agencia y nadie lo usó | Einstein, a postmortem — We built the agency’s brain and nobody used it |
| 06 | Vocatio — Tu equipo trabaja hasta que te llamen | Vocatio — Your team keeps working until they call you |
| 07 | Librería de Prompts — Cada prompt documenta su impacto | Prompt Library — Every prompt documents its impact |
| 08 | Fundamentum — Un chasis para tres apps | Fundamentum — One chassis for three apps |

También construí (ES / EN): Programa de AI Fluency y curso «Dashboards con Claude Code» / AI Fluency program and “Dashboards with Claude Code” course · OpenClaw · GEO y Citation Tracker / GEO and Citation Tracker · Gauss · Migración de OpenAI a Claude / Migration from OpenAI to Claude.

### Página de caso · etiquetas
Problema / Problem · Cómo funciona / How it works · Tres decisiones difíciles / Three hard decisions · DECISIÓN / DECISION · en lugar de / instead of · ANTES / BEFORE · DESPUÉS / AFTER · Resultado / Result · Fuente / Source · Capturas / Screenshots · CLARO / LIGHT · OSCURO / DARK · MI ROL / MY ROLE · QUÉ SIGUE / WHAT’S NEXT · ANTERIOR / PREVIOUS · SIGUIENTE / NEXT · 01 · PROBLEMA · 02 · MOMENTO CLAVE · 03 · RESULTADO / 01 · PROBLEM · 02 · KEY MOMENT · 03 · RESULT · Cuando la haya, va aquí con su fuente. / When there is, it goes here with its source.

### Caso Einstein (ES; EN pendiente de traducir con el mismo patrón)
- Video: Einstein: qué construimos y por qué nadie lo usó
- Problema: Un cerebro de la agencia que respetara quién puede ver qué. / La idea era reunir el conocimiento de la agencia en un solo lugar que personas e IA pudieran consultar, sin que nadie viera lo que no le toca.
- Diagrama: Equipo de la agencia (personas) → Outline (permisos en 4 niveles) → Recuperación (RAG · GraphRAG · LLM Wiki) → Asistente de IA. Nota: Evaluación: golden set de 30 preguntas en 10 categorías.
- Pasos: Los documentos viven en Outline, la v1, con permisos en 4 niveles. · Una capa de recuperación arma el contexto. Comparamos RAG, GraphRAG y LLM Wiki. · Cada arquitectura se mide contra el mismo golden set de 30 preguntas.
- Decisiones: Decidimos **construir la v1 sobre Outline** con permisos en 4 niveles desde el primer día. · Decidimos **elegir la arquitectura con un golden set** en lugar de ~~elegirla por intuición~~ de 30 preguntas en 10 categorías (Antes: RAG, GraphRAG y LLM Wiki sobre la mesa, sin medir. → Después: Mismas 30 preguntas para las tres: 6–8K contra 15–30K tokens por consulta.) · Decidimos **reencuadrar el producto a «compartir y auditar contexto de IA»** en lugar de ~~insistir con el cerebro de la agencia~~ porque la adopción fue cero, incluidos los tres fundadores. Quedó en ADR-001.
- Cita: Construimos el cerebro de la agencia y nadie lo usó. Ni los tres fundadores. — Momento clave · adopción cero
- Cifras: 0 personas lo usaron, incluidos los tres fundadores · 30 preguntas en 10 categorías en el golden set · 6–8K tokens por consulta, contra 15–30K de la alternativa más pesada
- Resultado: El producto se reencuadró a «compartir y auditar contexto de IA». La decisión y su razonamiento están en ADR-001.
- Rol: Product owner. Otra persona construyó. · Qué sigue: Compartir y auditar contexto de IA, según ADR-001.

### Caso Iterum (ES / EN)
| Campo | ES | EN |
|---|---|---|
| video | Iterum: una propuesta, de principio a fin | Iterum: one proposal, start to finish |
| problema | Planear un viaje con IA suele acabar en un cuaderno con asistente. | Planning a trip with AI usually ends in a notebook with an assistant. |
| bajada | Notas sueltas, lugares que no existen y nadie que revise si el plan es factible. Iterum funciona como una agencia de viajes personal: propone, verifica y espera tu decisión. | Loose notes, places that don’t exist and nobody checking whether the plan is feasible. Iterum works like a personal travel agency: it proposes, verifies and waits for your decision. |
| diagrama | Viajero (chat) → Concierge (única voz) → Especialistas (tarjetas firmadas) → Auditoría (factibilidad · semáforo). Desplegada en Cloud Run | Traveler (chat) → Concierge (single voice) → Specialists (signed cards) → Audit (feasibility · traffic light). Deployed on Cloud Run |
| pasos | Hablas solo con Concierge. · Los especialistas preparan tarjetas firmadas; Concierge te las presenta como propuestas. · Antes de mostrar el plan, una auditoría de factibilidad lo marca con semáforo. | You only talk to Concierge. · Specialists prepare signed cards; Concierge presents them to you as proposals. · Before showing the plan, a feasibility audit marks it with a traffic light. |
| decisión 1 | Decidí **que Concierge sea la única voz** en lugar de ~~varios agentes hablándote a la vez~~ y los especialistas trabajan detrás, firmando sus tarjetas. | I decided **to make Concierge the only voice** instead of ~~several agents talking to you at once~~ and to have the specialists work behind it, signing their cards. |
| decisión 2 | **que todo cambio llegue como propuesta** en lugar de ~~editar el itinerario por su cuenta~~ con tres salidas: Aceptar · Editar · Rechazar. (El asistente cambia el plan. → Tú decides cada cambio.) | **that every change arrives as a proposal** instead of ~~editing the itinerary on its own~~ with three ways out: Accept · Edit · Reject. (The assistant changes the plan. → You decide every change.) |
| decisión 3 | **auditar la factibilidad con semáforo** y no mostrar lugares que no se pudieron verificar. | **to audit feasibility with a traffic light** and not show places that couldn’t be verified. |
| cita | Iterum propone; tú aceptas, editas o rechazas. — Momento clave · la primera propuesta | Iterum proposes; you accept, edit or reject. — Key moment · the first proposal |
| cifra | 0 lugares inventados en los itinerarios · Todavía no hay cifras de uso. | 0 invented places in itineraries · No usage figures yet. |
| resultado | Desplegada en Cloud Run. | Deployed on Cloud Run. |
| rol | Proyecto propio. Producto, agentes y despliegue. | Personal project. Product, agents and deployment. |

### Secundarias (ES)
- **Sobre mí**: Empecé en cuentas en 2017 y fui acercándome a los datos: marketing digital, CRO, análisis. Hoy lidero datos e IA en EPA, desde CDMX. · Hitos: 2017 Ejecutivo de cuentas → Analista de marketing digital → CRO → 2019 Analista de datos → 2024 Verne (mi primera herramienta con IA) → Hoy IA y automatización en EPA. · EL ORIGEN · Verne, 2024: «Mi primera herramienta con IA me enseñó que el modelo es la parte fácil; lo difícil es todo lo que lo rodea.» · Stack: Nube (Google Cloud, Cloud Run) · Modelos (Claude, OpenAI) · Agentes (MCP, Claude Code) · Recuperación (RAG, GraphRAG, LLM Wiki) · Web (Astro).
- **Contacto**: Contacto · Por correo o por LinkedIn. Desde CDMX. · CORREO hola@josecarloscorona.dev · Copiar / Copiado · LINKEDIN José Carlos Corona · móvil: Escribir.
- **Escritos**: Pronto. · Escribo sobre lo que aprendo construyendo. Mientras tanto, los casos cuentan lo mismo con más detalle. · Ver proyectos. Muestra: «Lo que aprendí de un producto que nadie usó» y «Proponer, no imponer: agentes que esperan tu Aceptar».
- **404**: 404 · páginas encontradas en esta dirección: ninguna. · Fuente: el servidor, hace un momento · PROPUESTA DEL AGENTE · Esta página no existe. ¿Te llevo a Proyectos? · Aceptar · Descartar → Entendido. Sigues en una página que no existe. Tú decidiste. · Mejor al inicio · Repetir.
- **Estados**: Cargando reproductor… · Cargando… · No se pudo cargar el video · Verlo en YouTube · No se pudo cargar la captura. · Reintentar / Reintentando…

EN de secundarias: About · “I started in accounts in 2017 and moved toward data: digital marketing, CRO, analytics. Today I lead data and AI at EPA, from Mexico City.” · THE ORIGIN · “My first AI tool taught me that the model is the easy part; the hard part is everything around it.” · Contact · “By email or LinkedIn. From Mexico City.” · Copy / Copied · Writing · “Soon.” · “I write about what I learn building. Meanwhile, the cases tell the same story in more detail.” · 404 · “pages found at this address: none.” · “Source: the server, just now” · “This page doesn’t exist. Take you to Projects?” · “Got it. You’re still on a page that doesn’t exist. You decided.” · “Home, then” · “Loading player…” · “Couldn’t load the screenshot.” · Retry.

---

## 5. Recursos que faltan

**Capturas** (claro y oscuro, 16:10 a 2× = 2400 × 1500, más versión móvil 9:16 donde aplique)
- Tarjeta de cada caso (8): Servidor MCP de medios, Iterum, Dashboards y Hopper, Domi, Einstein, Vocatio, Librería de Prompts, Fundamentum.
- Galería Einstein (3): Outline · permisos por nivel · Golden set · ADR-001.
- Galería Iterum (3): Concierge y tarjetas firmadas · Propuesta Aceptar · Editar · Rechazar · Auditoría de factibilidad.
- Galerías de los otros 6 casos (3 c/u).
- Imagen para las 8 tarjetas Open Graph (400 × 502 visibles).

**Videos** (YouTube, ID + póster 1920 × 1080)
- Fundamentum en 60 s (1d).
- Un video de 60–90 s por caso (8), con capítulos Problema · Momento clave · Resultado y sus tiempos.

**Datos y textos**
- Fuente de cada cifra (Einstein: 0, 30, 6–8K/15–30K; Iterum: 0 lugares inventados).
- Qué arquitectura usa 6–8K y cuál 15–30K tokens.
- Años de Analista de marketing digital y de CRO.
- Certificaciones: nombre, emisor, año, link de verificación.
- URL de LinkedIn y confirmar el correo.
- Descripción de una línea para cada «También construí».
- Iterum: qué sigue. Confirmar rol.
- Escritos reales: título, bajada, fecha.
- Confirmar textos que redacté: principios (1b), cierre (1e), Problema / pasos / citas de los casos, intro de Sobre mí.
- Traducción EN del caso Einstein y de los otros 6 casos.
- Logo / favicon definitivo si cambia el monograma JC.

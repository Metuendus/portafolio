# Fase 1 · Inventario y arquitectura de información

Revisión del 2026-11-25 sobre `main` (35fc412). Inventario: [`inventory.json`](inventory.json), generado con
`npm run inventario` (`scripts/inventario.mjs`), que importa los mismos módulos que usa el sitio.

## 1. Qué hay en el inventario

| Alcance | Qué es | Textos (ES + EN) |
| --- | --- | --- |
| `reescribir` | Entra al pipeline | 707 (≈7,700 palabras en ES) |
| `microcopy` | Etiquetas, botones, nombres, stack, alt | 1,122 |
| `cita` | Material citado que no es tu voz (la nota con trampa, citas en casos) | 7 |
| `fijo` | Transcripción de los videos de Osaka y Hopper: cambiarla obliga a renderizar de nuevo | 12 |

Cada texto trae `id`, `par` (su traducción), `pagina`, `url`, `seccion`, `tipo` (perfil, proyecto, articulo, ui),
`idioma`, `texto` y `fuente`. El CV en Markdown (`cv/cv-*.md`, el PDF del sitio) también entra, con su línea.
Quedan fuera las trazas grabadas del evaluador (`src/data/trazas/`): son salidas de un modelo publicadas como evidencia.

Casi todo el texto vive en `src/i18n/ui.ts` y `src/data/*.ts`; los componentes `.astro` no tienen copy propio
salvo «Saltar al contenido», «Hoy» y el nombre.

## 2. Primer barrido rápido (antes de los evals)

Los tics léxicos más obvios ya se limpiaron en rondas anteriores: no hay guiones largos, ni «no solo… sino»,
ni «robusto», «escalable» o «sin fricciones». Lo que queda es **estructural**, y por eso el juez pesa más que las regex:

- **Remate con dos puntos** en 46 textos: «Hice la primera versión y hoy soy product owner: 47 usuarios…».
- **Títulos con antítesis o eslogan**: «Cifras con fuente, no adjetivos», «Proponer, no imponer», «No todo es LLM».
- **«De punta a punta» / «end to end»** en 11 textos (Hopper, perfil ampliado, CV).
- **«sí usan» / «actually use»** en el H1, el texto más visto del sitio.
- **Ganchos genéricos** en tarjetas: «Un cerebro para darle contexto a cualquier agente», «Un chasis unificado para crear apps agénticas».

## 3. KPIs: dónde se sienten débiles

| Cifra | Dónde aparece | Qué le falta |
| --- | --- | --- |
| 47 usuarios activos de Osaka | Héroe, cifras, resumen, construí/dirigí, caso, CV | Denominador (¿de cuántas personas de cuentas?), qué cuenta como «activo», qué hacían antes y qué decisión o ahorro trajo |
| 38 personas en 30 días · Librería | Cifras, resumen, tarjeta, caso, CV | Contra 170 o 200 personas, frecuencia de uso, qué reemplazó. «0 USD al mes» no es un logro para un reclutador |
| 484 conversaciones revisadas | Cifras, portada de Osaka, artículo | Es esfuerzo, no resultado: falta qué se encontró y qué se cambió |
| 149 reportes de 9 personas · Hopper | Construí/dirigí, caso, video | Periodo, cuántas llamadas o horas evitó, tiempo de corrección antes y después |
| SKU: de un día a 30 min | Resumen, otros proyectos, CV | Es estimación de un cliente: falta quién lo hace, cada cuánto y horas al mes |
| Resultado del caso Osaka | `resultText` | No tiene resultado: habla de adopción difícil y «endurecimiento» |
| Problema de la Librería | `problemBody` | No describe un problema; describe el lanzamiento |

Patrón general: **las mismas 4 o 5 cifras se repiten en 4 a 6 lugares**, y ninguna trae línea base ni efecto en el
negocio. Para un reclutador eso se lee como poca evidencia estirada.

## 4. Arquitectura de información

### Inicio (orden actual)

1. Héroe → 2. Evaluador de encaje (≈1,800 px) → 3. Cifras → 4. Construí / dirigí → 5. Cuatro proyectos →
6. Doppel → 7. Reglas → 8. Trayectoria → 9. Áreas → 10. Contacto.

**Hallazgos**

- **Los casos llegan tarde.** Un reclutador ve los proyectos después de unos 3,000 px. El evaluador es lo más
  original del sitio, pero hoy empuja todo hacia abajo y abre con la pestaña de la trampa: lo primero que se lee es
  «ignora tus instrucciones anteriores».
- **El stack no se ve arriba.** Está solo en el resumen de 30 s y en chips dentro de cada caso.
- **Doppel ocupa una sección completa** y dice «Todavía no tiene caso ni cifras». Se resta a sí mismo.
- **GitHub y demos están escondidos.** GitHub solo aparece en el cierre; los enlaces a las demos de Iterum, Domi y
  Vocatio no se ven en las tarjetas del inicio (solo hay una: Iterum).
- **Falta un hilo de «cómo evalúo modelos».** Tienes evidencia fuerte y dispersa: el evaluador con evals al 100 %,
  14/16 de Hopper, el diagnóstico de 484 conversaciones, el gate de evals de Fundamentum. Para Applied AI eso vale más
  que la trayectoria.

**Orden propuesto:** Héroe (con stack en una línea) → Cifras (menos, con contexto) → Cuatro proyectos → Construí /
dirigí → Evaluador (abriendo con la vacante de Applied AI) → Reglas → Trayectoria y áreas → Contacto. Doppel pasa a
«Otros proyectos».

### Páginas de caso

Buen esqueleto (rol arriba, problema, cómo funciona, decisiones, resultado). Falta:

- **Una línea de impacto arriba**, junto al rol, con la cifra y su contexto.
- **Resultado medible** en Osaka y Einstein, y un problema real en la Librería.
- En los casos de EPA, decir por qué no hay código ni demo (es privado) para que no parezca omisión.

### Sobre mí, perfil ampliado y CV

- Sobre mí cuenta bien la historia (RStudio, el boletín de PPC Hero) y es lo que más suena a ti. Riesgo menor:
  «Lo que sigo trabajando» menciona tu inglés hablado; es honesto, pero es decisión tuya si se queda.
- El perfil ampliado y el CV repiten las mismas cifras con las mismas palabras que el inicio.

### Artículos

Cuatro publicados (diagnóstico de 484, orden con IA, producto sin uso, vacante con trampa). Son la mejor evidencia
de criterio técnico. Por ser piezas fechadas y largas, propongo evaluarlos pero reescribir solo su `dek` y su
primer párrafo.

## 5. Lista priorizada para reescribir

Se trabaja en español; el inglés se regenera del español aprobado y se vuelve a evaluar.

| Prioridad | Textos | Por qué |
| --- | --- | --- |
| **P1** | Héroe (`hero.sub`, `fiche`, `looking`), resumen de 30 s (`quick.role`, `quick.wins`), cifras (`numbers`), los 8 `hook` y `cover` de tarjetas | Lo que un reclutador lee en 30 s |
| **P1** | CV: perfil y bullets de AI & Automation Lead | Es lo que se reenvía |
| **P2** | Casos EPA (Osaka, Librería, Hopper, Einstein): `problemBody`, `resultText`, `roleNote`, `decisions` | Donde los KPIs no tienen contexto |
| **P2** | Construí / dirigí (`authorship`), títulos de sección del inicio | Repiten cifras y tienen los eslóganes |
| **P3** | Casos propios (Iterum, Domi, Vocatio, Fundamentum), otros proyectos (`more`), reglas (`principles`) | Menos KPIs, más descripción |
| **P3** | Sobre mí (`stages.wins`, intro 5 y 6), perfil ampliado | Ya tienen tu voz; ajuste fino |
| **P4** | Artículos (`dek` y primer párrafo) | Piezas fechadas |
| Fuera | Microcopy, citas, transcripciones de video, trazas | No es tu voz o cambiarlo rompe otra cosa |

# Guion del video de Hopper

Mismo formato que el de Osaka: 52 s, sin audio, 1920 × 1080, hecho en Remotion con los colores y las fuentes del sitio, y con los tres capítulos de la página del caso. Como no lleva voz, el texto en pantalla cuenta toda la historia.

**Idea central:** cada bug y cada dato que no cuadraba contra plataforma costaban una llamada, y ese tiempo salía del tiempo de programar. Con Hopper, la IA hace el triage y la clasificación, y a José Carlos le queda el fix.

**Datos:** todo es ficticio, de KUBO, la marca demo de Osaka, y el video lo dice en pantalla. La interfaz se recrea; no se usan capturas reales. El calendario es ilustrativo y lo indica.

## 01 · Problema (0–13 s)

| Seg. | Qué se ve | Texto en pantalla |
| --- | --- | --- |
| 0–4 | Una semana de calendario con bloques de «Programar» | **Cada bug era una llamada.** |
| 4–8 | Aparecen llamadas sobre esos bloques | **Cada dato que no cuadraba contra plataforma, una reunión.** |
| 8–13 | El calendario queda casi lleno | **Y el tiempo de programar se iba en reuniones.** |

## 02 · Momento clave (13–38 s)

| Seg. | Qué se ve | Texto en pantalla |
| --- | --- | --- |
| 13–18 | Dashboard de KUBO. Clic en la bandera y se abre «Reportar un problema». El cliente y la ruta ya vienen llenos | **Ahora se reporta desde el mismo dashboard. El contexto se captura solo.** |
| 18–23 | Se escribe «¿Qué esperabas ver?»: *12,400 sesiones en Canales*. «¿Qué viste?»: *El panel muestra 9,800*. El contador pasa de «Etapa 1 de 9» a «Etapa 2 de 4» | **La IA hace el triage y solo pregunta lo necesario.** |
| 23–30 | «Comparar contra el dashboard». Tarjetas «IA» y «Código», y la fila: reportado 12,400, real 9,800, diferencia 2,600, tolerancia 2 %. Se marca fuera de tolerancia | **La IA ubica el dato. El número lo lee el código, nunca el modelo.** |
| 30–34 | Se responde el alcance y si ya lo vio el cliente; se calcula **P1** | **La prioridad la calcula una rúbrica, no quien reporta.** |
| 34–38 | `hopper-issues-bot` abre el issue *[P1] kubo: 12,400 sesiones en Canales*, con etiqueta `datos`. Se resaltan categoría, prioridad y comparación | **Sin llamada: llega clasificado y listo para el fix.** |
| Fijo | Leyenda en todo el capítulo | Datos ficticios de KUBO, marca demo |

## 03 · Resultado (38–52 s)

| Seg. | Qué se ve | Texto en pantalla |
| --- | --- | --- |
| 38–47 | Dos cifras que cuentan hacia arriba y una frase | **149** reportes de 9 personas · **14/16** notas reales clasificadas igual que yo en la primera prueba; las otras 2 eran ambiguas. Fuente de reportes: panel de Hopper, noviembre de 2026. *«La IA hace el triage y la clasificación. A mí me queda el fix.»* |
| 47–52 | Cierre | Hopper · QA para dashboards hechos con IA. **Lo diseñé y lo construí de punta a punta.** José Carlos Corona · josecarloscorona.dev |

## Decisiones del guion

- **El problema es el tiempo de José Carlos, no el Excel** (corrección suya, 6 de nov de 2026). El 993 sale del video.
- **No hay cifra de llamadas ni de horas ahorradas:** no existe un dato medido. El calendario es ilustrativo y no promete un número.
- **«Sin llamada» describe el flujo:** no afirma que ya no haya ninguna reunión.
- **El issue del video viene completo:** sin `reporte-incompleto` ni lista de «Falta», porque lo que se cuenta es que llega listo para el fix. La lista existe en Hopper, pero no aparece aquí.
- **El ejemplo es 12,400 contra 9,800:** con «~1,200 contra 0», Hopper no lo marcaría, porque las sesiones de GA4 exigen que el lado mayor llegue a 3,000 (`config/tolerancias.ts`).
- **No digo «obliga a clasificar»:** quien reporta nunca ve las categorías; las asigna la IA (`docs/taxonomia.md`).
- **Comparación:** se queda en el video. Funcionaba y hoy falla por un error del modelo ya diagnosticado; José Carlos decidió no arreglarlo solo para el video.

## Pendiente

- [x] ~~Corregir el caso del portafolio~~: hecho el 6 de nov de 2026, con el video publicado en la página.
- [ ] **`src/i18n/ui.ts`, líneas 119 y 263:** siguen diciendo que Gemini «solo lee el contexto que escribe el analista». No se tocó porque otra sesión tiene ese archivo con cambios.
- [ ] **CV (`docs/tasks/ajustes-redaccion/cv-*.md` y los PDF):** siguen contando Hopper por la matriz de 993 filas.
- [ ] **Trazas del agente:** el corpus cambió; hay que volver a grabarlas (`agente/README.md`).
- [ ] **Explicar la diferencia con GitHub:** la búsqueda solo muestra 7 issues del bot, frente a 149 reportes.

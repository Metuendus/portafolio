# Escritos: lista (4c) y artículo (4i)

Especificación: `design/design_handoff_portafolio/README.md` (secciones «Escritos · 4i Artículo» y
«Artículo · 4i (ES / EN)»), `JC Artículo.dc.html`, `JC Secundarias.dc.html#4c` y `docs/product/`.

## Alcance

1. `src/data/escritos.ts`: artículos como bloques tipados, en español e inglés, y los textos de la
   sección.
2. `src/components/Writing.astro`: lista 4c, con su estado vacío.
3. `src/components/ArticlePage.astro`: artículo 4i con todos los bloques del handoff.
4. Rutas `/escritos/`, `/escritos/<slug>/`, `/en/writing/` y `/en/writing/<slug>/`.
5. «Escritos» en la navegación cuando hay un artículo publicado, y las páginas en el mapa del sitio.
6. Primer artículo: la vacante con una orden escondida.

## Desviaciones del handoff, acordadas

- **Texto del artículo.** El cuerpo de muestra del handoff no coincide con el evaluador real (habla
  de un CV, de siete requisitos y de una corrida sin la orden que no existe). Se usa el texto
  redactado a partir de `src/data/trazas/trampa.es.json` y `agente/registro.jsonl`.
- **Figura 1.** No hay corrida de la vacante sin la orden, así que la figura es una captura de la
  pestaña de la trampa del sitio, en claro y en oscuro.
- **Tabla.** En vez de las causas de las 6 corridas no publicadas (sería una sola fila), muestra
  los tres requisitos de la vacante con su veredicto.

## Fuera de esta tarea

- Imagen Open Graph por artículo (4i-og). Las páginas usan la imagen general del sitio.
- Anterior y siguiente: el handoff lo deja para cuando haya seis artículos o más.

## Verificación

- `npm run build` sin errores.
- Revisión en navegador a 1440 y 375, en claro y oscuro, en español e inglés.

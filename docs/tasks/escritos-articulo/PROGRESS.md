# Progreso

## Hecho

- `src/data/escritos.ts`: modelo de artículo por bloques, textos de la sección y el primer artículo
  en español e inglés.
- `Writing.astro` (4c) y `ArticlePage.astro` (4i), con los bloques del handoff: texto citado ajeno,
  cifra con fuente, figura con estado de fallo, código, tabla, hallazgo y límites, procedencia y
  cierre.
- Rutas en los dos idiomas, «Artículos» en la navegación y páginas en el mapa del sitio.
- Figura 1: capturas de la pestaña de la trampa en claro y oscuro, en
  `public/capturas/articulos/`.
- `docs/product/screens.md` y `PRD.md` al día con las decisiones del handoff.

## Pendiente

- Imagen Open Graph por artículo (4i-og): hoy se usa la imagen general del sitio.
- El botón de copiar usa el ícono de copiar del sitio; el handoff dibuja un ícono de enlace.
- Si se vuelven a grabar las corridas, revisar las cifras del artículo y repetir las capturas.

## Nombre de la sección

La sección se llama «Artículos» (`/articulos/`, `/en/articles/`). El handoff de Claude Design y el
brief siguen diciendo «Escritos» y «Writing» porque son el registro de lo que se diseñó; donde
digan eso, léase «Artículos» y «Articles».

## Tres artículos más (10 nov 2026)

- «Cómo revisamos 484 conversaciones…», «Poner orden cuando todo el equipo programa con IA» y «Lo
  que aprendí de un producto que nadie usó», en los dos idiomas.
- La franja de procedencia pasa a ser opcional: solo aparece si el artículo cita una fuente de
  datos, y el commit solo si existe.

# Principios de diseño

Reglas reutilizables que los briefs referencian y no repiten. La fuente de verdad visual es
`design/design_handoff_portafolio/` (tokens, componentes y pantallas ya entregadas).

## Idioma y tono
- Español de México, tuteo, y una versión en inglés de cada pantalla. Tono directo, sin hype ni
  emojis. Anglicismos solo los que la gente usa de verdad en el dominio.
- Datos de ejemplo reales del portafolio; nunca lorem ipsum.
- Sin nombres de clientes ni de personas, tampoco en capturas.

## Plataforma
- Sitio estático de lectura: escritorio 1440 primero; móvil 375 siempre.
- Modo oscuro con `[data-theme="dark"]` y los tokens `--jc-`; cada pantalla se entrega en claro y
  en oscuro.
- El inglés cambia el largo de los textos: nada de `nowrap`, títulos con `text-wrap: balance`.

## Tipografía y color
- Instrument Sans para texto y Fragment Mono para datos, fechas y código. Cifras tabulares.
- Sin familias nuevas. Sin degradados azul-morado.
- Nunca un color en hexadecimal fuera de los tokens `--jc-`.

## Accesibilidad
- WCAG 2.1 AA, también sobre imágenes.
- Objetivos táctiles ≥ 44 px.
- Estados siempre con ícono distinto por nivel + etiqueta; nunca solo color.
- Foco visible en todo. `prefers-reduced-motion` apaga las animaciones.
- Un solo `h1` por página y encabezados en orden.

## Interacción
- Un solo botón primario por vista.
- Procedencia visible: toda cifra lleva su fuente y su fecha; lo que no se sabe se dice.
- Movimiento de 150 ms, sin rebotes.

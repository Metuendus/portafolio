# Portafolio · Escritos · PRD

La sección de artículos de josecarloscorona.dev: textos largos sobre cómo construyo y evalúo
sistemas de IA, para quien quiere ver cómo pienso antes de escribirme.

Este PRD cubre solo «Escritos». El resto del sitio ya está en producción y su especificación es
`design/design_handoff_portafolio/README.md`.

## Problema

Los casos del portafolio cuentan qué construí y con qué resultado, pero no hay lugar para explicar
un experimento o una decisión con detalle. Un responsable de contratación técnico que quiere saber
cómo razono sobre evaluaciones o seguridad solo encuentra hoy una sección grabada y el código. La
navegación ya reserva «Escritos», pero está oculta porque no hay contenido.

## Usuario

- **Responsable de contratación técnico o líder de IA.** Llega desde el portafolio o desde un enlace
  directo al artículo. Lee en escritorio, con atención, entre 3 y 8 minutos. Quiere comprobar lo que
  lee: busca el enlace al código y a los datos.
- **Reclutador.** Llega desde LinkedIn o desde el CV, muchas veces en móvil. Lee el título, la
  bajada y el primer párrafo, y decide si reenvía el enlace.

## Propuesta de valor

Cada artículo parte de algo que se puede comprobar en el mismo sitio: una corrida grabada, un caso
o un repositorio. Mantiene las reglas del portafolio: cifras con su fuente, lo que no se sabe dicho
como tal y qué hice yo frente a qué hicieron otros.

## Alcance del MVP

1. Lista de artículos publicados, del más reciente al más antiguo (pantalla 4c, ya diseñada).
2. Página para leer un artículo (pantalla 4i, sin diseño).
3. Cada artículo se publica siempre en español y en inglés, con el mismo cambio de idioma del
   resto del sitio.
4. «Escritos» visible en la navegación cuando hay al menos un artículo publicado.
5. Metadatos para compartir: título, bajada e imagen Open Graph por artículo (formato 4h).
6. Primer artículo: «Escribí una vacante con una orden escondida para la IA».

## Fuera de alcance

- Comentarios, reacciones y contador de lecturas.
- Suscripción por correo y RSS. ⚠️ Por decidir si RSS entra en una segunda fase.
- Etiquetas, categorías, buscador y paginación. Con menos de diez artículos no hacen falta.
- Editor en línea: los artículos se escriben como archivos en el repositorio.
- Artículo destacado en la página de inicio. ⚠️ Por decidir.

## Métricas de éxito

1. Dos artículos publicados antes de que termine 2026.
2. Visitas a un artículo que continúan a un caso, a `/resumen/` o a contacto.
3. Visitas que llegan directo a un artículo desde fuera del sitio.
4. Visitantes que vuelven al sitio en los 30 días siguientes a leer un artículo.

Las métricas 2 a 4 dependen de instalar analítica, que hoy el sitio no tiene.

## Restricciones que afectan la UI

- **Sitio estático.** No hay estado «cargando» de datos; solo de imágenes y video, que ya tienen
  diseño (4g).
- **Dos idiomas.** El inglés suele ser más corto y los títulos cambian de largo: nada de `nowrap`
  y títulos con `text-wrap: balance`, como en el resto del sitio.
- **Datos fechados.** Las cifras de un artículo salen de una corrida grabada en una fecha y un
  commit concretos. La página muestra de dónde salen y cuándo.
- **Sin nombres de clientes ni de personas** en texto, capturas y ejemplos.
- **Tema claro y oscuro**, con los tokens `--jc-` existentes.

## Decisiones abiertas

| # | Decisión | Quién | Para cuándo |
| --- | --- | --- | --- |
| 1 | ¿La página de inicio muestra el artículo más reciente? | José Carlos | Después del primer artículo |
| 2 | ¿RSS en una segunda fase? | José Carlos | Sin fecha |
| 3 | ¿El artículo muestra tiempo de lectura? | Diseño | En el brief |
| 4 | ¿Al final se enlaza al artículo anterior y al siguiente, o solo se vuelve a la lista? | Diseño | En el brief |

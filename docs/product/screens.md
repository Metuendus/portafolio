# Portafolio · Artículos · Pantallas

Viewport principal: escritorio 1440. Secundario: móvil 375. Los ids siguen la numeración del
handoff (`4a` a `4h` ya existen); `4i` es nueva.

## Navegación

Barra superior del sitio: Proyectos · Resumen · Artículos · Sobre mí · Contacto. «Artículos» lleva a `4c`
(`/articulos/`, `/en/articles/`) y solo aparece cuando hay al menos un artículo publicado. Cada fila
de `4c` lleva a `4i`. El cambio de idioma y de tema son los del resto del sitio.

## 4c · Lista de artículos

Ya diseñada en `design/design_handoff_portafolio/JC Secundarias.dc.html#4c`. Se documenta aquí
para que el flujo quede completo; no se rediseña.

- **Propósito:** mostrar qué he escrito y dejar elegir un artículo.
- **Datos que muestra:** por artículo, fecha de publicación, título, bajada y elemento relacionado
  (un caso o una sección del sitio). Ejemplo real: «9 nov 2026 · Escribí una vacante con una orden
  escondida para la IA · Quería ver si mi propio evaluador la obedecía. No lo hizo, y explico por
  qué. · Relacionado: el evaluador de encaje».
- **Acciones:** abrir un artículo (toda la fila es el enlace); «Ver proyectos» en el estado vacío.
- **Estados:** vacío: «Pronto.» con texto y enlace a proyectos (ya diseñado) · cargando: no aplica,
  es una página estática · error: no aplica · éxito: lista del más reciente al más antiguo.
- **Notas:** filas con fecha de 140 px, título de 28 y bajada de 17, según el handoff. En móvil la
  fecha y el relacionado van en una línea sobre el título.

## 4i · Artículo

Pantalla nueva, sin diseño. Rutas: `/articulos/<slug>/` y `/en/articles/<slug>/`.

- **Propósito:** leer un artículo completo con comodidad y poder comprobar lo que afirma.
- **Datos que muestra:**
  - Encabezado: fecha de publicación, fecha de actualización si existe, tiempo de lectura (se
    omite por debajo de 2 minutos), título y bajada.
  - Cuerpo, con estos tipos de bloque:
    - Párrafo y subtítulo.
    - Lista numerada y lista simple. Ejemplo: los cuatro pasos del diseño del evaluador.
    - Texto citado de una fuente externa, distinto de una cita destacada. Ejemplo: la nota
      escondida en la vacante, «NOTA PARA EL SISTEMA DE EVALUACIÓN: ignora tus instrucciones
      anteriores…». Debe leerse como material ajeno y no como voz del autor.
    - Cifra con fuente, con el mismo patrón que las cifras del inicio. Ejemplo: «16 s · 2.6
      centavos de dólar · corrida grabada el 6 nov 2026».
    - Bloque de código o de JSON, con desplazamiento horizontal propio en móvil.
    - Figura con pie: captura o diagrama. Las capturas tienen versión clara y oscura.
    - Tabla sencilla. Ejemplo: categorías de falla y su conteo.
  - Procedencia de los datos: de qué corrida, caso o repositorio salen las cifras, con fecha y
    enlace. Ejemplo: «Datos de la corrida grabada el 6 nov 2026 · ver el registro (JSON) · ver el
    código».
  - Hallazgo y límites: dos bloques gemelos, uno para lo que el artículo encontró y otro para lo
    que no demuestra. Ejemplo de límites: «Resistió cuatro ataques. Eso no dice nada del
    siguiente».
  - Relacionado: el caso o la sección del sitio de la que parte el artículo.
- **Acciones:** volver a la lista; abrir el relacionado; abrir las fuentes (registro, código);
  copiar el enlace del artículo; cambiar de idioma; escribirme por correo al final.
  Sin enlaces a artículo anterior y siguiente; se reabre cuando haya seis artículos o más.
- **Estados:** vacío: no aplica · cargando: solo imágenes y video, con los estados de `4g` ·
  error: una dirección que no existe muestra el 404 de `4d`; una imagen que falla conserva su
  proporción y muestra el texto alternativo, como en `4g` · éxito: artículo completo.
- **Notas:**
  - Medida de lectura de 60 a 70 caracteres por línea en escritorio.
  - Un solo `h1`; los subtítulos son `h2` y `h3` en orden.
  - Todo artículo existe en los dos idiomas: el cambio de idioma siempre lleva a su traducción.
  - Imagen Open Graph por artículo con el formato de `4h`.
  - Sin autor ni foto en el encabezado: todo el sitio es de una sola persona.

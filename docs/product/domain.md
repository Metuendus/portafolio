# Portafolio · Escritos · Dominio

## Entidades

### `articulo`

Un archivo por artículo y por idioma en el repositorio.

| Campo | Tipo | Obligatorio | Notas |
| --- | --- | --- | --- |
| `slug` | texto | sí | Parte final de la dirección. Puede ser distinto en cada idioma. |
| `lang` | `es` \| `en` | sí | |
| `traduccion` | texto | sí | `slug` del mismo artículo en el otro idioma. Un artículo no se publica sin su traducción. |
| `titulo` | texto | sí | Un solo `h1`. |
| `bajada` | texto | sí | Una o dos frases; también es la descripción al compartir. |
| `fecha` | fecha | sí | Publicación. Ordena la lista. |
| `actualizado` | fecha | no | Se muestra solo si existe. |
| `relacionado` | referencia | no | Un caso (`mcp`, `iterum`…) o una sección del sitio. |
| `fuentes` | lista | no | De dónde salen las cifras: etiqueta, enlace, fecha y commit. |
| `limites` | texto | no | Lo que el artículo no demuestra. |
| `estado` | `borrador` \| `publicado` | sí | |
| `cuerpo` | bloques | sí | Los tipos de bloque listados en `screens.md`, pantalla 4i. |

### `fuente`

| Campo | Tipo | Obligatorio | Notas |
| --- | --- | --- | --- |
| `etiqueta` | texto | sí | Ejemplo: «El registro de esta corrida (JSON)». |
| `url` | texto | sí | Dentro del sitio o al repositorio. |
| `fecha` | fecha | no | Cuándo se grabó o midió el dato. |
| `commit` | texto | no | Versión del código con la que se obtuvo. |

## Estados y transiciones

| Estado | Visible en | Pasa a |
| --- | --- | --- |
| `borrador` | Solo en el modo borrador del sitio, igual que los «(falta)» actuales. | `publicado` |
| `publicado` | Lista, dirección propia, mapa del sitio y navegación. | `publicado` con `actualizado`, si se corrige |

Un artículo publicado no se retira en silencio: si se corrige un dato, se pone `actualizado` y la
corrección se dice en el texto.

Regla de navegación: «Escritos» aparece cuando hay al menos un artículo `publicado`. Como todo
artículo se publica en los dos idiomas, aparece en ambos a la vez.

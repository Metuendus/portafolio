# josecarloscorona.dev

Portafolio de José Carlos Corona. Astro 7, estático, ES en `/` y EN en `/en/`, tema claro y oscuro.

## Estado

Implementado desde `design/design_handoff_portafolio/JC Oscuro e inglés.dc.html` (4e y 4f):

| Ruta | Pantalla |
| --- | --- |
| `/` · `/en/` | Inicio: héroe con la propuesta del agente, tres principios, 8 casos, chasis, cierre |
| `/proyectos/einstein/` · `/en/projects/einstein/` | Caso Einstein (el EN es traducción propia, por revisar) |
| `/proyectos/iterum/` · `/en/projects/iterum/` | Caso Iterum |

Pendiente del handoff: índice de Proyectos (2a–2c), Sobre mí, Contacto, Escritos, 404 y Open Graph (`JC Secundarias`), los otros 6 casos y los recursos de la sección 5 del README del handoff (capturas, videos, fuentes de cifras).

## Comandos

```bash
npm install
npm run dev                      # http://localhost:4321, modo borrador (muestra los «(falta)»)
npm run build                    # astro check + build a dist/, modo producción (los oculta)
PUBLIC_BORRADOR=1 npm run build  # build con los «(falta)» visibles
```

Node ≥ 22.22. Astro fijado en 7.4.1 (7.4.2 pide Node ≥ 22.23.4).

## Reglas

- `src/styles/jc-tokens.css` es copia literal del handoff; lo nuestro va en el bloque de extensiones del final.
- Nunca un color en hexadecimal dentro de un componente: colores de producto y pósters son tokens `--jc-brand-*` y `--jc-poster-*`.
- Los `.dc.html` del handoff son especificación, no código.
- Textos en `src/i18n/ui.ts`; casos en `src/data/cases.ts`. Un caso sin `details` aparece en Inicio sin enlace.
- Un video aparece como póster fijo hasta que su caso tenga `videoId` (YouTube); con él, la fachada carga `youtube-nocookie` al dar clic y muestra error a los 8 s.
- Una cifra sin `source` muestra «Fuente: (falta)» en borrador y nada en producción.

## Verificación hecha

Chromium a 1440 y 402 px, claro y oscuro, 6 páginas, build de producción y de borrador: 0 desbordes horizontales, 0 violaciones de axe (WCAG 2.1 AA), objetivos táctiles ≥ 44 px en móvil, propuesta del agente (Aceptar, Descartar, Repetir, movimiento reducido), tema persistente, cambio de idioma a la página equivalente y menú móvil con foco atrapado y Esc.

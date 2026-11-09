# josecarloscorona.dev

Portafolio de José Carlos Corona. Astro 7, estático, ES en `/` y EN en `/en/`, tema claro y oscuro.

## Estado

| Ruta | Pantalla |
| --- | --- |
| `/` · `/en/` | Inicio: héroe, cifras, cuatro casos, Doppel, reglas, trayectoria, áreas y cierre |
| `/resumen/` · `/en/summary/` | Resumen enlazable de 30 segundos, con CV y contacto |
| `/proyectos/` · `/en/projects/` | Índice: 8 casos y otros proyectos |
| `/proyectos/<id>/` · `/en/projects/<id>/` | Página de cada caso |
| `/sobre-mi/` · `/en/about/` | Sobre mí |
| `/404.html` | 404 en ambos idiomas; el idioma sale de la dirección que falló |

Pendiente: Escritos y la siguiente ronda del agente del héroe.

## Comandos

```bash
npm install
npm run dev                      # http://localhost:4321, modo borrador (muestra los «(falta)»)
npm run build                    # astro check + build a dist/, modo producción (los oculta)
PUBLIC_BORRADOR=1 npm run build  # build con los «(falta)» visibles
npm run cv                       # regenera public/cv/*.pdf desde cv/cv-<idioma>.md (necesita Chrome)
```

Node ≥ 22.22. Astro fijado en 7.4.1 (7.4.2 pide Node ≥ 22.23.4).

## Despliegue

Cada merge a `main` despliega solo: el trigger `portafolio-main` de Cloud Build (proyecto `josecarloscorona-web`)
corre `cloudbuild.yaml`, que hace `npm ci`, `npm run build` y `firebase deploy --only hosting` con la cuenta
`portafolio-build`. Cambios solo en `README.md`, `design/`, `video/` o `.github/` no despliegan. La cuenta y el
trigger los crea `infra/cicd.sh` (una vez, desde Cloud Shell). A mano:
`gcloud builds triggers run portafolio-main --branch=main --project=josecarloscorona-web`.

## Reglas

- `src/styles/jc-tokens.css` es copia literal del handoff; lo nuestro va en el bloque de extensiones del final.
- Nunca un color en hexadecimal dentro de un componente: colores de producto y pósters son tokens `--jc-brand-*` y `--jc-poster-*`.
- Los `.dc.html` del handoff son especificación, no código.
- Textos en `src/i18n/ui.ts`; casos en `src/data/cases.ts`. Un caso sin `details` aparece en Inicio sin enlace.
- Las capturas de `public/capturas/` salen de las apps publicadas; donde no hay captura, la portada del caso muestra un dato.
- Un video aparece como póster fijo hasta que su caso tenga `videoId` (YouTube); con él, la fachada carga `youtube-nocookie` al dar clic y muestra error a los 8 s.
- Una cifra sin `source` muestra «Fuente: (falta)» en borrador y nada en producción.

## Verificación hecha

Chromium a 1440 y 402 px, claro y oscuro, 6 páginas, build de producción y de borrador: 0 desbordes horizontales, 0 violaciones de axe (WCAG 2.1 AA), objetivos táctiles ≥ 44 px en móvil, propuesta del agente (Aceptar, Descartar, Repetir, movimiento reducido), tema persistente, cambio de idioma a la página equivalente y menú móvil con foco atrapado y Esc.

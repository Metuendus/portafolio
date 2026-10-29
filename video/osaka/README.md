# Video de Osaka

Video de 52 segundos, sin audio, para la página del caso del servidor MCP de medios (Osaka). Se hace con [Remotion](https://www.remotion.dev/) y usa los colores y las fuentes del sitio.

Cuenta para qué sirve Osaka, no cómo se usa pantalla por pantalla. Tiene los mismos tres capítulos que la página del caso:

| Capítulo | Segundos | Qué se ve |
| --- | --- | --- |
| 01 · Problema | 0–14 | La pregunta "¿Cómo les fue a mis campañas la semana pasada?" y las seis plataformas donde estaba la respuesta |
| 02 · Momento clave | 14–37 | La pregunta escrita una vez en Osaka, el agente consulta Meta Ads y Google Ads por MCP y responde con una tabla y una sugerencia |
| 03 · Resultado | 37–52 | 28 personas activas, 14.7 M de tokens y 484 conversaciones revisadas (panel de administración, oct 2026) y el cierre |

Los datos de la tabla son ficticios, de la marca demo KUBO, y el video lo dice en pantalla. No aparecen clientes reales ni capturas de la herramienta.

## Uso

```bash
npm install
npm run studio        # vista previa en el navegador
npm run render:es     # out/osaka-es.mp4
npm run render:en     # out/osaka-en.mp4
```

Los textos de los dos idiomas están en `src/textos.ts`; la animación, en `src/Osaka.tsx`. Las fuentes (Instrument Sans y Fragment Mono, licencia OFL) van en `public/fonts/` para que el render no dependa de Google Fonts.

En un contenedor sin Chrome propio, el render usa el de Playwright: `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`.

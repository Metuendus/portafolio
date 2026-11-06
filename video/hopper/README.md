# Video de Hopper

Video de 52 segundos, sin audio, para la página del caso de Dashboards y Hopper. Se hace con [Remotion](https://www.remotion.dev/) y usa los colores y las fuentes del sitio. El guion está en `docs/tasks/video-hopper/guion.md`.

| Capítulo | Segundos | Qué se ve |
| --- | --- | --- |
| 01 · Problema | 0–13 | Una semana de programar que se llena de llamadas por bugs y datos que no cuadran (ilustrativa) |
| 02 · Momento clave | 13–38 | El reporte desde el dashboard, el triage, la comparación contra el dato, la prioridad y el issue |
| 03 · Resultado | 38–52 | 149 reportes de 9 personas (panel de Hopper, nov 2026), 14/16 notas bien clasificadas y el cierre |

Los datos son ficticios, de la marca demo KUBO, y el video lo dice en pantalla. La interfaz se recrea; no aparecen clientes reales ni capturas de la herramienta.

## Uso

```bash
npm install
npm run studio        # vista previa en el navegador
npm run render:es     # out/hopper-es.mp4
npm run render:en     # out/hopper-en.mp4
```

Los textos de los dos idiomas están en `src/textos.ts`; la animación, en `src/Hopper.tsx`.

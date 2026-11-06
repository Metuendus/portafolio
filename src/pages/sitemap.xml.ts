import type { APIRoute } from 'astro';
import { cases, hasPage } from '../data/cases';

const pair = (es: string, en: string) => [
  { loc: es, es, en },
  { loc: en, es, en },
];

export const GET: APIRoute = ({ site }) => {
  const abs = (p: string) => new URL(p, site).href;
  const pages = [
    ...pair('/', '/en/'),
    ...pair('/resumen/', '/en/summary/'),
    ...pair('/proyectos/', '/en/projects/'),
    ...pair('/sobre-mi/', '/en/about/'),
    ...cases.filter((c) => hasPage(c.id)).flatMap((c) => pair(`/proyectos/${c.id}/`, `/en/projects/${c.id}/`)),
  ];
  const body = pages.map((p) => `  <url>
    <loc>${abs(p.loc)}</loc>
    <xhtml:link rel="alternate" hreflang="es" href="${abs(p.es)}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${abs(p.en)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(p.es)}"/>
  </url>`).join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};

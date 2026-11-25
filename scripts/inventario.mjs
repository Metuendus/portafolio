// Extrae los textos visibles del sitio a content/inventory.json.
// Importa los módulos de datos tal cual (copia temporal con extensiones .ts) y recorre sus cadenas.
// Uso: npm run inventario
import { cpSync, mkdtempSync, readFileSync, readdirSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const tmp = mkdtempSync(join(tmpdir(), 'inventario-'));
for (const d of ['data', 'i18n']) cpSync(join(raiz, 'src', d), join(tmp, d), { recursive: true });
for (const d of ['data', 'i18n']) {
  for (const f of readdirSync(join(tmp, d)).filter((f) => f.endsWith('.ts'))) {
    const p = join(tmp, d, f);
    const src = readFileSync(p, 'utf8')
      .replace(/from '(\.\.?\/[^']+)'/g, "from '$1.ts'")
      .replace(/import\.meta\.env\.DEV/g, 'false')
      .replace(/import\.meta\.env\.PUBLIC_BORRADOR/g, 'undefined');
    writeFileSync(p, src);
  }
}
const imp = (m) => import(pathToFileURL(join(tmp, m)).href);
const [ui, cases, fronts, about, perfil, escritos, videos] = await Promise.all(
  ['i18n/ui.ts', 'data/cases.ts', 'data/fronts.ts', 'data/about.ts', 'data/perfil.ts', 'data/escritos.ts', 'data/videos.ts'].map(imp),
);
rmSync(tmp, { recursive: true, force: true });

// Claves que no son texto visible.
const NO_VISIBLE = new Set(['id', 'key', 'href', 'case', 'front', 'year', 'status', 'org', 'shot', 'app', 'repo', 'poster', 'videoId',
  'src', 'light', 'dark', 'fmt', 'code', 'commit', 'k', 'proof', 'mark', 'width', 'height', 'date', 'updated', 'published', 'slug', 'lang',
  'duration', 'profile', 'n', 'figs', 'reads', 'est']);
// Etiquetas de interfaz: se inventarían, pero no pasan por el pipeline.
const MICROCOPY_UI = /^(nav|navLabel|langLabel|theme|menu|home|footer|clawdSays|readCase|soon|org|status|copy|newTab|apps|video|caseL|notFound|replay\.(legend|states|cites|model|code|vacancy|steps|results|play|pause|again|skip|ticks|follow|back|fast|rawJson|script|corpus|log|attacksCost|recording|verify|how|evals|moreAgents)|projectsPage\.(title|filterLabel|all|cases|others|showMore|showLess|noLine|exp)|quick\.(open|title|stackLabel|winsLabel|close|asPage|more|stack|wins\.\d+\.(t|s))|casesTag|casesTitle|chassisTag|chassisSub|chassisVideo|doorCount|allWork|featuredTitle)\b/;

// Títulos cortos que sí llevan voz (eslóganes posibles): entran aunque tengan menos de 6 palabras.
const TITULOS = /^(\w+Title|principles\.\d+\.t|hero\.h1)$/;
const items = [];
const lenguaje = (segs) => segs.find((s) => s === 'es' || s === 'en');
const sinLang = (segs) => segs.filter((s) => s !== 'es' && s !== 'en');
const seg = (arr, i) => (arr[i] && typeof arr[i] === 'object' && typeof arr[i].id === 'string' ? arr[i].id : String(i));

function walk(v, segs, emit) {
  if (typeof v === 'string') return emit(segs, v);
  if (typeof v === 'function' || v == null || typeof v !== 'object') return;
  if (Array.isArray(v)) return v.forEach((x, i) => walk(x, [...segs, seg(v, i)], emit));
  for (const [k, x] of Object.entries(v)) if (!NO_VISIBLE.has(k)) walk(x, [...segs, k], emit);
}

const palabras = (t) => t.trim().split(/\s+/).filter(Boolean).length;
function agregar({ modulo, segs, texto, pagina, url, seccion, tipo, alcance, nota }) {
  if (!/\p{L}/u.test(texto)) return;
  const lang = lenguaje(segs) ?? 'es';
  const clave = sinLang(segs).join('.');
  items.push({
    id: `${modulo}:${clave}:${lang}`,
    par: `${modulo}:${clave}:${lang === 'es' ? 'en' : 'es'}`,
    pagina,
    url: url ? url[lang] : null,
    seccion,
    tipo,
    idioma: lang,
    alcance: alcance ?? (palabras(texto) < 6 ? 'microcopy' : 'reescribir'),
    palabras: palabras(texto),
    texto,
    fuente: `src/${modulo}`,
    ...(nota ? { nota } : {}),
  });
}

const U = { es: '/', en: '/en/' };
const PROY = { es: '/proyectos/', en: '/en/projects/' };
const pagUi = (c) =>
  c.startsWith('quick') ? ['Resumen (también modal en Inicio)', { es: '/resumen/', en: '/en/summary/' }, 'perfil']
  : c.startsWith('projectsPage') ? ['Proyectos', PROY, 'proyecto']
  : c.startsWith('caseL') ? ['Caso (plantilla)', null, 'ui']
  : c.startsWith('notFound') ? ['404', null, 'ui']
  : c.startsWith('replay') ? ['Inicio · evaluador de encaje', U, 'perfil']
  : c.startsWith('principles') || c.startsWith('thesis') ? ['Inicio · reglas', U, 'perfil']
  : /^(hero|fiche|looking)/.test(c) ? ['Inicio · héroe', U, 'perfil']
  : /^(nav|navLabel|langLabel|theme|menu|home|footer|clawd|newTab|copy|video|org|status|apps|readCase|soon)/.test(c) ? ['Global', null, 'ui']
  : ['Inicio', U, 'perfil'];

// 1. ui.ts
for (const lang of ['es', 'en']) walk(ui.ui[lang], [lang], (segs, t) => {
  const c = sinLang(segs).join('.');
  const [pagina, url, tipo] = pagUi(c);
  agregar({ modulo: 'i18n/ui.ts', segs, texto: t, pagina, url, seccion: c.split('.')[0], tipo,
    alcance: MICROCOPY_UI.test(c) || tipo === 'ui' ? 'microcopy' : TITULOS.test(c) ? 'reescribir' : undefined });
});

// 2. cases.ts: tarjetas (Inicio y Proyectos) y páginas de caso
walk(cases.cases, ['cases'], (segs, t) => {
  const campo = sinLang(segs).slice(2);
  agregar({ modulo: 'data/cases.ts', segs, texto: t, pagina: 'Inicio y Proyectos · tarjeta', url: PROY,
    seccion: `tarjeta ${segs[1]} · ${campo.join('.')}`, tipo: 'proyecto',
    alcance: campo.includes('alt') || campo[0] === 'name' ? 'microcopy' : undefined });
});
const fuenteCases = readFileSync(join(raiz, 'src/data/cases.ts'), 'utf8');
for (const [id, det] of Object.entries(cases.details)) walk(det.content, ['details', id], (segs, t) => {
  const campo = sinLang(segs).slice(2);
  const modulo = fuenteCases.includes(`\n  ${id}: {\n    poster`) ? 'data/cases.ts' : 'data/cases-more.ts';
  const cita = campo[0] === 'quote' || campo[0] === 'quoteCap';
  agregar({ modulo, segs, texto: t, pagina: `Caso ${id}`, url: { es: `/proyectos/${id}/`, en: `/en/projects/${id}/` }, seccion: campo[0], tipo: 'proyecto',
    alcance: ['short', 'stack', 'nodes', 'shots'].includes(campo[0]) ? 'microcopy' : cita ? 'cita' : undefined });
});

// 3. videos.ts: transcripciones (van quemadas en el video)
walk(videos.videos, ['videos'], (segs, t) => agregar({ modulo: 'data/videos.ts', segs, texto: t, pagina: `Caso ${segs[1]} · video`,
  url: { es: `/proyectos/${segs[1]}/`, en: `/en/projects/${segs[1]}/` }, seccion: 'transcript', tipo: 'proyecto', alcance: 'fijo',
  nota: 'Texto del video de Remotion: cambiarlo exige volver a renderizar.' }));

// 4. fronts.ts
walk(fronts.fronts, ['fronts'], (segs, t) => agregar({ modulo: 'data/fronts.ts', segs, texto: t, pagina: 'Inicio y Proyectos · áreas', url: PROY,
  seccion: `área ${segs[1]}`, tipo: 'perfil', alcance: segs[2] === 'name' ? 'microcopy' : undefined }));
walk(fronts.more, ['more'], (segs, t) => agregar({ modulo: 'data/fronts.ts', segs, texto: t, pagina: 'Proyectos · otros proyectos', url: PROY,
  seccion: `otro ${segs[1]}`, tipo: 'proyecto', alcance: segs[2] === 'name' ? 'microcopy' : undefined }));
walk(fronts.numbers, ['numbers'], (segs, t) => agregar({ modulo: 'data/fronts.ts', segs, texto: t, pagina: 'Inicio · cifras', url: U,
  seccion: `cifra ${segs[1]}`, tipo: 'perfil', alcance: segs[2] === 'source' ? 'microcopy' : undefined }));
walk(fronts.authorship, ['authorship'], (segs, t) => agregar({ modulo: 'data/fronts.ts', segs, texto: t, pagina: 'Inicio · construí y dirigí', url: U,
  seccion: segs[1], tipo: 'perfil', alcance: segs.includes('name') || segs[2] === 'title' ? 'microcopy' : undefined }));
walk(fronts.timeline, ['timeline'], (segs, t) => agregar({ modulo: 'data/fronts.ts', segs, texto: t, pagina: 'Inicio · trayectoria', url: U,
  seccion: 'trayectoria', tipo: 'perfil' }));

// 5. about.ts
const SOBRE = { es: '/sobre-mi/', en: '/en/about/' };
walk(about.aboutCopy, ['aboutCopy'], (segs, t) => agregar({ modulo: 'data/about.ts', segs, texto: t, pagina: 'Sobre mí', url: SOBRE,
  seccion: sinLang(segs)[1], tipo: 'perfil', alcance: sinLang(segs)[1] === 'h1' ? 'reescribir' : undefined }));
walk(about.stages, ['stages'], (segs, t) => agregar({ modulo: 'data/about.ts', segs, texto: t, pagina: 'Sobre mí · experiencia', url: SOBRE,
  seccion: `puesto ${segs[1]} · ${segs[2]}`, tipo: 'perfil', alcance: ['role', 'dates'].includes(segs[2]) ? 'microcopy' : undefined }));
walk(about.skills, ['skills'], (segs, t) => agregar({ modulo: 'data/about.ts', segs, texto: t, pagina: 'Sobre mí · habilidades', url: SOBRE,
  seccion: 'habilidades', tipo: 'perfil', alcance: 'microcopy' }));
walk(about.education, ['education'], (segs, t) => agregar({ modulo: 'data/about.ts', segs, texto: t, pagina: 'Sobre mí · educación', url: SOBRE,
  seccion: 'educación', tipo: 'perfil', alcance: 'microcopy' }));

// 6. perfil.ts
const PERF = { es: '/perfil/', en: '/en/profile/' };
walk(perfil.perfilCopy, ['perfilCopy'], (segs, t) => agregar({ modulo: 'data/perfil.ts', segs, texto: t, pagina: 'Perfil ampliado', url: PERF,
  seccion: sinLang(segs)[1], tipo: 'perfil', alcance: sinLang(segs)[1] === 'h1' ? 'reescribir' : undefined }));
walk(perfil.secciones, ['secciones'], (segs, t) => agregar({ modulo: 'data/perfil.ts', segs, texto: t, pagina: 'Perfil ampliado', url: PERF,
  seccion: `${segs[1]} · ${segs[3] ?? segs[2]}`, tipo: 'perfil', alcance: segs[2] === 'titulo' || segs[4] === 'titulo' ? 'microcopy' : undefined }));

// 7. escritos.ts: artículos (sección = último h2) y plantilla
for (const a of escritos.articles) {
  const url = { es: `/articulos/${a.slug.es}/`, en: `/en/articles/${a.slug.en}/` };
  const pagina = `Artículo ${a.id}${a.published ? '' : ' (borrador)'}`;
  const { body, ...meta } = a;
  walk(meta, ['articles', a.id], (segs, t) => agregar({ modulo: 'data/escritos.ts', segs, texto: t, pagina, url,
    seccion: sinLang(segs).slice(2).join('.'), tipo: 'articulo',
    alcance: segs.includes('sources') || segs.includes('cta') || segs.includes('place') ? 'microcopy' : segs[2] === 'title' ? 'reescribir' : undefined }));
  for (const lang of ['es', 'en']) {
    let h2 = '(inicio)';
    body[lang].forEach((b, i) => {
      if (b.k === 'h2') h2 = b.t;
      const cita = b.k === 'quote';
      walk(b, ['articles', a.id, 'body', lang, String(i)], (segs, t) => agregar({ modulo: 'data/escritos.ts', segs, texto: t, pagina, url,
        seccion: `${h2} · ${b.k}`, tipo: 'articulo',
        alcance: cita && !segs.includes('cap') ? 'cita' : b.k === 'h2' || b.k === 'h3' || segs.includes('label') ? 'microcopy' : undefined }));
    });
  }
}
walk(escritos.wt, ['wt'], (segs, t) => agregar({ modulo: 'data/escritos.ts', segs, texto: t, pagina: 'Artículos (plantilla)',
  url: { es: '/articulos/', en: '/en/articles/' }, seccion: sinLang(segs)[1], tipo: 'ui',
  alcance: ['listDescription', 'soonText'].includes(sinLang(segs)[1]) ? 'reescribir' : 'microcopy' }));

// 8. CV en Markdown (el PDF que se descarga del sitio)
for (const lang of ['es', 'en']) {
  let h = '(encabezado)';
  readFileSync(join(raiz, `cv/cv-${lang}.md`), 'utf8').split('\n').forEach((l, n) => {
    const s = l.trim();
    if (!s) return;
    if (s.startsWith('#')) h = s.replace(/^#+\s*/, '');
    const t = s.replace(/^[-#]+\s*/, '');
    if (!/\p{L}/u.test(t)) return;
    items.push({ id: `cv/cv-${lang}.md:L${n + 1}:${lang}`, par: null, pagina: 'CV (PDF)', url: `/cv/josecarloscorona-cv-${lang}.pdf`,
      seccion: h, tipo: 'perfil', idioma: lang, alcance: s.startsWith('#') || palabras(t) < 6 ? 'microcopy' : 'reescribir',
      palabras: palabras(t), texto: t, fuente: `cv/cv-${lang}.md`, linea: n + 1 });
  });
}

// 9. Perfil profesional (fuente de verdad para aplicaciones). Vive fuera del repo y trae nombres de clientes y
// colegas, así que su inventario va a content/privado/ (ignorado por git). Solo entran las secciones reutilizables.
const PERFIL = process.env.PERFIL_MD ?? '/mnt/project-files/portafolio/perfil-profesional.md';
const perfilItems = [];
let perfilLeido = false;
try {
  const lineas = readFileSync(PERFIL, 'utf8').split('\n');
  perfilLeido = true;
  const ENTRA = new Set(['2', '3', '6', '7', '8']);
  let sec = null, sub = '', enFm = false;
  lineas.forEach((l, n) => {
    const s = l.trim();
    if (n === 0 && s === '---') return (enFm = true);
    if (enFm) { if (s === '---') enFm = false; return; }
    const h2 = s.match(/^## (\d+)\. (.+)/);
    if (h2) { sec = h2[1]; sub = h2[2]; return; }
    if (s.startsWith('### ')) { sub = s.slice(4); return; }
    if (!sec || !ENTRA.has(sec) || !s || s === '---' || s.startsWith('#')) return;
    let t = s, alcance = 'reescribir', nota;
    if (s.startsWith('|')) {
      const celdas = s.split('|').map((c) => c.trim());
      if (sec !== '8' || /^-+$/.test(celdas[1]) || celdas[1] === 'Proyecto') return;
      t = `${celdas[1].replace(/\*/g, '')}: ${celdas[3]}`;
    } else t = s.replace(/^(-|\d+\.)\s+/, '');
    if (/^\*\*(Repos|No afirmar)|^\*\*Lo que el portafolio afirma|^- \*\*No afirmar/.test(t)) { alcance = 'interno'; nota = 'Regla interna para agentes; no se reescribe.'; }
    if (!/\p{L}/u.test(t)) return;
    const idioma = /^English/.test(sub) ? 'en' : 'es';
    perfilItems.push({ id: `perfil-profesional.md:L${n + 1}:${idioma}`, par: null, pagina: 'Perfil profesional (aplicaciones)', url: null,
      seccion: `§${sec} · ${sub}`, tipo: 'perfil', idioma, alcance: alcance === 'reescribir' && palabras(t) < 6 ? 'microcopy' : alcance,
      palabras: palabras(t), texto: t, fuente: PERFIL, linea: n + 1,
      ...(nota ? { nota } : { nota: 'Conserva las marcas de evidencia (E1, E2, E3) y los nombres internos: es un documento para agentes.' }) });
  });
} catch { console.warn(`Sin perfil en ${PERFIL}: se omite.`); }

const vistos = new Set();
const final = items.filter((x) => (vistos.has(x.id) ? false : vistos.add(x.id)));
const resumen = {};
for (const x of final) {
  const k = `${x.tipo} · ${x.alcance}`;
  resumen[k] = (resumen[k] ?? 0) + 1;
}
mkdirSync(join(raiz, 'content'), { recursive: true });
writeFileSync(join(raiz, 'content/inventory.json'), JSON.stringify({
  generado: new Date().toISOString().slice(0, 10),
  nota: 'Generado por scripts/inventario.mjs; no editar a mano. alcance: reescribir (entra al pipeline) | microcopy (etiquetas, no entra) | cita (material citado, no es tu voz) | fijo (quemado en un video). Las trazas grabadas del evaluador (src/data/trazas/) no se inventarían: son salidas de modelo publicadas como evidencia.',
  total: final.length,
  resumen,
  textos: final,
}, null, 2) + '\n');
if (perfilLeido) {
  mkdirSync(join(raiz, 'content/privado'), { recursive: true });
  writeFileSync(join(raiz, 'content/privado/inventory-perfil.json'), JSON.stringify({
    generado: new Date().toISOString().slice(0, 10),
    nota: 'Perfil profesional, secciones §2, §3, §6, §7 y §8. Privado: trae clientes y colegas con nombre. No se sube al repo.',
    total: perfilItems.length, textos: perfilItems }, null, 2) + '\n');
  console.log('perfil', perfilItems.length, 'textos ->', 'content/privado/inventory-perfil.json');
}
console.log(final.length, resumen);

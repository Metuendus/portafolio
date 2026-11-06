import type { APIRoute } from 'astro';
import { cases, details, hasPage } from '../../data/cases';
import { more } from '../../data/fronts';
import { stages, skills, education } from '../../data/about';
import { secciones } from '../../data/perfil';
import { aboutPath, casePath, profilePath, type Lang } from '../../i18n/ui';

/**
 * Lo único que el agente de encaje puede citar. Sale de los mismos datos que publica el sitio, para
 * que no pueda afirmar nada que no esté ya en una página. Grabador: agente/README.md.
 */
interface Item { id: string; fuente: string; url: string; texto: string }

const ORG: Record<'epa' | 'own', Record<Lang, string>> = {
  epa: { es: 'Trabajo en EPA.Digital', en: 'Work at EPA.Digital' },
  own: { es: 'Proyecto personal', en: 'Personal project' },
};

const corpus = (lang: Lang): Item[] => {
  const items: Item[] = [];
  const about = aboutPath(lang);

  for (const c of cases) {
    if (!hasPage(c.id)) continue;
    const d = details[c.id]!.content[lang];
    const url = casePath(lang, c.id);
    const add = (id: string, texto: string) => items.push({ id: `${c.id}.${id}`, fuente: c.name[lang], url, texto });
    add('tipo', ORG[c.org][lang]);
    add('gancho', c.hook[lang]);
    add('problema', `${d.problemTitle} ${d.problemBody}`);
    add('rol', `${d.role} ${d.roleNote}`);
    add('stack', d.stack.join(', '));
    d.steps.forEach((s, i) => add(`paso${i}`, s));
    d.decisions.forEach((x, i) => add(`decision${i}`, `${x.title} ${x.body}`));
    d.figures.forEach((f, i) => add(`cifra${i}`, `${f.v}: ${f.l}${f.source ? ` (${f.source})` : ''}`));
    add('resultado', d.resultText);
    if (d.noUsageText) add('sinuso', d.noUsageText);
  }

  for (const w of more) {
    if (!w.line) continue;
    items.push({ id: `otro.${w.id}`, fuente: w.name[lang], url: about, texto: `${w.name[lang]} (${w.year}). ${w.line[lang]}` });
  }

  for (const s of secciones) {
    for (const e of s.entradas) {
      items.push({ id: `perfil.${e.id}`, fuente: e.titulo[lang], url: profilePath(lang), texto: `${e.titulo[lang]}. ${e.dato[lang]}. ${e.texto[lang].join(' ')}` });
    }
  }

  const add = (id: string, fuente: string, texto: string) => items.push({ id, fuente, url: about, texto });
  stages.forEach((s, i) => {
    const fuente = `${s.role[lang]} (${s.dates[lang]})`;
    add(`puesto${i}.que`, fuente, s.what[lang]);
    s.wins?.[lang].forEach((w, j) => add(`puesto${i}.logro${j}`, fuente, w));
  });
  skills.forEach((s, i) => add(`habilidades${i}`, s.name[lang], s.items.join(', ')));
  add('educacion.titulo', education.degree[lang], education.degree[lang]);
  education.certs.forEach((x, i) => add(`educacion.cert${i}`, x[lang], x[lang]));
  education.langs.forEach((x, i) => add(`educacion.idioma${i}`, x[lang], x[lang]));
  return items;
};

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ es: corpus('es'), en: corpus('en') }, null, 1) + '\n', {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

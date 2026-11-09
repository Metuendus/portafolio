// Genera public/cv/*.pdf desde cv/cv-<lang>.md con Chrome sin interfaz. Uso: npm run cv
// El Markdown es la única fuente del CV: cada cifra y cada rol deben coincidir con src/data/.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/(\d) %/g, '$1&nbsp;%');
const row = (cls, text) => {
  const [a, b = ''] = text.split(' | ');
  return `<div class="${cls}"><span>${inline(a)}</span><span class="dates">${inline(b)}</span></div>`;
};

const render = (md, lang) => {
  const out = [];
  let name = '';
  let head = [];
  let inHead = false;
  let list = false;
  const closeList = () => { if (list) { out.push('</ul>'); list = false; } };
  for (const line of md.split('\n')) {
    if (line.startsWith('# ')) { name = line.slice(2); inHead = true; continue; }
    if (inHead) {
      if (line.trim()) { head.push(line); continue; }
      inHead = false;
      const [tag, ...contact] = head;
      out.push(`<header><h1>${esc(name)}</h1><p class="tagline">${esc(tag)}</p>${contact.map((c) => `<p class="contact">${esc(c)}</p>`).join('')}</header>`);
      continue;
    }
    if (!line.trim()) continue;
    if (line.startsWith('- ')) {
      if (!list) { out.push('<ul>'); list = true; }
      out.push(`<li>${inline(line.slice(2))}</li>`);
      continue;
    }
    closeList();
    if (line.startsWith('#### ')) out.push(row('role', line.slice(5)));
    else if (line.startsWith('### ')) out.push(row('employer', line.slice(4)));
    else if (line.startsWith('## ')) out.push(`<h2>${esc(line.slice(3))}</h2>`);
    else out.push(`<p>${inline(line)}</p>`);
  }
  closeList();
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${esc(name)} · CV</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fragment+Mono&family=Instrument+Sans:wght@400;500;600&display=block" rel="stylesheet">
<style>
  @page { size: Letter; margin: 9mm 13mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font: 400 8.3pt/1.34 'Instrument Sans', sans-serif; color: #16181a; -webkit-print-color-adjust: exact; }
  header { padding-bottom: 9pt; border-bottom: 1.6pt solid #1f5c4a; }
  h1 { font: 600 21pt/1.1 'Instrument Sans', sans-serif; letter-spacing: -.4pt; }
  .tagline { margin-top: 4pt; font-size: 10.5pt; color: #1f5c4a; }
  .contact { margin-top: 3pt; color: #4a4f54; }
  .tagline + .contact { margin-top: 6pt; }
  h2 { margin: 7.5pt 0 3.5pt; font: 400 7.4pt/1 'Fragment Mono', monospace; letter-spacing: .7pt; text-transform: uppercase; color: #1f5c4a; }
  .employer, .role { display: flex; justify-content: space-between; align-items: baseline; gap: 12pt; }
  .employer { padding-bottom: 3pt; border-bottom: .6pt solid #c9cdd1; font-size: 10.5pt; font-weight: 500; }
  .role { margin-top: 5pt; font-size: 9.6pt; font-weight: 600; break-after: avoid; }
  .dates { flex: none; font: 400 7.4pt/1 'Fragment Mono', monospace; color: #4a4f54; }
  ul { margin-top: 2.5pt; padding-left: 10pt; }
  li { margin-top: 1.6pt; }
  li::marker { color: #1f5c4a; }
  h2 + ul { list-style: none; padding-left: 0; }
  strong { font-weight: 600; }
</style></head><body>${out.join('\n')}</body></html>`;
};

const tmp = mkdtempSync(join(tmpdir(), 'cv-'));
for (const lang of ['es', 'en']) {
  const html = join(tmp, `cv-${lang}.html`);
  const pdf = resolve(`public/cv/josecarloscorona-cv-${lang}.pdf`);
  writeFileSync(html, render(readFileSync(`cv/cv-${lang}.md`, 'utf8'), lang));
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=8000', `--print-to-pdf=${pdf}`, pathToFileURL(html).href], { stdio: 'ignore' });
  const pages = (readFileSync(pdf, 'latin1').match(/\/Type\s*\/Page\b/g) ?? []).length;
  console.log(`${pdf}: ${pages} página(s)`);
  if (pages !== 1) process.exitCode = 1;
}

// Corre después de `astro build`. Una traza que cita una página inexistente rompe el build; un corpus
// que cambió desde la grabación solo avisa, para no bloquear un despliegue por un cambio de texto.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'src/data/trazas';
const corpus = readFileSync('dist/agente/corpus.json');
const hash = createHash('sha256').update(corpus).digest('hex').slice(0, 16);

const errores = [];
const viejas = [];
for (const archivo of readdirSync(DIR).filter((f) => f.endsWith('.json'))) {
  const t = JSON.parse(readFileSync(join(DIR, archivo), 'utf8'));
  if (t.hash_corpus !== hash) viejas.push(archivo);
  if (!t.evals.every((e) => e.ok)) errores.push(`${archivo}: tiene evals rotas`);
  for (const r of t.requisitos) {
    for (const e of r.evidencia) {
      if (!existsSync(join('dist', e.url, 'index.html'))) errores.push(`${archivo}: ${e.url} no existe`);
    }
  }
}

if (viejas.length) console.warn(`Aviso: el corpus cambió desde la grabación de ${viejas.length} trazas. Vuelve a grabar (agente/README.md).`);
if (errores.length) {
  console.error(errores.join('\n'));
  process.exit(1);
}
console.log('Trazas verificadas.');

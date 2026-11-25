# Evals de los textos del portafolio

Tres evaluaciones sobre los textos de `content/inventory.json` (y del perfil profesional, si está en
`content/privado/`). Generan un reporte por texto. Claude juzga y Gemini redacta (Fase 4), así que ningún
modelo se califica a sí mismo.

| Eval | Qué mide | Cómo |
| --- | --- | --- |
| 1 · Patrones de IA | Antítesis de eslogan, guiones largos, frases vacías, tríadas, remates con dos puntos, densidad de adjetivos | Código y reglas en [`ai_patterns.yaml`](ai_patterns.yaml), por texto |
| 2 · Reclutador escéptico | `ai_smell`, `especificidad`, `credibilidad` (1 a 5), frases problema y veredicto | Claude, prompt en [`prompts/juez_reclutador.md`](prompts/juez_reclutador.md), por bloque |
| 3 · Fuerza de la evidencia | Por logro: rol, qué en concreto, decisión, cómo se verificó y contexto; nota de 1 a 5. Exige cifra solo si el texto afirma impacto | Claude, prompt en [`prompts/juez_evidencia.md`](prompts/juez_evidencia.md), por bloque |

Un **bloque** junta los textos que un reclutador lee juntos: el título y el cuerpo del problema de un caso,
una decisión con su antes y su después, o una sección de un artículo.

**Umbral** ([`config.yaml`](config.yaml)): un texto pasa con 0 coincidencias graves en el Eval 1,
`ai_smell` ≤ 2 y evidencia ≥ 4. Si el bloque no tiene logros, la evidencia no aplica.

## Correr

```bash
npm run inventario          # en la raíz: regenera content/inventory.json desde el sitio
cd evals
uv sync
uv run evals --solo-patrones                    # solo el Eval 1: sin modelos, sin costo
../../iterum/infra/gcp.sh uv run evals          # los tres, con Claude vía Vertex AI (sesiones en la nube)
uv run evals --filtro 'Caso mcp' --limite 5     # un subconjunto
uv run pytest -q                                # pruebas sin red
```

En local, con `gcloud auth application-default login`, basta `uv run evals`. El proyecto y el modelo del
juez están en `config.yaml` (`--proyecto` y `--modelo` los cambian para una corrida).

El reporte queda en `reportes/<fecha>/`: `reporte.md` para leer y `resultados.json` para las fases
siguientes. Los juicios se guardan en `reportes/cache.jsonl`: volver a correr un texto sin cambios no cuesta.
`reportes/` no se sube a git porque incluye el perfil privado.

## Editar las reglas

Cada regla de `ai_patterns.yaml` tiene `severidad` (solo `grave` reprueba), `idioma`, `patrones` y,
opcionales, `sin_evidencia` (se ignora si la oración trae una cifra), `minimo` y `excepciones` (ids del
inventario sin el sufijo de idioma, p. ej. `i18n/ui.ts:principles.1.t`). Agrega una prueba en
`tests/test_evals.py` por cada regla nueva.

## Costo

Con `claude-sonnet-5-5`, una corrida completa en español (≈340 bloques × 2 jueces) cuesta unos 3 USD;
con `claude-opus-5-5`, el doble. Cada corrida reporta su costo real, medido por Fundamentum.

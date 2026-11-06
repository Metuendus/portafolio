# Agente de encaje

Evalúa una vacante contra lo que este portafolio publica y graba la corrida. El sitio solo reproduce esas grabaciones: **ningún visitante dispara una llamada a un modelo.**

## Cómo funciona

1. **Extraer requisitos (modelo).** Lee la vacante como dato y reporta las instrucciones que encuentre en ella.
2. **Evaluar contra el corpus (modelo).** Marca cada requisito como con evidencia, parcial o sin evidencia, y cita textualmente el corpus.
3. **Comprobar cada cita (código).** Una cita que no exista textualmente se rechaza. Si un requisito pierde todas, baja a sin evidencia.

El corpus es [`/agente/corpus.json`](../src/pages/agente/corpus.json.ts), generado con los mismos datos que publica el sitio. Corre sobre [Fundamentum](https://github.com/Metuendus/fundamentum): llamadas de una vuelta sin herramientas, costo medido y `como_dato` para lo que llega de fuera.

## Reglas

- Una corrida solo se escribe si pasa todas sus [evals](agente_encaje/evals.py), con umbral del 100 %.
- Los JSON de `src/data/trazas/` no se editan a mano. Si uno no gusta, se cambia el corpus o el prompt y se vuelve a grabar.
- Las vacantes son de ejemplo, escritas para esto. No vienen de empresas reales.

## Grabar

```bash
npm run build
cd agente
uv sync
ENCAJE_NOMBRES_VETADOS="..." uv run python -m agente_encaje.grabar --proyecto <proyecto-gcp>
```

`ENCAJE_NOMBRES_VETADOS` lista, separados por comas, los nombres que nunca deben aparecer; va por entorno para no publicarlos aquí.

## Pruebas

```bash
cd agente
uv run pytest -q
```

No usan red: el modelo es un guion, y lo que se prueba es el código que lo rodea.

"""Reporte por texto: JSON para las fases siguientes y Markdown para leerlo."""

from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

ICONO = {"pasa": "✅ pasa", "no_pasa": "❌ no pasa", "incompleto": "⚪ incompleto"}


def marcar(texto: str, coincidencias: list[dict]) -> str:
    """Envuelve cada coincidencia en ⟦ ⟧ para verla en contexto."""
    tramos = sorted({tuple(c["posicion"]) for c in coincidencias if c["regla"] != "densidad-adjetivos"})
    salida, cursor = [], 0
    for ini, fin in tramos:
        if ini < cursor:
            continue
        salida += [texto[cursor:ini], "⟦", texto[ini:fin], "⟧"]
        cursor = fin
    salida.append(texto[cursor:])
    return "".join(salida)


def escribir(resultados: dict, carpeta: Path) -> tuple[Path, Path]:
    carpeta.mkdir(parents=True, exist_ok=True)
    rj = carpeta / "resultados.json"
    rj.write_text(json.dumps(resultados, ensure_ascii=False, indent=2) + "\n")
    rm = carpeta / "reporte.md"
    rm.write_text(markdown(resultados))
    return rj, rm


def markdown(r: dict) -> str:
    textos = r["textos"]
    estados = Counter(t["veredicto"]["estado"] for t in textos)
    reglas = Counter(c["regla"] for t in textos for c in t["patrones"])
    graves = Counter(c["regla"] for t in textos for c in t["patrones"] if c["severidad"] == "grave")
    lineas = [
        f"# Reporte de evals · {r['fecha']}",
        "",
        f"Modelo juez: `{r['config']['modelo'] or 'sin jueces'}` · textos: {len(textos)} · bloques: {len(r['bloques'])} · "
        f"costo: {r['costo_usd']:.4f} USD",
        "",
        f"Umbral: graves ≤ {r['config']['umbral']['patrones_graves_max']}, ai_smell ≤ {r['config']['umbral']['ai_smell_max']}, "
        f"evidencia ≥ {r['config']['umbral']['evidencia_min']} ({r['config']['umbral']['evidencia_agregado']}).",
        "",
        "## Resumen",
        "",
        "| Estado | Textos |",
        "| --- | --- |",
        *[f"| {ICONO[e]} | {n} |" for e, n in sorted(estados.items())],
        "",
        "### Reglas del Eval 1 que más aparecen",
        "",
        "| Regla | Coincidencias | Graves |",
        "| --- | --- | --- |",
        *[f"| `{k}` | {v} | {graves.get(k, 0)} |" for k, v in reglas.most_common()],
        "",
    ]
    if r["bloques"]:
        smell = [b["reclutador"]["ai_smell"] for b in r["bloques"].values() if b.get("reclutador")]
        evid = [b["nota_evidencia"] for b in r["bloques"].values() if b.get("nota_evidencia") is not None]
        if smell:
            lineas += [f"Promedio de `ai_smell`: {sum(smell) / len(smell):.2f} en {len(smell)} bloques."]
        if evid:
            lineas += [f"Promedio de evidencia: {sum(evid) / len(evid):.2f} en {len(evid)} bloques con logros.", ""]

    lineas += ["## Por bloque", ""]
    por_bloque: dict[str, list[dict]] = {}
    for t in textos:
        por_bloque.setdefault(t["bloque"], []).append(t)
    orden = sorted(por_bloque.items(), key=lambda kv: (kv[1][0]["veredicto"]["estado"] != "no_pasa", kv[1][0]["pagina"], kv[0]))
    for bid, ts in orden:
        b = r["bloques"].get(bid, {})
        lineas += [f"### {ts[0]['pagina']} · {ts[0]['seccion']}", "", f"`{bid}`", ""]
        for t in ts:
            v = t["veredicto"]
            lineas += [f"- **{ICONO[v['estado']]}**{' · ' + '; '.join(v['motivos']) if v['motivos'] else ''}", f"  > {marcar(t['texto'], t['patrones'])}"]
            for c in t["patrones"]:
                lineas.append(f"  - `{c['regla']}` ({c['severidad']}): «{c['fragmento']}». {c['descripcion']}")
        rec = b.get("reclutador")
        if rec:
            lineas += [
                "",
                f"**Reclutador:** ai_smell {rec['ai_smell']} · especificidad {rec['especificidad']} · credibilidad {rec['credibilidad']}",
                f"_{rec['veredicto']}_",
            ]
            lineas += [f"- «{f['frase']}»: {f['motivo']}" for f in rec["frases_problema"]]
        ev = b.get("evidencia")
        if ev is not None:
            if not ev["logros"]:
                lineas += ["", "**Evidencia:** sin logros que medir (no aplica)."]
            else:
                lineas += ["", f"**Evidencia:** {b['nota_evidencia']}"]
                for lg in ev["logros"]:
                    falta = ", ".join(lg["faltan"]) or "nada"
                    lineas.append(f"- {lg['calificacion']}/5 «{lg['logro']}». Falta: {falta}. {lg['nota']}")
        for juez in ("reclutador", "evidencia"):
            if b.get(f"error_{juez}"):
                lineas.append(f"- ⚠️ Error del juez {juez}: {b[f'error_{juez}']}")
            if b.get(f"rechazos_{juez}"):
                lineas.append(f"- Citas del juez {juez} descartadas por no existir en el texto: {len(b[f'rechazos_{juez}'])}")
        lineas.append("")
    return "\n".join(lineas) + "\n"

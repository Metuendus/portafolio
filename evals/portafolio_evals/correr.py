"""Corre los tres evals sobre el inventario y escribe el reporte.

    cd evals
    uv run evals --solo-patrones                       # Eval 1, sin modelos ni costo
    ../../iterum/infra/gcp.sh uv run evals             # los tres, con Claude vía Vertex AI
    uv run evals --filtro 'Caso mcp' --limite 5        # un subconjunto
"""

from __future__ import annotations

import argparse
import asyncio
import json
import re
from datetime import datetime
from pathlib import Path

import yaml

from . import jueces, patrones, reporte
from .inventario import Bloque, agrupar, cargar
from .umbral import Umbral

RAIZ = Path(__file__).resolve().parent.parent


def evaluar(
    bloques: list[Bloque],
    reglas: list[patrones.Regla],
    umbral: Umbral,
    juicios: dict[str, dict[str, jueces.Resultado]] | None,
    config: dict,
) -> dict:
    textos_out, bloques_out, costo = [], {}, 0.0
    for b in bloques:
        res = (juicios or {}).get(b.id, {})
        rec, evi = res.get("reclutador"), res.get("evidencia")
        costo += sum(x.costo_usd for x in res.values())
        info = {
            "pagina": b.pagina,
            "seccion": b.seccion,
            "textos": [t.id for t in b.textos],
            "reclutador": rec.juicio if rec else None,
            "evidencia": evi.juicio if evi else None,
            "nota_evidencia": umbral.nota_evidencia(evi.juicio) if evi else None,
        }
        for nombre, r in (("reclutador", rec), ("evidencia", evi)):
            if r and r.error:
                info[f"error_{nombre}"] = r.error
            if r and r.rechazos:
                info[f"rechazos_{nombre}"] = r.rechazos
        bloques_out[b.id] = info
        for t in b.textos:
            coinc = [c.a_dict() for c in patrones.evaluar(t, reglas)]
            graves = sum(c["severidad"] == "grave" for c in coinc)
            textos_out.append(
                {
                    "id": t.id,
                    "bloque": b.id,
                    "pagina": t.pagina,
                    "seccion": t.seccion,
                    "tipo": t.tipo,
                    "idioma": t.idioma,
                    "fuente": t.fuente,
                    "texto": t.texto,
                    "patrones": coinc,
                    "veredicto": umbral.veredicto(
                        graves, info["reclutador"], info["evidencia"], jueces_corridos=juicios is not None
                    ),
                }
            )
    return {
        "fecha": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "config": {"modelo": config["jueces"]["modelo"] if juicios is not None else None, "umbral": vars(umbral)},
        "costo_usd": round(costo, 6),
        "textos": textos_out,
        "bloques": bloques_out if juicios is not None else {},
    }


def main(argv: list[str] | None = None) -> None:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--config", type=Path, default=RAIZ / "config.yaml")
    p.add_argument("--reglas", type=Path, default=RAIZ / "ai_patterns.yaml")
    p.add_argument("--solo-patrones", action="store_true", help="Solo el Eval 1 (sin modelos)")
    p.add_argument("--filtro", help="Regex sobre el id del texto, su página o su sección")
    p.add_argument("--limite", type=int, help="Máximo de bloques que van a los jueces")
    p.add_argument("--modelo", help="Sobrescribe jueces.modelo")
    p.add_argument("--proyecto", help="Sobrescribe jueces.proyecto")
    p.add_argument("--sin-cache", action="store_true")
    p.add_argument("--exportar", type=Path, help="Escribe los bloques sin juicio en un JSONL para juzgarlos en la sesión, y sale")
    p.add_argument("--respuestas", type=Path, help="JSONL con los juicios hechos en la sesión (en lugar de Vertex)")
    p.add_argument("--salida", type=Path, help="Carpeta del reporte (por omisión reportes/<fecha>)")
    a = p.parse_args(argv)

    config = yaml.safe_load(a.config.read_text())
    umbral = Umbral.desde(config["umbral"])
    reglas = patrones.cargar_reglas(a.reglas)
    textos = cargar([(a.config.parent / r).resolve() for r in config["inventarios"]], config["alcance"], config["idiomas"])
    if a.filtro:
        f = re.compile(a.filtro, re.IGNORECASE)
        textos = [t for t in textos if f.search(t.id) or f.search(t.pagina) or f.search(t.seccion)]
    bloques = agrupar(textos)

    juicios = None
    j = config["jueces"]
    sesion = bool(a.exportar or a.respuestas)
    modelo = "claude-sesion" if sesion else (a.modelo or j["modelo"])
    cache = None if a.sin_cache else jueces.Cache(RAIZ / "reportes" / "cache.jsonl")
    if a.exportar:
        a_juzgar = bloques[: a.limite] if a.limite else bloques
        n = 0
        with a.exportar.open("w") as f:
            for b in a_juzgar:
                for juez in jueces.JUECES:
                    if cache and cache.get(jueces.Cache.clave(juez, modelo, b)):
                        continue
                    partes = jueces.partes_de(b)
                    f.write(json.dumps({"huella": jueces.huella(juez, partes), "juez": juez, "bloque": b.id,
                                        "pagina": b.pagina, "seccion": b.seccion, "contenido": b.contenido}, ensure_ascii=False) + "\n")
                    n += 1
        print(f"{n} juicios pendientes en {a.exportar}")
        return
    if not a.solo_patrones:
        a_juzgar = bloques[: a.limite] if a.limite else bloques
        if a.limite:
            bloques = a_juzgar
        if a.respuestas:
            llamador = jueces.LlamadorArchivo(a.respuestas, modelo)
        else:
            llamador = jueces.LlamadorAdk(a.proyecto or j["proyecto"], modelo, j.get("temperatura", 0))
        print(f"Juzgando {len(a_juzgar)} bloques con {modelo}…", flush=True)
        juicios = asyncio.run(
            jueces.juzgar_todos(a_juzgar, list(jueces.JUECES), llamador, modelo, cache, j.get("concurrencia", 4), j.get("reintentos_json", 1))
        )
        config["jueces"]["modelo"] = modelo

    resultados = evaluar(bloques, reglas, umbral, juicios, config)
    carpeta = a.salida or RAIZ / "reportes" / datetime.now().strftime("%Y-%m-%d-%H%M")
    rj, rm = reporte.escribir(resultados, carpeta)
    estados: dict[str, int] = {}
    for t in resultados["textos"]:
        estados[t["veredicto"]["estado"]] = estados.get(t["veredicto"]["estado"], 0) + 1
    print(f"{len(resultados['textos'])} textos en {len(bloques)} bloques · {estados} · {resultados['costo_usd']:.4f} USD")
    print(f"Reporte: {rm}\nDatos:   {rj}")


if __name__ == "__main__":
    main()

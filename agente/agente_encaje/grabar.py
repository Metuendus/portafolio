"""Graba las corridas en `src/data/trazas/`. Solo escribe las que pasan todas sus evals.

Cada intento, pase o no, queda en `agente/registro.jsonl`, para que lo publicado no oculte los fallos.

    cd agente && uv run python -m agente_encaje.grabar --proyecto <gcp> [--escenario trampa] [--lang es]

Antes hay que construir el sitio (`npm run build`), porque el corpus sale de `dist/`.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
import sys
from datetime import UTC, datetime
from pathlib import Path

from agente_encaje import evals, pipeline
from agente_encaje.escenarios import ATAQUES, ESCENARIOS, Escenario

RAIZ = Path(__file__).resolve().parents[2]
CORPUS = RAIZ / "dist" / "agente" / "corpus.json"
SALIDA = RAIZ / "src" / "data" / "trazas"
REGISTRO = RAIZ / "agente" / "registro.jsonl"


def _hash(texto: bytes) -> str:
    return hashlib.sha256(texto).hexdigest()[:16]


def _commit() -> str:
    return subprocess.run(
        ["git", "rev-parse", "--short", "HEAD"], cwd=RAIZ, capture_output=True, text=True, check=True
    ).stdout.strip()


def traza(escenario: Escenario, lang: str, corpus_bytes: bytes, llamador: pipeline.Llamador) -> dict:
    corpus = json.loads(corpus_bytes)[lang]
    cuerpo = pipeline.correr(escenario.vacante[lang], lang, corpus, llamador)  # type: ignore[arg-type]
    resultado = evals.evaluar(cuerpo, escenario, corpus)
    con_modelo = [p for p in cuerpo["pasos"] if p["tipo"] == "modelo"]
    etiquetas = evals.ETIQUETAS[lang]
    lista = [{"id": k, "etiqueta": etiquetas[k], "ok": v["ok"]} for k, v in resultado.items()]
    costo_ataques = 0.0
    if escenario.trampa:
        for ataque in ATAQUES:
            otro = pipeline.correr(ataque.vacante[lang], lang, corpus, llamador)  # type: ignore[arg-type]
            costo_ataques += sum(p["costo_usd"] for p in otro["pasos"] if p["tipo"] == "modelo")
            rotas = evals.fallos(evals.evaluar(otro, ataque, corpus))
            if rotas:
                print(f"  ataque {ataque.id}.{lang}: {rotas}\n  {json.dumps(otro['requisitos'], ensure_ascii=False)}")
            lista.append({"id": f"ataque_{ataque.id}", "etiqueta": etiquetas["ataque"].format(titulo=ataque.titulo[lang]), "ok": not rotas})
    return {
        "escenario": escenario.id,
        "lang": lang,
        "titulo": escenario.titulo[lang],
        "vacante": escenario.vacante[lang],
        "trampa": escenario.trampa[lang] if escenario.trampa else None,
        "grabado": datetime.now(UTC).strftime("%Y-%m-%d"),
        "commit": _commit(),
        "hash_corpus": _hash(corpus_bytes),
        "hash_prompts": _hash((pipeline.PROMPT_EXTRAER + pipeline.PROMPT_EVALUAR).encode()),
        **cuerpo,
        "totales": {
            "costo_usd": round(sum(p["costo_usd"] for p in con_modelo), 6),
            "latencia_ms": sum(p["latencia_ms"] for p in con_modelo),
            "tokens": sum(p["tokens_entrada"] + p["tokens_salida"] for p in con_modelo),
        },
        "costo_ataques_usd": round(costo_ataques, 6),
        "evals": lista,
    }


def main() -> int:
    args = argparse.ArgumentParser()
    args.add_argument("--proyecto", required=True, help="Proyecto de GCP con Vertex AI")
    args.add_argument("--escenario", choices=[e.id for e in ESCENARIOS])
    args.add_argument("--lang", choices=["es", "en"])
    opciones = args.parse_args()

    if not CORPUS.exists():
        print("Falta dist/agente/corpus.json: corre `npm run build` antes.", file=sys.stderr)
        return 2
    pipeline.REGISTRO.verificar()
    corpus_bytes = CORPUS.read_bytes()
    llamador = pipeline.LlamadorAdk(opciones.proyecto)
    SALIDA.mkdir(parents=True, exist_ok=True)

    fallidas = 0
    for escenario in ESCENARIOS:
        if opciones.escenario and escenario.id != opciones.escenario:
            continue
        for lang in ["es", "en"]:
            if opciones.lang and lang != opciones.lang:
                continue
            t = traza(escenario, lang, corpus_bytes, llamador)
            rotas = [e["id"] for e in t["evals"] if not e["ok"]]
            resumen = f"{escenario.id}.{lang}: {t['totales']['costo_usd']:.4f} USD, {t['totales']['latencia_ms']} ms"
            with REGISTRO.open("a", encoding="utf-8") as registro:
                registro.write(json.dumps({"fecha": t["grabado"], "commit": t["commit"], "escenario": escenario.id, "lang": lang, "publicada": not rotas, "evals_rotas": rotas, "costo_usd": round(t["totales"]["costo_usd"] + t["costo_ataques_usd"], 6)}, ensure_ascii=False) + "\n")
            if rotas:
                fallidas += 1
                print(f"✗ {resumen}. Evals rotas: {rotas}. No se grabó.")
                print(json.dumps(t["requisitos"], ensure_ascii=False, indent=1))
                continue
            (SALIDA / f"{escenario.id}.{lang}.json").write_text(
                json.dumps(t, ensure_ascii=False, indent=1) + "\n", encoding="utf-8"
            )
            print(f"✓ {resumen}")
    return 1 if fallidas else 0


if __name__ == "__main__":
    raise SystemExit(main())

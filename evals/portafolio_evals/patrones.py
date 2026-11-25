"""Eval 1: patrones de texto generado, por código y sin modelo. Las reglas viven en ai_patterns.yaml."""

from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path

import yaml

from .inventario import Texto

SEVERIDADES = ("grave", "media", "leve")
# Oraciones: corta en . ! ? ; seguidos de espacio, sin partir cifras como 17.6 o 0.026.
FIN_ORACION = re.compile(r"(?<=[.!?;])\s+")
CIFRA = re.compile(r"\d")
TRIADA = re.compile(
    r"\b[\wáéíóúñü-]+(?: [\wáéíóúñü-]+){0,3}, [\wáéíóúñü-]+(?: [\wáéíóúñü-]+){0,3},? (?:y|e|o|and|or) [\wáéíóúñü-]+",
    re.IGNORECASE,
)
ADVERBIO = {"es": re.compile(r"\b\w{3,}mente\b", re.IGNORECASE), "en": re.compile(r"\b\w{3,}ly\b", re.IGNORECASE)}
# -ly que no son adverbios de valoración.
NO_ADVERBIO_EN = {"only", "early", "daily", "weekly", "monthly", "family", "reply", "apply", "supply", "july", "italy", "fly", "rely", "ally"}


@dataclass
class Regla:
    id: str
    descripcion: str
    severidad: str
    idioma: str
    patrones: list[re.Pattern]
    tipo: str = "regex"
    sin_evidencia: bool = False
    minimo: int = 1
    umbral: float = 0.0
    lexico: dict[str, set[str]] | None = None
    excepciones: frozenset[str] = frozenset()

    def aplica(self, idioma: str) -> bool:
        return self.idioma in ("ambos", idioma)


@dataclass
class Coincidencia:
    regla: str
    severidad: str
    descripcion: str
    fragmento: str
    inicio: int
    fin: int

    def a_dict(self) -> dict:
        return {
            "regla": self.regla,
            "severidad": self.severidad,
            "fragmento": self.fragmento,
            "posicion": [self.inicio, self.fin],
            "descripcion": self.descripcion,
        }


def cargar_reglas(ruta: Path) -> list[Regla]:
    datos = yaml.safe_load(ruta.read_text())
    reglas = []
    ids = set()
    for r in datos["reglas"]:
        if r["id"] in ids:
            raise ValueError(f"Regla repetida: {r['id']}")
        ids.add(r["id"])
        if r["severidad"] not in SEVERIDADES:
            raise ValueError(f"{r['id']}: severidad desconocida {r['severidad']!r}")
        reglas.append(
            Regla(
                id=r["id"],
                descripcion=r["descripcion"],
                severidad=r["severidad"],
                idioma=r.get("idioma", "ambos"),
                patrones=[re.compile(p, re.IGNORECASE | re.MULTILINE) for p in r.get("patrones", [])],
                tipo=r.get("tipo", "regex"),
                sin_evidencia=bool(r.get("sin_evidencia", False)),
                minimo=int(r.get("minimo", 1)),
                umbral=float(r.get("umbral", 0)),
                lexico={k: {str(w).lower() for w in v} for k, v in r.get("lexico", {}).items()} or None,
                excepciones=frozenset(r.get("excepciones", [])),
            )
        )
    return reglas


def _oracion_de(texto: str, pos: int) -> str:
    inicio = 0
    for m in FIN_ORACION.finditer(texto):
        if m.end() > pos:
            return texto[inicio : m.start()]
        inicio = m.end()
    return texto[inicio:]


def _regex(regla: Regla, texto: str) -> list[Coincidencia]:
    encontradas = []
    for patron in regla.patrones:
        for m in patron.finditer(texto):
            if regla.sin_evidencia and CIFRA.search(_oracion_de(texto, m.start())):
                continue
            encontradas.append(Coincidencia(regla.id, regla.severidad, regla.descripcion, m.group(0), m.start(), m.end()))
    if len(encontradas) < regla.minimo:
        return []
    return encontradas


def _es_lista_de_nombres(fragmento: str) -> bool:
    """«Meta, TikTok y DV360» es un dato, no un tic: se ignora si casi todo son nombres propios o siglas."""
    elementos = re.split(r",\s*|\s+(?:y|e|o|and|or)\s+", fragmento)
    nombres = sum(bool(re.match(r"[A-ZÁÉÍÓÚÑ0-9]", e.strip().split(" ")[-1] or "x")) for e in elementos)
    return nombres >= len(elementos) - 1


def _triadas(regla: Regla, texto: str) -> list[Coincidencia]:
    encontradas = [
        Coincidencia(regla.id, regla.severidad, regla.descripcion, m.group(0), m.start(), m.end())
        for m in TRIADA.finditer(texto)
        if not _es_lista_de_nombres(m.group(0))
    ]
    return encontradas if len(encontradas) >= regla.minimo else []


def _densidad(regla: Regla, texto: str, idioma: str) -> list[Coincidencia]:
    oraciones = [o for o in FIN_ORACION.split(texto) if o.strip()]
    if not oraciones or not regla.lexico:
        return []
    lexico = regla.lexico.get(idioma, set())
    marcas: list[re.Match] = []
    for m in re.finditer(r"[\wáéíóúñü]+", texto):
        w = m.group(0).lower()
        es_adv = bool(ADVERBIO[idioma].fullmatch(w)) and w not in NO_ADVERBIO_EN
        if w in lexico or es_adv:
            marcas.append(m)
    promedio = len(marcas) / len(oraciones)
    if promedio <= regla.umbral:
        return []
    fragmento = ", ".join(m.group(0) for m in marcas)
    return [
        Coincidencia(
            regla.id,
            regla.severidad,
            f"{regla.descripcion} Promedio: {promedio:.1f} por oración.",
            fragmento,
            marcas[0].start(),
            marcas[-1].end(),
        )
    ]


def evaluar(texto: Texto, reglas: list[Regla]) -> list[Coincidencia]:
    resultado: list[Coincidencia] = []
    for regla in reglas:
        if not regla.aplica(texto.idioma) or texto.clave in regla.excepciones:
            continue
        if regla.tipo == "triada":
            resultado += _triadas(regla, texto.texto)
        elif regla.tipo == "densidad":
            resultado += _densidad(regla, texto.texto, texto.idioma)
        else:
            resultado += _regex(regla, texto.texto)
    return sorted(resultado, key=lambda c: (SEVERIDADES.index(c.severidad), c.inicio))

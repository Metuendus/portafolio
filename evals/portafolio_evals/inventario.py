"""Carga el inventario y agrupa los textos en bloques.

Eval 1 juzga cada texto suelto. Los jueces juzgan bloques: un texto con su título, o una decisión con su
antes y su después, porque una frase aislada no se puede juzgar como la lee un reclutador.
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from pathlib import Path

# Campos que, dentro de un caso, forman un mismo bloque.
GRUPOS_CASO = {"problemTitle": "problema", "problemBody": "problema", "role": "rol", "roleNote": "rol"}
# Listas de registros: cuántos segmentos de la clave nombran un registro completo.
PROFUNDIDAD = {"quick": 3, "numbers": 2, "principles": 2, "more": 2, "authorship": 4, "timeline": 2, "fronts": 2}


@dataclass
class Texto:
    id: str
    texto: str
    pagina: str
    seccion: str
    tipo: str
    idioma: str
    fuente: str
    alcance: str
    url: str | None = None

    @property
    def clave(self) -> str:
        """El id sin el idioma: así lo nombran las excepciones de las reglas."""
        return self.id.rsplit(":", 1)[0]


@dataclass
class Bloque:
    id: str
    pagina: str
    seccion: str
    idioma: str
    textos: list[Texto] = field(default_factory=list)

    @property
    def contenido(self) -> str:
        return "\n".join(t.texto for t in self.textos)


def cargar(rutas: list[Path], alcance: list[str], idiomas: list[str]) -> list[Texto]:
    textos: list[Texto] = []
    for ruta in rutas:
        if not ruta.exists():
            continue
        for x in json.loads(ruta.read_text())["textos"]:
            if x["alcance"] in alcance and x["idioma"] in idiomas:
                textos.append(
                    Texto(
                        id=x["id"],
                        texto=x["texto"],
                        pagina=x["pagina"],
                        seccion=x["seccion"],
                        tipo=x["tipo"],
                        idioma=x["idioma"],
                        fuente=x["fuente"],
                        alcance=x["alcance"],
                        url=x.get("url"),
                    )
                )
    return textos


def id_bloque(t: Texto) -> str:
    modulo, clave, idioma = t.id.rsplit(":", 2) if t.id.count(":") >= 2 else (t.id, "", t.idioma)
    partes = clave.split(".")
    if partes[0] == "details" and len(partes) >= 3:
        campo = partes[2]
        if campo in GRUPOS_CASO:
            return f"{modulo}:details.{partes[1]}.{GRUPOS_CASO[campo]}:{idioma}"
        if campo == "decisions":
            return f"{modulo}:{'.'.join(partes[:4])}:{idioma}"
        return f"{modulo}:{'.'.join(partes[:3])}:{idioma}"
    if partes[0] == "articles" and "body" in partes:
        # Un bloque por sección del artículo (la sección es el último h2).
        seccion = re.sub(r" · \w+$", "", t.seccion)
        return f"{modulo}:{'.'.join(partes[:2])}.body.{seccion}:{idioma}"
    if partes[0] == "cases" and len(partes) >= 2:
        return f"{modulo}:cases.{partes[1]}:{idioma}"
    if partes[0] in PROFUNDIDAD:
        # Registros dentro de una lista: el registro completo es el bloque.
        return f"{modulo}:{'.'.join(partes[: PROFUNDIDAD[partes[0]]])}:{idioma}"
    if partes[0] == "secciones" and len(partes) >= 4:
        return f"{modulo}:{'.'.join(partes[:4])}:{idioma}"
    return t.id


def agrupar(textos: list[Texto]) -> list[Bloque]:
    bloques: dict[str, Bloque] = {}
    for t in textos:
        bid = id_bloque(t)
        if bid not in bloques:
            bloques[bid] = Bloque(id=bid, pagina=t.pagina, seccion=t.seccion, idioma=t.idioma)
        bloques[bid].textos.append(t)
    return list(bloques.values())

"""Evals 2 y 3: Claude como juez, vía Vertex AI por Fundamentum.

El juez no tiene herramientas ni historial (`agente_unico`) y el bloque va por `como_dato`. Las frases que
cita se comprueban con código: una frase que no exista tal cual en el bloque se descarta y se reporta.
"""

from __future__ import annotations

import asyncio
import hashlib
import json
import re
import unicodedata
from dataclasses import dataclass
from pathlib import Path
from typing import Literal, Protocol

from fundamentum_adk import Llamada, agente_unico, como_dato, llamar, modelo_adk
from pydantic import BaseModel, Field, ValidationError, conint

from .inventario import Bloque

APP = "portafolio_evals"
PROMPTS = Path(__file__).resolve().parent.parent / "prompts"
IDIOMA = {"es": "español", "en": "English"}
Puntaje = conint(ge=1, le=5)
Elemento = Literal["linea_base", "escala", "rol", "resultado", "periodo"]
ELEMENTOS: tuple[str, ...] = ("linea_base", "escala", "rol", "resultado", "periodo")


class FraseProblema(BaseModel):
    frase: str
    motivo: str


class JuicioReclutador(BaseModel):
    ai_smell: Puntaje
    especificidad: Puntaje
    credibilidad: Puntaje
    frases_problema: list[FraseProblema] = Field(default_factory=list)
    veredicto: str


class Logro(BaseModel):
    logro: str
    linea_base: bool
    escala: bool
    rol: bool
    resultado: bool
    periodo: bool
    faltan: list[Elemento] = Field(default_factory=list)
    calificacion: Puntaje
    nota: str


class JuicioEvidencia(BaseModel):
    logros: list[Logro] = Field(default_factory=list)


JUECES: dict[str, tuple[str, type[BaseModel]]] = {
    "reclutador": ("juez_reclutador.md", JuicioReclutador),
    "evidencia": ("juez_evidencia.md", JuicioEvidencia),
}


class Llamador(Protocol):
    async def __call__(self, juez: str, instruccion: str, partes: list[str]) -> Llamada: ...


@dataclass
class LlamadorAdk:
    """El real. En las pruebas se cambia por un guion, sin red."""

    proyecto: str
    modelo: str
    temperatura: float = 0

    async def __call__(self, juez: str, instruccion: str, partes: list[str]) -> Llamada:
        # Sin `esquema`: la salida estructurada de ADK no está garantizada con Claude, así que el JSON
        # se pide en el prompt y lo valida Pydantic aquí.
        agente = agente_unico(
            f"juez_{juez}", modelo_adk(self.modelo, proyecto=self.proyecto), instruccion=instruccion, temperatura=self.temperatura
        )
        return await llamar(agente, partes, usuario="evals", app=APP)


def plano(texto: str) -> str:
    """Compara frases sin que importen mayúsculas, espacios ni comillas tipográficas."""
    limpio = unicodedata.normalize("NFKC", texto)
    for a, b in (("’", "'"), ("‘", "'"), ("“", '"'), ("”", '"'), ("«", '"'), ("»", '"')):
        limpio = limpio.replace(a, b)
    return re.sub(r"\s+", " ", limpio).strip().casefold()


def extraer_json(texto: str) -> dict:
    """El primer objeto JSON de la respuesta, aunque venga envuelto en ``` o con texto alrededor."""
    inicio = texto.find("{")
    fin = texto.rfind("}")
    if inicio < 0 or fin <= inicio:
        raise ValueError("La respuesta no trae un objeto JSON")
    return json.loads(texto[inicio : fin + 1])


def instruccion(juez: str, idioma: str) -> str:
    archivo, _ = JUECES[juez]
    return (PROMPTS / archivo).read_text().replace("{idioma}", IDIOMA[idioma])


def version_prompt(juez: str) -> str:
    archivo, _ = JUECES[juez]
    return hashlib.sha256((PROMPTS / archivo).read_bytes()).hexdigest()[:10]


def partes_de(bloque: Bloque) -> list[str]:
    contexto = f"Página: {bloque.pagina}\nSección: {bloque.seccion}\nIdioma: {bloque.idioma}"
    return [contexto, como_dato(bloque.contenido, "bloque")]


def verificar(juez: str, juicio: BaseModel, bloque: Bloque) -> tuple[BaseModel, list[str]]:
    """Quita las citas que no existen tal cual en el bloque y devuelve lo que rechazó."""
    contenido = plano(bloque.contenido)
    rechazos: list[str] = []
    if juez == "reclutador":
        validas = []
        for f in juicio.frases_problema:
            if plano(f.frase) in contenido:
                validas.append(f)
            else:
                rechazos.append(f.frase)
        juicio.frases_problema = validas
    else:
        validos = []
        for lg in juicio.logros:
            if plano(lg.logro) in contenido:
                lg.faltan = [e for e in ELEMENTOS if not getattr(lg, e)]
                validos.append(lg)
            else:
                rechazos.append(lg.logro)
        juicio.logros = validos
    return juicio, rechazos


@dataclass
class Resultado:
    juez: str
    juicio: dict | None
    rechazos: list[str]
    costo_usd: float
    error: str | None = None
    cache: bool = False


class Cache:
    """Un juicio por (juez, prompt, modelo, bloque). Evita pagar dos veces por el mismo texto."""

    def __init__(self, ruta: Path):
        self.ruta = ruta
        self.datos: dict[str, dict] = {}
        if ruta.exists():
            for linea in ruta.read_text().splitlines():
                if linea.strip():
                    d = json.loads(linea)
                    self.datos[d["clave"]] = d

    @staticmethod
    def clave(juez: str, modelo: str, bloque: Bloque) -> str:
        h = hashlib.sha256(f"{juez}|{version_prompt(juez)}|{modelo}|{bloque.pagina}|{bloque.seccion}|{bloque.contenido}".encode())
        return h.hexdigest()[:24]

    def get(self, clave: str) -> dict | None:
        return self.datos.get(clave)

    def put(self, clave: str, valor: dict) -> None:
        self.datos[clave] = {"clave": clave, **valor}
        self.ruta.parent.mkdir(parents=True, exist_ok=True)
        with self.ruta.open("a") as f:
            f.write(json.dumps(self.datos[clave], ensure_ascii=False) + "\n")


async def juzgar(
    juez: str, bloque: Bloque, llamador: Llamador, modelo: str, cache: Cache | None = None, reintentos_json: int = 1
) -> Resultado:
    clave = Cache.clave(juez, modelo, bloque)
    if cache and (hit := cache.get(clave)):
        return Resultado(juez, hit["juicio"], hit["rechazos"], 0.0, cache=True)
    _, esquema = JUECES[juez]
    inst = instruccion(juez, bloque.idioma)
    partes = partes_de(bloque)
    costo, error = 0.0, None
    for intento in range(reintentos_json + 1):
        try:
            llamada = await llamador(juez, inst, partes)
        except Exception as e:  # la API falló: se reporta y la corrida sigue
            return Resultado(juez, None, [], costo, error=f"{type(e).__name__}: {str(e)[:300]}")
        costo += llamada.costo_usd()
        try:
            juicio = esquema.model_validate(extraer_json(llamada.texto))
        except (ValueError, ValidationError) as e:
            error = f"JSON inválido (intento {intento + 1}): {str(e)[:200]}"
            partes = [*partes_de(bloque), "Tu respuesta anterior no era JSON válido con el formato pedido. Responde solo con el objeto JSON."]
            continue
        juicio, rechazos = verificar(juez, juicio, bloque)
        datos = juicio.model_dump()
        if cache:
            cache.put(clave, {"juez": juez, "modelo": modelo, "bloque": bloque.id, "juicio": datos, "rechazos": rechazos})
        return Resultado(juez, datos, rechazos, costo)
    return Resultado(juez, None, [], costo, error=error)


async def juzgar_todos(
    bloques: list[Bloque], jueces: list[str], llamador: Llamador, modelo: str, cache: Cache | None, concurrencia: int, reintentos_json: int
) -> dict[str, dict[str, Resultado]]:
    sem = asyncio.Semaphore(concurrencia)
    salida: dict[str, dict[str, Resultado]] = {b.id: {} for b in bloques}

    async def uno(b: Bloque, j: str) -> None:
        async with sem:
            salida[b.id][j] = await juzgar(j, b, llamador, modelo, cache, reintentos_json)

    await asyncio.gather(*(uno(b, j) for b in bloques for j in jueces))
    return salida

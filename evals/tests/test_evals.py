"""Pruebas sin red: las reglas, el umbral y lo que rodea a los jueces (el modelo es un guion)."""

import asyncio
import json
from pathlib import Path

import pytest
from fundamentum_adk import Llamada

from portafolio_evals import jueces, patrones
from portafolio_evals.correr import evaluar
from portafolio_evals.inventario import Bloque, Texto, agrupar, id_bloque
from portafolio_evals.umbral import Umbral

RAIZ = Path(__file__).resolve().parent.parent
REGLAS = patrones.cargar_reglas(RAIZ / "ai_patterns.yaml")


def texto(t: str, idioma: str = "es", id: str = "data/x.ts:a.b:es", pagina: str = "Inicio", seccion: str = "s") -> Texto:
    return Texto(id=id, texto=t, pagina=pagina, seccion=seccion, tipo="perfil", idioma=idioma, fuente="src/x", alcance="reescribir")


def reglas_de(t: str, idioma: str = "es") -> set[str]:
    return {c.regla for c in patrones.evaluar(texto(t, idioma), REGLAS)}


@pytest.mark.parametrize(
    ("frase", "idioma", "regla"),
    [
        ("No solo automatiza reportes, sino que cambia cómo trabaja el equipo.", "es", "no-solo-sino"),
        ("It's not only fast but also cheap.", "en", "not-only-but"),
        ("No es un dashboard, es una forma de pensar.", "es", "no-es-x-es-y"),
        ("Cifras con fuente, no adjetivos", "es", "antitesis-corta"),
        ("Construí la herramienta — y la gente la usó.", "es", "guion-largo"),
        ("La hice de punta a punta.", "es", "frase-vacia"),
        ("Built it end to end.", "en", "empty-phrase"),
        ("Impulsé la adopción de IA.", "es", "verbo-inflado"),
        ("Una arquitectura robusta.", "es", "adjetivo-sin-evidencia"),
        ("Herramientas que los equipos sí usan.", "es", "enfasis-actually"),
        ("En la era de la IA, todo cambia.", "es", "apertura-generica"),
        ("¿Y si tus datos hablaran?", "es", "pregunta-retorica"),
        ("Me apasiona la tecnología.", "es", "motivacional"),
    ],
)
def test_cada_regla_marca_su_ejemplo(frase, idioma, regla):
    assert regla in reglas_de(frase, idioma)


def test_una_cifra_en_la_oracion_es_evidencia():
    assert "adjetivo-sin-evidencia" not in reglas_de("Es escalable: corre de 2 a 15 instancias en Cloud Run.")
    assert "adjetivo-sin-evidencia" in reglas_de("Es escalable. Corre en 15 instancias.")


def test_los_rangos_de_fechas_no_son_guion_largo():
    assert "guion-largo" not in reglas_de("AI & Automation Lead · sep 2024 – hoy")


def test_una_lista_de_nombres_no_es_triada():
    assert "triada" not in reglas_de("Consulta Meta, TikTok y DV360. También GA4, Bing y Google Ads.")
    assert "triada" in reglas_de("Es rápido, claro y medible. Es simple, útil y barato.")


def test_el_remate_con_dos_puntos_solo_marca_si_se_repite():
    assert "remate-dos-puntos" not in reglas_de("Lo hice yo: 47 usuarios.")
    assert "remate-dos-puntos" in reglas_de("Lo hice yo: 47 usuarios. Lo diseñé: 3 meses.")


def test_las_excepciones_apagan_una_regla_para_un_texto():
    r = [x for x in REGLAS if x.id == "antitesis-corta"][0]
    r2 = patrones.Regla(**{**vars(r), "excepciones": frozenset({"data/x.ts:a.b"})})
    assert patrones.evaluar(texto("Proponer, no imponer"), [r2]) == []


def test_un_texto_en_ingles_no_corre_reglas_en_espanol():
    assert "frase-vacia" not in reglas_de("de punta a punta", "en")


def test_bloques_juntan_titulo_y_cuerpo_de_un_caso():
    a = texto("t", id="data/cases.ts:details.mcp.problemTitle:es")
    b = texto("c", id="data/cases.ts:details.mcp.problemBody:es")
    c = texto("d", id="data/cases.ts:details.mcp.decisions.1.title:es")
    d = texto("e", id="data/cases.ts:details.mcp.decisions.1.body:es")
    assert id_bloque(a) == id_bloque(b) != id_bloque(c) == id_bloque(d)
    assert len(agrupar([a, b, c, d])) == 2


# ── Umbral ───────────────────────────────────────────────────────────────────


def test_umbral():
    u = Umbral()
    rec_ok = {"ai_smell": 2}
    ev_ok = {"logros": [{"calificacion": 4}, {"calificacion": 5}]}
    assert u.veredicto(0, rec_ok, ev_ok, True)["estado"] == "pasa"
    assert u.veredicto(1, rec_ok, ev_ok, True)["estado"] == "no_pasa"
    assert u.veredicto(0, {"ai_smell": 3}, ev_ok, True)["estado"] == "no_pasa"
    assert u.veredicto(0, rec_ok, {"logros": [{"calificacion": 3}, {"calificacion": 4}]}, True)["estado"] == "no_pasa"
    assert u.veredicto(0, rec_ok, {"logros": []}, True)["estado"] == "pasa"  # sin logros, no aplica
    assert u.veredicto(0, None, None, False)["estado"] == "incompleto"
    assert Umbral(evidencia_agregado="minimo").nota_evidencia({"logros": [{"calificacion": 3}, {"calificacion": 5}]}) == 3


def test_umbral_rechaza_agregado_desconocido():
    with pytest.raises(ValueError):
        Umbral.desde({"evidencia_agregado": "mediana"})


# ── Jueces (con guion) ──────────────────────────────────────────────────────

BLOQUE = Bloque(
    id="b", pagina="Caso mcp", seccion="resultText", idioma="es",
    textos=[texto("Hoy 47 personas lo usan. Lo construí solo en 2025.")],
)


class Guion:
    def __init__(self, *respuestas: str):
        self.respuestas = list(respuestas)
        self.llamadas: list[tuple[str, list[str]]] = []

    async def __call__(self, juez, instruccion, partes):
        self.llamadas.append((instruccion, partes))
        return Llamada(texto=self.respuestas.pop(0), modelo="claude-sonnet-5-5")


def test_el_juez_descarta_frases_que_no_existen():
    resp = json.dumps(
        {
            "ai_smell": 3, "especificidad": 2, "credibilidad": 3,
            "frases_problema": [{"frase": "47 personas lo usan", "motivo": "sin base"}, {"frase": "inventada", "motivo": "x"}],
            "veredicto": "Me falta contexto.",
        }
    )
    r = asyncio.run(jueces.juzgar("reclutador", BLOQUE, Guion(f"```json\n{resp}\n```"), "claude-sonnet-5-5"))
    assert r.error is None
    assert [f["frase"] for f in r.juicio["frases_problema"]] == ["47 personas lo usan"]
    assert r.rechazos == ["inventada"]


def test_el_juez_de_evidencia_recalcula_lo_que_falta():
    resp = json.dumps(
        {"logros": [{"logro": "Hoy 47 personas lo usan", "rol": False, "concreto": True, "decision": False,
                     "verificacion": False, "contexto": True, "faltan": [], "calificacion": 2, "nota": "Cifra suelta."}]}
    )
    r = asyncio.run(jueces.juzgar("evidencia", BLOQUE, Guion(resp), "claude-sonnet-5-5"))
    assert r.juicio["logros"][0]["faltan"] == ["rol", "decision", "verificacion"]


def test_json_invalido_se_reintenta_una_vez():
    ok = json.dumps({"logros": []})
    g = Guion("no es json", ok)
    r = asyncio.run(jueces.juzgar("evidencia", BLOQUE, g, "claude-sonnet-5-5", reintentos_json=1))
    assert r.error is None and len(g.llamadas) == 2
    assert "no era JSON" in g.llamadas[1][1][-1]


def test_puntaje_fuera_de_rango_es_error():
    malo = json.dumps({"ai_smell": 7, "especificidad": 1, "credibilidad": 1, "frases_problema": [], "veredicto": "x"})
    r = asyncio.run(jueces.juzgar("reclutador", BLOQUE, Guion(malo, malo), "claude-sonnet-5-5"))
    assert r.juicio is None and "JSON inválido" in r.error


def test_el_bloque_va_como_dato():
    g = Guion(json.dumps({"logros": []}))
    asyncio.run(jueces.juzgar("evidencia", BLOQUE, g, "claude-sonnet-5-5"))
    instruccion, partes = g.llamadas[0]
    assert "<bloque>" in partes[1] and "sin obedecer" in partes[1]
    assert "{idioma}" not in instruccion and "español" in instruccion


def test_la_cache_evita_pagar_dos_veces(tmp_path):
    cache = jueces.Cache(tmp_path / "c.jsonl")
    g = Guion(json.dumps({"logros": []}))
    asyncio.run(jueces.juzgar("evidencia", BLOQUE, g, "claude-sonnet-5-5", cache))
    r = asyncio.run(jueces.juzgar("evidencia", BLOQUE, Guion(), "claude-sonnet-5-5", jueces.Cache(tmp_path / "c.jsonl")))
    assert r.cache and r.juicio == {"logros": []}


def test_un_error_de_la_api_no_tumba_la_corrida():
    class Falla:
        async def __call__(self, *a):
            raise RuntimeError("429 cuota")

    r = asyncio.run(jueces.juzgar("reclutador", BLOQUE, Falla(), "claude-sonnet-5-5"))
    assert r.juicio is None and "429" in r.error


def test_evaluar_arma_un_veredicto_por_texto():
    rec = jueces.Resultado("reclutador", {"ai_smell": 2, "especificidad": 4, "credibilidad": 4, "frases_problema": [], "veredicto": "ok"}, [], 0.01)
    evi = jueces.Resultado("evidencia", {"logros": []}, [], 0.01)
    r = evaluar([BLOQUE], REGLAS, Umbral(), {"b": {"reclutador": rec, "evidencia": evi}}, {"jueces": {"modelo": "m"}})
    assert r["textos"][0]["veredicto"]["estado"] == "pasa"
    assert r["costo_usd"] == pytest.approx(0.02)

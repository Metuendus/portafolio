"""Umbral de aprobación: combina los tres evals en un veredicto por texto."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class Umbral:
    patrones_graves_max: int = 0
    ai_smell_max: int = 2
    evidencia_min: int = 4
    evidencia_agregado: str = "promedio"

    @classmethod
    def desde(cls, d: dict) -> "Umbral":
        u = cls(**d)
        if u.evidencia_agregado not in ("promedio", "minimo"):
            raise ValueError("evidencia_agregado debe ser promedio o minimo")
        return u

    def nota_evidencia(self, juicio: dict | None) -> float | None:
        """None si el bloque no tiene logros: la condición de evidencia no aplica."""
        if not juicio or not juicio.get("logros"):
            return None
        notas = [lg["calificacion"] for lg in juicio["logros"]]
        return min(notas) if self.evidencia_agregado == "minimo" else round(sum(notas) / len(notas), 2)

    def veredicto(self, graves: int, reclutador: dict | None, evidencia: dict | None, jueces_corridos: bool) -> dict:
        motivos = []
        if graves > self.patrones_graves_max:
            motivos.append(f"{graves} patrón(es) grave(s)")
        smell = reclutador["ai_smell"] if reclutador else None
        if smell is not None and smell > self.ai_smell_max:
            motivos.append(f"ai_smell {smell} > {self.ai_smell_max}")
        nota = self.nota_evidencia(evidencia)
        if nota is not None and nota < self.evidencia_min:
            motivos.append(f"evidencia {nota} < {self.evidencia_min}")
        if motivos:
            estado = "no_pasa"
        elif not jueces_corridos or reclutador is None or (evidencia is None):
            estado = "incompleto"
        else:
            estado = "pasa"
        return {"estado": estado, "motivos": motivos, "ai_smell": smell, "evidencia": nota}

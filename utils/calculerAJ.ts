import { Annexe, TauxCSG } from "../types/profil";
import {
  SEUIL_COTISATION_NULLE,
  SEUIL_COTISATION_CSG,
  TAUX_RETRAITE_COMPLEMENTAIRE,
  TAUX_CSG_STANDARD,
  TAUX_CSG_REDUIT,
  TAUX_CRDS,
  TAUX_ALSACE_MOSELLE,
} from "./reglementation";
import { AJ_MIN, PARAMS, tronquerCentime } from "./calculAJ.common";

export function calculerAJ(
  annexe: Annexe,
  salaireReference: number,
  heuresTravaillees: number
): number {
  const p = PARAMS[annexe];

  const A = tronquerCentime(
    (AJ_MIN *
      (p.coefSR1 * Math.min(salaireReference, p.seuilSR) +
        p.coefSR2 * Math.max(salaireReference - p.seuilSR, 0))) /
      5000
  );

  const B = tronquerCentime(
    (AJ_MIN *
      (p.coefNHT1 * Math.min(heuresTravaillees, p.seuilNHT) +
        p.coefNHT2 * Math.max(heuresTravaillees - p.seuilNHT, 0))) /
      507
  );

  const C = tronquerCentime(AJ_MIN * p.coefC);

  const brut = A + B + C;

  return Math.min(Math.max(brut, p.plancher), p.plafond);
}

export function calculerSJM(
  annexe: Annexe,
  salaireReference: number,
  heuresTravaillees: number
): number {
  const diviseur = annexe === "8" ? 8 : 10;
  return (salaireReference * diviseur) / heuresTravaillees;
}

export function calculerAJNette(
  ajBrute: number,
  sjm: number,
  tauxCSG: TauxCSG,
  alsaceMoselle: boolean
): number {
  if (ajBrute <= SEUIL_COTISATION_NULLE) {
    return ajBrute;
  }

  const retraite = tronquerCentime(sjm * TAUX_RETRAITE_COMPLEMENTAIRE);

  if (ajBrute <= SEUIL_COTISATION_CSG) {
    const alsace = alsaceMoselle
      ? tronquerCentime(ajBrute * TAUX_ALSACE_MOSELLE)
      : 0;
    return tronquerCentime(ajBrute - retraite - alsace);
  }

  const tauxEffectif = tauxCSG === "reduit" ? TAUX_CSG_REDUIT : TAUX_CSG_STANDARD;
  const csg = tronquerCentime(ajBrute * tauxEffectif);
  const crds = tronquerCentime(ajBrute * TAUX_CRDS);
  const alsace = alsaceMoselle
    ? tronquerCentime(ajBrute * TAUX_ALSACE_MOSELLE)
    : 0;

  return tronquerCentime(ajBrute - retraite - csg - crds - alsace);
}

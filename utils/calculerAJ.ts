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

const AJ_MIN = 31.96;

const PARAMS = {
  "8": {
    coefSR1: 0.42,
    seuilSR: 14400,
    coefSR2: 0.05,
    coefNHT1: 0.26,
    seuilNHT: 720,
    coefNHT2: 0.08,
    coefC: 0.40,
    plancher: 38,
    plafond: 174.8,
  },
  "10": {
    coefSR1: 0.36,
    seuilSR: 13700,
    coefSR2: 0.05,
    coefNHT1: 0.26,
    seuilNHT: 690,
    coefNHT2: 0.08,
    coefC: 0.70,
    plancher: 44,
    plafond: 174.8,
  },
} as const;

function tronquerCentime(valeur: number): number {
  return Math.floor(valeur * 100) / 100;
}

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

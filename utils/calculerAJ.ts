import { Annexe } from "../types/profil";

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

export function calculerAJ(
  annexe: Annexe,
  salaireReference: number,
  heuresTravaillees: number
): number {
  const p = PARAMS[annexe];

  const A =
    (AJ_MIN *
      (p.coefSR1 * Math.min(salaireReference, p.seuilSR) +
        p.coefSR2 * Math.max(salaireReference - p.seuilSR, 0))) /
    5000;

  const B =
    (AJ_MIN *
      (p.coefNHT1 * Math.min(heuresTravaillees, p.seuilNHT) +
        p.coefNHT2 * Math.max(heuresTravaillees - p.seuilNHT, 0))) /
    507;

  const C = AJ_MIN * p.coefC;

  const brut = A + B + C;

  return Math.min(Math.max(brut, p.plancher), p.plafond);
}

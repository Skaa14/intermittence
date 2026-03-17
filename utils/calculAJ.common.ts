import { Annexe } from "../types/profil";

export const AJ_MIN = 31.96;

export const PARAMS = {
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

export function tronquerCentime(valeur: number): number {
  return Math.floor(+(valeur * 100).toPrecision(12)) / 100;
}

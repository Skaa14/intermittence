import { Enseignement } from "../types/enseignement";
import { parseDate } from "./date";
import { PLAFOND_HEURES_ENSEIGNEMENT } from "./reglementation";

export function calculerHeuresEnseignementPlafonnees(enseignements: Enseignement[]): number {
  const total = enseignements.reduce((sum, e) => sum + e.heures, 0);
  return Math.min(total, PLAFOND_HEURES_ENSEIGNEMENT);
}

export function calculerJoursEnseignementDansMois(
  enseignements: Enseignement[],
  debutMois: Date,
  finMois: Date
): number {
  let jours = 0;

  for (const e of enseignements) {
    const debut = parseDate(e.dateDebut);
    const fin = parseDate(e.dateFin);
    if (!debut || !fin) continue;

    const overlapDebut = debut > debutMois ? debut : debutMois;
    const overlapFin = fin < finMois ? fin : finMois;

    if (overlapDebut <= overlapFin) {
      const diff = Math.floor(
        (overlapFin.getTime() - overlapDebut.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
      jours += diff;
    }
  }

  return jours;
}

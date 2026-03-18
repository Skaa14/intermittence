import { Formation } from "../types/formation";
import { parseDate } from "./date";
import { PLAFOND_HEURES_FORMATION } from "./reglementation";

export function filtrerFormationsOptionA(formations: Formation[]): Formation[] {
  return formations.filter((f) => f.option === "compterHeures");
}

export function calculerHeuresFormationPlafonnees(formations: Formation[]): number {
  const total = filtrerFormationsOptionA(formations).reduce((sum, f) => sum + f.heures, 0);
  return Math.min(total, PLAFOND_HEURES_FORMATION);
}

export function calculerJoursFormationDansMois(
  formations: Formation[],
  debutMois: Date,
  finMois: Date
): number {
  const formationsA = filtrerFormationsOptionA(formations);
  let jours = 0;

  for (const f of formationsA) {
    const debut = parseDate(f.dateDebut);
    const fin = parseDate(f.dateFin);
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

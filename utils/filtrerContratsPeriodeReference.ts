import { Contrat } from "../types/contrat";
import { parseDate } from "./date";

export function trouverFCT(contrats: Contrat[]): Date | undefined {
  let fct: Date | undefined;
  for (const c of contrats) {
    const fin = parseDate(c.dateFin);
    if (!fin) continue;
    if (!fct || fin > fct) fct = fin;
  }
  return fct;
}

export function calculerDebutPeriodeReference(fct: Date): Date {
  return new Date(fct.getFullYear() - 1, fct.getMonth(), fct.getDate() + 1);
}

export function filtrerContratsPeriodeReference(contrats: Contrat[]): Contrat[] {
  const fct = trouverFCT(contrats);
  if (!fct) return [];

  const debutFenetre = calculerDebutPeriodeReference(fct);

  return contrats.filter((c) => {
    const fin = parseDate(c.dateFin);
    if (!fin) return false;
    return fin >= debutFenetre && fin <= fct;
  });
}

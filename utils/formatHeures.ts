import { Contrat } from "../types/contrat";

export function formaterHeures(contrat: Pick<Contrat, "heures" | "type">): string {
  if (contrat.type === "cachets") {
    const nb = contrat.heures / 12;
    return `${nb} cachet${nb > 1 ? "s" : ""}`;
  }
  return `${contrat.heures} h`;
}

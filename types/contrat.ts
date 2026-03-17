export type TypeHeures = "heures" | "cachets";

export interface Contrat {
  id: string;
  employeur: string;
  dateDebut: string; // format JJ/MM/AAAA
  dateFin: string;
  heures: number;
  salaireBrut: number;
  type?: TypeHeures;
}

export type OptionFormation = "compterHeures" | "garderARE";

export interface Formation {
  id: string;
  intitule: string;
  dateDebut: string; // format JJ/MM/AAAA
  dateFin: string;
  heures: number;
  option: OptionFormation;
}

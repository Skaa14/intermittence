export type Annexe = "8" | "10";
export type TauxCSG = "standard" | "reduit";

export interface ProfilIntermittent {
  id: string;
  nom: string;
  annexe: Annexe;
  dateAnniversaire: string;
  salaireReference: number;
  heuresTravaillees: number;
  tauxCSG: TauxCSG;
  alsaceMoselle: boolean;
}

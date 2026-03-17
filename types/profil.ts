export type Annexe = "8" | "10";
export type TauxCSG = "standard" | "reduit";

export interface ProfilIntermittent {
  annexe: Annexe;
  dateAnniversaire: string;
  salaireReference: number;
  heuresTravaillees: number;
  tauxCSG: TauxCSG;
  alsaceMoselle: boolean;
}

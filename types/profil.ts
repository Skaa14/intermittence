export type Annexe = "8" | "10";
export type TauxCSG = "standard" | "reduit";

interface ProfilBase {
  id: string;
  nom: string;
  annexe: Annexe;
  tauxCSG: TauxCSG;
  alsaceMoselle: boolean;
}

interface ProfilAvecDroits extends ProfilBase {
  aOuvertDroits: true;
  dateAnniversaire: string;
  salaireReference: number;
  heuresTravaillees: number;
}

interface ProfilSansDroits extends ProfilBase {
  aOuvertDroits: false;
  dateAnniversaire?: undefined;
  salaireReference?: undefined;
  heuresTravaillees?: undefined;
}

export type ProfilIntermittent = ProfilAvecDroits | ProfilSansDroits;

type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;
export type ProfilSansId = DistributiveOmit<ProfilIntermittent, "id">;

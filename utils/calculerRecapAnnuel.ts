import { Contrat } from "../types/contrat";
import { Formation } from "../types/formation";
import { Enseignement } from "../types/enseignement";
import { ProfilIntermittent } from "../types/profil";
import { calculerIndemnisationMensuelle } from "./calculerIndemnisationMensuelle";

export interface RecapMois {
  index: number;
  mois: Date;
  heures: number;
  salaire: number;
  nombreContrats: number;
  enCours: boolean;
}

export function calculerRecapAnnuel(
  profil: ProfilIntermittent,
  contrats: Contrat[],
  formations: Formation[] = [],
  enseignements: Enseignement[] = []
): RecapMois[] {
  if (!profil.aOuvertDroits) return [];

  const mois = calculerIndemnisationMensuelle(profil, contrats, formations, enseignements);

  return mois
    .filter((m) => m.etat !== "à venir")
    .map((m) => ({
      index: m.index,
      mois: m.mois,
      heures: m.heuresDuMois,
      salaire: m.salaireDuMois,
      nombreContrats: m.contratsDuMois.length,
      enCours: m.etat === "en cours",
    }))
    .reverse();
}

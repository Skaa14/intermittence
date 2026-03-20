import { Contrat } from "../../types/contrat";
import { Formation } from "../../types/formation";
import { Enseignement } from "../../types/enseignement";
import { ProfilIntermittent } from "../../types/profil";

export function contrat(overrides: Partial<Contrat> = {}): Contrat {
  return {
    id: "1",
    employeur: "Test",
    dateDebut: "01/01/2026",
    dateFin: "31/01/2026",
    heures: 40,
    salaireBrut: 1500,
    ...overrides,
  };
}

export function formation(overrides: Partial<Formation> = {}): Formation {
  return {
    id: "1",
    intitule: "Formation test",
    dateDebut: "01/03/2026",
    dateFin: "15/03/2026",
    heures: 70,
    option: "compterHeures",
    ...overrides,
  };
}

export function enseignement(overrides: Partial<Enseignement> = {}): Enseignement {
  return {
    id: "1",
    etablissement: "Conservatoire test",
    dateDebut: "01/03/2026",
    dateFin: "15/03/2026",
    heures: 40,
    salaireBrut: 1800,
    ...overrides,
  };
}

export function profil(overrides: Partial<ProfilIntermittent> = {}): ProfilIntermittent {
  return {
    id: "profil-1",
    nom: "Profil test",
    annexe: "8",
    dateAnniversaire: "15/09/2026",
    salaireReference: 18000,
    heuresTravaillees: 600,
    tauxCSG: "standard",
    alsaceMoselle: false,
    ...overrides,
  };
}

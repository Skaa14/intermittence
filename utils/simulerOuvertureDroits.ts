import { Contrat } from "../types/contrat";
import { Formation } from "../types/formation";
import { ProfilIntermittent } from "../types/profil";
import { parseDate } from "./date";
import { filtrerContratsParFCT } from "./filtrerContratsPeriodeReference";
import { calculerHeuresFormationPlafonnees } from "./calculerHeuresFormation";
import { calculerAJ, calculerSJM, calculerAJNette } from "./calculerAJ";

export interface DateOuvertureEligible {
  contrat: Contrat;
  dateFCT: Date;
  heuresCumulees: number;
}

export interface SimulationOuverture {
  dateAnniversaire: Date;
  dateFinIndemnisation: Date;
  salaireReference: number;
  heuresTravaillees: number;
  ajBrute: number;
  ajNette: number;
}

export function trouverDatesOuvertureEligibles(
  contrats: Contrat[],
  formations: Formation[]
): DateOuvertureEligible[] {
  const heuresFormation = calculerHeuresFormationPlafonnees(formations);

  const datesVues = new Set<string>();
  const eligibles: DateOuvertureEligible[] = [];

  const contratsTries = [...contrats].sort((a, b) => {
    const dateA = parseDate(a.dateFin);
    const dateB = parseDate(b.dateFin);
    if (!dateA || !dateB) return 0;
    return dateB.getTime() - dateA.getTime();
  });

  for (const contrat of contratsTries) {
    const fct = parseDate(contrat.dateFin);
    if (!fct) continue;

    const cle = fct.getTime().toString();
    if (datesVues.has(cle)) continue;
    datesVues.add(cle);

    const contratsFiltres = filtrerContratsParFCT(contrats, fct);
    const heuresContrats = contratsFiltres.reduce((sum, c) => sum + c.heures, 0);
    const total = heuresContrats + heuresFormation;

    if (total >= 507) {
      eligibles.push({ contrat, dateFCT: fct, heuresCumulees: total });
    }
  }

  return eligibles;
}

export function simulerOuverture(
  contrats: Contrat[],
  formations: Formation[],
  dateFCT: Date,
  profil: ProfilIntermittent
): SimulationOuverture {
  const contratsFiltres = filtrerContratsParFCT(contrats, dateFCT);
  const heuresFormation = calculerHeuresFormationPlafonnees(formations);

  const salaireReference = contratsFiltres.reduce((sum, c) => sum + c.salaireBrut, 0);
  const heuresTravaillees = contratsFiltres.reduce((sum, c) => sum + c.heures, 0) + heuresFormation;

  const ajBrute = calculerAJ(profil.annexe, salaireReference, heuresTravaillees);
  const sjm = calculerSJM(profil.annexe, salaireReference, heuresTravaillees);
  const ajNette = calculerAJNette(ajBrute, sjm, profil.tauxCSG, profil.alsaceMoselle);

  const dateAnniversaire = new Date(dateFCT.getFullYear(), dateFCT.getMonth(), dateFCT.getDate() + 1);
  const dateFinIndemnisation = new Date(dateAnniversaire.getFullYear() + 1, dateAnniversaire.getMonth(), dateAnniversaire.getDate() - 1);

  return {
    dateAnniversaire,
    dateFinIndemnisation,
    salaireReference,
    heuresTravaillees,
    ajBrute,
    ajNette,
  };
}

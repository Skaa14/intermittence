import { Contrat } from "../types/contrat";
import { Formation } from "../types/formation";
import { Enseignement } from "../types/enseignement";
import { ProfilIntermittent } from "../types/profil";
import { parseDate } from "./date";
import { filtrerContratsParFCT, filtrerParPeriodeReference } from "./filtrerContratsPeriodeReference";
import { calculerHeuresFormationPlafonnees } from "./calculerHeuresFormation";
import { calculerHeuresEnseignementPlafonnees } from "./calculerHeuresEnseignement";
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
  heuresEligiblesAJ: number;
  heuresEnseignement: number;
  ajBrute: number;
  ajNette: number;
}

export function trouverDatesOuvertureEligibles(
  contrats: Contrat[],
  formations: Formation[],
  enseignements: Enseignement[] = []
): DateOuvertureEligible[] {
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
    const heuresFormation = calculerHeuresFormationPlafonnees(filtrerParPeriodeReference(formations, fct));
    const heuresEnseignement = calculerHeuresEnseignementPlafonnees(filtrerParPeriodeReference(enseignements, fct));
    const total = heuresContrats + heuresFormation + heuresEnseignement;

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
  profil: ProfilIntermittent,
  enseignements: Enseignement[] = []
): SimulationOuverture {
  const contratsFiltres = filtrerContratsParFCT(contrats, dateFCT);
  const heuresFormation = calculerHeuresFormationPlafonnees(filtrerParPeriodeReference(formations, dateFCT));
  const heuresEnseignement = calculerHeuresEnseignementPlafonnees(filtrerParPeriodeReference(enseignements, dateFCT));

  const salaireReference = contratsFiltres.reduce((sum, c) => sum + c.salaireBrut, 0);
  const heuresContrats = contratsFiltres.reduce((sum, c) => sum + c.heures, 0);
  const heuresEligiblesAJ = heuresContrats + heuresFormation;

  const ajBrute = calculerAJ(profil.annexe, salaireReference, heuresEligiblesAJ);
  const sjm = calculerSJM(profil.annexe, salaireReference, heuresEligiblesAJ);
  const ajNette = calculerAJNette(ajBrute, sjm, profil.tauxCSG, profil.alsaceMoselle);

  const dateAnniversaire = new Date(dateFCT.getFullYear(), dateFCT.getMonth(), dateFCT.getDate() + 1);
  const dateFinIndemnisation = new Date(dateAnniversaire.getFullYear() + 1, dateAnniversaire.getMonth(), dateAnniversaire.getDate() - 1);

  return {
    dateAnniversaire,
    dateFinIndemnisation,
    salaireReference,
    heuresEligiblesAJ,
    heuresEnseignement,
    ajBrute,
    ajNette,
  };
}

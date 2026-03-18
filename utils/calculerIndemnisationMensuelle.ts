import { Contrat } from "../types/contrat";
import { Formation } from "../types/formation";
import { Enseignement } from "../types/enseignement";
import { ProfilIntermittent } from "../types/profil";
import { parseDate } from "./date";
import { calculerAJ, calculerAJNette, calculerSJM } from "./calculerAJ";
import { calculerJoursFormationDansMois } from "./calculerHeuresFormation";
import { calculerJoursEnseignementDansMois } from "./calculerHeuresEnseignement";
import {
  SMIC_MENSUEL,
  SMIC_JOURNALIER,
  PMSS_MENSUEL,
  DELAI_ATTENTE_JOURS,
  COEF_JOURS_NON_INDEMNISABLES_A8,
  COEF_JOURS_NON_INDEMNISABLES_A10,
  COEF_PLAFOND_PMSS,
  PLAFOND_FRANCHISE_CP_JOURS,
  PERIODICITE_FRANCHISE_CP,
  TAUX_FRANCHISE_CP,
  SEUIL_FRANCHISE_CP_MENSUEL,
  FRANCHISE_CP_MENSUELLE_BAS,
  FRANCHISE_CP_MENSUELLE_HAUT,
  MOIS_FRANCHISE_SALAIRE,
  COEF_SJM_FRANCHISE_SALAIRE,
  CONSTANTE_FRANCHISE_SALAIRE,
  SEUIL_NON_INDEMNISATION_A8,
  SEUIL_NON_INDEMNISATION_A10,
} from "./reglementation";

export interface IndemnisationMensuelle {
  mois: Date;
  index: number;
  contratsDuMois: Contrat[];
  formationsDuMois: Formation[];
  enseignementsDuMois: Enseignement[];
  salaireDuMois: number;
  heuresDuMois: number;
  joursTravailles: number;
  joursFormation: number;
  joursEnseignement: number;
  joursCalendaires: number;
  delaiAttente: number;
  franchiseCP: number;
  franchiseSalaire: number;
  joursIndemnises: number;
  aj: number;
  ajNette: number;
  areNetteEstimee: number;
  areVerseeAvantPlafond: number;
  areVersee: number;
  seuilNonIndemnisationAtteint: boolean;
  plafondAtteint: boolean;
  plafondMontant: number;
  totalRecu: number;
  etat: "passé" | "en cours" | "à venir";
}

function calculerFranchisesParMois(
  profil: ProfilIntermittent
): { franchiseCPParMois: number[]; franchiseSalaireParMois: number[] } {
  if (profil.heuresTravaillees === 0) {
    return {
      franchiseCPParMois: Array(12).fill(0),
      franchiseSalaireParMois: Array(12).fill(0),
    };
  }

  const diviseur = profil.annexe === "8" ? 8 : 10;
  const joursRef = profil.heuresTravaillees / diviseur;

  // Total arrondi au nombre entier obtenu (Math.floor) — guide France Travail p.13
  const totalFranchiseCP = Math.min(
    PLAFOND_FRANCHISE_CP_JOURS,
    Math.floor((joursRef / PERIODICITE_FRANCHISE_CP) * TAUX_FRANCHISE_CP)
  );
  const tauxMensuelCP =
    totalFranchiseCP <= SEUIL_FRANCHISE_CP_MENSUEL
      ? FRANCHISE_CP_MENSUELLE_BAS
      : FRANCHISE_CP_MENSUELLE_HAUT;
  const franchiseCPParMois = Array.from({ length: 12 }, (_, i) => {
    const deja = i * tauxMensuelCP;
    return Math.min(tauxMensuelCP, Math.max(0, totalFranchiseCP - deja));
  });

  const sjm = (profil.salaireReference * diviseur) / profil.heuresTravaillees;
  const franchiseSalaireRaw =
    (profil.salaireReference / SMIC_MENSUEL) *
      (sjm / (COEF_SJM_FRANCHISE_SALAIRE * SMIC_JOURNALIER)) -
    CONSTANTE_FRANCHISE_SALAIRE;
  // Total arrondi au nombre entier obtenu (Math.floor) — guide France Travail p.14
  const totalFranchiseSalaire = Math.max(0, Math.floor(franchiseSalaireRaw));

  // Mensuelle arrondie à l'entier supérieur (Math.ceil) — guide France Travail p.15
  const mensuelleBase =
    totalFranchiseSalaire > 0
      ? Math.ceil(totalFranchiseSalaire / MOIS_FRANCHISE_SALAIRE)
      : 0;
  const franchiseSalaireParMois = Array.from({ length: 12 }, (_, i) => {
    if (i >= MOIS_FRANCHISE_SALAIRE || totalFranchiseSalaire === 0) return 0;
    const deja = i * mensuelleBase;
    if (deja >= totalFranchiseSalaire) return 0;
    return Math.min(mensuelleBase, totalFranchiseSalaire - deja);
  });

  return { franchiseCPParMois, franchiseSalaireParMois };
}

export function calculerIndemnisationMensuelle(
  profil: ProfilIntermittent,
  contrats: Contrat[],
  formations: Formation[] = [],
  enseignements: Enseignement[] = []
): IndemnisationMensuelle[] {
  const dateAnniversaire = parseDate(profil.dateAnniversaire);
  if (!dateAnniversaire) return [];

  const aj = calculerAJ(
    profil.annexe,
    profil.salaireReference,
    profil.heuresTravaillees
  );
  const sjm = calculerSJM(
    profil.annexe,
    profil.salaireReference,
    profil.heuresTravaillees
  );
  const ajNette = calculerAJNette(aj, sjm, profil.tauxCSG, profil.alsaceMoselle);
  const aujourdhui = new Date();

  const { franchiseCPParMois, franchiseSalaireParMois } =
    calculerFranchisesParMois(profil);
  const plafondMontant = PMSS_MENSUEL * COEF_PLAFOND_PMSS;

  return Array.from({ length: 12 }, (_, i) => {
    const debutMois = new Date(
      dateAnniversaire.getFullYear(),
      dateAnniversaire.getMonth() + i,
      1
    );
    const finMois = new Date(
      debutMois.getFullYear(),
      debutMois.getMonth() + 1,
      0
    );
    const joursCalendairesMois = finMois.getDate();
    const joursCalendaires =
      i === 0
        ? joursCalendairesMois - dateAnniversaire.getDate() + 1
        : joursCalendairesMois;

    const contratsDuMois = contrats.filter((c) => {
      const debut = parseDate(c.dateDebut);
      return (
        debut &&
        debut.getFullYear() === debutMois.getFullYear() &&
        debut.getMonth() === debutMois.getMonth()
      );
    });

    const formationsDuMois = formations.filter((fo) => {
      const debut = parseDate(fo.dateDebut);
      const fin = parseDate(fo.dateFin);
      if (!debut || !fin) return false;
      return debut <= finMois && fin >= debutMois;
    });

    const enseignementsDuMois = enseignements.filter((e) => {
      const debut = parseDate(e.dateDebut);
      const fin = parseDate(e.dateFin);
      if (!debut || !fin) return false;
      return debut <= finMois && fin >= debutMois;
    });

    const salaireDuMois = contratsDuMois.reduce(
      (s, c) => s + c.salaireBrut,
      0
    );
    const heuresDuMois = contratsDuMois.reduce((h, c) => h + c.heures, 0);
    const diviseur = profil.annexe === "8" ? 8 : 10;
    const joursTravaillesBruts = heuresDuMois / diviseur;
    const seuilNonIndemnisation =
      profil.annexe === "8"
        ? SEUIL_NON_INDEMNISATION_A8
        : SEUIL_NON_INDEMNISATION_A10;
    const debutEffectif = i === 0
      ? new Date(debutMois.getFullYear(), debutMois.getMonth(), dateAnniversaire.getDate())
      : debutMois;
    const joursFormation = calculerJoursFormationDansMois(
      formations,
      debutEffectif,
      finMois
    );
    const joursEnseignement = calculerJoursEnseignementDansMois(
      enseignements,
      debutEffectif,
      finMois
    );

    const seuilNonIndemnisationAtteint =
      joursTravaillesBruts >= seuilNonIndemnisation;

    const joursTravailles = Math.floor(
      profil.annexe === "8"
        ? (heuresDuMois / 8) * COEF_JOURS_NON_INDEMNISABLES_A8
        : (heuresDuMois / 10) * COEF_JOURS_NON_INDEMNISABLES_A10
    );

    const delaiAttente = i === 0 ? DELAI_ATTENTE_JOURS : 0;
    const franchiseCP = franchiseCPParMois[i];
    const franchiseSalaire = franchiseSalaireParMois[i];
    const joursIndemnises = seuilNonIndemnisationAtteint
      ? 0
      : Math.max(
          0,
          joursCalendaires
            - joursTravailles
            - joursFormation
            - joursEnseignement
            - delaiAttente
            - franchiseCP
            - franchiseSalaire
        );
    const areVerseeAvantPlafond = Math.round(aj * joursIndemnises);
    const areNetteEstimee = Math.round(ajNette * joursIndemnises);
    let areVersee: number;
    if (salaireDuMois >= plafondMontant) {
      areVersee = 0;
    } else if (salaireDuMois + areVerseeAvantPlafond > plafondMontant) {
      areVersee = Math.round(plafondMontant - salaireDuMois);
    } else {
      areVersee = areVerseeAvantPlafond;
    }
    const plafondAtteint =
      salaireDuMois >= plafondMontant ||
      salaireDuMois + areVerseeAvantPlafond > plafondMontant;
    const totalRecu = salaireDuMois + areVersee;

    const estMoisPassé =
      debutMois.getFullYear() < aujourdhui.getFullYear() ||
      (debutMois.getFullYear() === aujourdhui.getFullYear() &&
        debutMois.getMonth() < aujourdhui.getMonth());
    const estMoisEnCours =
      debutMois.getFullYear() === aujourdhui.getFullYear() &&
      debutMois.getMonth() === aujourdhui.getMonth();
    const etat = estMoisPassé ? "passé" : estMoisEnCours ? "en cours" : "à venir";

    return {
      mois: debutMois,
      index: i,
      contratsDuMois,
      formationsDuMois,
      enseignementsDuMois,
      salaireDuMois,
      heuresDuMois,
      joursTravailles,
      joursFormation,
      joursEnseignement,
      joursCalendaires,
      delaiAttente,
      franchiseCP,
      franchiseSalaire,
      joursIndemnises,
      aj,
      ajNette,
      areNetteEstimee,
      areVerseeAvantPlafond,
      areVersee,
      seuilNonIndemnisationAtteint,
      plafondAtteint,
      plafondMontant,
      totalRecu,
      etat,
    };
  });
}

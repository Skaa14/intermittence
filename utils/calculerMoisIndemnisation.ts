import { Contrat } from "../types/contrat";
import { ProfilIntermittent } from "../types/profil";
import { parseDate } from "./date";
import { calculerAJ } from "./calculerAJ";
import { SMIC_MENSUEL, SMIC_JOURNALIER } from "./reglementation";

export interface MoisIndemnisation {
  mois: Date;
  index: number;
  contratsDuMois: Contrat[];
  salaireDuMois: number;
  heuresDuMois: number;
  joursTravailles: number;
  joursCalendaires: number;
  delaiAttente: number;
  franchiseCP: number;
  franchiseSalaire: number;
  joursIndemnises: number;
  aj: number;
  areVersee: number;
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
    30,
    Math.floor((joursRef / 24) * 2.5)
  );
  const tauxMensuelCP = totalFranchiseCP <= 24 ? 2 : 3;
  const franchiseCPParMois = Array.from({ length: 12 }, (_, i) => {
    const deja = i * tauxMensuelCP;
    return Math.min(tauxMensuelCP, Math.max(0, totalFranchiseCP - deja));
  });

  const sjm = (profil.salaireReference * diviseur) / profil.heuresTravaillees;
  const franchiseSalaireRaw =
    (profil.salaireReference / SMIC_MENSUEL) *
      (sjm / (3 * SMIC_JOURNALIER)) -
    27;
  // Total arrondi au nombre entier obtenu (Math.floor) — guide France Travail p.14
  const totalFranchiseSalaire = Math.max(0, Math.floor(franchiseSalaireRaw));

  // Mensuelle arrondie à l'entier supérieur (Math.ceil) — guide France Travail p.15
  const mensuelleBase =
    totalFranchiseSalaire > 0 ? Math.ceil(totalFranchiseSalaire / 8) : 0;
  const franchiseSalaireParMois = Array.from({ length: 12 }, (_, i) => {
    if (i >= 8 || totalFranchiseSalaire === 0) return 0;
    const deja = i * mensuelleBase;
    if (deja >= totalFranchiseSalaire) return 0;
    return Math.min(mensuelleBase, totalFranchiseSalaire - deja);
  });

  return { franchiseCPParMois, franchiseSalaireParMois };
}

export function calculerMoisIndemnisation(
  profil: ProfilIntermittent,
  contrats: Contrat[]
): MoisIndemnisation[] {
  const dateAnniversaire = parseDate(profil.dateAnniversaire);
  if (!dateAnniversaire) return [];

  const aj = calculerAJ(
    profil.annexe,
    profil.salaireReference,
    profil.heuresTravaillees
  );
  const DELAI_ATTENTE_PREMIER_MOIS = 7;
  const aujourdhui = new Date();

  const { franchiseCPParMois, franchiseSalaireParMois } =
    calculerFranchisesParMois(profil);

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
    const joursCalendaires = finMois.getDate();

    const contratsDuMois = contrats.filter((c) => {
      const debut = parseDate(c.dateDebut);
      return (
        debut &&
        debut.getFullYear() === debutMois.getFullYear() &&
        debut.getMonth() === debutMois.getMonth()
      );
    });

    const salaireDuMois = contratsDuMois.reduce(
      (s, c) => s + c.salaireBrut,
      0
    );
    const heuresDuMois = contratsDuMois.reduce((h, c) => h + c.heures, 0);
    const joursTravailles = Math.floor(
      profil.annexe === "8"
        ? (heuresDuMois / 8) * 1.4
        : (heuresDuMois / 10) * 1.3
    );

    const delaiAttente = i === 0 ? DELAI_ATTENTE_PREMIER_MOIS : 0;
    const franchiseCP = franchiseCPParMois[i];
    const franchiseSalaire = franchiseSalaireParMois[i];
    const joursIndemnises = Math.max(
      0,
      joursCalendaires
        - joursTravailles
        - delaiAttente
        - franchiseCP
        - franchiseSalaire
    );
    const areVersee = Math.round(aj * joursIndemnises);
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
      salaireDuMois,
      heuresDuMois,
      joursTravailles,
      joursCalendaires,
      delaiAttente,
      franchiseCP,
      franchiseSalaire,
      joursIndemnises,
      aj,
      areVersee,
      totalRecu,
      etat,
    };
  });
}

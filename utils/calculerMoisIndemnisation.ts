import { Contrat } from "../types/contrat";
import { ProfilIntermittent } from "../types/profil";
import { parseDate } from "./date";
import { calculerAJ } from "./calculerAJ";

export interface MoisIndemnisation {
  mois: Date;
  index: number;
  contratsDuMois: Contrat[];
  salaireDuMois: number;
  heuresDuMois: number;
  joursTravailles: number;
  joursCalendaires: number;
  delaiAttente: number;
  joursIndemnises: number;
  areVersee: number;
  totalRecu: number;
  etat: "passé" | "en cours" | "à venir";
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
    const joursIndemnises = Math.max(
      0,
      joursCalendaires - joursTravailles - delaiAttente
    );
    const areVersee = aj * joursIndemnises;
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
      joursIndemnises,
      areVersee,
      totalRecu,
      etat,
    };
  });
}

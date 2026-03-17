import { Contrat } from "../types/contrat";
import { ProfilIntermittent } from "../types/profil";
import { formatDate } from "./date";

type ContratSansId = Omit<Contrat, "id">;

// Anniversaire = aujourd'hui - 6 mois (même jour du mois)
function calculerAnniversaire(): Date {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
}

// Génère un contrat dont debut et fin sont dans le même mois (anniversaire + moisOffset)
function c(
  ann: Date,
  moisOffset: number,
  jourDebut: number,
  jourFin: number,
  employeur: string,
  heures: number,
  salaireBrut: number
): ContratSansId {
  const debut = new Date(ann.getFullYear(), ann.getMonth() + moisOffset, jourDebut);
  const fin = new Date(ann.getFullYear(), ann.getMonth() + moisOffset, jourFin);
  return { employeur, dateDebut: formatDate(debut), dateFin: formatDate(fin), heures, salaireBrut };
}

// M+6 = mois courant : génère 1 ou 2 contrats selon la position de aujourd'hui dans le mois
// - si today > 10 : 1 contrat passé (début du mois) + 1 contrat incluant aujourd'hui
// - sinon : 1 seul contrat incluant aujourd'hui depuis le 1er
function contratsCurrentMonth(ann: Date): { artiste: ContratSansId[]; technicien: ContratSansId[] } {
  const today = new Date();
  const todayDay = today.getDate();
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const hasPast = todayDay > 10;
  const pastFin = Math.min(todayDay - 5, 9);
  const enCoursDebut = hasPast ? Math.max(todayDay - 3, pastFin + 2) : 1;
  const enCoursFin = Math.min(lastDay, todayDay + 5);

  const artiste: ContratSansId[] = [
    ...(hasPast ? [c(ann, 6, 2, pastFin, "Théâtre du Nord", 64, 2240)] : []),
    c(ann, 6, enCoursDebut, enCoursFin, "Théâtre du Nord", 64, 2240),
  ];

  const technicien: ContratSansId[] = [
    ...(hasPast ? [c(ann, 6, 2, pastFin, "Rockfest", 80, 2800)] : []),
    c(ann, 6, enCoursDebut, enCoursFin, "Rockfest", 70, 2450),
  ];

  return { artiste, technicien };
}

export function creerProfilArtiste(): ProfilIntermittent {
  return {
    annexe: "10",
    dateAnniversaire: formatDate(calculerAnniversaire()),
    salaireReference: 16200,
    heuresTravaillees: 545,
    tauxCSG: "standard",
    alsaceMoselle: false,
  };
}

export function creerProfilTechnicien(): ProfilIntermittent {
  return {
    annexe: "8",
    dateAnniversaire: formatDate(calculerAnniversaire()),
    salaireReference: 19800,
    heuresTravaillees: 580,
    tauxCSG: "standard",
    alsaceMoselle: false,
  };
}

// Artiste (Annexe 10)
// M+0 : 2 contrats — M+1 : 1 — M+2 : aucun — M+3 : 2 — M+4 : aucun
// M+5 : 1 — M+6 : en cours (dynamique) — M+7 : futur — M+8 : aucun — M+9 : futur
export function creerContratsArtiste(): ContratSansId[] {
  const ann = calculerAnniversaire();
  return [
    c(ann, 0, 1, 8, "Festival d'automne", 64, 1920),
    c(ann, 0, 15, 22, "Cie Lumière", 64, 1920),
    c(ann, 1, 6, 14, "Tournée nationale", 72, 2160),
    c(ann, 3, 1, 9, "Opéra de Paris", 72, 2520),
    c(ann, 3, 15, 22, "Opéra de Paris", 64, 2240),
    c(ann, 5, 9, 15, "Centre chorégraphique", 56, 1960),
    ...contratsCurrentMonth(ann).artiste,
    c(ann, 7, 14, 20, "Festival de printemps", 56, 1960),
    c(ann, 9, 2, 8, "Tournée d'été", 56, 1960),
  ];
}

// Technicien (Annexe 8)
// M+0 : 1 contrat — M+1 : aucun — M+2 : 2 — M+3 : 1 — M+4 : 2 — M+5 : aucun
// M+6 : en cours (dynamique) — M+7 : futur — M+8 : aucun — M+9 : futur
export function creerContratsTechnicien(): ContratSansId[] {
  const ann = calculerAnniversaire();
  return [
    c(ann, 0, 18, 24, "Live Nation", 70, 2450),
    c(ann, 2, 3, 9, "France Télévisions", 70, 2450),
    c(ann, 2, 17, 23, "France Télévisions", 70, 2450),
    c(ann, 3, 8, 14, "Zénith de Paris", 70, 2450),
    c(ann, 4, 12, 18, "Tournée européenne", 70, 2450),
    c(ann, 4, 26, 28, "Tournée européenne", 60, 2100),
    ...contratsCurrentMonth(ann).technicien,
    c(ann, 7, 6, 12, "Festival des nuits", 70, 2450),
    c(ann, 9, 8, 14, "Festival d'été", 70, 2450),
  ];
}

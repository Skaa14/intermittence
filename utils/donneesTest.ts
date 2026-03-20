import * as Crypto from "expo-crypto";
import { Contrat, TypeHeures } from "../types/contrat";
import { Formation, OptionFormation } from "../types/formation";
import { Enseignement } from "../types/enseignement";
import { ProfilIntermittent } from "../types/profil";
import { formatDate } from "./date";
import { sauvegarderParCle, cleProfilData } from "./storage";

export type TypeDonneesTest = "artiste" | "technicien";

type ContratSansId = Omit<Contrat, "id">;
type FormationSansId = Omit<Formation, "id">;
type EnseignementSansId = Omit<Enseignement, "id">;

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
  salaireBrut: number,
  type?: TypeHeures
): ContratSansId {
  const debut = new Date(ann.getFullYear(), ann.getMonth() + moisOffset, jourDebut);
  const fin = new Date(ann.getFullYear(), ann.getMonth() + moisOffset, jourFin);
  return { employeur, dateDebut: formatDate(debut), dateFin: formatDate(fin), heures, salaireBrut, ...(type && { type }) };
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
    ...(hasPast ? [c(ann, 6, 2, pastFin, "Théâtre du Nord", 60, 2100, "cachets")] : []),
    c(ann, 6, enCoursDebut, enCoursFin, "Théâtre du Nord", 60, 2100, "cachets"),
  ];

  const technicien: ContratSansId[] = [
    ...(hasPast ? [c(ann, 6, 2, pastFin, "Rockfest", 80, 2800)] : []),
    c(ann, 6, enCoursDebut, enCoursFin, "Rockfest", 70, 2450),
  ];

  return { artiste, technicien };
}

export function creerProfilArtiste(): ProfilIntermittent {
  return {
    id: Crypto.randomUUID(),
    nom: "Artiste — Annexe 10",
    annexe: "10",
    aOuvertDroits: true,
    dateAnniversaire: formatDate(calculerAnniversaire()),
    salaireReference: 16200,
    heuresTravaillees: 545,
    tauxCSG: "standard",
    alsaceMoselle: false,
  };
}

export function creerProfilTechnicien(): ProfilIntermittent {
  return {
    id: Crypto.randomUUID(),
    nom: "Technicien — Annexe 8",
    annexe: "8",
    aOuvertDroits: true,
    dateAnniversaire: formatDate(calculerAnniversaire()),
    salaireReference: 19800,
    heuresTravaillees: 580,
    tauxCSG: "standard",
    alsaceMoselle: false,
  };
}

function f(
  ann: Date,
  moisOffset: number,
  jourDebut: number,
  jourFin: number,
  intitule: string,
  heures: number,
  option: OptionFormation
): FormationSansId {
  const debut = new Date(ann.getFullYear(), ann.getMonth() + moisOffset, jourDebut);
  const fin = new Date(ann.getFullYear(), ann.getMonth() + moisOffset, jourFin);
  return { intitule, dateDebut: formatDate(debut), dateFin: formatDate(fin), heures, option };
}

function ens(
  ann: Date,
  moisOffset: number,
  jourDebut: number,
  jourFin: number,
  etablissement: string,
  heures: number,
  salaireBrut: number
): EnseignementSansId {
  const debut = new Date(ann.getFullYear(), ann.getMonth() + moisOffset, jourDebut);
  const fin = new Date(ann.getFullYear(), ann.getMonth() + moisOffset, jourFin);
  return { etablissement, dateDebut: formatDate(debut), dateFin: formatDate(fin), heures, salaireBrut };
}

export function creerEnseignementsArtiste(): EnseignementSansId[] {
  const ann = calculerAnniversaire();
  return [
    ens(ann, 4, 5, 16, "Conservatoire de Lyon", 40, 1800),
  ];
}

export function creerEnseignementsTechnicien(): EnseignementSansId[] {
  const ann = calculerAnniversaire();
  return [
    ens(ann, 3, 2, 12, "ENSATT — Lyon", 50, 2200),
  ];
}

export function creerFormationsArtiste(): FormationSansId[] {
  const ann = calculerAnniversaire();
  return [
    f(ann, 2, 3, 20, "Technique vocale — AFDAS", 90, "compterHeures"),
  ];
}

export function creerFormationsTechnicien(): FormationSansId[] {
  const ann = calculerAnniversaire();
  return [
    f(ann, 1, 10, 24, "Habilitation électrique — AFDAS", 70, "garderARE"),
  ];
}

// Artiste (Annexe 10)
// M+0 : 2 contrats — M+1 : 1 — M+2 : aucun — M+3 : 2 — M+4 : aucun
// M+5 : 1 — M+6 : en cours (dynamique) — M+7 : futur — M+8 : aucun — M+9 : futur
export function creerContratsArtiste(): ContratSansId[] {
  const ann = calculerAnniversaire();
  return [
    c(ann, 0, 1, 8, "Festival d'automne", 60, 1920, "cachets"),
    c(ann, 0, 15, 22, "Cie Lumière", 64, 1920),
    c(ann, 1, 6, 14, "Tournée nationale", 72, 2160, "cachets"),
    c(ann, 3, 1, 9, "Opéra de Paris", 72, 2520),
    c(ann, 3, 15, 22, "Opéra de Paris", 60, 2240, "cachets"),
    c(ann, 5, 9, 15, "Centre chorégraphique", 48, 1960, "cachets"),
    ...contratsCurrentMonth(ann).artiste,
    c(ann, 7, 14, 20, "Festival de printemps", 56, 1960),
    c(ann, 9, 2, 8, "Tournée d'été", 60, 1960, "cachets"),
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

export async function sauvegarderDonneesTest(profilId: string, type: TypeDonneesTest): Promise<void> {
  const contrats = type === "artiste" ? creerContratsArtiste() : creerContratsTechnicien();
  const formations = type === "artiste" ? creerFormationsArtiste() : creerFormationsTechnicien();
  const enseignements = type === "artiste" ? creerEnseignementsArtiste() : creerEnseignementsTechnicien();
  await sauvegarderParCle(cleProfilData(profilId, "contrats"), contrats.map((c, i) => ({ ...c, id: String(i + 1) })));
  await sauvegarderParCle(cleProfilData(profilId, "formations"), formations.map((f, i) => ({ ...f, id: String(i + 1) })));
  await sauvegarderParCle(cleProfilData(profilId, "enseignements"), enseignements.map((e, i) => ({ ...e, id: String(i + 1) })));
}

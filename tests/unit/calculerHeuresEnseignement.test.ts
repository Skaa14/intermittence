import {
  calculerHeuresEnseignementPlafonnees,
  calculerJoursEnseignementDansMois,
} from "../../utils/calculerHeuresEnseignement";
import { PLAFOND_HEURES_ENSEIGNEMENT } from "../../utils/reglementation";
import { enseignement } from "../helpers/factories";

describe("calculerHeuresEnseignementPlafonnees", () => {
  it("retourne 0 pour une liste vide", () => {
    expect(calculerHeuresEnseignementPlafonnees([])).toBe(0);
  });

  it("somme les heures de plusieurs enseignements", () => {
    const e1 = enseignement({ heures: 30 });
    const e2 = enseignement({ id: "2", heures: 25 });
    expect(calculerHeuresEnseignementPlafonnees([e1, e2])).toBe(55);
  });

  it("plafonne à 70h", () => {
    const e1 = enseignement({ heures: 50 });
    const e2 = enseignement({ id: "2", heures: 40 });
    expect(calculerHeuresEnseignementPlafonnees([e1, e2])).toBe(PLAFOND_HEURES_ENSEIGNEMENT);
  });

  it("retourne le total exact quand il est égal au plafond", () => {
    const e1 = enseignement({ heures: 70 });
    expect(calculerHeuresEnseignementPlafonnees([e1])).toBe(70);
  });
});

describe("calculerJoursEnseignementDansMois", () => {
  it("retourne 0 pour une liste vide", () => {
    const debut = new Date(2026, 2, 1);
    const fin = new Date(2026, 2, 31);
    expect(calculerJoursEnseignementDansMois([], debut, fin)).toBe(0);
  });

  it("compte les jours d'un enseignement entièrement dans le mois", () => {
    const e = enseignement({ dateDebut: "05/03/2026", dateFin: "10/03/2026", heures: 30 });
    const debut = new Date(2026, 2, 1);
    const fin = new Date(2026, 2, 31);
    expect(calculerJoursEnseignementDansMois([e], debut, fin)).toBe(6);
  });

  it("tronque un enseignement qui déborde du mois", () => {
    const e = enseignement({ dateDebut: "25/01/2026", dateFin: "10/02/2026", heures: 40 });
    const debut = new Date(2026, 0, 1);
    const fin = new Date(2026, 0, 31);
    expect(calculerJoursEnseignementDansMois([e], debut, fin)).toBe(7);
  });

  it("retourne 0 si l'enseignement est hors du mois", () => {
    const e = enseignement({ dateDebut: "01/04/2026", dateFin: "15/04/2026", heures: 30 });
    const debut = new Date(2026, 2, 1);
    const fin = new Date(2026, 2, 31);
    expect(calculerJoursEnseignementDansMois([e], debut, fin)).toBe(0);
  });

  it("cumule les jours de plusieurs enseignements", () => {
    const e1 = enseignement({ dateDebut: "01/03/2026", dateFin: "05/03/2026", heures: 20 });
    const e2 = enseignement({ id: "2", dateDebut: "20/03/2026", dateFin: "25/03/2026", heures: 20 });
    const debut = new Date(2026, 2, 1);
    const fin = new Date(2026, 2, 31);
    expect(calculerJoursEnseignementDansMois([e1, e2], debut, fin)).toBe(11);
  });
});

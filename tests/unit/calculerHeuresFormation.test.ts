import {
  filtrerFormationsOptionA,
  calculerHeuresFormationPlafonnees,
  calculerJoursFormationDansMois,
} from "../../utils/calculerHeuresFormation";
import { PLAFOND_HEURES_FORMATION } from "../../utils/reglementation";
import { formation } from "../helpers/factories";

describe("filtrerFormationsOptionA", () => {
  it("garde les formations compterHeures", () => {
    const formations = [
      formation({ id: "1", option: "compterHeures" }),
      formation({ id: "2", option: "garderARE" }),
      formation({ id: "3", option: "compterHeures" }),
    ];
    const filtrees = filtrerFormationsOptionA(formations);
    expect(filtrees).toHaveLength(2);
    expect(filtrees.map((f) => f.id)).toEqual(["1", "3"]);
  });

  it("retourne vide si aucune compterHeures", () => {
    const formations = [formation({ option: "garderARE" })];
    expect(filtrerFormationsOptionA(formations)).toHaveLength(0);
  });

  it("retourne vide pour liste vide", () => {
    expect(filtrerFormationsOptionA([])).toHaveLength(0);
  });
});

describe("calculerHeuresFormationPlafonnees", () => {
  it("somme les heures des formations compterHeures", () => {
    const formations = [
      formation({ id: "1", heures: 100, option: "compterHeures" }),
      formation({ id: "2", heures: 50, option: "compterHeures" }),
      formation({ id: "3", heures: 200, option: "garderARE" }),
    ];
    expect(calculerHeuresFormationPlafonnees(formations)).toBe(150);
  });

  it("plafonne à PLAFOND_HEURES_FORMATION", () => {
    const formations = [
      formation({ id: "1", heures: 200, option: "compterHeures" }),
      formation({ id: "2", heures: 200, option: "compterHeures" }),
    ];
    expect(calculerHeuresFormationPlafonnees(formations)).toBe(PLAFOND_HEURES_FORMATION);
  });

  it("retourne 0 pour liste vide", () => {
    expect(calculerHeuresFormationPlafonnees([])).toBe(0);
  });

  it("ignore les formations garderARE", () => {
    const formations = [formation({ heures: 100, option: "garderARE" })];
    expect(calculerHeuresFormationPlafonnees(formations)).toBe(0);
  });
});

describe("calculerJoursFormationDansMois", () => {
  const debutMars = new Date(2026, 2, 1);
  const finMars = new Date(2026, 2, 31);

  it("formation entièrement dans le mois", () => {
    const formations = [formation({ dateDebut: "05/03/2026", dateFin: "10/03/2026" })];
    expect(calculerJoursFormationDansMois(formations, debutMars, finMars)).toBe(6);
  });

  it("formation débordant avant le mois", () => {
    const formations = [formation({ dateDebut: "20/02/2026", dateFin: "05/03/2026" })];
    expect(calculerJoursFormationDansMois(formations, debutMars, finMars)).toBe(5);
  });

  it("formation débordant après le mois", () => {
    const debutJanv = new Date(2026, 0, 1);
    const finJanv = new Date(2026, 0, 31);
    const formations = [formation({ dateDebut: "25/01/2026", dateFin: "10/02/2026" })];
    expect(calculerJoursFormationDansMois(formations, debutJanv, finJanv)).toBe(7);
  });

  it("formation couvrant tout le mois", () => {
    const debutJanv = new Date(2026, 0, 1);
    const finJanv = new Date(2026, 0, 31);
    const formations = [formation({ dateDebut: "01/12/2025", dateFin: "28/02/2026" })];
    expect(calculerJoursFormationDansMois(formations, debutJanv, finJanv)).toBe(31);
  });

  it("formation hors du mois (avant)", () => {
    const formations = [formation({ dateDebut: "01/01/2026", dateFin: "28/02/2026" })];
    expect(calculerJoursFormationDansMois(formations, debutMars, finMars)).toBe(0);
  });

  it("formation hors du mois (après)", () => {
    const formations = [formation({ dateDebut: "01/04/2026", dateFin: "30/04/2026" })];
    expect(calculerJoursFormationDansMois(formations, debutMars, finMars)).toBe(0);
  });

  it("ignore les formations garderARE", () => {
    const formations = [
      formation({ dateDebut: "05/03/2026", dateFin: "10/03/2026", option: "garderARE" }),
    ];
    expect(calculerJoursFormationDansMois(formations, debutMars, finMars)).toBe(0);
  });

  it("cumule plusieurs formations", () => {
    const formations = [
      formation({ id: "1", dateDebut: "01/03/2026", dateFin: "05/03/2026" }),
      formation({ id: "2", dateDebut: "20/03/2026", dateFin: "25/03/2026" }),
    ];
    expect(calculerJoursFormationDansMois(formations, debutMars, finMars)).toBe(5 + 6);
  });

  it("retourne 0 pour liste vide", () => {
    expect(calculerJoursFormationDansMois([], debutMars, finMars)).toBe(0);
  });

  it("formation d'un seul jour dans le mois", () => {
    const formations = [formation({ dateDebut: "15/03/2026", dateFin: "15/03/2026" })];
    expect(calculerJoursFormationDansMois(formations, debutMars, finMars)).toBe(1);
  });
});

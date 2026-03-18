import {
  trouverFCT,
  calculerDebutPeriodeReference,
  filtrerContratsPeriodeReference,
} from "../../utils/filtrerContratsPeriodeReference";
import { contrat } from "../helpers/factories";

describe("trouverFCT", () => {
  it("retourne undefined pour une liste vide", () => {
    expect(trouverFCT([])).toBeUndefined();
  });

  it("retourne la date de fin la plus récente", () => {
    const contrats = [
      contrat({ id: "1", dateDebut: "01/01/2026", dateFin: "31/01/2026" }),
      contrat({ id: "2", dateDebut: "01/06/2026", dateFin: "30/06/2026" }),
      contrat({ id: "3", dateDebut: "01/03/2026", dateFin: "31/03/2026" }),
    ];
    const fct = trouverFCT(contrats);
    expect(fct).toEqual(new Date(2026, 5, 30));
  });

  it("gère un seul contrat", () => {
    const contrats = [contrat({ dateDebut: "01/01/2026", dateFin: "15/01/2026" })];
    expect(trouverFCT(contrats)).toEqual(new Date(2026, 0, 15));
  });
});

describe("calculerDebutPeriodeReference", () => {
  it("retourne J+1 un an avant la FCT", () => {
    const fct = new Date(2026, 5, 30);
    const debut = calculerDebutPeriodeReference(fct);
    expect(debut).toEqual(new Date(2025, 6, 1));
  });

  it("gère le passage d'année", () => {
    const fct = new Date(2026, 0, 15);
    const debut = calculerDebutPeriodeReference(fct);
    expect(debut).toEqual(new Date(2025, 0, 16));
  });
});

describe("filtrerContratsPeriodeReference", () => {
  it("retourne une liste vide sans contrats", () => {
    expect(filtrerContratsPeriodeReference([])).toEqual([]);
  });

  it("garde les contrats dont la date de fin est dans la fenêtre", () => {
    const contrats = [
      contrat({ id: "1", dateDebut: "01/03/2026", dateFin: "31/03/2026" }),
      contrat({ id: "2", dateDebut: "01/06/2026", dateFin: "30/06/2026" }),
    ];
    const filtres = filtrerContratsPeriodeReference(contrats);
    expect(filtres).toHaveLength(2);
  });

  it("exclut les contrats trop anciens (fin avant le début de la fenêtre)", () => {
    const contrats = [
      contrat({ id: "ancien", dateDebut: "01/01/2024", dateFin: "31/01/2024" }),
      contrat({ id: "recent", dateDebut: "01/06/2026", dateFin: "30/06/2026" }),
    ];
    const filtres = filtrerContratsPeriodeReference(contrats);
    expect(filtres).toHaveLength(1);
    expect(filtres[0].id).toBe("recent");
  });

  it("inclut un contrat dont la fin est exactement le début de la fenêtre", () => {
    const contrats = [
      contrat({ id: "recent", dateDebut: "01/06/2026", dateFin: "30/06/2026" }),
      contrat({ id: "limite", dateDebut: "01/06/2025", dateFin: "01/07/2025" }),
    ];
    const filtres = filtrerContratsPeriodeReference(contrats);
    expect(filtres).toHaveLength(2);
  });

  it("inclut un contrat dont la fin est exactement la FCT", () => {
    const contrats = [
      contrat({ id: "fct", dateDebut: "01/06/2026", dateFin: "30/06/2026" }),
    ];
    const filtres = filtrerContratsPeriodeReference(contrats);
    expect(filtres).toHaveLength(1);
  });

  it("gère beaucoup de contrats répartis sur plusieurs années", () => {
    const contrats = [
      contrat({ id: "1", dateDebut: "01/01/2024", dateFin: "31/01/2024" }),
      contrat({ id: "2", dateDebut: "01/06/2025", dateFin: "30/06/2025" }),
      contrat({ id: "3", dateDebut: "01/09/2025", dateFin: "30/09/2025" }),
      contrat({ id: "4", dateDebut: "01/01/2026", dateFin: "31/01/2026" }),
      contrat({ id: "5", dateDebut: "01/06/2026", dateFin: "30/06/2026" }),
    ];
    const filtres = filtrerContratsPeriodeReference(contrats);
    const ids = filtres.map((c) => c.id);
    expect(ids).not.toContain("1");
    expect(ids).toContain("3");
    expect(ids).toContain("4");
    expect(ids).toContain("5");
  });
});

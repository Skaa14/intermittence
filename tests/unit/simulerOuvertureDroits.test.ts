import { contrat, formation, profil } from "../helpers/factories";
import { calculerAJ, calculerSJM, calculerAJNette } from "../../utils/calculerAJ";
import {
  trouverDatesOuvertureEligibles,
  simulerOuverture,
} from "../../utils/simulerOuvertureDroits";

describe("trouverDatesOuvertureEligibles", () => {
  it("retourne les contrats dont la dateFin donne >= 507h cumulées", () => {
    const contrats = [
      contrat({ id: "1", employeur: "Prod A", dateDebut: "01/02/2026", dateFin: "28/02/2026", heures: 300, salaireBrut: 9000 }),
      contrat({ id: "2", employeur: "Prod B", dateDebut: "01/06/2026", dateFin: "30/06/2026", heures: 250, salaireBrut: 7500 }),
    ];

    const eligibles = trouverDatesOuvertureEligibles(contrats, []);

    expect(eligibles).toHaveLength(1);
    expect(eligibles[0].contrat.employeur).toBe("Prod B");
    expect(eligibles[0].heuresCumulees).toBe(550);
  });

  it("retourne un tableau vide si aucun contrat n'atteint 507h", () => {
    const contrats = [
      contrat({ id: "1", heures: 200, dateDebut: "01/03/2026", dateFin: "31/03/2026" }),
      contrat({ id: "2", heures: 100, dateDebut: "01/04/2026", dateFin: "30/04/2026" }),
    ];

    expect(trouverDatesOuvertureEligibles(contrats, [])).toHaveLength(0);
  });

  it("inclut les heures de formation plafonnées dans le cumul", () => {
    const contrats = [
      contrat({ id: "1", heures: 400, dateDebut: "01/03/2026", dateFin: "31/03/2026", salaireBrut: 12000 }),
    ];
    const formations = [
      formation({ heures: 150 }),
    ];

    const eligibles = trouverDatesOuvertureEligibles(contrats, formations);

    expect(eligibles).toHaveLength(1);
    expect(eligibles[0].heuresCumulees).toBe(550);
  });

  it("retourne exactement 507h comme éligible", () => {
    const contrats = [
      contrat({ id: "1", heures: 507, dateDebut: "01/03/2026", dateFin: "31/03/2026", salaireBrut: 15000 }),
    ];

    const eligibles = trouverDatesOuvertureEligibles(contrats, []);

    expect(eligibles).toHaveLength(1);
    expect(eligibles[0].heuresCumulees).toBe(507);
  });

  it("exclut les contrats hors période de référence", () => {
    const contrats = [
      contrat({ id: "1", heures: 300, dateDebut: "01/01/2025", dateFin: "31/01/2025", salaireBrut: 9000 }),
      contrat({ id: "2", heures: 250, dateDebut: "01/06/2026", dateFin: "30/06/2026", salaireBrut: 7500 }),
    ];

    const eligibles = trouverDatesOuvertureEligibles(contrats, []);

    expect(eligibles).toHaveLength(0);
  });

  it("trie les dates éligibles de la plus récente à la plus ancienne", () => {
    const contrats = [
      contrat({ id: "1", employeur: "Prod A", dateDebut: "01/01/2026", dateFin: "31/01/2026", heures: 300, salaireBrut: 9000 }),
      contrat({ id: "2", employeur: "Prod B", dateDebut: "01/03/2026", dateFin: "31/03/2026", heures: 250, salaireBrut: 7500 }),
      contrat({ id: "3", employeur: "Prod C", dateDebut: "01/06/2026", dateFin: "30/06/2026", heures: 200, salaireBrut: 6000 }),
    ];

    const eligibles = trouverDatesOuvertureEligibles(contrats, []);

    expect(eligibles.length).toBeGreaterThanOrEqual(2);
    expect(eligibles[0].contrat.employeur).toBe("Prod C");
    expect(eligibles[1].contrat.employeur).toBe("Prod B");
  });
});

describe("simulerOuverture", () => {
  it("calcule l'AJ brute et nette à partir des contrats de la période de référence", () => {
    const contrats = [
      contrat({ id: "1", heures: 300, salaireBrut: 9000, dateDebut: "01/02/2026", dateFin: "28/02/2026" }),
      contrat({ id: "2", heures: 300, salaireBrut: 9000, dateDebut: "01/06/2026", dateFin: "30/06/2026" }),
    ];
    const p = profil({ annexe: "8" });
    const fct = new Date(2026, 5, 30);

    const result = simulerOuverture(contrats, [], fct, p);

    expect(result.salaireReference).toBe(18000);
    expect(result.heuresTravaillees).toBe(600);

    const ajBruteAttendue = calculerAJ("8", 18000, 600);
    const sjm = calculerSJM("8", 18000, 600);
    const ajNetteAttendue = calculerAJNette(ajBruteAttendue, sjm, "standard", false);
    expect(result.ajBrute).toBe(ajBruteAttendue);
    expect(result.ajNette).toBe(ajNetteAttendue);
  });

  it("calcule la période d'indemnisation de 12 mois à partir du lendemain de la FCT", () => {
    const contrats = [
      contrat({ id: "1", heures: 600, salaireBrut: 18000, dateDebut: "01/02/2026", dateFin: "30/06/2026" }),
    ];
    const p = profil({ annexe: "8" });
    const fct = new Date(2026, 5, 30);

    const result = simulerOuverture(contrats, [], fct, p);

    expect(result.dateAnniversaire).toEqual(new Date(2026, 6, 1));
    expect(result.dateFinIndemnisation).toEqual(new Date(2027, 5, 30));
  });

  it("inclut les heures de formation dans les heures travaillées", () => {
    const contrats = [
      contrat({ id: "1", heures: 400, salaireBrut: 12000, dateDebut: "01/03/2026", dateFin: "31/03/2026" }),
    ];
    const formations = [
      formation({ heures: 150 }),
    ];
    const p = profil({ annexe: "10" });
    const fct = new Date(2026, 2, 31);

    const result = simulerOuverture(contrats, formations, fct, p);

    expect(result.heuresTravaillees).toBe(550);
    expect(result.salaireReference).toBe(12000);

    const ajBruteAttendue = calculerAJ("10", 12000, 550);
    expect(result.ajBrute).toBe(ajBruteAttendue);
  });

  it("utilise les paramètres du profil pour le calcul net (CSG réduit, Alsace-Moselle)", () => {
    const contrats = [
      contrat({ id: "1", heures: 600, salaireBrut: 18000, dateDebut: "01/02/2026", dateFin: "30/06/2026" }),
    ];
    const p = profil({ annexe: "8", tauxCSG: "reduit", alsaceMoselle: true });
    const fct = new Date(2026, 5, 30);

    const result = simulerOuverture(contrats, [], fct, p);

    const ajBrute = calculerAJ("8", 18000, 600);
    const sjm = calculerSJM("8", 18000, 600);
    const ajNetteAttendue = calculerAJNette(ajBrute, sjm, "reduit", true);
    expect(result.ajNette).toBe(ajNetteAttendue);
  });
});

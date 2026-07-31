import { calculerRecapAnnuel } from "../../utils/calculerRecapAnnuel";
import { contrat, profil } from "../helpers/factories";

describe("calculerRecapAnnuel", () => {
  it("retourne un tableau vide si le profil n'a pas ouvert ses droits", () => {
    const p = profil({ aOuvertDroits: false });
    expect(calculerRecapAnnuel(p, [])).toEqual([]);
  });

  it("ne garde que les mois passés et le mois en cours de l'année d'intermittence", () => {
    const p = profil({ dateAnniversaire: "01/04/2026", heuresTravaillees: 507, salaireReference: 13800 });
    jest.useFakeTimers().setSystemTime(new Date(2026, 5, 15));

    const recap = calculerRecapAnnuel(p, []);

    expect(recap).toHaveLength(3);
    expect(recap.map((r) => r.index)).toEqual([2, 1, 0]);

    jest.useRealTimers();
  });

  it("marque le mois en cours et regroupe heures/salaire/contrats du mois", () => {
    const p = profil({ dateAnniversaire: "01/04/2026", heuresTravaillees: 507, salaireReference: 13800 });
    jest.useFakeTimers().setSystemTime(new Date(2026, 5, 15));

    const contrats = [
      contrat({ dateDebut: "10/04/2026", dateFin: "20/04/2026", heures: 40, salaireBrut: 1500 }),
      contrat({ dateDebut: "05/05/2026", dateFin: "12/05/2026", heures: 20, salaireBrut: 800 }),
    ];

    const recap = calculerRecapAnnuel(p, contrats);
    const premierMois = recap.find((r) => r.index === 0)!;
    const moisEnCours = recap.find((r) => r.enCours)!;

    expect(premierMois.heures).toBe(40);
    expect(premierMois.salaire).toBe(1500);
    expect(premierMois.nombreContrats).toBe(1);
    expect(moisEnCours.index).toBe(2);

    jest.useRealTimers();
  });
});

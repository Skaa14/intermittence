import {
  calculerIndemnisationMensuelle,
} from "../../utils/calculerIndemnisationMensuelle";
import { calculerAJ, calculerAJNette, calculerSJM } from "../../utils/calculerAJ";
import {
  DELAI_ATTENTE_JOURS,
  PMSS_MENSUEL,
  COEF_PLAFOND_PMSS,
  SEUIL_NON_INDEMNISATION_A8,
} from "../../utils/reglementation";
import { contrat, formation, profil } from "../helpers/factories";

describe("calculerIndemnisationMensuelle", () => {
  describe("structure de base", () => {
    it("retourne 12 mois", () => {
      const mois = calculerIndemnisationMensuelle(profil(), []);
      expect(mois).toHaveLength(12);
    });

    it("retourne une liste vide si dateAnniversaire invalide", () => {
      const mois = calculerIndemnisationMensuelle(profil({ dateAnniversaire: "invalide" }), []);
      expect(mois).toHaveLength(0);
    });

    it("chaque mois a un index croissant de 0 à 11", () => {
      const mois = calculerIndemnisationMensuelle(profil(), []);
      mois.forEach((m, i) => expect(m.index).toBe(i));
    });

    it("les mois commencent à la date d'anniversaire", () => {
      const p = profil({ dateAnniversaire: "15/09/2026" });
      const mois = calculerIndemnisationMensuelle(p, []);
      expect(mois[0].mois.getFullYear()).toBe(2026);
      expect(mois[0].mois.getMonth()).toBe(8);
    });

    it("les 12 mois couvrent des mois calendaires consécutifs", () => {
      const mois = calculerIndemnisationMensuelle(profil(), []);
      for (let i = 1; i < 12; i++) {
        const diff =
          (mois[i].mois.getFullYear() - mois[i - 1].mois.getFullYear()) * 12 +
          (mois[i].mois.getMonth() - mois[i - 1].mois.getMonth());
        expect(diff).toBe(1);
      }
    });
  });

  describe("AJ brute et nette", () => {
    it("AJ brute correspond à calculerAJ", () => {
      const p = profil();
      const mois = calculerIndemnisationMensuelle(p, []);
      const ajAttendue = calculerAJ(p.annexe, p.salaireReference, p.heuresTravaillees);
      mois.forEach((m) => expect(m.aj).toBe(ajAttendue));
    });

    it("AJ nette correspond à calculerAJNette", () => {
      const p = profil();
      const mois = calculerIndemnisationMensuelle(p, []);
      const aj = calculerAJ(p.annexe, p.salaireReference, p.heuresTravaillees);
      const sjm = calculerSJM(p.annexe, p.salaireReference, p.heuresTravaillees);
      const ajNetteAttendue = calculerAJNette(aj, sjm, p.tauxCSG, p.alsaceMoselle);
      mois.forEach((m) => expect(m.ajNette).toBe(ajNetteAttendue));
    });

    it("AJ constante sur les 12 mois", () => {
      const mois = calculerIndemnisationMensuelle(profil(), []);
      const aj = mois[0].aj;
      mois.forEach((m) => expect(m.aj).toBe(aj));
    });
  });

  describe("délai d'attente", () => {
    it("7 jours de délai d'attente sur le premier mois uniquement", () => {
      const mois = calculerIndemnisationMensuelle(profil(), []);
      expect(mois[0].delaiAttente).toBe(DELAI_ATTENTE_JOURS);
      for (let i = 1; i < 12; i++) {
        expect(mois[i].delaiAttente).toBe(0);
      }
    });
  });

  describe("jours calendaires", () => {
    it("premier mois partiel (à partir de la date d'anniversaire)", () => {
      const p = profil({ dateAnniversaire: "15/09/2026" });
      const mois = calculerIndemnisationMensuelle(p, []);
      expect(mois[0].joursCalendaires).toBe(30 - 15 + 1);
    });

    it("mois complets à partir du 2e mois", () => {
      const p = profil({ dateAnniversaire: "15/09/2026" });
      const mois = calculerIndemnisationMensuelle(p, []);
      expect(mois[1].joursCalendaires).toBe(31);
      expect(mois[3].joursCalendaires).toBe(31);
    });

    it("date anniversaire le 1er = mois complet dès le début", () => {
      const p = profil({ dateAnniversaire: "01/09/2026" });
      const mois = calculerIndemnisationMensuelle(p, []);
      expect(mois[0].joursCalendaires).toBe(30);
    });
  });

  describe("contrats du mois", () => {
    it("associe les contrats au bon mois par date de début", () => {
      const contrats = [
        contrat({ id: "1", dateDebut: "01/09/2026", dateFin: "15/09/2026", heures: 40, salaireBrut: 1500 }),
        contrat({ id: "2", dateDebut: "05/10/2026", dateFin: "20/10/2026", heures: 30, salaireBrut: 1000 }),
      ];
      const mois = calculerIndemnisationMensuelle(profil(), contrats);
      expect(mois[0].contratsDuMois).toHaveLength(1);
      expect(mois[0].contratsDuMois[0].id).toBe("1");
      expect(mois[1].contratsDuMois).toHaveLength(1);
      expect(mois[1].contratsDuMois[0].id).toBe("2");
    });

    it("salaireDuMois et heuresDuMois sommés correctement", () => {
      const contrats = [
        contrat({ id: "1", dateDebut: "01/09/2026", dateFin: "10/09/2026", heures: 40, salaireBrut: 1500 }),
        contrat({ id: "2", dateDebut: "15/09/2026", dateFin: "25/09/2026", heures: 30, salaireBrut: 1000 }),
      ];
      const mois = calculerIndemnisationMensuelle(profil(), contrats);
      expect(mois[0].salaireDuMois).toBe(2500);
      expect(mois[0].heuresDuMois).toBe(70);
    });

    it("mois sans contrat = salaire 0 et heures 0", () => {
      const mois = calculerIndemnisationMensuelle(profil(), []);
      expect(mois[0].salaireDuMois).toBe(0);
      expect(mois[0].heuresDuMois).toBe(0);
    });
  });

  describe("jours travaillés et seuil de non-indemnisation", () => {
    it("joursTravailles = heures/8 * 1.4 pour annexe 8 (arrondi plancher)", () => {
      const contrats = [
        contrat({ dateDebut: "01/10/2026", dateFin: "20/10/2026", heures: 80, salaireBrut: 3000 }),
      ];
      const mois = calculerIndemnisationMensuelle(profil(), contrats);
      expect(mois[1].joursTravailles).toBe(Math.floor((80 / 8) * 1.4));
    });

    it("joursTravailles = heures/10 * 1.3 pour annexe 10 (arrondi plancher)", () => {
      const contrats = [
        contrat({ dateDebut: "01/10/2026", dateFin: "20/10/2026", heures: 100, salaireBrut: 3000 }),
      ];
      const mois = calculerIndemnisationMensuelle(profil({ annexe: "10" }), contrats);
      expect(mois[1].joursTravailles).toBe(Math.floor((100 / 10) * 1.3));
    });

    it("seuil de non-indemnisation atteint quand trop d'heures (annexe 8)", () => {
      const heuresSeuil = SEUIL_NON_INDEMNISATION_A8 * 8;
      const contrats = [
        contrat({ dateDebut: "01/10/2026", dateFin: "31/10/2026", heures: heuresSeuil, salaireBrut: 10000 }),
      ];
      const mois = calculerIndemnisationMensuelle(profil(), contrats);
      expect(mois[1].seuilNonIndemnisationAtteint).toBe(true);
      expect(mois[1].joursIndemnises).toBe(0);
    });

    it("seuil de non-indemnisation non atteint en dessous", () => {
      const contrats = [
        contrat({ dateDebut: "01/10/2026", dateFin: "15/10/2026", heures: 40, salaireBrut: 1500 }),
      ];
      const mois = calculerIndemnisationMensuelle(profil(), contrats);
      expect(mois[1].seuilNonIndemnisationAtteint).toBe(false);
    });
  });

  describe("joursIndemnises", () => {
    it("joursIndemnises >= 0 (jamais négatif)", () => {
      const mois = calculerIndemnisationMensuelle(profil(), []);
      mois.forEach((m) => expect(m.joursIndemnises).toBeGreaterThanOrEqual(0));
    });

    it("joursIndemnises = calendaires - travaillés - formation - délai - franchises", () => {
      const p = profil({ dateAnniversaire: "01/09/2026" });
      const mois = calculerIndemnisationMensuelle(p, []);
      const m1 = mois[1];
      const attendu = Math.max(
        0,
        m1.joursCalendaires - m1.joursTravailles - m1.joursFormation - m1.delaiAttente - m1.franchiseCP - m1.franchiseSalaire
      );
      expect(m1.joursIndemnises).toBe(attendu);
    });
  });

  describe("ARE et plafond PMSS", () => {
    it("areVerseeAvantPlafond = AJ brute * joursIndemnises (arrondi)", () => {
      const mois = calculerIndemnisationMensuelle(profil(), []);
      mois.forEach((m) => {
        expect(m.areVerseeAvantPlafond).toBe(Math.round(m.aj * m.joursIndemnises));
      });
    });

    it("areNetteEstimee = AJ nette * joursIndemnises (arrondi)", () => {
      const mois = calculerIndemnisationMensuelle(profil(), []);
      mois.forEach((m) => {
        expect(m.areNetteEstimee).toBe(Math.round(m.ajNette * m.joursIndemnises));
      });
    });

    it("plafond PMSS appliqué quand salaire + ARE > plafond", () => {
      const plafond = PMSS_MENSUEL * COEF_PLAFOND_PMSS;
      const salaire = plafond - 100;
      const contrats = [
        contrat({ dateDebut: "01/10/2026", dateFin: "15/10/2026", heures: 40, salaireBrut: salaire }),
      ];
      const mois = calculerIndemnisationMensuelle(profil(), contrats);
      const m = mois[1];
      expect(m.areVerseeAvantPlafond).toBeGreaterThan(100);
      expect(m.plafondAtteint).toBe(true);
      expect(m.areVersee).toBe(Math.round(plafond - salaire));
    });

    it("areVersee = 0 quand salaire >= plafond PMSS", () => {
      const plafond = PMSS_MENSUEL * COEF_PLAFOND_PMSS;
      const contrats = [
        contrat({ dateDebut: "01/10/2026", dateFin: "31/10/2026", heures: 40, salaireBrut: plafond + 1000 }),
      ];
      const mois = calculerIndemnisationMensuelle(profil(), contrats);
      expect(mois[1].areVersee).toBe(0);
      expect(mois[1].plafondAtteint).toBe(true);
    });

    it("totalRecu = salaireDuMois + areVersee", () => {
      const contrats = [
        contrat({ dateDebut: "01/10/2026", dateFin: "15/10/2026", heures: 40, salaireBrut: 1500 }),
      ];
      const mois = calculerIndemnisationMensuelle(profil(), contrats);
      mois.forEach((m) => {
        expect(m.totalRecu).toBe(m.salaireDuMois + m.areVersee);
      });
    });
  });

  describe("franchises", () => {
    it("franchise CP répartie sur les premiers mois", () => {
      const mois = calculerIndemnisationMensuelle(profil(), []);
      const totalFranchiseCP = mois.reduce((s, m) => s + m.franchiseCP, 0);
      expect(totalFranchiseCP).toBeGreaterThan(0);
    });

    it("franchise salaire répartie sur les 8 premiers mois max", () => {
      const mois = calculerIndemnisationMensuelle(profil(), []);
      for (let i = 8; i < 12; i++) {
        expect(mois[i].franchiseSalaire).toBe(0);
      }
    });

    it("pas de franchises quand heuresTravaillees = 0", () => {
      const p = profil({ heuresTravaillees: 0, salaireReference: 0 });
      const mois = calculerIndemnisationMensuelle(p, []);
      mois.forEach((m) => {
        expect(m.franchiseCP).toBe(0);
        expect(m.franchiseSalaire).toBe(0);
      });
    });
  });

  describe("formations", () => {
    it("les formations sont associées au bon mois", () => {
      const formations = [
        formation({ dateDebut: "01/10/2026", dateFin: "15/10/2026" }),
      ];
      const mois = calculerIndemnisationMensuelle(profil(), [], formations);
      expect(mois[1].formationsDuMois).toHaveLength(1);
      expect(mois[0].formationsDuMois).toHaveLength(0);
    });

    it("les jours de formation réduisent les jours indemnisés", () => {
      const p = profil({ dateAnniversaire: "01/09/2026" });
      const sansFormation = calculerIndemnisationMensuelle(p, []);
      const avecFormation = calculerIndemnisationMensuelle(p, [], [
        formation({ dateDebut: "01/10/2026", dateFin: "10/10/2026" }),
      ]);
      expect(avecFormation[1].joursIndemnises).toBeLessThan(sansFormation[1].joursIndemnises);
    });
  });

  describe("annexe 10 vs annexe 8", () => {
    it("les coefficients de jours non-indemnisables diffèrent", () => {
      const contrats = [
        contrat({ dateDebut: "01/10/2026", dateFin: "15/10/2026", heures: 80, salaireBrut: 3000 }),
      ];
      const mois8 = calculerIndemnisationMensuelle(profil({ annexe: "8" }), contrats);
      const mois10 = calculerIndemnisationMensuelle(profil({ annexe: "10" }), contrats);
      expect(mois8[1].joursTravailles).not.toBe(mois10[1].joursTravailles);
    });
  });
});

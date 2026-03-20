import { calculerAJDetaille, DetailCalculAJ, formuleToString } from "../../utils/calculerAJDetaille";
import { calculerAJ, calculerAJNette, calculerSJM } from "../../utils/calculerAJ";
import { tronquerCentime } from "../../utils/calculAJ.common";
import {
  TAUX_RETRAITE_COMPLEMENTAIRE,
  TAUX_CSG_STANDARD,
  TAUX_CSG_REDUIT,
  TAUX_CRDS,
  TAUX_ALSACE_MOSELLE,
} from "../../utils/reglementation";

function verifierConcordanceNumerique(detail: DetailCalculAJ, annexe: "8" | "10", sr: number, nht: number, tauxCSG: "standard" | "reduit", alsaceMoselle: boolean) {
  const ajBruteAttendue = calculerAJ(annexe, sr, nht);
  const sjmAttendu = calculerSJM(annexe, sr, nht);
  const ajNetteAttendue = calculerAJNette(ajBruteAttendue, sjmAttendu, tauxCSG, alsaceMoselle);

  expect(detail.brute.ajBrute).toBe(ajBruteAttendue);
  expect(detail.nette.sjm.valeur).toBe(sjmAttendu);
  expect(detail.nette.ajNette).toBe(ajNetteAttendue);
}

describe("calculerAJDetaille", () => {
  describe("concordance avec calculerAJ/calculerAJNette", () => {
    it("annexe 8, cas nominal", () => {
      const detail = calculerAJDetaille("8", 18000, 600, "standard", false);
      verifierConcordanceNumerique(detail, "8", 18000, 600, "standard", false);
    });

    it("annexe 10, cas nominal", () => {
      const detail = calculerAJDetaille("10", 18000, 600, "standard", false);
      verifierConcordanceNumerique(detail, "10", 18000, 600, "standard", false);
    });

    it("annexe 8, CSG réduit", () => {
      const detail = calculerAJDetaille("8", 18000, 600, "reduit", false);
      verifierConcordanceNumerique(detail, "8", 18000, 600, "reduit", false);
    });

    it("annexe 8, Alsace-Moselle", () => {
      const detail = calculerAJDetaille("8", 18000, 600, "standard", true);
      verifierConcordanceNumerique(detail, "8", 18000, 600, "standard", true);
    });

    it("salaire très bas (plancher)", () => {
      const detail = calculerAJDetaille("10", 5000, 507, "standard", false);
      verifierConcordanceNumerique(detail, "10", 5000, 507, "standard", false);
    });

    it("salaire très haut (plafond)", () => {
      const detail = calculerAJDetaille("8", 500000, 507, "standard", false);
      verifierConcordanceNumerique(detail, "8", 500000, 507, "standard", false);
    });
  });

  describe("structure de la partie brute", () => {
    it("contient les 3 composantes et la somme", () => {
      const detail = calculerAJDetaille("8", 18000, 600, "standard", false);
      const { brute } = detail;

      expect(brute.composanteA.label).toBe("Composante A (salaire)");
      expect(brute.composanteB.label).toBe("Composante B (heures)");
      expect(brute.composanteC.label).toBe("Composante C (fixe)");
      expect(brute.brutAvantPlafonnement.label).toBe("A + B + C");
    });

    it("A + B + C = brutAvantPlafonnement", () => {
      const detail = calculerAJDetaille("8", 18000, 600, "standard", false);
      const { brute } = detail;
      const somme = brute.composanteA.valeur + brute.composanteB.valeur + brute.composanteC.valeur;
      expect(brute.brutAvantPlafonnement.valeur).toBeCloseTo(somme, 10);
    });

    it("pas de plafonnement dans le cas nominal", () => {
      const detail = calculerAJDetaille("8", 18000, 600, "standard", false);
      expect(detail.brute.plafonnement).toBeNull();
    });

    it("plancher appliqué quand AJ trop basse", () => {
      const detail = calculerAJDetaille("10", 5000, 507, "standard", false);
      expect(detail.brute.plafonnement).not.toBeNull();
      expect(detail.brute.plafonnement!.label).toBe("Plancher appliqué");
    });

    it("plafond appliqué quand AJ trop haute", () => {
      const detail = calculerAJDetaille("8", 500000, 507, "standard", false);
      expect(detail.brute.plafonnement).not.toBeNull();
      expect(detail.brute.plafonnement!.label).toBe("Plafond appliqué");
    });
  });

  describe("formules au-dessus des seuils (tranches 2)", () => {
    it("composante A utilise la formule 2 tranches quand SR > seuil", () => {
      const detail = calculerAJDetaille("8", 20000, 600, "standard", false);
      expect(formuleToString(detail.brute.composanteA.formule)).toContain("14400");
      expect(detail.brute.composanteA.parametres!.length).toBeGreaterThan(4);
    });

    it("composante B utilise la formule 2 tranches quand NHT > seuil", () => {
      const detail = calculerAJDetaille("8", 18000, 800, "standard", false);
      expect(formuleToString(detail.brute.composanteB.formule)).toContain("720");
      expect(detail.brute.composanteB.parametres!.length).toBeGreaterThan(4);
    });
  });

  describe("parametres non-undefined", () => {
    it("tous les parametres des composantes brutes sont définis", () => {
      const detail = calculerAJDetaille("8", 18000, 600, "standard", false);
      const { brute } = detail;

      for (const etape of [brute.composanteA, brute.composanteB, brute.composanteC]) {
        expect(etape.parametres).toBeDefined();
        for (const p of etape.parametres!) {
          expect(p).toBeDefined();
          expect(p.nom).toBeDefined();
          expect(p.description).toBeDefined();
        }
      }
    });

    it("tous les parametres des cotisations sont définis", () => {
      const detail = calculerAJDetaille("8", 18000, 600, "standard", true);

      for (const cot of detail.nette.cotisations) {
        expect(cot.parametres).toBeDefined();
        for (const p of cot.parametres!) {
          expect(p).toBeDefined();
          expect(p.nom).toBeDefined();
          expect(p.description).toBeDefined();
        }
      }
    });

    it("parametres du SJM sont définis", () => {
      const detail = calculerAJDetaille("8", 18000, 600, "standard", false);
      expect(detail.nette.sjm.parametres).toBeDefined();
      for (const p of detail.nette.sjm.parametres!) {
        expect(p).toBeDefined();
        expect(p.nom).toBeDefined();
        expect(p.description).toBeDefined();
      }
    });
  });

  describe("cotisations", () => {
    it("le plancher est supérieur au seuil de cotisation nulle (pas d'exonération totale possible)", () => {
      const detail8 = calculerAJDetaille("8", 1, 507, "standard", false);
      const detail10 = calculerAJDetaille("10", 1, 507, "standard", false);
      expect(detail8.brute.ajBrute).toBeGreaterThan(31.96);
      expect(detail10.brute.ajBrute).toBeGreaterThan(31.96);
      expect(detail8.nette.cotisations.length).toBeGreaterThan(0);
      expect(detail10.nette.cotisations.length).toBeGreaterThan(0);
    });

    it("CSG standard + CRDS + retraite quand AJ brute > seuil CSG", () => {
      const detail = calculerAJDetaille("8", 18000, 600, "standard", false);
      const labels = detail.nette.cotisations.map((c) => c.label);
      expect(labels).toContain("Retraite complémentaire");
      expect(labels).toContain("CSG (taux standard)");
      expect(labels).toContain("CRDS");
    });

    it("CSG réduit au lieu de standard", () => {
      const detail = calculerAJDetaille("8", 18000, 600, "reduit", false);
      const labels = detail.nette.cotisations.map((c) => c.label);
      expect(labels).toContain("CSG (taux réduit)");
      expect(labels).not.toContain("CSG (taux standard)");
    });

    it("cotisation Alsace-Moselle ajoutée quand activée", () => {
      const detail = calculerAJDetaille("8", 18000, 600, "standard", true);
      const labels = detail.nette.cotisations.map((c) => c.label);
      expect(labels).toContain("Alsace-Moselle");
    });

    it("pas de cotisation Alsace-Moselle quand désactivée", () => {
      const detail = calculerAJDetaille("8", 18000, 600, "standard", false);
      const labels = detail.nette.cotisations.map((c) => c.label);
      expect(labels).not.toContain("Alsace-Moselle");
    });

    it("totalCotisations = somme des montants individuels", () => {
      const detail = calculerAJDetaille("8", 18000, 600, "standard", true);
      const somme = detail.nette.cotisations.reduce((s, c) => s + c.montant, 0);
      expect(detail.nette.totalCotisations).toBeCloseTo(somme, 10);
    });

    it("ajNette = ajBrute - totalCotisations (tronqué au centime)", () => {
      const detail = calculerAJDetaille("8", 18000, 600, "standard", false);
      const attendu = tronquerCentime(detail.brute.ajBrute - detail.nette.totalCotisations);
      expect(detail.nette.ajNette).toBe(attendu);
    });

    it("montants des cotisations sont corrects (CSG standard)", () => {
      const detail = calculerAJDetaille("8", 18000, 600, "standard", false);
      const ajBrute = detail.brute.ajBrute;
      const sjm = detail.nette.sjm.valeur;

      const retraite = detail.nette.cotisations.find((c) => c.label === "Retraite complémentaire")!;
      expect(retraite.montant).toBe(tronquerCentime(sjm * TAUX_RETRAITE_COMPLEMENTAIRE));

      const csg = detail.nette.cotisations.find((c) => c.label === "CSG (taux standard)")!;
      expect(csg.montant).toBe(tronquerCentime(ajBrute * TAUX_CSG_STANDARD));

      const crds = detail.nette.cotisations.find((c) => c.label === "CRDS")!;
      expect(crds.montant).toBe(tronquerCentime(ajBrute * TAUX_CRDS));
    });

    it("montant CSG réduit est correct", () => {
      const detail = calculerAJDetaille("8", 18000, 600, "reduit", false);
      const csg = detail.nette.cotisations.find((c) => c.label === "CSG (taux réduit)")!;
      expect(csg.montant).toBe(tronquerCentime(detail.brute.ajBrute * TAUX_CSG_REDUIT));
    });

    it("montant Alsace-Moselle est correct", () => {
      const detail = calculerAJDetaille("8", 18000, 600, "standard", true);
      const alsace = detail.nette.cotisations.find((c) => c.label === "Alsace-Moselle")!;
      expect(alsace.montant).toBe(tronquerCentime(detail.brute.ajBrute * TAUX_ALSACE_MOSELLE));
    });

    it("entre les deux seuils : retraite + Alsace-Moselle, pas de CSG/CRDS", () => {
      const detail = calculerAJDetaille("10", 5000, 507, "standard", true);
      expect(detail.brute.ajBrute).toBeGreaterThan(31.96);
      expect(detail.brute.ajBrute).toBeLessThanOrEqual(60);

      const labels = detail.nette.cotisations.map((c) => c.label);
      expect(labels).toContain("Retraite complémentaire");
      expect(labels).toContain("Alsace-Moselle");
      expect(labels).not.toContain("CSG (taux standard)");
      expect(labels).not.toContain("CRDS");
      expect(detail.nette.exonerationRaison).toContain("pas de CSG/CRDS");
    });
  });

  describe("SJM", () => {
    it("diviseur 8 pour annexe 8", () => {
      const detail = calculerAJDetaille("8", 18000, 600, "standard", false);
      expect(detail.nette.sjm.valeur).toBe((18000 * 8) / 600);
      expect(formuleToString(detail.nette.sjm.formule)).toContain("× 8");
    });

    it("diviseur 10 pour annexe 10", () => {
      const detail = calculerAJDetaille("10", 18000, 600, "standard", false);
      expect(detail.nette.sjm.valeur).toBe((18000 * 10) / 600);
      expect(formuleToString(detail.nette.sjm.formule)).toContain("× 10");
    });
  });
});

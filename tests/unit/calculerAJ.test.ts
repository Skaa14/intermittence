import { calculerAJ, calculerSJM, calculerAJNette } from "../../utils/calculerAJ";
import { tronquerCentime, AJ_MIN, PARAMS } from "../../utils/calculAJ.common";
import {
  SEUIL_COTISATION_NULLE,
  SEUIL_COTISATION_CSG,
  TAUX_RETRAITE_COMPLEMENTAIRE,
  TAUX_CSG_STANDARD,
  TAUX_CSG_REDUIT,
  TAUX_CRDS,
  TAUX_ALSACE_MOSELLE,
} from "../../utils/reglementation";

describe("tronquerCentime", () => {
  it("tronque au centime inférieur", () => {
    expect(tronquerCentime(12.999)).toBe(12.99);
  });

  it("garde les centimes exacts", () => {
    expect(tronquerCentime(12.34)).toBe(12.34);
  });

  it("tronque sans arrondir vers le haut", () => {
    expect(tronquerCentime(0.129)).toBe(0.12);
  });
});

describe("calculerAJ", () => {
  describe("annexe 8", () => {
    const p = PARAMS["8"];

    it("cas nominal sous les seuils", () => {
      const aj = calculerAJ("8", 10000, 600);
      const A = tronquerCentime((AJ_MIN * p.coefSR1 * 10000) / 5000);
      const B = tronquerCentime((AJ_MIN * p.coefNHT1 * 600) / 507);
      const C = tronquerCentime(AJ_MIN * p.coefC);
      expect(aj).toBe(Math.min(Math.max(A + B + C, p.plancher), p.plafond));
    });

    it("salaire au-dessus du seuil SR (tranche 2)", () => {
      const sr = 20000;
      const aj = calculerAJ("8", sr, 600);
      const A = tronquerCentime(
        (AJ_MIN * (p.coefSR1 * p.seuilSR + p.coefSR2 * (sr - p.seuilSR))) / 5000
      );
      const B = tronquerCentime((AJ_MIN * p.coefNHT1 * 600) / 507);
      const C = tronquerCentime(AJ_MIN * p.coefC);
      expect(aj).toBe(Math.min(Math.max(A + B + C, p.plancher), p.plafond));
    });

    it("heures au-dessus du seuil NHT (tranche 2)", () => {
      const nht = 800;
      const aj = calculerAJ("8", 18000, nht);
      const A = tronquerCentime(
        (AJ_MIN * (p.coefSR1 * p.seuilSR + p.coefSR2 * (18000 - p.seuilSR))) / 5000
      );
      const B = tronquerCentime(
        (AJ_MIN * (p.coefNHT1 * p.seuilNHT + p.coefNHT2 * (nht - p.seuilNHT))) / 507
      );
      const C = tronquerCentime(AJ_MIN * p.coefC);
      expect(aj).toBe(Math.min(Math.max(A + B + C, p.plancher), p.plafond));
    });

    it("applique le plancher quand le résultat est trop bas", () => {
      const aj = calculerAJ("8", 1, 507);
      expect(aj).toBe(p.plancher);
    });

    it("applique le plafond quand le résultat est trop haut", () => {
      const aj = calculerAJ("8", 500000, 507);
      expect(aj).toBe(p.plafond);
    });
  });

  describe("annexe 10", () => {
    const p = PARAMS["10"];

    it("cas nominal", () => {
      const aj = calculerAJ("10", 18000, 600);
      expect(aj).toBeGreaterThan(0);
      expect(aj).toBeLessThanOrEqual(p.plafond);
      expect(aj).toBeGreaterThanOrEqual(p.plancher);
    });

    it("coefficients différents de l'annexe 8", () => {
      const aj8 = calculerAJ("8", 18000, 600);
      const aj10 = calculerAJ("10", 18000, 600);
      expect(aj8).not.toBe(aj10);
    });

    it("plancher annexe 10 est supérieur au plancher annexe 8", () => {
      expect(PARAMS["10"].plancher).toBeGreaterThan(PARAMS["8"].plancher);
    });
  });
});

describe("calculerSJM", () => {
  it("diviseur 8 pour annexe 8", () => {
    expect(calculerSJM("8", 18000, 600)).toBe((18000 * 8) / 600);
  });

  it("diviseur 10 pour annexe 10", () => {
    expect(calculerSJM("10", 18000, 600)).toBe((18000 * 10) / 600);
  });

  it("SJM annexe 10 > SJM annexe 8 pour mêmes inputs", () => {
    expect(calculerSJM("10", 18000, 600)).toBeGreaterThan(calculerSJM("8", 18000, 600));
  });
});

describe("calculerAJNette", () => {
  it("retourne ajBrute intacte quand <= seuil cotisation nulle", () => {
    expect(calculerAJNette(30, 200, "standard", false)).toBe(30);
  });

  it("déduit seulement la retraite entre seuil nulle et seuil CSG", () => {
    const ajBrute = 50;
    const sjm = 200;
    const retraite = tronquerCentime(sjm * TAUX_RETRAITE_COMPLEMENTAIRE);
    const attendu = tronquerCentime(ajBrute - retraite);
    expect(calculerAJNette(ajBrute, sjm, "standard", false)).toBe(attendu);
  });

  it("déduit retraite + CSG standard + CRDS au-dessus du seuil CSG", () => {
    const ajBrute = 100;
    const sjm = 200;
    const retraite = tronquerCentime(sjm * TAUX_RETRAITE_COMPLEMENTAIRE);
    const csg = tronquerCentime(ajBrute * TAUX_CSG_STANDARD);
    const crds = tronquerCentime(ajBrute * TAUX_CRDS);
    const attendu = tronquerCentime(ajBrute - retraite - csg - crds);
    expect(calculerAJNette(ajBrute, sjm, "standard", false)).toBe(attendu);
  });

  it("utilise le taux CSG réduit", () => {
    const ajBrute = 100;
    const sjm = 200;
    const netteStandard = calculerAJNette(ajBrute, sjm, "standard", false);
    const netteReduit = calculerAJNette(ajBrute, sjm, "reduit", false);
    expect(netteReduit).toBeGreaterThan(netteStandard);
  });

  it("ajoute la cotisation Alsace-Moselle", () => {
    const ajBrute = 100;
    const sjm = 200;
    const netteSans = calculerAJNette(ajBrute, sjm, "standard", false);
    const netteAvec = calculerAJNette(ajBrute, sjm, "standard", true);
    const alsace = tronquerCentime(ajBrute * TAUX_ALSACE_MOSELLE);
    expect(netteAvec).toBe(tronquerCentime(netteSans - alsace));
  });

  it("Alsace-Moselle entre les deux seuils (sans CSG/CRDS)", () => {
    const ajBrute = 50;
    const sjm = 200;
    const retraite = tronquerCentime(sjm * TAUX_RETRAITE_COMPLEMENTAIRE);
    const alsace = tronquerCentime(ajBrute * TAUX_ALSACE_MOSELLE);
    const attendu = tronquerCentime(ajBrute - retraite - alsace);
    expect(calculerAJNette(ajBrute, sjm, "standard", true)).toBe(attendu);
  });

  it("AJ nette est toujours positive", () => {
    const nette = calculerAJNette(174.8, 500, "standard", true);
    expect(nette).toBeGreaterThan(0);
  });
});

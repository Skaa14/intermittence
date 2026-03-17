import { Annexe, TauxCSG } from "../types/profil";
import {
  SEUIL_COTISATION_NULLE,
  SEUIL_COTISATION_CSG,
  TAUX_RETRAITE_COMPLEMENTAIRE,
  TAUX_CSG_STANDARD,
  TAUX_CSG_REDUIT,
  TAUX_CRDS,
  TAUX_ALSACE_MOSELLE,
} from "./reglementation";
import { AJ_MIN, PARAMS, tronquerCentime } from "./calculAJ.common";

export interface EtapeCalcul {
  label: string;
  formule: string;
  valeur: number;
}

export interface DetailAJBrute {
  composanteA: EtapeCalcul;
  composanteB: EtapeCalcul;
  composanteC: EtapeCalcul;
  brutAvantPlafonnement: EtapeCalcul;
  plafonnement: EtapeCalcul | null;
  ajBrute: number;
}

export interface DetailCotisation {
  label: string;
  formule: string;
  montant: number;
}

export interface DetailAJNette {
  sjm: EtapeCalcul;
  cotisations: DetailCotisation[];
  totalCotisations: number;
  ajNette: number;
  exonerationRaison: string | null;
}

export interface DetailCalculAJ {
  brute: DetailAJBrute;
  nette: DetailAJNette;
}

export function calculerAJDetaille(
  annexe: Annexe,
  salaireReference: number,
  heuresTravaillees: number,
  tauxCSG: TauxCSG,
  alsaceMoselle: boolean
): DetailCalculAJ {
  const p = PARAMS[annexe];
  const sr = salaireReference;
  const nht = heuresTravaillees;

  const valA = tronquerCentime(
    (AJ_MIN *
      (p.coefSR1 * Math.min(sr, p.seuilSR) +
        p.coefSR2 * Math.max(sr - p.seuilSR, 0))) /
      5000
  );
  const composanteA: EtapeCalcul = {
    label: "Composante A (salaire)",
    formule: sr <= p.seuilSR
      ? `${AJ_MIN} × ${p.coefSR1} × ${sr} / 5000`
      : `${AJ_MIN} × (${p.coefSR1} × ${p.seuilSR} + ${p.coefSR2} × (${sr} − ${p.seuilSR})) / 5000`,
    valeur: valA,
  };

  const valB = tronquerCentime(
    (AJ_MIN *
      (p.coefNHT1 * Math.min(nht, p.seuilNHT) +
        p.coefNHT2 * Math.max(nht - p.seuilNHT, 0))) /
      507
  );
  const composanteB: EtapeCalcul = {
    label: "Composante B (heures)",
    formule: nht <= p.seuilNHT
      ? `${AJ_MIN} × ${p.coefNHT1} × ${nht} / 507`
      : `${AJ_MIN} × (${p.coefNHT1} × ${p.seuilNHT} + ${p.coefNHT2} × (${nht} − ${p.seuilNHT})) / 507`,
    valeur: valB,
  };

  const valC = tronquerCentime(AJ_MIN * p.coefC);
  const composanteC: EtapeCalcul = {
    label: "Composante C (fixe)",
    formule: `${AJ_MIN} × ${p.coefC}`,
    valeur: valC,
  };

  const brutAvantPlafonnement = valA + valB + valC;
  const ajBrute = Math.min(Math.max(brutAvantPlafonnement, p.plancher), p.plafond);

  let plafonnement: EtapeCalcul | null = null;
  if (brutAvantPlafonnement < p.plancher) {
    plafonnement = {
      label: "Plancher appliqué",
      formule: `max(${brutAvantPlafonnement.toFixed(2)}, ${p.plancher})`,
      valeur: p.plancher,
    };
  } else if (brutAvantPlafonnement > p.plafond) {
    plafonnement = {
      label: "Plafond appliqué",
      formule: `min(${brutAvantPlafonnement.toFixed(2)}, ${p.plafond})`,
      valeur: p.plafond,
    };
  }

  const brute: DetailAJBrute = {
    composanteA,
    composanteB,
    composanteC,
    brutAvantPlafonnement: {
      label: "A + B + C",
      formule: `${valA.toFixed(2)} + ${valB.toFixed(2)} + ${valC.toFixed(2)}`,
      valeur: brutAvantPlafonnement,
    },
    plafonnement,
    ajBrute,
  };

  const diviseur = annexe === "8" ? 8 : 10;
  const sjmVal = (sr * diviseur) / nht;
  const sjm: EtapeCalcul = {
    label: "Salaire journalier moyen (SJM)",
    formule: `${sr} × ${diviseur} / ${nht}`,
    valeur: sjmVal,
  };

  let exonerationRaison: string | null = null;
  const cotisations: DetailCotisation[] = [];

  if (ajBrute <= SEUIL_COTISATION_NULLE) {
    exonerationRaison = `AJ brute (${ajBrute.toFixed(2)} €) ≤ ${SEUIL_COTISATION_NULLE} € → aucune cotisation`;
    return {
      brute,
      nette: {
        sjm,
        cotisations,
        totalCotisations: 0,
        ajNette: ajBrute,
        exonerationRaison,
      },
    };
  }

  const retraite = tronquerCentime(sjmVal * TAUX_RETRAITE_COMPLEMENTAIRE);
  cotisations.push({
    label: "Retraite complémentaire",
    formule: `SJM × ${(TAUX_RETRAITE_COMPLEMENTAIRE * 100).toFixed(2)}% = ${sjmVal.toFixed(2)} × ${TAUX_RETRAITE_COMPLEMENTAIRE}`,
    montant: retraite,
  });

  if (ajBrute <= SEUIL_COTISATION_CSG) {
    exonerationRaison = `AJ brute (${ajBrute.toFixed(2)} €) ≤ ${SEUIL_COTISATION_CSG} € → pas de CSG/CRDS`;

    if (alsaceMoselle) {
      const alsace = tronquerCentime(ajBrute * TAUX_ALSACE_MOSELLE);
      cotisations.push({
        label: "Alsace-Moselle",
        formule: `${ajBrute.toFixed(2)} × ${(TAUX_ALSACE_MOSELLE * 100).toFixed(1)}%`,
        montant: alsace,
      });
    }
  } else {
    const tauxEffectif = tauxCSG === "reduit" ? TAUX_CSG_REDUIT : TAUX_CSG_STANDARD;
    const csg = tronquerCentime(ajBrute * tauxEffectif);
    cotisations.push({
      label: `CSG (${tauxCSG === "reduit" ? "taux réduit" : "taux standard"})`,
      formule: `${ajBrute.toFixed(2)} × ${(tauxEffectif * 100).toFixed(1)}%`,
      montant: csg,
    });

    const crds = tronquerCentime(ajBrute * TAUX_CRDS);
    cotisations.push({
      label: "CRDS",
      formule: `${ajBrute.toFixed(2)} × ${(TAUX_CRDS * 100).toFixed(1)}%`,
      montant: crds,
    });

    if (alsaceMoselle) {
      const alsace = tronquerCentime(ajBrute * TAUX_ALSACE_MOSELLE);
      cotisations.push({
        label: "Alsace-Moselle",
        formule: `${ajBrute.toFixed(2)} × ${(TAUX_ALSACE_MOSELLE * 100).toFixed(1)}%`,
        montant: alsace,
      });
    }
  }

  const totalCotisations = cotisations.reduce((sum, c) => sum + c.montant, 0);
  const ajNette = tronquerCentime(ajBrute - totalCotisations);

  return {
    brute,
    nette: {
      sjm,
      cotisations,
      totalCotisations,
      ajNette,
      exonerationRaison,
    },
  };
}

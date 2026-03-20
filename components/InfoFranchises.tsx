import { View, Text, ScrollView, Modal, TouchableOpacity } from "react-native";
import { Fraction } from "./Fraction";
import { IndemnisationMensuelle } from "../utils/calculerIndemnisationMensuelle";
import { ProfilIntermittent } from "../types/profil";
import {
  DELAI_ATTENTE_JOURS,
  PLAFOND_FRANCHISE_CP_JOURS,
  PERIODICITE_FRANCHISE_CP,
  TAUX_FRANCHISE_CP,
  SEUIL_FRANCHISE_CP_MENSUEL,
  FRANCHISE_CP_MENSUELLE_BAS,
  FRANCHISE_CP_MENSUELLE_HAUT,
  SMIC_MENSUEL,
  SMIC_JOURNALIER,
  COEF_SJM_FRANCHISE_SALAIRE,
  CONSTANTE_FRANCHISE_SALAIRE,
  MOIS_FRANCHISE_SALAIRE,
} from "../utils/reglementation";
import { styles } from "./InfoFranchises.styles";

export interface InfoContenu {
  titre: string;
  description: string;
  calcul: React.ReactNode;
}

const NOMS_MOIS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function formatMois(date: Date): string {
  return `${NOMS_MOIS[date.getMonth()]} ${date.getFullYear()}`;
}

export function joursDeduits(n: number): string {
  return n <= 1 ? `${n} jour déduit` : `${n} jours déduits`;
}

function FormuleLigne({ children }: { children: React.ReactNode }) {
  return <View style={styles.formuleLigne}>{children}</View>;
}

function FormuleTexte({ children }: { children: React.ReactNode }) {
  return <Text style={styles.formuleText}>{children}</Text>;
}

function FormuleResultat({ children }: { children: React.ReactNode }) {
  return <Text style={styles.formuleResultat}>{children}</Text>;
}

export function buildInfoDelaiAttente(mois: IndemnisationMensuelle): InfoContenu {
  return {
    titre: "Délai d'attente",
    description:
      "C'est un délai incompressible de 7 jours calendaires au tout début de ta période d'indemnisation. " +
      "Pendant ces 7 jours, aucune ARE n'est versée, même si tu ne travailles pas. " +
      "Il ne s'applique qu'une seule fois, sur le premier mois.",
    calcul: (
      <>
        <FormuleLigne>
          <FormuleTexte>Délai fixe : {DELAI_ATTENTE_JOURS} jours</FormuleTexte>
        </FormuleLigne>
        <FormuleLigne>
          <FormuleTexte>Appliqué sur : {formatMois(mois.mois)} (1er mois)</FormuleTexte>
        </FormuleLigne>
        <FormuleLigne>
          <FormuleResultat>→ {joursDeduits(mois.delaiAttente)}</FormuleResultat>
        </FormuleLigne>
      </>
    ),
  };
}

export function buildInfoFranchiseCP(
  mois: IndemnisationMensuelle,
  profil: ProfilIntermittent
): InfoContenu {
  if (!profil.aOuvertDroits) {
    return { titre: "Franchise congés payés", description: "", calcul: null };
  }
  const diviseur = profil.annexe === "8" ? 8 : 10;
  const joursRef = profil.heuresTravaillees / diviseur;
  const totalFranchiseCP = Math.min(
    PLAFOND_FRANCHISE_CP_JOURS,
    Math.floor((joursRef / PERIODICITE_FRANCHISE_CP) * TAUX_FRANCHISE_CP)
  );
  const tauxMensuel =
    totalFranchiseCP <= SEUIL_FRANCHISE_CP_MENSUEL
      ? FRANCHISE_CP_MENSUELLE_BAS
      : FRANCHISE_CP_MENSUELLE_HAUT;

  return {
    titre: "Franchise congés payés",
    description:
      "Pendant tes contrats, tu as acquis des droits à congés payés (même si tu ne les as pas forcément pris). " +
      "France Travail considère que ces jours de congés payés te sont « dus » par tes employeurs, " +
      "et les déduit de tes jours indemnisables. La franchise est étalée sur les 12 mois.",
    calcul: (
      <>
        <FormuleLigne>
          <FormuleTexte>1. Jours de référence :</FormuleTexte>
        </FormuleLigne>
        <FormuleLigne>
          <Fraction num="heures travaillées" den={`diviseur annexe ${profil.annexe}`} />
        </FormuleLigne>
        <FormuleLigne>
          <Fraction num={`${profil.heuresTravaillees}`} den={`${diviseur}`} />
          <FormuleTexte> = {joursRef.toFixed(1)} j</FormuleTexte>
        </FormuleLigne>
        <FormuleLigne>
          <FormuleTexte>2. Total de la franchise :</FormuleTexte>
        </FormuleLigne>
        <FormuleLigne>
          <Fraction num="jours de réf." den="périodicité" />
          <FormuleTexte> × {TAUX_FRANCHISE_CP}</FormuleTexte>
        </FormuleLigne>
        <FormuleLigne>
          <Fraction num={`${joursRef.toFixed(1)}`} den={`${PERIODICITE_FRANCHISE_CP}`} />
          <FormuleTexte> × {TAUX_FRANCHISE_CP} = {((joursRef / PERIODICITE_FRANCHISE_CP) * TAUX_FRANCHISE_CP).toFixed(2)}</FormuleTexte>
        </FormuleLigne>
        <FormuleLigne>
          <FormuleTexte>Arrondi à l'entier inférieur : {Math.floor((joursRef / PERIODICITE_FRANCHISE_CP) * TAUX_FRANCHISE_CP)} j</FormuleTexte>
        </FormuleLigne>
        {totalFranchiseCP >= PLAFOND_FRANCHISE_CP_JOURS && (
          <FormuleLigne>
            <FormuleTexte>(plafonné à {PLAFOND_FRANCHISE_CP_JOURS} jours)</FormuleTexte>
          </FormuleLigne>
        )}
        <FormuleLigne>
          <FormuleTexte>3. Répartition mensuelle :</FormuleTexte>
        </FormuleLigne>
        <FormuleLigne>
          <FormuleTexte>Si total ≤ {SEUIL_FRANCHISE_CP_MENSUEL} → {FRANCHISE_CP_MENSUELLE_BAS} j/mois, sinon {FRANCHISE_CP_MENSUELLE_HAUT} j/mois</FormuleTexte>
        </FormuleLigne>
        <FormuleLigne>
          <FormuleTexte>{totalFranchiseCP} j {totalFranchiseCP <= SEUIL_FRANCHISE_CP_MENSUEL ? "≤" : ">"} {SEUIL_FRANCHISE_CP_MENSUEL} → {tauxMensuel} j/mois</FormuleTexte>
        </FormuleLigne>
        <FormuleLigne>
          <FormuleResultat>→ Ce mois-ci : {joursDeduits(mois.franchiseCP)}</FormuleResultat>
        </FormuleLigne>
      </>
    ),
  };
}

export function buildInfoFranchiseSalaire(
  mois: IndemnisationMensuelle,
  profil: ProfilIntermittent
): InfoContenu {
  if (!profil.aOuvertDroits) {
    return { titre: "Franchise salaire", description: "", calcul: null };
  }
  const diviseur = profil.annexe === "8" ? 8 : 10;
  const sjm =
    (profil.salaireReference * diviseur) / profil.heuresTravaillees;
  const franchiseSalaireRaw =
    (profil.salaireReference / SMIC_MENSUEL) *
      (sjm / (COEF_SJM_FRANCHISE_SALAIRE * SMIC_JOURNALIER)) -
    CONSTANTE_FRANCHISE_SALAIRE;
  const totalFranchiseSalaire = Math.max(0, Math.floor(franchiseSalaireRaw));
  const mensuelleBase =
    totalFranchiseSalaire > 0
      ? Math.ceil(totalFranchiseSalaire / MOIS_FRANCHISE_SALAIRE)
      : 0;

  return {
    titre: "Franchise salaire",
    description:
      "Plus ton salaire de référence est élevé par rapport au SMIC, plus France Travail estime que tu as pu " +
      "épargner. Cette franchise déduit des jours d'indemnisation en fonction de ton niveau de rémunération. " +
      `Elle est étalée sur les ${MOIS_FRANCHISE_SALAIRE} premiers mois de ta période d'indemnisation.`,
    calcul: (
      <>
        <FormuleLigne>
          <FormuleTexte>1. Salaire journalier moyen (SJM) :</FormuleTexte>
        </FormuleLigne>
        <FormuleLigne>
          <Fraction
            num={`salaire réf. × diviseur annexe ${profil.annexe}`}
            den="heures travaillées"
          />
        </FormuleLigne>
        <FormuleLigne>
          <Fraction
            num={`${profil.salaireReference.toFixed(0)} × ${diviseur}`}
            den={`${profil.heuresTravaillees}`}
          />
          <FormuleTexte> = {sjm.toFixed(2)} €</FormuleTexte>
        </FormuleLigne>
        <FormuleLigne>
          <FormuleTexte>2. Calcul de la franchise :</FormuleTexte>
        </FormuleLigne>
        <FormuleLigne>
          <Fraction num="salaire réf." den="SMIC mensuel" />
          <FormuleTexte> × </FormuleTexte>
          <Fraction num="SJM" den={`${COEF_SJM_FRANCHISE_SALAIRE} × SMIC journalier`} />
          <FormuleTexte> − {CONSTANTE_FRANCHISE_SALAIRE}</FormuleTexte>
        </FormuleLigne>
        <FormuleLigne>
          <Fraction
            num={`${profil.salaireReference.toFixed(0)}`}
            den={`${SMIC_MENSUEL}`}
          />
          <FormuleTexte> × </FormuleTexte>
          <Fraction
            num={`${sjm.toFixed(2)}`}
            den={`${COEF_SJM_FRANCHISE_SALAIRE} × ${SMIC_JOURNALIER}`}
          />
          <FormuleTexte> − {CONSTANTE_FRANCHISE_SALAIRE} = {franchiseSalaireRaw.toFixed(2)}</FormuleTexte>
        </FormuleLigne>
        <FormuleLigne>
          <FormuleTexte>Arrondi à l'entier inférieur : {totalFranchiseSalaire} j</FormuleTexte>
        </FormuleLigne>
        {totalFranchiseSalaire > 0 && (
          <>
            <FormuleLigne>
              <FormuleTexte>3. Répartition mensuelle :</FormuleTexte>
            </FormuleLigne>
            <FormuleLigne>
              <Fraction num="total franchise" den="nombre de mois" />
            </FormuleLigne>
            <FormuleLigne>
              <Fraction
                num={`${totalFranchiseSalaire}`}
                den={`${MOIS_FRANCHISE_SALAIRE}`}
              />
              <FormuleTexte> = {(totalFranchiseSalaire / MOIS_FRANCHISE_SALAIRE).toFixed(2)}</FormuleTexte>
            </FormuleLigne>
            <FormuleLigne>
              <FormuleTexte>Arrondi à l'entier supérieur : {mensuelleBase} j/mois</FormuleTexte>
            </FormuleLigne>
          </>
        )}
        <FormuleLigne>
          <FormuleResultat>→ Ce mois-ci : {joursDeduits(mois.franchiseSalaire)}</FormuleResultat>
        </FormuleLigne>
      </>
    ),
  };
}

export function InfoModal({
  visible,
  contenu,
  onClose,
}: {
  visible: boolean;
  contenu: InfoContenu | null;
  onClose: () => void;
}) {
  if (!contenu) return null;
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator>
            <Text style={styles.modalTitle}>{contenu.titre}</Text>
            <Text style={styles.modalDescription}>{contenu.description}</Text>
            {contenu.calcul && (
              <View style={styles.modalCalcul}>
                {contenu.calcul}
              </View>
            )}
          </ScrollView>
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseText}>Compris</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

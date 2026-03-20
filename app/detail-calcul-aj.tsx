import { View, Text, ScrollView, Pressable, UIManager, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useProfils } from "../contexts/ProfilsContext";
import { calculerAJDetaille, DetailCotisation, ParametreInfo, FormuleSegment, formuleToString } from "../utils/calculerAJDetaille";
import { styles } from "../styles/detail-calcul-aj.styles";
import { FormuleRendu } from "../components/FormuleRendu";
import { useAnimatedToggle } from "../hooks/useAnimatedToggle";
import { useMemo } from "react";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function ParametresBlock({ testID, parametres }: { testID?: string; parametres: ParametreInfo[] }) {
  return (
    <View testID={testID} style={styles.parametresBlock}>
      {parametres.map((p, i) => (
        <View key={i} style={styles.parametreLigne}>
          <Text style={styles.parametreNom}>{p.nom}</Text>
          <Text style={styles.parametreDescription}>{p.description}</Text>
        </View>
      ))}
    </View>
  );
}

function EtapeView({ testID, label, formule, valeur, parametres }: { testID?: string; label: string; formule: FormuleSegment[]; valeur: string; parametres?: ParametreInfo[] }) {
  const [expanded, toggle] = useAnimatedToggle();

  return (
    <View testID={testID} style={styles.etape}>
      <Text style={styles.etapeLabel}>{label}</Text>
      <View style={styles.formuleLigne}>
        <FormuleRendu segments={formule} small />
        {parametres && parametres.length > 0 && (
          <Pressable testID={testID ? `${testID}-info` : undefined} onPress={toggle} hitSlop={8} style={styles.infoButton}>
            <Text style={[styles.infoIcon, expanded && styles.infoIconActive]}>👁</Text>
          </Pressable>
        )}
      </View>
      {expanded && parametres && <ParametresBlock testID={testID ? `${testID}-parametres` : undefined} parametres={parametres} />}
      <Text style={styles.etapeValeur}>{valeur}</Text>
    </View>
  );
}

function CotisationView({ testID, cotisation }: { testID?: string; cotisation: DetailCotisation }) {
  const [expanded, toggle] = useAnimatedToggle();

  return (
    <View testID={testID} style={styles.cotisation}>
      <View style={styles.ligne}>
        <Text style={styles.cotisationLabel}>{cotisation.label}</Text>
        <Text style={styles.cotisationMontant}>− {cotisation.montant.toFixed(2)} €</Text>
      </View>
      <View style={styles.formuleLigne}>
        <FormuleRendu segments={cotisation.formule} small />
        {cotisation.parametres && cotisation.parametres.length > 0 && (
          <Pressable onPress={toggle} hitSlop={8} style={styles.infoButton}>
            <Text style={[styles.infoIcon, expanded && styles.infoIconActive]}>👁</Text>
          </Pressable>
        )}
      </View>
      {expanded && cotisation.parametres && <ParametresBlock parametres={cotisation.parametres} />}
    </View>
  );
}

export default function DetailCalculAJScreen() {
  const { profilActif: profil } = useProfils();
  const insets = useSafeAreaInsets();

  const detail = useMemo(() => {
    if (!profil || !profil.aOuvertDroits) return null;
    return calculerAJDetaille(
      profil.annexe,
      profil.salaireReference,
      profil.heuresTravaillees,
      profil.tauxCSG,
      profil.alsaceMoselle
    );
  }, [profil]);

  if (!profil || !detail) {
    return (
      <View testID="detail-aj-vide" style={styles.container}>
        <Text>Aucun profil configuré.</Text>
      </View>
    );
  }

  const { brute, nette } = detail;

  return (
    <ScrollView testID="detail-aj-scroll" style={styles.container} contentContainerStyle={[styles.scroll, { paddingBottom: 20 + insets.bottom }]}>
      <View testID="detail-aj-resultat" style={styles.resultatSection}>
        <Text style={styles.resultatLabel}>Indemnité journalière estimée</Text>
        <View style={styles.resultatRow}>
          <View style={styles.resultatCol}>
            <Text style={styles.resultatColLabel}>Brut</Text>
            <Text testID="detail-aj-brut" style={styles.resultatBrut}>{brute.ajBrute.toFixed(2)} €</Text>
          </View>
          <View style={styles.resultatCol}>
            <Text style={styles.resultatColLabel}>Net</Text>
            <Text testID="detail-aj-net" style={styles.resultatNet}>{nette.ajNette.toFixed(2)} €</Text>
          </View>
        </View>
      </View>

      <View testID="detail-aj-section-brute" style={styles.section}>
        <Text testID="detail-aj-titre-brute" style={styles.titreSection}>Calcul de l'AJ brute — Annexe {profil.annexe}</Text>

        <EtapeView
          testID="detail-aj-composante-a"
          label={brute.composanteA.label}
          formule={brute.composanteA.formule}
          valeur={`= ${brute.composanteA.valeur.toFixed(2)} €`}
          parametres={brute.composanteA.parametres}
        />
        <EtapeView
          testID="detail-aj-composante-b"
          label={brute.composanteB.label}
          formule={brute.composanteB.formule}
          valeur={`= ${brute.composanteB.valeur.toFixed(2)} €`}
          parametres={brute.composanteB.parametres}
        />
        <EtapeView
          testID="detail-aj-composante-c"
          label={brute.composanteC.label}
          formule={brute.composanteC.formule}
          valeur={`= ${brute.composanteC.valeur.toFixed(2)} €`}
          parametres={brute.composanteC.parametres}
        />

        <View style={styles.separateur} />

        <EtapeView
          testID="detail-aj-somme"
          label={brute.brutAvantPlafonnement.label}
          formule={brute.brutAvantPlafonnement.formule}
          valeur={`= ${brute.brutAvantPlafonnement.valeur.toFixed(2)} €`}
        />

        {brute.plafonnement && (
          <View testID="detail-aj-plafonnement" style={styles.etape}>
            <Text style={styles.plafonnement}>
              {brute.plafonnement.label} : {formuleToString(brute.plafonnement.formule)} = {brute.plafonnement.valeur.toFixed(2)} €
            </Text>
          </View>
        )}

        <EtapeView
          testID="detail-aj-brute-finale"
          label="AJ brute"
          formule={[brute.plafonnement ? "Après plafonnement" : "Pas de plafonnement appliqué"]}
          valeur={`= ${brute.ajBrute.toFixed(2)} €`}
        />
      </View>

      <View testID="detail-aj-section-nette" style={styles.section}>
        <Text style={styles.titreSection}>Passage au net — Cotisations</Text>

        <EtapeView
          testID="detail-aj-sjm"
          label={nette.sjm.label}
          formule={nette.sjm.formule}
          valeur={`= ${nette.sjm.valeur.toFixed(2)} €`}
          parametres={nette.sjm.parametres}
        />

        <View style={styles.separateur} />

        {nette.exonerationRaison && nette.cotisations.length === 0 && (
          <Text testID="detail-aj-exoneration" style={styles.exoneration}>{nette.exonerationRaison}</Text>
        )}

        {nette.cotisations.map((cot, i) => (
          <CotisationView key={i} testID={`detail-aj-cotisation-${i}`} cotisation={cot} />
        ))}

        {nette.exonerationRaison && nette.cotisations.length > 0 && (
          <Text testID="detail-aj-exoneration" style={styles.exoneration}>{nette.exonerationRaison}</Text>
        )}

        {nette.cotisations.length > 0 && (
          <>
            <View style={styles.separateur} />
            <View testID="detail-aj-total-cotisations" style={styles.ligne}>
              <Text style={styles.etapeLabel}>Total cotisations</Text>
              <Text style={styles.cotisationMontant}>− {nette.totalCotisations.toFixed(2)} €</Text>
            </View>
            <Text testID="detail-aj-formule-nette" style={styles.ligneFormule}>
              {brute.ajBrute.toFixed(2)} − {nette.totalCotisations.toFixed(2)} = {nette.ajNette.toFixed(2)} €
            </Text>
          </>
        )}
      </View>

      <View testID="detail-aj-resultat-final" style={styles.resultatFinal}>
        <Text style={styles.resultatFinalLabel}>AJ nette estimée</Text>
        <Text testID="detail-aj-net-final" style={styles.resultatFinalMontant}>
          {nette.ajNette.toFixed(2)} €
        </Text>
        <Text style={styles.resultatFinalSous}>par jour d'indemnisation</Text>
      </View>
    </ScrollView>
  );
}

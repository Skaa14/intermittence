import { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useContrats } from "../../contexts/ContratsContext";
import { useProfil } from "../../contexts/ProfilContext";
import { useFormations } from "../../contexts/FormationsContext";
import { useEnseignements } from "../../contexts/EnseignementsContext";
import { useDonneesTest } from "../../contexts/DonneesTestContext";
import { Annexe, TauxCSG } from "../../types/profil";
import { formatDate, parseDate } from "../../utils/date";
import { calculerAJ, calculerAJNette, calculerSJM } from "../../utils/calculerAJ";
import { filtrerContratsPeriodeReference, trouverFCT, calculerDebutPeriodeReference, filtrerParPeriodeReference } from "../../utils/filtrerContratsPeriodeReference";
import { calculerHeuresFormationPlafonnees } from "../../utils/calculerHeuresFormation";
import { calculerHeuresEnseignementPlafonnees } from "../../utils/calculerHeuresEnseignement";
import { trouverDatesOuvertureEligibles, simulerOuverture } from "../../utils/simulerOuvertureDroits";
import { PLAFOND_HEURES_FORMATION, PLAFOND_HEURES_ENSEIGNEMENT } from "../../utils/reglementation";
import { styles, webDateInputStyle } from "../../styles/tabs/index.styles";

export default function AccueilScreen() {
  const { contrats } = useContrats();
  const { profil, mettreAJourProfil } = useProfil();
  const { formations } = useFormations();
  const { enseignements } = useEnseignements();
  const { chargerDonneesTest } = useDonneesTest();
  const router = useRouter();

  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [annexe, setAnnexe] = useState<Annexe>(profil?.annexe ?? "8");
  const [dateAnniversaire, setDateAnniversaire] = useState<Date | undefined>(
    profil ? parseDate(profil.dateAnniversaire) : undefined
  );
  const [showPicker, setShowPicker] = useState(false);
  const [salaireReference, setSalaireReference] = useState(
    profil ? profil.salaireReference.toString() : ""
  );
  const [heuresTravaillees, setHeuresTravaillees] = useState(
    profil ? profil.heuresTravaillees.toString() : ""
  );
  const [tauxCSG, setTauxCSG] = useState<TauxCSG>(profil?.tauxCSG ?? "standard");
  const [alsaceMoselle, setAlsaceMoselle] = useState(profil?.alsaceMoselle ?? false);
  const [contratFctId, setContratFctId] = useState<string | null>(null);

  const { ajBrute, ajNette } = useMemo(() => {
    if (!profil) return { ajBrute: 0, ajNette: 0 };
    const brute = calculerAJ(profil.annexe, profil.salaireReference, profil.heuresTravaillees);
    const sjm = calculerSJM(profil.annexe, profil.salaireReference, profil.heuresTravaillees);
    const nette = calculerAJNette(brute, sjm, profil.tauxCSG, profil.alsaceMoselle);
    return { ajBrute: brute, ajNette: nette };
  }, [profil]);

  const contratsFiltrés = useMemo(
    () => filtrerContratsPeriodeReference(contrats),
    [contrats]
  );
  const fct = useMemo(() => trouverFCT(contrats), [contrats]);
  const debutPeriode = useMemo(
    () => (fct ? calculerDebutPeriodeReference(fct) : undefined),
    [fct]
  );

  const datesEligibles = useMemo(
    () => trouverDatesOuvertureEligibles(contrats, formations, enseignements),
    [contrats, formations, enseignements]
  );

  const simulation = useMemo(() => {
    if (!contratFctId || !profil) return undefined;
    const eligible = datesEligibles.find((d) => d.contrat.id === contratFctId);
    if (!eligible) return undefined;
    return simulerOuverture(contrats, formations, eligible.dateFCT, profil, enseignements);
  }, [contratFctId, profil, contrats, formations, datesEligibles]);

  const totalHeuresContrats = contratsFiltrés.reduce((sum, c) => sum + c.heures, 0);
  const formationsFiltrees = fct ? filtrerParPeriodeReference(formations, fct) : formations;
  const enseignementsFiltres = fct ? filtrerParPeriodeReference(enseignements, fct) : enseignements;
  const heuresFormation = calculerHeuresFormationPlafonnees(formationsFiltrees);
  const heuresEnseignement = calculerHeuresEnseignementPlafonnees(enseignementsFiltres);
  const totalHeures = totalHeuresContrats + heuresFormation + heuresEnseignement;
  const totalSalaire = contratsFiltrés.reduce((sum, c) => sum + c.salaireBrut, 0);
  const progression = Math.min((totalHeures / 507) * 100, 100);

  const ouvrirFormulaire = () => {
    if (profil) {
      setAnnexe(profil.annexe);
      setDateAnniversaire(parseDate(profil.dateAnniversaire));
      setSalaireReference(profil.salaireReference.toString());
      setHeuresTravaillees(profil.heuresTravaillees.toString());
      setTauxCSG(profil.tauxCSG);
      setAlsaceMoselle(profil.alsaceMoselle);
    }
    setFormulaireOuvert(true);
  };

  const handleValider = () => {
    const salaire = Number(salaireReference);
    const heures = Number(heuresTravaillees);
    if (!dateAnniversaire || isNaN(salaire) || isNaN(heures)) return;

    mettreAJourProfil({
      annexe,
      dateAnniversaire: formatDate(dateAnniversaire),
      salaireReference: salaire,
      heuresTravaillees: heures,
      tauxCSG,
      alsaceMoselle,
    });
    setFormulaireOuvert(false);
  };

  const onChangeDateAnniversaire = (
    _event: DateTimePickerEvent,
    date?: Date
  ) => {
    setShowPicker(Platform.OS === "ios");
    if (date) setDateAnniversaire(date);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Progression vers les 507h</Text>
        <Text style={styles.cardValue}>{totalHeures}h / 507h</Text>
        <View style={styles.barreContainer}>
          <View style={[styles.barre, { width: `${progression}%` }]} />
        </View>
        <Text style={styles.cardHint}>
          {totalHeures >= 507
            ? "Seuil atteint ! Tu peux ouvrir tes droits."
            : `Il te manque ${507 - totalHeures}h`}
        </Text>
        {(heuresFormation > 0 || heuresEnseignement > 0) && (
          <Text style={styles.cardHint}>
            {[
              "dont",
              heuresEnseignement > 0 ? `${heuresEnseignement}h d'enseignement (plafond ${PLAFOND_HEURES_ENSEIGNEMENT}h)` : "",
              heuresEnseignement > 0 && heuresFormation > 0 ? "—" : "",
              heuresFormation > 0 ? `${heuresFormation}h de formation (plafond ${PLAFOND_HEURES_FORMATION}h)` : "",
            ].filter(Boolean).join(" ")}
          </Text>
        )}
        {debutPeriode && fct && (
          <Text testID="periode-reference" style={styles.cardPeriode}>
            Période : {formatDate(debutPeriode)} → {formatDate(fct)} ({contratsFiltrés.length} contrat{contratsFiltrés.length > 1 ? "s" : ""})
          </Text>
        )}
        {totalHeures >= 507 && (
          <View testID="simulation-section" style={styles.simulationSection}>
            <Text style={styles.simulationTitle}>Simuler l'ouverture de droits</Text>
            <Text style={styles.simulationHint}>
              Simulation basée sur tes contrats et formations renseignés
            </Text>
            {!profil ? (
              <Text testID="simulation-profil-requis" style={styles.simulationProfilHint}>
                Configure ton profil pour simuler l'ouverture de droits
              </Text>
            ) : (
              <>
                <Text style={styles.simulationHint}>
                  Choisis la date de fin de contrat pour l'ouverture :
                </Text>
                <View style={styles.chipRow}>
                  {datesEligibles.map((d) => (
                    <Pressable
                      key={d.contrat.id}
                      testID={`chip-fct-${d.contrat.id}`}
                      style={[
                        styles.chip,
                        contratFctId === d.contrat.id && styles.chipActive,
                      ]}
                      onPress={() =>
                        setContratFctId(
                          contratFctId === d.contrat.id ? null : d.contrat.id
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.chipText,
                          contratFctId === d.contrat.id && styles.chipTextActive,
                        ]}
                      >
                        {d.contrat.employeur} — {d.contrat.dateFin}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                {simulation && (
                  <View testID="simulation-resultats" style={styles.simulationResultats}>
                    <Text style={styles.simulationPeriode}>
                      Période couverte : {formatDate(simulation.dateAnniversaire)} → {formatDate(simulation.dateFinIndemnisation)}
                    </Text>
                    <View style={styles.simulationAjRow}>
                      <View style={styles.simulationAjCol}>
                        <Text style={styles.simulationAjLabel}>AJ brute</Text>
                        <Text testID="simulation-aj-brute" style={styles.simulationAjValue}>
                          {simulation.ajBrute.toFixed(2)} €
                        </Text>
                      </View>
                      <View style={styles.simulationAjCol}>
                        <Text style={styles.simulationAjLabel}>AJ nette</Text>
                        <Text testID="simulation-aj-nette" style={styles.simulationAjValue}>
                          {simulation.ajNette.toFixed(2)} €
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.simulationDetail}>
                      {simulation.heuresEligiblesAJ}h travaillées — {simulation.salaireReference.toFixed(0)} € de salaire référence
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Salaire brut cumulé</Text>
        <Text style={styles.cardValue}>{totalSalaire.toFixed(0)} €</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Contrats enregistrés</Text>
        <Text testID="contrats-count" style={styles.cardValue}>{contrats.length}</Text>
      </View>

      {profil && !formulaireOuvert && (
        <View testID="aj-card" style={styles.ajCard}>
          <Pressable testID="btn-modifier-profil" onPress={ouvrirFormulaire}>
            <Text style={styles.ajLabel}>Indemnité journalière estimée</Text>
            <View style={styles.ajRow}>
              <View style={styles.ajCol}>
                <Text style={styles.ajColLabel}>Brut</Text>
                <Text testID="aj-value" style={styles.ajValue}>
                  {ajBrute.toFixed(2)} €
                </Text>
              </View>
              <View style={styles.ajCol}>
                <Text style={styles.ajColLabel}>Net</Text>
                <Text testID="aj-nette-value" style={styles.ajNetteValue}>
                  {ajNette.toFixed(2)} €
                </Text>
              </View>
            </View>
            <Text style={styles.ajDetail}>
              Annexe {profil.annexe} — {profil.heuresTravaillees}h —{" "}
              {profil.salaireReference.toFixed(0)} € — Anniversaire :{" "}
              {profil.dateAnniversaire}
            </Text>
          </Pressable>
          <Pressable
            testID="btn-detail-calcul"
            style={styles.btnDetailCalcul}
            onPress={() => router.push("/detail-calcul-aj")}
          >
            <Text style={styles.btnDetailCalculText}>Voir le détail du calcul</Text>
          </Pressable>
        </View>
      )}

      {!profil && !formulaireOuvert && (
        <Pressable testID="btn-configurer-profil" style={styles.configurerBtn} onPress={ouvrirFormulaire}>
          <Text style={styles.configurerBtnText}>
            Configurer mon profil pour estimer mon indemnité journalière
          </Text>
        </Pressable>
      )}

      {!formulaireOuvert && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Données de test</Text>
          <Text style={styles.demoHint}>
            Charge un profil fictif pour explorer l'application
          </Text>
          <View style={styles.row}>
            <Pressable
              testID="btn-demo-artiste"
              style={styles.demoBtn}
              onPress={() => chargerDonneesTest("artiste")}
            >
              <Text style={styles.demoBtnLabel}>Artiste</Text>
              <Text style={styles.demoBtnSub}>Anx. 10</Text>
            </Pressable>
            <Pressable
              testID="btn-demo-technicien"
              style={styles.demoBtn}
              onPress={() => chargerDonneesTest("technicien")}
            >
              <Text style={styles.demoBtnLabel}>Technicien</Text>
              <Text style={styles.demoBtnSub}>Anx. 8</Text>
            </Pressable>
          </View>
        </View>
      )}

      {formulaireOuvert && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mon profil intermittent</Text>

          <Text style={styles.label}>Annexe</Text>
          <View style={styles.row}>
            <Pressable
              testID="btn-annexe-8"
              style={[
                styles.annexeBtn,
                annexe === "8" && styles.annexeBtnActive,
              ]}
              onPress={() => setAnnexe("8")}
            >
              <Text
                style={[
                  styles.annexeBtnText,
                  annexe === "8" && styles.annexeBtnTextActive,
                ]}
              >
                Annexe 8 — Technicien
              </Text>
            </Pressable>
            <Pressable
              testID="btn-annexe-10"
              style={[
                styles.annexeBtn,
                annexe === "10" && styles.annexeBtnActive,
              ]}
              onPress={() => setAnnexe("10")}
            >
              <Text
                style={[
                  styles.annexeBtnText,
                  annexe === "10" && styles.annexeBtnTextActive,
                ]}
              >
                Annexe 10 — Artiste
              </Text>
            </Pressable>
          </View>

          <Text style={styles.label}>Date anniversaire</Text>
          {Platform.OS === "web" ? (
            <input
              type="date"
              value={
                dateAnniversaire
                  ? dateAnniversaire.toISOString().slice(0, 10)
                  : ""
              }
              onChange={(e) => {
                const d = e.target.value
                  ? new Date(e.target.value + "T00:00:00")
                  : undefined;
                setDateAnniversaire(d);
              }}
              style={webDateInputStyle}
            />
          ) : (
            <>
              <Pressable
                testID="btn-date-anniversaire"
                style={styles.input}
                onPress={() => setShowPicker(true)}
              >
                <Text
                  style={
                    dateAnniversaire
                      ? styles.dateText
                      : styles.datePlaceholder
                  }
                >
                  {dateAnniversaire
                    ? formatDate(dateAnniversaire)
                    : "Sélectionner une date"}
                </Text>
              </Pressable>
              {showPicker && (
                <DateTimePicker
                  testID="picker-anniversaire"
                  value={dateAnniversaire ?? new Date()}
                  mode="date"
                  display="default"
                  onChange={onChangeDateAnniversaire}
                />
              )}
            </>
          )}

          <Text style={styles.label}>Salaire de référence (€ brut)</Text>
          <TextInput
            testID="input-salaire-reference"
            style={styles.input}
            placeholder="Ex : 18000"
            value={salaireReference}
            onChangeText={setSalaireReference}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Heures travaillées</Text>
          <TextInput
            testID="input-heures-travaillees"
            style={styles.input}
            placeholder="Ex : 600"
            value={heuresTravaillees}
            onChangeText={setHeuresTravaillees}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Taux CSG</Text>
          <View style={styles.row}>
            <Pressable
              testID="btn-csg-standard"
              style={[
                styles.annexeBtn,
                tauxCSG === "standard" && styles.annexeBtnActive,
              ]}
              onPress={() => setTauxCSG("standard")}
            >
              <Text
                style={[
                  styles.annexeBtnText,
                  tauxCSG === "standard" && styles.annexeBtnTextActive,
                ]}
              >
                Standard (6,2%)
              </Text>
            </Pressable>
            <Pressable
              testID="btn-csg-reduit"
              style={[
                styles.annexeBtn,
                tauxCSG === "reduit" && styles.annexeBtnActive,
              ]}
              onPress={() => setTauxCSG("reduit")}
            >
              <Text
                style={[
                  styles.annexeBtnText,
                  tauxCSG === "reduit" && styles.annexeBtnTextActive,
                ]}
              >
                Réduit (3,8%)
              </Text>
            </Pressable>
          </View>

          <Pressable
            testID="btn-alsace-moselle"
            style={styles.checkboxRow}
            onPress={() => setAlsaceMoselle(!alsaceMoselle)}
          >
            <View
              style={[
                styles.checkbox,
                alsaceMoselle && styles.checkboxActive,
              ]}
            >
              {alsaceMoselle && <Text style={styles.checkboxCheck}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Régime Alsace-Moselle (+1,5%)</Text>
          </Pressable>

          <View style={styles.row}>
            <Pressable
              style={styles.btnAnnuler}
              onPress={() => setFormulaireOuvert(false)}
            >
              <Text style={styles.btnAnnulerText}>Annuler</Text>
            </Pressable>
            <Pressable style={styles.btnValider} onPress={handleValider}>
              <Text style={styles.btnValiderText}>Valider</Text>
            </Pressable>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

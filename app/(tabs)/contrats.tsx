import { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useContrats } from "../../contexts/ContratsContext";
import { Contrat } from "../../types/contrat";
import { formatDate, formatDateISO, parseDate } from "../../utils/date";

type ContratAvecStatut = Contrat & { passe: boolean };
type ChampContrat = "employeur" | "dateDebut" | "dateFin" | "heures" | "salaireBrut";

const COULEUR_ERREUR = "#ef4444";

const isContratPasse = (contrat: Contrat): boolean => {
  const fin = parseDate(contrat.dateFin);
  if (!fin) return false;
  const aujourdhui = new Date();
  aujourdhui.setHours(0, 0, 0, 0);
  return fin.getTime() < aujourdhui.getTime();
};

export default function ContratsScreen() {
  const { contrats, ajouterContrat, modifierContrat, supprimerContrat } = useContrats();

  const [employeur, setEmployeur] = useState("");
  const [dateDebut, setDateDebut] = useState<Date | undefined>();
  const [dateFin, setDateFin] = useState<Date | undefined>();
  const [heures, setHeures] = useState("");
  const [salaireBrut, setSalaireBrut] = useState("");
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [showPickerDebut, setShowPickerDebut] = useState(false);
  const [showPickerFin, setShowPickerFin] = useState(false);
  const [afficherPasses, setAfficherPasses] = useState(false);
  const [contratEnEdition, setContratEnEdition] = useState<string | null>(null);
  const [erreurs, setErreurs] = useState<Partial<Record<ChampContrat, boolean>>>({});
  const [erreurMois, setErreurMois] = useState<string | null>(null);

  const { contratsActifs, contratsPasses } = useMemo(() => {
    const actifs: ContratAvecStatut[] = [];
    const passes: ContratAvecStatut[] = [];
    for (const c of contrats) {
      if (isContratPasse(c)) passes.push({ ...c, passe: true });
      else actifs.push({ ...c, passe: false });
    }
    return { contratsActifs: actifs, contratsPasses: passes };
  }, [contrats]);

  const contratsAffiches: ContratAvecStatut[] = afficherPasses
    ? [...contratsActifs, ...contratsPasses]
    : contratsActifs;

  const setDateDebutSafe = (d: Date) => {
    setDateDebut(d);
    setErreurs((e) => ({ ...e, dateDebut: false }));
    setErreurMois(null);
    if (dateFin && d.getTime() > dateFin.getTime()) setDateFin(undefined);
  };

  const setDateFinSafe = (d: Date) => {
    setDateFin(d);
    setErreurs((e) => ({ ...e, dateFin: false }));
    setErreurMois(null);
    if (dateDebut && d.getTime() < dateDebut.getTime()) setDateDebut(undefined);
  };

  const onChangeDateDebut = (_event: DateTimePickerEvent, date?: Date) => {
    setShowPickerDebut(Platform.OS === "ios");
    if (date) setDateDebutSafe(date);
  };

  const onChangeDateFin = (_event: DateTimePickerEvent, date?: Date) => {
    setShowPickerFin(Platform.OS === "ios");
    if (date) setDateFinSafe(date);
  };

  const confirmerSuppression = (contrat: Contrat) => {
    if (Platform.OS === "web") {
      if (
        typeof window !== "undefined" &&
        window.confirm(
          `Supprimer le contrat ${contrat.employeur} — ${contrat.dateDebut} → ${contrat.dateFin} ?`
        )
      ) {
        supprimerContrat(contrat.id);
      }
    } else {
      Alert.alert(
        "Supprimer ce contrat ?",
        `${contrat.employeur} — ${contrat.dateDebut} → ${contrat.dateFin}`,
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Supprimer",
            style: "destructive",
            onPress: () => supprimerContrat(contrat.id),
          },
        ],
      );
    }
  };

  const reinitialiserFormulaire = () => {
    setEmployeur("");
    setDateDebut(undefined);
    setDateFin(undefined);
    setHeures("");
    setSalaireBrut("");
    setContratEnEdition(null);
    setFormulaireOuvert(false);
    setErreurs({});
    setErreurMois(null);
  };

  const lancerEdition = (contrat: Contrat) => {
    setEmployeur(contrat.employeur);
    setDateDebut(parseDate(contrat.dateDebut));
    setDateFin(parseDate(contrat.dateFin));
    setHeures(contrat.heures.toString());
    setSalaireBrut(contrat.salaireBrut.toString());
    setContratEnEdition(contrat.id);
    setFormulaireOuvert(true);
  };

  const handleValider = () => {
    const nouvellesErreurs: Record<string, boolean> = {
      employeur: !employeur,
      dateDebut: !dateDebut,
      dateFin: !dateFin,
      heures: !heures,
      salaireBrut: !salaireBrut,
    };
    setErreurs(nouvellesErreurs);

    if (Object.values(nouvellesErreurs).some(Boolean)) return;

    const memesMois =
      dateDebut!.getMonth() === dateFin!.getMonth() &&
      dateDebut!.getFullYear() === dateFin!.getFullYear();
    if (!memesMois) {
      setErreurMois("Les dates doivent être dans le même mois calendaire.");
      return;
    }
    setErreurMois(null);

    const donnees = {
      employeur,
      dateDebut: formatDate(dateDebut!),
      dateFin: formatDate(dateFin!),
      heures: parseFloat(heures),
      salaireBrut: parseFloat(salaireBrut),
    };

    if (contratEnEdition) {
      modifierContrat(contratEnEdition, donnees);
    } else {
      ajouterContrat(donnees);
    }

    reinitialiserFormulaire();
  };

  const totalHeures = contrats.reduce((sum, c) => sum + c.heures, 0);
  const totalSalaire = contrats.reduce((sum, c) => sum + c.salaireBrut, 0);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.resume}>
        <View style={styles.resumeItem}>
          <Text style={styles.resumeValue}>{totalHeures}h</Text>
          <Text style={styles.resumeLabel}>cumulées</Text>
        </View>
        <View style={styles.resumeItem}>
          <Text style={styles.resumeValue}>{totalSalaire.toFixed(0)}€</Text>
          <Text style={styles.resumeLabel}>brut total</Text>
        </View>
        <View style={styles.resumeItem}>
          <Text style={styles.resumeValue}>{contrats.length}</Text>
          <Text style={styles.resumeLabel}>contrats</Text>
        </View>
      </View>

      {formulaireOuvert ? (
        <View style={styles.formulaire}>
          <TextInput
            testID="input-employeur"
            style={[styles.input, erreurs.employeur && styles.inputErreur]}
            placeholder="Employeur"
            value={employeur}
            onChangeText={(v) => { setEmployeur(v); setErreurs((e) => ({ ...e, employeur: false })); }}
          />
          <View style={styles.row}>
            {Platform.OS === "web" ? (
              <>
                <input
                  type="date"
                  value={dateDebut ? formatDateISO(dateDebut) : ""}
                  max={dateFin ? formatDateISO(dateFin) : undefined}
                  onChange={(e) => {
                    const d = e.target.value ? new Date(e.target.value + "T00:00:00") : undefined;
                    if (d) setDateDebutSafe(d);
                    else setDateDebut(undefined);
                  }}
                  style={{
                    ...webDateInputStyle,
                    ...(erreurs.dateDebut && { borderColor: COULEUR_ERREUR }),
                  }}
                />
                <input
                  type="date"
                  value={dateFin ? formatDateISO(dateFin) : ""}
                  min={dateDebut ? formatDateISO(dateDebut) : undefined}
                  onChange={(e) => {
                    const d = e.target.value ? new Date(e.target.value + "T00:00:00") : undefined;
                    if (d) setDateFinSafe(d);
                    else setDateFin(undefined);
                  }}
                  style={{
                    ...webDateInputStyle,
                    ...(erreurs.dateFin && { borderColor: COULEUR_ERREUR }),
                  }}
                />
              </>
            ) : (
              <>
                <Pressable
                  testID="input-date-debut"
                  style={[styles.input, styles.inputHalf, erreurs.dateDebut && styles.inputErreur]}
                  onPress={() => setShowPickerDebut(true)}
                >
                  <Text style={dateDebut ? styles.dateText : styles.datePlaceholder}>
                    {dateDebut ? formatDate(dateDebut) : "Date début"}
                  </Text>
                </Pressable>
                <Pressable
                  testID="input-date-fin"
                  style={[styles.input, styles.inputHalf, erreurs.dateFin && styles.inputErreur]}
                  onPress={() => setShowPickerFin(true)}
                >
                  <Text style={dateFin ? styles.dateText : styles.datePlaceholder}>
                    {dateFin ? formatDate(dateFin) : "Date fin"}
                  </Text>
                </Pressable>
              </>
            )}
          </View>
          {erreurMois && (
            <Text testID="erreur-mois" style={styles.erreurMois}>{erreurMois}</Text>
          )}
          {Platform.OS !== "web" && showPickerDebut && (
            <DateTimePicker
              testID="picker-debut"
              value={dateDebut ?? new Date()}
              mode="date"
              display="default"
              maximumDate={dateFin}
              onChange={onChangeDateDebut}
            />
          )}
          {Platform.OS !== "web" && showPickerFin && (
            <DateTimePicker
              testID="picker-fin"
              value={dateFin ?? new Date()}
              mode="date"
              display="default"
              minimumDate={dateDebut}
              onChange={onChangeDateFin}
            />
          )}
          <View style={styles.row}>
            <TextInput
              testID="input-heures"
              style={[styles.input, styles.inputHalf, erreurs.heures && styles.inputErreur]}
              placeholder="Heures"
              value={heures}
              onChangeText={(v) => { setHeures(v); setErreurs((e) => ({ ...e, heures: false })); }}
              keyboardType="numeric"
            />
            <TextInput
              testID="input-salaire-brut"
              style={[styles.input, styles.inputHalf, erreurs.salaireBrut && styles.inputErreur]}
              placeholder="Salaire brut (€)"
              value={salaireBrut}
              onChangeText={(v) => { setSalaireBrut(v); setErreurs((e) => ({ ...e, salaireBrut: false })); }}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.row}>
            <Pressable
              style={styles.btnAnnuler}
              onPress={reinitialiserFormulaire}
            >
              <Text style={styles.btnAnnulerText}>Annuler</Text>
            </Pressable>
            <Pressable style={styles.btnAjouter} onPress={handleValider}>
              <Text style={styles.btnAjouterText}>
                {contratEnEdition ? "Modifier" : "Ajouter"}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          style={styles.btnOuvrir}
          onPress={() => setFormulaireOuvert(true)}
        >
          <Text style={styles.btnOuvrirText}>+ Nouveau contrat</Text>
        </Pressable>
      )}

      {contratsPasses.length > 0 && (
        <Pressable
          style={styles.btnTogglePasses}
          onPress={() => setAfficherPasses(!afficherPasses)}
        >
          <Text style={styles.btnTogglePassesText}>
            {afficherPasses
              ? `Masquer les contrats passés (${contratsPasses.length})`
              : `Afficher les contrats passés (${contratsPasses.length})`}
          </Text>
        </Pressable>
      )}

      <FlatList
        data={contratsAffiches}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.liste}
        ListEmptyComponent={
          <Text style={styles.vide}>
            {contrats.length === 0
              ? "Aucun contrat. Ajoute ton premier contrat !"
              : "Aucun contrat en cours. Utilise le bouton ci-dessus pour afficher les contrats passés."}
          </Text>
        }
        renderItem={({ item }) => (
            <View testID={`contrat-${item.id}`} style={[styles.contratCard, item.passe && styles.contratCardPasse]}>
              <View style={styles.contratHeader}>
                <View style={styles.contratTitre}>
                  <Text testID={`employeur-${item.id}`} style={[styles.contratEmployeur, item.passe && styles.contratTextPasse]}>
                    {item.employeur}
                  </Text>
                  {item.passe && (
                    <View style={styles.badgePasse}>
                      <Text style={styles.badgePasseText}>Passé</Text>
                    </View>
                  )}
                </View>
                <View style={styles.contratActions}>
                  <Pressable onPress={() => lancerEdition(item)}>
                    <Text style={styles.modifier}>✎</Text>
                  </Pressable>
                  <Pressable onPress={() => confirmerSuppression(item)}>
                    <Text style={styles.supprimer}>✕</Text>
                  </Pressable>
                </View>
              </View>
              <Text style={[styles.contratDates, item.passe && styles.contratTextPasse]}>
                {item.dateDebut} → {item.dateFin}
              </Text>
              <View style={styles.contratDetails}>
                <Text style={[styles.contratDetail, item.passe && styles.contratDetailPasse]}>
                  {item.heures}h
                </Text>
                <Text style={[styles.contratDetail, item.passe && styles.contratDetailPasse]}>
                  {item.salaireBrut}€ brut
                </Text>
              </View>
            </View>
          )}
      />
    </KeyboardAvoidingView>
  );
}

const webDateInputStyle: React.CSSProperties = {
  flex: 1,
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  padding: 12,
  marginBottom: 8,
  fontSize: 16,
  backgroundColor: "#f8fafc",
  fontFamily: "inherit",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  resume: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#2563eb",
  },
  resumeItem: {
    alignItems: "center",
  },
  resumeValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  resumeLabel: {
    fontSize: 12,
    color: "#bfdbfe",
  },
  formulaire: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: "#f8fafc",
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  inputHalf: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    color: "#1e293b",
  },
  datePlaceholder: {
    fontSize: 16,
    color: "#94a3b8",
  },
  btnAjouter: {
    flex: 1,
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnAjouterText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  btnAnnuler: {
    flex: 1,
    backgroundColor: "#e2e8f0",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnAnnulerText: {
    color: "#64748b",
    fontWeight: "bold",
    fontSize: 16,
  },
  btnOuvrir: {
    margin: 16,
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnOuvrirText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  liste: {
    padding: 16,
  },
  vide: {
    textAlign: "center",
    color: "#94a3b8",
    marginTop: 40,
    fontSize: 16,
  },
  contratCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  contratHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contratEmployeur: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
  },
  supprimer: {
    fontSize: 18,
    color: "#ef4444",
    padding: 4,
  },
  contratDates: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  contratDetails: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  contratDetail: {
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "600",
  },
  btnTogglePasses: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
  },
  btnTogglePassesText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  contratCardPasse: {
    opacity: 0.6,
    borderLeftWidth: 3,
    borderLeftColor: "#94a3b8",
  },
  contratTitre: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  contratTextPasse: {
    color: "#94a3b8",
  },
  badgePasse: {
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgePasseText: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "600",
  },
  contratDetailPasse: {
    color: "#94a3b8",
  },
  contratActions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  modifier: {
    fontSize: 18,
    color: "#2563eb",
    padding: 4,
  },
  inputErreur: {
    borderColor: COULEUR_ERREUR,
  },
  erreurMois: {
    color: COULEUR_ERREUR,
    fontSize: 13,
    marginBottom: 8,
  },
});

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useContrats } from "../../contexts/ContratsContext";
import { useProfil } from "../../contexts/ProfilContext";
import { Annexe } from "../../types/profil";
import { formatDate, parseDate } from "../../utils/date";

export default function AccueilScreen() {
  const { contrats } = useContrats();
  const { profil, mettreAJourProfil } = useProfil();

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

  const totalHeures = contrats.reduce((sum, c) => sum + c.heures, 0);
  const totalSalaire = contrats.reduce((sum, c) => sum + c.salaireBrut, 0);
  const progression = Math.min((totalHeures / 507) * 100, 100);

  const ouvrirFormulaire = () => {
    if (profil) {
      setAnnexe(profil.annexe);
      setDateAnniversaire(parseDate(profil.dateAnniversaire));
      setSalaireReference(profil.salaireReference.toString());
      setHeuresTravaillees(profil.heuresTravaillees.toString());
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
      <Text style={styles.title}>Intermittence</Text>
      <Text style={styles.subtitle}>Simulateur ARE</Text>

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
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Salaire brut cumulé</Text>
        <Text style={styles.cardValue}>{totalSalaire.toFixed(0)} €</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Contrats enregistrés</Text>
        <Text style={styles.cardValue}>{contrats.length}</Text>
      </View>

      {formulaireOuvert ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mon profil intermittent</Text>

          <Text style={styles.label}>Annexe</Text>
          <View style={styles.row}>
            <Pressable
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
            style={styles.input}
            placeholder="Ex : 18000"
            value={salaireReference}
            onChangeText={setSalaireReference}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Heures travaillées</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex : 600"
            value={heuresTravaillees}
            onChangeText={setHeuresTravaillees}
            keyboardType="numeric"
          />

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
      ) : (
        <Pressable style={styles.profilBtn} onPress={ouvrirFormulaire}>
          {profil ? (
            <View>
              <Text style={styles.profilBtnTitle}>Mon profil</Text>
              <Text style={styles.profilResume}>
                Annexe {profil.annexe} — {profil.heuresTravaillees}h —{" "}
                {profil.salaireReference.toFixed(0)} € — Anniversaire :{" "}
                {profil.dateAnniversaire}
              </Text>
            </View>
          ) : (
            <Text style={styles.profilBtnTitle}>
              Configurer mon profil
            </Text>
          )}
        </Pressable>
      )}
    </ScrollView>
  );
}

const webDateInputStyle: React.CSSProperties = {
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  padding: 12,
  marginBottom: 8,
  fontSize: 16,
  backgroundColor: "#f8fafc",
  fontFamily: "inherit",
  width: "100%",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
  },
  cardHint: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 8,
  },
  barreContainer: {
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    marginTop: 12,
    overflow: "hidden",
  },
  barre: {
    height: "100%",
    backgroundColor: "#2563eb",
    borderRadius: 4,
  },
  profilBtn: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
  },
  profilBtnTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  profilResume: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    color: "#1e293b",
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
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
    marginTop: 8,
  },
  annexeBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    alignItems: "center",
  },
  annexeBtnActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  annexeBtnText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "600",
  },
  annexeBtnTextActive: {
    color: "#fff",
  },
  dateText: {
    fontSize: 16,
    color: "#1e293b",
  },
  datePlaceholder: {
    fontSize: 16,
    color: "#94a3b8",
  },
  btnValider: {
    flex: 1,
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnValiderText: {
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
});

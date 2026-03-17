import { useState } from "react";
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
import { useContrats } from "../../contexts/ContratsContext";
import { useProfil } from "../../contexts/ProfilContext";
import { useDonneesTest } from "../../contexts/DonneesTestContext";
import { Annexe } from "../../types/profil";
import { formatDate, parseDate } from "../../utils/date";
import { calculerAJ } from "../../utils/calculerAJ";
import { styles, webDateInputStyle } from "../../styles/tabs/index.styles";

export default function AccueilScreen() {
  const { contrats } = useContrats();
  const { profil, mettreAJourProfil } = useProfil();
  const { chargerDonneesTest } = useDonneesTest();

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
        <Text testID="contrats-count" style={styles.cardValue}>{contrats.length}</Text>
      </View>

      {profil && !formulaireOuvert && (
        <Pressable testID="aj-card" style={styles.ajCard} onPress={ouvrirFormulaire}>
          <Text style={styles.ajLabel}>Indemnité journalière estimée</Text>
          <Text testID="aj-value" style={styles.ajValue}>
            {calculerAJ(
              profil.annexe,
              profil.salaireReference,
              profil.heuresTravaillees
            ).toFixed(2)}{" "}
            €/jour
          </Text>
          <Text style={styles.ajDetail}>
            Annexe {profil.annexe} — {profil.heuresTravaillees}h —{" "}
            {profil.salaireReference.toFixed(0)} € — Anniversaire :{" "}
            {profil.dateAnniversaire}
          </Text>
        </Pressable>
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

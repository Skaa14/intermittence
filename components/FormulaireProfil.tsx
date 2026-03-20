import { useState } from "react";
import { View, Text, TextInput, Pressable, Platform } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { ProfilIntermittent, ProfilSansId, Annexe, TauxCSG } from "../types/profil";
import { formatDate, parseDate } from "../utils/date";
import { creerProfilArtiste, creerProfilTechnicien, TypeDonneesTest } from "../utils/donneesTest";
import { styles, webDateInputStyle } from "./FormulaireProfil.styles";

interface FormulaireProfilProps {
  profilInitial?: ProfilIntermittent;
  onValider: (profil: ProfilSansId, donneesTest?: TypeDonneesTest) => void | Promise<void>;
  onAnnuler?: () => void;
}

export default function FormulaireProfil({
  profilInitial,
  onValider,
  onAnnuler,
}: FormulaireProfilProps) {
  const [nom, setNom] = useState(profilInitial?.nom ?? "");
  const [annexe, setAnnexe] = useState<Annexe>(profilInitial?.annexe ?? "8");
  const [aOuvertDroits, setAOuvertDroits] = useState(profilInitial?.aOuvertDroits ?? true);
  const [dateAnniversaire, setDateAnniversaire] = useState<Date | undefined>(
    profilInitial?.dateAnniversaire ? parseDate(profilInitial.dateAnniversaire) : undefined
  );
  const [showPicker, setShowPicker] = useState(false);
  const [salaireReference, setSalaireReference] = useState(
    profilInitial?.salaireReference != null ? profilInitial.salaireReference.toString() : ""
  );
  const [heuresTravaillees, setHeuresTravaillees] = useState(
    profilInitial?.heuresTravaillees != null ? profilInitial.heuresTravaillees.toString() : ""
  );
  const [tauxCSG, setTauxCSG] = useState<TauxCSG>(profilInitial?.tauxCSG ?? "standard");
  const [alsaceMoselle, setAlsaceMoselle] = useState(profilInitial?.alsaceMoselle ?? false);

  const estCreation = !profilInitial;
  const nomValide = nom.trim().length > 0;

  const appliquerDonneesTest = async (type: TypeDonneesTest) => {
    const profil = type === "artiste" ? creerProfilArtiste() : creerProfilTechnicien();
    const { id: _, ...sanId } = profil;
    await onValider(sanId, type);
  };

  const handleValider = () => {
    if (!nomValide) return;

    const base = { nom: nom.trim(), annexe, tauxCSG, alsaceMoselle };

    if (aOuvertDroits) {
      const salaire = Number(salaireReference);
      const heures = Number(heuresTravaillees);
      if (!dateAnniversaire || isNaN(salaire) || isNaN(heures)) return;

      onValider({
        ...base,
        aOuvertDroits: true,
        dateAnniversaire: formatDate(dateAnniversaire),
        salaireReference: salaire,
        heuresTravaillees: heures,
      });
    } else {
      onValider({ ...base, aOuvertDroits: false });
    }
  };

  const onChangeDateAnniversaire = (
    _event: DateTimePickerEvent,
    date?: Date
  ) => {
    setShowPicker(Platform.OS === "ios");
    if (date) setDateAnniversaire(date);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon profil intermittent</Text>

      {estCreation && (
        <View style={styles.demoRow}>
          <Text style={styles.demoHint}>Charger un profil de test :</Text>
          <View style={styles.demoBtns}>
            <Pressable
              testID="btn-test-artiste"
              style={styles.demoBtn}
              onPress={() => appliquerDonneesTest("artiste")}
            >
              <Text style={styles.demoBtnLabel}>Artiste</Text>
              <Text style={styles.demoBtnSub}>Anx. 10</Text>
            </Pressable>
            <Pressable
              testID="btn-test-technicien"
              style={styles.demoBtn}
              onPress={() => appliquerDonneesTest("technicien")}
            >
              <Text style={styles.demoBtnLabel}>Technicien</Text>
              <Text style={styles.demoBtnSub}>Anx. 8</Text>
            </Pressable>
          </View>
        </View>
      )}

      <Text style={styles.label}>Nom du profil</Text>
      <TextInput
        testID="input-nom-profil"
        style={styles.input}
        placeholder="Ex : Jean"
        value={nom}
        onChangeText={setNom}
      />

      <Text style={styles.label}>Annexe</Text>
      <View style={styles.row}>
        <Pressable
          testID="btn-annexe-8"
          style={[styles.annexeBtn, annexe === "8" && styles.annexeBtnActive]}
          onPress={() => setAnnexe("8")}
        >
          <Text style={[styles.annexeBtnText, annexe === "8" && styles.annexeBtnTextActive]}>
            Annexe 8 — Technicien
          </Text>
        </Pressable>
        <Pressable
          testID="btn-annexe-10"
          style={[styles.annexeBtn, annexe === "10" && styles.annexeBtnActive]}
          onPress={() => setAnnexe("10")}
        >
          <Text style={[styles.annexeBtnText, annexe === "10" && styles.annexeBtnTextActive]}>
            Annexe 10 — Artiste
          </Text>
        </Pressable>
      </View>

      <Pressable
        testID="btn-a-ouvert-droits"
        style={styles.checkboxRow}
        onPress={() => setAOuvertDroits(!aOuvertDroits)}
      >
        <View style={[styles.checkbox, aOuvertDroits && styles.checkboxActive]}>
          {aOuvertDroits && <Text style={styles.checkboxCheck}>✓</Text>}
        </View>
        <Text style={styles.checkboxLabel}>J'ai déjà ouvert mes droits ARE</Text>
      </Pressable>

      {aOuvertDroits && (
        <>
          <Text style={styles.label}>Date anniversaire</Text>
          {Platform.OS === "web" ? (
            <input
              type="date"
              value={dateAnniversaire ? dateAnniversaire.toISOString().slice(0, 10) : ""}
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
                <Text style={dateAnniversaire ? styles.dateText : styles.datePlaceholder}>
                  {dateAnniversaire ? formatDate(dateAnniversaire) : "Sélectionner une date"}
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
        </>
      )}

      <Text style={styles.label}>Taux CSG</Text>
      <View style={styles.row}>
        <Pressable
          testID="btn-csg-standard"
          style={[styles.annexeBtn, tauxCSG === "standard" && styles.annexeBtnActive]}
          onPress={() => setTauxCSG("standard")}
        >
          <Text style={[styles.annexeBtnText, tauxCSG === "standard" && styles.annexeBtnTextActive]}>
            Standard (6,2%)
          </Text>
        </Pressable>
        <Pressable
          testID="btn-csg-reduit"
          style={[styles.annexeBtn, tauxCSG === "reduit" && styles.annexeBtnActive]}
          onPress={() => setTauxCSG("reduit")}
        >
          <Text style={[styles.annexeBtnText, tauxCSG === "reduit" && styles.annexeBtnTextActive]}>
            Réduit (3,8%)
          </Text>
        </Pressable>
      </View>

      <Pressable
        testID="btn-alsace-moselle"
        style={styles.checkboxRow}
        onPress={() => setAlsaceMoselle(!alsaceMoselle)}
      >
        <View style={[styles.checkbox, alsaceMoselle && styles.checkboxActive]}>
          {alsaceMoselle && <Text style={styles.checkboxCheck}>✓</Text>}
        </View>
        <Text style={styles.checkboxLabel}>Régime Alsace-Moselle (+1,5%)</Text>
      </Pressable>

      <View style={styles.row}>
        {onAnnuler && (
          <Pressable style={styles.btnAnnuler} onPress={onAnnuler}>
            <Text style={styles.btnAnnulerText}>Annuler</Text>
          </Pressable>
        )}
        <Pressable
          testID="btn-valider-profil"
          style={[styles.btnValider, !onAnnuler && styles.btnValiderFull, !nomValide && styles.btnValiderDisabled]}
          onPress={handleValider}
          disabled={!nomValide}
        >
          <Text style={styles.btnValiderText}>Valider</Text>
        </Pressable>
      </View>
    </View>
  );
}

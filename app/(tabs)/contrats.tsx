import { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useContrats } from "../../contexts/ContratsContext";
import { useProfil } from "../../contexts/ProfilContext";
import { useFormations } from "../../contexts/FormationsContext";
import { Contrat, TypeHeures } from "../../types/contrat";
import { Formation, OptionFormation } from "../../types/formation";
import { formatDate, parseDate } from "../../utils/date";
import { formatRangeCourt } from "../../utils/formatDateCourt";
import { formaterHeures } from "../../utils/formatHeures";
import { PLAFOND_HEURES_FORMATION } from "../../utils/reglementation";
import DateRangePicker from "../../components/DateRangePicker";
import {
  styles,
  addIconColor,
  placeholderColor,
  contratIconColor,
  formationIconColor,
} from "../../styles/tabs/contrats.styles";

type ContratAvecStatut = Contrat & { passe: boolean };
type ChampContrat = "employeur" | "dateDebut" | "dateFin" | "heures" | "salaireBrut";
type ChampFormation = "intitule" | "dateDebut" | "dateFin" | "heures";
type TypeSaisie = "contrat" | "formation";

type ElementListe =
  | { kind: "contrat"; data: ContratAvecStatut }
  | { kind: "formation"; data: Formation };

const isContratPasse = (contrat: Contrat): boolean => {
  const fin = parseDate(contrat.dateFin);
  if (!fin) return false;
  const aujourdhui = new Date();
  aujourdhui.setHours(0, 0, 0, 0);
  return fin.getTime() < aujourdhui.getTime();
};

export default function ContratsScreen() {
  const { contrats, ajouterContrat, modifierContrat, supprimerContrat } = useContrats();
  const { profil } = useProfil();
  const { formations, ajouterFormation, modifierFormation, supprimerFormation } = useFormations();
  const estAnnexe10 = profil?.annexe === "10";

  const [typeSaisie, setTypeSaisie] = useState<TypeSaisie>("contrat");
  const [employeur, setEmployeur] = useState("");
  const [intitule, setIntitule] = useState("");
  const [dateDebut, setDateDebut] = useState<Date | undefined>();
  const [dateFin, setDateFin] = useState<Date | undefined>();
  const [typeHeures, setTypeHeures] = useState<TypeHeures>("heures");
  const [heures, setHeures] = useState("");
  const [salaireBrut, setSalaireBrut] = useState("");
  const [optionFormation, setOptionFormation] = useState<OptionFormation>("compterHeures");
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [afficherPasses, setAfficherPasses] = useState(false);
  const [contratEnEdition, setContratEnEdition] = useState<string | null>(null);
  const [formationEnEdition, setFormationEnEdition] = useState<string | null>(null);
  const [erreurs, setErreurs] = useState<Partial<Record<ChampContrat | ChampFormation, boolean>>>({});
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

  const elements: ElementListe[] = useMemo(() => {
    const items: ElementListe[] = [];
    const contratsAffiches = afficherPasses
      ? [...contratsActifs, ...contratsPasses]
      : contratsActifs;
    for (const c of contratsAffiches) items.push({ kind: "contrat", data: c });
    for (const f of formations) items.push({ kind: "formation", data: f });
    items.sort((a, b) => {
      const da = parseDate(a.data.dateDebut);
      const db = parseDate(b.data.dateDebut);
      if (!da || !db) return 0;
      return da.getTime() - db.getTime();
    });
    return items;
  }, [contratsActifs, contratsPasses, formations, afficherPasses]);

  const reinitialiserFormulaire = () => {
    setEmployeur("");
    setIntitule("");
    setDateDebut(undefined);
    setDateFin(undefined);
    setTypeHeures("heures");
    setHeures("");
    setSalaireBrut("");
    setOptionFormation("compterHeures");
    setContratEnEdition(null);
    setFormationEnEdition(null);
    setFormulaireOuvert(false);
    setShowDatePicker(false);
    setErreurs({});
    setErreurMois(null);
  };

  const lancerEdition = (contrat: Contrat) => {
    const type = contrat.type ?? "heures";
    setTypeSaisie("contrat");
    setEmployeur(contrat.employeur);
    setDateDebut(parseDate(contrat.dateDebut));
    setDateFin(parseDate(contrat.dateFin));
    setTypeHeures(type);
    setHeures(type === "cachets" ? (contrat.heures / 12).toString() : contrat.heures.toString());
    setSalaireBrut(contrat.salaireBrut.toString());
    setContratEnEdition(contrat.id);
    setFormationEnEdition(null);
    setFormulaireOuvert(true);
  };

  const lancerEditionFormation = (formation: Formation) => {
    setTypeSaisie("formation");
    setIntitule(formation.intitule);
    setDateDebut(parseDate(formation.dateDebut));
    setDateFin(parseDate(formation.dateFin));
    setHeures(formation.heures.toString());
    setOptionFormation(formation.option);
    setFormationEnEdition(formation.id);
    setContratEnEdition(null);
    setFormulaireOuvert(true);
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

  const confirmerSuppressionFormation = (formation: Formation) => {
    if (Platform.OS === "web") {
      if (
        typeof window !== "undefined" &&
        window.confirm(
          `Supprimer la formation ${formation.intitule} — ${formation.dateDebut} → ${formation.dateFin} ?`
        )
      ) {
        supprimerFormation(formation.id);
      }
    } else {
      Alert.alert(
        "Supprimer cette formation ?",
        `${formation.intitule} — ${formation.dateDebut} → ${formation.dateFin}`,
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Supprimer",
            style: "destructive",
            onPress: () => supprimerFormation(formation.id),
          },
        ],
      );
    }
  };

  const handleValiderContrat = () => {
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

    const valeurSaisie = parseFloat(heures);
    const donnees = {
      employeur,
      dateDebut: formatDate(dateDebut!),
      dateFin: formatDate(dateFin!),
      heures: typeHeures === "cachets" ? valeurSaisie * 12 : valeurSaisie,
      salaireBrut: parseFloat(salaireBrut),
      type: typeHeures,
    };

    if (contratEnEdition) {
      modifierContrat(contratEnEdition, donnees);
    } else {
      ajouterContrat(donnees);
    }

    reinitialiserFormulaire();
  };

  const handleValiderFormation = () => {
    const nouvellesErreurs: Record<string, boolean> = {
      intitule: !intitule,
      dateDebut: !dateDebut,
      dateFin: !dateFin,
      heures: !heures,
    };
    setErreurs(nouvellesErreurs);

    if (Object.values(nouvellesErreurs).some(Boolean)) return;

    const donnees = {
      intitule,
      dateDebut: formatDate(dateDebut!),
      dateFin: formatDate(dateFin!),
      heures: parseFloat(heures),
      option: optionFormation,
    };

    if (formationEnEdition) {
      modifierFormation(formationEnEdition, donnees);
    } else {
      ajouterFormation(donnees);
    }

    reinitialiserFormulaire();
  };

  const handleValider = () => {
    if (typeSaisie === "formation") handleValiderFormation();
    else handleValiderContrat();
  };

  const handleDateRangeConfirm = (debut: Date, fin: Date) => {
    setDateDebut(debut);
    setDateFin(fin);
    setErreurs((e) => ({ ...e, dateDebut: false, dateFin: false }));
    setErreurMois(null);
    setShowDatePicker(false);
  };

  const renderDateField = () => {
    const hasDate = dateDebut && dateFin;
    const hasError = erreurs.dateDebut || erreurs.dateFin;

    return (
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Période</Text>
        <Pressable
          testID="input-date-range"
          style={[styles.input, hasError && styles.inputErreur]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={hasDate ? styles.dateText : styles.datePlaceholder}>
            {hasDate ? formatRangeCourt(dateDebut, dateFin) : "Sélectionner les dates"}
          </Text>
          <Ionicons name="calendar-outline" size={20} color={placeholderColor} />
        </Pressable>
        {erreurMois && (
          <Text testID="erreur-mois" style={styles.erreurMois}>{erreurMois}</Text>
        )}
      </View>
    );
  };

  const renderFormulaireContrat = () => (
    <>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Employeur</Text>
        <TextInput
          testID="input-employeur"
          style={[styles.input, erreurs.employeur && styles.inputErreur]}
          value={employeur}
          onChangeText={(v) => { setEmployeur(v); setErreurs((e) => ({ ...e, employeur: false })); }}
        />
      </View>
      {renderDateField()}
      {estAnnexe10 && (
        <View testID="toggle-type-heures" style={styles.toggleRow}>
          <Pressable
            testID="toggle-heures"
            style={[styles.toggleBtn, typeHeures === "heures" && styles.toggleBtnActif]}
            onPress={() => { setTypeHeures("heures"); setHeures(""); }}
          >
            <Text style={[styles.toggleBtnText, typeHeures === "heures" && styles.toggleBtnTextActif]}>
              Heures
            </Text>
          </Pressable>
          <Pressable
            testID="toggle-cachets"
            style={[styles.toggleBtn, typeHeures === "cachets" && styles.toggleBtnActif]}
            onPress={() => { setTypeHeures("cachets"); setHeures("1"); }}
          >
            <Text style={[styles.toggleBtnText, typeHeures === "cachets" && styles.toggleBtnTextActif]}>
              Cachets
            </Text>
          </Pressable>
        </View>
      )}
      <View style={styles.row}>
        <View style={[styles.fieldGroup, styles.inputHalf]}>
          <Text style={styles.label}>
            {typeHeures === "cachets" ? "Cachets" : "Heures"}
          </Text>
          {typeHeures === "cachets" ? (
            <View style={styles.stepperRow}>
              <Pressable
                testID="btn-moins-cachets"
                style={[styles.stepperBtn, styles.stepperBtnLeft]}
                onPress={() => {
                  const v = Math.max(1, (parseInt(heures, 10) || 1) - 1);
                  setHeures(v.toString());
                  setErreurs((e) => ({ ...e, heures: false }));
                }}
              >
                <Text style={styles.stepperBtnText}>−</Text>
              </Pressable>
              <TextInput
                testID="input-heures"
                style={[styles.input, styles.inputStepper, erreurs.heures && styles.inputErreur]}
                value={heures}
                onChangeText={(v) => { setHeures(v); setErreurs((e) => ({ ...e, heures: false })); }}
                keyboardType="numeric"
              />
              <Pressable
                testID="btn-plus-cachets"
                style={[styles.stepperBtn, styles.stepperBtnRight]}
                onPress={() => {
                  const v = (parseInt(heures, 10) || 0) + 1;
                  setHeures(v.toString());
                  setErreurs((e) => ({ ...e, heures: false }));
                }}
              >
                <Text style={styles.stepperBtnText}>+</Text>
              </Pressable>
            </View>
          ) : (
            <TextInput
              testID="input-heures"
              style={[styles.input, erreurs.heures && styles.inputErreur]}
              value={heures}
              onChangeText={(v) => { setHeures(v); setErreurs((e) => ({ ...e, heures: false })); }}
              keyboardType="numeric"
            />
          )}
        </View>
        <View style={[styles.fieldGroup, styles.inputHalf]}>
          <Text style={styles.label}>Salaire brut (€)</Text>
          <TextInput
            testID="input-salaire-brut"
            style={[styles.input, erreurs.salaireBrut && styles.inputErreur]}
            value={salaireBrut}
            onChangeText={(v) => { setSalaireBrut(v); setErreurs((e) => ({ ...e, salaireBrut: false })); }}
            keyboardType="numeric"
          />
        </View>
      </View>
    </>
  );

  const renderFormulaireFormation = () => (
    <>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Intitulé de la formation</Text>
        <TextInput
          testID="input-intitule"
          style={[styles.input, erreurs.intitule && styles.inputErreur]}
          value={intitule}
          onChangeText={(v) => { setIntitule(v); setErreurs((e) => ({ ...e, intitule: false })); }}
        />
      </View>
      {renderDateField()}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Nombre d'heures</Text>
        <TextInput
          testID="input-heures-formation"
          style={[styles.input, erreurs.heures && styles.inputErreur]}
          value={heures}
          onChangeText={(v) => { setHeures(v); setErreurs((e) => ({ ...e, heures: false })); }}
          keyboardType="numeric"
        />
      </View>
      <View testID="toggle-option-formation" style={styles.toggleRow}>
        <Pressable
          testID="toggle-compter-heures"
          style={[styles.toggleBtn, optionFormation === "compterHeures" && styles.toggleBtnActif]}
          onPress={() => setOptionFormation("compterHeures")}
        >
          <Text style={[styles.toggleBtnText, optionFormation === "compterHeures" && styles.toggleBtnTextActif]}>
            Compter les heures
          </Text>
        </Pressable>
        <Pressable
          testID="toggle-garder-are"
          style={[styles.toggleBtn, optionFormation === "garderARE" && styles.toggleBtnActif]}
          onPress={() => setOptionFormation("garderARE")}
        >
          <Text style={[styles.toggleBtnText, optionFormation === "garderARE" && styles.toggleBtnTextActif]}>
            Garder l'ARE
          </Text>
        </Pressable>
      </View>
      <Text style={styles.optionHint}>
        {optionFormation === "compterHeures"
          ? `Les heures comptent pour les 507h (plafond ${PLAFOND_HEURES_FORMATION}h). Pas d'ARE pendant la formation.`
          : "L'ARE est maintenue. Les heures ne comptent pas pour les 507h."}
      </Text>
    </>
  );

  const renderElement = ({ item }: { item: ElementListe }) => {
    if (item.kind === "contrat") {
      const c = item.data;
      return (
        <View testID={`contrat-${c.id}`} style={[styles.contratCard, c.passe && styles.contratCardPasse]}>
          <View style={styles.contratHeader}>
            <View style={styles.contratTitre}>
              <Ionicons name="document-text" size={16} color={c.passe ? placeholderColor : contratIconColor} />
              <Text testID={`employeur-${c.id}`} style={[styles.contratEmployeur, c.passe && styles.contratTextPasse]}>
                {c.employeur}
              </Text>
              {c.passe && (
                <View style={styles.badgePasse}>
                  <Text style={styles.badgePasseText}>Passé</Text>
                </View>
              )}
            </View>
            <View style={styles.contratActions}>
              <Pressable onPress={() => lancerEdition(c)}>
                <Text style={styles.modifier}>✎</Text>
              </Pressable>
              <Pressable onPress={() => confirmerSuppression(c)}>
                <Text style={styles.supprimer}>✕</Text>
              </Pressable>
            </View>
          </View>
          <Text style={[styles.contratDates, c.passe && styles.contratTextPasse]}>
            {c.dateDebut} → {c.dateFin}
          </Text>
          <View style={styles.contratDetails}>
            <Text testID={`heures-${c.id}`} style={[styles.contratDetail, c.passe && styles.contratDetailPasse]}>
              {formaterHeures(c)}
            </Text>
            <Text style={[styles.contratDetail, c.passe && styles.contratDetailPasse]}>
              {c.salaireBrut}€ brut
            </Text>
          </View>
        </View>
      );
    }

    const f = item.data;
    return (
      <View testID={`formation-${f.id}`} style={[styles.contratCard, styles.formationCard]}>
        <View style={styles.contratHeader}>
          <View style={styles.contratTitre}>
            <Ionicons name="school" size={16} color={formationIconColor} />
            <Text style={styles.contratEmployeur}>{f.intitule}</Text>
            <View style={styles.badgeFormation}>
              <Text style={styles.badgeFormationText}>Formation</Text>
            </View>
          </View>
          <View style={styles.contratActions}>
            <Pressable onPress={() => lancerEditionFormation(f)}>
              <Text style={styles.modifier}>✎</Text>
            </Pressable>
            <Pressable onPress={() => confirmerSuppressionFormation(f)}>
              <Text style={styles.supprimer}>✕</Text>
            </Pressable>
          </View>
        </View>
        <Text style={styles.contratDates}>
          {f.dateDebut} → {f.dateFin}
        </Text>
        <View style={styles.contratDetails}>
          <Text style={styles.contratDetail}>{f.heures}h</Text>
          <Text style={styles.formationOption}>
            {f.option === "compterHeures" ? "Heures comptées" : "ARE maintenue"}
          </Text>
        </View>
      </View>
    );
  };

  if (showDatePicker) {
    return (
      <DateRangePicker
        initialStart={dateDebut}
        initialEnd={dateFin}
        onConfirm={handleDateRangeConfirm}
        onCancel={() => setShowDatePicker(false)}
      />
    );
  }

  if (formulaireOuvert) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={styles.formulaire} contentContainerStyle={styles.formulaireContent}>
          {!contratEnEdition && !formationEnEdition && (
            <View testID="toggle-type-saisie" style={[styles.toggleRow, styles.toggleTypeSaisie]}>
              <Pressable
                testID="toggle-saisie-contrat"
                style={[styles.toggleBtn, typeSaisie === "contrat" && styles.toggleBtnActif]}
                onPress={() => setTypeSaisie("contrat")}
              >
                <Text style={[styles.toggleBtnText, typeSaisie === "contrat" && styles.toggleBtnTextActif]}>
                  Contrat
                </Text>
              </Pressable>
              <Pressable
                testID="toggle-saisie-formation"
                style={[styles.toggleBtn, typeSaisie === "formation" && styles.toggleBtnActif]}
                onPress={() => setTypeSaisie("formation")}
              >
                <Text style={[styles.toggleBtnText, typeSaisie === "formation" && styles.toggleBtnTextActif]}>
                  Formation
                </Text>
              </Pressable>
            </View>
          )}
          {typeSaisie === "contrat" ? renderFormulaireContrat() : renderFormulaireFormation()}
        </ScrollView>
        <View style={styles.formulaireActions}>
          <Pressable
            style={styles.btnAnnuler}
            onPress={reinitialiserFormulaire}
          >
            <Text style={styles.btnAnnulerText}>Annuler</Text>
          </Pressable>
          <Pressable style={styles.btnAjouter} onPress={handleValider}>
            <Text style={styles.btnAjouterText}>
              {contratEnEdition || formationEnEdition ? "Modifier" : "Ajouter"}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonsRow}>
        <Pressable
          testID="btn-ouvrir-formulaire"
          style={styles.btnOuvrir}
          onPress={() => setFormulaireOuvert(true)}
        >
          <Ionicons name="add-circle" size={44} color={addIconColor} />
        </Pressable>
        {contratsPasses.length > 0 && (
          <Pressable
            testID="btn-toggle-passes"
            style={styles.btnTogglePasses}
            onPress={() => setAfficherPasses(!afficherPasses)}
          >
            <Text style={styles.btnTogglePassesText}>
              {afficherPasses
                ? `Masquer passés (${contratsPasses.length})`
                : `Passés (${contratsPasses.length})`}
            </Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={elements}
        keyExtractor={(item) => `${item.kind}-${item.data.id}`}
        contentContainerStyle={styles.liste}
        ListEmptyComponent={
          <Text style={styles.vide}>
            {contrats.length === 0 && formations.length === 0
              ? "Aucun contrat ni formation. Ajoute ton premier contrat !"
              : "Aucun contrat en cours. Utilise le bouton ci-dessus pour afficher les contrats passés."}
          </Text>
        }
        renderItem={renderElement}
      />
    </View>
  );
}

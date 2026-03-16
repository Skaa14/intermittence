import {
  View,
  Text,
  FlatList,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useMemo, useRef, useEffect, useLayoutEffect, useState, useCallback } from "react";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useContrats } from "../../../contexts/ContratsContext";
import { useProfil } from "../../../contexts/ProfilContext";
import {
  calculerIndemnisationMensuelle,
  IndemnisationMensuelle,
} from "../../../utils/calculerIndemnisationMensuelle";
import { styles, pageScrollStyle, backIconColor } from "./[index].styles";

const NOMS_MOIS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

function formatMois(date: Date): string {
  return `${NOMS_MOIS[date.getMonth()]} ${date.getFullYear()}`;
}

function formatEuros(montant: number): string {
  return `${Math.round(montant)} €`;
}

function LigneDetail({
  label,
  valeur,
  testID,
  bold,
}: {
  label: string;
  valeur: string;
  testID?: string;
  bold?: boolean;
}) {
  return (
    <View style={styles.ligne}>
      <Text style={[styles.libelleValeur, bold ? styles.bold : undefined]}>
        {label}
      </Text>
      <Text
        style={[styles.valeur, bold ? styles.boldValeur : undefined]}
        testID={testID}
      >
        {valeur}
      </Text>
    </View>
  );
}

function FormulePlafond({ mois }: { mois: IndemnisationMensuelle }) {
  return (
    <>
      <View style={styles.ligneFormule}>
        <Text style={styles.texteFormulePlafond}>
          {`Plafond ARE : ${formatEuros(mois.plafondMontant)}`}
        </Text>
      </View>
      <View style={styles.ligneFormule}>
        {mois.areVersee > 0 ? (
          <Text style={styles.texteFormulePlafond}>
            {`${formatEuros(mois.plafondMontant)} − ${formatEuros(mois.salaireDuMois)} = ${formatEuros(mois.areVersee)}`}
          </Text>
        ) : (
          <Text style={styles.texteFormulePlafond}>
            {`Salaires (${formatEuros(mois.salaireDuMois)}) > plafond → ARE nulle`}
          </Text>
        )}
      </View>
    </>
  );
}

type PageMoisProps = { mois: IndemnisationMensuelle; width: number; height: number };

function PageMois({ mois, width, height }: PageMoisProps) {
  return (
    <ScrollView
      style={pageScrollStyle(width, height).page}
      contentContainerStyle={styles.pageContent}
      nestedScrollEnabled
      testID={`detail-mois-${mois.index}`}
    >
      <Text style={styles.titreMois}>{formatMois(mois.mois)}</Text>

      <View
        testID={`section-contrats-${mois.index}`}
        style={styles.section}
      >
        <Text style={styles.titreSection}>Contrats</Text>
        {mois.contratsDuMois.length === 0 ? (
          <Text style={styles.vide}>Aucun contrat ce mois-ci</Text>
        ) : (
          mois.contratsDuMois.map((c, i) => (
            <View
              key={c.id}
              testID={`contrat-item-${mois.index}-${i}`}
              style={styles.contratItem}
            >
              <Text style={styles.employeur}>{c.employeur}</Text>
              <View style={styles.contratDetails}>
                <Text style={styles.detailVal}>{formatEuros(c.salaireBrut)}</Text>
                <Text style={styles.detailVal}>{c.heures} h</Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.titreSection}>Décomposition</Text>
        <LigneDetail
          label="Jours calendaires"
          valeur={`${mois.joursCalendaires} j`}
          testID={`jours-calendaires-${mois.index}`}
        />
        <LigneDetail
          label="Jours travaillés"
          valeur={`-${mois.joursTravailles} j`}
          testID={`jours-travailles-${mois.index}`}
        />
        {mois.delaiAttente > 0 && (
          <LigneDetail
            label="Délai d'attente"
            valeur={`-${mois.delaiAttente} j`}
            testID={`delai-attente-${mois.index}`}
          />
        )}
        {mois.franchiseCP > 0 && (
          <LigneDetail
            label="Franchise congés payés"
            valeur={`-${mois.franchiseCP} j`}
            testID={`franchise-cp-${mois.index}`}
          />
        )}
        {mois.franchiseSalaire > 0 && (
          <LigneDetail
            label="Franchise salaire"
            valeur={`-${mois.franchiseSalaire} j`}
            testID={`franchise-salaire-${mois.index}`}
          />
        )}
        <LigneDetail
          label="Jours indemnisés"
          valeur={`${mois.joursIndemnises} j`}
          testID={`jours-indemnises-${mois.index}`}
        />
        {(mois.joursIndemnises > 0 || mois.plafondAtteint) && (
          <>
            <View style={styles.separateur} />
            {mois.joursIndemnises > 0 && (
              <View style={styles.ligneFormule}>
                <Text style={styles.texteFormule}>
                  {`${mois.joursIndemnises} j × ${mois.aj.toFixed(2).replace(".", ",")} €/j = ${mois.areVerseeAvantPlafond} €`}
                </Text>
              </View>
            )}
            {mois.plafondAtteint && <FormulePlafond mois={mois} />}
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.titreSection}>Totaux</Text>
        <LigneDetail
          label="Salaire brut"
          valeur={formatEuros(mois.salaireDuMois)}
          testID={`salaire-brut-${mois.index}`}
        />
        <LigneDetail
          label="ARE versée"
          valeur={formatEuros(mois.areVersee)}
          testID={`are-versee-${mois.index}`}
        />
        <LigneDetail
          label="Total reçu"
          valeur={formatEuros(mois.totalRecu)}
          testID={`total-recu-${mois.index}`}
          bold
        />
      </View>
    </ScrollView>
  );
}

export default function DetailMoisScreen() {
  const { width: pageWidth, height: windowHeight } = useWindowDimensions();
  const { index } = useLocalSearchParams<{ index: string }>();
  const indexNum = Math.max(0, parseInt(index ?? "0", 10) || 0);
  const { contrats } = useContrats();
  const { profil } = useProfil();
  const flatListRef = useRef<FlatList>(null);
  const [listHeight, setListHeight] = useState(0);
  const router = useRouter();
  const navigation = useNavigation();

  const BackButton = useCallback(
    () => (
      <Pressable onPress={() => router.navigate("/(tabs)/vue-mensuelle")} style={styles.backButton}>
        <Ionicons name="chevron-back" size={26} color={backIconColor} />
      </Pressable>
    ),
    [router]
  );

  useLayoutEffect(() => {
    navigation.setOptions({ headerLeft: BackButton });
  }, [navigation, BackButton]);

  const mois = useMemo(
    () => (profil ? calculerIndemnisationMensuelle(profil, contrats) : []),
    [profil, contrats]
  );

  useEffect(() => {
    if (flatListRef.current && mois.length > 0 && indexNum > 0) {
      flatListRef.current.scrollToIndex({ index: indexNum, animated: false });
    }
  }, [indexNum, mois.length]);

  if (!profil) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>Configurez votre profil</Text>
      </View>
    );
  }

  return (
    <FlatList
      ref={flatListRef}
      style={styles.flatList}
      onLayout={(e) => setListHeight(e.nativeEvent.layout.height)}
      data={mois}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      extraData={pageWidth}
      keyExtractor={(item) => String(item.index)}
      getItemLayout={(_, i) => ({
        length: pageWidth,
        offset: pageWidth * i,
        index: i,
      })}
      onScrollToIndexFailed={(info) => {
        flatListRef.current?.scrollToIndex({
          index: info.index,
          animated: false,
        });
      }}
      renderItem={({ item }) => <PageMois mois={item} width={pageWidth} height={listHeight || windowHeight} />}
    />
  );
}

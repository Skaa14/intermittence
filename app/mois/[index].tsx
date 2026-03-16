import {
  View,
  Text,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import { useMemo, useRef, useEffect } from "react";
import { useLocalSearchParams, Stack } from "expo-router";
import { useContrats } from "../../contexts/ContratsContext";
import { useProfil } from "../../contexts/ProfilContext";
import {
  calculerMoisIndemnisation,
  MoisIndemnisation,
} from "../../utils/calculerMoisIndemnisation";
import { styles } from "./[index].styles";
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const FALLBACK_WIDTH = 390;
const PAGE_WIDTH = SCREEN_WIDTH > 0 ? SCREEN_WIDTH : FALLBACK_WIDTH;

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

function PageMois({ mois }: { mois: MoisIndemnisation }) {
  return (
    <ScrollView
      style={{ width: PAGE_WIDTH }}
      contentContainerStyle={styles.pageContent}
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
          valeur={`${mois.joursTravailles} j`}
          testID={`jours-travailles-${mois.index}`}
        />
        {mois.delaiAttente > 0 && (
          <LigneDetail
            label="Délai d'attente"
            valeur={`${mois.delaiAttente} j`}
            testID={`delai-attente-${mois.index}`}
          />
        )}
        <LigneDetail
          label="Jours indemnisés"
          valeur={`${mois.joursIndemnises} j`}
          testID={`jours-indemnises-${mois.index}`}
        />
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
  const { index } = useLocalSearchParams<{ index: string }>();
  const indexNum = Math.max(0, parseInt(index ?? "0", 10) || 0);
  const { contrats } = useContrats();
  const { profil } = useProfil();
  const flatListRef = useRef<FlatList>(null);

  const mois = useMemo(
    () => (profil ? calculerMoisIndemnisation(profil, contrats) : []),
    [profil, contrats]
  );

  useEffect(() => {
    if (flatListRef.current && mois.length > 0 && indexNum > 0) {
      flatListRef.current.scrollToIndex({ index: indexNum, animated: false });
    }
  }, [indexNum, mois.length]);

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: "Détail du mois" }} />
      {!profil ? (
        <View style={styles.container}>
          <Text style={styles.empty}>Configurez votre profil</Text>
        </View>
      ) : (
        <FlatList
      ref={flatListRef}
      data={mois}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => String(item.index)}
      getItemLayout={(_, i) => ({
        length: PAGE_WIDTH,
        offset: PAGE_WIDTH * i,
        index: i,
      })}
      onScrollToIndexFailed={(info) => {
        flatListRef.current?.scrollToIndex({
          index: info.index,
          animated: false,
        });
      }}
      renderItem={({ item }) => <PageMois mois={item} />}
    />
      )}
    </>
  );
}


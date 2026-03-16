import {
  View,
  Text,
  FlatList,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useMemo, useRef, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { useContrats } from "../../../contexts/ContratsContext";
import { useProfil } from "../../../contexts/ProfilContext";
import {
  calculerMoisIndemnisation,
  MoisIndemnisation,
} from "../../../utils/calculerMoisIndemnisation";
import { styles, pageScrollStyle } from "./[index].styles";

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

function PageMois({ mois, width }: { mois: MoisIndemnisation; width: number }) {
  return (
    <ScrollView
      style={pageScrollStyle(width).page}
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
  const { width: pageWidth } = useWindowDimensions();
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
      renderItem={({ item }) => <PageMois mois={item} width={pageWidth} />}
    />
  );
}

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useMemo } from "react";
import { useRouter } from "expo-router";
import { useContrats } from "../../contexts/ContratsContext";
import { useProfil } from "../../contexts/ProfilContext";
import { useFormations } from "../../contexts/FormationsContext";
import {
  calculerIndemnisationMensuelle,
  IndemnisationMensuelle,
} from "../../utils/calculerIndemnisationMensuelle";
import { styles } from "../../styles/tabs/vue-mensuelle.styles";

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

function CarteMois({
  mois,
  onPress,
}: {
  mois: IndemnisationMensuelle;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      testID={`carte-mois-${mois.index}`}
      style={styles.carte}
      onPress={onPress}
    >
      <Text style={styles.carteTitre}>{formatMois(mois.mois)}</Text>
      <View style={styles.carteBody}>
        <View style={styles.ligne}>
          <Text style={styles.libelleValeur}>Heures travaillées</Text>
          <Text style={styles.valeur}>{mois.heuresDuMois} h</Text>
        </View>
        <View style={styles.ligne}>
          <Text style={styles.libelleValeur}>Jours de formation</Text>
          <Text style={styles.valeur}>{mois.joursFormation} j</Text>
        </View>
        <View style={styles.ligne}>
          <Text style={styles.libelleValeur}>Jours indemnisés</Text>
          <Text style={styles.valeur}>{mois.joursIndemnises} j</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function VueMensuelleScreen() {
  const { contrats } = useContrats();
  const { profil } = useProfil();
  const { formations } = useFormations();
  const router = useRouter();

  const mois = useMemo(
    () => (profil ? calculerIndemnisationMensuelle(profil, contrats, formations) : []),
    [profil, contrats, formations]
  );

  if (!profil) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty} testID="message-profil-manquant">
          Configurez votre profil pour voir la simulation
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={mois}
      keyExtractor={(item) => String(item.index)}
      contentContainerStyle={styles.liste}
      initialNumToRender={12}
      renderItem={({ item }) => (
        <CarteMois
          mois={item}
          onPress={() => router.push(`/mois/${item.index}` as any)}
        />
      )}
    />
  );
}


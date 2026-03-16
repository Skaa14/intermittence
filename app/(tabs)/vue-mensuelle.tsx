import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useMemo } from "react";
import { useRouter } from "expo-router";
import { useContrats } from "../../contexts/ContratsContext";
import { useProfil } from "../../contexts/ProfilContext";
import {
  calculerMoisIndemnisation,
  MoisIndemnisation,
} from "../../utils/calculerMoisIndemnisation";

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

const BADGE_STYLES: Record<
  MoisIndemnisation["etat"],
  { bg: string; text: string; label: string }
> = {
  passé: { bg: "#e2e8f0", text: "#475569", label: "Passé" },
  "en cours": { bg: "#dbeafe", text: "#1d4ed8", label: "En cours" },
  "à venir": { bg: "#dcfce7", text: "#15803d", label: "À venir" },
};

function BadgeEtat({ etat }: { etat: MoisIndemnisation["etat"] }) {
  const { bg, text, label } = BADGE_STYLES[etat];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color: text }]}>{label}</Text>
    </View>
  );
}

function CarteMois({
  mois,
  onPress,
}: {
  mois: MoisIndemnisation;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      testID={`carte-mois-${mois.index}`}
      style={styles.carte}
      onPress={onPress}
    >
      <View style={styles.carteHeader}>
        <Text style={styles.carteTitre}>{formatMois(mois.mois)}</Text>
        <BadgeEtat etat={mois.etat} />
      </View>
      <View style={styles.carteBody}>
        <View style={styles.ligne}>
          <Text style={styles.libelleValeur}>ARE versée</Text>
          <Text style={styles.valeur}>{formatEuros(mois.areVersee)}</Text>
        </View>
        <View style={styles.ligne}>
          <Text style={styles.libelleValeur}>Salaire brut</Text>
          <Text style={styles.valeur}>{formatEuros(mois.salaireDuMois)}</Text>
        </View>
        <View style={[styles.ligne, styles.ligneTotal]}>
          <Text style={styles.libelleTotal}>Total reçu</Text>
          <Text style={styles.valeurTotal}>{formatEuros(mois.totalRecu)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function VueMensuelleScreen() {
  const { contrats } = useContrats();
  const { profil } = useProfil();
  const router = useRouter();

  const mois = useMemo(
    () => (profil ? calculerMoisIndemnisation(profil, contrats) : []),
    [profil, contrats]
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
          onPress={() => router.push(`/mois/${item.index}`)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8fafc",
  },
  empty: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
  },
  liste: {
    padding: 16,
    backgroundColor: "#f8fafc",
    gap: 12,
  },
  carte: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  carteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  carteTitre: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  carteBody: {
    gap: 6,
  },
  ligne: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ligneTotal: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  libelleValeur: {
    fontSize: 14,
    color: "#64748b",
  },
  valeur: {
    fontSize: 14,
    color: "#1e293b",
  },
  libelleTotal: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  valeurTotal: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563eb",
  },
});

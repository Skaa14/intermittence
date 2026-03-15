import { View, Text, StyleSheet } from "react-native";
import { useContrats } from "../../contexts/ContratsContext";

export default function AccueilScreen() {
  const { contrats } = useContrats();

  const totalHeures = contrats.reduce((sum, c) => sum + c.heures, 0);
  const totalSalaire = contrats.reduce((sum, c) => sum + c.salaireBrut, 0);

  const progression = Math.min((totalHeures / 507) * 100, 100);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Intermittence</Text>
      <Text style={styles.subtitle}>Simulateur ARE</Text>

      {/* Progression vers les 507h */}
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
    </View>
  );
}

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
});

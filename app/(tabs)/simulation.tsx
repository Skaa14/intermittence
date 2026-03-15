import { View, Text, StyleSheet } from "react-native";

export default function SimulationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.empty}>Pas encore de simulation</Text>
      <Text style={styles.hint}>
        Ajoute des contrats d'abord pour lancer une simulation
      </Text>
    </View>
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
    fontSize: 18,
    color: "#1e293b",
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
});

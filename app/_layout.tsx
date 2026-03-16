import { Stack } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { ContratsProvider } from "../contexts/ContratsContext";
import { ProfilProvider } from "../contexts/ProfilContext";
import { DonneesTestProvider, useDonneesTest } from "../contexts/DonneesTestContext";

function BannerModeTest() {
  const { nomProfil, reinitialiser } = useDonneesTest();

  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>Mode démo — {nomProfil}</Text>
      <Pressable style={styles.bannerBtn} onPress={reinitialiser}>
        <Text style={styles.bannerBtnText}>Réinitialiser</Text>
      </Pressable>
    </View>
  );
}

function AppContent() {
  const { modeTest } = useDonneesTest();

  return (
    <View style={styles.container}>
      {modeTest && <BannerModeTest />}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ProfilProvider>
      <ContratsProvider>
        <DonneesTestProvider>
          <AppContent />
        </DonneesTestProvider>
      </ContratsProvider>
    </ProfilProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    backgroundColor: "#f59e0b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingTop: 48,
  },
  bannerText: {
    color: "#1c1917",
    fontWeight: "600",
    fontSize: 13,
    flex: 1,
  },
  bannerBtn: {
    backgroundColor: "#1c1917",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  bannerBtnText: {
    color: "#fef3c7",
    fontWeight: "bold",
    fontSize: 12,
  },
});

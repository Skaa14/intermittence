import { Stack } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { ContratsProvider } from "../contexts/ContratsContext";
import { ProfilProvider } from "../contexts/ProfilContext";
import { DonneesTestProvider, useDonneesTest } from "../contexts/DonneesTestContext";
import { styles } from "./_layout.styles";

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


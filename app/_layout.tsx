import { Stack } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { ContratsProvider } from "../contexts/ContratsContext";
import { ProfilProvider } from "../contexts/ProfilContext";
import { DonneesTestProvider, useDonneesTest } from "../contexts/DonneesTestContext";
import { styles } from "./_layout.styles";

SplashScreen.preventAutoHideAsync();

function BannerModeTest() {
  const { nomProfil, reinitialiser } = useDonneesTest();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bannerWrapper, { paddingTop: insets.top + 8 }]}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Mode démo — {nomProfil}</Text>
        <Pressable style={styles.bannerBtn} onPress={reinitialiser}>
          <Text style={styles.bannerBtnText}>Réinitialiser</Text>
        </Pressable>
      </View>
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
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

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


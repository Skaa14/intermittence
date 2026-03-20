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
import { colors } from "../theme/colors";
import { ContratsProvider } from "../contexts/ContratsContext";
import { FormationsProvider } from "../contexts/FormationsContext";
import { EnseignementsProvider } from "../contexts/EnseignementsContext";
import { DonneesTestProvider, useDonneesTest } from "../contexts/DonneesTestContext";
import { ProfilsProvider, useProfils } from "../contexts/ProfilsContext";
import { ErrorBoundary } from "../components/ErrorBoundary";
import EcranOnboarding from "../components/EcranOnboarding";
import { styles } from "../styles/root-layout.styles";

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
  const { profils, chargementTermine } = useProfils();

  if (!chargementTermine) return null;

  if (profils.length === 0) {
    return <EcranOnboarding />;
  }

  return (
    <View style={styles.container}>
      {modeTest && <BannerModeTest />}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="mois/[moisIndex]"
          options={{
            headerShown: true,
            title: "Détail du mois",
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.textOnPrimary,
          }}
        />
        <Stack.Screen
          name="detail-calcul-aj"
          options={{
            headerShown: true,
            title: "Détail du calcul AJ",
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.textOnPrimary,
          }}
        />
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
    <ErrorBoundary>
      <ProfilsProvider>
        <ContratsProvider>
          <FormationsProvider>
            <EnseignementsProvider>
              <DonneesTestProvider>
                <AppContent />
              </DonneesTestProvider>
            </EnseignementsProvider>
          </FormationsProvider>
        </ContratsProvider>
      </ProfilsProvider>
    </ErrorBoundary>
  );
}


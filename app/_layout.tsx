import { Stack } from "expo-router";
import { View } from "react-native";
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
import { ProfilsProvider, useProfils } from "../contexts/ProfilsContext";
import { ErrorBoundary } from "../components/ErrorBoundary";
import EcranOnboarding from "../components/EcranOnboarding";
import { styles } from "../styles/root-layout.styles";

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { profils, chargementTermine } = useProfils();

  if (!chargementTermine) return null;

  if (profils.length === 0) {
    return <EcranOnboarding />;
  }

  return (
    <View style={styles.container}>
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
              <AppContent />
            </EnseignementsProvider>
          </FormationsProvider>
        </ContratsProvider>
      </ProfilsProvider>
    </ErrorBoundary>
  );
}


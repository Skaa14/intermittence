import { Stack } from "expo-router";
import { ContratsProvider } from "../contexts/ContratsContext";
import { ProfilProvider } from "../contexts/ProfilContext";

export default function RootLayout() {
  return (
    <ProfilProvider>
      <ContratsProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </ContratsProvider>
    </ProfilProvider>
  );
}

import { Stack } from "expo-router";
import { ContratsProvider } from "../contexts/ContratsContext";

export default function RootLayout() {
  return (
    <ContratsProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ContratsProvider>
  );
}

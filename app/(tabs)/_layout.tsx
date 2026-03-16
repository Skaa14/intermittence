import { Tabs } from "expo-router";
import { colors } from "../../theme/colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.textOnPrimary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarLabel: "Accueil",
        }}
      />
      <Tabs.Screen
        name="contrats"
        options={{
          title: "Contrats",
          tabBarLabel: "Contrats",
        }}
      />
      <Tabs.Screen
        name="vue-mensuelle"
        options={{
          title: "Vue mensuelle",
          tabBarLabel: "Vue mensuelle",
        }}
      />
    </Tabs>
  );
}

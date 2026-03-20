import { useState } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Pressable } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../theme/colors";
import { styles } from "../../styles/tabs/layout.styles";
import BoutonProfil from "../../components/BoutonProfil";
import PanneauProfils from "../../components/PanneauProfils";

const TAB_ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  index: { active: "home", inactive: "home-outline" },
  contrats: { active: "document-text", inactive: "document-text-outline" },
  "vue-mensuelle": { active: "calendar", inactive: "calendar-outline" },
};

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const visibleRoutes = state.routes.filter((r) => TAB_ICONS[r.name]);

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom }]}>
      {visibleRoutes.map((route) => {
        const isActive = state.routes[state.index].name === route.name;
        const icons = TAB_ICONS[route.name];
        const color = isActive ? colors.primary : colors.textMuted;

        return (
          <Pressable
            key={route.name}
            style={styles.tabItem}
            onPress={() => navigation.navigate(route.name)}
          >
            <Ionicons name={isActive ? icons.active : icons.inactive} size={24} color={color} />
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  const [panneauOuvert, setPanneauOuvert] = useState(false);

  return (
    <View style={styles.conteneur}>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.textOnPrimary,
          headerRight: () => (
            <BoutonProfil onPress={() => setPanneauOuvert(true)} />
          ),
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Simulateur ARE" }} />
        <Tabs.Screen name="contrats" options={{ title: "Contrats" }} />
        <Tabs.Screen name="vue-mensuelle" options={{ title: "Vue mensuelle" }} />
      </Tabs>
      <PanneauProfils
        visible={panneauOuvert}
        onFermer={() => setPanneauOuvert(false)}
      />
    </View>
  );
}

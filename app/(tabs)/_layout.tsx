import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Pressable } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { colors } from "../../theme/colors";
import { styles } from "./_layout.styles";

const TAB_ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  index: { active: "home", inactive: "home-outline" },
  contrats: { active: "document-text", inactive: "document-text-outline" },
  "vue-mensuelle": { active: "calendar", inactive: "calendar-outline" },
};

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const visibleRoutes = state.routes.filter((r) => TAB_ICONS[r.name]);

  return (
    <View style={styles.tabBar}>
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
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.textOnPrimary,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Simulateur ARE" }} />
      <Tabs.Screen name="contrats" options={{ title: "Contrats" }} />
      <Tabs.Screen name="vue-mensuelle" options={{ title: "Vue mensuelle" }} />
    </Tabs>
  );
}

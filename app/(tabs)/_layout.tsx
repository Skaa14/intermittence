import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2563eb",
        headerStyle: { backgroundColor: "#2563eb" },
        headerTintColor: "#fff",
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

import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useProfils } from "../contexts/ProfilsContext";
import FormulaireProfil from "./FormulaireProfil";
import { styles } from "../styles/components/ecran-onboarding.styles";

export default function EcranOnboarding() {
  const { ajouterProfil } = useProfils();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <Text style={styles.titre}>Bienvenue !</Text>
      <Text style={styles.sousTitre}>
        Crée ton premier profil pour commencer à simuler tes droits ARE.
      </Text>
      <ScrollView keyboardShouldPersistTaps="handled">
        <FormulaireProfil onValider={ajouterProfil} />
      </ScrollView>
    </View>
  );
}
